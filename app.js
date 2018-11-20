const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const rndstring = require("randomstring");
const path = require("path");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const multer = require("multer");
//서버 생성
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  limit: '1gb',
  extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(express.session({
  key: 'sid', // 세션키
  secret: 'secret', // 비밀키
  cookie: {
    maxAge: 1000 * 60 * 60 // 쿠키 유효기간 1시간
  }
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//module setting
var Users = require("./mongo/usersSchema");
var Clubs = require("./mongo/clubsSchema");
const db = require("./mongo");

//module setting
// import { Users, Hackathons } from './mongo';
// require('./func')
// let passport = require('./passport')(Users, rndstring);
//
// //라우터
// // let auth = require('./routes/auth/auth')(app);
// // app.use('/', auth);
// // var router = require('./routes')(app, Users);
// app.post('/test', function(req, res){
//   console.log(req.body);
// });

//서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, function(){
  console.log('server running');
});

require('./routes/auth/auth')(app, Users, rndstring);
require('./routes/club/viewClub')(app, Clubs, Users, rndstring);
require('./routes/club/setClub')(app, Clubs, Users, rndstring);
require('./routes/apply/apply')(app, Clubs, rndstring);
require('./routes/index')(app, Clubs);
