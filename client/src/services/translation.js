import { useStore } from '../store';

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
];

class TranslationService {
  constructor() {
    this.apiKey = process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY;
    this.cache = new Map();
  }

  getCacheKey(text, targetLang) {
    return `${text}:${targetLang}`;
  }

  async translate(text, targetLang) {
    if (!text || !targetLang) return text;

    const cacheKey = this.getCacheKey(text, targetLang);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            target: targetLang,
          }),
        }
      );

      const data = await response.json();
      const translatedText = data.data.translations[0].translatedText;
      
      this.cache.set(cacheKey, translatedText);
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }

  async detectLanguage(text) {
    if (!text) return 'en';

    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2/detect?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
          }),
        }
      );

      const data = await response.json();
      return data.data.detections[0][0].language;
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en';
    }
  }
}

export const translationService = new TranslationService();
export { SUPPORTED_LANGUAGES }; 