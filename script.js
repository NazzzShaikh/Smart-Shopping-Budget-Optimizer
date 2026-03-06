function parseArray(input) {
    return input.split(',').map(item => item.trim()).filter(item => item !== '');
}

function generateItems() {
    const n = parseInt(document.getElementById('numItems').value);
    const capacity = parseInt(document.getElementById('capacity').value);
    
    const names = ['Milk','Eggs','Bread','Phone','Laptop','Book','Pen','Bag','Shirt','Shoes'];
    const weights = [];
    const values = [];
    
    const selectedNames = [];
    for(let i = 0; i < n; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        selectedNames.push(name);
        weights.push(Math.floor(Math.random() * 40) + 1);
        values.push(Math.floor(Math.random() * 200) + 10);
    }
    
    document.getElementById('names').value = selectedNames.join(', ');
    document.getElementById('weights').value = weights.join(', ');
    document.getElementById('values').value = values.join(', ');
}

function solveKnapsack() {
    const capacity = parseInt(document.getElementById('capacity').value);
    const names = parseArray(document.getElementById('names').value);
    const weightsInput = document.getElementById('weights').value;
    const valuesInput = document.getElementById('values').value;
    
    const weights = parseArray(weightsInput).map(w => parseInt(w));
    const values = parseArray(valuesInput).map(v => parseInt(v));
    
    if (names.length !== weights.length || names.length !== values.length || names.length === 0) {
        alert('Please ensure names, weights, and values have the same number of items!');
        return;
    }

    if (capacity <= 0) {
        alert('Capacity must be greater than 0!');
        return;
    }

    // Create DP table
    const n = weights.length;
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));

    // Fill DP table
    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= capacity; w++) {
            if (weights[i-1] <= w) {
                dp[i][w] = Math.max(
                    values[i-1] + dp[i-1][w - weights[i-1]],
                    dp[i-1][w]
                );
            } else {
                dp[i][w] = dp[i-1][w];
            }
        }
    }

    // Backtrack to find selected items
    const selectedItems = [];
    let w = capacity;
    for (let i = n; i > 0 && w >= 0; i--) {
        if (dp[i][w] !== dp[i-1][w]) {
            selectedItems.push(i-1);
            w -= weights[i-1];
        }
    }

    // Calculate totals
    const totalWeight = selectedItems.reduce((sum, idx) => sum + weights[idx], 0);
    const totalValue = dp[n][capacity];

    // Display results in exact format
    document.getElementById('resultDisplay').innerHTML = `
        <div class="result-display">
            <p>Selected Items: ${selectedItems.map(idx => names[idx]).reverse().join(', ')}</p>
            <p><span class="checkmark">✔</span> Total Cost: ₹${totalWeight}</p>
            <p><span class="checkmark">✔</span> Total Value: ${totalValue}</p>
        </div>
    `;
    
    displayItems(names, weights, values, selectedItems);
    displayDPTable(dp, names, weights, capacity);  // Pass names too!
    
    document.getElementById('results').style.display = 'block';
    document.getElementById('dpTableContainer').style.display = 'block';
}

function displayItems(names, weights, values, selectedItems) {
    const container = document.getElementById('itemDisplay');
    container.innerHTML = '';
    
    for (let i = 0; i < names.length; i++) {
        const item = document.createElement('div');
        item.className = `item ${selectedItems.includes(i) ? 'selected-item' : ''}`;
        item.innerHTML = `
            <div>${names[i]}</div>
            <div>₹:${weights[i]}</div>
            <div>V:${values[i]}</div>
        `;
        container.appendChild(item);
    }
}

function displayDPTable(dp, names, weights, capacity) {
    const table = document.getElementById('dpTable');
    let html = '<tr><th>Items</th>';  // Changed header
    
    // Header (Capacity columns)
    for (let w = 0; w <= capacity; w++) {
        html += `<th>${w}</th>`;
    }
    html += '</tr>';

    // Row 0 (Empty knapsack)
    html += '<tr><th>-</th>';
    for (let w = 0; w <= capacity; w++) {
        html += `<td>0</td>`;
    }
    html += '</tr>';

    // Item rows with NAMES in first column
    const n = dp.length - 1;
    for (let i = 1; i <= n; i++) {
        html += `<tr><th>${names[i-1]}</th>`;
        for (let w = 0; w <= capacity; w++) {
            const cellClass = (i > 0 && w > 0 && dp[i][w] !== dp[i-1][w]) ? 'selected' : '';
            html += `<td class="${cellClass}">${dp[i][w]}</td>`;
        }
        html += '</tr>';
    }
    
    table.innerHTML = html;
}
