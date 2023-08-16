const fs = require('fs');
const path = require('path');

const express = require('express');

const app = express();
const uuid = require('uuid');

const resData = require('./util/restaurant-data');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/restaurants', function (req, res) {
  const storedRestaurants = resData.getStoredRestaurants();

  res.render('restaurants', {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
  });
});

app.get('/restaurants/:id', function (req, res) {
  const restaurantId = req.params.id;

  const storedRestaurants = resData.getStoredRestaurants();

  for (const restaurant of storedRestaurants) {
    if (restaurant.id === restaurantId) {
      return res.render('restaurant-details', { restaurant: restaurant }); /*premier restaurant = key du template , deuxieme = const du for*/
    }
  }

  res.status(404).render('404'); /*repond page 404 si ne trouve pas le restaurant (en dehors de la boucle sinon ferait page 404 pour tous les restaurants qui ne sont pas de la meme id) et met la requete en statut 404 dans la console*/
});

app.get('/recommend', function (req, res) {
  res.render('recommend');
});

app.post('/recommend', function (req, res) {
  const restaurant = req.body;
  restaurant.id = uuid.v4(); /*method qui ajoute à l objet restaurant une nouvelle propriete : un id unique*/
  const restaurants = resData.getStoredRestaurants();

  restaurants.push(restaurant);

  resData.storeRestaurants(restaurants);

  res.redirect('/confirm');
});

app.get('/confirm', function (req, res) {
  res.render('confirm');
});

app.get('/about', function (req, res) {
  res.render('about');
});

app.use(function (req, res) {
  res.status(404).render('404');
}); /*middleware qui permet de repondre page 404 si l url n'existe pas*/

app.use(function (error, req, res, next) {
  res.status(500).render('500');
});

app.listen(3000);
