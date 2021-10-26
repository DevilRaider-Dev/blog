//import modules
const express = require('express');
const mongoose = require('mongoose')
const formidable = require('formidable');
const Article = require('./models/article')
require('dotenv').config();

let date = new Date();
let dateString = date.getMonth() + " " + date.getDay() + ", " + date.getFullYear()
console.log(dateString)
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
            res.render('index', { title: 'Blog - Home', articles })
        })
        .catch(err => console.log(err))
});

app.get('/all', (req, res) => {
    Article.find()
        .then(articles => {
            res.render('./pages/all', { title: 'Blog - All Articles', articles })
        })
        .catch(err => console.log(err))
});

app.get('/article/:id', (req, res) => {
    Article.findById(req.params.id)
        .then(article => {
            res.render('./pages/article', { title: 'Blog - Read Article', article })
        })
        .catch(err => console.log(err))
})

app.get('/new-article', (req, res) => {
    res.render('pages/new-article.ejs', { title: 'Blog - Add Article' })
})

app.post('/save-article', (req, res, next) => {
    const form = formidable({ multiples: true, uploadDir: './public/assets/img/uploads', keepExtensions: true });

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log(err)
            next(err);
            return;
        }

        let date = new Date();
        let dateString = date.getMonth() + " " + date.getDay() + ", " + date.getFullYear()
        console.log(dateString)

        let url = "\\uploads\\" + files.url.path.split('\\').pop()

        let newArticle = new Article({
            title: fields.title,
            url: url,
            duration: fields.duration,
            author: fields.author,
            author_bild: fields.author_bild,
            body: fields.body,
            published_at: dateString
        })

        console.log(newArticle)

        newArticle.save()
            .then(result => {
                console.log(result)
                res.redirect('/all')
            })
            .catch(err => console.log(err))

        // res.json({ fields, files });
    });
});