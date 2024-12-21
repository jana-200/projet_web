const express = require('express');
const router = express.Router();

const Court = require("../models/Court.js");
const { isAfter } = require('validator');
const { log, error } = require('console');

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
})

const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    const courtsTable = Court.orderedList();
    let displayButtonUpdate = false;
    if(req.session.coach){
        displayButtonUpdate=true;
    }
    res.render('courts/index.hbs',{courtsTable,displayButtonUpdate });
});

formNumberToDay=(num)=>{
    if(num === 0) return 'Sunday';
    if(num === 1) return 'Monday';
    if(num === 2) return 'Tuesday';
    if(num === 3) return 'Wednesday';
    if(num === 4) return 'Thursday';
    if(num === 5) return 'Friday';
    if(num === 6) return 'Saturday';
}

router.get('/details', (req, res) => {
    
    const details = Court.courtDetails(req.query.id);
    let error =null;
    if(isNaN(req.query.id) || details==null){
        error = "The court you have selected does not exist, please select another one"
    }
   
    let dateOption = new Date();
    const dataToSend = [];

    for(let i=1; i<= 7; i++){

        dateOption.setDate(dateOption.getDate() +1);
        let BookOptdate =dateOption.toJSON().slice(0,10);

        dataToSend.push({
            date:  BookOptdate,
            day : formNumberToDay(dateOption.getDay()), 
            delta : i,
        });
    }    
  
    res.render('courts/details.hbs',{details, error, dataToSend,errorBis:req.session.errorCourtBooked});
    req.session.errorCourtBooked=null;
});


router.post('/book', (req, res) => {
    
    let dateToBook = new Date();
    dayNum= req.body.day
    dateToBook.setDate(dateToBook.getDate() + parseInt(dayNum));
    
    let dateBook = dateToBook.toJSON().slice(0,10);
    let courtId= req.body.usId
    user=req.session.user.id
    req.session.errorCourtBooked =null;
    
    const courtbookedThatDay = Court.getBookingsOfCourtsOnDate(dateBook,courtId);
    if(courtbookedThatDay!=undefined){
        req.session.errorCourtBooked = "We're sorry this court has already been booked on that day ";
        res.redirect('/courts/details?id='+courtId);
    }else{
        Court.bookCourtOnDate(dateBook, courtId, user);
        res.redirect('/courts/bookings');
    }

});


router.get('/bookings', (req, res) => {
    if(req.session.user==undefined){
        res.redirect('/courts');
        return;
        }
    const user_id= req.session.user.id;
    const userBookings = Court.UserCourtsBookings(user_id)    
    res.render('courts/bookings.hbs',{userBookings});
});
router.post('/unbook', (req, res) => {
    let date = req.body.date;
    let courtId= req.body.idCourt;
    let user = req.session.user.id;
    Court.unbook(date,courtId,user);
    res.redirect('/courts/bookings');
});

router.get('/update', (req, res) => {
    req.session.mistakes2 = [] ;
    
    
    let id = req.query.idOfCourt;

    if(req.session.user==null || !req.session.coach)
    res.redirect('/courts/details?id='+id);

    const OldValuesDetails= Court.courtDetails(id);
   
    if(isNaN(id) || OldValuesDetails==null){
        req.session.mistakes2.push("The court you have selected does not exist, please select another one");
        console.table(req.session.errorsUpdate);
    }
    res.render('courts/update.hbs',{OldValuesDetails,error:req.session.mistakes2, errors : req.session.errorsUpdate});
    req.session.errorsUpdate=null;
});


router.post('/update',upload.single('courtPicture'), (req, res) => {
    req.session.errorsUpdate = [] ;
    let exists_name = Court.nameAlreadyExists(req.body.courtName);
   let exists_location= Court.locationAlreadyExists(req.body.courtLocation)
   if(exists_location){ 
    exists_location=exists_location.courtLocation;
   }

   if(exists_name){ 
    exists_name=exists_name.courtName;
   }
    let affichage = false;

    if(exists_name!=undefined){
        req.session.errorsUpdate.push( "We're sorry this court name already exists please select another court name !");
        console.table(req.session.errorsUpdate);
        affichage=true;
        
       
    }
    if(exists_location!=undefined){
        req.session.errorsUpdate.push( "We're sorry this court location already exists please select another court location !");
         console.table(req.session.errorsUpdate);
         affichage=true;
        
    }
    if(req.session.errorsUpdate.length>0){
        res.redirect('/courts/update?idOfCourt='+req.body.courtId);
        return;
    }


if(!affichage){
    let image = null;
    let courtName =req.body.nameCourt;
    let courtLocation = req.body.locationCourt;
    if(req.file!=undefined){
      image = "/images/"+req.file.filename;
    }else{
        image=req.body.oldPicture;
    }
    
    if(req.body.courtName && req.body.courtName !== '') {
        courtName = req.body.courtName;
    }
    
    if(req.body.courtLocation && req.body.courtLocation !== '') {
        courtLocation = req.body.courtLocation;
    }
    
    Court.updateCourt(courtName,req.body.FlooringType,courtLocation,image,req.body.courtId);
    res.redirect('/courts/details?id='+req.body.courtId);
}
});


module.exports = router;