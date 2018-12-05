import express from 'express';
import path from 'path';

const app = express();

app.post('/api/auth', (req, res) => {
    res.status(400).json({ errors: { global: "Mauvais logs !"}});
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.listen(8080, () => console.log ('Marche sur le local serveur 8080'));