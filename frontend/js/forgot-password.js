document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const emailInput = document.getElementById('email');

    forgotPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = emailInput.value.trim();

        if (!email) {
            showError(emailInput, 'Email requis');
            return;
        }

        if (!isValidEmail(email)) {
            showError(emailInput, 'Veuillez entrer une adresse email valide');
            return;
        }

        // Simuler l'envoi du lien de réinitialisation
        const submitButton = forgotPasswordForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitButton.disabled = true;

        setTimeout(() => {
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
            alert('Un lien de réinitialisation a été envoyé à votre email');
            window.location.href = 'login.html';
        }, 2000);
    });

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(errorElement);
        }
        
        input.style.borderColor = 'var(--error-color)';
    }
}); 