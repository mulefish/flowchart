const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('datepicker', (req, res) => { 
	res.sendFile(path.join(__dirname, 'public','datepicker.html'));
} ); 
app.get('/endpoints', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'endpoints.html'));
}); 

app.get('/complete', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'complete.html'));
});
app.get('/xxxxx', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'xxxxx.html'));
});
app.get('/chart', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chart.html'));
});
app.get('/1661', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '1661.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
