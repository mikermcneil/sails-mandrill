/**
 * Adapter dependencies
 */

var Mandrill	= require('mandrill-api').Mandrill,
	_			= require('lodash');

module.exports = (function () {

	// Collection configurations
	var _collectionConfigs = {};

	return {

		// App-wide defaults for this adapter
		defaults: {

		},

		registerCollection: function (collection, cb) {

			// Handle collection config
			_collectionConfigs[collection.identity] = collection.defaults;
			cb();
		},
		teardown: function (cb) {
			cb();
		},


		/**
		 * Send an email
		 */

		send: function (cid, options, cb) {
			
			options = _extendOptions(cid, options);
			var mandrill = new Mandrill(options.apiKey);
			delete options.apiKey;

			mandrill.messages.send(options,
			function success (result) {
				cb(null, result);
			},
			function error (err) {
				cb(err);
			});
		}
	};



	/**
	 * Extend usage options with collection configuration
	 * (which also includes adapter defaults)
	 * @api private
	 */

	function _extendOptions(cid, options) {
		if (cid) {
			return _.extend({}, _collectionConfigs[cid], options);
		}
		return _.extend({}, options);
	}

})();
