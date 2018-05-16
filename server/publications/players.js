import { Players } from '../collections/players';

if (Meteor.isServer) {
  // This code only runs on the server
  Players.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });
  Meteor.publish('players', () => Players.find());
}
