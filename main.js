const fs = require('fs');
const express = require('express')
const mongoose = require('mongoose');
const methodover = require('method-override');
const cookieParser = require('cookie-parser');

const pageCont = require('./controllers/pageCont')
const postCont = require('./controllers/postCont')
const userCont = require('./controllers/userCont')
const { authMiddleware, checkUser } = require('./middlewares/authMw')

const app = express();

const HOST = 'localhost';
const PORT = process.env.PORT || 5000;

app.use(methodover('_method'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(checkUser);

(function baslangic() {
    if (!fs.existsSync('public/uploads'))
        fs.mkdirSync('public/uploads')
    mongoose.set('strictQuery', false);
    mongoose.connect('mongodb://0.0.0.0:27017/cleanblog', { useNewUrlParser: true, useUnifiedTopology: true }, err => {
        if (err) throw err
        console.log('veri tabanına bağlantı başarılı');
    })
})();

app.get('/', pageCont.getAll)
app.get('/login', userCont.getLoginPage)
app.post('/login', userCont.login)
app.get('/register', userCont.getRegisterPage)
app.post('/register', userCont.register)
app.get('/logout', userCont.logout)
app.get('/:url', pageCont.servePage)
app.get('/form', authMiddleware, (req ,res) => {
    res.send('denemeeeeee')
})
app.post('/add', authMiddleware, postCont.add)
app.get('/post/:id', pageCont.getPost)
app.get('/post/edit/:id', authMiddleware, pageCont.getEditForm)
app.put('/edit', authMiddleware, postCont.edit)
app.delete('/edit', authMiddleware, postCont.delete)

app.listen(PORT, HOST, () => console.log(`${HOST}:${PORT} dinleniyor`));
