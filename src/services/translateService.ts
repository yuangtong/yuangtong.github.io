// Remove these as we'll use the Netlify function instead
// const DEEPL_API_KEY = import.meta.env.VITE_DEEPL_API_KEY;
// const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';
// const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

export type TargetLanguageCode = 'en' | 'es' | 'zh';

export async function translateText(text: string, targetLang: TargetLanguageCode) {
  try {
    // Change from '/api/translate' to '/.netlify/functions/translate'
    const response = await fetch('/.netlify/functions/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLang,
      }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Translation failed: ${response.statusText}`);
    }
  
    const data = await response.json();
    if (!data.translations?.[0]?.text) {
      throw new Error('Invalid response format from translation service');
    }
    
    return data.translations[0].text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}