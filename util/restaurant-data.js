const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, '..','data', 'restaurants.json'); /* '..' permet de remonter de niveau*/

function getStoredRestaurants() {
    const fileData = fs.readFileSync(filePath);
    const storedRestaurants = JSON.parse(fileData);

    return storedRestaurants;
};

function storeRestaurants(storableRestaurants) {
    fs.writeFileSync(filePath, JSON.stringify(storableRestaurants));
};

module.exports = {
    getStoredRestaurants: getStoredRestaurants, /*le premier est la key utilisée dans les autres fichiers, le second reprend le nom à la ligne 5*/
    storeRestaurants: storeRestaurants
};