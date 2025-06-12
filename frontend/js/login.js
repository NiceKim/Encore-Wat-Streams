// Show login modal on page load if not in a modal context
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const isModal = urlParams.get('modal') === 'true';
    
    if (!isModal) {
        auth.showModal('loginModal');
    }
});

// Mock user data (in a real app, this would be in your backend)
const mockUsers = [
    { email: 'test@example.com', password: 'password123' },
    { email: 'admin@theater.com', password: 'admin123' }
];

// Handle login form submission
const handleLogin = (event) => {
    event.preventDefault();
    
    const form = event.target;
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;
    
    // Clear previous errors
    clearErrors(form);
    
    // Find user by email
    const user = mockUsers.find(u => u.email === email);
    console.log('Login attempt for:', email);
    
    if (user && user.password !== password) {
        console.log('Incorrect password for:', email);
        showError('passwordError', 'Incorrect password. Please try again.');
        return false;
    }
    
    if (!user) {
        console.log('No user found for email:', email);
        showError('emailError', 'This email is not registered. Please register first.');
        return false;
    }
    
    // Login successful
    console.log('Login successful for:', email);
    
    // Clear any existing error messages
    const errorElements = document.getElementsByClassName('error-message');
    Array.from(errorElements).forEach(element => {
        element.style.display = 'none';
        element.textContent = '';
    });
    
    // Set auth token and redirect
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    window.location.href = 'index.html';
    
    return false;
};

// Handle social login
const handleSocialLogin = (provider) => {
    // In a real application, this would integrate with the social provider's SDK
    console.log(`Logging in with ${provider}`);
    alert(`${provider} login is not implemented in this demo`);
};

// Show forgot password modal
const showForgotPassword = (event) => {
    event.preventDefault();
    alert('Password reset functionality is not implemented yet.');
};

// Show login form
const showLoginForm = (event) => {
    event.preventDefault();
    auth.hideModal('forgotPasswordModal');
    auth.showModal('loginModal');
};

// Handle forgot password
const handleForgotPassword = (event) => {
    event.preventDefault();
    
    const form = event.target;
    const email = form.resetEmail.value.trim();
    
    // Clear previous errors
    auth.clearErrors(form);
    
    // Validate email
    const emailError = auth.validateEmail(email);
    if (emailError) {
        auth.showError('resetEmailError', emailError);
        return false;
    }
    
    // Initiate password reset
    if (auth.initiatePasswordReset(email)) {
        alert('Password reset instructions have been sent to your email');
        auth.hideModal('forgotPasswordModal');
    } else {
        auth.showError('resetEmailError', 'No account found with this email');
    }
    
    return false;
};

// Close modal when clicking outside
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal-overlay')) {
        const modalId = event.target.id;
        auth.hideModal(modalId);
    }
});

// Sample user data for testing
const sampleUsers = [
    {
        id: 1,
        email: 'viewer1@example.com',
        password: 'hashed_pw1',
        name: 'Alice Viewer',
        type: 'USER',
        registration_date: '2024-01-01'
    },
    {
        id: 2,
        email: 'theater1@example.com',
        password: 'hashed_pw2',
        name: 'Theater Group A',
        type: 'ADMIN',
        registration_date: '2024-01-01'
    }
];

class LoginManager {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.rememberMe = document.getElementById('rememberMe');
        this.messageContainer = document.getElementById('messageContainer');
        
        this.maxAttempts = 3;
        this.lockoutDuration = 15 * 60 * 1000; // 15 minutes
        this.loginAttempts = new Map();

