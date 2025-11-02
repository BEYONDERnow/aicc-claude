/**
 * AI Compliance Checker - NER Detector
 * Verwendet Transformer.js für lokale Named Entity Recognition
 *
 * Version 2.0.0 - Intelligente Namenserkennung ohne Blacklist/Lexicon
 */

import { pipeline, env } from '@xenova/transformers';

// Konfiguration: Models werden lokal gecached
env.allowLocalModels = true;
env.allowRemoteModels = true;

// WASM-Pfad für Chrome Extension
// Die WASM-Dateien werden von Rollup nach extension/dist/ kopiert
env.backends.onnx.wasm.wasmPaths = chrome.runtime.getURL('dist/');

export class NERDetector {
  constructor() {
    this.nerReady = false;
    this.nerPromise = null;
    this.ner = null;
    this.cache = new Map();
    this.maxCacheSize = 100;
    this.nerDisabled = false; // Flag für permanente Deaktivierung bei Fehler
    this.nerEnabled = false; // Feature standardmäßig deaktiviert (wegen WASM-Problemen)
    this.errorLogged = false; // Verhindert mehrfache Error-Logs

    // Prüfe Storage-Einstellung (optional)
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.get(['nerEnabled'], (result) => {
        this.nerEnabled = result.nerEnabled === true;
        if (this.nerEnabled) {
          console.log('[AI Compliance NER] Feature aktiviert - Models werden lazy geladen');
        }
      });
    }
  }

  /**
   * Initialisiert das NER-Model (lazy loading)
   * Wird beim ersten Aufruf automatisch geladen
   */
  async initNER() {
    // Prüfe ob NER aktiviert ist
    if (!this.nerEnabled) {
      if (!this.errorLogged) {
        this.errorLogged = true;
        // Stille Info-Meldung, keine Errors
      }
      this.nerDisabled = true;
      return false;
    }

    // Prüfe ob NER bereits dauerhaft deaktiviert wurde
    if (this.nerDisabled) {
      return false;
    }

    if (this.nerReady) return true;

    if (!this.nerPromise) {
      try {
        // Xenova/bert-base-NER: Mehrsprachig (DE/EN/FR/IT), ~40MB
        this.nerPromise = pipeline(
          'token-classification',
          'Xenova/bert-base-NER',
          {
            quantized: true,
            progress_callback: (progress) => {
              // Stille Progress-Updates (keine Console-Logs)
              if (progress.status === 'downloading' && progress.total > 0) {
                // Optional: Progress könnte in UI angezeigt werden
              }
            }
          }
        );

        this.ner = await this.nerPromise;
        this.nerReady = true;
        return true;
      } catch (error) {
        // Silent fail - keine Console-Errors für Chrome Store
        if (!this.errorLogged) {
          this.errorLogged = true;
          // NER wird permanent deaktiviert, Extension funktioniert mit Regex
        }
        this.nerDisabled = true;
        this.nerPromise = null;
        return false;
      }
    } else {
      try {
        // Warten auf bereits laufendes Laden
        this.ner = await this.nerPromise;
        this.nerReady = true;
        return true;
      } catch (error) {
        this.nerDisabled = true;
        return false;
      }
    }
  }

  /**
   * Erkennt Namen (PERSON entities) im Text
   *
   * @param {string} text - Der zu analysierende Text
   * @returns {Promise<Array>} - Array von erkannten Namen mit Positionen
   */
  async detectNames(text) {
    if (!text || text.trim().length === 0) return [];

    // Früher Return wenn NER deaktiviert (silent fail)
    if (this.nerDisabled) return [];

    // Cache-Check
    const cacheKey = `names:${text}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Stelle sicher dass Model geladen ist
      const initialized = await this.initNER();
      if (!initialized || !this.nerReady) {
        return []; // Silent fail, kein Error
      }

      // NER ausführen
      const result = await this.ner(text, {
        aggregation_strategy: 'simple' // Gruppiert Tokens zu vollständigen Wörtern
      });

      // Extrahiere nur PERSON entities
      const persons = result
        .filter(entity => {
          // BERT-NER nutzt verschiedene Labels: PER, B-PER, I-PER
          const label = entity.entity_group || entity.entity;
          return label === 'PER' || label.startsWith('B-PER') || label.startsWith('I-PER');
        })
        .map(entity => ({
          text: entity.word.trim(),
          start: entity.start,
          end: entity.end,
          score: entity.score
        }))
        .filter(p => p.score > 0.6); // Confidence-Threshold gesenkt für bessere Erkennung von Namen-Listen

      // Cache speichern (mit Limit)
      this.addToCache(cacheKey, persons);

      return persons;
    } catch (error) {
      // Silent fail - keine Console-Errors
      this.nerDisabled = true;
      return []; // Leeres Array bei Fehler (Fallback zu Regex)
    }
  }

  /**
   * Erkennt Daten (DATE entities) im Text
   * Wichtig für PLZ vs. Jahrgang-Unterscheidung
   *
   * @param {string} text - Der zu analysierende Text
   * @returns {Promise<Array>} - Array von erkannten Daten
   */
  async detectDates(text) {
    if (!text || text.trim().length === 0) return [];
    if (this.nerDisabled) return [];

    // Cache-Check
    const cacheKey = `dates:${text}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const initialized = await this.initNER();
      if (!initialized || !this.nerReady) {
        return [];
      }

      const result = await this.ner(text, {
        aggregation_strategy: 'simple'
      });

      // Extrahiere DATE entities
      const dates = result
        .filter(entity => {
          const label = entity.entity_group || entity.entity;
          return label === 'DATE' || label.startsWith('B-DATE') || label.startsWith('I-DATE');
        })
        .map(entity => ({
          text: entity.word.trim(),
          start: entity.start,
          end: entity.end,
          score: entity.score
        }))
        .filter(d => d.score > 0.6);

      this.addToCache(cacheKey, dates);

      return dates;
    } catch (error) {
      this.nerDisabled = true;
      return [];
    }
  }

  /**
   * Erkennt Orte (LOCATION entities) im Text
   * Hilfreich für PLZ-Validierung (z.B. "8000 Zürich")
   *
   * @param {string} text - Der zu analysierende Text
   * @returns {Promise<Array>} - Array von erkannten Orten
   */
  async detectLocations(text) {
    if (!text || text.trim().length === 0) return [];
    if (this.nerDisabled) return [];

    const cacheKey = `locations:${text}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const initialized = await this.initNER();
      if (!initialized || !this.nerReady) {
        return [];
      }

      const result = await this.ner(text, {
        aggregation_strategy: 'simple'
      });

      // Extrahiere LOCATION entities
      const locations = result
        .filter(entity => {
          const label = entity.entity_group || entity.entity;
          return label === 'LOC' || label.startsWith('B-LOC') || label.startsWith('I-LOC');
        })
        .map(entity => ({
          text: entity.word.trim(),
          start: entity.start,
          end: entity.end,
          score: entity.score
        }))
        .filter(l => l.score > 0.6);

      this.addToCache(cacheKey, locations);

      return locations;
    } catch (error) {
      this.nerDisabled = true;
      return [];
    }
  }

  /**
   * Vollständige Entity-Erkennung (alle Typen auf einmal)
   * Effizienter als einzelne Calls
   *
   * @param {string} text - Der zu analysierende Text
   * @returns {Promise<Object>} - Object mit persons, dates, locations
   */
  async detectAll(text) {
    if (!text || text.trim().length === 0) {
      return { persons: [], dates: [], locations: [] };
    }

    if (this.nerDisabled) {
      return { persons: [], dates: [], locations: [] };
    }

    const cacheKey = `all:${text}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const initialized = await this.initNER();
      if (!initialized || !this.nerReady) {
        return { persons: [], dates: [], locations: [] };
      }

      const result = await this.ner(text, {
        aggregation_strategy: 'simple'
      });

      const entities = {
        persons: [],
        dates: [],
        locations: []
      };

      result.forEach(entity => {
        const label = entity.entity_group || entity.entity;
        const item = {
          text: entity.word.trim(),
          start: entity.start,
          end: entity.end,
          score: entity.score
        };

        if ((label === 'PER' || label.startsWith('B-PER') || label.startsWith('I-PER')) && item.score > 0.6) {
          entities.persons.push(item);
        } else if ((label === 'DATE' || label.startsWith('B-DATE') || label.startsWith('I-DATE')) && item.score > 0.6) {
          entities.dates.push(item);
        } else if ((label === 'LOC' || label.startsWith('B-LOC') || label.startsWith('I-LOC')) && item.score > 0.6) {
          entities.locations.push(item);
        }
      });

      this.addToCache(cacheKey, entities);

      return entities;
    } catch (error) {
      this.nerDisabled = true;
      return { persons: [], dates: [], locations: [] };
    }
  }

  /**
   * Cache-Management mit Größen-Limit
   */
  addToCache(key, value) {
    // Wenn Cache zu groß, älteste Einträge löschen
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }

  /**
   * Cache leeren (z.B. bei Memory-Druck)
   */
  clearCache() {
    this.cache.clear();
    console.log('[AI Compliance NER] Cache geleert');
  }

  /**
   * Prüft ob NER verfügbar ist (für Fallback-Logik)
   */
  isAvailable() {
    return this.nerReady;
  }
}
