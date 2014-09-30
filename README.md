typeahead ajax
==============
Connects to a server and populates a box with matches.


Requirements
------------

1.	A form with a textbox for input. This will used for typeahead, so it needs to be identifiable. In the sample below, the form has an id, and the textbox has a name.
2. A server prepared to respond to an GET request, returning some sort of data in JSON format. It should represent an array of objects.


Usage
-----

	typeAhead(element,url,template,callback);

###Code

HTML

```html
<form id="test">
	<input name="data">
</form>
```

JS

```js
var element='form#test input[name="data"]';
var url='http://…';
var template='[item] [item]';
function callback(result) {
	//	process result
}
var options={
	"suggestions":"suggestions",
};

typeAhead(element,url,template,callback,options);
```

###Parameters

| Option	| Meanning |
| :-----	| :-------- |
element 	| Selector of input element to become typehead element
url			| URL for ajax data
template	| String with pattern to display inside suggestions enclose database fields in square brackets
callback	| Callback function to process results. The result object is an array of objects matching the request.
options	| An optional object – currently only the selector is available.

###Samples

####element
	form#data input[name=town]

####url
	test


####template
	[town] [state] [postcode]

####callback

	function(result) {
	
	}

The callback function takes one parameter, which is an array with the results.

####options
	{
	"suggestions": "suggestions",
	};

The only option available is the selector for the selection box. This allows you to make changes to the appearance in CSS. The value takes the following format:

| Format		| Meaning 	| CSS Selector   |
| :----------	| :--------- 	| :-----------   |
| @someting	| attribute	| div[something] |
| #something	| id			| div#something  |
| .something	| class		| div.something  |
| something	| attribute	| div[something] |

Sample
------

The Sample file says it all, but here are the important parts:

```html
<script type="text/javascript" src="typeahead.js"></script>
<script type="text/javascript">
	window.onload=init;
	function init() {
		var form=document.querySelector('form#sample');
		typeAhead('form#sample input[name="town"]','http://widgets.comparity.net/postcodes.php?limit=16&town=','[locality] [state] [postcode]',function(result) {
			form['location'].value=result.locality;
			form['state'].value=result.state;
			form['postcode'].value=result.postcode;
		});
	}
	</script>
```

###To Do:

3.	Consolidate input & element variables