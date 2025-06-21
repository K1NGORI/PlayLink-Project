document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('playlinkUser'));
    const navContainer = document.getElementById('main-nav');

    let navHTML = `
        <a href="index.html" class="logo">PLAYLINK</a>
        <ul>
            <li><a href="forum.html">Forum</a></li>
            <li><a href="marketplace.html">Marketplace</a></li>
    `;

    if (user) {
        // User is logged in
        navHTML += `
            <li><a href="dashboard.html">Dashboard</a></li>
            <li><a href="#" id="logout-btn" class="btn btn-secondary">Logout</a></li>
        `;
    } else {
        // User is not logged in
        navHTML += `
            <li><a href="login.html" class="btn btn-primary">Login / Register</a></li>
        `;
    }

    navHTML += `</ul>`;
    navContainer.innerHTML = navHTML;

    // Add event listener for the logout button if it exists
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Clear user data and redirect to homepage
            localStorage.removeItem('playlinkUser');
            window.location.href = 'index.html';
        });
    }
});