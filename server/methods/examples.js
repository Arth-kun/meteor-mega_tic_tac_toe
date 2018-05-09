import { check } from 'meteor/check';

import { Examples } from '../collections/examples';

Meteor.methods({
  'examples.insert'(string, number, numberDecimal) {
    check(string, String);
    check(number, Number);
    check(numberDecimal, Number);

    // Make sure the user is logged in before inserting an example
    if (! this.userId) {
      throw new Meteor.Error('not-logged');
    }

    const example = {
      string,
      number,
      numberDecimal,
      userId: this.userId,
    };

    Examples.insert(example);
  },
  'examples.update'(_id, string, number, numberDecimal) {
    check(_id, String);
    check(string, String);
    check(number, Number);
    check(numberDecimal, Number);

    //Make sure the user is logged in before inserting an example
    if (! this.userId) {
      throw new Meteor.Error('not-logged');
    } else if (Meteor.user().profile.role !== 'admin') {
      throw new Meteor.Error('not-authorized', 'Unauthorized action');
    }

    Examples.update(_id, { $set: { updatedAt: new Date, string, number, numberDecimal } });
  },
  'examples.remove'(_id) {
    check(_id, String);

    //Make sure the user is logged in before inserting an examples
    if (! this.userId) {
      throw new Meteor.Error('not-logged');
    } else if (Meteor.user().profile.role !== 'admin') {
      throw new Meteor.Error('not-authorized', 'Unauthorized action');
    }

    Examples.remove({ _id });
  },
});
