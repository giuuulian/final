// Configuration
const API_URL = window.location.href.includes('localhost:8080') 
  ? 'http://localhost:3000'
  : `http://${window.location.hostname}:3000`;

document.getElementById('backendUrl').textContent = API_URL;

// Charger les messages au démarrage
document.addEventListener('DOMContentLoaded', () => {
    loadMessages();
});

// Vérifier la santé du serveur
async function checkHealth() {
    try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();
        
        const statusElement = document.getElementById('healthStatus');
        if (response.ok) {
            statusElement.textContent = `✓ Serveur OK - ${new Date(data.timestamp).toLocaleTimeString()}`;
            statusElement.className = 'success';
        } else {
            statusElement.textContent = '✗ Serveur indisponible';
            statusElement.className = 'error';
        }
    } catch (error) {
        document.getElementById('healthStatus').textContent = `✗ Erreur: ${error.message}`;
        document.getElementById('healthStatus').className = 'error';
    }
}

// Charger tous les messages
async function loadMessages() {
    try {
        const response = await fetch(`${API_URL}/api/messages`);
        const messages = await response.json();
        
        const messagesList = document.getElementById('messagesList');
        if (messages.length === 0) {
            messagesList.innerHTML = '<div class="no-messages">Aucun message</div>';
            return;
        }

        messagesList.innerHTML = messages.map(msg => `
            <div class="message-item">
                <span class="message-id">#${msg.id}</span>
                <span class="message-text">${escapeHtml(msg.text)}</span>
                <button class="delete-btn" onclick="deleteMessage(${msg.id})">Supprimer</button>
            </div>
        `).join('');
    } catch (error) {
        document.getElementById('messagesList').innerHTML = 
            `<div class="error-message">Erreur lors du chargement: ${error.message}</div>`;
    }
}

// Ajouter un nouveau message
async function addMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (!text) {
        alert('Veuillez entrer un message');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (response.ok) {
            input.value = '';
            loadMessages();
        } else {
            alert('Erreur lors de l\'ajout du message');
        }
    } catch (error) {
        alert(`Erreur: ${error.message}`);
    }
}

// Supprimer un message
async function deleteMessage(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message?')) return;

    try {
        const response = await fetch(`${API_URL}/api/messages/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadMessages();
        } else {
            alert('Erreur lors de la suppression');
        }
    } catch (error) {
        alert(`Erreur: ${error.message}`);
    }
}

// Fonction utilitaire pour échapper le HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Recharger les messages toutes les 5 secondes
setInterval(loadMessages, 5000);
