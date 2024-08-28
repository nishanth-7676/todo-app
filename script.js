const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const addEntryButton = document.getElementById('add-entry');
const entriesList = document.getElementById('entries-list');
const totalIncome = document.getElementById('total-income');
const totalExpenses = document.getElementById('total-expenses');
const netBalance = document.getElementById('net-balance');
const filterRadios = document.querySelectorAll('input[name="filter"]');

let entries = JSON.parse(localStorage.getItem('entries')) || [];

function renderEntries() {
    entriesList.innerHTML = '';
    const filter = document.querySelector('input[name="filter"]:checked').value;
    const filteredEntries = entries.filter(entry => filter === 'all' || entry.type === filter);
    
    filteredEntries.forEach((entry, index) => {
        const entryElement = document.createElement('li');
        entryElement.innerHTML = `
            <span>${entry.description} - $${entry.amount.toFixed(2)}</span>
            <div class="entry-actions">
                <button class="edit" onclick="editEntry(${index})">Edit</button>
                <button class="delete" onclick="deleteEntry(${index})">Delete</button>
            </div>
        `;
        entriesList.appendChild(entryElement);
    });

    updateSummary();
}

function updateSummary() {
    const income = entries.filter(entry => entry.type === 'income').reduce((sum, entry) => sum + entry.amount, 0);
    const expenses = entries.filter(entry => entry.type === 'expense').reduce((sum, entry) => sum + entry.amount, 0);
    const balance = income - expenses;

    totalIncome.textContent = `$${income.toFixed(2)}`;
    totalExpenses.textContent = `$${expenses.toFixed(2)}`;
    netBalance.textContent = `$${balance.toFixed(2)}`;
}

function addEntry() {
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());
    if (!description || isNaN(amount)) return alert('Please fill in all fields correctly.');

    const entry = {
        description,
        amount,
        type: amount > 0 ? 'income' : 'expense',
    };

    entries.push(entry);
    saveEntries();
    renderEntries();
    descriptionInput.value = '';
    amountInput.value = '';
}

function editEntry(index) {
    const entry = entries[index];
    descriptionInput.value = entry.description;
    amountInput.value = entry.amount;
    entries.splice(index, 1);
    renderEntries();
}

function deleteEntry(index) {
    entries.splice(index, 1);
    saveEntries();
    renderEntries();
}

function saveEntries() {
    localStorage.setItem('entries', JSON.stringify(entries));
}

addEntryButton.addEventListener('click', addEntry);
filterRadios.forEach(radio => radio.addEventListener('change', renderEntries));

renderEntries();
