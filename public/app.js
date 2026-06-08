let candidatsData = [];
const medals = ['🥇', '🥈', '🥉'];

async function loadCandidats() {
  try {
    const res = await fetch('/api/candidats');
    candidatsData = await res.json();

    const container = document.getElementById('cards-container');
    const select = document.getElementById('candidat_id');
    container.innerHTML = '';
    select.innerHTML = '<option value="">-- Sélectionnez un candidat --</option>';

    candidatsData.forEach(c => {
      container.innerHTML += `
        <div class="card">
          <img src="${c.photo}" alt="${c.nom}" onerror="this.src='https://i.pravatar.cc/150?u=${c.id}'" />
          <h3>${c.nom}</h3>
          <p>${c.programme}</p>
          <button class="btn-vote" onclick="choisirCandidat(${c.id})">🗳️ Voter pour lui</button>
        </div>
      `;
      select.innerHTML += `<option value="${c.id}">${c.nom}</option>`;
    });
  } catch (err) {
    document.getElementById('cards-container').innerHTML =
      '<p style="color:red">Erreur de connexion au serveur.</p>';
  }
}

function choisirCandidat(id) {
  showPage('voter', document.querySelectorAll('nav button')[1]);
  document.getElementById('candidat_id').value = id;
  document.getElementById('message').className = '';
  document.getElementById('message').textContent = '';
}

async function soumettreVote() {
  const etudiant_id = document.getElementById('etudiant_id').value.trim();
  const candidat_id = document.getElementById('candidat_id').value;
  const msg = document.getElementById('message');

  msg.className = '';
  msg.textContent = '';

  if (!etudiant_id || !candidat_id) {
    msg.className = 'error';
    msg.textContent = ' Veuillez remplir tous les champs.';
    return;
  }

  try {
    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ etudiant_id, candidat_id: parseInt(candidat_id) })
    });

    const data = await res.json();
    if (res.ok) {
      msg.className = 'success';
      msg.textContent = 'Done ' + data.message;
      document.getElementById('etudiant_id').value = '';
      document.getElementById('candidat_id').value = '';
    } else {
      msg.className = 'error';
      msg.textContent = 'X ' + data.error;
    }
  } catch (err) {
    msg.className = 'error';
    msg.textContent = ' Erreur de connexion au serveur.';
  }
}

async function loadResultats() {
  try {
    const res = await fetch('/api/resultats');
    const data = await res.json();
    const container = document.getElementById('resultats-container');
    const totalEl = document.getElementById('total-votes');

    const totalVotes = data.reduce((sum, r) => sum + r.votes, 0);
    totalEl.textContent = `Total des votes : ${totalVotes}`;

    const maxVotes = Math.max(...data.map(r => r.votes), 1);

    container.innerHTML = data.map((r, i) => `
      <div class="resultat-item">
        <span class="rank">${medals[i] || (i + 1)}</span>
        <img src="${r.photo}" alt="${r.nom}" onerror="this.src='https://i.pravatar.cc/150?u=${r.id}'" />
        <div class="resultat-info">
          <strong>${r.nom}</strong>
          <div class="bar-container">
            <div class="bar" style="width:${totalVotes === 0 ? 0 : (r.votes / maxVotes) * 100}%"></div>
          </div>
        </div>
        <span class="vote-count">${r.votes} vote${r.votes !== 1 ? 's' : ''}</span>
      </div>
    `).join('');
  } catch (err) {
    document.getElementById('resultats-container').innerHTML =
      '<p style="color:red; text-align:center">Erreur de chargement des résultats.</p>';
  }
}

function showPage(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
  if (id === 'resultats') loadResultats();
} 

loadCandidats();
