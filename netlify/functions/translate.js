const axios = require('axios');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: 'Method Not Allowed',
      headers: { 'Access-Control-Allow-Origin': '*' } // CORS aquí también
    };
  }

  try {
    const { text, targetLang } = JSON.parse(event.body);
    
    const response = await axios({
      method: 'POST',
      url: 'https://api-free.deepl.com/v2/translate',
      headers: {
        'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded', // Modificado
      },
      data: new URLSearchParams({ // Cuerpo en formato correcto
        text: text,
        target_lang: targetLang.toLowerCase()
      }).toString()
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // CORS añadido
      },
      body: JSON.stringify({
        translations: [{
          text: response.data.translations[0].text
        }]
      }),
    };
  } catch (error) {
    console.error('Translation error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // CORS en errores
      },
      body: JSON.stringify({ 
        error: error.message,
        details: error.response?.data || 'No additional details'
      }),
    };
  }
};