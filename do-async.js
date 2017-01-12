"use strict";
(function(context){
	
	context["doAsync"] = function(callback){
		
	}
	
	// export to node if we're in node
	if (typeof module != 'undefined' && module.exports) {module.exports = context["doAsync"];} 
})(this)
