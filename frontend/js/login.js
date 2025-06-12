const API_BASE_URL = 'https://localhost:3000/api'; 

class LoginManager {
    constructor() {
        this.form = document.getElementById('login-form');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.errorMessage = document.getElementById('error-message');
        this.successMessage = document.getElementById('success-message');

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Handle form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });

        // Real-time validation
        this.emailInput.addEventListener('input', () => {
            this.validateLoginInput(this.emailInput);
        });

        this.passwordInput.addEventListener('input', () => {
            this.validateLoginInput(this.passwordInput);
        });
    }

    validateLoginInput(input) {
        const formGroup = input.closest('.form-group');
        const validationMessage = formGroup.querySelector('.validation-message');
        const value = input.value.trim();
        
        if (value === '') {
            formGroup.classList.add('error');
            formGroup.classList.remove('success');
            validationMessage.textContent = 'This field is required';
            return false;
        }

        formGroup.classList.remove('error');
        formGroup.classList.add('success');
        validationMessage.textContent = '';
        return true;
    }

    showError(message) {
        if (this.errorMessage) {
            this.errorMessage.textContent = message;
            this.errorMessage.style.display = 'block';
        }
    }

    showSuccess(message) {
        if (this.successMessage) {
            this.successMessage.textContent = message;
            this.successMessage.style.display = 'block';
        }
    }

    clearMessages() {
        if (this.errorMessage) {
            this.errorMessage.textContent = '';
            this.errorMessage.style.display = 'none';
        }
        if (this.successMessage) {
            this.successMessage.textContent = '';
            this.successMessage.style.display = 'none';
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const email = this.emailInput.value.trim().toLowerCase();
        const password = this.passwordInput.value;

        // Validate inputs
        if (!this.validateLoginInput(this.emailInput) || !this.validateLoginInput(this.passwordInput)) {
            return false;
        }

        // Clear any previous messages
        this.clearMessages();

        try {
            const response = await fetch(`${API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Successful login
            this.showSuccess('Login successful! Redirecting to home page...');
            localStorage.setItem('token', data.token);
            // Disable form during redirect
            this.submitButton.disabled = true;
            this.form.style.opacity = '0.7';
            
            // Redirect to home page after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            console.error('Login error:', error);
            this.showError(error.message || 'An error occurred. Please try again.');
        }

        return false;
    }
}

// Initialize login manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
});