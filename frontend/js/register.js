let currentStep = 1;

// Show the current step
const showStep = (step) => {
    document.querySelectorAll('.form-steps').forEach(el => {
        el.classList.remove('active');
    });
    document.getElementById(`step${step}`).classList.add('active');
};

// Validate each step
const validateStep = (step) => {
    const form = document.getElementById('registerForm');
    auth.clearErrors(form);
    
    switch(step) {
        case 1:
            const email = form.email.value.trim();
            const password = form.password.value;
            const confirmPassword = form.confirmPassword.value;
            
            const emailError = auth.validateEmail(email);
            if (emailError) {
                auth.showError('emailError', emailError);
                return false;
            }
            
            const passwordError = auth.validatePassword(password);
            if (passwordError) {
                auth.showError('passwordError', passwordError);
                return false;
            }
            
            if (password !== confirmPassword) {
                auth.showError('confirmPasswordError', 'Passwords do not match');
                return false;
            }
            
            // Check if email is already registered
            if (auth.findUser(email)) {
                auth.showError('emailError', 'Email is already registered');
                return false;
            }
            
            return true;
            
        case 2:
            const firstName = form.firstName.value.trim();
            const lastName = form.lastName.value.trim();
            const phone = form.phone.value.trim();
            
            if (!firstName) {
                auth.showError('firstNameError', 'First name is required');
                return false;
            }
            
            if (!lastName) {
                auth.showError('lastNameError', 'Last name is required');
                return false;
            }
            
            if (phone && !/^\+?[\d\s-]{10,}$/.test(phone)) {
                auth.showError('phoneError', 'Please enter a valid phone number');
                return false;
            }
            
            return true;
            
        case 3:
            if (!form.terms.checked) {
                auth.showError('termsError', 'You must accept the terms and conditions');
                return false;
            }
            return true;
    }
    
    return true;
};

// Navigate to next step
const nextStep = (step) => {
    if (validateStep(step)) {
        currentStep++;
        showStep(currentStep);
    }
};

// Navigate to previous step
const prevStep = (step) => {
    currentStep--;
    showStep(currentStep);
};

// Handle registration form submission
const handleRegister = (event) => {
    event.preventDefault();
    
    const form = event.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;
    
    // Clear any existing errors
    auth.clearErrors(form);
    
    // Validate inputs
    const nameError = auth.validateName(name);
    const emailError = auth.validateEmail(email);
    const passwordError = auth.validatePassword(password);
    
    if (nameError) {
        auth.showError('nameError', nameError);
        return false;
    }
    
    if (emailError) {
        auth.showError('emailError', emailError);
        return false;
    }
    
    if (passwordError) {
        auth.showError('passwordError', passwordError);
        return false;
    }
    
    try {
        // Check if email is already registered
        if (auth.findUser(email)) {
            auth.showError('emailError', 'This email is already registered');
            return false;
        }
        
        // Save new user
        const userData = {
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };
        
        auth.saveUser(userData);
        console.log('User registered successfully:', email);
        
        // Set authentication and redirect to home
        auth.setAuthToken(btoa(email + ':' + new Date().getTime()), true);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error during registration:', error);
        auth.showError('emailError', error.message || 'Registration failed. Please try again.');
    }
    
    return false;
};

// Update password requirements in real-time
const updatePasswordRequirements = (password) => {
    const requirements = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    // Update requirement indicators
    document.getElementById('length-req').classList.toggle('met', requirements.length);
    document.getElementById('lowercase-req').classList.toggle('met', requirements.lowercase);
    document.getElementById('uppercase-req').classList.toggle('met', requirements.uppercase);
    document.getElementById('special-req').classList.toggle('met', requirements.special);
};

// Add password input listener
document.getElementById('password').addEventListener('input', (e) => {
    updatePasswordRequirements(e.target.value);
});

// Handle social registration
const handleSocialLogin = (provider) => {
    // In a real application, this would integrate with the social provider's SDK
    console.log(`Registering with ${provider}`);
    alert(`${provider} registration is not implemented in this demo`);
};

// Sample user data for testing
const sampleUsers = [
    {
        email: 'test@example.com',
        password: 'Test@123',
        name: 'Test User'
    }
];

class RegistrationManager {
    constructor() {
        this.form = document.getElementById('registerForm');
        this.nameInput = document.getElementById('name');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordInput = document.getElementById('confirmPassword');
        this.termsCheckbox = document.getElementById('termsAccepted');
        this.messageContainer = document.getElementById('messageContainer');

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Handle form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegistration();
        });

        // Real-time validation
        this.nameInput.addEventListener('input', () => {
            this.validateName();
        });

        this.emailInput.addEventListener('input', () => {
            this.validateEmail();
        });

        this.passwordInput.addEventListener('input', () => {
            this.validatePassword();
            if (this.confirmPasswordInput.value) {
                this.validateConfirmPassword();
            }
        });

        this.confirmPasswordInput.addEventListener('input', () => {
            this.validateConfirmPassword();
        });

        this.termsCheckbox.addEventListener('change', () => {
            this.validateTerms();
        });
    }

    validateName() {
        const name = this.nameInput.value.trim();
        const nameError = document.getElementById('nameError');
        
        if (!name) {
            nameError.textContent = 'Name is required';
            return false;
        }
        
        if (name.length < 2) {
            nameError.textContent = 'Name must be at least 2 characters';
            return false;
        }
        
        nameError.textContent = '';
        return true;
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
        
        // Check if email already exists
        if (sampleUsers.some(user => user.email === email)) {
            emailError.textContent = 'This email is already registered';
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
        
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
            passwordError.textContent = 'Password must contain uppercase, lowercase, number and special character';
            return false;
        }
        
        passwordError.textContent = '';
        return true;
    }

    validateConfirmPassword() {
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;
        const confirmPasswordError = document.getElementById('confirmPasswordError');
        
        if (!confirmPassword) {
            confirmPasswordError.textContent = 'Please confirm your password';
            return false;
        }
        
        if (password !== confirmPassword) {
            confirmPasswordError.textContent = 'Passwords do not match';
            return false;
        }
        
        confirmPasswordError.textContent = '';
        return true;
    }

    validateTerms() {
        const termsError = document.getElementById('termsError');
        
        if (!this.termsCheckbox.checked) {
            termsError.textContent = 'You must accept the terms to continue';
            return false;
        }
        
        termsError.textContent = '';
        return true;
    }

    async handleRegistration() {
        // Validate all fields
        const isValid = 
            this.validateName() &&
            this.validateEmail() &&
            this.validatePassword() &&
            this.validateConfirmPassword() &&
            this.validateTerms();

        if (!isValid) {
            return;
        }

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Create new user object
            const newUser = {
                name: this.nameInput.value.trim(),
                email: this.emailInput.value.trim(),
                password: this.passwordInput.value
            };

            // In a real app, this would be an API call
            sampleUsers.push(newUser);

            this.showMessage('Registration successful! Redirecting to login...', 'success');
            
            // Redirect to login page after showing success message
            setTimeout(() => {
                window.location.href = 'login.html';
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
}

// Initialize registration manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RegistrationManager();
});


