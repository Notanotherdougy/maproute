const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const dataFilePath = path.join(__dirname, 'data.json');

app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify({ contacts: [], routes: [] }, null, 2));
}

// Read data from file
const readData = () => {
    return JSON.parse(fs.readFileSync(dataFilePath));
};

// Write data to file
const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

app.post('/contacts', (req, res) => {
    const { name, address } = req.body;
    if (!name || !address) {
        return res.status(400).json({ error: 'Name and address are required' });
    }

    const data = readData();
    data.contacts.push({ name, address });
    writeData(data);

    res.json({ message: 'Contact saved', contacts: data.contacts });
});

app.get('/contacts', (req, res) => {
    const data = readData();
    res.json(data.contacts);
});

app.post('/routes', (req, res) => {
    const { addresses } = req.body;
    if (!addresses || addresses.length < 2) {
        return res.status(400).json({ error: 'At least two addresses are required' });
    }

    const data = readData();
    data.routes.push({ addresses, date: new Date().toISOString() });
    writeData(data);

    res.json({ message: 'Route saved', routes: data.routes });
});

app.get('/routes', (req, res) => {
    const data = readData();
    res.json(data.routes);
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
