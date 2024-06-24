-- CreateTable
CREATE TABLE "Mesure" (
    "idMesure" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dateHeure" DATETIME NOT NULL,
    "temperature" REAL NOT NULL,
    "humidite" REAL NOT NULL,
    "stationMeteoId" INTEGER NOT NULL,
    CONSTRAINT "Mesure_stationMeteoId_fkey" FOREIGN KEY ("stationMeteoId") REFERENCES "StationMeteo" ("idStation") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StationMeteo" (
    "idStation" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "localisation" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Statistiques" (
    "idStat" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "maxTemperature" REAL NOT NULL,
    "minTemperature" REAL NOT NULL,
    "moyTemperature" REAL NOT NULL,
    "maxHumidite" REAL NOT NULL,
    "minHumidite" REAL NOT NULL,
    "moyHumidite" REAL NOT NULL,
    "debutTranche" DATETIME NOT NULL,
    "finTranche" DATETIME NOT NULL
);
