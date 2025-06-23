document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:5000';
    const profileContainer = document.getElementById('profile-page');
    const params = new URLSearchParams(window.location.search);
    const username = params.get('user');

    if (!username) {
        profileContainer.innerHTML = '<h2>Error: No user specified.</h2>';
        return;
    }

    const fetchProfile = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/users/${username}`);
            if (!response.ok) throw new Error('User not found.');

            const user = await response.json();
            document.title = `${user.username}'s Profile - Playlink`;

            profileContainer.innerHTML = `
                <div class="profile-header">
                    <img src="${user.avatar}" alt="${user.username}'s avatar" class="profile-avatar-large">
                    <div class="profile-info">
                        <h1>${user.username}</h1>
                        <p>Member since: ${new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            `;
        } catch (error) {
            profileContainer.innerHTML = `<h2>Error: ${error.message}</h2>`;
        }
    };

    fetchProfile();
});