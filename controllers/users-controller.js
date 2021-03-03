const uuid = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const DUMMY_USERS = [
    {
      id: 'u1',
      name: 'Rukshan Jayasekara',
      email: 'rukshanjayasekara@outlook.com',
      password: 'rukshan123'
    },
    {
        id: 'u2',
        name: 'Leo Messi',
        email: 'messi@fcbarcelona.com',
        password: 'messi123'
      }
  ];

  const getUsers = (req, res, next) => {
    res.json({ users: DUMMY_USERS });
  };

  const signup = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs! Please check again.', 422));
    }
    
    const { name, email, password } = req.body;

    const hasUser = DUMMY_USERS.find(u => u.email === email);
    if (hasUser) {
      throw new HttpError('Could not create user, email already exists.', 422);
    }
  
    const createdUser = {
      id: uuid.v4(),
      name,
      email,
      password
    };
  
    DUMMY_USERS.push(createdUser);
  
    res.status(201).json({user: createdUser});
};

const signin = (req, res, next) => {
    const { email, password } = req.body;

    const identifiedUser = DUMMY_USERS.find(u => u.email === email);
    if (!identifiedUser || identifiedUser.password !== password) {
      throw new HttpError('Could not identify user, credentials seem to be wrong.', 401);
    }
  
    res.json({message: 'Signed in!'}); 
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.signin = signin;