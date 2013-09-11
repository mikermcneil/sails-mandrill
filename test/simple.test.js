

///////////////////////////////////////////////////////
// quick raw integration sample
///////////////////////////////////////////////////////
// var adapter = require('../index');

// var recipients = [{
// 	email	: 'mike@balderdash.co',
// 	name	: 'Mike McNeil'
// }];

// // Send message
// adapter.send(null, {
// 	apiKey: require('./credentials').apiKey,
// 	message: {
// 		to: recipients,
// 		html: 'wtf',
// 		from_email: 'mike@test.com',
// 		from_name: 'Mandrill Mike'
// 	}
// }, function done (err) {
// 	console.log('DONE!',err);
// });