<h1>Do Async</h1>
<p>Do Async is a tiny asynchronous wrapper for doing asynchronous code in series or parallel and having the events play out in the proper sequence. The special aspect of this is you can break your chain at any time (unlike Promises) and it works both in the browser and in Node</p>
<p>This project was inspired by a personal not so fondness of endless callbacks and declaring them resulting in mostly backwards looking code and not wanting ot deal with Promise chains that cannot terminate mid way through. Instead of looking online for a already created package, I thought it would be a good idea to just make my own. The API for using this is inspired by the Promise API with alot cut out.</p>

<h2>Installing:</h2>

<h3>Browser</h3>

<p>put this somewhere in your document</p>
<pre>&lt;script src=&quot;path/to/do-async.min.js&quot;&gt;&lt;/script&gt;</pre>
<small>Raw: 1.4 kB, gzip: 897 B</small>

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

<h3>doAsync([linkName, ] callback)</h3>
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

<h3>.then([linkName, ]callback)</h3>
<p>The .then() function takes 1 callback function and optionally one string before the callback to identify the function in the chain. it exposes to the callback's "this" property the api to interact with the chain when it calls the callback. If you are going to be calling the chain interaction api you will most likely want to set a reference to them (or the "this" object) so you can call them within your own callbacks later. you can chain these .then calls.</p>

<h4>this.pass()</h4>
<p>the pass function is what tells the wrapper that your code has completed and that you are going to proceed to the next chunk of code. You can call this multiple times throughout your function whixch will begin executing whatever is the next callback provide by the next .then call in the chain. You can pass any number of arguements to the pass function which will get passed to the next callback in line.</p>

<h4>this.end() || this.destroy()</h4>
<p>The end or destroy function are alius for each other and will perform the same function. this is an emergency abort function which will erase the whole chain and make it so that you cannot add more function onto it with the then function. in most cases, you do not need to call this function ever. </p>

<h4>this.jump(numberToJump)</h4>
<p>This function jumps by a number. You can jump forwards or backwards in the chain and lets you traverse your async chain freely. This function will return a function that you can use to call the callback block that you want. you jump forwards or backwards in the execution. You can use the jump function in a few creative ways such as:</p>
<pre>
	var narrative = doAsync(function(){
		var legends = window.confirm("are you willing to become the warrior of legends?");
		
		if (!legends){
			// skip the next line. 
			this.pass(["farm", "village", "contenent", "world"]);
		}
		
		else{
			this.jump(2)();
		}
	}).then(function(destroyedItems){
		alert("Your " + destroyedItems[0]+ " was destroyed by the evil dragon");
		
		var followCalling = confirm("are you ready to become the warrior of legends now?");
		
		if (followCalling){
			this.pass()
		}
		else if (destroyedItems.length <= 1){
			this.jump(4)()
		}
		else{
			this.jump(0)(destroyedItems.slice(1))
		}
		
	}).then(function(){
		
		alert("you are now training for your encounter with the evil dragon");
		
		var pass = this.pass;
		setTimeout(function(){
			pass();
		}, 5000);
		
	}).then(function(){
	
		this.pass(confirm("armor up?"));
		
	}).then(function(hasEquipment){
	
		if (hasEquipment){
			alert("You killed the evil dragon")
		}
		else{
			alert("The evil dragon killed you")
		}
		
	}).then(function(hasEquipment){
	
		alert("Game Over");
		var again = window.confirm("are you willing to go on an adventure?");
		if (again){
			this.jump(-3)(true);
		}
		
	})
</pre>

<p>The above example is a bit convoluted and if you wanted to add segments to your narrative, it becomes a bit hard as you would have to re-structre your jumps every time you add another narrative branch. But that's why you can name your segments and use... </p>

<h4>this.jumpTo(target) || this.jumpto(target)</h4>
<p>I decided that having jumpto and jumpTo because I cant decide which one is more correct. They are identicle to each other in function (reference the same method actually) and will return a callback to the jump target. You can use it in conjunction with naming your segments above and modify your narrative this way</p>

