# pebble-config

A generic pebble config page. Send it an encoded config specification and it'll build your form for you! All hosted on GitHub pages.

pebble-config does not track you, is hosted over HTTPS, and has no server component. It's all static files and client side JS. You tell the JavaScript app what your form contains by the search string of the URL.

## How to define a form

A form definition is an array of objects, for example:

```javascript
var formDef = [
  { name: 'birthday', type: 'date' }, // name is mandatory, type defaults to text.
  { name: 'length of a piece of string', type: 'number', min: 0 }, // Validations!
  { name: 'tweet', type: 'text', maxLength: 140 },
  { name: 'address', type: 'email', required: true }
];
```

For possible types and validations, see [the mdn article](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation) on constraint based form validation.

Once you have a form, you need to stringify and encode it:

```javascript
var encoded = encodeURIComponent(JSON.stringify(formDef));
```

Then append it as a query parameter:

```javascript
var url = 'https://qubyte.github.io/pebble-config/?form-definition=' + encoded;
```

Now use this URL like so:

```javascript
// The config can be stored in local storage to persist it, so try to read it from there.
var config = localStorage.getItem('config');

// This is when the configuration is opened on the pebble app on the phone.
Pebble.addEventListener('showConfiguration', function () {
  Pebble.openURL(url);
});

// When the config is saved, this event is triggered. Decode and parse it, then store.
Pebble.addEventListener('webviewclosed', function (evt) {
  config = JSON.parse(decodeURIComponent(evt.response));
  localStorage.setItem('config', config);
});
```

Config is an object containing name-value pairs. You'll need to do any parsing of values (for example to numbers) from strings yourself.

## Why encode this way?

This way makes it possible to define forms with validations in an easy way. With query parameters alone, it'd be a lot trickier, and far harder to construct URLs. The one drawback is that the maximum URL length supported by browsers is ~2000 characters, and it's not very difficult to hit that. It's unlikely that any useful form will need to be that complex however.

## Contributing

Please contribute! All interactions on this repository are governed by the [Contributor Covenant](CODE_OF_CONDUCT). If you use pebble-config, them please tweet to me @qubyte!.

The site itself is hosted by GitHub. To make changes, clone this repository, and make a new branch off of the `gh-pages` branch.
