const mysql = require('mysql');

// Créer une connexion à la base de données
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'first',
});

// Connecter la base de données
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});

// Exécuter une requête SQL (exemple)
connection.query('SELECT * FROM votre_table', (err, results) => {
  if (err) {
    console.error('Erreur lors de l\'exécution de la requête :', err);
    return;
  }
  console.log('Résultats de la requête :', results);
});

// Fermer la connexion à la base de données lorsque vous avez terminé
connection.end();
