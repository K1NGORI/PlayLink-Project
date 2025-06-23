document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:5000';
    const params = new URLSearchParams(window.location.search);
    const username = params.get('user');

    const profileCardContainer = document.getElementById('profile-card-container');
    const postsList = document.getElementById('profile-posts-list');
    const itemsList = document.getElementById('profile-items-list');

    if (!username) {
        document.getElementById('profile-page').innerHTML = '<h2>Error: No user specified.</h2>';
        return;
    }

    const fetchProfileData = async () => {
        try {
            // 1. Fetch basic user info
            const userResponse = await fetch(`${apiBaseUrl}/users/${username}`);
            if (!userResponse.ok) throw new Error('User not found.');
            const user = await userResponse.json();
            
            // 2. Fetch user's posts
            const postsResponse = await fetch(`${apiBaseUrl}/posts/user/${user._id}`);
            const posts = await postsResponse.json();

            // 3. Fetch user's marketplace items
            const itemsResponse = await fetch(`${apiBaseUrl}/marketplace/user/${user._id}`);
            const items = await itemsResponse.json();
            
            // --- Now render everything ---
            document.title = `${user.username}'s Profile - Playlink`;

            // Render Profile Card
            profileCardContainer.innerHTML = `
                <div class="profile-card">
                    <img src="${user.avatar}" alt="${user.username}'s avatar" class="profile-avatar-large">
                    <h1>${user.username}</h1>
                    <div class="profile-stats">
                        <div class="stat">
                            <span>Member Since</span>
                            <p>${new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div class="stat">
                            <span>Total Posts</span>
                            <p>${posts.length}</p>
                        </div>
                        <div class="stat">
                            <span>Items for Sale</span>
                            <p>${items.filter(i => i.status === 'available').length}</p>
                        </div>
                    </div>
                </div>
            `;

            // Render Posts
            postsList.innerHTML = '';
            if (posts.length > 0) {
                posts.forEach(post => {
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="post.html?id=${post._id}">${post.title}</a>`;
                    postsList.appendChild(li);
                });
            } else {
                postsList.innerHTML = '<li>This user has not made any posts.</li>';
            }

            // Render Items
            itemsList.innerHTML = '';
            if (items.length > 0) {
                items.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="item.html?id=${item._id}">${item.itemName} - <span class="item-price">${item.price} GC</span></a>`;
                    itemsList.appendChild(li);
                });
            } else {
                itemsList.innerHTML = '<li>This user has no items for sale.</li>';
            }
            
            // Add animations
            staggeredFadeIn();

        } catch (error) {
            document.getElementById('profile-page').innerHTML = `<h2>Error: ${error.message}</h2>`;
        }
    };

    const staggeredFadeIn = () => {
        const elements = document.querySelectorAll('.profile-left, .profile-content-panel');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100 * (index + 1));
        });
    };

    fetchProfileData();
});