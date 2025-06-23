document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('playlinkUser'));
    const apiBaseUrl = 'http://localhost:5000';

    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Display username
    document.getElementById('username-display').textContent = user.username;

    const purchasesList = document.getElementById('purchases-list');
    const salesList = document.getElementById('sales-list');

    const fetchTransactions = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/transactions/user/${user.id}`);
            const { purchases, sales } = await response.json();

            // Populate purchases
            purchasesList.innerHTML = '';
            if (purchases.length > 0) {
                purchases.forEach(tx => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span>${tx.item.itemName}</span>
                        <button class="btn btn-secondary btn-sm" data-tx-id="${tx._id}">Confirm Receipt</button>
                    `;
                    purchasesList.appendChild(li);
                });
            } else {
                purchasesList.innerHTML = '<li>No pending purchases.</li>';
            }
            
            // Populate sales
            salesList.innerHTML = '';
            if (sales.length > 0) {
                sales.forEach(tx => {
                    const li = document.createElement('li');
                    li.innerHTML = `<span>${tx.item.itemName} (Awaiting buyer confirmation)</span>`;
                    salesList.appendChild(li);
                });
            } else {
                salesList.innerHTML = '<li>No pending sales.</li>';
            }

        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const handleConfirmReceipt = async (e) => {
        if (e.target.matches('button[data-tx-id]')) {
            const txId = e.target.dataset.txId;
            if (confirm('Are you sure you have received this item? This will release payment to the seller and cannot be undone.')) {
                try {
                    const response = await fetch(`${apiBaseUrl}/transactions/${txId}/complete`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: user.id })
                    });
                    
                    const data = await response.json();
                    if (!response.ok) throw new Error(data);
                    
                    // Refresh the transaction lists
                    fetchTransactions();

                } catch (error) {
                    alert('Error: ' + error.message);
                }
            }
        }
    };

    fetchTransactions();
    // Add a single event listener to the list for handling all button clicks
    purchasesList.addEventListener('click', handleConfirmReceipt);
});