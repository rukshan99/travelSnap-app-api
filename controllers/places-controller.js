const uuid = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoorsForAddress = require('../util/location');
const Place = require('../models/place');
const place = require('../models/place');

let DUMMY_PLACES = [
    {
      id: 'p1',
      title: 'Empire State Building',
      description: 'One of the most famous sky scrapers in the world!',
      location: {
        lat: 40.7484474,
        lng: -73.9871516
      },
      address: '20 W 34th St, New York, NY 10001',
      creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Camp Nou',
        description: 'Largest and the most beautiful stadium in Europe.',
        location: {
          lat: 41.380896,
          lng: 2.1228198
        },
        address: 'C. d Arístides Maillol, 12, 08028 Barcelona, Spain',
        creator: 'u2'
      }
  ];

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try{
        place = await Place.findById(placeId); 
    } catch(err) {
        const error = new HttpError(
            'Something went wrong. Could not find a place',
            500
        );
        return next(error);
    }

    if(!place) {
        return next(new HttpError('Could not find a place.', 404));
    }
    res.json({ place: place.toObject({ getters: true }) });
};

const getPlaceByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let places;
    try{
        places = await Place.find({creator: userId});
    } catch(err) {
        const error = new HttpError(
            'Something went wrong, could not find places',
            500
        );
        return next(error);
    }
    if(!places || places.length === 0) { 
        return next(new HttpError('Could not find a place for the provided user id.', 404));
    }
    res.json({ places: places.map(place => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid inputs! Please check again.', 422));
    }

    const { title, description, address, creator } = req.body;

    let coordinates;
    try {
        coordinates = await getCoorsForAddress(address);
    }catch(error) {
        return next(error);
    }

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/EmpireStateNewYokCity.jpg/310px-EmpireStateNewYokCity.jpg',
        creator
    });

    try{
        await createdPlace.save();
    } catch(err) {
        const error = new HttpError(
            'Creating place failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({place: createdPlace});
};

const updatePlaceById = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs! Please check again.', 422));
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;

    const updatedPlace = {... DUMMY_PLACES.find(p => p.id === placeId)};
    const placeInex = DUMMY_PLACES.findIndex(p => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACES[placeInex] = updatedPlace;

    res.status(200).json({place: updatedPlace});
};

const deletePlaceById = (req, res, next) => {
    const placeId = req.params.pid;

    if(!DUMMY_PLACES.find(p => p.id === placeId)) {
        return next(new HttpError('Could not find the place. Please check again.', 404));
    }

    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);

    res.status(200).json({message: 'Place deleted successfully.'});
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;