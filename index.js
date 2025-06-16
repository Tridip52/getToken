const express = require('express');
//const fetch = require('node-fetch'); // For Node < 18; use global fetch in v18+
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = 3000;

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

function toFormUrlEncoded(obj) {
    return Object.keys(obj)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
        .join('&');
}

app.post('/get-token', async (req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://app.bullhornstaffing.com');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');


    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const params = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: process.env.GRANT_TYPE,
        scope: process.env.SCOPE
    };
    console.log(params);
    try {
        const response = await fetch(process.env.TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: toFormUrlEncoded(params)
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).send({ error: 'Token request failed', details: errorText });
        }

        const data = await response.json();
        res.json({ access_token: data.access_token });

    } catch (error) {
        console.error('Error getting token:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
