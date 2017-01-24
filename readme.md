<h1>Do Async</h1>
<p>Do Async is a tiny asynchronous wrapper for doing asynchronous calls in series and having the events play out in the proper sequence. The special aspect of this is you can break your chain at any time (unlike Promises) and it works both in the browser and in Node</p>
<p>This project was inspired by a personal not so fondness of endless callbacks and declaring them resulting in mostly backwards looking code and not wanting ot deal with Promise chains that cannot terminate mid way through. Instead of looking online for a already created package, I thought it would be a good idea to just make my own. The API for using this is inspired by the Promise API with alot cut out.</p>

<h2>Installing:</h2>

<h3>Browser</h3>

<p>put this somewhere in your document</p>
<pre>&lt;script src=&quot;path/to/do-async.js&quot;&gt;&lt;/script&gt;</pre>

<h3>Node</h3>
<p>npm install do-async</p>

<h2>Usage:</h2>

<h3>Basic Structure</h3>
<p>Assuming you have already done either <pre>const doAsync = require('do-async');</pre> or <pre>&lt;script src=&quot;path/to/do-async.js&quot;&gt;&lt;/script&gt;</pre> You can then do:</p>

<pre>
doAsync(function(){
	var pass = this.pass;
	var end = this.end;
	
	//my sync or async logic...
	
	pass(someValA, someValB, ... , someValZ);
}).then(function(someVal1, someVal2, ... , someValN){
	var pass = this.pass;
	var end = this.end;
	
	//my sync or async logic...
	
	pass(someValA, someValB, ... , someValZ );
}).then(...

	... 
	
...).then(function(someVal1, someVal2, ... , someValN){
	var pass = this.pass;
	var end = this.end;
	
	//my sync or async logic...
});
</pre>

<h3>doAsync(callback [, linkName])</h3>
<p>This is the function that you use to initiate the process. It takes 1 callback and optionally one name identifyer. If the callback take no arguements, the function will automatically start the process. If you save the returned value with a variable eg: </p>
<pre>
	var findIfLibUpdated = doAsync(function(req, res, next){
		// logic
	}).then( ...
</pre>
<p>You can then use the variable saved above as a function EG: as part of an express app.</p>
<pre>
	var express = require('express')
	var app = express()
	app.get("/*", findIfLibUpdated)
</pre>

<h3>.then(callback [, linkName])</h3>
<p>The .then() function takes 1 callback function and optionally one string to identify the function in the chain. it exposes to the callback's "this" property the api to interact with the chain when it calls the callback. If you are going to be calling the chain interaction api you will most likely want to set a reference to them (or the this property) so you can call them within your own callbacks later. you can chain these .then calls.</p>

<h4>this.pass()</h4>
<p>the pass function is what tells the wrapper that your code has completed and that you are going to proceed to the next chunk of code. You can call this multiple times throughout your function and will whatever is the next callback provide by the next .then call in the chain. You can pass any number of arguements to the pass function which will get passed to the next callback in line.</p>

<h4>this.end() || this.destroy()</h4>
<p>The end or destroy function are alius for each other and will perform the same function. this is an emergency abort function which will erase the whole chain and make it so that you cannot add more function onto it with the then function.</p>

<h4>this.jump(numberToJump)</h4>
<p>This function jumps by a number. You can jump forwards or backwards in the chain and lets you traverse your async chain freely. This function will return a function that you can use to call the block that you want. You can use this in one of a few ways such as:</p>
<pre>
	var narrative = doAsync(function(){
		var adventure = window.confirm("are you willing to go on an adventure?");
		if (!adventure){
			// jump 5 thens into the future 
			this.jump(5)(false);
		}
		else{
			this.pass(true);
		}
	}).then(... 
	
		...
	
	...}).then(... 
	
		...
	
	...}).then(... 
	
		...
	
	...}).then(... 
	
		...
	
	...}).then(function(hasEquipment){
		if (hasEquipment){alert("You killed the evil dragon")}
		else{alert("You have been killed by the evil dragon")}
	})
</pre>


<h3>Error Handeling</h3>
<p>Although the general structure looks kind of like a Promise chain, there's a few key differences between this and a Promise chain. First off if a blocking error happens, nothing is going to save it from throwing the error and terminating. This means that you must handle all of your errors within the callback itself. However this also means that if you encounter an error and you would like to terminate the execution chain then you can do that within the catch part of a try-catch block</p>

<h2>Licencing</h2>
Free for all yay!