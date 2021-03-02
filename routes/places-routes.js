const express = require('express');
const router = express.Router();

const HttpError = require('../models/http-error');

const DUMMY_PLACES = [
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

router.get('/:pid', (req, res, next) => {
    const placeId = req.params.pid;

    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId;
    });

    if(!place) {
        return next(new HttpError('Could not find a place.', 404));
    }
    res.json({ place });
});

router.get('/user/:uid', (req, res, next) => {
    const userId = req.params.uid;

    const places = DUMMY_PLACES.find(p => {
        return p.creator === userId;
    });
    if(!places) { 
        return next(new HttpError('Could not find a place for the provided user id.', 404));
    }
    res.json({ places });
});

module.exports = router;