document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('toggle-password');
    const rememberMe = document.getElementById('remember');
    const forgotPassword = document.getElementById('forgotPassword');

    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Handle form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Reset previous error states
        resetErrors();

        // Validate inputs
        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value.trim();

        let isValid = true;

        if (!email) {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }

        if (!password) {
            showError(passwordInput, 'Password is required');
            isValid = false;
        }

        if (!isValid) return;
        console.log(email," ",password);
        // Vérification simple avec les identifiants spécifiés
        if (email === "maram.sahnoun2013@gmail.com" && password === "maram12") {
            // Store token if remember me is checked
            if (rememberMe.checked) {
                localStorage.setItem('token', 'dummy-token');
            } else {
                sessionStorage.setItem('token', 'dummy-token');
            }

            // Redirect to dashboard
            window.location.href = '../html/dashboard.html';
        } else {
            showError(emailInput, 'Email ou mot de passe incorrect');
        }
    });

    if (forgotPassword) {
        forgotPassword.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../html/forgot-password.html'; // Change this path if needed
        });
    }
    
    // Helper functions
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

    function resetErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
        
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.style.borderColor = 'var(--border-color)';
        });
    }
}); 