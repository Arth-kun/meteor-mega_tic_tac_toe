export const Lobbies = new Mongo.Collection('lobbies');

Lobbies.schema = new SimpleSchema({
  playerOne: {
    type: String,
  },
  playerTwo: {
    type: String,
    optional: true,
  },
  nextPlayer: {
    type: String,
    allowedValues: ['playerOne', 'playerTwo'],
  },
  squares: {
    type: [String],
  },
  active: {
    type: Boolean,
  },
  full: {
    type: Boolean,
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

Lobbies.attachSchema(Lobbies.schema);
