"use strict";
(function(context){
	var arrayForeach = Array.prototype.forEach;
	var arraySlice = Array.prototype.slice;
	context["doAsync"] = function(chainStartOrName, actualChain){
		var chainStart, chainName;
		if (typeof chainStartOrName === "string"){
			chainName = chainStartOrName;
			chainStart = actualChain;
		}
		else if (typeof chainStartOrName === "function"){
			chainStart = chainStartOrName;
		}
		else {
			throw "type missmatch";
		}


		// setting up the execution array-like
		var executionChain = {length:0};

		// setting up a psudo push function for the array-like
		executionChain.addLink = function(callback, callbackName){
			/*var callback, callbackName;
			if (typeof callbackOrName === "string" || typeof callbackOrName === "undefined"){
				callbackName = callbackOrName;
				callback = callbackForReal;
			}
			else if (typeof callbackOrName === "function"){
				callback = callbackOrName;
			}
			else {
				throw "type missmatch";
			}*/

			// keep a copy of the current index for the reference of the duration of the function
			var executionIndex = executionChain.length;
			executionChain.length += 1;

			// append the callback to the list with some other fancy stuff
			executionChain[executionIndex] = {exe:callback, applyContext:{}, passQueue:[]};

			// if a name exists, put a reference to the callback to the name as well
			//console.log(callbackName);
			if (callbackName){
				executionChain[callbackName] = executionChain[executionIndex];
			}

			// temporary pass function to put the data into a queue (to be overwritten later)
			executionChain[executionIndex].applyContext.pass = function(){
				var recieved = arraySlice.call(arguments);

				executionChain[executionIndex].applyContext.jump(1)(arguments);
				/*
				// if new pass has not been assigned, add to pasqueue (support for synchronous functions)
				if(executionChain[executionIndex].applyContext.pass == tempPass){
					executionChain[executionIndex].passQueue.push({targetLink:executionIndex+1, args:recieved});
				}
				// use new pass (support for async functions)
				else {
					executionChain[executionIndex].applyContext.pass.apply(undefined, recieved);
				}
				*/
			}

			// function that ends the execution chain
			executionChain[executionIndex].applyContext.end = executionChain[executionIndex].applyContext.destroy = function(){
				arrayForeach.call(executionChain, function(link){
					link.exe = function(){};
					link.applyContext = {};
					link.passQueue = [];
				})
				chainer.then = function(){};
			}

			executionChain[executionIndex].applyContext.jumpTo = executionChain[executionIndex].applyContext.jumpto = function(target){
				// target is part of chain
				return function(){
					var recieved = arraySlice.call(arguments);
					if (!executionChain[target]) {
						executionChain[executionIndex].passQueue.push({targetLink:target, args:recieved});
					}
					else {
						executionChain[target].exe.apply(executionChain[target].applyContext, recieved);
					}
				}
			}

			executionChain[executionIndex].applyContext.jump = function(target){
				var targetLinkIndex = executionIndex + target;
				// piggy back off jumpto instead
				return executionChain[executionIndex].applyContext.jumpTo(targetLinkIndex);
			}

			executionChain[executionIndex].applyContext.self = function(){
				var recieved = arraySlice.call(arguments);
				executionChain[executionIndex].applyContext.jump(0).apply(executionChain[executionIndex].applyContext, recieved);
			}
		}

		// function to initiate the chain
		var chainer = function(){
			var recieved = arraySlice.call(arguments);
			executionChain[0].exe.apply(executionChain[0].applyContext, recieved);
		};

		// adding a chain link
		chainer.then = function(stepOrName, actualStep){
			var step, stepName;
			if (typeof stepOrName === "string" || typeof stepOrName === "undefined"){
				stepName = stepOrName;
				step = actualStep;
			}
			else if (typeof stepOrName === "function"){
				step = stepOrName;
			}
			else {
				throw "type missmatch";
			}

			executionChain.addLink(step, stepName)
			var curLinkIndex = executionChain.length - 1;

			// if this isn't the first time then is called
			if (curLinkIndex > 0){

				// overwrite the previous chain link's temporary pass function
				executionChain[curLinkIndex-1].applyContext.pass = function(){
					var recieved = arraySlice.call(arguments);
					executionChain[curLinkIndex].exe.apply(executionChain[curLinkIndex].applyContext, recieved);
				}

				// go through the previous links and call all the pass functions that's targeting the current link
				arrayForeach.call(executionChain, function(link){
					link.passQueue.forEach(function(forFuture){
						//executionChain[curLinkIndex-1].applyContext.pass.apply(undefined, args);
						if (forFuture.targetLink == curLinkIndex || forFuture.targetLink == stepName){
							executionChain[curLinkIndex-1].applyContext.pass.apply(undefined, forFuture.args)
						}
					})
				})

			}
			return chainer;
		}

		// for debugging
		//chainer.getChain = function(name){
		//	return executionChain;
		//}

		// enviroment set up add the first object to the chain.
		chainer.then(chainName, chainStart);

		// if the starting function doesn't take any args, begin the chain
		if (!chainStart.length){
			chainer();
		}

		return chainer;
	}

	// export to node if we're in node
	if (typeof module != 'undefined' && module.exports) {module.exports = context["doAsync"];}
})(this)