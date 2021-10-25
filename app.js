//import modules
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose')
const Article = require('./models/article')

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
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(port, () => {
            console.log(`db connected and listening at http://localhost:${port}`);
        })
    })
    .catch(err => {
        console.error('App starting error:', err.stack);
        process.exit(1)
    });

//router
app.get('/', (req, res) => {
    Article.find().limit(10)
        .then(articles => {
            res.render('index', { title: 'Blog - Articles', articles })
        })
        .catch(err => console.log(err))
});

app.get('/new-article', (req, res) => {
    res.render('pages/new-article.ejs', { title: 'Blog - Add Article' })
})