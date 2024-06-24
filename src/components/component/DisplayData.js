"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ResponsiveLine } from '@nivo/line';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faThermometerHalf, faTint } from '@fortawesome/free-solid-svg-icons';

export default function DisplayData() {
  const [data, setData] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [averages, setAverages] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/data');
        const data = response.data;
        setData(data);
        calculateStatistics(data);
        calculateAverages(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const calculateStatistics = (data) => {
    if (data.length === 0) {
      console.log('Aucune donnée à traiter.');
      return;
    }

    let minTemperature = Infinity;
    let maxTemperature = -Infinity;
    let minHumidity = Infinity;
    let maxHumidity = -Infinity;

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

      // Calcul pour l'humidité
      if (humidity < minHumidity) {
        minHumidity = humidity;
      }
      if (humidity > maxHumidity) {
        maxHumidity = humidity;
      }
    });

    setStatistics({
      minTemperature: minTemperature.toFixed(2),
      maxTemperature: maxTemperature.toFixed(2),
      minHumidity: minHumidity.toFixed(2),
      maxHumidity: maxHumidity.toFixed(2),
    });
  };

  const calculateAverages = (data) => {
    if (data.length === 0) {
      console.log('Aucune donnée à traiter.');
      return;
    }

    const avgTemperature = data.reduce((sum, entry) => sum + parseFloat(entry.temperature), 0) / data.length;
    const avgHumidity = data.reduce((sum, entry) => sum + parseFloat(entry.humidity), 0) / data.length;

    setAverages({
      avgTemperature: avgTemperature.toFixed(2),
      avgHumidity: avgHumidity.toFixed(2),
    });
  };

  // Préparer les données pour le graphique en courbes
  const lineData = [
    {
      id: 'Temperature',
      color: 'hsl(220, 70%, 50%)',
      data: data.map(item => ({
        x: new Date(item.timestamp).toLocaleTimeString(),
        y: parseFloat(item.temperature),
      })),
    },
    {
      id: 'Humidity',
      color: 'hsl(120, 70%, 50%)',
      data: data.map(item => ({
        x: new Date(item.timestamp).toLocaleTimeString(),
        y: parseFloat(item.humidity),
      })),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-800">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-900 shadow-md">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button */}
              <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 focus:outline-none">
                {/* Icon when menu is closed */}
                {/* Icon when menu is open */}
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faSun} className="text-yellow-500 text-2xl" />
                <h1 className="ml-2 text-xl font-bold text-gray-800 dark:text-white">Dashboard Weather Station</h1>
              </div>
            </div>
            {/* Right side of navbar */}
            <div className="flex items-center">
              <div className="hidden sm:block sm:ml-6">
                <div className="flex space-x-4">
                  <FontAwesomeIcon icon={faThermometerHalf} className="text-blue-500 text-xl" />
                  <FontAwesomeIcon icon={faTint} className="text-blue-500 text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex flex-col gap-6 p-6 md:p-8 lg:p-10 flex-1">
        <h2 className="text-lg text-black font-medium">Statistiques:</h2>

        {/* Affichage des statistiques */}
        {statistics && (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <StatCard title="Min Température" value={`${statistics.minTemperature} °C`} />
            <StatCard title="Max Température" value={`${statistics.maxTemperature} °C`} />
            <StatCard title="Min Humidité" value={`${statistics.minHumidity} %`} />
            <StatCard title="Max Humidité" value={`${statistics.maxHumidity} %`} />
          </div>
        )}

        {/* Affichage des moyennes */}
        {averages && (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 mt-6">
            <StatCard title="Moyenne Température" value={`${averages.avgTemperature} °C`} />
            <StatCard title="Moyenne Humidité" value={`${averages.avgHumidity} %`} />
          </div>
        )}

        <div style={{ height: 400 }}>
          <ResponsiveLine
            data={lineData}
            margin={{ top: 10, right: 20, bottom: 40, left: 40 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: false,
              reverse: false,
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 45,
              legend: 'Time',
              legendPosition: 'middle',
              legendOffset: 32,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Value',
              legendPosition: 'middle',
              legendOffset: -40,
            }}
            colors={{ scheme: 'category10' }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

// Composant pour afficher chaque statistique individuelle
function StatCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm p-4">
      <div className="text-lg font-medium">{title}</div>
      <div className="text-4xl font-bold">{value}</div>
    </div>
  );
}
