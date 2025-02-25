const DEEPL_API_KEY = import.meta.env.VITE_DEEPL_API_KEY;
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

export type TargetLanguageCode = 'EN' | 'ES' | 'ZH';

export async function translateText(text: string, targetLang: TargetLanguageCode) {
  try {
    const response = await fetch(CORS_PROXY + DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json',
        'Origin': window.location.origin,
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang,
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}