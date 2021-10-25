const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    published_At: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    url: {
        type: String,
        required: false
    },
    author_bild: {
        type: String,
        required: false
    }
}, { timestamps: true });

const Article = mongoose.model('articles', articleSchema);

module.exports = Article;