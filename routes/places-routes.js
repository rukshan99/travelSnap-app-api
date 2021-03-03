const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const placesControllers = require('../controllers/places-controller');

router.get('/:pid', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPlaceByUserId);

router.post('/', 
[
    check('title').not().isEmpty(), 
    check('description').isLength({min: 20}),
    check('address').not().isEmpty()
], 
placesControllers.createPlace);

router.patch('/:pid', 
[
    check('title').not().isEmpty(), 
    check('description').isLength({min: 5})
],
placesControllers.updatePlaceById);

router.delete('/:pid', placesControllers.deletePlaceById);

module.exports = router;