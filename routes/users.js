var express = require('express');
var router = express.Router();
var authenticate = require('../authenticate');
var passport = require('passport');
User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({})
  .then((users) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      console.log(users);
      res.json(users);
  })
});
router.post('/', function(req, res, next) {
  console.log(req.body);
  res.send('respond with a resource');
});

router.post('/signup', (req,res,next) => {
    User.register(new User({
      username: req.body.username, 
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      rating : -1
      }), req.body.password,
        (err, user) => {
          if(err) {
            console.log(err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
          }
          else {
            passport.authenticate('local')(req, res, () => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, status: 'Registration Successful!'});
            });
          }
        })
})

router.post('/login', passport.authenticate('local'), (req, res) => {
    console.log(req);
    var token = authenticate.getToken({_id: req.user._id});
    User.findOne({usernmae : req.body.username})
    .then ((user) => {
      user.rating = req.body.rating;
      user.save().then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, token: token, status: 'You are successfully logged in!'});
      }, (err) => {
        console.log(err);
      })
    }) 
});

router.post('/updrating', (req, res) => {
    User.findOne({username:req.body.username})
    .then((user) => {
      user.rating = req.body.rating;
      user.save().then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
      }, (err) => {
        console.log(err);
      })
    })
})


module.exports = router;
