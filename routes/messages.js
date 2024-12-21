const express = require('express');
const router = express.Router();
const Message=require("../models/Message.js");


router.get('/', function (req, res, next){
    if(req.session.user==undefined){ 
        res.redirect('/coaches');
    }
    const id = req.session.user.id;
    let messages;
    if(req.session.user.status=='coach'){ 
        messages=Message.coachMessages(id); 
    }
    else{ 
        messages=Message.messagesByUser(id);
    }
    res.render('coaches/messages.hbs',{messages});
});

router.post('/replyTo', function(req, res, next){ 
    const response= req.body.response;
    const message_id=req.body.message_id;
    Message.sendResponse(response,message_id);
    res.redirect('/messages')
});

module.exports = router;