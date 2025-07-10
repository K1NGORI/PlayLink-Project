document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('playlinkUser'));
    const apiBaseUrl = 'http://localhost:5000';
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const createItemForm = document.getElementById('create-item-form');
    const formMessage = document.getElementById('form-message');

    createItemForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const itemName = document.getElementById('item-name').value;
        const imageUrl = document.getElementById('item-image-url').value; // Get the new field's value
        const description = document.getElementById('item-description').value;
        const price = document.getElementById('item-price').value;
        const sellerId = user.id;

        try {
            const response = await fetch(`${apiBaseUrl}/marketplace/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    itemName, 
                    description, 
                    price, 
                    seller: sellerId,
                    imageUrl // Send the image URL to the backend
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.Error || 'Failed to list item.');

            formMessage.style.color = 'var(--primary-neon)';
            formMessage.textContent = 'Item listed successfully! Redirecting...';

            setTimeout(() => {
                window.location.href = 'marketplace.html';
            }, 2000);

        } catch (error) {
            formMessage.style.color = 'var(--secondary-neon)';
            formMessage.textContent = 'Error: ' + error.message;
        }
    });
});