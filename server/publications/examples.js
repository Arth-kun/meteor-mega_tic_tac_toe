import { Examples } from '../collections/examples';

if (Meteor.isServer) {
  // This code only runs on the server
  Examples.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });
  Meteor.publish('examples', () => Examples.find());
}
