require('dotenv').config();
const express = require('express');

const app = express();

app.use(express.json());

app.post('/get-token', async (req, res) => {
    try {
        const params = new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: process.env.GRANT_TYPE,
            scope: process.env.SCOPE
        });

        console.log('🔍 Sending request with:', params.toString());

        const response = await fetch(process.env.TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });

        const data = await response.json();
        console.log('📥 Paylocity response:', data);

        if (!response.ok) {
            return res.status(401).json({ error: 'Unauthorized', details: data });
        }

        res.json({ token: data.access_token });

    } catch (error) {
        console.error('🔥 Internal Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(3000, () => {
    console.log('🚀 Server running on port 3000');
});
