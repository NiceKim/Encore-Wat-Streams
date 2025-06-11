import React, { useState, useEffect } from 'react';

export const Registration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasLowerCase: false,
    hasUpperCase: false,
    hasSpecialChar: false,
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const validatePassword = (password) => {
    setPasswordCriteria({
      minLength: password.length >= 8,
      hasLowerCase: /[a-z]/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
      hasSpecialChar: /[!@#$%^&]/.test(password),
    });
  };

  useEffect(() => {
    const allCriteriaMet = Object.values(passwordCriteria).every(Boolean);
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    setIsFormValid(
      formData.name.length > 0 && 
      isEmailValid && 
      allCriteriaMet
    );
  }, [formData, passwordCriteria]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      validatePassword(value);
    }
    setMessage({ text: '', type: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulating an API call
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 409) {
          setMessage({
            text: 'This email is already registered. Please log in instead.',
            type: 'error'
          });
        } else {
          throw new Error(data.message || 'Registration failed');
        }
        return;
      }

      setMessage({
        text: 'Registration successful. You can now log in.',
        type: 'success'
      });
      setFormData({ name: '', email: '', password: '' });
      
    } catch (error) {
      setMessage({
        text: 'An error occurred during registration. Please try again.',
        type: 'error'
      });
    }
  };

  return (
    <div className="registration-container">
      <h1>REGISTRATION</h1>
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label htmlFor="name">Name Field</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Field</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="example@gmail.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password Field</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            required
          />
          
          <div className="password-criteria">
            <ul>
              <li className={passwordCriteria.minLength ? 'valid' : 'invalid'}>
                Minimum 8 characters
              </li>
              <li className={passwordCriteria.hasLowerCase ? 'valid' : 'invalid'}>
                One lowercase letter
              </li>
              <li className={passwordCriteria.hasUpperCase ? 'valid' : 'invalid'}>
                One uppercase letter
              </li>
              <li className={passwordCriteria.hasSpecialChar ? 'valid' : 'invalid'}>
                One special character (!@#$%^&)
              </li>
            </ul>
          </div>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <button 
          type="submit" 
          className={`register-button ${isFormValid ? 'active' : 'disabled'}`}
          disabled={!isFormValid}
        >
          REGISTER
        </button>
      </form>
    </div>
  );
}; 