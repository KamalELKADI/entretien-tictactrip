const crypto = require('crypto');
const m = require('../models');


module.exports = {

  async token(req, res, next) {
    //* We need an email to get a token
    let data = req.body;
    let emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    //* Email is a required field
    if ( !data.email ) {
      return res.status(404).send('REQUIRED EMAIL');
    }

    //* And need to be valid
    if ( !emailRegexp.test(data.email) ) {
      return res.status(404).send('INVALID EMAIL');
    }
    
    let email = data.email;

    //* We are looking for maybe an existing session
    let session = await m.Session.findOne({ email: email });
    if ( !session ) {
      //* If there is no session, we generate a token,
      //* and create a new one.
      let token = crypto.randomBytes(64).toString('hex');
      session = await m.Session.create({ email, token })
    }

    //* We return the generated token
    return res.status(200).send(session.token);
  }

}