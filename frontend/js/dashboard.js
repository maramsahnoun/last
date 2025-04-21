document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetPage = item.dataset.page;

            navItems.forEach(nav => nav.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));

            item.classList.add('active');
            document.getElementById(`${targetPage}-page`).classList.add('active');

            if (targetPage === 'montant') calculateMontant();
            if (targetPage === 'statistique') updateChartsFromTables();
        });
    });

    // Déconnexion
    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });

    // --- MONTANT ---
    function calculateMontant() {
        let totalAchats = 0;
        let totalRetours = 0;

        document.querySelectorAll('#achat-table tbody tr').forEach(row => {
            const prix = parseFloat(row.cells[4].textContent.replace('DT', '').replace(',', '.')) || 0;
            totalAchats += prix;
        });

        document.querySelectorAll('#retour-table tbody tr').forEach(row => {
            const prix = parseFloat(row.cells[4].textContent.replace('DT', '').replace(',', '.')) || 0;
            totalRetours += prix;
        });

        const total = totalAchats - totalRetours;
        const montantElement = document.querySelector('.montant-value');
        if (montantElement) montantElement.textContent = `${total.toFixed(2)} DT`;
    }

    // --- CHARTS DYNAMIQUES ---
    const achatRetourCtx = document.getElementById('achatRetourChart').getContext('2d');
    const topProductsCtx = document.getElementById('topProductsChart').getContext('2d');

    let achatRetourChart = new Chart(achatRetourCtx, {
        type: 'bar',
        data: {
            labels: ['Achats', 'Retours'],
            datasets: [{
                label: 'Quantité',
                data: [0, 0],
                backgroundColor: ['#667eea', '#764ba2']
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } }
        }
    });

    let topProductsChart = new Chart(topProductsCtx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: ['#667eea', '#764ba2', '#10b981', '#f59e0b', '#ef4444']
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'top' } }
        }
    });

    function updateChartsFromTables() {
        let totalAchatQuant = 0;
        let totalRetourQuant = 0;
        const produitStats = {};

        document.querySelectorAll('#achat-table tbody tr').forEach(row => {
            const nom = row.cells[1].textContent.trim();
            const quantite = parseInt(row.cells[2].textContent) || 0;
            totalAchatQuant += quantite;
            produitStats[nom] = (produitStats[nom] || 0) + quantite;
        });

        document.querySelectorAll('#retour-table tbody tr').forEach(row => {
            const quantite = parseInt(row.cells[2].textContent) || 0;
            totalRetourQuant += quantite;
        });

        // Ratio Achat/Retour
        const ratio = totalRetourQuant > 0
            ? (totalAchatQuant / totalRetourQuant).toFixed(2)
            : '∞';
        document.getElementById('ratioStatistique').textContent = `Ratio Achat/Retour : ${ratio}`;

        // Update achat/retour bar chart
        achatRetourChart.data.datasets[0].data = [totalAchatQuant, totalRetourQuant];
        achatRetourChart.update();

        // Update top products pie chart
        topProductsChart.data.labels = Object.keys(produitStats);
        topProductsChart.data.datasets[0].data = Object.values(produitStats);
        topProductsChart.update();
    }

    // --- CHATBOT ---
    const chatInput = document.getElementById('chatInput');
    const sendMessageButton = document.getElementById('sendMessageButton');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const voiceChatButton = document.getElementById('voiceChatButton');
    const imageUploadButton = document.getElementById('imageUploadButton');
    const imageInput = document.getElementById('imageInput');

    const typicalQuestions = {
        'types_de_vetements': 'Nous proposons une large gamme de vêtements, y compris des t-shirts, des pantalons, des robes, des vestes, et des accessoires.',
        'taille': 'Consultez notre guide des tailles disponible sur le site.',
        'retour_article': 'Vous avez 30 jours pour retourner un article.',
        'suivi_commande': 'Un numéro de suivi vous est envoyé par e-mail.',
        'reductions_promotions': 'Inscrivez-vous à notre newsletter pour recevoir les offres.',
        'modes_de_paiement': 'Nous acceptons cartes bancaires, PayPal, etc.',
        'qualite_vetements': 'Tous nos articles sont testés et sélectionnés.',
        'annuler_commande': 'Vous pouvez annuler avant expédition.',
        'programme_fidelite': 'Gagnez des points à chaque achat.',
        'contact_service_client': 'Par e-mail, téléphone ou formulaire sur notre site.'
    };

    function addMessage(message, isUser = false, imageUrl = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        if (imageUrl) {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Image envoyée';
            img.style.maxWidth = '200px';
            img.style.maxHeight = '200px';
            img.style.borderRadius = '8px';
            messageDiv.appendChild(img);
        } else {
            messageDiv.textContent = message;
        }
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function handleMessage(message, imageUrl = null) {
        addMessage(message, true, imageUrl);
        const lower = message.toLowerCase();
        let response = "Je ne comprends pas votre question. Pouvez-vous reformuler ?";
        for (const [key, val] of Object.entries(typicalQuestions)) {
            if (lower.includes(key)) {
                response = val;
                break;
            }
        }
        setTimeout(() => addMessage(response), 400);
    }

    sendMessageButton.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message) {
            handleMessage(message);
            chatInput.value = '';
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const message = chatInput.value.trim();
            if (message) {
                handleMessage(message);
                chatInput.value = '';
            }
        }
    });

    imageUploadButton.addEventListener('click', () => imageInput.click());

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => handleMessage("Image envoyée", event.target.result);
            reader.readAsDataURL(file);
        }
    });

    let recognition;
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.lang = 'fr-FR';
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            handleMessage(transcript);
        };
        recognition.onerror = (event) => {
            console.error('Erreur vocale :', event.error);
        };
    }

    voiceChatButton.addEventListener('click', () => {
        if (recognition) recognition.start();
        else addMessage("La reconnaissance vocale n'est pas disponible.");
    });
    // Toggle Chatbot Body (open/close)
const chatbotBody = document.querySelector('.chatbot-body');
const toggleChatbot = document.getElementById('toggleChatbot');

toggleChatbot.addEventListener('click', () => {
    chatbotBody.classList.toggle('hidden');
});


    // Init au chargement
    calculateMontant();
    updateChartsFromTables();
});
