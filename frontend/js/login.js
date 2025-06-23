document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:5000';
    
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const formMessage = document.getElementById('form-message');

    // Toggle to Register form
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        formMessage.textContent = '';
    });

    // Toggle to Login form
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
        formMessage.textContent = '';
    });

    // Handle Registration
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await fetch(`${apiBaseUrl}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data);
            }

            formMessage.style.color = 'var(--primary-neon)';
            formMessage.textContent = 'Registration successful! Please login.';
            registerForm.reset();
            // Switch to login form after successful registration
            showLoginLink.click(); 

        } catch (error) {
            formMessage.style.color = 'var(--secondary-neon)';
            formMessage.textContent = error.message;
        }
    });

    // Handle Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch(`${apiBaseUrl}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.Error || 'Login failed');
            }

            // Save user data to localStorage
            localStorage.setItem('playlinkUser', JSON.stringify(data.user));

            // Redirect to the account page
            window.location.href = 'account.html';

        } catch (error) {
            formMessage.style.color = 'var(--secondary-neon)';
            formMessage.textContent = error.message;
        }
    });
});