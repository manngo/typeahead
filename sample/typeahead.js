/*	Type Ahead Ajax
	================================================
	Usage:
	HTML	<form id="test">
				<input name="data">
			</form>
	JS		//	typeAhead(element,url,template,callback)
			var element='form#test input[name="data"]';
			var url='http://…';
			var template='[item] [item]';
			typeAhead(element,url,function(result) {

			});

	Parameters

		element		input element to become typehead element
		url			url for ajax data
		template	string with pattern to display inside suggestions
					enclose database fields in square brackets
		callback	callback function to process results:

					function(result) {

					}

					result object is an array of objects matching
					the request

	Ajax

		The processing script (url above) will a query string with
		the text value of the input element (element above) appended.

	To Do:

	1	Set up options object
	2	Suggestion Box: use attribute selector
	3	Consolidate input & element variables

	================================================ */

	function typeAhead(element,url,template,callback,options) {
		'use strict';
		//	Options
			options=options||{};

		var suggestionStyle=options.suggestions||'@suggestions';

		var input=document.querySelector(element);
		var	suggestionBox,
			ajax=new XMLHttpRequest(),
			suggestions=[],
			selection=null;
		input.focus();
		input.onkeyup=doKeyup;
		input.onkeydown=doKeydown;
		ajax.onreadystatechange=process;

		suggestionBox=document.createElement('div');

		switch(suggestionStyle.charAt(0)) {
			case '@':
				suggestionBox.setAttribute(suggestionStyle.substr(1),true);
				break;
			case '#':
				suggestionBox.setAttribute('id',suggestionStyle.substr(1));
				break;
			case '.':
				suggestionBox.className=suggestionStyle.substr(1);
				break;
			default:
				suggestionBox.setAttribute(suggestionStyle,true);
		}

		suggestionBox.style.cssText='visibility: hidden; position: absolute; background-color: white; width: %spx;'.sprintf(input.offsetWidth-2);
		
//		suggestionBox.style.width=(input.offsetWidth-2)+'px';
//		suggestionBox.style.left=input.offsetLeft+'px';

		input.parentNode.insertBefore(suggestionBox,element.nextSibling);

		input.form.onkeypress=function(event) {
			event=event||window.event;
			return event.keyCode!=13;
		};

		function doKeyup(event) {
			event=event||window.event;
			var k=event.keyCode;

			if(k==8 || k==46 || k==32 || k>=48 && k<=57 || k>=64 && k<=90) {	// fetch results
				if(input.value.length) {
					if(ajax.readyState) ajax.abort();
					ajax.open('get',url+input.value,true);
					ajax.send(null);
				}
			}
			else if(k==27) {
				input.value='';
			}
			
			if(input.value.length) {
				suggestionBox.style.visibility='visible';
				document.body.onclick=hide;
			}
		}

		function hide() {
			input.value='';
			suggestionBox.style.visibility='hidden';
			document.body.onclick=null;
		}
		
		function process() {
			emptyNode(suggestionBox);
			if(ajax.readyState==4) {
				if(ajax.responseText) {
				suggestions=JSON.parse(ajax.responseText);
				if(suggestions.length)
					for(var i=0;i<suggestions.length;i++) {
						var	result=suggestions[i];
							result.text=template.replace(/\[(.*?)\]/g,function(match,p1) {
								return result[p1]===undefined?p1:result[p1];
							});
						var	element=document.createElement('p');
							element.appendChild(document.createTextNode(result.text));
							element.onmouseover=highlightSuggestion;
							element.onmouseout=lowlightSuggestion;
						element.onclick = function(q) {
							return function () {
								callback(q);
								input.value=q.text;
								suggestionBox.style.visibility='hidden';
							};
						}(result);
						suggestionBox.appendChild(element);
					}
				}
			}
		}

		function emptyNode(node) {
			while(node.hasChildNodes()) node.removeChild(node.firstChild);
		}
		function doKeydown(event) {
			event=event||window.event;
			switch(event.keyCode) {
				case 40:
					if(selection) selection.className='';
					selection=selection&&selection.nextSibling||suggestionBox.firstChild;
					selection.className='hover';
					break;
				case 38:
					if(selection) selection.className='';
					selection=selection&&selection.previousSibling||suggestionBox.lastChild;
					selection.className='hover';
					break;
				case 9:
				case 13:
					selection.onclick();
					break;
				default:
					selection=null;
			}
		}

		function highlightSuggestion(e) {
			this.className='hover';
			selection=this;
		}
		function lowlightSuggestion(e) {
			this.className='';
		}

	}

/*	Function say
	================================================

	Display message on screen

	================================================ */

	function say(message) {
		var div=document.createElement('div');
		//	div.style.cssText='';
		div.setAttribute('id','message');

		div.style.cssText='width: 200px; height: 100px;\
			overflow: auto; position: fixed;\
			right: 20px; bottom: 20px; white-space: pre-wrap;\
			border: thin solid #666; background-color: rgba(255,255,255,.8);\
			box-shadow: 4px 4px 4px #666;\
			padding: 1em; font-family: monospace;';

		document.body.appendChild(div);
		say=function(message) {
			if(message===undefined) div.textContent='';
			else div.textContent+=message+'\n';
		};
		say(message);
	}

/*	String.sprintf
	================================================ */

	String.prototype.sprintf=function() {
		var string=this;
		for(var i=0;i<arguments.length;i++) string=string.replace(/%s/,arguments[i]);
		return string;
	};
