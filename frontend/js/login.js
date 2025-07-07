document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:5000';
    
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const formMessage = document.getElementById('form-message');

    // Toggle to Register form
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
            formMessage.textContent = '';
        });
    }

    // Toggle to Login form
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
            formMessage.textContent = '';
        });
    }

    // Handle Registration
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // (Registration logic is likely fine, no changes needed here)
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
                if (!response.ok) throw new Error(data);
                formMessage.style.color = 'var(--primary-neon)';
                formMessage.textContent = 'Registration successful! Please login.';
                registerForm.reset();
                showLoginLink.click();
            } catch (error) {
                formMessage.style.color = 'var(--secondary-neon)';
                formMessage.textContent = error.message;
            }
        });
    }

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                console.log('Attempting to log in...'); // DEBUG
                const response = await fetch(`${apiBaseUrl}/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.Error || 'Login failed');
                }

                console.log('Login successful! User data received:', data.user); // DEBUG

                // THIS IS THE CRITICAL PART: Save user data to browser's localStorage
                localStorage.setItem('playlinkUser', JSON.stringify(data.user));
                console.log('User data saved to localStorage.'); // DEBUG

                // Redirect to the account page after successful login
                console.log('Redirecting to account.html...'); // DEBUG
                window.location.href = 'account.html';

            } catch (error) {
                console.error('Login failed:', error); // DEBUG
                formMessage.style.color = 'var(--secondary-neon)';
                formMessage.textContent = error.message;
            }
        });
    }
});