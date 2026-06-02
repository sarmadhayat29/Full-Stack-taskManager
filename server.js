const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
mongoose.connect('mongodb://127.0.0.1:27017/full_stack')
    .then(() => console.log('Connected to MongoDB.'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

const Item = mongoose.model('Item', itemSchema);

// API Routes

// GET all items
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find().sort({ _id: -1 });
        // Map _id to id to keep the API contract the same
        const formattedItems = items.map(item => ({
            id: item._id,
            name: item.name
        }));
        res.json(formattedItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST a new item
app.post('/api/items', async (req, res) => {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Item name is required and must be a string.' });
    }

    try {
        const newItem = new Item({ name: name.trim() });
        await newItem.save();
        res.status(201).json({ id: newItem._id, name: newItem.name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE an item
app.delete('/api/items/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const deletedItem = await Item.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ error: 'Item not found.' });
        }
        res.json({ message: 'Item deleted successfully.' });
    } catch (err) {
        // If the ID is an invalid ObjectId, mongoose might throw a CastError.
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
