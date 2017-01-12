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

<h3>.then(callback)</h3>
<p>The .then() function takes 1 callback function and exposes to it's "this" property the api to interact with the chain. If you are going to be calling the chain interaction api you will most likely want to set a reference to them so you can call them within your own callbacks later.</p>

<h4>this.pass()</h4>
<p>the pass function is what tells the wrapper that your code has completed and that you are going to proceed to the next chunk of asynchronous or synchronous code. Treat it like the return key word (although yes you can add more stuff after pass is called, I really don't reccomend it). You can pass any number of properties to the next call back in the chain. </p>

<h4>this.end()</h4>
<p>the end function is similar to the pass function in that you shouldn't put any code under it. When called, it will terminate the chain of calls. It takes no arguments.</p>

<h3>Error Handeling</h3>
<p>Although the general structure looks kind of like a Promise chain, there's a few key differences between this and a Promise chain. First off if a blocking error happens, nothing is going to save it from throwing the error and terminating. This means that you must handle all of your errors within the callback itself. However this also means that if you encounter an error and you would like to terminate the execution chain then you can do that within the catch part of a try-catch block</p>

<h2>Licencing</h2>
Free for all yay!