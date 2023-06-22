const { Schema, model } = require('mongoose')

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: String,
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: 'dr. watson'
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = model('content', PostSchema)
