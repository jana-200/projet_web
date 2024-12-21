const express = require('express');
const router = express.Router();
const Tournament=require('../models/Tournament.js');
const validator = require('validator');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        const date = new Date();
        const uniquePrefix = date.getFullYear() + '-' + (date.getMonth() + 1) + 
        '-' + date.getDate() + '-' + date.getHours() + '-' + date.getMinutes() + 
        '-' + date.getSeconds();
        cb(null, uniquePrefix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

//Go to Tournament page
router.get('/',(req,res)=>{
  let tournament_table=Tournament.list();
  let no_tournaments=false;
  let tournaments_exist=false;
  if(tournament_table.length==0){
    console.table(tournament_table);
    no_tournaments=true;
    
  }else{
    tournaments_exist=true;
   
  }
 
  res.render('tournaments/index.hbs',{tournament_table,no_tournaments,tournaments_exist});
});


//Go to details page for a specific tournament
router.get('/details',(req,res)=>{
  req.session.future_date=false;

  const tournament_id= parseInt(req.query.tournament_id);
  const tournament_detail=Tournament.detailslist(req.query.tournament_id);
  const number=Tournament.alreadyRegister(req.query.tournament_id);
  req.session.idTournament=req.query.tournament_id;
  
  if(isNaN(tournament_id)){
    req.session.error_id="This id isn't a number !";
    req.session.id_exists=null;
  }else if(tournament_detail==undefined){
    
      req.session.error_id="This id doesn't exist !";
      req.session.id_exists=null;
    
    }else{
      req.session.id_exists=true;
      req.session.error_id=null;
      let date=new Date();
      let date_string = date.toJSON().slice(0,10);
      const current_date=new Date(date_string);

      req.session.participants_number = false;

      if(number.number_of_registration<tournament_detail.nb_max_participants){
        req.session.participants_number = true;
      }
    
    if(req.session.user){
      if(new Date(tournament_detail.date_tournament)>current_date&&number.number_of_registration<tournament_detail.nb_max_participants){
        req.session.future_date=true;
        const user_id=req.session.user.id;
        req.session.is_registered=Tournament.isRegistered(user_id,tournament_id );
      }
   }
 }
  res.render('tournaments/details.hbs',{tournament_detail,number});
});


//Register the user for a specific tournament if he isn't present in this tournament
 router.post('/register',(req,res)=>{
  const user_id=req.session.user.id;
 
  if(req.session.user && !Tournament.isRegistered(user_id)){
    const tournament_id= req.body.id;
    
    Tournament.registration(user_id,tournament_id);
    res.redirect('/tournaments/details?tournament_id='+tournament_id);
  }
});

//Unregister the user if he is present for a specific tournament
router.post('/unregister',(req,res)=>{
  const tournament_id= req.body.id;
  const user_id=req.session.user.id;
  
  if(req.session.user && Tournament.isRegistered(user_id)!=undefined){
    
    Tournament.unregister(user_id);
    res.redirect('/tournaments/details?tournament_id='+tournament_id);
  }
});

// If the user is a coach ,he can create a tournament
router.get('/create',(req,res)=>{
  if(!req.session.coach){ 
    res.redirect('/tournaments');
  }
  
  res.render('tournaments/tournamentsCreation.hbs',{tableError:req.session.tableError});
  req.session.tableError=null;
});

//Create a tournament 
router.post('/create',upload.single('ImageTournament'),(req,res)=>{
  req.session.tableError=[];
  
  
  
  if(validator.isEmpty(req.body.tournamentName)){
    req.session.tableError.push("Please enter a Tournament name !");
  }
  if(Tournament.tournament_name_exists(req.body.tournamentName)){
      req.session.tableError.push("This tournament name alredy exists,please choose another name !");
      console.table(req.session.tableError);
  }
  
  let date=new Date().toJSON().slice(0,10);  
  if(req.body.tournamentDate<=date){
    req.session.tableError.push("the date must be after the current date !");
  }
  
  if(req.body.number<=1){
     req.session.tableError.push("The maximum number of participants is minimum 2 !");
  }
  if(req.file==undefined){
    req.session.tableError.push("You must have an image ! ");
  }

  if(req.session.tableError.length==0){
    const user_id=req.session.user.id;
    req.file.filename= "/images/"+req.file.filename;
    Tournament.createTournament(req.body.tournamentName,user_id,req.body.tournamentDate,req.body.number,req.file.filename);
    res.redirect("/tournaments");
  }else{
    res.redirect('/tournaments/create');
  }
});

module.exports = router;