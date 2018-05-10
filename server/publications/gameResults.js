import { GameResults } from '../collections/gameResults';

if (Meteor.isServer) {
  // This code only runs on the server
  GameResults.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });
  Meteor.publish('gameResults', () => GameResults.find());
}
