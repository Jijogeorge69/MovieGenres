const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Film = require("./models/film_model");


app.use(bodyParser.json());
app.use(cors());


app.get("/", (req, res) => {
  res.json({ msg: "films" });
});

app.get("/api/v1/films", async (req, res) => {
  const films = await Film.find({});
  res.json(films);

});

app.get("/api/v1/films/:id", async (req, res) => {

  const id = req.params.id; 
  Film.findById(id).then(oneFilm => {
    if(!oneFilm){return res.status(404).end();}
    return res.status(200).jsonp(oneFilm);
  })
  .catch(err => next(err));
});

app.post("/api/v1/login", (req, res) => {
  const user = {
    username: req.body.username
  }
  jwt.sign( { user } , 'secretkey' , (err, token) => {
    res.json({token})
  });

});

app.post("/api/v1/films",verifyToken ,async (req, res) => {
  var getnameln=req.body.name;
  var getratingln=req.body.rating;
  if( getnameln!='' && getratingln!=null && getratingln!=''){
    const film = new Film({ name: req.body.name, rating: req.body.rating });
    const savedFilms = await film.save();
    res.json(savedFilms);
  }
  else{
    res.status(404).jsonp({
      status: 404,
      message: 'Cannot be null.'
    });
  }
});

app.patch("/api/v1/films", verifyToken ,async (req, res) => {

  const id = req.body.id;
  const rating = req.body.rating;
  Film.findById(id,function(err,getonefilm){
    getonefilm.rating= rating?rating:getonefilm.rating;
    getonefilm.save(function (err) {
      if(err) throw err;
      res.status(200).jsonp(getonefilm);
          });

  });
});

app.put("/api/v1/films/:id",verifyToken ,async (req, res) => {

  const id = req.params.id;
  const rating = req.body.rating;
  const name = req.body.name;
  if( name!='' && rating!=null && rating!=''){
  Film.findById(id,function(err,getonefilm){
    getonefilm.name= name?name:getonefilm.name;
    getonefilm.rating= rating?rating:getonefilm.rating;
    getonefilm.save(function (err) {
      if(err) throw err;
      res.status(200).jsonp(getonefilm);
          });

  });
}
else{
  res.status(404).jsonp({
    status: 404,
    message: 'Cannot be null.'
  });
}
});

app.delete("/api/v1/films", verifyToken ,function(req, res) {
  const id = req.body.id;
  Film.findById(id, function(err, getonefilm) {
    getonefilm.remove(function(err) {
      if (err) {
        return res.status(500).jsonp({
          status: 500,
          message: err.message
        });
      }
      res.status(200).jsonp({
        status: 200,
        message: 'Film deleted.'
      });
    });
  });
});

app.delete("/api/v1/films/:id" ,verifyToken ,function(req, res) {
  const id = req.params.id;
  Film.findById(id, function(err, getonefilm) {
    getonefilm.remove(function(err) {
      if (err) {
        return res.status(500).jsonp({
          status: 500,
          message: err.message
        });
      }
      res.status(200).jsonp({
        status: 200,
        message: 'Film deleted.'
      });
    });
  });
});

function verifyToken(req, res, next){
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader!== 'undefined'){
    console.log('Inside bearerheader:-'+bearerHeader)
    const bearerToken = bearerHeader.split(' ')[1];
    console.log('bearrer token:-'+bearerToken)
    jwt.verify(bearerToken, 'secretkey', (err, authData) =>{
      if(err){
        res.sendStatus(403);
      }else {
        console.log('inside next() in app.js')
        next();
        
      }
    })

  }else{
    res.sendStatus(403);
  }

}
module.exports = app;