sails-mandrill
==============

Mandrill adapter for sails.js


## Setup ( sails v0.10.0 ):


###### config/connections.js
```javascript
module.exports.connections = {

  // ...
  
  // Mandrill
  'my favorite mandrill account': {
    adapter: 'sails-mandrill',
    apiKey: process.env.MANDRILL_KEY, // the api key for your mandrill account
    from: {
      name: 'Default sender to use ( can be overriden in options to .send() )',
      email: 'default@sender.com'
    }
  }
};

```


###### config/models/Email.js
```javascript
module.exports = {
  connections: 'my favorite mandrill account'
};

```


## Usage

#### `send ( [options], [callback] )`

Generally, `sails-mandrill` accepts the same inputs as the official mandrill SDK for Node.js.  It does, however, simplify the usage a bit for the most basic options.
You can override any of your connection defaults (including your API key!!!) in the options.



###### Send an HTML email:
```javascript

Email.send({
  to: [{
    name: 'Alvin',
    email: 'alvin@chipmunks.com'
  }, {
    name: 'Chipettes',
    email: 'team@chipettes.com'
  }],
  subject: 'omg i love you guys!!1',
  html: 
    'I can\'t wait to see you all in Chicago<br/>' +
    'I loe you so much!!!! ',
  text: 'text fallback goes here-- in case some recipients (let\'s say the Chipettes)  can\'t receive HTML emails'
}, function emailSent (err) {
  // If `err` exists, the send failed.
  // otherwise it worked!
});
```


###### Send a template from your Mandrill dashboard:
TODO: document this
