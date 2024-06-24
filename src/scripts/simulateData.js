const axios = require('axios');

// Fonction pour générer des données aléatoires
function generateData() {
  const temperature = (Math.random() * (30 - 15) + 15).toFixed(2); // Température entre 15 et 30 degrés Celsius
  const humidity = (Math.random() * (70 - 30) + 30).toFixed(2);     // Humidité entre 30% et 70%
  return { temperature, humidity };
}

// Fonction pour envoyer des données à l'API
async function sendData() {
  const url = 'http://localhost:3000/api/data';
  const data = generateData();
  try {
    const response = await axios.post(url, data);
    console.log(`Sent data: ${JSON.stringify(data)}, Response: ${JSON.stringify(response.data)}`);
  } catch (error) {
    console.error(`Error sending data: ${error}`);
  }
}

// Compteur pour garder une trace du nombre de fois que sendData a été appelé
let count = 0;

// Interval pour appeler sendData toutes les minutes pendant cinq minutes
const intervalId = setInterval(() => {
  if (count < 5) {
    sendData();
    count += 1;
  } else {
    clearInterval(intervalId);
    fetchAndDisplayData();
  }
}, 60000);

// Fonction pour récupérer et afficher les données depuis l'API
async function fetchAndDisplayData() {
  try {
    const response = await axios.get('http://localhost:3000/api/data');
    const data = response.data;
    console.log('Data from API:', data);
    calculateStatistics(data); // Appeler la fonction pour calculer les statistiques
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Fonction pour calculer les statistiques (min, max, moyenne)
function calculateStatistics(data) {
  if (data.length === 0) {
    console.log('Aucune donnée à traiter.');
    return;
  }

  // Initialiser les valeurs minimales et maximales
  let minTemperature = Infinity;
  let maxTemperature = -Infinity;
  let totalTemperature = 0;

  let minHumidity = Infinity;
  let maxHumidity = -Infinity;
  let totalHumidity = 0;

  data.forEach(({ temperature, humidity }) => {
    temperature = parseFloat(temperature);
    humidity = parseFloat(humidity);

    // Calcul pour la température
    if (temperature < minTemperature) {
      minTemperature = temperature;
    }
    if (temperature > maxTemperature) {
      maxTemperature = temperature;
    }
    totalTemperature += temperature;

    // Calcul pour l'humidité
    if (humidity < minHumidity) {
      minHumidity = humidity;
    }
    if (humidity > maxHumidity) {
      maxHumidity = humidity;
    }
    totalHumidity += humidity;
  });

  // Calcul des moyennes
  const averageTemperature = totalTemperature / data.length;
  const averageHumidity = totalHumidity / data.length;

  // Affichage des résultats
  console.log('Statistiques après 5 minutes :');
  console.log(`Température - Min: ${minTemperature.toFixed(2)}°C, Max: ${maxTemperature.toFixed(2)}°C, Moyenne: ${averageTemperature.toFixed(2)}°C`);
  console.log(`Humidité - Min: ${minHumidity.toFixed(2)}%, Max: ${maxHumidity.toFixed(2)}%, Moyenne: ${averageHumidity.toFixed(2)}%`);
}

// Envoyer des données immédiatement au démarrage
sendData();
count += 1;


