document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:5000';
    const postDetailContainer = document.getElementById('post-detail');

    // Get the post ID from the URL
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    if (!postId) {
        postDetailContainer.innerHTML = '<h2>Error: Post ID not found.</h2>';
        return;
    }

    const fetchPost = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/posts/${postId}`);
            const post = await response.json();

            if (!post) {
                postDetailContainer.innerHTML = '<h2>Error: Post not found.</h2>';
                return;
            }

            document.title = `${post.title} - Playlink`; // Update the page title

            const authorUsername = post.author ? post.author.username : 'Unknown';
postDetailContainer.innerHTML = `
    <div class="post-full-content">
        <h1>${post.title}</h1>
        <div class="post-meta">
            By <a href="profile.html?user=${authorUsername}" class="user-link">${authorUsername}</a> on ${new Date(post.createdAt).toLocaleDateString()}
        </div>
        // ...
    </div>
`;
        } catch (error) {
            postDetailContainer.innerHTML = '<h2>Error loading post.</h2>';
            console.error('Error fetching post:', error);
        }
    };

    fetchPost();
});