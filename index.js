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
		 *
		 * @param {String} cid - [optional]
		 *		Collection/Model identity or null
		 *		TODO: Waterline core should set `cid` if called from model context
		 *		TODO: Waterline core should automatically apply model config
		 *
		 * @param {Object} options - [optional]
		 *
		 * @param {Function} cb - [optional]
		 */

		send: function (cid, options, cb) {
			cb =	_.isFunction(cb) ? cb : 
					_.isFunction(options) ? options :
					function (){};
			
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
		// Ignore unexpected options, use {} instead
		options = _.isPlainObject(options) ? options : {};

		// Apply collection defaults, if relevant
		if (cid) {
			return _.extend({}, _collectionConfigs[cid], options);
		}
		return _.extend({}, options);
	}

})();
