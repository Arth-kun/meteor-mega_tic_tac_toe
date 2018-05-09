export const Examples = new Mongo.Collection('examples');

Examples.schema = new SimpleSchema({
  string: {
    type: String,
  },
  number: {
    type: Number,
  },
  numberDecimal: {
    type: Number,
    decimal: true,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
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

Examples.attachSchema(Examples.schema);
