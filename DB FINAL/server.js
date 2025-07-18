const express = require('express');
const cors = require('cors');
const createClient = require('hafas-client');
const { profile: bahnProfile } = require('@derhuerst/hafas-client-bahn');

const app = express();
const port = 5500;

const client = createClient(bahnProfile, 'zugradar-demo');

app.use(cors());

app.get('/api/radar', async (req, res) => {
  try {
    const data = await client.radar({
      north: 52.54,
      west: 13.37,
      south: 52.49,
      east: 13.45,
      results: 10,
    });
    res.json(data);
  } catch (err) {
    console.error('Fehler bei der Radar-Abfrage:', err);
    res.status(500).json({ error: 'Fehler bei der Radar-Abfrage' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server läuft auf http://localhost:${port}`);
});