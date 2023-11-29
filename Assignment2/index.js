const express = require('express');
const app = express();
const port = 7007;

app.use(express.json());

app.post('/', (req, res) => {   
  try {
    const payload = req.body.str || '';
    const wordCount = (payload.match(/\b\w+\b/g) || []).length;

    if (wordCount >= 8) {
      res.status(201).json({ message: '200 OK' });
    } else {
      res.status(400).json({ error: 'Not Acceptable - At least 8 words required' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
