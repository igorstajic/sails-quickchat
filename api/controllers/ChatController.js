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
      Chat.query('INSERT into chat ("user", message) VALUES (\'' + data.user + '\', \'' + data.message + '\') RETURNING id', function(err, res) {
        if (err) {
          sails.log(err);
          sails.log("Error occurred in database operation");
        } else {
          sails.log("data:", res.rows)

          Chat.publishCreate({
            id: res.rows[0].id,
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
      Chat.query('SELECT * FROM chat', function(err, rows) {
        if (err) {
          sails.log(err);
          sails.log("Error occurred in database operation");
        } else {
          res.send(rows.rows);
        }
      });
    }
  }
};
