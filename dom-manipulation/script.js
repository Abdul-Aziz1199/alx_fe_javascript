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
  if (quotes.length === 0) {
    document.getElementById('quoteDisplay').innerText = 'No quotes available.';
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

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
}

// Add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();

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
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Create the add quote form
function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  formContainer.id = 'quoteFormContainer';

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

  document.body.appendChild(formContainer);
}

// Create export and import buttons
function createExportImportButtons() {
  const exportButton = document.createElement('button');
  exportButton.textContent = 'Export Quotes';
  exportButton.onclick = exportToJsonFile;

  const importInput = document.createElement('input');
  importInput.type = 'file';
  importInput.accept = 'application/json';
  importInput.onchange = importFromJsonFile;

  const importLabel = document.createElement('label');
  importLabel.textContent = 'Import Quotes';
  importLabel.appendChild(importInput);

  document.body.appendChild(exportButton);
  document.body.appendChild(importLabel);
}

// Initialize the application
function init() {
  loadQuotes();
  loadLastViewedQuote();
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  createAddQuoteForm();
  createExportImportButtons();
}

window.onload = init;
