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
    const incomingTradesList = document.getElementById('incoming-trades-list');
    const outgoingTradesList = document.getElementById('outgoing-trades-list');


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

const fetchTrades = async () => {
    try {
        const response = await fetch(`${apiBaseUrl}/trades/user/${user.id}`);
        const { incoming, outgoing } = await response.json();

        // Populate incoming trades
        incomingTradesList.innerHTML = '';
        if (incoming.length > 0) {
            incoming.forEach(trade => {
                const li = document.createElement('li');
                li.className = 'trade-offer-item';
                li.innerHTML = `
                    <div class="trade-info">
                        <p><b>${trade.offeredBy.username}</b> wants your <b>${trade.requestedItem.itemName}</b></p>
                        <p>They are offering: <b>${trade.offeredItem.itemName}</b></p>
                    </div>
                    <div class="trade-actions">
                        <button class="btn btn-primary btn-sm accept-trade" data-trade-id="${trade._id}">Accept</button>
                        <button class="btn btn-secondary btn-sm reject-trade" data-trade-id="${trade._id}">Reject</button>
                    </div>
                `;
                incomingTradesList.appendChild(li);
            });
        } else {
            incomingTradesList.innerHTML = '<li>No incoming trade offers.</li>';
        }

        // Populate outgoing trades
        outgoingTradesList.innerHTML = '';
        if (outgoing.length > 0) {
            outgoing.forEach(trade => {
                const li = document.createElement('li');
                li.className = 'trade-offer-item';
                li.innerHTML = `
                    <div class="trade-info">
                        <p>You offered your <b>${trade.offeredItem.itemName}</b> for <b>${trade.requestedItem.itemName}</b></p>
                        <p>Owner: <b>${trade.requestedFrom.username}</b></p>
                    </div>
                    <div class="trade-actions">
                        <button class="btn btn-secondary btn-sm cancel-trade" data-trade-id="${trade._id}">Cancel</button>
                    </div>
                `;
                outgoingTradesList.appendChild(li);
            });
        } else {
            outgoingTradesList.innerHTML = '<li>No outgoing trade offers.</li>';
        }

    } catch (error) {
        console.error('Error fetching trades:', error);
    }
};

const handleTradeAction = async (e) => {
    const tradeId = e.target.dataset.tradeId;
    let action = '';
    let newStatus = '';

    if (e.target.classList.contains('accept-trade')) {
        action = 'accept';
    } else if (e.target.classList.contains('reject-trade')) {
        action = 'update';
        newStatus = 'rejected';
    } else if (e.target.classList.contains('cancel-trade')) {
        action = 'update';
        newStatus = 'cancelled';
    } else {
        return; // Click was not on a button
    }

    try {
        const response = await fetch(`${apiBaseUrl}/trades/${tradeId}/${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, newStatus })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.Error);
        
        alert(data.message);
        fetchTrades(); // Refresh the trade lists
        
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
};

fetchTransactions();
fetchTrades();
purchasesList.addEventListener('click', handleConfirmReceipt);
incomingTradesList.addEventListener('click', handleTradeAction);
outgoingTradesList.addEventListener('click', handleTradeAction);
});