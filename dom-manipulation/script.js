const quotes = [
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Inspiration" },
  { text: "The way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Your time is limited, so don't waste it living someone else's life.", category: "Life" }
];

function showRandomQuote() {
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
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);

function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);

    // Clear input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    // Update DOM to reflect the newly added quote
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    // Clear previous quote
    quoteDisplay.innerHTML = '';

    // Create elements
    const quoteText = document.createElement('p');
    const quoteCategory = document.createElement('p');

    // Set text content
    quoteText.textContent = newQuote.text;
    quoteCategory.textContent = `Category: ${newQuote.category}`;

    // Style category
    quoteCategory.style.fontStyle = 'italic';

    // Append children
    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);

    alert('Quote added successfully!');
  } else {
    alert('Please enter both a quote and a category.');
  }
}

function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  formContainer.id = 'quoteFormContainer';
//generating the createAddform input field
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

// Call the function to create and add the form to the DOM
createAddQuoteForm();

