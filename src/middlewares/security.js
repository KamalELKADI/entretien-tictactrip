const moment = require('moment');
const m = require('../models');


module.exports = {

  async authenticate(req, res, next) {
    //* We get the token
    let token = req.headers['x-api-key'];

    //* Token is a required field
    if ( !token ) {
      return res.status(401).send('MISSING CREDENTIALS');
    }
    
    //* We check if there is a Session document related with this token
    let session = await m.Session.findOne({ token });

    if ( !session ) {
      return res.status(401).send('UNAUTHORIZED ACTIONS');
    }

    //* We inject the session document to use it later in other
    //* middlewares.
    req.injections = { session };

    return next();
  },

  //* Limit the use of the url /api/justify,
  //* By checking if the user amount of words
  //* is not higher than the maximum of words per day.
  async limitRateByWords(req, res, next) {
    let session = req.injections.session;
    let words = req.body.split(" ").filter( x => x );

    let lastUpdate = moment(session.tsUpdated).format('YYYY-MM-DD');
    let now = moment().format('YYYY-MM-DD');

    //* We are only comparing by day.
    //* The session is only updated to count words.
    //* If the last update was yesterday, the limitation rate
    //* is only per day so we are resetting words counter to zero.
    if ( lastUpdate < now ) {
      session.words = 0;
    }

    //* If the total number or words is higher than the limit,
    //* the user will need to upgrade his account.
    if ( session.words + words.length > parseInt(process.env.LIMIT_RATE_WORDS) ) {
      return res.status(402).send('Payment Required');
    } else {
      session.words += words.length;
    }

    await session.save();
    
    return next();
  }

}