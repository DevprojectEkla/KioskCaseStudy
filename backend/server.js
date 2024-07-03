const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { parseCSV, buildTree } = require('./taxonomy');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '../frontend')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});
app.use(bodyParser.json())

app.get('/api/taxonomy', async (req, res) => {
    try {
        const nodes = await parseCSV(path.join(__dirname, './data/taxonomy.csv'));
        const tree = buildTree(nodes);
        res.json(tree);
    } catch (error) {
        res.status(500).json({ error: 'Failed to parse CSV' });
    }
});

app.post('/api/answer', (req, res) => {
    console.log(req.body)
    const { topic, label, answer } = req.body;
    console.log(`Received answer for topic "${topic}", label "${label}": ${answer}`);
    res.status(200).json({ message: 'Answer received successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

