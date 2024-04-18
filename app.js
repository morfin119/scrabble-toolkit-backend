const express = require('express');
const app = express();

// Define the port
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
