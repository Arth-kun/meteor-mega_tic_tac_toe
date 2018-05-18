import { check } from 'meteor/check';

import { Players } from '../collections/players';
import { Lobbies } from '../collections/lobbies';

Meteor.methods({
  'players.insert'({ pseudo }) {
    check(pseudo, String);

    const regPseudo = { $regex: `.*${pseudo}.*`, $options: 'i' };
    if(Players.findOne({ pseudo: regPseudo })) {
      throw new Meteor.Error('already-taken');
    }
    
    let player = {
      pseudo,
      score: 0,
    }

    const playerId = Players.insert(player);
    player = Players.findOne({ _id: playerId });

    return { player };
  },
  'players.get'({ pseudo }) {
    check(pseudo, String);

    const player = Players.findOne({ pseudo });

    return { player }
  },
  'players.getById'({ playerId }) {
    check(playerId, String);
    const player = Players.findOne({ _id: playerId });
    return { player }; 
  },
  'players.update'({ playerId, pseudo }) {
    check(playerId, String);
    check(pseudo, String);

    Players.update({ _id: playerId }, { $set: { updatedAt: new Date, pseudo } });
  },
});
