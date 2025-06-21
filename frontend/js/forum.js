document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:5000';
    const postsContainer = document.getElementById('posts-container');

    const fetchPosts = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/posts`);
            const posts = await response.json();
            postsContainer.innerHTML = ''; // Clear placeholder

            if (posts.length === 0) {
                postsContainer.innerHTML = '<p>No posts yet. Be the first to create one!</p>';
                return;
            }

            posts.forEach(post => {
                const postCard = document.createElement('a'); // Make the whole card a link
                postCard.href = `post.html?id=${post._id}`; // Link to detail page
                postCard.className = 'card post-card';
                
                postCard.innerHTML = `
                    <h3>${post.title}</h3>
                    <div class="card-footer">
                        <span>By: ${post.author ? post.author.username : 'Unknown'}</span>
                        <span>Posted on: ${new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                `;
                postsContainer.appendChild(postCard);
            });

        } catch (error) {
            postsContainer.innerHTML = '<div class="card-placeholder">Failed to load posts.</div>';
            console.error('Error fetching posts:', error);
        }
    };

    fetchPosts();
});