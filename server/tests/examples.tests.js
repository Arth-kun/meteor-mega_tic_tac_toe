import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';

import '../methods/examples.js';

// Test if not logged user cans do anything = kinda useless
// You need to find how to log a user to do real testing

if (Meteor.isServer) {
  describe('Examples', () => {
    describe('methods fail', () => {
      const randomId = Random.id();
      const example = {
        string: 'string',
        number: 1,
        decimalNumber: 1.1,
      }

      it('examples.insert not-logged', () => {
        assert.throws(() => {
          Meteor.call('examples.insert', example.string, example.number, example.decimalNumber);
        }, Meteor.Error,  /^\[not-logged\]$/);
      });

      it('examples.update not-logged', () => {
        assert.throws(() => {
          Meteor.call('examples.update', randomId, example.string);
        }, Meteor.Error,  /^\[not-logged\]$/);
      });

      it('examples.remove not-logged', () => {
        assert.throws(() => {
          Meteor.call('examples.remove', randomId);
        }, Meteor.Error,  /^\[not-logged\]$/);
      });
    });
  });
}
