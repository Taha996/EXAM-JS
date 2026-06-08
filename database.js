const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('votes.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS candidats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      photo TEXT NOT NULL,
      programme TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      etudiant_id TEXT NOT NULL UNIQUE,
      candidat_id INTEGER NOT NULL,
      FOREIGN KEY (candidat_id) REFERENCES candidats(id)
    )
  `);

  db.get('SELECT COUNT(*) as c FROM candidats', (err, row) => {
    if (row && row.c === 0) {
      const stmt = db.prepare('INSERT INTO candidats (nom, photo, programme) VALUES (?, ?, ?)');
      stmt.run('Candidat 1', 'Améliorer les conditions de la salle informatique et organiser des hackathons.');
stmt.run('Candidat 2', 'Créer un espace de coworking et renforcer le soutien aux étudiants en difficulté.');
stmt.run('Candidat 3', 'Organiser des événements sportifs et culturels pour renforcer la cohésion.');
      stmt.finalize();
    }
  });
});

module.exports = db;
