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

    const playerId = Players.create(player);
    let player = Players.findOne({ _id: playerId });

    return { player };
  },
  'players.get'({ pseudo }) {
    check(pseudo, String);

    // const activeLobbies = Lobbies.find({ active: true });
    // if (activeLobbies) {
    //   const lobbyId = activeLobbies.map(lobby => {
    //     if (lobby.playerOne === player._id || lobby.playerTwo === player._id) {
    //       return lobby._id
    //     }
    //   });

    //   if (lobbyId.length > 1) {
    //     throw new Meteor.Error('MULTIPLE LOBBIES ACTIVE IN THE SAME TIME FOR THE SAME PLAYER');              
    //   } else if (lobbyId.length > 0) {
    //     player = { ...player, lobbyId: lobbyId[0] };
    //   }
    // }

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
