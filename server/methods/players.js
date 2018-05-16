import { check } from 'meteor/check';

import { Players } from '../collections/players';
import { Lobbies } from '../collections/lobbies';

Meteor.methods({
  'players.insert'({ pseudo }) {
    check(pseudo, String);

    if(Players.findOne({ pseudo })) {
      throw new Meteor.Error('already-taken');      
    }

    let player = {
      pseudo,
      score: 0,
    };

    Players.insert(player);
    player = Players.findOne({ pseudo });
    return { player };
  },
  'players.get'({ pseudo }) {
    check(pseudo, String);
    // console.log('====================================');
    // console.log(this.request.connection.remoteAddress);
    // console.log('====================================');
    
    let player = Players.findOne({ pseudo });

    const activeLobbies = Lobbies.find({ active: true });
    if (activeLobbies) {
      const lobbyId = activeLobbies.map(lobby => {
        if (lobby.playerOne === player._id || lobby.playerTwo === player._id) {
          return lobby._id
        }
      });

      if (lobbyId.length > 1) {
        throw new Meteor.Error('MULTIPLE LOBBIES ACTIVE IN THE SAME TIME FOR THE SAME PLAYER');              
      } else if (lobbyId.length > 0) {
        player = { ...player, lobbyId: lobbyId[0] };
      }
    }

    return { player }
  },
  'players.update'({ _id, pseudo }) {
    check(_id, String);
    check(pseudo, String);

    Players.update(_id, { $set: { updatedAt: new Date, pseudo } });
  },
});
