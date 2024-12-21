const db = require('../models/db_conf.js');

// Lists future tournaments that are after the current date
module.exports.list=()=>{
    return db.prepare('SELECT tournament_id, name ,date_tournament,nb_max_participants FROM  tournaments WHERE date_tournament>CURRENT_DATE  ORDER BY date_tournament').all();
};
 
// Counts future tournaments
module.exports.getUpcomingTournaments =() => {
    return db.prepare("SELECT COUNT(tournament_id) as nbTournaments FROM tournaments WHERE date_tournament > DATE('now') ").get();
};

// gives details of a specific tournament
module.exports.detailslist=(id)=>{
  return db.prepare('SELECT tournament_id, name ,date_tournament,us.firstname as firstname,nb_max_participants,banner_image_path FROM tournaments tour,users us WHERE us.user_id=tour.creator  AND tournament_id=? ').get(id);
};

// Counts users already registered for a specific tournament
module.exports.alreadyRegister=(id)=>{
  return db.prepare('SELECT COUNT(user_id) as number_of_registration FROM registrations WHERE tournament_id=?').get(id);
};


// check if a user is already registered for a specific tournament

module.exports.isRegistered=(user_id,tournament_id)=>{
  const stmt = db.prepare("SELECT user_id FROM registrations where user_id=? AND tournament_id = ?");
  const info = stmt.get(user_id, tournament_id);

  if (!info) return false;

  return true;

};

// registers the user for a specific tournament
module.exports.registration=(user_id,tournament_id)=>{
  return db.prepare("Insert into registrations(user_id,tournament_id ) VALUES(?,?)").run(user_id,tournament_id)
};

// unregister a user for a specific tournament
module.exports.unregister=(user_id)=>{
  return db.prepare('DELETE FROM registrations WHERE user_id=?').run(user_id);
};

// Create a tournament
module.exports.createTournament=(name,creator,date_tournament,nb_max_participants,banner_image_path)=>{
  return db.prepare("INSERT INTO tournaments(name,creator,date_tournament,nb_max_participants,banner_image_path)  VALUES(?,?,?,?,?)").run(name,creator,date_tournament,nb_max_participants,banner_image_path);
};

// Check if the tournament name is already present
module.exports.tournament_name_exists=(tournament_name)=>{
  return db.prepare("SELECT name FROM tournaments WHERE name=? ").get(tournament_name);
}
