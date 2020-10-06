var jwt = require('jsonwebtoken');

module.exports = {

  token(req, res, next) {
    let data = req.body;
    let emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if ( !data.email ) {
      return res.status(404).send('REQUIRED EMAIL');
    }

    if ( !emailRegexp.test(data.email) ) {
      return res.status(404).send('INVALID EMAIL');
    }
    
    let token = jwt.sign({ foo: 'bar' }, 'secret_key');

    return res.status(200).send(token);
  }

}