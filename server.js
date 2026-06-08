const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/api/candidats', (req, res) => {
  db.all('SELECT * FROM candidats', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/vote', (req, res) => {
  const { etudiant_id, candidat_id } = req.body;

  if (!etudiant_id || !candidat_id) {
    return res.status(400).json({ error: 'Données manquantes.' });
  }

  db.get('SELECT * FROM votes WHERE etudiant_id = ?', [etudiant_id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) return res.status(400).json({ error: 'Vous avez déjà voté !' });

    db.run(
      'INSERT INTO votes (etudiant_id, candidat_id) VALUES (?, ?)',
      [etudiant_id, candidat_id],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Vote enregistré avec succès !' });
      }
    );
  });
});

app.get('/api/resultats', (req, res) => {
  db.all(`
    SELECT c.id, c.nom, c.photo, COUNT(v.id) as votes
    FROM candidats c
    LEFT JOIN votes v ON c.id = v.candidat_id
    GROUP BY c.id
    ORDER BY votes DESC
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
