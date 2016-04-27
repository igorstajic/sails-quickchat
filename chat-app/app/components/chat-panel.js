import Ember from 'ember';
const {
  $
} = Ember;
export default Ember.Component.extend({
  messages: [],
  ajax: Ember.inject.service(),
  init() {
    this._super(...arguments);
    //Init message list
    io.sails.url = 'https://quickchat-istajic.rhcloud.com:8443';
    // io.sails.url = 'http://localhost:1337';
    this.get('ajax').request('/chat').then(res => this.set('messages', res));
    io.socket.get('/chat/');
    io.socket.on('chat', (msg) => {
      this.get('messages').pushObject(msg.data);
    });
  },
  actions: {
    enter(info, username) {
      io.socket.post('/chat/', {
        user: username,
        message: info
      });
    }
  }
});
