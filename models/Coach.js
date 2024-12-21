const db = require('../models/db_conf.js');

module.exports.list = () => {
    const stmt= db.prepare("SELECT * FROM users where status='coach' ORDER BY surname ASC");
    return stmt.all();
};

module.exports.findById = (id) => { 
    const stmt= db.prepare("SELECT user_id as id ,firstname AS firstname,surname AS surname,email AS email, biography AS bio, picture_path AS pic FROM users WHERE user_id=? AND status='coach' ");
    return stmt.get(id);
};  

module.exports.updateBio=(newBio,newPic,coach_id)=>{ 
    const stmt = db.prepare('UPDATE users SET biography=?, picture_path=? WHERE user_id=?');
    stmt.run(newBio,newPic,coach_id);
};