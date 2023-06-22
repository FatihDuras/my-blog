const Post = require('../models/Post');

class Pages {
    async getAll(req, res) {
        let page = req.query.page || 1
        let total = await Post.find({}).countDocuments();
        const data = await Post.find({}).sort('-date').skip((page - 1) * 5).limit(5);
        res.render('index', { data, page, total })
    }

    servePage(req, res) {
        if (req.params.url === 'index' || req.params.url === 'post')
            return res.redirect('/');
        res.render(req.params.url, { name: res.locals.user.name });
    }

    async getPost(req, res) {
        const post = await Post.findById(req.params.id)
        res.render('post.ejs', { post })
    }

    async getEditForm(req, res) {
        const post = await Post.findById(req.params.id);
        res.render('editform.ejs', { post })
    }

    getForm(req, res) {
        console.log('form sayfası')
        console.log(res.locals.user);
        res.render('form.ejs', { name: res.locals.user })
    }
}

module.exports = new Pages();