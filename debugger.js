/*
* Author: Jackey.King
* Permission is hereby granted, free of charge, to any person obtaining
* a copy of this software and associated documentation files (the
* "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish,
* distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to
* the following conditions:
*
* Copy Right (C) Jackey.King Mail:Jackey.King@gmail.com
*
* If you like it ,please let me know
* If you Modified it, Please sent me a copy
* If you have good suggestions, please do not cherish your hand and the keyboard & let me know
* My mail is Jackey.King@gmail.com
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*/
/*
javascript:var head = document.getElementsByTagName("head")[0];var js = document.createElement("script");js.src = "file:///javascriptdebugger/debugger.js";head.appendChild(js);alert('inject success!');
javascript:var head = main.document.getElementsByTagName("head")[0];var js = main.document.createElement("script");js.src = "file:///javascriptdebugger/debugger.js";head.appendChild(js);alert('inject success!');
*/
/*
*History
*V0.1
*just a utils to change some object colors, F7 F8 functions
*append some utils
*code lines less than 500
*V0.2
*deleted css style file, make debugger to a single file
*append a mount functions
*code lines counted more than 1000
*v0.3
*made oDebugger to a single Object //2008-10-30 23:41
*v0.31
*fixed bugs //2008-11-06
*v0.4
*made oDebugger to a real debugger (add bp bpx bl bc commands) //2008-11-06
*v0.41
*fixed bugs //2008-11-06
*v0.42
*fixed bugs: add id:debuggerClientDiv & set it's style //2008-11-07
*v0.421
*fixed some style bugs//2008-11-08
*v0.5 under release
*add show mode method
*add some methods
*add handler method
*move keycode & mousepos cmd into mode method//2008-11-11
*v0.5 under release
*try move to firefox
*move keycode & mousepos cmd into mode method//2008-11-11 - 2008-11-12
*v0.5 pre release
*add mouse mode inspect
*add menu		//2008-11-12
*v0.51 pre release
*fixed listObject ( L ) bugs		//2008-11-12
*v0.6 pre release
*fix bugs
*modified bpx bp method's calling method, caller now have perfect run		//2008-11-12
*/

/*
*################################################################################################################################################
*Dynamic load debugger
*################################################################################################################################################
*/

//Copy a line string to iexplorer's location bar, and press RETURN, when you got a message like 'inject success!', that's mean debugger have finished it's dynamic loaded
//Tips: you need modify some locations in those strings; If your debugger.js is put in C:\debugger\debugger.js , the you can use this: file:///debugger/debugger.js to replace it.

//javascript:initdebugger();
//inline function to load debugger.js file
//usage: copyit to location input, and press return;
//javascript:document.getElementsByTagName('head').item(0).appendChild((document.createElement('script')).setAttribute('src','e:\\debugger\\debugger.js'));
//javascript: var ss = document.createElement('script'); ss.setAttribute('type','text/javascript'); ss.setAttribute('src','e:\\debugger\\debugger.js');var ohead = (document.getElementsByTagName('head').item(0)); ohead.appendChild(ss);alert('inject success!');
//javascript: var ss = main.document.createElement('script'); ss.setAttribute('type','text/javascript'); ss.setAttribute('src','js/debugger.js');var ohead = (main.document.getElementsByTagName('head').item(0)); ohead.appendChild(ss);alert('inject success!');
//for frames, main frame name is 'main'
//javascript: var ss = main.document.createElement('link'); ss.setAttribute('type','text/css');ss.setAttribute('rel','stylesheet'); ss.setAttribute('src','js/debugger.css');var ohead = (main.document.getElementsByTagName('head').item(0)); ohead.appendChild(ss);alert('inject success!');
//fileref.setAttribute('type','text/javascript');
//)

//javascript:var head = document.getElementsByTagName("head")[0];var js = document.createElement("script");js.src = "file:///javascriptdebugger/debugger.js";head.appendChild(js);alert('inject success!');
//javascript:var head = main.document.getElementsByTagName("head")[0];var js = main.document.createElement("script");js.src = "file:///javascriptdebugger/debugger.js";head.appendChild(js);alert('inject success!');
/*
var head = document.getElementsByTagName("head")[0];
var js = document.createElement("script");
js.src = "e\:\\debugger\\debugger.js";
js.onload = js.onreadystatechange = function(){
    if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")
     {
        //do something
     }
}
head.appendChild(js);

function loadJs(file){
     var scriptTag = document.getElementById('loadScript');
     var head = document.getElementsByTagName('head').item(0);
     if(scriptTag){
     head.removeChild(scriptTag);
     }
     script = document.createElement('script');
     script.src = ""+file; //file是全路径,后缀是.js
     script.type = 'text/javascript';
     script.id = 'loadScript';
     head.appendChild(script);
}
*/