<pre>
	var narrative = doAsync(function(){
		var legends = window.confirm("are you willing to become the warrior of legends?");
		
		if (!legends){
			// skip the next line. 
			this.pass(["farm", "village", "contenent", "world"]);
		}
		
		else{
			this.jumpTo("training")();
		}
	}).then(function(destroyedItems){
		alert("Your " + destroyedItems[0]+ " was destroyed by the evil dragon");
		
		var followCalling = confirm("are you ready to become the warrior of legends now?");
		
		if (followCalling){
			this.pass()
		}
		else if (destroyedItems.length <= 1){
			this.jumpto("gameOver")()
		}
		else{
			this.jump(0)(destroyedItems.slice(1))
		}
		
	}).then("training", function(){
		
		alert("you are now training for your encounter with the evil dragon");
		
		var pass = this.pass;
		setTimeout(function(){
			pass();
		}, 5000);
		
	}).then(function(){
	
		this.pass(confirm("armor up?"));
		
	}).then(function(hasEquipment){
	
		if (hasEquipment){
			alert("You killed the evil dragon")
		}
		else{
			alert("The evil dragon killed you")
			this.jumpto("gameOver");
		}
		
	}).then("gameOver", function(hasEquipment){
	
		alert("Game Over");
		var again = window.confirm("Play again?");
		if (again){
			this.jumpTo(0)(true);
		}
		
	})
</pre>

<p>This way, if you add more segments between training and game over, you do not have to re-define where your jumps are anymore. You can also jump to indexs but that's generally less useful eg: this.jumpto(5)(args)</p>

<h4>this.self()</h4>
<p>This is for if you want to do something recursively. and calling this.self(args) is equivilant to calling this.jump(0)(args) in the above example the recursive call exists in the call to action narrative plot point assuming you decline to become the hero of legends and we can replace this.jump(0)(destroyedItems.slice(1)) with this.self(destroyedItems.slice(1))</p>

<h3>Parallel processes</h3>
You can perform parallel processes and also have them converge to continue segments in series such as: 

<pre>
	const resourceGather = doAsync("start", function(req, res, next){
	
		var context = {req:req, res:res, next:next};
		this.jumpto("establishDbLink")(context);
		this.jumpto("fetchRequestBody")(context);
		
	}).then("establishDbLink", function(context){
		
		var chain = this;
		
		// logic to create your link to the db should be implemented else where
		linkToDb(credentials, function(err, link){
			if (err){
				chain.jumpto("catchErr")(context, err);
			}
			else{
				context.dbLink = link;
				chain.jumpto("saveUploadToDb")(context);
			}
		})
		
	}).then("fetchRequestBody", function(context){
		
		var chain = this;
		
		// logic to wait for upload to complete and save upload to upload should be implemented elsewhere
		collectUploads(context.req, function(err, uploadedFile){
			if (err){
				chain.jumpto("catchErr")(context, err);
			}
			else{
				context.upload = uploadedFile;
				chain.jumpto("saveUploadToDb")(context);
			}
		}){}
		
	}).then("saveUploadToDb", function(context){
		
		var chain = this;
		if (context.upload && context.dbLink){
			//do logic to insert your upload via the dbLink and call context.next() when done. 
		}
		
	}).then("catchErr", function(context. err){
	
		//handle it
		
	})
</pre>

<p>both "fetchRequestBody" and "establishDbLink" are fired at roughly the same time and once when either are done, they indiviually report back to "saveUploadToDb" with the results. because they share the same context object, what "fetchRequestBody" does to it will be felt by "establishDbLink" and vice versa. as a result the last one that provides the context will also have the most up to date version of context. When the conditions are satisfied, saveUploadToDb fires and saves the upload to the DB. We also have a global handle error in there for good measure</p>

<h3>Promise and Error Handeling</h3>
<p>Although the general structure looks kind of like a Promise chain, there's a few key differences between doAsync and a Promise chain. First off there's only one function that you can call to add to the chain which is .then(). Second error handeling is slightly more forgiving but if you dont catch them problems will happen. On the other hand, Promise will natrually put your code into a try-catch block. doAsync is very solidly callback based and will just throw the error if the error isn't recoverable or caught. </p>

<h3>Upgrading</h3>
<p>you can directly upgrade from 0.0.X to 0.1.X without changing your code.</p>

<h2>Licencing</h2>
Free for all yay!