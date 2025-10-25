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

    console.log('[AI Compliance NER] Initialisiert - Models werden lazy geladen');
  }

  /**
   * Initialisiert das NER-Model (lazy loading)
   * Wird beim ersten Aufruf automatisch geladen
   */
  async initNER() {
    if (this.nerReady) return;

    if (!this.nerPromise) {
      console.log('[AI Compliance NER] Lade Model (einmalig, wird gecached)...');

      try {
        // Xenova/bert-base-NER: Mehrsprachig (DE/EN/FR/IT), ~40MB
        this.nerPromise = pipeline(
          'token-classification',
          'Xenova/bert-base-NER',
          {
            quantized: true, // Kleinere Größe, etwas schneller
            progress_callback: (progress) => {
              if (progress.status === 'downloading') {
                if (progress.total && progress.total > 0) {
                  // Content-Length verfügbar - zeige Prozent
                  const percent = Math.round((progress.loaded / progress.total) * 100);
                  console.log(`[AI Compliance NER] Download: ${percent}%`);
                } else {
                  // Kein Content-Length - zeige nur geladene Bytes
                  const mb = (progress.loaded / 1024 / 1024).toFixed(1);
                  console.log(`[AI Compliance NER] Download: ${mb} MB geladen...`);
                }
              }
            }
          }
        );

        this.ner = await this.nerPromise;
        this.nerReady = true;

        console.log('[AI Compliance NER] ✅ Model geladen und bereit!');
      } catch (error) {
        console.error('[AI Compliance NER] ❌ Fehler beim Laden:', error);
        this.nerPromise = null;
        throw error;
      }
    } else {
      // Warten auf bereits laufendes Laden
      this.ner = await this.nerPromise;
      this.nerReady = true;
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

    // Cache-Check
    const cacheKey = `names:${text}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Stelle sicher dass Model geladen ist
      if (!this.nerReady) {
        await this.initNER();
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

      console.log(`[AI Compliance NER] Namen erkannt: ${persons.length}`, persons.map(p => p.text));

      return persons;
    } catch (error) {
      console.error('[AI Compliance NER] Fehler bei Namenserkennung:', error);
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

    // Cache-Check
    const cacheKey = `dates:${text}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      if (!this.nerReady) {
        await this.initNER();
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
        .filter(d => d.score > 0.6); // Etwas niedrigerer Threshold für Daten

      this.addToCache(cacheKey, dates);

      console.log(`[AI Compliance NER] Daten erkannt: ${dates.length}`, dates.map(d => d.text));

      return dates;
    } catch (error) {
      console.error('[AI Compliance NER] Fehler bei Datums-Erkennung:', error);
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

    const cacheKey = `locations:${text}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      if (!this.nerReady) {
        await this.initNER();
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
      console.error('[AI Compliance NER] Fehler bei Orts-Erkennung:', error);
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

    const cacheKey = `all:${text}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      if (!this.nerReady) {
        await this.initNER();
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

      console.log('[AI Compliance NER] Alle Entities:', {
        persons: entities.persons.length,
        dates: entities.dates.length,
        locations: entities.locations.length
      });

      return entities;
    } catch (error) {
      console.error('[AI Compliance NER] Fehler bei Entity-Erkennung:', error);
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
