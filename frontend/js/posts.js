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

            postDetailContainer.innerHTML = `
                <div class="post-full-content">
                    <h1>${post.title}</h1>
                    <div class="post-meta">
                        By ${post.author ? post.author.username : 'Unknown'} on ${new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    <div class="post-body">
                        ${post.content.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `;
        } catch (error) {
            postDetailContainer.innerHTML = '<h2>Error loading post.</h2>';
            console.error('Error fetching post:', error);
        }
    };

    fetchPost();
});