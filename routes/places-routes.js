const express = require('express');
const router = express.Router();

const placesControllers = require('../controllers/places-controller');

router.get('/:pid', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPlaceByUserId);

router.post('/:pid', placesControllers.createPlace);

router.patch('/:pid', placesControllers.updatePlaceById);

router.delete('/:pid', placesControllers.deletePlaceById);

module.exports = router;