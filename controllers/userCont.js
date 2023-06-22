const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserController {
  constructor() {
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.getLoginPage = this.getLoginPage.bind(this);
    this.getRegisterPage = this.getRegisterPage.bind(this);
    this.createToken = this.createToken.bind(this);
  }

  createToken(id, name) {
    return jwt.sign({ id, name }, 'jwtsecret', { expiresIn: 60 * 60 })
  }

  /**
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
   * @returns {void}
   */
  async register(req, res) {
    const { name, password } = req.body;

    console.log(name)
    console.log(password)

    let user = await User.findOne({ name })
    if (user) {
      res.locals.registerError = true;
      return this.getRegisterPage(req, res);
    }

    await User.create({ name, password });

    return this.login(req, res)
  }

  /**
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
   * @returns {void}
   */
  async login(req, res) {
    const reLogin = () => {
      res.locals.error = true;
      this.getLoginPage(req, res);
    }

    const { name, password } = req.body;

    let user = await User.findOne({ name });
    if (!user)
      return reLogin();

    let data = await bcrypt.compare(password, user.password);
    if (!data)
      return reLogin();

    let token = this.createToken(user._id, user.name);
    res.cookie('jwt', token, { httpOnly: true, sameSite: 'strict', maxAge: 60 * 60 * 1000 });

    res.redirect('/');
  }

  logout(req, res) {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
  }

  getLoginPage(req, res) {
    if (res.locals.user)
      res.redirect('/');

    res.render('login.ejs', { error: res.locals.error });
  }

  getRegisterPage(req, res) {
    res.render('register.ejs', { error: res.locals.registerError });
  }
}

module.exports = new UserController();