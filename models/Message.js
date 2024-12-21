const db = require('../models/db_conf.js');

module.exports.list = () => {
    const stmt= db.prepare("SELECT message_id as message_id , sender_id as sender_id, receiver_id as receiver_id,message_text as message_text, response_text as response_text,date_hour_message as time FROM messages ORDER BY date_hour_message DESC ");
    return stmt.all();
};

module.exports.getNumberOfMessages = () => {
    const stmt = db.prepare("SELECT COUNT(*) AS nbMessages FROM messages WHERE date_hour_message > DATE('now','-7 day')");
    return stmt.get();
};

module.exports.messagesByUser = (id) => {
    const stmt= db.prepare("SELECT m.message_id, u2.firstname as receiver_name, u2.surname as receiver_surname ,m.message_text,m.response_text,m.date_hour_message FROM users u,users u2, messages m WHERE u.user_id=m.receiver_id AND m.receiver_id=u2.user_id AND m.sender_id=? ORDER BY date_hour_message DESC ");
    return stmt.all(id);
};

module.exports.coachMessages = (id) => {
    const stmt = db.prepare("SELECT m.message_id, u2.firstname as sender_name, u2.surname as sender_surname ,m.message_text,m.response_text,m.date_hour_message FROM users u,users u2, messages m WHERE u.user_id=m.receiver_id AND m.sender_id=u2.user_id AND m.receiver_id=? AND response_text is null ORDER BY date_hour_message DESC");
    return stmt.all(id);
};

module.exports.sendMessage = (sender_id, receiver_id,message) => {
    const stmt = db.prepare("INSERT INTO messages(sender_id, receiver_id, message_text,response_text, date_hour_message) VALUES (?, ?, ?,null,DATETIME('now','localtime'))");
    const info= stmt.run(sender_id, receiver_id,message);
    console.log("coaches model save a message"+ info.changes);
};

module.exports.sendResponse = (response,message_id) => { 
    const stmt = db.prepare('UPDATE messages SET response_text=? WHERE message_id=?');
    return stmt.run(response,message_id);
};

