sails-mandrill
==============

Mandrill adapter for sails.js

You can use this adapter directly, or from a model.  I recommend you set up a connection, link it to a model, and access the functionality that way.  It makes for cleaner and more reusable code.
For instructions on using the adapter directly, see the bottom of this file.  


## Create a connection to your Mandrill account

> Note: these instructions are for sails v0.10.x (currently unreleased, but available as the #associations branch on github).
> You'll probably be able to use this adapter with sails@v0.9.x as well, but you'll need to use the `adapters` config, in `config/adapters.js`, and set the `adapter:'mandrill'` key in your model (instead of `connections`).

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


## Hook up a Model to your new connection

###### api/models/Email.js
```javascript
module.exports = {
  connection: ['my favorite mandrill account']
};

```

\

## Usage

#### `Model.send ( [options], [callback] )`

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
}, function optionalCallback (err) {
  // If you need to wait to find out if the email was sent successfully,
  // or run some code once you know one way or the other, here's where you can do that.
  // If `err` is set, the send failed.  Otherwise, we're good!
});


// A lot of times, in your controller, you may not necessarily want to wait until the email sends
// In that case, you can go ahead and send your response down here.
// Just keep in mind that delivery of an email is never 100% guaranteed, no matter what SMTP cloud you're using!


```


###### Send a template from your Mandrill dashboard:
TODO: document this


#### `Model.listTemplates ( [options], [callback] )`

Get your templates. The **key** property is required.

```javascript
Email.listTemplates({
  key: API_KEY,
  label: "example-label"
}, function optionalCallback (err, templates) {
    console.log(templates);
});
```

#### `Model.addTemplate ( [options], [callback] )`

Add a template. The **key** and **name** properties are required

```javascript
Email.listTemplates({
  key: API_KEY,
  name: "Example Template",
  from_email: "from_email@example.com",
  from_name: "Example Name",
  subject: "example subject",
  code: "<h1>example code</h1>",
  text: "Example text content",
  publish: false,
  labels: [
    "example-label"
  ]
}, function optionalCallback (err, template) {
    console.log(template);
});
```






## Using the adapter directly

As mentioned above, you can use the adapter directly.  It's pretty much the same, except you won't have any default connection config mixed into your options, so you'll have to include your API key and `from` config (ie. sender) each time you send an email:

```javascript
var sendEmail = function (options, cb) {
  // Pass null as the first argument, since you aren't using the adapter from the context of a model.
  // (normally, the model name is passed implicitly as the first argument)
  sails.adapters.mandrill.send(null, options, cb);
};

sendEmail({
  /* all the same stuff, just make sure you include everyting 
   * you'd include in your connections configuration as well
   */
}, function optionalCallback (err) {
  // If you need to wait to find out if the email was sent successfully,
  // or run some code once you know one way or the other, here's where you can do that.
  // If `err` is set, the send failed.  Otherwise, we're good!
});
```
