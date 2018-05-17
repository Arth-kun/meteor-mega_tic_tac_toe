import { check } from 'meteor/check';
import { Random } from 'meteor/random';

import { Lobbies } from '../collections/lobbies';
import { Players } from '../collections/players';
import { GameResults } from '../collections/gameResults';

Meteor.methods({
  'lobbies.getAll'() {
    let lobbies = Lobbies.find();
    lobbies = lobbies.map(lobby => {
      if (lobby.active || lobby.full) {
        return {
          ...lobby,
          name: `${Players.findOne({ _id: lobby.playerOne }).pseudo} - ${lobby.playerTwo ? Players.findOne({ _id: lobby.playerTwo }).pseudo : ''}`,
        }
      }
    });

    return { lobbies };
  },
  'lobbies.getOne'({ _id }) {
    check(_id, String);

    let lobby = Lobbies.findOne({ _id });

    if(!lobby) {
      return {}
    }

    if (!lobby.active) {
      const gameResults = GameResults.findOne({ lobbyId: _id }, { sort: { createdAt: -1 } });
      const winner = gameResults.result != 'draw' ? Players.findOne({ _id: lobby[gameResults.result] }).pseudo : gameResults.result;
      lobby = { ...lobby, winner };
    }

    return { lobby };
  },
  'lobbies.create'({ playerOne }) {
    check(playerOne, String);

    let lobby = {
      playerOne,
      nextPlayer: Random.choice(['playerOne', 'playerTwo']),
      squares: Array(9).fill(null),
      active: true,
      full: false,
    };

    lobby = Lobbies.insert(lobby);
    lobby = Lobbies.findOne({ _id: lobby });

    return { lobby };
  },
  'lobbies.join'({ _id, playerTwo }) {
    check(_id, String);
    check(playerTwo, String);

    let lobby = Lobbies.findOne({ _id });

    if(lobby.playerOne !== playerTwo && lobby.playerTwo !== playerTwo) {
      if (lobby.full) {
        throw new Meteor.Error('game-already-full');
      }
      Lobbies.update(_id, { $set: { updatedAt: new Date, playerTwo, full: true } });
    }

    lobby = Lobbies.findOne({ _id });
    return { lobby };
  },
  'lobbies.play'({ _id, player, squareClicked }) {
    check(_id, String);
    check(player, String);

    const lobby = Lobbies.findOne({ _id });
    let active = true;
    let result;
    
    if (!lobby.full || !lobby.active) {
      throw new Meteor.Error('game-not-full-nor-active');     
    } else if (lobby.nextPlayer == 'playerOne' && player != lobby.playerOne) {
      throw new Meteor.Error('not-your-turn');     
    } else if (lobby.nextPlayer == 'playerTwo' && player != lobby.playerTwo) {
      throw new Meteor.Error('not-your-turn');    
    }

    // Check if the game is still runing
    const squares = lobby.squares.slice();

    if (squares[squareClicked]) {
      throw new Meteor.Error('already-full');    
    }
    
    squares[squareClicked] = lobby.nextPlayer == 'playerOne' ? 'X' : 'O';

    const winner = calculateWinner(squares);
    if (winner) {
      switch (winner) {
        case 'X':
          result = 'playerOne';
          break;
        case 'O':
          result = 'playerTwo';
          break;
      }
      Meteor.call('gameResults.create', _id, result);
      active = false;
    } else if (squares.find(square => square === null) === undefined) {
      Meteor.call('gameResults.create', _id, 'draw');
      active = false;
    }

    const nextPlayer = lobby.nextPlayer == 'playerOne' ? 'playerTwo' : 'playerOne';

    Lobbies.update(_id, { $set: { updatedAt: new Date, nextPlayer, squares, active } });
    return { lobby: Lobbies.findOne({ _id }) };
  },
  'lobbies.restart'({ _id }) {
    check(_id, String);

    const lobby = Lobbies.findOne({ _id });

    if (lobby.active) {
      throw new Meteor.Error('lobby-already-active');
    }

    Lobbies.update(_id, { $set: { updatedAt: new Date, active: true, squares: Array(9).fill(null), nextPlayer: Random.choice(['playerOne', 'playerTwo'])} });
  },
  'lobbies.leave'({ _id, player }) {
    check(_id, String);
    check(player, String);

    const lobby = Lobbies.findOne({ _id });

    if (player == lobby.playerOne && lobby.playerTwo == null) {
      Meteor.call('lobbies.terminate', _id, false);
    } else if (player == lobby.playerOne) {
      Lobbies.update(_id, { $set: { updatedAt: new Date, playerOne: lobby.playerTwo, playerTwo: null, squares: Array(9).fill(null), full: false, } });
    } else if (player == lobby.playerTwo) {
      Lobbies.update(_id, { $set: { updatedAt: new Date, playerTwo: null, full: false } });
    }

  },
  'lobbies.terminate'(_id, ended, result) {
    check(_id, String);
    check(ended, Boolean);
    
    if (ended == true) {
      Meteor.call('gameResults.create', _id, result);
    }

    Lobbies.remove(_id);
  },
});


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