document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    if (!form) return;
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const submitButton = form.querySelector('button[type="submit"]');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    // Validation patterns
    const patterns = {
        name: /^[a-zA-Z\s]{2,}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        password: {
            length: /.{8,}/,
            uppercase: /[A-Z]/,
            lowercase: /[a-z]/,
            number: /[0-9]/,
            special: /[!@#$%^&*(),.?":{}|<>]/
        }
    };

    function validateInput(input, pattern) {
        const formGroup = input.closest('.form-group');
        const validationMessage = formGroup.querySelector('.validation-message');
        const value = input.value.trim();
        if (value === '') {
            formGroup.classList.add('error');
            formGroup.classList.remove('success');
            validationMessage.textContent = 'This field is required';
            return false;
        }
        let isValid = true;
        let errorMessage = '';
        if (input.id === 'name') {
            isValid = patterns.name.test(value);
            errorMessage = 'Name must contain only letters and spaces';
        } else if (input.id === 'email') {
            isValid = patterns.email.test(value);
            errorMessage = 'Please enter a valid email address';
            if (isValid && typeof isUserRegistered === 'function' && isUserRegistered(value)) {
                isValid = false;
                errorMessage = 'This email is already registered. Please login instead.';
            }
        } else if (input.id === 'password') {
            const requirements = patterns.password;
            const passwordRequirements = document.querySelectorAll('.requirement-item');
            passwordRequirements.forEach(item => {
                const requirement = item.getAttribute('data-requirement');
                const isRequirementMet = requirements[requirement].test(value);
                item.classList.toggle('valid', isRequirementMet);
                if (!isRequirementMet) isValid = false;
            });
            errorMessage = 'Please meet all password requirements';
        } else if (input.id === 'confirm-password') {
            isValid = value === passwordInput.value;
            errorMessage = 'Passwords do not match';
        }
        formGroup.classList.toggle('error', !isValid);
        formGroup.classList.toggle('success', isValid);
        validationMessage.textContent = isValid ? '' : errorMessage;
        return isValid;
    }

    function updateSubmitButton() {
        const isValid =
            validateInput(nameInput, patterns.name) &&
            validateInput(emailInput, patterns.email) &&
            validateInput(passwordInput, patterns.password) &&
            validateInput(confirmPasswordInput);
        submitButton.disabled = !isValid;
    }

    function clearMessages() {
        if (errorMessage) {
            errorMessage.textContent = '';
            errorMessage.style.display = 'none';
        }
        if (successMessage) {
            successMessage.textContent = '';
            successMessage.style.display = 'none';
        }
    }
    function showError(id, message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
    }
    function showSuccess(id, message) {
        if (successMessage) {
            successMessage.textContent = message;
            successMessage.style.display = 'block';
        }
    }

    // Add input validation listeners
    nameInput.addEventListener('input', () => {
        validateInput(nameInput, patterns.name);
        updateSubmitButton();
    });
    emailInput.addEventListener('input', () => {
        validateInput(emailInput, patterns.email);
        updateSubmitButton();
    });
    passwordInput.addEventListener('input', () => {
        validateInput(passwordInput, patterns.password);
        validateInput(confirmPasswordInput);
        updateSubmitButton();
    });
    confirmPasswordInput.addEventListener('input', () => {
        validateInput(confirmPasswordInput);
        updateSubmitButton();
    });

    form.onsubmit = function(event) {
        event.preventDefault();
        const email = emailInput.value.trim().toLowerCase();
        const name = nameInput.value.trim();
        const password = passwordInput.value;
        clearMessages();
        if (!validateInput(nameInput, patterns.name) ||
            !validateInput(emailInput, patterns.email) ||
            !validateInput(passwordInput, patterns.password) ||
            !validateInput(confirmPasswordInput)) {
            return false;
        }
        // Try to add new user
        if (typeof addUser === 'function') {
            const success = addUser(email, password, name);
            if (!success) {
                showError('error-message', 'This email is already registered. Please login instead.');
                return false;
            }
        }
        showSuccess('success-message', 'Registration successful! Redirecting to login page...');
        submitButton.disabled = true;
        form.style.opacity = '0.7';
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        setTimeout(() => {
            window.location.href = 'login.html?registered=true';
        }, 2000);
        return false;
    };
    // Initialize validation on page load
    updateSubmitButton();
}); 