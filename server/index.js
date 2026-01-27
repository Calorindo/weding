const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { generatePixPayload } = require('./utils/pix');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(bodyParser.json());

// Initialize DB if not exists
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
}

const readDb = () => {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
};

const writeDb = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// GET /api/gifts
app.get('/api/gifts', (req, res) => {
    const gifts = readDb();
    res.json(gifts);
});

// POST /api/gifts
app.post('/api/gifts', (req, res) => {
    const { name, price, imageUrl } = req.body;
    if (!name || !price) {
        return res.status(400).json({ error: 'Name and price are required' });
    }
    const gifts = readDb();
    const newGift = {
        id: Date.now().toString(),
        name,
        price: parseFloat(price),
        imageUrl: imageUrl || '',
        status: 'available' // available, selected
    };
    gifts.push(newGift);
    writeDb(gifts);
    res.json(newGift);
});

// DELETE /api/gifts/:id
app.delete('/api/gifts/:id', (req, res) => {
    const { id } = req.params;
    let gifts = readDb();
    gifts = gifts.filter(g => g.id !== id);
    writeDb(gifts);
    res.json({ success: true });
});

// POST /api/gifts/:id/select (Retrieve Pix Code)
app.post('/api/gifts/:id/select', (req, res) => {
    const { id } = req.params;
    const gifts = readDb();
    const gift = gifts.find(g => g.id === id);
    if (!gift) {
        return res.status(404).json({ error: 'Gift not found' });
    }

    // FIX: Using placeholder data if not provided
    const pixKey = "gabrielcalorindo+btg@gmail.com"; // User provided CPF
    const merchantName = "Noivo e Noiva";
    const merchantCity = "Brasil";
    const txId = gift.id; // Unique identifier for the transaction (Gift ID)

    const payload = generatePixPayload(pixKey, merchantName, merchantCity, gift.price, txId);

    res.json({
        payload,
        message: `Use this payload to pay ${gift.price} for ${gift.name}`
    });
});

// POST /api/pix (Dynamic Amount)
app.post('/api/pix', (req, res) => {
    const { amount, message, txid } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }

    // FIX: Using placeholder data if not provided
    const pixKey = "gabrielcalorindo+btg@gmail.com";
    const merchantName = "Noivo e Noiva";
    const merchantCity = "Brasil";
    const transactionId = txid || "PRESENTEPX"; // Use provided txid or generic

    const payload = generatePixPayload(pixKey, merchantName, merchantCity, parseFloat(amount), transactionId);

    res.json({
        payload,
        message: message || `Pix de R$ ${amount}`
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
