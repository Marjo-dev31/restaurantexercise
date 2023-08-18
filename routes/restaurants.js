const express = require('express');

const router = express.Router();

const uuid = require('uuid');


const resData = require('../util/restaurant-data');

router.get('/restaurants', function (req, res) {  
    let order = req.query.order;
    let nextOrder = 'desc'
    
    if (order !== 'asc' && order !== 'desc') {
       order = 'asc';
    };

    if (order === 'desc') {
        nextOrder = 'asc';
    };

    const storedRestaurants = resData.getStoredRestaurants();

    storedRestaurants.sort(function(resA, resB) {
        if ((order === 'asc' && resA.name > resB.name) || (order === 'desc' && resB.name > resA.name)) {
            return 1;
        }
        return -1;
    });

    res.render('restaurants', {
        numberOfRestaurants: storedRestaurants.length,
        restaurants: storedRestaurants,
        nextOrder: nextOrder
    });
});

router.get('/restaurants/:id', function (req, res) {
    const restaurantId = req.params.id;

    const storedRestaurants = resData.getStoredRestaurants();

    for (const restaurant of storedRestaurants) {
        if (restaurant.id === restaurantId) {
            return res.render('restaurant-details', { restaurant: restaurant }); /*premier restaurant = key du template , deuxieme = const du for*/
        }
    }

    res.status(404).render('404'); /*repond page 404 si ne trouve pas le restaurant (en dehors de la boucle sinon ferait page 404 pour tous les restaurants qui ne sont pas de la meme id) et met la requete en statut 404 dans la console*/
});

router.get('/recommend', function (req, res) {
    res.render('recommend');
});

router.post('/recommend', function (req, res) {
    const restaurant = req.body;
    restaurant.id = uuid.v4(); /*method qui ajoute à l objet restaurant une nouvelle propriete : un id unique*/
    const restaurants = resData.getStoredRestaurants();

    restaurants.push(restaurant);

    resData.storeRestaurants(restaurants);

    res.redirect('/confirm');
});

router.get('/confirm', function (req, res) {
    res.render('confirm');
});

module.exports = router;