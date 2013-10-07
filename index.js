/**
 * Adapter dependencies
 */

var Mandrill	= require('mandrill-api').Mandrill,
	_			= require('lodash');

module.exports = (function () {

	// Collection configurations
	var _collectionConfigs = {};

	var Adapter = {

		// App-wide defaults for this adapter
		defaults: {
			from: {
				name: 'Sails.js',
				email: 'contact@yourapp.com'
			}
		},

		registerCollection: function (collection, cb) {
			// Absorb defaults into collection configuration
			collection.config = _.defaults(collection.config, Adapter.defaults);

			// Store each collection config for later
			_collectionConfigs[collection.identity] = _.cloneDeep(collection.config);
			cb();
		},
		teardown: function (cb) {
			cb();
		},


		/**
		 * Send an email
		 *
		 * @param {String} cid - [optional]
		 *		Collection/Model identity or null
		 *
		 * @param {Object} options - [optional]
		 *		TODO: Waterline core should automatically apply model config to options
		 *
		 * @param {Function} cb - [optional]
		 */

		send: function (cid, options, cb) {
			cb =	_.isFunction(cb) ? cb : 
					_.isFunction(options) ? options :
					function (){};
			options = _extendOptions(cid, options);

			var err = _validateOptions(options);
			if ( err ) return cb(err);

			// Set-up API key
			var mandrill = new Mandrill(options.apiKey);
			delete options.apiKey;

			// Tolerate rowdy inputs
			options = _marshalOptions(options);

			// Map everything to Mandrill's expectations
			options = _serializeOptions(options);

			mandrill.messages.send(options,
			function success (result) {
				cb(null, result);
			},
			function error (err) {
				cb(err);
			});
		}
	};

	return Adapter;



	/**
	 * Extend usage options with collection configuration
	 * (which also includes adapter defaults)
	 * @api private
	 */

	function _extendOptions(cid, options) {
		// Ignore unexpected options, use {} instead
		options = _.isPlainObject(options) ? options : {};

		// Apply collection defaults, if relevant
		if (cid) {
			return _.extend({}, _collectionConfigs[cid], options);
		}
		return _.extend({}, options);
	}

	/**
	 * @returns truthy value if options are invalid or incomplete
	 * @api private
	 */
	function _validateOptions(options) {
		if (!options.to) {
			return '`to` must be specified, e.g.: { to: { email: "foo@bar.com", name: "Mr. Foo Bar" } }';
		}
		if (!options.from) {
			return '`from` must be specified, e.g.: { from: { email: "foo@bar.com", name: "Mr. Foo Bar" } }';
		}
	}


	/**
	 * @returns {Object} options with types normalized for consistency
	 * @api private
	 */
	function _marshalOptions(options) {
		if ( _.isString(options.to) ) {
			options.to = [ { email: options.to } ];
		}
		if ( _.isPlainObject(options.to) ) {
			options.to = [ options.to ];
		}
		_.map(options.to, function (recipient) {
			if ( _.isString(recipient) ) {
				return { email: recipient };
			}
			return recipient;
		});

		if ( _.isString(options.from) ) {
			options.from = { email: options.from };
		}
		return options;
	}

	/**
	 * @returns {Object} options formatted for use w/ mandrill
	 * @api private
	 */
	function _serializeOptions(options) {
		_.merge(options, {
			message: {
				to: options.to,
				html: options.html || '',
				text: options.text || undefined,
				from_email: options.from.email,
				from_name: options.from.name
			}
		});
		delete options.to;
		delete options.from;
		delete options.html;
		delete options.text;

		return options;
	}

})();
