angular.module('greenhouseApp')
  .factory('channel', ['$firebase', function($firebase) {
    return {
    	getChannel: function (id) {
		  	var ref = new Firebase("https://greenhouse.firebaseio.com/channels/" + id);
    		return $firebase(ref);
    	},
    	getChannelData: function (id) {
		  	var ref = new Firebase("https://greenhouse.firebaseio.com/channels/" + id + '/data');
    		var data = [];
    		ref.on('value', function (child) {
		      data = child.val();
		    });
		    return data;
    	}
    }
  }]);