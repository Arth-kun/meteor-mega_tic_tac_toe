import { Lobbies } from '../collections/lobbies';

if (Meteor.isServer) {
  // This code only runs on the server
  Lobbies.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });
  Meteor.publish('lobbies', () => Lobbies.find());
}
