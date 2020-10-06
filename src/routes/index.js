const express = require('express');
const router = express.Router();

const middlewares = require('../middlewares');
const api = require('../api');



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
    middlewares.security.limitRateByWords,
    api.text.justify
])

module.exports = router;
