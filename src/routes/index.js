var express = require('express');
var router = express.Router();

var middlewares = require('../middlewares');
var api = require('../api');



//* Generate a json web token based on a given
//* email in the body.
router.post('/token', [
  api.auth.token
])

//* Route to justify a text.
//* Max line length is 80 characters.
router.post('/justify',[ 
    // Private route
    middlewares.security.authenticate,
    api.text.justify
])

module.exports = router;
