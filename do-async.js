"use strict";
(function(context){
	
	context["doAsync"] = function(chainStart, chainName){
		
		// setting up the execution array-like
		var executionChain = {length:0};
		
		// setting up a psudo push function for the array-like 
		executionChain.push = function(callback, callbackName){
			// keep a copy of the current index for the reference of the duration of the function
			var executionIndex = executionChain.length;
			
			// append the callback to the list wtih some other fancy stuff
			executionChain[executionIndex] = {exe:callback, applyContext:{}, passQueue:[]};
			
			// if a name exists, put a reference to the callback to the name as well
			if (callbackName){
				executionChain[callbackName] = executionChain[executionIndex];
			}
			
			// temporary pass function to put the data into a queue (to be overwritten later)
			var tempPass = executionChain[executionIndex].applyContext.pass = function(){
				var recieved = Array.prototype.slice.call(arguments);
				
				// if new pass has not been assigned, add to pasqueue (support for synchronous functions)
				if(executionChain[executionIndex].applyContext.pass == tempPass){
					executionChain[executionIndex].passQueue.push(recieved);
				}
				// use new pass (support for async functions)
				else {
					executionChain[executionIndex].applyContext.pass.apply(undefined, recieved);
				}
			}
			
			// function that ends the execution chain
			executionChain[executionIndex].applyContext.end = executionChain[executionIndex].applyContext.destroy = function(){
				Array.prototype.forEach.call(executionChain, function(link){
					link.exe = {exe:functon(){}, applyContext:{}, passQueue:[]}
				})
				chainer.then = function(){};
			}
		}
		
		// function to initiate the chain
		var chainer = function(){
			var recieved = Array.prototype.slice.call(arguments);
			var instanceGlobals = {};
			Array.prototype.forEach.call(executionChain, function(link){
				link.applyContext.globals = instanceGlobals;
			})
			executionChain[0].exe.apply(executionChain[0].applyContext, recieved);
		};
		
		// adding a chain link
		chainer.then = function(step, stepName){
			executionChain.push(step, stepName)
			var curLinkIndex = executionChain.length - 1;
			
			// if this isn't the first time then is called
			if (curLinkIndex > 0){
				
				// overwrite the previous chain link's temporary pass function
				
				executionChain[curLinkIndex-1].applyContext.pass = function(){
					var recieved = Array.prototype.slice.call(arguments); 
					executionChain[curLinkIndex].exe.apply(executionChain[curLinkIndex].applyContext, recieved);
				}
				
				// if the previous chain link has some passes queued up call them now
				executionChain[curLinkIndex-1].passQueue.forEach(function(args){
					executionChain[curLinkIndex-1].applyContext.pass.apply(undefined, args);
				})
			}
			return chainer;
		}
		
		// for debugging
		chainer.getChain = function(name){
			return executionChain;
		}
		
		// enviroment set up add the first object to the chain.
		chainer.then(chainStart, chainName);
		
		// if the starting function doesn't take any args, begin the chain
		if (!chainStart.length){
			chainer();
		}
		
		return chainer;
	}
	
	// export to node if we're in node
	if (typeof module != 'undefined' && module.exports) {module.exports = context["doAsync"];} 
})(this)