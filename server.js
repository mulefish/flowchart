const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/complete', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'complete.html'));
});
app.get('/telos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'telos.html'));
});
app.get('/chart', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chart.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