var oDebugger = {
	Version: '0.6 pre release',
/*
*################################################################################################################################################
*Public variables
*################################################################################################################################################
*/
//Public variables
	Debugger: null,
	pBody:null,
	_g_isDR:false,
	_g_targetObj: null,
	_g_lasttargetObj : null,
	_g_cssloaded : false,
	_g_jsloaded : false,
	_g_maxCommandHistory : 10,
	_g_maxCommandStore : 10,
	_g_lastpos_x : 0,
	_g_lastpos_y : 0,
	_g_returnValue : null,
	_g_oDList : new Array(),	//eval can't create variables, however, we can use _g_oDList to save functions or variables
	//O : this.oDList, //make a shortcut ;=)
	_g_watchDatas : {}, //watch datas
	_g_enableShowKeyCode : false,
	_g_enableShowMousePos : false,
	_g_enableShowMouseObject : false,
	_g_lastMouseObject : null,
	_g_lastMouseObjectStyle:{
		border:'',
		borderLeft:'',
		borderRight:'',
		borderTop:'',
		borderBottom:''
	},
	_g_menuTarget: null,

	_g_breakpoints : new Array(),
	_g_eval: null,
	funcName : /^[a-zA-Z0-9_.]+$/i,
	_g_runCommandOrgetInput: true,
	_g_cmdFocus:true,

	debuggerStr : "Debugger(Version:" + 0.6 + ' pre release' + "):<span onclick='oDebugger.showdebugger(false);' id='debugger_hiddenBtn'>x</span><br/><input type='text' value='' id='debuggerInfo' /><button onclick=\"oDebugger.$(\'DebuggerOutput\').innerHTML=\'\'\" id='debugger_clearOutput' >clear</button><div id='debuggerClientDiv'><div contenteditable id='DebuggerOutput' designMode></div><input type='text' id='debuggerCommand'/><button onclick=\"oDebugger.dealCommand(oDebugger.$(\'debuggerCommand\'));\" id='debugger_runCommand'>run</button></div>",
	menuStr : '<li>' +
		'<ul onclick="javascript:oDebugger.showHelp();">Help</ul>' +
		'</li>',
	subMenuStr : '<li>' +
		'<ul onclick="javascript:oDebugger.selectAll(oDebugger.$(\'DebuggerOutput\'));">Select All</ul>' +
		'<ul onclick="javascript:oDebugger.copy(oDebugger.$(\'DebuggerOutput\'));">Copy</ul>' +
		'</li>',

	colors: {
		ERROR: 'red',
		COMMAND:'blue',
		HELP:'#FF00FF',
		BACKGROUNDCOLOR:'#FFFF00',
		BACKGROUNDCOLOR_DEACTIVE:'#CCCCCC',
		TIP: 'red',
		MOUSETIP: 'blue',
		MENUBACKGROUNDCOLOR:'#FFFFFF',
		MENUCOLOR:'#CCCCCC',
		MENUOVER: 'blue'
	},
	alpha: {
		MENU: '75',
		BODY: '75'
	},
	//Debug method You can add your debugger code below ;=)
	testme:function (){
		var ss = document.createElement('script'); ss.setAttribute('type','text/javascript'); ss.setAttribute('src','e:\\debugger\\debugger.js');var ohead = (document.getElementsByTagName('head').item(0)); ohead.appendChild(ss);alert('inject success!');
	},
	garbageLoop:function(evt){
		//for(;;){
			evt = (evt) ? evt : ((window.event) ? window.event : "");
			var keycode = evt.keyCode || evt.which;
			if(evt && keycode == 67){ //keyCode c is pressed
			}else{
				var x = x + 'asdfsdfasdfasdf';
				x = '';
				x = 'garbageLoop';
				oDebugger.showoutput(x, false);
				setTimeout(oDebugger.garbageLoop, 10);
			}
		//}
	},
	showdetails:function (args){
		this.showoutput('====================================', false);
		this.showoutput('tagName:' + args.tagName, false);
		this.showoutput('clientTop:' + args.clientTop, false);
		this.showoutput('clientLeft:' + args.clientLeft, false);
		this.showoutput('offsetTop:' + args.offsetTop, false);
		this.showoutput('offsetLeft:' + args.offsetLeft, false);
		this.showoutput('scrollLeft:' + args.scrollLeft, false);
		this.showoutput('scrollTop:' + args.scrollTop, false);
		this.showoutput('style:' + args.STYLE, false);
		this.showoutput('style.position:' + args.style.position, false);
		this.showoutput('style.styleFloat:' + args.style.styleFloat, false);
		this.showoutput('====================================', false);
	},
	showoutput:function (args, inline, color){
		
		if(arguments.length <= 1){
			if(document.all){
				this.$('DebuggerOutput').innerText += args;
			}else{
				this.$('DebuggerOutput').textContent += args;
			}
		}else if(!color){
			this.$('DebuggerOutput').innerHTML += args;
		}else{
			this.$('DebuggerOutput').innerHTML += '<font color=' + color + '>' + args + '</font>';
		}
		if(arguments.length > 1 && !inline){
			this.$('DebuggerOutput').innerHTML += '<br/>';
		}else if(arguments.length == 1 || !inline){
			if(document.all){
				this.$('DebuggerOutput').innerText += '\n';
			}else{
				this.$('DebuggerOutput').textContent += '\n';
			}
		}
		this.$('DebuggerOutput').scrollTop = Number(this.$('DebuggerOutput').scrollHeight);
	},
	debugme:function (args){
		//args.border = '1px solid #FF0000';
		//args.backgroundColor = "#0000FF";
		//args.STYLE='border:2px solid #FF0000';
		this.showoutput(args.style.position);
	},
	changeBackColor:function (obj, args){
		if(this._g_lasttargetObj != null){
			this._g_lasttargetObj.style.backgroundColor = this._g_lasttargetObj._oldBackGroundColor;
		}
		if(this._g_lasttargetObj == obj){
			return;
		}
		this._g_lasttargetObj = obj;
		this._g_returnValue = obj;
		obj._oldBackGroundColor = obj.style.backgroundColor;
		obj.style.backgroundColor = '#FFFFDC';
	},
	timerChangeBackColor:function (obj, args){
		oDebugger.showoutput('Timer begin....', false);
		if(oDebugger._g_lasttargetObj != null){
			oDebugger._g_lasttargetObj.style.backgroundColor = oDebugger._g_lasttargetObj._oldBackGroundColor;
		}
		oDebugger._g_lasttargetObj = obj;
		oDebugger._g_returnValue.push(obj);
		obj._oldBackGroundColor = obj.style.backgroundColor;
		obj.style.backgroundColor = '#FFFFDC';
		oDebugger.showdetails(obj);
		if(obj.parentElement){
			setTimeout(function(evt){
					evt = (evt) ? evt : ((window.event) ? window.event : "");
					oDebugger.timerChangeBackColor(oDebugger._g_lasttargetObj.parentElement);}, 900);
			return;
		}
		if(oDebugger._g_lasttargetObj != null){
			oDebugger._g_lasttargetObj.style.backgroundColor = oDebugger._g_lasttargetObj._oldBackGroundColor;
		}
		oDebugger.showoutput('Timer end....', false);
	},

	_getMethods:function (obj){
		oDebugger.showoutput('-------=getMethods Begin=-------');
		oDebugger.showoutput(' ');
		var i = 0;
		var tmp = '';
		//var objid = String(obj);
		for(var x in obj)
		{
			if( x == 0 ){
				break;
			} else {
				var str = "obj." + x;
				var pattern = /[^a-z\_A-Z0-9\.]/ig;
				var arr = str.match(pattern);
				if(!arr){   //如果对象为规则，符合eval的要求，规则的对象名由0-9a-Z_组成
					if(typeof(oDebugger._g_eval("obj." + x)) == 'function'){
						tmp = "obj." + x +  "   =   " + String(oDebugger._g_eval("obj." + x)).substring(0, String(oDebugger._g_eval(objid + "." + x)).indexOf('{'));
					}else{
						tmp = "obj." + x + "   =   " + oDebugger._g_eval("obj." + x);
					}
					oDebugger.showoutput(tmp, false);
				}//if   判断对象是否规则结束
			}//else   结束
			i++;
			if( i > 2000 ){
				oDebugger.showoutput('=============Error==============', false);
				oDebugger.showoutput('Error!!!! Loop\'s count more than 2000!!!', false, oDebugger.colors.ERROR);
				oDebugger.showoutput('=============Error==============', false);
				break;
			};
		}//for   结束
		//forloop's counts i;
		oDebugger.showoutput('========getProperty End=========', false);
	},
	//get object's childrens
	_getProperty:function (obj, objid){
		this.showoutput('-------=getProperty Begin=-------');
		var i = 0;
		var tmp = '';
		//var objid = String(obj);
		for(x in obj)
		{
			if( x == 0 ){
				break;
			} else {
				var str = objid + "." + x;
				pattern = /[^a-z\_A-Z0-9\.]/ig;
				var arr = str.match(pattern);
				//oDebugger.showoutput('----arr-----------');
				//oDebugger.showoutput(arr);
				if(!arr){   //如果对象为规则，符合eval的要求，规则的对象名由0-9a-Z_组成
					if(typeof(this._g_eval(objid + "." + x)) == 'function'){
						tmp = objid + "." + x +  "   =   " + String(this._g_eval(objid + "." + x)).substring(0, String(this._g_eval(objid + "." + x)).indexOf('{'));
					}else{
						tmp = objid + "." + x + "   =   " + this._g_eval(objid + "." + x);
					}
					this.showoutput(tmp);
				}//if   判断对象是否规则结束
			}//else   结束
			i++;
			if( i > 2000 ){
				this.showoutput('=============Error==============');
				this.showoutput('Error!!!! Loop\'s count more than 2000!!!', false, this.colors.ERROR);
				this.showoutput('=============Error==============');
				break;
			};
		}//for   结束
		//forloop's counts i;
		this.showoutput('========getProperty End=========');
	},
	//get object's simple tree
	_getSTree:function (obj, objid){
		this.showoutput('-------=getSTree Begin=-------');
		var i = 0;
		var tmp = '';
		//var objid = String(obj);
		for(x in obj)
		{
			if( x == 0 ){
				break;
			} else {
				var str = objid + "." + x;
				pattern = /[^a-z\_A-Z0-9\.]/ig;
				var arr = str.match(pattern);
				//oDebugger.showoutput('----arr-----------');
				//oDebugger.showoutput(arr);
				if(!arr){   //如果对象为规则，符合eval的要求，规则的对象名由0-9a-Z_组成
					if(typeof(this._g_eval(objid + "." + x)) == 'function'){
						tmp = tmp = objid + "." + x +  "   =   " + String(this._g_eval(objid + "." + x)).substring(0, String(this._g_eval(objid + "." + x)).indexOf('{'));
					}else{
						tmp = objid + "." + x + "   =   " + this._g_eval(objid + "." + x);
					}
					this.showoutput(tmp);
					if((this._g_eval(objid + "." + x ) == "[object]") ){   //if[object]是否为对象。
						var   objsub;
						objsub = this._g_eval(objid + "." + x);
						objsubid = objid + "." + x;
						if(objsubid.search(/document/i) == -1 )     //如果将document也循环，那么将陷入死循环。
						{ //因为每个对象都有子对象document.
							if(objsubid.search(/(parent)/i) == -1){     //parent也不可以
								this._getSTree(objsub, objid);
								//oDebugger.showoutput(tmp);
								i++;
							}
						}   //   if   非document对象结束
					}//if   [object]   结束
				}//if   判断对象是否规则结束
			}//else   结束
			i++;
			if( i > 2000 ){
				this.showoutput('=============Error==============');
				this.showoutput('Error!!!! Loop\'s count more than 2000!!!', false, this.colors.ERROR);
				this.showoutput('=============Error==============');
				break;
			};
		}//for   结束
		//forloop's counts i;
		this.showoutput('========getSTree End=========');
	},

	_getprop:function (obj,objid){
		this.showoutput('-------=getprop Begin=-------');
		/*
		var   s   =   "";
		for(var   i   in   window)   s   +=   "window."+   i   +"   =   "+   window[i]   +"\n";
		alert(s);
		break;
		*/
		var i = 0;
		var tmp = '';
		for(x in obj)
		{
			if( x == 0 ){
				break;
			} else {
				var str = objid + "." + x;
				pattern = /[^a-z\_A-Z0-9\.]/ig;
				var arr = str.match(pattern);
				//oDebugger.showoutput('----arr-----------');
				//oDebugger.showoutput(arr);
				if(!arr){   //如果对象为规则，符合eval的要求，规则的对象名由0-9a-Z_组成
					tmp = objid + "." + x + "   =   " + this._g_eval(objid + "." + x) ;
					this.showoutput(tmp);
					if((this._g_eval(objid + "." + x ) == "[object]") ){   //if[object]是否为对象。
						var   objsub;
						objsub = this._g_eval(objid + "." + x);
						objsubid = objid + "." + x;
						if(objsubid.search(/document/i) == -1 )     //如果将document也循环，那么将陷入死循环。
						{ //因为每个对象都有子对象document.
							if(objsubid.search(/(parent)/i) == -1){     //parent也不可以
								this._getprop(objsub,objsubid);
								//oDebugger.showoutput(tmp);
								i++;
							}
						}   //   if   非document对象结束
					}//if   [object]   结束
				}//if   判断对象是否规则结束
			}//else   结束
			i++;
			if( i > 2000 ){
				this.showoutput('=============Error==============');
				this.showoutput('Error!!!! Loop\'s count more than 2000!!!');
				this.showoutput('=============Error==============');
				break;
			};
		}//for   结束
		//forloop's counts i;
		this.showoutput('========getprop End=========');
	},

	_showprop:function (obj, objid)
	{
		this.showoutput('========showprop Begin=======');
		for(x in obj){
			if(x == 0){
				break;
			}else{//if(eval(objid+"."+x)=="[object]")
				this.showoutput( objid + "." + x + "   =   " + this._g_eval(objid + "." + x) );
			}
		}//for   结束
		this.showoutput('========showprop End=========');
	},

	_showvalue:function (obj)
	{
		oDebugger.showoutput('========showvalue Begin=======', false);
		oDebugger.showoutput(' ');
		oDebugger.showoutput( oDebugger._g_eval('obj'));
		oDebugger.showoutput('========showvalue End=========', false);
	},

	listObject:function (obj){
		for ( var i in obj)
		{
			var test = 'obj.' + i;
			oDebugger.showoutput('' + i + '(' + typeof(i) + ')' + ' = ' + oDebugger._g_eval('obj.' + i), false);
		}
	},


	watchVariable:function (obj, timerCount){
		if(this._g_watchDatas.obj && this._g_watchDatas.obj != obj){
			this.showoutput('variable changed! from ' + this._g_watchDatas.obj + ' to ' + obj);
		}else{
			this._g_watchDatas.obj = obj;
		}
		setTimeout(function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				oDebugger.watchVariable(obj, timerCount);}, timerCount);
	},
	watch:function (obj, timerCount){
		if(typeof(obj) == 'object'){
			this.showoutput('Object');
			this.bindEventListner(
				obj, 'onpropertychange', function(evt){
					evt = (evt) ? evt : ((window.event) ? window.event : "");
			//obj.attachEvent('onpropertychange', function(evt){
					this.showoutput('Object property changed!');
				});
		}else{
			watchVariable(obj, timerCount);
		}
	},
	/*
	*################################################################################################################################################
	*Init Debugger Methods
	*################################################################################################################################################
	*/
	//init the debugger
	initdebugger:function (){
		this._g_eval = window.eval;
		//load css Style for debugger
		//LoadJsCssFile('debugger.css', 'css');
		//create debugger's UI
		this.Debugger = this.appendElement('DIV', this.debuggerStr, '', 'position:absolute;overflow-x:auto;overflow-y:auto;top:0;left:0;float:left;width:320px;background-color:#FFFF00;filter: Alpha(Opacity = 75);scrollbar-3dlight-color: #959CBB;scrollbar-arrow-color: #666666;scrollbar-base-color: #445289;scrollbar-darkshadow-color: #959CBB;scrollbar-face-color: #D6DDF3;scrollbar-highlight-color: #959CBB;scrollbar-shadow-color: #959CBB;cursor:move;cursor:move;');
		this.Menu = this.appendElement('DIV', this.menuStr, '', 'position:absolute;display:none;overflow:hidden;top:0;left:0;width:240px;background-color:#CCCCCC;filter: Alpha(Opacity = 75);cursor:hand;cursor:pointer;');
		this.SubMenu = this.appendElement('DIV', this.subMenuStr, '', 'position:absolute;display:none;overflow:hidden;top:0;left:0;width:240px;background-color:#CCCCCC;filter: Alpha(Opacity = 75);cursor:hand;cursor:pointer;');
		document.getElementsByTagName("body").item(0).appendChild(this.Debugger);
		document.getElementsByTagName('body').item(0).appendChild(this.Menu);
		document.getElementsByTagName('body').item(0).appendChild(this.SubMenu);
		this.pBody = document.getElementsByTagName("body").item(0);
		this._g_lastpos_y = Number(document.getElementsByTagName("body").item(0).offsetHeight)/2;
		this._g_lastpos_y = 100;
		this._g_lastpos_x = Number(document.getElementsByTagName("body").item(0).offsetWidth)/2;
		//this.Debugger.attachEvent('onmousedown', function(evt){oDebugger.DownMouse(evt.srcElement, evt);});
		//this.Debugger.attachEvent('onmousemove', function(evt){oDebugger.MoveLayer(evt.srcElement, evt);});
		//this.Debugger.attachEvent('onmouseup', function(evt){oDebugger.UpMouse(evt.srcElement, evt);});
		this.bindEventListner(this.Debugger, 'onmousedown', function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				oDebugger.DownMouse(elem, evt);});
		this.bindEventListner(this.Debugger, 'onmousemove', function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				oDebugger.MoveLayer(elem, evt);});
		this.bindEventListner(this.Debugger, 'onmouseup', function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				oDebugger.UpMouse(elem, evt);});
		this.bindEventListner(
			(document.all)?document.getElementsByTagName("body").item(0):window, 'onmousemove',
			function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				oDebugger._g_targetObj = (evt.target) ? evt.target : evt.srcElement;
				var mouseX = (evt.pageX)?evt.pageX:evt.x;//evt.clientX:evt.x;//evt.pageX;
				var mouseY = (evt.pageY)?evt.pageY:evt.y;//evt.clientY:evt.y;//pageY;
				if(oDebugger._g_enableShowMousePos){
					oDebugger.$('debuggerInfo').value = 'MouseX:' + mouseX + ' MouseY:' + mouseY;
				}
				if(oDebugger._g_enableShowMouseObject){
					oDebugger.showMouseObject(evt, oDebugger._g_targetObj);
				}
			}
		);
		this.bindEventListner(
			this.Debugger, 'oncontextmenu',
			function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				oDebugger._g_menuTarget = oDebugger;
				oDebugger.showMenu(evt, oDebugger.Menu, true);
				oDebugger.stopBubble(evt);
			}
		);
		this.bindEventListner(
			this.$('DebuggerOutput'), 'oncontextmenu',
			function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				oDebugger._g_menuTarget = oDebugger.$('DebuggerOutput');
				oDebugger.showMenu(evt, oDebugger.SubMenu, true);
				oDebugger.stopBubble(evt);
			}
		);
		this.bindEventListner(this.Menu, 'onmouseout', function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				oDebugger.showMenu(evt, oDebugger.Menu, false);});
		this.bindEventListner(this.Menu, 'onclick', function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				oDebugger.showMenu(evt, oDebugger.Menu, false);});
		this.bindEventListner(this.SubMenu, 'onmouseout', function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				oDebugger.showMenu(evt, oDebugger.SubMenu, false);});
		this.bindEventListner(this.SubMenu, 'onclick', function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				oDebugger.showMenu(evt, oDebugger.SubMenu, false);});
		this.bindEventListner(
			this.Menu, 'oncontextmenu',	function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				oDebugger.showMenu(evt, oDebugger.Menu, false);
				oDebugger.stopBubble(evt);});
		this.bindEventListner(
			this.SubMenu, 'oncontextmenu', function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				oDebugger.showMenu(evt, oDebugger.SubMenu, false);
				oDebugger.stopBubble(evt);});
		this.bindEventListner(this.Menu, 'onmouseover', function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				oDebugger.Menu.style.display = 'block';});
		this.bindEventListner(this.SubMenu, 'onmouseover', function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				oDebugger.SubMenu.style.display = 'block';});
		/*document.getElementsByTagName("body").item(0).attachEvent('onmousemove',
			function(evt){
				oDebugger._g_targetObj = evt.srcElement;
				if(oDebugger._g_enableShowMousePos){
					oDebugger.$('debuggerInfo').value = 'MouseX:' + evt.clientX + ' MouseY:' + evt.clientY;
				}
			}
		);*/
		//modify the debugger loaded flag
		this._g_isDR = true;
		//Utils
		//Shortcuts  make a shortcut for somefuncs
		this.S = this.showoutput; //show something
		this.M = this._getMethods;//get Method and variables property
		this.P = this._showvalue;
		this.V = this._showvalue;
		this.L = this.listObject;
		this.$R = this._g_returnValue; //return value's shortcut
		this.O = this._g_oDList;
		//Attach EVENTs
		//keyCode 123 = F12
		//keyCode 118 , 119 = F7, F8
		this.bindEventListner(
			(document.all)?document.getElementsByTagName("body").item(0):window, 'onkeydown',
			function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var keycode = evt.keyCode || evt.which;
				if(keycode=='123'){oDebugger.showdebugger(oDebugger.Debugger.style.display == 'none'?true:false);try{oDebugger.$('debuggerCommand').focus();}catch(e){}}
				if(keycode=='118'){oDebugger._g_returnValue = [];oDebugger.timerChangeBackColor(oDebugger._g_targetObj);}
				if(keycode=='119' && oDebugger._g_targetObj != null){oDebugger.changeBackColor(oDebugger._g_targetObj);oDebugger.showdetails(oDebugger._g_targetObj);}
			}
		);
		/*
		document.getElementsByTagName("body").item(0).attachEvent('onkeydown',
			function(evt){
				if(evt.keyCode=='123'){oDebugger.showdebugger(oDebugger.Debugger.style.display == 'none'?true:false);try{oDebugger.$('debuggerCommand').focus();}catch(e){}}
				if(evt.keyCode=='118'){oDebugger._g_returnValue = [];oDebugger.timerChangeBackColor(oDebugger._g_targetObj);}
				if(evt.keyCode=='119' && oDebugger._g_targetObj != null){oDebugger.changeBackColor(oDebugger._g_targetObj);oDebugger.showdetails(oDebugger._g_targetObj);}
			}
		);*/
		this.$('debuggerCommand')._commandHistory = new Array(this._g_maxCommandHistory);
		this.$('debuggerCommand')._commandStore = new Array(this._g_maxCommandStore);
		this.$('debuggerCommand')._curCommandHistoryIndex = 0;
		//keyCode 13 Enter
		//keyCode 37 <- 38 ^ 39 -> 40 |
		//keyCode 8 BackSpace  46 Delete
		this.bindEventListner(
			this.$('debuggerCommand'), 'onkeydown',
		//this.$('debuggerCommand').attachEvent('onkeydown',
			function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var keycode = evt.keyCode || evt.which;
				if(oDebugger._g_enableShowKeyCode){
					oDebugger.showoutput(keycode, false, oDebugger.colors.ERROR);
				}
				if(evt.ctrlKey){
					switch(keycode){
						case 48: //0
						case 49: //1
						case 50: //2
						case 51: //3
						case 52: //4
						case 53: //5
						case 54: //6
						case 55: //7
						case 56: //8
						case 57: //9
							oDebugger.$('debuggerCommand').value = oDebugger.$('debuggerCommand')._commandHistory[Number(keycode) - 48];
							break;
						case 38: //up arrow
							oDebugger.$('debuggerCommand').value = oDebugger.$('debuggerCommand')._commandHistory[oDebugger.$('debuggerCommand')._curCommandHistoryIndex];
							oDebugger.$('debuggerCommand')._curCommandHistoryIndex += 1;
							if(oDebugger.$('debuggerCommand')._curCommandHistoryIndex > (oDebugger._g_maxCommandHistory - 1)){
								oDebugger.$('debuggerCommand')._curCommandHistoryIndex = 0;
							}
							break;
						case 40: //down arrow
							oDebugger.$('debuggerCommand').value = oDebugger.$('debuggerCommand')._commandHistory[oDebugger.$('debuggerCommand')._curCommandHistoryIndex];
							oDebugger.$('debuggerCommand')._curCommandHistoryIndex -= 1;
							if(oDebugger.$('debuggerCommand')._curCommandHistoryIndex < 0){
								oDebugger.$('debuggerCommand')._curCommandHistoryIndex = oDebugger._g_maxCommandHistory - 1;
							}
							break;
						default:
							break;
					}
				}
				if(evt.altKey){
					switch(keycode){
						case 48: //0
						case 49: //1
						case 50: //2
						case 51: //3
						case 52: //4
						case 53: //5
						case 54: //6
						case 55: //7
						case 56: //8
						case 57: //9
							if(evt.altLeft){
								oDebugger.$('debuggerCommand').value = oDebugger.$('debuggerCommand')._commandStore[Number(keycode) - 48];
							}else{
								oDebugger.$('debuggerCommand')._commandStore[Number(keycode) - 48] = oDebugger.$('debuggerCommand').value;
							}
							break;
						default:
							break;
					}
				}
				if(keycode == '13'){
					oDebugger.dealCommand(oDebugger.$('debuggerCommand'));
				}
				if(keycode == '27'){oDebugger.$('debuggerCommand').value = '';} //ESC pressed
			}
		);
		this.bindEventListner(
			this.$('debuggerCommand'), 'onkeyup',
		//this.$('debuggerCommand').attachEvent('onkeyup',
			function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var keycode = evt.keyCode || evt.which;
				if(keycode == 17){	//ctrl key up
					oDebugger.$('debuggerCommand')._curCommandHistoryIndex = 0;
				}
			}
		);
		this.$('debuggerCommand').focus();
		this.setDebuggerStyle();
		this.$('debuggerCommand').onfocus = this.onActive;
		this.$('debuggerCommand').onblur = this.onDeActive;
		
		if(this.debug.isEvalBeHooked()){
			this.showoutput("ERROR: eval function was hooked by other codes in the front.n", false, this.color.ERROR);
		}
		this.registerPublicVariables();
		this.debug.father = this;
		this.handler.father = this;
		Array.prototype.search=function(reg){
		 var ta=this.slice(0);
		 d='\0';
		 str=d+ta.join(d)+d;
		 regstr=reg.toString();
		 reg=new RegExp(regstr.replace(/\/((.|\n)+)\/.*/g,'\\0$1\\0'), regstr.slice(regstr.lastIndexOf('/')+1));
		 t=str.search(reg);
		 if(t==-1)return -1;
		 return str.slice(0,t).replace(/[^\0]/g,'').length;
		};
	},
	registerPublicSingleVariable:function(obj, objName){
		try{
			if(obj == undefine);
			this.showoutput('Warnning: ' + objName + ' is defined!', false, this.colors.ERROR);
		}catch(e){
			obj = this._g_eval('oDebugger.' + objName);
		}
	},
	registerPublicVariables:function(){
		var errorStr = '';
		try{
			if($ == 'undefine');
			//this.showoutput('Warnning: $ is defined!', false, this.colors.ERROR);
			errorStr = errorStr + 'Warnning: $ is defined!<br/>';
		}catch(e){
			$ = oDebugger.$;
		}

		try{
			if(S == 'undefine');
			//this.showoutput('Warnning: S is defined!', false, 'red');
			errorStr = errorStr + 'Warnning: S is defined!' + '<br/>';
		}catch(e){
			S = oDebugger.S;
		}

		try{
			if(M == 'undefine');
			//this.showoutput('Warnning: M is defined!', false, 'red');
			errorStr = errorStr + 'Warnning: M is defined!' + '<br/>';
		}catch(e){
			M = oDebugger.M;
		}

		try{
			if(P == 'undefine');
			//this.showoutput('Warnning: P is defined!', false, 'red');
			errorStr = errorStr + 'Warnning: P is defined!' + '<br/>';
		}catch(e){
			P = oDebugger.P;
		}

		try{
			if(V == 'undefine');
			//this.showoutput('Warnning: V is defined!', false, 'red');
			errorStr = errorStr + 'Warnning: V is defined!' + '<br/>';
		}catch(e){
			V = oDebugger.V;
		}

		try{
			if(L == 'undefine');
			//this.showoutput('Warnning: L is defined!', false, 'red');
			errorStr = errorStr + 'Warnning: L is defined!' + '<br/>';
		}catch(e){
			L = oDebugger.L;
		}

		try{
			if($R == 'undefine');
			//this.showoutput('Warnning: $R is defined!', false, 'red');
			errorStr = errorStr + 'Warnning: $R is defined!' + '<br/>';
		}catch(e){
			$R = oDebugger.$R;
		}

		try{
			if(O == 'undefine');
			//this.showoutput('Warnning: L is defined!', false, 'red');
			errorStr = errorStr + 'Warnning: O is defined!' + '<br/>';
		}catch(e){
			O = oDebugger.O;
		}

		try{
			if(oD == 'undefine');
			//this.showoutput('Warnning: oD is defined!', false, 'red');
			errorStr = errorStr + 'Warnning: oD is defined!' + '<br/>';
		}catch(e){
			oD = oDebugger;
		}
		
		try{
			if(od == 'undefine');
			//this.showoutput('Warnning: od is defined!', false, 'red');
			errorStr = errorStr + 'Warnning: od is defined!' + '<br/>';
		}catch(e){
			od = oDebugger;
		}

		this.showoutput(errorStr, false, this.colors.ERROR);
	},

	showdebugger:function (args){
		if(!this._g_isDR){
			this.initdebugger();
		}
		if(this.Debugger){
			this.Debugger.style.display=args?'block':'none';
		}
	},
	onExit:function(){
		this.showdebugger(false);
	},
	onActive:function(){
		oDebugger.Debugger.style.backgroundColor = oDebugger.colors.BACKGROUNDCOLOR;
	},
	onDeActive:function(){
		oDebugger.Debugger.style.backgroundColor = oDebugger.colors.BACKGROUNDCOLOR_DEACTIVE;
	},

	//Init method
	//load debugger when time is passed 0.9s
	//init:setTimeout(function(evt){oDebugger.showdebugger(true);}, 900),
	//end init method

	/*
	*################################################################################################################################################
	*Common functions
	*################################################################################################################################################
	*/
	//Common functions
	UpMouse:function (obj, evt){
		obj.downStatus = false;
		if(this._g_cmdFocus){
			this.$('debuggerCommand').focus();
		}
	},
	showMenu:function(evt, obj, show){
		if(show){
			obj.style.top = (evt.pageY)?evt.pageY:evt.y;
			obj.style.left = (evt.pageX)?evt.pageX:evt.x;;
			obj.style.display = 'block';
		}else{
			obj.style.display = 'none';
		}
	},
	MoveLayer:function (obj, evt){
		evt = (evt) ? evt : ((window.event) ? window.event : "");
		var mouseX = (evt.pageX)?evt.pageX:evt.x;//clientX;
		var mouseY = (evt.pageY)?evt.pageY:evt.y;//clientY;
		if (obj.downStatus){
			obj.style.left = mouseX - obj.startX; //obj.startLeft+
			obj.style.top = mouseY - obj.startY; //obj.startTop+
			//obj.viewpos.value = " X:"+event.clientX+" Y:"+event.clientY+"
			//startX:"+startX+"  startY:"+startY;
			this._g_lastpos_y = obj.style.top;
			this._g_lastpos_x = obj.style.left;
		}
	},
	DownMouse:function (obj, evt){
		//if (!document.all) return true;//暂时只支持4.0以上的IE浏览器
		evt = (evt) ? evt : ((window.event) ? window.event : "");
		var mouseX = (evt.pageX)?evt.pageX:evt.x;
		var mouseY = (evt.pageY)?evt.pageY:evt.y;
		obj.downStatus = true;
		obj.startX = mouseX - obj.offsetLeft;
		obj.startY = mouseY - obj.offsetTop;
	},
	setDebuggerStyle:function (){
		this.Debugger.style.position = 'absolute';
		this.Debugger.style.width = '320px';
		this.Debugger.style.height = '425px';
		this.Debugger.style.backgroundColor = this.colors.BACKGROUNDCOLOR;
		this.Debugger.style.filter = 'Alpha(Opacity = ' + this.alpha.BODY + ')';
		this.Debugger.style.left = this._g_lastpos_x;
		this.Debugger.style.top = this._g_lastpos_y;
		this.Debugger.style.overflowX='auto';
		this.Debugger.style.overflowY='auto';
		//this.Debugger.style.styleFloat = 'left';
		this.Debugger.style.scrollbar3dlightColor='#959CBB';
		this.Debugger.style.scrollbarArrowColor='#666666';
		this.Debugger.style.scrollbarBaseColor='#445289';
		this.Debugger.style.scrollbarDarkshadowColor='#959CBB';
		this.Debugger.style.scrollbarFaceColor='#D6DDF3';
		this.Debugger.style.scrollbarHighlightColor='#959CBB';
		this.Debugger.style.scrollbarShadowColor='#959CBB';
		this.Debugger.style.cursor='move';
		this.Debugger.style.fontSize='15px';
		this.Menu.style.position = 'absolute';
		this.Menu.style.width = '240px';
		this.Menu.style.height = 'auto';
		this.Menu.style.display = 'none';
		this.Menu.style.backgroundColor = this.colors.MENUBACKGROUNDCOLOR;
		this.Menu.style.filter = 'Alpha(Opacity = ' + this.alpha.MENU + ')';
		this.Menu.style.overflow='hidden';
		this.Menu.style.cursor='pointer';
		this.Menu.style.fontSize='12px';
		this.SubMenu.style.position = 'absolute';
		this.SubMenu.style.width = '240px';
		this.SubMenu.style.height = 'auto';
		this.SubMenu.style.display = 'none';
		this.SubMenu.style.backgroundColor = this.colors.MENUBACKGROUNDCOLOR;
		this.SubMenu.style.filter = 'Alpha(Opacity = ' + this.alpha.MENU + ')';
		this.SubMenu.style.overflow='hidden';
		this.SubMenu.style.cursor='pointer';
		this.SubMenu.style.fontSize='12px';
		this.$('debugger_runCommand').STYLE='border-right:#2c59aa 1px solid;padding-right: 2px;border-top: #2c59aa 1px solid;padding-left: 2px;font-size: 12px;filter: progid:dximagetransform.microsoft.gradient(gradienttype=0, startcolorstr=#ffffff, endcolorstr=#c3daf5); border-left: #2c59aa 1px solid;color:#445289;padding-top: 2px;border-bottom: #2c59aa 1px solid;cursor: hand;cursor:pointer;';
		this.$('debugger_runCommand').style.borderRight='#2c59aa 1px solid';
		this.$('debugger_runCommand').style.paddingRight='2px';
		this.$('debugger_runCommand').style.borderTop='#2c59aa 1px solid';
		this.$('debugger_runCommand').style.paddingLeft='2px';
		this.$('debugger_runCommand').style.fontSize='12px';
		this.$('debugger_runCommand').style.filter='progid:dximagetransform.microsoft.gradient(gradienttype=0, startcolorstr=#DDDDDD, endcolorstr=#c3daf5)';
		this.$('debugger_runCommand').style.borderLeft='#2c59aa 1px solid';
		this.$('debugger_runCommand').style.color='#445289';
		this.$('debugger_runCommand').style.paddingTop='2px';
		this.$('debugger_runCommand').style.borderBottom='#2c59aa 1px solid';
		this.$('debugger_runCommand').style.cursor='hand';
		this.$('debugger_runCommand').style.cursor='pointer';
		this.$('debuggerCommand').STYLE='font-family: Arial, Verdana, Times New Roman;border-width: 1px;border-color: #abb9df;border-style:solid;background-color: #F2F3F9;width:285px;';
		this.$('debuggerCommand').style.fontFamily='Arial, Verdana, Times New Roman';
		this.$('debuggerCommand').style.borderWidth='1px';
		this.$('debuggerCommand').style.borderColor='#abb9df';
		this.$('debuggerCommand').style.borderStyle='solid';
		this.$('debuggerCommand').style.backgroundColor='#F2F3F9';
		this.$('debuggerCommand').style.width='284px';
		this.$('debuggerClientDiv').STYLE='font-family: Arial, Verdana, Times New Roman;border-width: 1px;border-color: #abb9df;border-style:solid;background-color: #F2F3F9;width:318px;height:360px;overflow-y:auto;overflow-x:auto;font-size:12px;cursor:text;';
		this.$('debuggerClientDiv').style.borderWidth='0px';
		this.$('debuggerClientDiv').style.width='319px';
		this.$('debuggerClientDiv').style.height='384px';
		this.$('debuggerClientDiv').style.overflowX='auto';
		this.$('debuggerClientDiv').style.overflowY='auto';
		this.$('debuggerClientDiv').style.scrollbar3dlightColor='#959CBB';
		this.$('debuggerClientDiv').style.scrollbarArrowColor='#666666';
		this.$('debuggerClientDiv').style.scrollbarBaseColor='#445289';
		this.$('debuggerClientDiv').style.scrollbarDarkshadowColor='#959CBB';
		this.$('debuggerClientDiv').style.scrollbarFaceColor='#D6DDF3';
		this.$('debuggerClientDiv').style.scrollbarHighlightColor='#959CBB';
		this.$('debuggerClientDiv').style.scrollbarShadowColor='#959CBB';
		this.$('DebuggerOutput').STYLE='font-family: Arial, Verdana, Times New Roman;border-width: 1px;border-color: #abb9df;border-style:solid;background-color: #F2F3F9;width:316px;height:359px;overflow-y:auto;overflow-x:auto;font-size:12px;cursor:text;';
		this.$('DebuggerOutput').style.fontFamily='Arial, Verdana, Times New Roman';
		this.$('DebuggerOutput').style.borderWidth='1px';
		this.$('DebuggerOutput').style.borderColor='#abb9df';
		this.$('DebuggerOutput').style.borderStyle='solid';
		this.$('DebuggerOutput').style.backgroundColor='#F2F3F9';
		this.$('DebuggerOutput').style.width='316px';
		this.$('DebuggerOutput').style.height='359px';
		this.$('DebuggerOutput').style.overflowX='auto';
		this.$('DebuggerOutput').style.overflowY='auto';
		this.$('DebuggerOutput').style.scrollbar3dlightColor='#959CBB';
		this.$('DebuggerOutput').style.scrollbarArrowColor='#666666';
		this.$('DebuggerOutput').style.scrollbarBaseColor='#445289';
		this.$('DebuggerOutput').style.scrollbarDarkshadowColor='#959CBB';
		this.$('DebuggerOutput').style.scrollbarFaceColor='#D6DDF3';
		this.$('DebuggerOutput').style.scrollbarHighlightColor='#959CBB';
		this.$('DebuggerOutput').style.scrollbarShadowColor='#959CBB';
		this.$('DebuggerOutput').style.fontSize='12px';
		this.$('DebuggerOutput').style.cursor='text';
		this.$('debugger_clearOutput').STYLE='border-right:#2c59aa 1px solid;padding-right: 2px;border-top: #2c59aa 1px solid;padding-left: 2px;font-size: 12px;color:#000000;filter: progid:dximagetransform.microsoft.gradient(gradienttype=0, startcolorstr=#DDDDDD, endcolorstr=#c3daf5); border-left: #2c59aa 1px solid;color:#445289;padding-top: 2px;border-bottom: #2c59aa 1px solid;cursor: hand;cursor:pointer;';
		this.$('debugger_clearOutput').style.borderRight='#2c59aa 1px solid';
		this.$('debugger_clearOutput').style.paddingRight='2px';
		this.$('debugger_clearOutput').style.borderTop='#2c59aa 1px solid';
		this.$('debugger_clearOutput').style.paddingLeft='2px';
		this.$('debugger_clearOutput').style.fontSize='12px';
		this.$('debugger_clearOutput').style.color='#000000';
		this.$('debugger_clearOutput').style.filter='progid:dximagetransform.microsoft.gradient(gradienttype=0, startcolorstr=#DDDDDD, endcolorstr=#c3daf5)';
		this.$('debugger_clearOutput').style.borderLeft='#2c59aa 1px solid';
		this.$('debugger_clearOutput').style.color='#445289';
		this.$('debugger_clearOutput').style.paddingTop='2px';
		this.$('debugger_clearOutput').style.borderBottom='#2c59aa 1px solid';
		this.$('debugger_clearOutput').style.cursor='hand';
		this.$('debugger_clearOutput').style.cursor='pointer';
		this.$('debuggerInfo').STYLE='font-family: Arial, Verdana, Times New Roman;width:200px;border-width: 1px;border-color: #abb9df;border-style:solid;background-color: #F2F3F9;';
		this.$('debuggerInfo').style.fontFamily='Arial, Verdana, Times New Roman';
		this.$('debuggerInfo').style.width='200px';
		this.$('debuggerInfo').style.borderWidth='1px';
		this.$('debuggerInfo').style.borderColor='#abb9df';
		this.$('debuggerInfo').style.borderStyle='solid';
		this.$('debuggerInfo').style.backgroundColor='#F2F3F9';
		this.$('debugger_hiddenBtn').STYLE='top:0;right:0;position:relative;float:right;width:10px;height:10px;border-width: 1px;border-color: #abb9df;border-style:solid;background-color: #F2F3F9;cursor:default;cursor:default;';
		this.$('debugger_hiddenBtn').style.top='0';
		this.$('debugger_hiddenBtn').style.right='0';
		this.$('debugger_hiddenBtn').style.position='relative';
		this.$('debugger_hiddenBtn').style.styleFloat='right';
		this.$('debugger_hiddenBtn').style.cssFloat='right';
		this.$('debugger_hiddenBtn').style.width='10px';
		this.$('debugger_hiddenBtn').style.height='10px';
		this.$('debugger_hiddenBtn').style.borderWidth='1px';
		this.$('debugger_hiddenBtn').style.borderColor='#abb9df';
		this.$('debugger_hiddenBtn').style.borderStyle='solid';
		this.$('debugger_hiddenBtn').style.backgroundColor='#F2F3F9';
		this.$('debugger_hiddenBtn').style.cursor='default';
		this.$('debugger_hiddenBtn').style.cursor='default';
		this.setDebuggerMenuStyle(this.Menu);
		this.setDebuggerMenuStyle(this.SubMenu);
	},
	setDebuggerMenuStyle:function(obj){
		var objs = obj.getElementsByTagName('UL');
		for( var i = 0; i < objs.length; i++){
			objs[i].style.padding = '0';
			objs[i].style.margin = '0 0 1px 1px';
			objs[i].style.width = '100%';
			objs[i].style.backgroundColor = this.colors.MENUBACKGROUNDCOLOR;
			this.bindEventListner(objs[i], 'onmouseover', function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				elem.style.backgroundColor = oDebugger.colors.MENUOVER;
				});
			this.bindEventListner(objs[i], 'onmouseout', function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				elem.style.backgroundColor = oDebugger.colors.MENUBACKGROUNDCOLOR;
				});
		}
		objs = obj.getElementsByTagName('LI');
		for( var i = 0; i < objs.length; i++){
			objs[i].style.padding = '0';
			objs[i].style.margin = '0';
			objs[i].style.listStyleType = 'none';
			objs[i].style.height = '24px';
			objs[i].style.backgroundColor = this.colors.MENUCOLOR;
			objs[i].style.width = '100%';
		}
		objs = obj.getElementsByTagName('A');
		for( var i = 0; i < objs.length; i++){
			objs[i].style.padding = '0';
			objs[i].style.margin = '0';
			objs[i].style.textDecoration = 'none';
			objs[i].style.display = 'block';
			objs[i].style.width = '100%';
		}
	},
	/*
	* return the get Element by id
	*/
	$:function (id){
		return document.getElementById(id);
	},
	//=======================================================
	//Function Name		?appendElement
	//Parameters		?optional: [object or tagName], [tagName], [innerHTML], [className], [Style]
	//Return Value		?null or Object
	//Modify History	?
	//Process 			?
	//=======================================================
	appendElement:function (){
		if(arguments.length <= 0){
			return null;
		}

		if(arguments.length == 5 && typeof(arguments[0]) == 'object' && typeof(arguments[1]) == 'string'
				&& typeof(arguments[2]) == 'string' && typeof(arguments[3]) == 'string'
				&& typeof(arguments[4]) == 'string'){
			var newObj = document.createElement(arguments[1]);
			try{
			newObj.innerHTML = arguments[2];
			}catch(e){
				this.showoutput(e.description);
			}
			newObj.className = arguments[3];
			newObj.STYLE = arguments[4];
			arguments[0].appendChild(newObj);
			return newObj;
		}

		if(arguments.length == 4 && typeof(arguments[0]) == 'object' && typeof(arguments[1]) == 'string'
				&& typeof(arguments[2]) == 'string' && typeof(arguments[3]) == 'string'){
			var newObj = document.createElement(arguments[1]);
			try{
			newObj.innerHTML = arguments[2];
			}catch(e){
				this.showoutput(e.description);
			}
			newObj.className = arguments[3];
			arguments[0].appendChild(newObj);
			return newObj;
		}

		if(arguments.length == 3 && typeof(arguments[0]) == 'object' && typeof(arguments[1]) == 'string'
				&& typeof(arguments[2]) == 'string'){
			var newObj = document.createElement(arguments[1]);
			try{
			newObj.innerHTML = arguments[2];
			}catch(e){
				this.showoutput(e.description);
			}
			arguments[0].appendChild(newObj);
			return newObj;
		}

		if(arguments.length == 2 && typeof(arguments[0]) == 'object' && typeof(arguments[1]) == 'string'){
			var newObj = document.createElement(arguments[1]);
			arguments[0].appendChild(newObj);
			return newObj;
		}

		if(arguments.length == 4 && typeof(arguments[0]) == 'string' && typeof(arguments[1]) == 'string'
				&& typeof(arguments[2]) == 'string' && typeof(arguments[3]) == 'string'){
			var newObj = document.createElement(arguments[0]);
			try{
			newObj.innerHTML = arguments[1];
			}catch(e){
				this.showoutput(e.description);
			}
			newObj.className = arguments[2];
			newObj.STYLE = arguments[3];
			return newObj;
		}

		if(arguments.length == 3 && typeof(arguments[0]) == 'string' && typeof(arguments[1]) == 'string'
				&& typeof(arguments[2]) == 'string'){
			var newObj = document.createElement(arguments[0]);
			try{
			newObj.innerHTML = arguments[1];
			}catch(e){
				this.showoutput(e.description);
			}
			newObj.className = arguments[2];
			return newObj;
		}

		if(arguments.length == 2 && typeof(arguments[0]) == 'string' && typeof(arguments[1]) == 'string'){
			var newObj = document.createElement(arguments[0]);
			try{
			newObj.innerHTML = arguments[1];
			}catch(e){
				this.showoutput(e.description);
			}
			return newObj;
		}

		if(arguments.length == 1 && typeof(arguments[0]) == 'string'){
			return document.createElement(arguments[0]);
		}
		
		return null;
	},
	//Load js or css files
	LoadJsCssFile:function (filename, filetype){
		if (filetype=="js"){ //如果是.js文件
			var fileref=document.createElement('script');
			fileref.setAttribute("type","text/javascript");
			fileref.setAttribute("src",filename);
		}
		else if (filetype=="css"){ //如果是.css文件
			var fileref=document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href",filename);
		}
		if (typeof fileref != "undefined")
			document.getElementsByTagName("head")[0].appendChild(fileref)
	},

	/*
	var head = document.getElementsByTagName("head")[0];
	var js = document.createElement("script");
	js.src = "e\:\\debugger\\debugger.js";//"需要加载的JS路径";
	js.onload = js.onreadystatechange = function()
	{
		if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")
		 {
			//do something
		 }
	}
	head.appendChild(js);

	//此代码在www.a.com下
	var head = document.getElementsByTagName("head")[0];
	var js = document.createElement("script");
	js.src = "http://www.b.com/login.action?username=*&passwod=*";
	js.onload = js.onreadystatechange = function()
	{
		if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")
		{
			 head.removeChild(js);
			 //JS加载完毕了. 
			 //执行是否登陆成功的判断
		}
	}
	head.appendChild(js);
	*/

	loadJs:function (file){
		 var scriptTag = document.getElementById('loadScript');
		 var head = document.getElementsByTagName('head').item(0);
		 if(scriptTag) {
		 head.removeChild(scriptTag);
		 }
		 script = document.createElement('script');
		 script.src = ""+file; //file是全路径,后缀是.js
		 script.type = 'text/javascript';
		 script.id = 'loadScript';
		 head.appendChild(script);
	},

	loadCss:function (file){
		 var cssTag = document.getElementById('loadCss');
		 var head = document.getElementsByTagName('head').item(0);
		 if(cssTag){
		   head.removeChild(cssTag);
		 }
		 css = document.createElement('link');
		 css.href = ""+file; //file是全路径,后缀是.css
		 css.rel = 'stylesheet';
		 css.type = 'text/css';
		 css.id = 'loadCss';
		 head.appendChild(css);
	},

	//create color text
	colorizeInput:function   (strGiven,   strColor){
		var oFont = appendElement('font');
		if(document.all){
			oFont.innerText = strGiven;
		}else{
			oFont.textContent = strGiven;
		}
		oFont.color = '#FF0000';//strColor;
		return oFont;
	},

	//2008 10 28 Add some about table methods
	createTable:function (){
		oT = document.createElement('TABLE');
		if(arguments.length == 1){
			oT.id = arguments[0];
		}
		return oT;
	},

	appendTR:function (obj){
		if(obj.tagName != "TABLE"){
			return null;
		}
		if(obj.rows.length < 1){
			return obj.insertRow();
		}
		lastTR = obj.rows[obj.rows.length - 1];
		return addTR(lastTR);
	},

	appendTD:function (obj){
		oTD = obj.insertCell(-1);
		if(arguments.length == 2){
			oTD.innerHTML = arguments[1];
		}
		return oTD;
	},

	//private:
	setTDContent:function (tdObj, content){
		tdObj.innerHTML = content;
	},

	delTR:function (){
		if(arguments.length < 1){
			return -1;
			}
			if(arguments.length == 1){
				if(typeof(arguments[0]) == 'object'){
					var index = getTRIndex(arguments[0], getTable(arguments[0]));
					getTable(arguments[0]).deleteRow(index);
	//				arguments[0].parentElement.deleteRow(index);
					return;
				}
			}
			if(typeof(arguments[0]) == 'object' && typeof(arguments[1]) == 'number'){
				arguments[0].deleteRow(arguments[1]);
				return;
			}
	},

	getTable:function (obj){
		var oTable = obj;
		var count = 0;
		while(oTable.tagName != 'TABLE'){
			oTable = oTable.parentElement;
			count++;
			if(count > 10){
				oTable = null;
				break;
			}
		}
		return oTable;
	},

	getTR:function (obj){
		var oTR = obj;
		var count = 0;
		while(oTR.tagName != 'TR'){
			oTR = oTR.parentElement;
			count++;
			if(count > 10){
				oTR = null;
				break;
			}
		}
		return oTR;
	},

	moveTR:function (){ //tableObject, curPos, destPos //OR// TRObject, destPos
		var oTable = null;
		var oTR = null;
		var cPos = -1;
		var dPos = -1;
		if(arguments.length == 2){
			oTable = getTable(arguments[0]);
			dPos = arguments[1];
			cPos = getTRIndex(arguments[0], oTable);
		}else if(arguments.length == 3){
			oTable = arguments[0];
			cPos = arguments[1];
			dPos = arguments[2];
		}else{
			return -1;
		}
		if(cPos < dPos){
			dPos -= 1;
		}
		if(cPos == dPos){ //相等，关掉当前
			//alert('====');
			return false;
		}
		oTable.moveRow(cPos, dPos);
		return true;
	},

	addTR:function (trObj){
		var tableObj = getTable(trObj);
		var index = getTRIndex(trObj, tableObj);
		return tableObj.insertRow(index + 1);
	},

	addFullSingleCellTR:function (trObj){
		var args = addFullSingleCellTR.arguments;
		var len = args.length;
		tdlen = trObj.cells.length;
		newTR = addTR(trObj);
		p_TR = newTR;
		newTD = addTD(newTR);
		newTD.colSpan = tdlen;
		return newTD;
	},

	getTRIndex:function (){ //trObj, tableObj){
		if(arguments.length != 2){
			return -1;
		}
		var i = 0;
		//var listTR = arguments[1].getElementsByTagName('TR');
		var listTR = arguments[1].rows;
		for( i = 0; i < listTR.length; i++){
			if(arguments[0] == listTR[i]){
				return i;
			}
		}
		return -1;
	//	var i = 0;
	//	var listTR = tableObj.getElementsByTagName('TR');
	//	for( i = 0; i < listTR.length; i++){
	//		if(trObj == listTR[i]){
	//			return i;
	//		}
	//	}
	//	return -1;
	},

	addTD:function (trObj){
		return trObj.insertCell();
	},

	setTDValues:function (trObj){
		arglen = arguments.length;
		listTD = trObj.getElementsByTagName("TD");
		tdlen = listTD.length;
		var i = 0;
		if(tdlen > 0){
			for(i = 0; i < tdlen; i++){
				alert(arguments[i+1]);
				if(arguments[i+1]){
					listTD[i].innerHTML = arguments[i+1];
				}
			}
		}else{
			for(i = 0; i < arglen - 1; i++){
				var oTD = addTD(trObj);
				oTD.innerHTML = arguments[i+1];
			}
		}
	},

	delTDs:function (trObj){
		//alert(trObj.cells.length);
		while(trObj.hasChildNodes()){
			trObj.deleteCell();
		}
	},

	//2008 10 28 End some about table methods

	$toHex:function (obj){
		var tmp = 16;
		if(arguments.length == 2){
			tmp = arguments[1];
		}
		var retVal = obj;
		if(typeof(obj) == 'string'){
			retVal = parseInt(obj);
		}else if(typeof(obj) == 'number'){
		}
		return retVal.toString(tmp);
	},
	copy:function(obj){
		var trng = document.body.createTextRange();
		trng.moveToElementText(obj);
		trng.scrollIntoView();
		trng.select();
		trng.execCommand("Copy");
		//window.status="Contents highlighted and copied to clipboard!"
		//setTimeout("window.status=''",1800)
		trng.collapse(false);
	},
	selectAll:function(obj){
		var trng = document.body.createTextRange();
		trng.moveToElementText(obj);
		trng.scrollIntoView();
		trng.select();
		trng.collapse(false);
	},
	removeClassName:function(elem, className){
		elem.className = trim(elem.className.replace(className, ''));
	},
	addClassName:function(elem, className){
		this.removeClassName (elem, className);
		elem.className = trim((elem.className + ' ' + className));
	},
	trim:function(args) {
		return args.replace( /^\s+|\s+$/, '');
	},
	bindEventListner:function(obj, evt, funcName){
		if(window.addEventListener){ // Mozilla, Netscape, Firefox
			obj.addEventListener(evt.substring(2), funcName, false);
		} else { // IE
			obj.attachEvent(evt, funcName);
		}
	},
	stopBubble:function(e) {
		//如果提供了事件对象，则这是一个非IE浏览器
		if ( e && e.stopPropagation ){
        //因此它支持W3C的stopPropagation()方法
			e.stopPropagation();
		}else{
        //否则，我们需要使用IE的方式来取消事件冒泡
			window.event.cancelBubble = true;
			window.event.returnValue = false;
		}
	},
	htmlEncode:function(args) {
		var s = args;
		s = s.replace(/\&/g, '&amp;');
		s = s.replace(/\</g, '&lt;');
		s = s.replace(/\>/g, '&gt;');
		s = s.replace(/\"/g, '&quot;');
		return s;
	},
	/*
	*################################################################################################################################################
	*Debug Methods
	*################################################################################################################################################
	*/
	debug:{
		isEvalBeHooked:function(){
			// check eval hooked
			if((new String(eval)).indexOf("[native code]") < 0) {
				return true;
			}
			return false;
		},
		searchBP:function(args){
			for (var i = 0; i < this.father._g_breakpoints.length; i++){
				if(this.father._g_breakpoints[i] == args){
					return true;
				}
			}
			return false;
		},
		jsEncode:function(s) {
			s = s.replace(/\\/g, "\\\\");
			s = s.replace(/\n/g, "\\n");
			s = s.replace(/\"/g, "\\\"");
			s = s.replace(/\'/g, "\\\'");
			return s;
		},
		restoreArguments:function(args){
			if(typeof(args) == 'string'){
				return '\'' + this.jsEncode(args) + '\'';
			}else{
				return this.jsEncode(args);
			}
			return this.jsEncode(args);
		},
		testFuncName:function(args){
			if(!this.father.funcName.test(args)){
				this.father.showoutput('arguments ' + args + ' looks not like a function name', false, this.father.colors.ERROR);
				return false;
			}
			if(!this.father._g_eval('typeof(' + args + ') == \'function\'')){
				this.father.showoutput('arguments ' + args + ' looks not like a function', false, this.father.colors.ERROR);
				return false;
			}
			//if(this.father._g_breakpoints.search(args) >= 0){
			if(this.searchBP(args)){
				this.father.showoutput('There\'s a breakpoint on function ' + args + '!', false, this.father.colors.ERROR);
				return false;
			}
			return true;
		},
		registereSuccess:function(args){
			this.father.showoutput('breakpoint setted on function ' + args + ' successfully!', false);
		},
		setBreakPoint:function(cmdSource, args){
			//this.father.showoutput(cmdSource);
			try {
				this.father._g_eval('window.' + args.replace(/\./g, '_') + '_bak = ' + args + ';' + cmdSource);
				this.father._g_breakpoints.push(args);
				this.registereSuccess(args);
				return true;
			} catch (e) {
				this.father.showoutput('ERROR:' + e.description + '.<br/>breakpoint set failed!', false, this.father.colors.ERROR);
				return false;
			}
			return true;
		},
		bp:function(args){
			if(!this.testFuncName(args[1])){
				return false;
			}
			var cmdSource = args[1] + ' = ' +
			'function() {' +
			'    var args = "";' +
			'    var cmd = "'  + args[1].replace(/\./g, '_') + '_bak.apply(";' +
			'    for (var i = 0; i < arguments.length; i ++) {' +
			'        args += arguments[i] + (i == (arguments.length - 1) ?' +
			'\'\' :\',\');' +
			//'        cmd += oDebugger.debug.restoreArguments(arguments[i]) + (i == (arguments.length - 1) ?' +
			//'\'\' :\',\');' +
			'    }' +
			'    cmd += "this, arguments)";' +
			'    if (confirm("function ' + args[1] +

			' was called, execute it?arguments:\" + args +\"' +

			' caller:\" + ' + args[1] + '.caller)) {' +
			'        oDebugger._g_eval(cmd);' +
			'    }' +
			'};';
			return this.setBreakPoint(cmdSource, args[1]);
		},
		bpx:function(args){
			if(!this.testFuncName(args[1])){
				return false;
			}
			var cmdSource = args[1] + ' = ' +
			'function() {' +
			'    var args = "";' +
			'    var cmd = "'  + args[1].replace(/\./g, '_') + '_bak.apply(";' +
			'    for (var i = 0; i < arguments.length; i ++) {' +
			'        args += arguments[i] + (i == (arguments.length - 1) ?' +
			'\'\' :\',\');' +
			//'        cmd += oDebugger.debug.restoreArguments(arguments[i]) + (i == (arguments.length - 1) ?' +
			//'\'\' :\',\');' +
			'    }' +
			'    cmd += "this, arguments)";' +
			'    oDebugger.showoutput("function ' + args[1] +

			' was called,arguments:\" + args +\"' +

			' caller:\" + ' + args[1] + '.caller, false, oDebugger.colors.TIP); ' +
			' debugger;' +
			' oDebugger._g_eval(cmd);' +
			'};';
			return  this.setBreakPoint(cmdSource, args[1]);
		},
		bl:function(){
			if (this.father._g_breakpoints.length == 0){
				this.father.showoutput('There\'s no breakpoint.', false);
				return;
			}
			
			this.father.showoutput('* ', true, this.father.colors.TIP);
			this.father.showoutput(this.father._g_breakpoints.length + ' breakpoints:', false);

			for (var i = 0; i < this.father._g_breakpoints.length; i++) {
				this.father.showoutput(i + ' - ' + this.father._g_breakpoints[i] + '.', false);
			}
			return;
		},
		bc:function(args){
			try {
				args = parseInt(args[1]);
			} catch (e) {
				this.father.showoutput('ERROR: bc command requires a numeric argument.', false, this.father.colors.ERROR);
				return;
			}

			if (this.father._g_breakpoints.length == 0) {
				this.father.showoutput('ERROR: There\'s no breakpoint.', false, this.father.colors.ERROR);
				return;
			}
			
			var funcName = this.father._g_breakpoints[args];
			this.father.showoutput(funcName, false);

			for (var i = args; i < this.father._g_breakpoints.length - 1; i ++) {
				this.father._g_breakpoints[i] = this.father._g_breakpoints[i + 1];
			}
			this.father._g_breakpoints.length --;

			try {
				this.father._g_eval(funcName + " = window." + funcName.replace(/\./g, '_') + '_bak');
				this.father.showoutput('* ', true, this.father.colors.TIP);
				return this.father.showoutput('breakpoint on function ' + funcName + ' deleted successfully.', false);
			} catch (e) {
				this.father.showoutput('ERROR:' + e.description + '.', false, this.father.colors.ERROR);
			}
			return;
		}
	},
	showMouseObject:function(evt, obj){
		try{
			if(this._g_lastMouseObject != null && obj && this._g_lastMouseObject != obj){
				this._g_lastMouseObject.style.border = this._g_lastMouseObjectStyle.border;
				//this._g_lastMouseObject.style.borderLeft = this._g_lastMouseObjectStyle.borderLeft;
				//this._g_lastMouseObject.style.borderRight = this._g_lastMouseObjectStyle.borderRight;
				//this._g_lastMouseObject.style.borderTop = this._g_lastMouseObjectStyle.borderTop;
				//this._g_lastMouseObject.style.borderBottom = this._g_lastMouseObjectStyle.borderBottom;
			}
			if(obj && (this._g_lastMouseObject == null || this._g_lastMouseObject  != obj)){
				this._g_lastMouseObject = obj;
				this._g_lastMouseObjectStyle.border = obj.style.border;
				//this._g_lastMouseObjectStyle.borderLeft = obj.style.borderLeft;
				//this._g_lastMouseObjectStyle.borderRight = obj.style.borderRight;
				//this._g_lastMouseObjectStyle.borderTop = obj.style.borderTop;
				//this._g_lastMouseObjectStyle.borderBottom = obj.style.borderBottom;

				this.showoutput('');
				this.showoutput(this.htmlEncode(obj.outerHTML), false, this.colors.TIP);
				obj.style.border = '2px solid ' + this.colors.MOUSETIP;
				//obj.style.borderLeft = '2px solid ' + this.colors.TIP;
				//obj.style.borderRight = '2px solid ' + this.colors.TIP;
				//obj.style.borderTop = '2px solid ' + this.colors.TIP;
				//obj.style.borderBottom = '2px solid ' + this.colors.TIP;
			}
			if(arguments.length < 2 && this._g_lastMouseObject != null){
				this._g_lastMouseObject.style.border = this._g_lastMouseObjectStyle.border;
				this._g_lastMouseObject = null;
			}
		}catch(e){
			this.showoutput('ERROR:' + e.description + '.', false, this.colors.ERROR);
		}
	},
	/*
	*################################################################################################################################################
	*Run debugger commands
	*################################################################################################################################################
	*/
	dealCommand:function(obj){
		if(this._g_runCommandOrgetInput){
			return this.runCommand(obj);
		}else{
			return this.getInput(obj);
		}
	},
	//run debugger commands
	runCommand:function (obj){
		this.$('debuggerCommand')._commandHistory.pop();
		this.$('debuggerCommand')._commandHistory.unshift(this.$('debuggerCommand').value);

		this.showoutput('COMMAND:', true, this.colors.COMMAND);
		this.showoutput(obj.value, false);
		if(this.userDefineCommand(obj.value)){this.$('debuggerCommand').value = '';return;}
		try{
			this.showoutput('RETURN: ', true, this.colors.COMMAND);
			//this._g_returnValue = this._g_eval(obj.value);
			if(document.all){
				this._g_returnValue = this._g_eval(obj.value);//execScript
			}else{
				this._g_returnValue = window.eval(obj.value);
			}
			this.showoutput(this._g_returnValue, false, this.colors.TIP);
		}catch(e){
			this._g_returnValue = e.description;
			this.showoutput(e.description, false, this.colors.ERROR);
		}
	},
	getInput:function (obj){
		//this.$('debuggerCommand')._commandHistory.pop();
		//this.$('debuggerCommand')._commandHistory.unshift(this.$('debuggerCommand').value);

		this.showoutput('ANSWER:', true, this.colors.COMMAND);
		this.showoutput(obj.value, false);
		this._g_returnValue = obj.value;
		this.$('debuggerCommand').value = '';
		return this._g_returnValue;
	},
	/*
	*################################################################################################################################################
	*User Define commands
	*################################################################################################################################################
	*/
	//user Define commands
	userDefineCommand:function (args){
		switch(args.split(' ')[0]){
			case 'help':
				this.showHelp();
				break;
			case 'mode':
				return this.showMode(args.split(' '));;
				break;
			case 'exit':
				this.onExit();
				//setTimeout(function(){oDebugger = null;}, 1000);
				break;
			case 'clear':
			case 'cls':
				this.$('DebuggerOutput').innerHTML = '';
				break;
			default:
				return this.userDefineDebugCommand(args.split(' '));
				break;
		}
		return true;
	},
	userDefineDebugCommand:function(args){
		switch(args[0]){
			case 'bp':
				this.debug.bp(args);
				break;
			case 'bpx':
				this.debug.bpx(args);
				break;
			case 'bpx':
				this.debug.bpx(args);
				break;
			case 'bc':
				this.debug.bc(args);
				break;
			case 'bl':
				this.debug.bl(args);
				break;
			default:
				return false;
				break;
		}
		return true;
	},
	showMode:function(args){
		switch(args[1]){
			case 'select':
				this._g_cmdFocus = ! this._g_cmdFocus;
				break;
			case 'inject':
				this.showoutput('not yet been achieved', false, this.colors.TIP);
				break;
			case 'keycode':
				this._g_enableShowKeyCode = ! this._g_enableShowKeyCode;
				break;
			case 'mousepos':
				this._g_enableShowMousePos = ! this._g_enableShowMousePos;
				break;
			case 'inspect':
				this._g_enableShowMouseObject = ! this._g_enableShowMouseObject;
				this.showMouseObject();
				break;
			case 'alpha':
				this.Debugger.style.filter = 'Alpha(Opacity = ' + (args[2] || 75) + ')';
				break;
			case 'bgcolor':
				this.colors.BACKGROUNDCOLOR = (args[2] || this.colors.BACKGROUNDCOLOR);
				this.Debugger.style.backgroundColor = this.colors.BACKGROUNDCOLOR;
				break;
			default:
				return false;
				break;
		}
		return true;
	},
	/*
	*################################################################################################################################################
	*Event Handler
	*################################################################################################################################################
	*/
	handler:{
	},
	/*
	*################################################################################################################################################
	*Help
	*################################################################################################################################################
	*/
	//help
	showHelp:function (){
		this.showoutput(
			'Ctrl + Num for recent commands, or Ctrl + up arrow & Ctrl + down arrow <br/>' +
			'Right Alt + Num to member a commands, Left Alt + Num to recall it to command lines<br/>' +
			'bp &lt;funcName&gt; to set a breakpoint on function funcName<br/>' +
			'bpx &lt;funcName&gt; to set a breakpoint on function funcName<br/>' +
			'  when funcName being called, will call debugger like VC to debug it.<br/>' +
			'bl to list breakpoints.<br/>' +
			'bc &lt;Number&gt; to remove a breakpoint which listed in bl.<br/>' +
			'S(obj) show obj in output<br/>' +
			'M(obj,\'obj\') show methods or properties in obj<br/>' +
			'P(obj) or V(obj) to view obj property or value<br/>' +
			'L(obj, [args...]) to list ListObject property(args...) value<br/>' +
			'mode keycode to toget show keyCode status<br/>' +
			'mode mousepos to toget show mouse (x,y) pos<br/>' +
			'mode select to toget onoff focus inputCommand<br/>' +
			'mode inspect to toget onoff the inspect of object which under mouse<br/>' +
			'exit to exit debugger<br/>' +
			'$toHex to convert number to Hex datas<br/>' +
			'Move your mouse on some area, and press F8 or F7 to see what happend ;=) It\'s not just fan, there\'s some details in output<br/>' +
			'ps: If you like it, you can use it like a caculator, just input numbers like \"1+2\" and press RETURN to see what happend! ;=) <br/>' +
			'If you like it, please let me know, my EMail:<a href="mailto:Jackey.King@gmail.com" style="cursor:hand;"><span color=blue>Jackey.King@gmail.com<span></a><br/>' +
			'Javascript debugger ' + this.Version + '\nauthor:Jackey\nCopyRight (C) Jackey.King 2008\n'
			,false, this.colors.HELP);
	}
}

setTimeout(function(evt){oDebugger.showdebugger(true)}, 1000);
