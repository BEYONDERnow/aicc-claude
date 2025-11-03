/**
 * Screenshot Capture Service
 * Captured Screenshots für Feedback
 *
 * WICHTIG: Screenshots werden via Service Worker (background.js) erstellt,
 * da Content Scripts keinen direkten Zugriff auf chrome.tabs.captureVisibleTab haben.
 *
 * NICHT-BLOCKIEREND: Fehler in diesem Service dürfen nicht die Haupt-Extension blockieren
 */

class ScreenshotCapture {
  constructor() {
    this.maxSize = 2 * 1024 * 1024; // 2MB max für GitHub Issues
    this.quality = 0.8; // JPEG Quality (80%)
    this.maxWidth = 1920; // Max Breite für Compression
  }

  /**
   * Captured Screenshot des aktuellen Tabs
   *
   * @returns {Promise<string>} Base64 data URL
   */
  async captureTab() {
    try {
      // Test Connection zum Service Worker
      await this.testConnection();

      // Message an Service Worker senden
      const response = await chrome.runtime.sendMessage({
        action: 'captureScreenshot'
      });

      if (!response || !response.success) {
        throw new Error(response?.error || 'Screenshot konnte nicht erstellt werden');
      }

      // Screenshot komprimieren falls zu gross
      const compressed = await this.compressIfNeeded(response.dataUrl);

      return compressed;

    } catch (error) {
      console.error('[Screenshot Capture] Error:', error);
      // Benutzerfreundliche Fehlermeldung
      if (error.message.includes('Could not establish connection')) {
        throw new Error('Service Worker nicht aktiv. Bitte lade die Extension neu.');
      }
      throw error;
    }
  }

  /**
   * Testet Verbindung zum Service Worker
   */
  async testConnection() {
    try {
      const response = await Promise.race([
        chrome.runtime.sendMessage({ action: 'testConnection' }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 2000)
        )
      ]);

      if (!response || !response.success) {
        throw new Error('Service Worker antwortet nicht');
      }
    } catch (error) {
      console.error('[Screenshot Capture] Connection test failed:', error);
      throw new Error('Could not establish connection. Receiving end does not exist.');
    }
  }

  /**
   * Komprimiert Screenshot falls über maxSize
   *
   * @param {string} dataUrl - Base64 data URL
   * @returns {Promise<string>} Komprimierter data URL
   */
  async compressIfNeeded(dataUrl) {
    const size = this.getBase64Size(dataUrl);

    if (size <= this.maxSize) {
      return dataUrl;
    }

    console.log(`[Screenshot Capture] Compressing... (${(size / 1024 / 1024).toFixed(2)}MB > ${this.maxSize / 1024 / 1024}MB)`);

    return await this.compress(dataUrl);
  }

  /**
   * Komprimiert ein Bild
   *
   * @param {string} dataUrl
   * @returns {Promise<string>}
   */
  async compress(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        try {
          // Canvas erstellen
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Neue Dimensionen berechnen (max width erhalten)
          let { width, height } = img;
          if (width > this.maxWidth) {
            height = (height * this.maxWidth) / width;
            width = this.maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          // Bild auf Canvas zeichnen
          ctx.drawImage(img, 0, 0, width, height);

          // Als JPEG mit Quality komprimieren
          const compressed = canvas.toDataURL('image/jpeg', this.quality);

          const originalSize = this.getBase64Size(dataUrl);
          const compressedSize = this.getBase64Size(compressed);

          console.log(`[Screenshot Capture] Compressed: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(compressedSize / 1024 / 1024).toFixed(2)}MB`);

          resolve(compressed);

        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = dataUrl;
    });
  }

  /**
   * Optional: Blur-Effekt auf bestimmte Bereiche anwenden
   *
   * @param {string} dataUrl
   * @param {Array<Object>} regions - Array of {x, y, width, height}
   * @returns {Promise<string>}
   */
  async applyBlur(dataUrl, regions = []) {
    if (regions.length === 0) {
      return dataUrl;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          canvas.width = img.width;
          canvas.height = img.height;

          // Originalbild zeichnen
          ctx.drawImage(img, 0, 0);

          // Blur-Filter auf regions anwenden
          regions.forEach(region => {
            ctx.filter = 'blur(20px)';
            ctx.drawImage(
              canvas,
              region.x,
              region.y,
              region.width,
              region.height,
              region.x,
              region.y,
              region.width,
              region.height
            );
            ctx.filter = 'none';
          });

          resolve(canvas.toDataURL('image/png'));

        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image for blur'));
      img.src = dataUrl;
    });
  }

  /**
   * Berechnet Groesse eines Base64 Strings in Bytes
   *
   * @param {string} base64String
   * @returns {number} Bytes
   */
  getBase64Size(base64String) {
    const base64 = base64String.split(',')[1] || base64String;
    const padding = (base64.match(/=/g) || []).length;
    return (base64.length * 3) / 4 - padding;
  }

  /**
   * Konvertiert Data URL zu Blob
   *
   * @param {string} dataUrl
   * @returns {Blob}
   */
  dataUrlToBlob(dataUrl) {
    const parts = dataUrl.split(',');
    const mime = parts[0].match(/:(.*?);/)[1];
    const binary = atob(parts[1]);
    const array = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }

    return new Blob([array], { type: mime });
  }

  /**
   * Test-Funktion
   */
  async test() {
    try {
      console.log('[Screenshot Capture] Testing...');
      const screenshot = await this.captureTab();
      const size = this.getBase64Size(screenshot);
      console.log(`[Screenshot Capture] Success! Size: ${(size / 1024).toFixed(2)}KB`);
      return { success: true, size };
    } catch (error) {
      console.error('[Screenshot Capture] Test failed:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export für Content Script (mit Fehlerbehandlung)
try {
  if (typeof window !== 'undefined') {
    window.ScreenshotCapture = ScreenshotCapture;
  }
} catch (error) {
  console.error('[Screenshot Capture] Export error (non-blocking):', error);
}
