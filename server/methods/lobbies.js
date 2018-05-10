import { check } from 'meteor/check';
import { Random } from 'meteor/random';

import { Lobbies } from '../collections/lobbies';
import * as GameResults from '../methods/gameResults';

Meteor.methods({
  'lobbies.create'(playerOne) {
    check(playerOne, String);

    const lobby = {
      playerOne,
      nextPlayer: Random('playerOne', 'playerTwo'),
      squares: Array(9).fill(null),
      active: true,
      full: false,
    };

    Lobbies.insert(lobby);
  },
  'lobbies.join'(_id, playerTwo) {
    check(_id, String);
    check(playerTwo, String);

    Lobbies.update(_id, { $set: { updatedAt: new Date, playerTwo, full: true } });
  },
  'lobbies.play'(_id, player, squareClicked) {
    check(_id, String);
    check(player, String);
    check(squareClicked, Number);

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
    }

    const nextPlayer = lobby.nextPlayer == 'playerOne' ? 'playerTwo' : 'playerOne';

    Lobbies.update(_id, { $set: { updatedAt: new Date, nextPlayer, square, active } });
  },
  'lobbies.restart'(_id) {
    check(_id, String);

    const lobby = Lobbies.findOne({ _id });

    if (lobby.active) {
      throw new Meteor.Error('lobby-already-active');
    }

    Lobbies.update(_id, { $set: { updatedAt: new Date, active: true, square: Array(9).fill(null), nextPlayer: Random('playerOne', 'playerTwo')} });
  },
  'lobbies.leave'(_id, player) {
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

    Lobbies.update(_id, { $set: { updatedAt: new Date, active: false } });
  },
  'lobbies.terminate'(_id, ended, result) {
    check(_id, String);
    check(ended, Boolean);
    
    if (ended == true) {
      Meteor.call('gameResults.create', _id, result);
    }

    Lobbies.update(_id, { $set: { updatedAt: new Date, active: false } });
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
