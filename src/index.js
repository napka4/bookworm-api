import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import bodyPaser from 'body-parser';
import dotenv from 'dotenv';
import Promise from 'bluebird';

import auth from './routes/auth';
import users from './routes/users';

dotenv.config();

const app = express();
app.use(bodyPaser.json());
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URL, { useMongoClient: true });

app.use('/api/auth', auth);
app.use('/api/users', users);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(8080, () => console.log('Marche sur le local serveur 8080'));