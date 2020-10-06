var jwt = require('jsonwebtoken');


module.exports = {
  authenticate(req, res, next) {
    let token = req.headers['x-api-key'];

    try {
      let data = jwt.verify(token, 'secret_key');
      return next();
    } catch {
      return res.status(401).send('UNAUTHORIZED ACTIONS');
    }
  }
}