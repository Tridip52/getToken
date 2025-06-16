const express = require('express');
//const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());

const ALLOWED_ORIGIN = 'https://app.bullhornstaffing.com';

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200); // Respond to preflight
    }

    next();
});

app.post('/get-token', async (req, res) => {
    try {
        const params = new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: process.env.GRANT_TYPE,
            scope: process.env.SCOPE
        });

        const response = await fetch(process.env.TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Token error:', data);
            return res.status(401).json({ error: 'Unauthorized', details: data });
        }

        res.status(200).json({ token: data.access_token });
    } catch (err) {
        console.error('Internal error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Only required if running locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
