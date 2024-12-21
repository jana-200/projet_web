const db = require('../models/db_conf');

module.exports.list = () => {
    return db.prepare("SELECT * FROM bookings").all();
};

module.exports.getUpcomingBookings = () => {
    return db.prepare("SELECT COUNT(*) as nbBookings FROM bookings WHERE date_booking > DATE('now') ").get();
};

module.exports.orderedList = () => {
    return db.prepare("SELECT tennis_court_id AS court_id, name AS courtName, flooring_type AS flooringType, location AS courtLocation, picture_path AS picturePath  FROM tennis_courts ORDER BY courtName ").all();
};

module.exports.courtDetails = (id) => {
    return db.prepare("SELECT tennis_court_id AS court_id, name AS courtName, flooring_type AS flooringType, location AS courtLocation, picture_path AS picturePath  FROM tennis_courts WHERE tennis_court_id=?").get(id);
};


module.exports.bookCourtOnDate = (date,courtId,userId) => {
    return db.prepare( 'INSERT INTO bookings( date_booking, tennis_court_id, user_id )VALUES (?, ?, ?)').run(date,courtId,userId);
};

module.exports.UserCourtsBookings = (id) => {
    return db.prepare("SELECT  tennis_courts.tennis_court_id AS court_id , tennis_courts.name AS courtName, bookings.date_booking AS dateBooking FROM tennis_courts , bookings  WHERE tennis_courts.tennis_court_id=bookings.tennis_court_id AND user_id=? AND bookings.date_booking>=DATE('now') ORDER BY dateBooking").all(id);
};

module.exports.unbook = (date,courtId,userId) => {
    return db.prepare( 'DELETE FROM bookings WHERE date_booking=? AND tennis_court_id=? AND user_id=? ').run(date,courtId,userId);
};

module.exports.getBookingsOfCourtsOnDate = (date,courtId) => {
    return db.prepare( 'SELECT  tennis_court_id AS court_id, date_booking AS dateBooking  FROM bookings WHERE date_booking=? AND tennis_court_id=? ').get(date,courtId);
};

module.exports. nameAlreadyExists= (name) => {
    return db.prepare( 'SELECT name  AS courtName FROM tennis_courts WHERE name=?').get(name);
};

module.exports. locationAlreadyExists= (location) => {
    return db.prepare( 'SELECT  location AS courtLocation FROM tennis_courts WHERE location=?').get(location);
};


module.exports.updateCourt = (name,flooringType,location,picturePath,id) => {
     const stmt = db.prepare('UPDATE tennis_courts SET name = ?, flooring_type = ?, location=?,picture_path = ? WHERE tennis_court_id= ?');
     return stmt.run(name,flooringType,location,picturePath,id);
    
};








  


