const uuid = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

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

  const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs! Please check again.', 422));
    }
    
    const { name, email, password, places } = req.body;

    let existingUser;
    try{
      existingUser = await User.findOne({ email: email});
    } catch(err) {
      const error = new HttpError(
        'Something went wrong, could not sign up.',
        500
      );
      return next(error);
    }

    if(existingUser) {
      const error = new HttpError(
        'User already exists, please sign in.',
        422
      );
      return next(error);
    }
  
    const createdUser = new User({
      name,
      email,
      password,
      image: 'https://scontent.fcmb2-1.fna.fbcdn.net/v/t1.0-9/80344383_249388319364186_3624819842248343552_n.jpg?_nc_cat=109&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=T9FwLm1fSSMAX_WYmHx&_nc_ht=scontent.fcmb2-1.fna&oh=d3f281a168e58f13895e40760d14dedc&oe=60830B43',
      places
    });

    try{
      await createdUser.save();
  } catch(err) {
      const error = new HttpError(
          'Creating user failed, please try again.',
          500
      );
      return next(error);
  }
  
    res.status(201).json({user: createdUser.toObject({ getters: true })});
};

const signin = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try{
      existingUser = await User.findOne({ email: email});
    } catch(err) {
      const error = new HttpError(
        'Something went wrong, could not sign in.',
        500
      );
      return next(error);
    }
    if(!existingUser || existingUser.password != password) {
      const error = new HttpError(
        'Invalid credentials, please try again.',
        401
      );
      return next(error);
    }
    res.json({message: 'Signed in!'}); 
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.signin = signin;