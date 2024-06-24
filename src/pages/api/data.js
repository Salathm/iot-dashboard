let dataStore = []; // Stockage en mémoire des données reçues

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { temperature, humidity } = req.body;
    console.log(`Received data: Temperature - ${temperature}, Humidity - ${humidity}`);
    const timestamp = new Date().toISOString();
    dataStore.push({ temperature, humidity, timestamp });
    res.status(200).json({ status: 'success' });
  } else if (req.method === 'GET') {
    res.status(200).json(dataStore);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
