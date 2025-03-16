import axios from 'axios';

// Token de la API de Finnhub (deberías guardarlo en una variable de entorno)
const FINNHUB_API_TOKEN = 'cuhqno9r01qk32qa2ce0cuhqno9r01qk32qa2ceg';

// Middleware para obtener todos los índices de la API de Finnhub
const getIndices = async (req, res) => {
  try {
    const symbol = req.query.symbol;

    // Validar que el parámetro "symbol" esté presente
    if (!symbol) {
      return res.status(400).json({ error: 'El parámetro "symbol" es obligatorio' });
    }

    // Construir la URL de la API de Finnhub con el token
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_TOKEN}`;

    // Hacer la solicitud a la API de Finnhub
    const response = await axios.get(url);

    console.log(`Consultando Finnhub para el símbolo: ${symbol}`);

    // Enviar la respuesta de la API de Finnhub al cliente
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error al obtener los índices:', error);

    // Manejar errores de la API de Finnhub
    if (error.response) {
      // Si la API de Finnhub devuelve un error
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      // Si hay un error en el servidor (por ejemplo, problemas de red)
      res.status(500).json({ error: 'Error al obtener los índices' });
    }
  }
};

export { getIndices };