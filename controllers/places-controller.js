const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoorsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try{
        place = await Place.findById(placeId); 
    } catch(err) {
        const error = new HttpError(
            'Something went wrong. Could not find a place.',
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
            'Something went wrong, could not find places.',
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

    let user;
    try{
        user = await User.findById(creator);
    } catch(err) {
        const error = new HttpError(
            'Creating place failed, please try again.',
            500
        );
        return next(error);
    }

    if(!user) {
        const error = new HttpError('User does not exist for the provided id.', 500);
        return next(error);
    }

    try{
        const session = await mongoose.startSession();
        session.startTransaction();
        await createdPlace.save({ session: session });
        user.places.push(createdPlace);
        await user.save({ session: session});
        await session.commitTransaction();
    } catch(err) {
        const error = new HttpError(
            'Creating place failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({place: createdPlace});
};

const updatePlaceById = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs! Please check again.', 422));
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;

    let place;
    try{
        place = await Place.findById(placeId); 
    } catch(err) {
        const error = new HttpError(
            'Something went wrong. Could not find a place.',
            500
        );
        return next(error);
    }
    
    place.title = title;
    place.description = description;

    try{
        await place.save();
    } catch(err) {
        const error = new HttpError(
            'Updating place failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try{
        place = await Place.findById(placeId).populate('creator'); 
    } catch(err) {
        const error = new HttpError(
            'Something went wrong. Could not find a place.',
            500
        );
        return next(error);
    }

    if(!place) {
        const error = new HttpError('Could not find a place related to provided id.', 404);
        return next(error);
    }

    try{
        const session = await mongoose.startSession();
        session.startTransaction();
        await place.remove({ session: session });
        place.creator.places.pull(place);
        await place.creator.save({session: session });
        await session.commitTransaction();
    } catch(err) {
        const error = new HttpError(
            'Something went wrong. Could not delete the place.',
            500
        );
        return next(error);
    }
    
    res.status(200).json({message: 'Place deleted successfully.'});
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;