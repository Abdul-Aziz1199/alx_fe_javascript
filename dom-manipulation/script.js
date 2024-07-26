const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; 
let quotes = [
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Inspiration" },
  { text: "The way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Your time is limited, so don't waste it living someone else's life.", category: "Life" }
];

// Load existing quotes from local storage on initialization
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Show a random quote
function showRandomQuote() {
  const filteredQuotes = getFilteredQuotes();
  if (filteredQuotes.length === 0) {
    document.getElementById('quoteDisplay').innerText = 'No quotes available.';
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  displayQuote(quote);
  saveLastViewedQuote(randomIndex);
}

// Save last viewed quote index to session storage
function saveLastViewedQuote(index) {
  sessionStorage.setItem('lastViewedQuote', index);
}

// Load last viewed quote index from session storage
function loadLastViewedQuote() {
  const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastViewedQuote !== null && quotes[lastViewedQuote]) {
    const quote = quotes[lastViewedQuote];
    displayQuote(quote);
  }
}

// Display a quote
function displayQuote(quote) {
  const quoteDisplay = document.getElementById('quoteDisplay');
  
  // Clear previous quote
  quoteDisplay.innerHTML = '';

  // Create elements
  const quoteText = document.createElement('p');
  const quoteCategory = document.createElement('p');

  // Set text content
  quoteText.textContent = quote.text;
  quoteCategory.textContent = `Category: ${quote.category}`;

  // Style category
  quoteCategory.style.fontStyle = 'italic';

  // Append children
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// Add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();

    populateCategories();
    syncWithServer(newQuote, 'POST');

    // Clear input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    alert('Quote added successfully!');
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Create the add quote form
function createAddQuoteForm() {
  const formContainer = document.getElementById('quoteFormContainer');

  const newQuoteText = document.createElement('input');
  newQuoteText.id = 'newQuoteText';
  newQuoteText.type = 'text';
  newQuoteText.placeholder = 'Enter a new quote';

  const newQuoteCategory = document.createElement('input');
  newQuoteCategory.id = 'newQuoteCategory';
  newQuoteCategory.type = 'text';
  newQuoteCategory.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.onclick = addQuote;

  formContainer.appendChild(newQuoteText);
  formContainer.appendChild(newQuoteCategory);
  formContainer.appendChild(addButton);
}

// Get filtered quotes based on the selected category
function getFilteredQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  if (selectedCategory === 'all') {
    return quotes;
  }
  return quotes.filter(quote => quote.category === selectedCategory);
}

// Filter quotes based on selected category
function filterQuotes() {
  showRandomQuote();
  saveSelectedCategory();
}

// Save selected category to local storage
function saveSelectedCategory() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory);
}

// Load selected category from local storage
function loadSelectedCategory() {
  const selectedCategory = localStorage.getItem('selectedCategory');
  if (selectedCategory) {
    document.getElementById('categoryFilter').value = selectedCategory;
    filterQuotes();
  }
}

// Populate categories dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(quote => quote.category))];

  // Clear existing options except 'all'
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
  // Add new categories
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Sync with server
async function syncWithServer(quote, method) {
  try {
    const response = await fetch(SERVER_URL, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quote)
    });
    if (response.ok) {
      console.log('Quote synced with server');
    } else {
      console.error('Failed to sync with server');
    }
  } catch (error) {
    console.error('Error syncing with server:', error);
  }
}

// Fetch quotes from server periodically
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    if (response.ok) {
      const serverQuotes = await response.json();
      resolveConflicts(serverQuotes);
    } else {
      console.error('Failed to fetch quotes from server');
    }
  } catch (error) {
    console.error('Error fetching quotes from server:', error);
  }
}

// Resolve conflicts between local and server quotes
function resolveConflicts(serverQuotes) {
  const localQuotes = new Map(quotes.map(quote => [quote.text, quote]));

  serverQuotes.forEach(serverQuote => {
    if (!localQuotes.has(serverQuote.text)) {
      quotes.push(serverQuote);
    }
  });

  saveQuotes();
  populateCategories();
  alert('Quotes updated from server');
}

// Sync quotes periodically
function syncQuotes() {
  setInterval(fetchQuotesFromServer, 60000); // Fetch quotes from server every 60 seconds
}

// Initialize the application
function init() {
  loadQuotes();
  populateCategories();
  loadSelectedCategory();
  loadLastViewedQuote();
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  createAddQuoteForm();
  document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);
  document.getElementById('importQuotes').addEventListener('change', importFromJsonFile);

  syncQuotes(); // Start periodic syncing
}

window.onload = init;
