"use strict";
(function(context){
	
	context["doAsync"] = function(chainStart){
		var passingVars = [];
		var callbackChainLinks = [];
		var currentChainIndex = 0;
		var instaThen = false;
		var chainer = {};
		var inChainContext = {};
		
		inChainContext.pass = function(){
			instaThen = true; // allow future .then() calls to immediately trigger it's callback
			var recieved = Array.prototype.slice.call(arguments); // extract data to be passed 
			
			// if there's another link in the chain ready to go
			if (callbackChainLinks.length > currentChainIndex){
				passingVars = []; // clear the passing vars
				callbackChainLinks[currentChainIndex].apply(inChainContext, recieved); //call the next chain with our recieved values.
				instaThen = false; // disally then from immediately firing upon call
				currentChainIndex ++; // increment chain counter for when this function gets called again
			}
			// there is no other functions 
			else{
				passingVars = recieved; // save extracted vars for the next then call
			}
		}
		inChainContext.end = function(){
			instaThen = false;
			callbackChainLinks = [];
		}
		
		chainer.then = function(additionalChainLink){
			if (instaThen){
				additionalChainLink.apply(inChainContext, passingVars);
				instaThen = false;
				currentChainIndex ++;
				passingVars = [];
			}
			else{
				callbackChainLinks.push(additionalChainLink);
			}
			return chainer;
		}
		
		chainStart.apply(inChainContext, []);
		
		return chainer;
	}
	
	// export to node if we're in node
	if (typeof module != 'undefined' && module.exports) {module.exports = context["doAsync"];} 
})(this)

/* target api
doAsync(()=>{...})
	.then((val)=>{...})
	.then((val)=>{...})
	.then((val)=>{...})
	.then((val)=>{...})
*/