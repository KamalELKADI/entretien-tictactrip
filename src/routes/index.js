var express = require('express');
var router = express.Router();
var text = require('../api/text');


router.post('/justify', [

  //* Main function endpoint
  (req, res, next) => {
    let data = req.body;

    let justifiedText = text.justify(data)
    
    return res.status(200).send(justifiedText);
  }

])

module.exports = router;
