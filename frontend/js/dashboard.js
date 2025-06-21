document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('playlinkUser'));

    // If no user data is found in localStorage, redirect to login page
    if (!user) {
        window.location.href = 'login.html';
        return; // Stop executing script
    }

    // Display the user's name
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        usernameDisplay.textContent = user.username;
    }
});