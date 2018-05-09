Accounts.onCreateUser((options, user) => {
  // Do whatever you want to customize accounts
  const customizedUser = Object.assign({
    profile: {
      //publicly visible fields like firstname goes here
      role: 'user',
    },
  }, user);
  // We still want the default hook's 'profile' behavior.
  if (options.profile) {
    customizedUser.profile = options.profile;
  }
  console.log(customizedUser);
  return customizedUser;
});

// Uncomment the following line to see what happens on login
// Accounts.onLogin((params) => {
//   console.log(params);
//   console.log('');
//   console.log('__________________________________');
//   console.log('');
// });
