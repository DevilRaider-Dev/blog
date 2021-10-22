//import modules
const express = require('express');
require('dotenv').config();
const { MongoClient } = require('mongodb');

//get port from env
const port = process.env.PORT;

//generate app und bind public folder
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//view engine
app.set('view engine', 'ejs')

//init db connection and port listener
MongoClient.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(port, () => {
            console.log(`listening at http://localhost:${port}`);
        })
    })
    .catch(err => {
        console.error('App starting error:', err.stack);
        process.exit(1)
    });

//router
app.get('/', (req, res) => {
    res.render('index.ejs', { title: 'Blog - Articles' })
});

app.get('/new-article', (req, res) => {
    res.render('pages/new-articles.ejs', { title: 'Blog - Add Article' })
})