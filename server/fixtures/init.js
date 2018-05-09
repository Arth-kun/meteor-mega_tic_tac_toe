// Contains all the scripts that runs at the initialisation of the server
// Uncomments the features you need
// import fs from 'fs';
import { Examples } from '../collections/examples'

// Access params from settings.json file
const settings = Meteor.settings;

// Mail const setup by settings
// process.env.MAIL_URL = `${settings.protocol}://${settings.email}:${settings.password}@${settings.smtp}:${settings.port}`;

// Init everything you need to init at server start, like database population, etc

// Insert an admin user
const regAdmin = { $regex: `.*${settings.admin.username}.*`, $options: 'i' };
if (!Meteor.users.findOne({ username: regAdmin })) {
  Accounts.createUser({
    username: settings.admin.username,
    password: settings.admin.password,
    profile: {
      //publicly visible fields like firstname goes here
      role: 'admin',
    },
  });
}

// Init the first example
if (!Examples.findOne()) {
  console.log('Insert an example if none found');
  Examples.insert({ string: 'This is an Example', number: 666, numberDecimal: 3.14, userId: Meteor.users.findOne({ username: regAdmin })._id });
}


// Logout all users at once
//Meteor.users.update({}, {$set: {'services.resume.loginTokens': []}}, {multi: true});
