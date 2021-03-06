var express = require('express');
var router = express.Router();

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

module.exports = function(app, Clubs){
  app.get('/', function (req, res) {
     Clubs.find({}).sort({date:-1}).exec(function(err, rawContents){ //오래된 순으로 정렬
       if(err) throw err;
         if(req.session.logined) {
          res.render('index', {contents: shuffle(rawContents), id: req.session.user_id||req.session.email });
         } else {
          res.render('index', {contents: shuffle(rawContents), id: false});
         }
      });
  })
  .get('/:page', function (req, res) {
    const page = req.params.page;
    console.log(page);
    if(page == 'index') res.redirect('/');
    else if(page == 'form'||page == 'join'||page == 'login'||page == 'root'){
      Clubs.find({}).sort({date:0}).exec(function(err, rawContents){
        if(err) throw err;
          if(req.session.logined) {
           res.render(page + '', {contents: rawContents, id: req.session.user_id||req.session.email });
          } else {
            res.render(page + '', {contents: rawContents, id: false});
          }
       });
    } 
    else {
      res.status(404).send("<script type='text/javascript'>alert(잘못된 경로입니다.);</script>");
    }
  });
}
