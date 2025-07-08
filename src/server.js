const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Serve all static files (HTML, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve images from the 'Image' directory
app.use('/Image', express.static(path.join(__dirname, '..', 'Image')));

// This is a fallback for Single Page Applications (SPAs). It ensures that if a user
// navigates directly to a URL like /flashcards, the server sends index.html,
// allowing the client-side JavaScript to handle the routing.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