        this.setupEventListeners();
        this.checkSavedCredentials();
    }

    setupEventListeners() {
        // Handle form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Handle forgot password link
        document.getElementById('forgotPassword').addEventListener('click', (e) => {
            e.preventDefault();
            this.showForgotPasswordPrompt();
        });

        // Real-time validation
        this.emailInput.addEventListener('input', () => {
            this.validateEmail();
        });

        this.passwordInput.addEventListener('input', () => {
            this.validatePassword();
        });
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailError = document.getElementById('emailError');
        
        if (!email) {
            emailError.textContent = 'Email is required';
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            emailError.textContent = 'Please enter a valid email address';
            return false;
        }
        
        emailError.textContent = '';
        return true;
    }

    validatePassword() {
        const password = this.passwordInput.value;
        const passwordError = document.getElementById('passwordError');
        
        if (!password) {
            passwordError.textContent = 'Password is required';
            return false;
        }
        
        if (password.length < 8) {
            passwordError.textContent = 'Password must be at least 8 characters';
            return false;
        }
        
        passwordError.textContent = '';
        return true;
    }

    isAccountLocked(email) {
        const attempts = this.loginAttempts.get(email);
        if (!attempts) return false;

        if (attempts.count >= this.maxAttempts) {
            const timeElapsed = Date.now() - attempts.timestamp;
            if (timeElapsed < this.lockoutDuration) {
                const minutesLeft = Math.ceil((this.lockoutDuration - timeElapsed) / 60000);
                return `Account is locked. Try again in ${minutesLeft} minutes`;
            } else {
                this.loginAttempts.delete(email);
                return false;
            }
        }
        return false;
    }

    recordLoginAttempt(email) {
        const attempts = this.loginAttempts.get(email) || { count: 0, timestamp: Date.now() };
        attempts.count++;
        attempts.timestamp = Date.now();
        this.loginAttempts.set(email, attempts);
    }

    async handleLogin() {
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;
        
        // Validate inputs
        if (!this.validateEmail() || !this.validatePassword()) {
            return;
        }

        // Check account lock
        const lockStatus = this.isAccountLocked(email);
        if (lockStatus) {
            this.showMessage(lockStatus, 'error');
            return;
        }

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Find user (in real app, this would be an API call)
            const user = sampleUsers.find(u => u.email === email);

            if (user && user.password !== password) {
                this.recordLoginAttempt(email);
                const attempts = this.loginAttempts.get(email);
                const remainingAttempts = this.maxAttempts - attempts.count;
                
                if (remainingAttempts > 0) {
                    this.showMessage(`Incorrect password. ${remainingAttempts} attempts remaining`, 'error');
                } else {
                    this.showMessage('Account locked. Try again in 15 minutes', 'error');
                }
                return;
            }

            if (!user) {
                this.showMessage('This email is not registered. Please register first.', 'error');
                return;
            }

            // Successful login
            if (this.rememberMe.checked) {
                this.saveCredentials(email);
            }

            this.loginAttempts.delete(email);
            this.showMessage('Login successful! Redirecting...', 'success');
            
            // Redirect after showing success message
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            this.showMessage('An error occurred. Please try again.', 'error');
        }
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        this.messageContainer.innerHTML = '';
        this.messageContainer.appendChild(messageDiv);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    saveCredentials(email) {
        localStorage.setItem('savedEmail', email);
    }

    checkSavedCredentials() {
        const savedEmail = localStorage.getItem('savedEmail');
        if (savedEmail) {
            this.emailInput.value = savedEmail;
            this.rememberMe.checked = true;
        }
    }

    showForgotPasswordPrompt() {
        const email = prompt('Enter your email to reset password:');
        if (email) {
            if (sampleUsers.some(u => u.email === email)) {
                this.showMessage('Password reset link sent to your email!', 'success');
            } else {
                this.showMessage('Email not found.', 'error');
            }
        }
    }
}

// Initialize login manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
});

// Helper functions
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
    }
}

function clearErrors(form) {
    const errorElements = form.getElementsByClassName('error-message');
    Array.from(errorElements).forEach(element => {
        element.style.display = 'none';
        element.textContent = '';
    });
}

// Check if user is already logged in
window.addEventListener('load', () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'index.html';
    }
}); 