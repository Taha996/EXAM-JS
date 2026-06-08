# 🗳️ Système de Vote Électronique — MIAGE Casa

Examen de Fin de Cursus | Module : Programmation Client-Serveur | Juin 2026

---

## 🚀 Lancer le projet

### 1. Installer les dépendances
```bash
npm install
```

### 2. Démarrer le serveur
```bash
node server.js
```

### 3. Ouvrir dans le navigateur
```
http://localhost:3000
```

---

## 📁 Structure du projet

```
vote-app/
├── server.js        → API REST (Express.js)
├── database.js      → Initialisation SQLite
├── package.json     → Dépendances
└── public/
    └── index.html   → Frontend (HTML, CSS, JS)
```

---

## 🔌 API Endpoints

| Méthode | Route            | Description                  |
|---------|------------------|------------------------------|
| GET     | /api/candidats   | Récupérer tous les candidats |
| POST    | /api/vote        | Enregistrer un vote          |
| GET     | /api/resultats   | Afficher les résultats       |

---

## ⚙️ Technologies utilisées

- **Frontend** : HTML5, CSS3, JavaScript (Vanilla JS)
- **Backend** : Node.js + Express.js
- **Base de données** : SQLite (via better-sqlite3)
