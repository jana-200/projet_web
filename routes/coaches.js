const express = require('express');
const router = express.Router();
const Coach=require("../models/Coach.js");
const Message=require("../models/Message.js");

const session = require('express-session');


const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
      const date = new Date();
      const uniquePrefix = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getHours() + '-' + date.getMinutes();
      cb(null, uniquePrefix + '-' + file.originalname);
    }
})
const upload = multer({ storage: storage });


router.get('/',function (req, res, next){
    const coachesList=Coach.list();
    res.render('coaches/index.hbs',{coachesList} );
});


router.get('/details',function (req, res, next){
  req.session.canUpdate=false;
  req.session.coachDetailsErrors=null;
  let coachDetails;
  const coach=Coach.findById(req.query.id);
  
  if(isNaN(req.query.id)){ 
    req.session.coachDetailsErrors="the id you have entered is not valid, please try again";
  }

  else{
    if(coach==null){ 
      req.session.coachDetailsErrors="The coach you have selected does not exist, please select another coach !";
    } else coachDetails=coach;
  }

  if(req.session.user){ 
    if(req.query.id==req.session.user.id){ 
    req.session.canUpdate=true;
  }}
  


  res.render('coaches/details.hbs',{coachDetails});
});


router.get('/updateBio', function(req,res,next){ 
  req.session.cantUpdate=null;
  let coach=null;

  if(req.session.user.id!=req.query.id){ 
    req.session.cantUpdate="you can't have access to this page";
  }
  if(!req.session.coach){ 
    res.redirect("/coaches");
  }
  const coach_id = parseInt(req.query.id);
  coach = Coach.findById(coach_id);
  
  

  res.render('coaches/update.hbs', {coach});
  
});


router.post('/updateBio', upload.single('imageCoach'),function(req,res,next){ 
    const coach_id=req.session.user.id;
    let newBio=req.session.user.bio;
    let newPic=req.session.user.pic;


  if(req.body.biography!==req.session.user.bio){ 
    newBio=req.body.biography;
  }
  if(req.file !== undefined){ 
    newPic= '/images/'+req.file.filename;
  }
  Coach.updateBio(newBio,newPic,coach_id);
  res.redirect('/coaches/details?id='+coach_id);
});

router.post('/sendTo', function(req,res,next){
  if(req.body.message !=''){ 
    Message.sendMessage(req.session.user.id,req.body.id, req.body.message);
  }
  res.redirect('/messages');
});

module.exports = router;