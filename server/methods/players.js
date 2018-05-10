import { check } from 'meteor/check';

import { Players } from '../collections/players';

Meteor.methods({
  'players.insert'(pseudo) {
    check(pseudo, String);

    // Make sure the user is logged in before inserting an example
    // if (! this.userId) {
    //   throw new Meteor.Error('not-logged');
    // }

    const player = {
      pseudo,
      score: 0,
    };

    Players.insert(player);
  },
});
