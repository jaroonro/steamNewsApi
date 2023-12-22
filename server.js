const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: 'GET',
  credentials: true,
}));

app.use(express.static('public'));

app.get('/api/news', async (req, res) => {
  const { appId } = req.query;

  if (!appId) {
    return res.status(400).json({ error: 'Missing appId in the request' });
  }

  try {
    const { default: fetch } = await import('node-fetch');
    const response = await fetch(`https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=${appId}&count=31&maxlength=300&format=json`);

    if (!response.ok) {
      console.error('Error fetching news. Response:', await response.text());
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/api/Search', async (req, res) => {
  const { text} = req.query;

  if (!text) {
    return res.status(400).json({ error: 'Missing appId in the request' });
  }

  try {
    console.log('Before fetch');
    const { default: fetch } = await import('node-fetch');
    const response = await fetch(`https://steamcommunity.com/actions/SearchApps/${text}/`);
    console.log('After fetch');

    if (!response.ok) {
      console.error('Error fetching news. Response:', await response.text());
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});