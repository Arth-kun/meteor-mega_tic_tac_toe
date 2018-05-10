export const GameResults = new Mongo.Collection('gameResults');

GameResults.schema = new SimpleSchema({
  lobbyId: {
    type: String,
  },
  result: {
    type: String,
    allowedValues: ['playerOne', 'playerTwo', 'draw']
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    },
    denyUpdate: true
  },
  updatedAt: {
    type: Date,
    autoValue: function () {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true
  },
});

GameResults.attachSchema(GameResults.schema);
