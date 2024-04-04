const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = 'materials.json';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/materials', (req, res) => {
    fs.readFile(DB_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.post('/materials', (req, res) => {
    const { name, quantity, note, entryName, entryDate } = req.body;

    // Ensure all required fields are present
    if (!name || !quantity || !note || !entryName || !entryDate) {
        res.status(400).send('Missing required fields');
        return;
    }

    // Load existing materials data
    fs.readFile(DB_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Parse existing materials data
        const materials = JSON.parse(data);

        // Add new material entry
        materials.push({ name, quantity, note, entryName, entryDate });

        // Write updated materials data to file
        fs.writeFile(DB_FILE, JSON.stringify(materials, null, 4), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.status(201).send('Material added successfully');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
