import { check } from 'meteor/check';
import { Random } from 'meteor/random';

import { GameResults } from '../collections/gameResults';
import { Lobbies } from '../collections/lobbies';
import { Players } from '../collections/players';

Meteor.methods({
  'gameResults.create'(lobbyId, result) {
    check(lobbyId, String);
    check(result, String);

    const lobby = Lobbies.findOne({ _id: lobbyId});
    const playerOne = Players.findOne({ _id: lobby.playerOne });
    const playerTwo = Players.findOne({ _id: lobby.playerTwo });

    let score;

    switch (result) {
      case 'playerOne':
        score = playerOne.score + 15;
        Players.update(playerOne._id, { $set: { updatedAt: new Date, score } });
        break;
      case 'playerTwo':
        score = playerTwo.score + 15;
        Players.update(playerTwo._id, { $set: { updatedAt: new Date, score } });
        break;
      case 'draw':
        score = playerOne.score + 2;
        Players.update(playerOne._id, { $set: { updatedAt: new Date, score } });
        score = playerTwo.score + 2;
        Players.update(playerTwo._id, { $set: { updatedAt: new Date, score } });
        break;
    }

    const gameResult = {
      lobbyId,
      result,
    };

    GameResults.insert(gameResult);
  },
});
