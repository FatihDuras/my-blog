const Post = require('../models/Post')

class Posts {
    async add(req, res) {
        await Post.create(req.body)
        res.redirect('/');
    }

    async edit(req, res) {
        let id = req.body.id;
        delete req.body.id
        await Post.findByIdAndUpdate(id, req.body)
        res.redirect(`/post/${id}`)
    }

    async delete(req, res) {
        await Post.findByIdAndDelete(req.body.id);
        res.redirect('/');
    }
}

module.exports = new Posts();