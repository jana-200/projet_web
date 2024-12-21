const bcrypt = require('bcrypt');

const db = require('../models/db_conf.js');

const saltRounds = 10;

module.exports.create = (firstname, surname, email, password) => {
    const hash = bcrypt.hashSync(password, saltRounds);

    const stmt = db.prepare("INSERT INTO users(firstname, surname, email, password, status) VALUES (?, ?, ?, ?, 'regular')");
    stmt.run(firstname, surname, email, hash);
};

module.exports.findByEmail=(email)=>{
    const user= db.prepare('SELECT * FROM users where email=?').get(email);
    if(!user) return null;

    return user;
};



module.exports.login = (email, password) => {
    const stmt = db.prepare('SELECT user_id as id,firstname AS firstname,surname AS surname,email AS email, password AS password,status AS status, biography AS bio, picture_path AS pic FROM users WHERE email = ?');
    const user = stmt.get(email);
    if (!user) return null;

    if (!bcrypt.compareSync(password, user.password)) return null;
    return user;
};

