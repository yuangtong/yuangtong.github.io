const axios = require('axios');

exports.handler = async function(event, context) {
  // Manejar preflight CORS OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: 'Method Not Allowed',
      headers: { 'Access-Control-Allow-Origin': '*' }
    };
  }

  try {
    const { text, targetLang } = JSON.parse(event.body);
    
    // Verificar que la API key existe
    if (!process.env.DEEPL_API_KEY) {
      console.error('Missing DeepL API key');
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Configuration error: Missing API key' })
      };
    }
    
    console.log(`Translating text to ${targetLang}`);
    
    // Asegurarse de que targetLang esté en el formato correcto (mayúsculas)
    const formattedLang = targetLang.toUpperCase();
    
    const response = await axios({
      method: 'POST',
      url: 'https://api-free.deepl.com/v2/translate',
      headers: {
        'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        text: [text],
        target_lang: formattedLang
      }
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        translations: [{
          text: response.data.translations[0].text
        }]
      }),
    };
  } catch (error) {
    console.error('Translation error:', error.message);
    // Registrar más detalles del error para depuración
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: error.message,
        details: error.response?.data || 'No additional details'
      }),
    };
  }
};