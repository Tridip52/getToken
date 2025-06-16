import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

const ALLOWED_ORIGIN = 'https://app.bullhornstaffing.com'; // ✅ restrict to frontend origin

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200); // ✅ Handle preflight
    }
    next();
});

app.post('/get-token', async (req, res) => {
    try {
        const body = new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: process.env.GRANT_TYPE,
            scope: process.env.SCOPE,
        });

        const response = await fetch(process.env.TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
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

export default app;
