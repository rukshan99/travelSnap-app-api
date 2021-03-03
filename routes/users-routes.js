const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const usersControllers = require('../controllers/users-controller');

  router.get('/', usersControllers.getUsers);
  
  router.post('/signup', 
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min: 6})
  ],
  usersControllers.signup);

  router.post('/signin', usersControllers.signin);

module.exports = router;