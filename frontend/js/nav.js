// This function will build the navigation bar. We can call it anytime we need to update the UI.
function renderNavbar() {
    const user = JSON.parse(localStorage.getItem('playlinkUser'));
    const navContainer = document.getElementById('main-nav');

    if (!navContainer) return; // Exit if the nav element doesn't exist on the page

    let navHTML = `
        <a href="index.html" class="logo">PLAYLINK</a>
        <ul>
            <li><a href="forum.html">Forum</a></li>
            <li><a href="marketplace.html">Marketplace</a></li>
    `;

    if (user) {
        // User is logged in
        navHTML += `
            <li class="nav-balance"><i class="fa-solid fa-coins"></i> ${user.gc_balance} GC</li>
            <li><a href="account.html">My Account</a></li>
            <li>
                <a href="profile.html?user=${user.username}" class="nav-profile-link">
                    <img src="${user.avatar}" alt="My Avatar" class="nav-avatar">
                    <span>${user.username}</span>
                </a>
            </li>
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

    // Re-add the event listener for the logout button if it exists
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('playlinkUser');
            window.location.href = 'index.html';
        });
    }
}

// Run the function once when the page initially loads.
document.addEventListener('DOMContentLoaded', renderNavbar);