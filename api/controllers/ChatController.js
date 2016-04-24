/**
 * ChatController
 *
 * @description :: Server-side logic for managing Chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  index: function(req, res) {
    var data = req.params.all();
    if (req.isSocket && req.method === 'POST') {
      Chat.query('INSERT into `chat` (`user`, `message`) VALUES (\'' + data.user + '\', \'' + data.message + '\')', function(err, res) {
        if (err) {
          sails.log(err);
          sails.log("Error occurred in database operation");
        } else {
          Chat.publishCreate({
            id: res.insertId,
            message: data.message,
            user: data.user
          });
        }
      });
    } else if (req.isSocket) {
      Chat.watch(req.socket);
      sails.log('User subscribed to ' + req.socket.id);
    }
    if (req.method === 'GET') {
      Chat.query('SELECT * FROM `chat`', function(err, rows) {
        if (err) {
          sails.log(err);
          sails.log("Error occurred in database operation");
        } else {
          res.send(rows);
        }
      });
    }
  }
};
