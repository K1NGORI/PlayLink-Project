document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('playlinkUser'));
    const apiBaseUrl = 'http://localhost:5000';
    
    // Redirect to login if user is not logged in
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const createPostForm = document.getElementById('create-post-form');
    const formMessage = document.getElementById('form-message');

    createPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        const authorId = user.id; // Get author ID from logged-in user

        try {
            const response = await fetch(`${apiBaseUrl}/posts/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, author: authorId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data);
            }

            formMessage.style.color = 'var(--primary-neon)';
            formMessage.textContent = 'Post created successfully! Redirecting...';

            // Redirect to the main forum page after a short delay
            setTimeout(() => {
                window.location.href = 'forum.html'; // We will create this page next
            }, 2000);

        } catch (error) {
            formMessage.style.color = 'var(--secondary-neon)';
            formMessage.textContent = 'Error: ' + error.message;
        }
    });
});