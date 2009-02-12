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
*
* Project main page: http://code.google.com/p/javascriptdebugger
*
*/
/*
*################################################################################################################################################
* Dynamic load debugger
*################################################################################################################################################
*/
/* for IE6 or IE7
javascript:var head = document.getElementsByTagName("head")[0];var js = document.createElement("script");js.type="text/javascript";js.language="javascript";js.src = "file:///javascriptdebugger/debugger.js";head.appendChild(js);alert('inject success!');
javascript:var head = main.document.getElementsByTagName("head")[0];var js = main.document.createElement("script");js.type="text/javascript";js.language="javascript";js.src = "file:///javascriptdebugger/debugger.js";head.appendChild(js);alert('inject success!');

for Firefox or IE7:

javascript:var head = document.getElementsByTagName("head")[0];var js = document.createElement("script");js.type="text/javascript";js.language="javascript";js.src = "file://C:/javascriptdebugger/debugger.js";head.appendChild(js);js.onload=function(){oDebugger.showdebugger(true)};alert('inject success!');
*/
/*
*################################################################################################################################################
* History
*################################################################################################################################################
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
*v0.6 beta 1
*fix bugs
*firefox can be injected           //2008-11-18
*v0.6 beta 2
*fix bugs                          //2008-11-21
*v0.7 under relase
*multi mode support                //2008-11-25
*v0.7 beta 1
*after a long time in stable status //2008-12-22
*v0.7
*make a short cut to od._g_targetObj --> od.T 2009-01-20
*after a long time in stable status //2009-01-21
*v0.8 change display from div to iframe
*
*the next...
*will make a complex real debugger by open a modal window...
*/

var oDebugger = {
	Version: '0.8 Preview',
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
	T: null,
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
	_g_cmdFocus:true,

	_g_isIE:((document.all)?true:false),

	_g_registedVariables:[],
	_g_registedEventHandlers:[],
	_g_registedGarbage:[],
	_g_ids:{
		debugger_id:'id_g_oDebugger',
		debugger_css:'id_g_debugger_css'
	},
	_g_specialMode:{
		debug:false,
		inject:false,
		execMode:true,
		getInput:false
	},

	debuggerStr : "<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.0 Transitional//EN'><HTML><HEAD><TITLE>oDebugger</TITLE><META NAME='Generator' CONTENT='EditPlus'><META NAME='Author' CONTENT='Jackey.King'><META NAME='Mail' CONTENT='Jackey.King@gmail.com'><META http-equiv='Content-Type' content='text/html; charset=UTF-8'>\n<style type='text/css'>\n*{\n	font-family: 宋体, simsun, Arial, Verdana, Times New Roman;\n	font-size: 12px;\n	margin:0;\n	padding:0;\n	scrollbar-3dlight-color: #AEB4CD;\n    scrollbar-arrow-color: #45423c;\n    scrollbar-base-color: #AEB4CD;\n    scrollbar-darkshadow-color: #AEB4CD;\n    scrollbar-face-color: #D9E0F6;\n    scrollbar-highlight-color: #AEB4CD;\n    scrollbar-shadow-color: #AEB4CD;\n    scrollbar-track-color: #445289;\n    scrollbar-arrow-color:#38342C;\n}\nBODY{\n	position: relative;\n	background-color: white;\n	/*filter: Alpha(Opacity = 50);*/\n	overflow: hidden;\n	cursor: move;\n}\n#debugger_runCommand{\n	border-right: #2c59aa 1px solid;\n	padding-right: 2px;\n	border-top: #2c59aa 1px solid;\n	padding-left: 2px;\n	border-left: #2c59aa 1px solid;\n	color: #445289;\n	padding-top: 2px;\n	border-bottom: #2c59aa 1px solid;\n	cursor: pointer;\n	height: 15px;\n	width:49px;\n	line-height: 5px;\n}\n\n#debuggerCommand{\n	border-width: 1px;\n	border-color: #abb9df;\n	border-style: solid;\n	background-color: #F2F3F9;\n	width: 100%;\n}\n\n#debuggerClientDiv{\n	border-width: 0px;\n	width: 100%;\n	height: 100%;\n	position: relative;\n}\n\n#DebuggerOutput{\n	border-width: 1px;\n	border-color: #abb9df;\n	border-style: solid;\n	background-color: #F2F3F9;\n	width: 100%;\n	height: 100%;\n	cursor: text;\n	position: relative;\n	overflow-x: auto;\n	overflow-y: auto;\n}\n\n#debugger_clearOutput{\n	border-right: #2c59aa 1px solid;\n	padding-right: 2px;\n	border-top: #2c59aa 1px solid;\n	padding-left: 2px;\n	font-size: 12px;\n	color: #000000;\n	border-left: #2c59aa 1px solid;\n	color: #445289;\n	padding-top: 2px;\n	border-bottom: #2c59aa 1px solid;\n	cursor: pointer;\n	height: 15px;\n	width:49px;\n	line-height: 5px;\n}\n\n#debuggerInfo{\n	width: 100%;\n	border-width: 1px;\n	border-color: #abb9df;\n	border-style: solid;\n	background-color: #F2F3F9;\n}\n\n#debugger_hiddenBtn{\n	top: 0;\n	right: 0;\n	position: absolute;\n	float: right;\n	width: 10px;\n	height: 10px;\n	border-width: 1px;\n	border-color: #abb9df;\n	border-style: solid;\n	background-color: #F2F3F9;\n	cursor: default;\n}\n\n#debugger_contentTopDiv{\n	border-width: 1px;\n	border-color: #abb9df;\n	border-style: solid;\n	background-color: #F2F3F9;\n	width: 100%;\n	height: 50%;\n	cursor: pointer;\n	display: none;\n	position: relative;\n}\n\n#layoutTable{\n	table-layout: fixed;\n	width: 100%;\n	height:100%;\n	border:0;\n	margin: 0;\n	padding: 0;\n}\n</style>\n<script type='text/javascript' language='javascript'>\nvar Version = '0.8 Preview';\nvar parentWin = window;\nvar parentDebugger = window;\nvar Debugger = window.document.body;\nvar pBody = null;\ntry{\n	if(top){\n		parentWin = top;\n		parentDebugger = top.oDebugger;\n		pBody = top.document.body;\n		Debugger = top.document.getElementById('id_g_oDebugger');/*top.frames.id_g_oDebugger;*/\n	}\n}catch(e){}\nvar _g_mouseDownStatus = false;\nvar _g_maxCommandHistory = 10;\nvar _g_maxCommandStore = 10;\nvar _g_lastpos_x = 0;\nvar _g_lastpos_y = 0;\nvar _g_cmdFocus = true;\n\nvar lastMouseX = 0;\nvar lastMouseY = 0;\n\nvar colors = {\n	ERROR: 'red',\n	COMMAND:'blue',\n	HELP:'#FF00FF',\n	BACKGROUNDCOLOR:'#FFFF00',\n	BACKGROUNDCOLOR_DEACTIVE:'#CCCCCC',\n	TIP: 'red',\n	MOUSETIP: 'blue',\n	MENUBACKGROUNDCOLOR:'#FFFFFF',\n	MENUCOLOR:'#CCCCCC',\n	MENUOVER: '#E8E8E8'\n};\nvar alpha = {\n	MENU: '75',\n	BODY: '75'\n};\n\nvar _commandHistory = new Array(_g_maxCommandHistory);\nvar _commandStore = new Array(_g_maxCommandStore);\nvar _curCommandHistoryIndex = 0;\n\nfunction $(objId){\n	return document.getElementById(objId);\n}\n\nfunction clearOutput(){\n	$('DebuggerOutput').innerHTML=\'\';\n}\nfunction prerunCommand(){\n	_commandHistory.pop();\n	_commandHistory.unshift(this.$('debuggerCommand').value);\n	parentDebugger.runCommand($('debuggerCommand').value);\n}\n\nfunction debuggerCommandOnKeyDown(evt){\n	evt = evt || event;\n	var keycode = evt.keyCode || evt.which;\n	if(parentDebugger._g_enableShowKeyCode){\n		showoutput(keycode, false, colors.ERROR);\n	}\n	if(evt.ctrlKey){\n		switch(keycode){\n			case 48: /*0*/\n			case 49: /*1*/\n			case 50: /*2*/\n			case 51: /*3*/\n			case 52: /*4*/\n			case 53: /*5*/\n			case 54: /*6*/\n			case 55: /*7*/\n			case 56: /*8*/\n			case 57: /*9*/\n				$('debuggerCommand').value = _commandHistory[Number(keycode) - 48];\n				break;\n			case 38: /*up arrow*/\n				$('debuggerCommand').value = _commandHistory[_curCommandHistoryIndex];\n				_curCommandHistoryIndex += 1;\n				if(_curCommandHistoryIndex > (_g_maxCommandHistory - 1)){\n					_curCommandHistoryIndex = 0;\n				}\n				break;\n			case 40: /*down arrow*/\n				$('debuggerCommand').value = _commandHistory[_curCommandHistoryIndex];\n				_curCommandHistoryIndex -= 1;\n				if(_curCommandHistoryIndex < 0){\n					_curCommandHistoryIndex = _g_maxCommandHistory - 1;\n				}\n				break;\n			default:\n				break;\n		}\n	}\n	if(evt.altKey){\n		switch(keycode){\n			case 48: /*0*/\n			case 49: /*1*/\n			case 50: /*2*/\n			case 51: /*3*/\n			case 52: /*4*/\n			case 53: /*5*/\n			case 54: /*6*/\n			case 55: /*7*/\n			case 56: /*8*/\n			case 57: /*9*/\n				if(evt.altLeft){\n					$('debuggerCommand').value = _commandStore[Number(keycode) - 48];\n				}else{\n					_commandStore[Number(keycode) - 48] = oDebugger.$('debuggerCommand').value;\n				}\n				break;\n			default:\n				break;\n		}\n	}\n	if(keycode == '13'){\n		prerunCommand();\n	}\n	if(keycode == '27'){$('debuggerCommand').value = \'\';} /*ESC pressed*/\n}\n\nfunction debuggerCommandOnKeyUp(evt){\n	evt = evt || event;\n	var keycode = evt.keyCode || evt.which;\n	if(keycode == 17){	/*ctrl key up*/\n		_curCommandHistoryIndex = 0;\n	}\n}\n\nfunction debuggerContentTopDivOnKeyDown(evt){\n	evt = evt || event;\n	var keycode = evt.keyCode || evt.which;\n	if(keycode == 13){	/*Enter key down*/\n		if(_g_isIE){\n			var txtobj = document.selection.createRange();\n			txtobj.text == \'\'?txtobj.text='\\n':(document.selection.clear())&(txtobj.text='\\n');\n			document.selection.createRange().select();\n			stopBubble(evt);\n			return false;\n		}else{\n		}\n	}\n}\n\nfunction debuggerOnMouseDown(evt){\n	_g_mouseDownStatus = true;\n	evt = evt || event;\n	var mouseX = (evt.pageX)?evt.pageX:evt.clientX;\n	var mouseY = (evt.pageY)?evt.pageY:evt.clientY;\n	lastMouseX = mouseX;\n	lastMouseY = mouseY;\n}\n\nfunction debuggerOnMouseUp(){\n	_g_mouseDownStatus = false;\n	if(_g_cmdFocus){\n		$('debuggerCommand').focus();\n	}\n}\n\nfunction document.onmousemove(evt){\n	if(_g_mouseDownStatus){\n		evt = evt || event;\n		var mouseX = (evt.pageX)?evt.pageX:evt.clientX;\n		var mouseY = (evt.pageY)?evt.pageY:evt.clientY;\n		\n		_g_lastpos_x = Debugger.style.left;\n		_g_lastpos_y = Debugger.style.top;\n		\n		mouseX -= lastMouseX;\n		mouseY -= lastMouseY;\n		mouseX += parseInt(Debugger.style.left.replace('px',\'\'));\n		mouseY += parseInt(Debugger.style.top.replace('px',\'\'));\n		Debugger.style.left = mouseX;\n		Debugger.style.top = mouseY;\n	}\n}\n\nfunction setDebuggerStyle(){\n	try{\n		Debugger.style.position = 'absolute';\n		Debugger.style.width = '320px';\n		Debugger.style.height = '425px';\n		Debugger.style.filter = 'Alpha(Opacity = ' + alpha.BODY + ')';\n		Debugger.style.backgroundColor = color.BACKGROUNDCOLOR + ' ';\n		Debugger.style.left = _g_lastpos_x;\n		Debugger.style.top = _g_lastpos_y;\n	}catch(e){}\n}\n\n</script>\n</HEAD>\n<BODY onmousedown='debuggerOnMouseDown()' onmouseup='debuggerOnMouseUp()'>\n<span onclick='parentDebugger.showdebugger(false);' id='debugger_hiddenBtn'>x</span>\n<table cellpading='0' cellspacing='0' id='layoutTable'><tr><td colspan='2' style='height:16px;'>\nDebugger(Version:0.8Preview):\n</td></tr><tr><td style='height:16px;width:100%;'>\n<input type='text' id='debuggerInfo' />\n</td><td style='height:16px;width:49px;'>\n<button onclick='clearOutput();' id='debugger_clearOutput' >clear</button>\n</td></tr><tr><td colspan='2'>\n<div id='debuggerClientDiv'><div id='debugger_contentTopDiv' contenteditable designMode onkeydown='debuggerContentTopDivOnKeyDown()'></div><div contenteditable id='DebuggerOutput' designMode></div>\n</div> \n</td></tr><tr><td style='height:16px;'>\n<input type='text' id='debuggerCommand' onkeydown='debuggerCommandOnKeyDown()' onkeyup='debuggerCommandOnKeyUp()'/>\n</td><td style='height:16px;width:49px;'>\n<button onclick='prerunCommand();' id='debugger_runCommand'>run</button>\n</td></tr></table>\n<script language='javascript' type='text/script'>\n</script>\n</BODY></HTML>",
	menuStr : '<li>' +
		'<ul onclick="javascript:oDebugger.showCurPageSource();">View Page Source</ul>' +
		'<ul onclick="javascript:oDebugger.showHelp();">Help</ul>' +
		'</li>',
	subMenuStr : '<li>' +
		'<ul onclick="javascript:oDebugger.selectAll(oDebugger.DebuggerWin.$(\'DebuggerOutput\'));">Select All</ul>' +
		'<ul onclick="javascript:oDebugger.copy(oDebugger.DebuggerWin.$(\'DebuggerOutput\'));">Copy</ul>' +
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
		MENUOVER: '#E8E8E8'
	},
	alpha: {
		MENU: '75',
		BODY: '75'
	},
	/*
	*################################################################################################################################################
	*Debug method You can add your debugger code below ;=)
	*################################################################################################################################################
	*/
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
		if (!args.attributes){
			this.showoutput('===--------- no attributes -------===', false);
		}
		this.showoutput('===--------- ' + args.nodeName + ' -------===', false);
		var attrs = args.attributes;
		for (var i=0; i<attrs.length; i++) {
			this.showoutput(' ' +attrs[i].name+ '=&quot;' +attrs[i].value+ '&quot;', false);
		};
		if(args.nodeType == 1){
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
		}
		this.showoutput('====================================', false);
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
		if(obj.parentNode && obj.parentNode.nodeType == 1){//if(obj.parentElement){
			setTimeout(function(evt){
					evt = (evt) ? evt : ((window.event) ? window.event : "");
					oDebugger.timerChangeBackColor(oDebugger._g_lasttargetObj.parentNode);}, 900);
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
				if(!arr){
					if(oDebugger._g_isIE){
						if(typeof(oDebugger._g_eval("obj." + x)) == 'function'){
							tmp = "obj." + x +  "   =   " + String(oDebugger._g_eval("obj." + x)).substring(0, String(oDebugger._g_eval(objid + "." + x)).indexOf('{'));
						}else{
							tmp = "obj." + x + "   =   " + oDebugger._g_eval("obj." + x);
						}
					}else{
						if(typeof(window.eval("obj." + x)) == 'function'){
							tmp = "obj." + x +  "   =   " + String(window.eval("obj." + x)).substring(0, String(window.eval(objid + "." + x)).indexOf('{'));
						}else{
							tmp = "obj." + x + "   =   " + window.eval("obj." + x);
						}
					}
					oDebugger.showoutput(tmp, false);
				}
			}
			i++;
			if( i > 2000 ){
				oDebugger.showoutput('=============Error==============', false);
				oDebugger.showoutput('Error!!!! Loop\'s count more than 2000!!!', false, oDebugger.colors.ERROR);
				oDebugger.showoutput('=============Error==============', false);
				break;
			};
		}
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
				if(!arr){
					if(this._g_isIE){
						if(typeof(this._g_eval(objid + "." + x)) == 'function'){
							tmp = objid + "." + x +  "   =   " + String(this._g_eval(objid + "." + x)).substring(0, String(this._g_eval(objid + "." + x)).indexOf('{'));
						}else{
							tmp = objid + "." + x + "   =   " + this._g_eval(objid + "." + x);
						}
					}else{
						if(typeof(window.eval(objid + "." + x)) == 'function'){
							tmp = objid + "." + x +  "   =   " + String(window.eval(objid + "." + x)).substring(0, String(window.eval(objid + "." + x)).indexOf('{'));
						}else{
							tmp = objid + "." + x + "   =   " + window.eval(objid + "." + x);
						}

					}
					this.showoutput(tmp);
				}
			}
			i++;
			if( i > 2000 ){
				this.showoutput('=============Error==============');
				this.showoutput('Error!!!! Loop\'s count more than 2000!!!', false, this.colors.ERROR);
				this.showoutput('=============Error==============');
				break;
			};
		}
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
				if(!arr){
					if(this._g_isIE){
						if(typeof(this._g_eval(objid + "." + x)) == 'function'){
							tmp = tmp = objid + "." + x +  "   =   " + String(this._g_eval(objid + "." + x)).substring(0, String(this._g_eval(objid + "." + x)).indexOf('{'));
						}else{
							tmp = objid + "." + x + "   =   " + this._g_eval(objid + "." + x);
						}
						this.showoutput(tmp);
						if((this._g_eval(objid + "." + x ) == "[object]") ){
							var   objsub;
							objsub = this._g_eval(objid + "." + x);
							objsubid = objid + "." + x;
							if(objsubid.search(/document/i) == -1 )
							{
								if(objsubid.search(/(parent)/i) == -1){
									this._getSTree(objsub, objid);
									//oDebugger.showoutput(tmp);
									i++;
								}
							}
						}
					}else{
						if(typeof(window.eval(objid + "." + x)) == 'function'){
							tmp = tmp = objid + "." + x +  "   =   " + String(window.eval(objid + "." + x)).substring(0, String(window.eval(objid + "." + x)).indexOf('{'));
						}else{
							tmp = objid + "." + x + "   =   " + window.eval(objid + "." + x);
						}
						this.showoutput(tmp);
						if((window.eval(objid + "." + x ) == "[object]") ){
							var   objsub;
							objsub = window.eval(objid + "." + x);
							objsubid = objid + "." + x;
							if(objsubid.search(/document/i) == -1 )
							{
								if(objsubid.search(/(parent)/i) == -1){
									this._getSTree(objsub, objid);
									//oDebugger.showoutput(tmp);
									i++;
								}
							}
						}
					}
				}
			}
			i++;
			if( i > 2000 ){
				this.showoutput('=============Error==============');
				this.showoutput('Error!!!! Loop\'s count more than 2000!!!', false, this.colors.ERROR);
				this.showoutput('=============Error==============');
				break;
			};
		}
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
				if(!arr){
					if(this._g_isIE){
						tmp = objid + "." + x + "   =   " + this._g_eval(objid + "." + x) ;
						this.showoutput(tmp);
						if((this._g_eval(objid + "." + x ) == "[object]") ){
							var   objsub;
							objsub = this._g_eval(objid + "." + x);
							objsubid = objid + "." + x;
							if(objsubid.search(/document/i) == -1 )
							{
								if(objsubid.search(/(parent)/i) == -1){
									this._getprop(objsub,objsubid);
									//oDebugger.showoutput(tmp);
									i++;
								}
							}
						}
					}else{
						tmp = objid + "." + x + "   =   " + window.eval(objid + "." + x) ;
						this.showoutput(tmp);
						if((window.eval(objid + "." + x ) == "[object]") ){
							var   objsub;
							objsub = window.eval(objid + "." + x);
							objsubid = objid + "." + x;
							if(objsubid.search(/document/i) == -1 )
							{
								if(objsubid.search(/(parent)/i) == -1){
									this._getprop(objsub,objsubid);
									//oDebugger.showoutput(tmp);
									i++;
								}
							}
						}
					}
				}
			}
			i++;
			if( i > 2000 ){
				this.showoutput('=============Error==============');
				this.showoutput('Error!!!! Loop\'s count more than 2000!!!');
				this.showoutput('=============Error==============');
				break;
			};
		}
		//forloop's counts i;
		this.showoutput('========getprop End=========');
	},

	_showprop:function (obj, objid)
	{
		this.showoutput('========showprop Begin=======', false);
		for(x in obj){
			if(x == 0){
				break;
			}else{//if(eval(objid+"."+x)=="[object]")
				if(this._g_isIE){
					this.showoutput( objid + "." + x + "   =   " + this._g_eval(objid + "." + x) , false);
				}else{
					this.showoutput( objid + "." + x + "   =   " + window.eval(objid + "." + x) , false);
				}
			}
		}
		this.showoutput('========showprop End=========', false);
	},

	_showvalue:function (obj)
	{
		oDebugger.showoutput('========showvalue Begin=======', false);
		oDebugger.showoutput(' ');
		if(oDebugger._g_isIE){
			oDebugger.showoutput( oDebugger._g_eval('obj'), false);
		}else{
			oDebugger.showoutput( window.eval('obj'), false);
		}
		oDebugger.showoutput('========showvalue End=========', false);
	},

	listObject:function (obj){
		for ( var i in obj)
		{
			oDebugger.showoutput('' + i , true, oDebugger.colors.TIP);
			oDebugger.showoutput(' = ', true);
			if(oDebugger._g_isIE){
				try{
					oDebugger.showoutput((typeof(oDebugger._g_eval('obj.' + i)) == 'function')?String(oDebugger._g_eval("obj." + i)).substring(0, String(oDebugger._g_eval("obj." + i)).indexOf('{')):oDebugger.htmlEncode(String(oDebugger._g_eval('obj.' + i))), false);
				}catch(e){
					oDebugger.showoutput(e.description, false, oDebugger.colors.ERROR);
				}
			}else{
				try{
					oDebugger.showoutput((typeof(window.eval('obj.' + i)) == 'function')?String(window.eval("obj." + i)).substring(0, String(window.eval("obj." + i)).indexOf('{')):oDebugger.htmlEncode(String(window.eval('obj.' + i))), false);
				}catch(e){
					oDebugger.showoutput(e, false, oDebugger.colors.ERROR);
				}
			}
		}
	},

	listArrays:function (obj){
		oDebugger.showoutput('length:' + obj.length , false);
		for(var i = 0; i < obj.length; i++){
			oDebugger.showoutput('' + i , true, oDebugger.colors.TIP);
			oDebugger.showoutput(' = ', true);
			if(oDebugger._g_isIE){
				oDebugger.showoutput( oDebugger._g_eval('obj[i]'), false);
			}else{
				oDebugger.showoutput( window.eval('obj[i]'), false);
			}
		}
	},

	listObjectDetails:function (obj){
		for ( var i in obj)
		{
			oDebugger.showoutput('' + i , true, oDebugger.colors.TIP);
			oDebugger.showoutput(' = ', true);
			if(oDebugger._g_isIE){
				oDebugger.showoutput(oDebugger.htmlEncode(String(oDebugger._g_eval('obj.' + i))), false);
			}else{
				oDebugger.showoutput(oDebugger.htmlEncode(String(window.eval('obj.' + i))), false);
			}
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
				}, true);
		}else{
			watchVariable(obj, timerCount);
		}
	},
	getObjHTML:function(obj){
		var curObj = document.documentElement;
		if(arguments.length > 0){
			curObj = obj;
		}
		return curObj.outerHTML;
	},
	cloneCurPageSource:function(obj){
		var srcwin = window.open('', '', '');
		srcwin.opener = null;
		srcwin.document.write(this.getObjHTML(obj).replace(this.Debugger.outerHTML, '').replace(this.Menu.outerHTML, '').replace(this.SubMenu.outerHTML, ''));
		srcwin.document.close();
	},
	cloneObjSourceById:function(objId){
		var srcwin = window.open('', '', '');
		srcwin.opener = null;
		srcwin.document.write(this.getObjHTML(this.$(objId)).replace(this.Debugger.outerHTML, '').replace(this.Menu.outerHTML, '').replace(this.SubMenu.outerHTML, ''));
		srcwin.document.close();
	},
	removeODebuggerCode:function(args){
		//args.replace(//gi, '');
		//return args;
		if(this._g_isIE){
			return args.replace(String(this.Debugger.outerHTML), '').replace(String(this.Menu.outerHTML), '').replace(String(this.SubMenu.outerHTML), '');
			//return args.replace(/<div([a-z0-9\'\"\=]??)startX(?:[^(<div)])<\/div>/img, '');
		}else{
			return args.replace(String(this.Debugger.outerHTML), '').replace(String(this.Menu.innerHTML), '').replace(String(this.SubMenu.innerHTML), '');
		}
	},
	showCurPageSource:function(){
		var srcwin = window.open('',null);
		srcwin.opener = window.opener;//null;
		srcwin.document.write('<body></body>');
		if(this._g_isIE){
			srcwin.document.body.innerText = this.removeODebuggerCode(String(this.getObjHTML()));
		}else{
			srcwin.document.body.textContent = this.removeODebuggerCode(String(document.documentElement.innerHTML));
		}
		srcwin.document.close();
		
	},
	injectDebugger:function(obj){
		var head = obj.document.getElementsByTagName("head")[0];
		var js = obj.document.createElement("script");
		js.type="text/javascript";
		js.language="javascript";
		js.src = "file:///javascriptdebugger/debugger.js";
		head.appendChild(js);alert('inject success!');
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
		this._g_isIE7 = /msie\s+7/i.test(navigator.userAgent);
		this._g_isIE6 = /msie\s+6/i.test(navigator.userAgent);
		this._g_isFirefox = /firefox/i.test(navigator.userAgent);
		
		var framesetCheck = window.document.getElementsByTagName('FRAMESET');
		var frameCheck = window.document.getElementsByTagName('FRAME');
		this.pBody = window.document.getElementsByTagName('body')[0];
		this.pHead = window.document.getElementsByTagName('head')[0];
		this.frame = null;
		if(framesetCheck.length > 0 && frameCheck.length > 0){
			var promptTip = '';
			for(var i = 0; i < frameCheck.length; i++){
				promptTip += '[' + i + ':id=' + frameCheck[i].id + ',name=' + frameCheck[i].name + ']\n';
			}
			//var retVal = prompt('There exist more than one frame, please select one(Input number):' + promptTip, '0');
			var retVal = prompt('pls sel a frame(need Num):' + promptTip, '0');
			if(retVal == null){
				return false;
			}else if(/^\d+$/.test(retVal)){
				this.frame = frameCheck[parseInt(retVal)];
				this.unloadDebuggerJS();
				//if(this._g_isIE){
					this.loadDebuggerJs(this.frame.contentWindow);
				//}else{
				//	this.loadDebuggerJs(this.frame.contentWindow);
				//}
				return false;
			}else if(/\D+/g.test(retVal)){
				this.loadDebuggerJs(window.document.getElementById(retVal).contentWindow);
				return false;
			}else{
				return false;
			}
		}
		//this.loadDebuggerCss();
		if(this.pBody){
		}else{
			alert('no body exist, create a new...');
			this.pBody = window.document.createElement('BODY');
			window.document.appendChild(this.pBody);
		}
		//create debugger's UI
		//this.Debugger = this.appendElement('DIV', this.debuggerStr, '', 'position:absolute;overflow-x:auto;overflow-y:auto;top:0;left:0;float:left;width:320px;background-color:#FFFF00;filter: Alpha(Opacity = 75);scrollbar-3dlight-color: #959CBB;scrollbar-arrow-color: #666666;scrollbar-base-color: #445289;scrollbar-darkshadow-color: #959CBB;scrollbar-face-color: #D6DDF3;scrollbar-highlight-color: #959CBB;scrollbar-shadow-color: #959CBB;cursor:move;cursor:move;');
		this.Debugger = document.createElement('IFRAME');
		this.Debugger.frameBorder = '0';
		this.Debugger.style.position = 'absolute';
		this.Debugger.id = 'id_g_oDebugger';
		this.Debugger.name = 'id_g_oDebugger';
		this.Menu = this.appendElement('DIV', this.menuStr, '', 'position:absolute;display:none;overflow:hidden;top:0;left:0;width:240px;background-color:#CCCCCC;filter: Alpha(Opacity = 75);cursor:pointer;');
		this.SubMenu = this.appendElement('DIV', this.subMenuStr, '', 'position:absolute;display:none;overflow:hidden;top:0;left:0;width:240px;background-color:#CCCCCC;filter: Alpha(Opacity = 75);cursor:pointer;');
		this.pBody.appendChild(this.Debugger);
		window.frames.id_g_oDebugger.document.writeln(this.debuggerStr);
		window.frames.id_g_oDebugger.document.close();
		this.pBody.appendChild(this.Menu);
		this.pBody.appendChild(this.SubMenu);
		this.DebuggerWin = window.frames.id_g_oDebugger;
		window.frames.id_g_oDebugger.parentDebugger = oDebugger;
		window.frames.id_g_oDebugger.parentWin = window;
		window.frames.id_g_oDebugger.Debugger = this.Debugger;
		this._g_lastpos_y = Number(this.pBody.offsetHeight)/2;
		this._g_lastpos_y = 100;
		this._g_lastpos_x = Number(this.pBody.offsetWidth)/2;
		//this.Debugger.attachEvent('onmousedown', function(evt){oDebugger.DownMouse(evt.srcElement, evt);});
		//this.Debugger.attachEvent('onmousemove', function(evt){oDebugger.MoveLayer(evt.srcElement, evt);});
		//this.Debugger.attachEvent('onmouseup', function(evt){oDebugger.UpMouse(evt.srcElement, evt);});
		this.bindEventListner(
			(this._g_isIE)?this.pBody:window, 'onmousemove',
			function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				oDebugger._g_targetObj = (evt.target) ? evt.target : evt.srcElement;
				oDebugger.T = oDebugger._g_targetObj;
				var mouseX = (evt.pageX)?evt.pageX:evt.x;//evt.clientX:evt.x;//evt.pageX;
				var mouseY = (evt.pageY)?evt.pageY:evt.y;//evt.clientY:evt.y;//pageY;
				if(oDebugger._g_enableShowMousePos){
					oDebugger.DebuggerWin.$('debuggerInfo').value = 'MouseX:' + mouseX + ' MouseY:' + mouseY;
				}
				if(oDebugger._g_enableShowMouseObject){
					oDebugger.showMouseObject(evt, oDebugger._g_targetObj);
				}
			}
		, true);
		this.bindEventListner(
			this.Debugger, 'oncontextmenu',
			function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				oDebugger._g_menuTarget = oDebugger;
				oDebugger.showMenu(evt, oDebugger.Menu, true);
				oDebugger.stopBubble(evt);
			}
		, true);
		/*
		this.bindEventListner(
			this.$('DebuggerOutput'), 'oncontextmenu',
			function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				oDebugger._g_menuTarget = oDebugger.$('DebuggerOutput');
				oDebugger.showMenu(evt, oDebugger.SubMenu, true);
				oDebugger.stopBubble(evt);
			}
		, true);
		*/
		this.bindEventListner(this.Menu, 'onmouseout', function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				oDebugger.showMenu(evt, oDebugger.Menu, false);}, true);
		this.bindEventListner(this.Menu, 'onclick', function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				oDebugger.showMenu(evt, oDebugger.Menu, false);}, true);
		this.bindEventListner(this.SubMenu, 'onmouseout', function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				oDebugger.showMenu(evt, oDebugger.SubMenu, false);}, true);
		this.bindEventListner(this.SubMenu, 'onclick', function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				oDebugger.showMenu(evt, oDebugger.SubMenu, false);}, true);
		this.bindEventListner(
			this.Menu, 'oncontextmenu',	function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				oDebugger.showMenu(evt, oDebugger.Menu, false);
				oDebugger.stopBubble(evt);}, true);
		this.bindEventListner(
			this.SubMenu, 'oncontextmenu', function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				oDebugger.showMenu(evt, oDebugger.SubMenu, false);
				oDebugger.stopBubble(evt);}, true);
		this.bindEventListner(this.Menu, 'onmouseover', function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				oDebugger.Menu.style.display = 'block';}, true);
		this.bindEventListner(this.SubMenu, 'onmouseover', function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				oDebugger.SubMenu.style.display = 'block';}, true);
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
		this.l = this.listArrays;
		this.$R = this._g_returnValue; //return value's shortcut
		this.O = this._g_oDList;
		//this.T = this._g_targetObj; //T -> target
		//Attach EVENTs
		//keyCode 123 = F12
		//keyCode 118 , 119 = F7, F8
		this.bindEventListner(
			(this._g_isIE)?this.pBody:window, 'onkeydown',
			function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var keycode = evt.keyCode || evt.which;
				if(keycode=='123'){oDebugger.showdebugger(oDebugger.Debugger.style.display == 'none'?true:false);try{oDebugger.DebuggerWin.$('debuggerCommand').focus();}catch(e){}}
				if(keycode=='118'){oDebugger._g_returnValue = [];oDebugger.timerChangeBackColor(oDebugger._g_targetObj);}
				if(keycode=='119' && oDebugger._g_targetObj != null){oDebugger.changeBackColor(oDebugger._g_targetObj);oDebugger.showdetails(oDebugger._g_targetObj);}
			}
		, true);
		/*
		document.getElementsByTagName("body").item(0).attachEvent('onkeydown',
			function(evt){
				if(evt.keyCode=='123'){oDebugger.showdebugger(oDebugger.Debugger.style.display == 'none'?true:false);try{oDebugger.$('debuggerCommand').focus();}catch(e){}}
				if(evt.keyCode=='118'){oDebugger._g_returnValue = [];oDebugger.timerChangeBackColor(oDebugger._g_targetObj);}
				if(evt.keyCode=='119' && oDebugger._g_targetObj != null){oDebugger.changeBackColor(oDebugger._g_targetObj);oDebugger.showdetails(oDebugger._g_targetObj);}
			}
		);*/
		//keyCode 13 Enter
		//keyCode 37 <- 38 ^ 39 -> 40 |
		//keyCode 8 BackSpace  46 Delete
		
		
		this.setDebuggerStyle();
		/*
		this.$('debuggerCommand').focus();
		this.$('debuggerCommand').onfocus = this.onActive;
		this.$('debuggerCommand').onblur = this.onDeActive;
		*/
		
		if(this.debug.isEvalBeHooked()){
			this.showoutput("ERROR: eval function was hooked by other codes in the front.", false, this.color.ERROR);
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

		this.unloadDebuggerJS();
		return true;
	},
	registerPublicSingleVariable:function(obj, objName){
		try{
			if(obj == undefine);
			this.showoutput('Warnning: ' + objName + ' is defined!', false, this.colors.ERROR);
		}catch(e){
			if(this._g_isIE){
				obj = this._g_eval('oDebugger.' + objName);
			}else{
				obj = window.eval('oDebugger.' + objName);
			}
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
			this._g_registedVariables.push('$');
		}

		try{
			if(S == 'undefine');
			//this.showoutput('Warnning: S is defined!', false, 'red');
			errorStr = errorStr + 'Warnning: S is defined!' + '<br/>';
		}catch(e){
			S = oDebugger.S;
			this._g_registedVariables.push('S');
		}

		try{
			if(M == 'undefine');
			//this.showoutput('Warnning: M is defined!', false, 'red');
			errorStr = errorStr + 'Warnning: M is defined!' + '<br/>';
		}catch(e){
			M = oDebugger.M;
			this._g_registedVariables.push('M');
		}

		try{
			if(P == 'undefine');
			//this.showoutput('Warnning: P is defined!', false, 'red');
			errorStr = errorStr + 'Warnning: P is defined!' + '<br/>';
		}catch(e){
			P = oDebugger.P;
			this._g_registedVariables.push('P');
		}

		try{
			if(V == 'undefine');
			//this.showoutput('Warnning: V is defined!', false, 'red');
			errorStr = errorStr + 'Warnning: V is defined!' + '<br/>';
		}catch(e){
			V = oDebugger.V;
			this._g_registedVariables.push('V');
		}

		try{
			if(L == 'undefine');
			//this.showoutput('Warnning: L is defined!', false, 'red');
			errorStr = errorStr + 'Warnning: L is defined!' + '<br/>';
		}catch(e){
			L = oDebugger.L;
			this._g_registedVariables.push('L');
		}
		
		try{
			if(l == 'undefine');
			//this.showoutput('Warnning: L is defined!', false, 'red');
			errorStr = errorStr + 'Warnning: l is defined!' + '<br/>';
		}catch(e){
			l = oDebugger.l;
			this._g_registedVariables.push('l');
		}

		try{
			if($R == 'undefine');
			//this.showoutput('Warnning: $R is defined!', false, 'red');
			errorStr = errorStr + 'Warnning: $R is defined!' + '<br/>';
		}catch(e){
			$R = oDebugger.$R;
			this._g_registedVariables.push('$R');
		}

		try{
			if(O == 'undefine');
			//this.showoutput('Warnning: L is defined!', false, 'red');
			errorStr = errorStr + 'Warnning: O is defined!' + '<br/>';
		}catch(e){
			O = oDebugger.O;
			this._g_registedVariables.push('O');
		}

		try{
			if(oD == 'undefine');
			//this.showoutput('Warnning: oD is defined!', false, 'red');
			errorStr = errorStr + 'Warnning: oD is defined!' + '<br/>';
		}catch(e){
			oD = oDebugger;
			this._g_registedVariables.push('oD');
		}
		
		try{
			if(od == 'undefine');
			//this.showoutput('Warnning: od is defined!', false, 'red');
			errorStr = errorStr + 'Warnning: od is defined!' + '<br/>';
		}catch(e){
			od = oDebugger;
			this._g_registedVariables.push('od');
		}

		this.showoutput(errorStr, false, this.colors.ERROR);
	},

	showdebugger:function (args){
		if(!this._g_isDR){
			if(!this.initdebugger()){
				return;
			}
		}
		if(this.Debugger){
			this.Debugger.style.display=args?'block':'none';
		}
	},
	onExit:function(){
		for(var i = 0; i < this._g_registedVariables.length; i++){
			if(this._g_isIE){
				this._g_eval(this._g_registedVariables[i] + ' = null');
				this._g_eval('delete ' + this._g_registedVariables[i]);
			}else{
				window.eval(this._g_registedVariables[i] + ' = null');
				window.eval('delete ' + this._g_registedVariables[i]);
			}
		}
		for(var i = 0; i < this._g_registedEventHandlers.length; i++){
			this.releaseEventListner(this._g_registedEventHandlers[i][0], this._g_registedEventHandlers[i][1], this._g_registedEventHandlers[i][2]);
		}
		this.showdebugger(false);
		this.pBody.removeChild(this.Menu);
		this.pBody.removeChild(this.SubMenu);
		this.pBody.removeChild(this.Debugger);
		this.unloadDebuggerJS();
		//this.unloadDebuggerCss();
		
		oDebugger = null;
		delete oDebugger;
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
	showoutput:function (args, inline, color){
		
		if(arguments.length <= 1){
			if(this._g_isIE){
				this.DebuggerWin.$('DebuggerOutput').innerText += args;
			}else{
				this.DebuggerWin.$('DebuggerOutput').textContent += args;
			}
		}else if(!color){
			this.DebuggerWin.$('DebuggerOutput').innerHTML += args;
		}else{
			this.DebuggerWin.$('DebuggerOutput').innerHTML += '<font color=' + color + '>' + args + '</font>';
		}
		if(arguments.length > 1 && !inline){
			this.DebuggerWin.$('DebuggerOutput').innerHTML += '<br/>';
		}else if(arguments.length == 1 || !inline){
			if(this._g_isIE){
				this.DebuggerWin.$('DebuggerOutput').innerText += '\n';
			}else{
				this.DebuggerWin.$('DebuggerOutput').textContent += '\n';
			}
		}
		this.DebuggerWin.$('DebuggerOutput').scrollTop = Number(this.DebuggerWin.$('DebuggerOutput').scrollHeight);
	},
	UpMouse:function (obj, evt){
		obj.downStatus = false;
		if(this._g_cmdFocus){
			this.DebuggerWin.$('debuggerCommand').focus();
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
			if(mouseX < obj.style.left || obj.startY > obj.style.top || 
				mouseX > (obj.offsetLeft + obj.offsetWidth) ||
				mouseY > (obj.offsetTop + obj.offsetHeight) ){
				obj.downStatus = false;
			}
			obj.style.left = mouseX - obj.startX; //obj.startLeft+
			obj.style.top = mouseY - obj.startY; //obj.startTop+
			//obj.viewpos.value = " X:"+event.clientX+" Y:"+event.clientY+"
			//startX:"+startX+"  startY:"+startY;
			this._g_lastpos_y = obj.style.top;
			this._g_lastpos_x = obj.style.left;
		}
	},
	DownMouse:function (obj, evt){
		evt = (evt) ? evt : ((window.event) ? window.event : "");
		var mouseX = (evt.pageX)?evt.pageX:evt.x;
		var mouseY = (evt.pageY)?evt.pageY:evt.y;
		obj.downStatus = true;
		obj.startX = mouseX - obj.offsetLeft;
		obj.startY = mouseY - obj.offsetTop;
	},
	DebuggerCssStr:'.debugger_contentTopDiv{' + 
		'	display:block;' +
		'	background-color:#FF0000;' +
		'	position:relative;' +
		'	' +
		'	' +
		'} ' +
		'DIV{' + 
		'	display:block;' +
		'	background-color:#FF00FF;' +
		'	position:relative;' +
		'	width:10px;' +
		'	' +
		'} '
	,
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
		this.Debugger.style.cursor='move';
		this.Debugger.style.fontSize='15px';
		this.Menu.style.position = 'absolute';
		this.Menu.style.width = '160px';
		this.Menu.style.height = 'auto';
		this.Menu.style.display = 'none';
		this.Menu.style.backgroundColor = this.colors.MENUBACKGROUNDCOLOR;
		this.Menu.style.filter = 'Alpha(Opacity = ' + this.alpha.MENU + ')';
		this.Menu.style.overflow='hidden';
		this.Menu.style.cursor='pointer';
		this.Menu.style.fontSize='12px';
		this.SubMenu.style.position = 'absolute';
		this.SubMenu.style.width = '120px';
		this.SubMenu.style.height = 'auto';
		this.SubMenu.style.display = 'none';
		this.SubMenu.style.backgroundColor = this.colors.MENUBACKGROUNDCOLOR;
		this.SubMenu.style.filter = 'Alpha(Opacity = ' + this.alpha.MENU + ')';
		this.SubMenu.style.overflow='hidden';
		this.SubMenu.style.cursor='pointer';
		this.SubMenu.style.fontSize='12px';

		this.setDebuggerMenuStyle(this.Menu);
		this.setDebuggerMenuStyle(this.SubMenu);
	},
	setDebuggerMenuStyle:function(obj){
		var objs = obj.getElementsByTagName('UL');
		for( var i = 0; i < objs.length; i++){
			objs[i].style.padding = '0';
			objs[i].style.margin = '0px 1px 1px 10px';
			objs[i].style.width = '100%';
			objs[i].style.height = '24px';
			objs[i].style.lineHeight = '24px';
			objs[i].style.backgroundColor = this.colors.MENUBACKGROUNDCOLOR;
			this.bindEventListner(objs[i], 'onmouseover', function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				elem.style.backgroundColor = oDebugger.colors.MENUOVER;
				}, true);
			this.bindEventListner(objs[i], 'onmouseout', function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var elem = (evt.target) ? evt.target : evt.srcElement;
				elem.style.backgroundColor = oDebugger.colors.MENUBACKGROUNDCOLOR;
				}, true);
		}
		objs = obj.getElementsByTagName('LI');
		for( var i = 0; i < objs.length; i++){
			objs[i].style.padding = '0';
			objs[i].style.margin = '0px 0px 0px 0px';
			objs[i].style.borderTop = '1px solid ' + oDebugger.colors.MENUCOLOR;
			objs[i].style.borderBottom = '1px solid ' + oDebugger.colors.MENUCOLOR;
			objs[i].style.listStyleType = 'none';
			objs[i].style.height = 'auto';
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
		if (filetype=="js"){
			var fileref=document.createElement('script');
			fileref.setAttribute("type","text/javascript");
			fileref.setAttribute("src",filename);
		}
		else if (filetype=="css"){
			var fileref=document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href",filename);
		}
		if (typeof fileref != "undefined")
			window.document.getElementsByTagName("head")[0].appendChild(fileref)
	},

	/*
	var head = document.getElementsByTagName("head")[0];
	var js = document.createElement("script");
	js.src = "e\:\\debugger\\debugger.js";
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
		}
	}
	head.appendChild(js);
	*/
	loadDebuggerJs:function (obj){
		var head = obj.document.getElementsByTagName('head')[0];
		if(!head){
			head = obj.document.createElement('HEAD');
			obj.document.appendChild(head);
			alert('oDebugger created a new head!');
		}
		this.unloadDebuggerJS(head);
		script = obj.document.createElement('script');
		if(this._g_isIE7){
			script.src = 'file://C:/javascriptdebugger/debugger.js'; 
		}else if(this._g_isIE6){
			script.src = 'file:///javascriptdebugger/debugger.js'; 
		}else{
			script.src = 'file://C:/javascriptdebugger/debugger.js'; 
		}
		script.type = 'text/javascript';
		head.appendChild(script);
	},
	loadJs:function (file){
		 var scriptTag = document.getElementById('loadScript');
		 var head = window.document.getElementsByTagName('head').item(0);
		 if(scriptTag) {
			head.removeChild(scriptTag);
		 }
		 script = document.createElement('script');
		 script.src = ""+file; 
		 script.type = 'text/javascript';
		 script.id = 'loadScript';
		 head.appendChild(script);
	},

	unloadJs:function (file, obj){
		 var scriptTags = window.document.getElementsByTagName('script');
		 var head = obj || window.document.getElementsByTagName('head').item(0);
		 var retVal = false;
		 for(var i = 0; i < scriptTags.length; i++){
			 if(scriptTags[i].src == file){
				 head.removeChild(scriptTags[i]);
				 retVal = true;
			 }
		 }
		 return retVal;
	},

	loadCss:function (file){
		 var cssTag = document.getElementById('loadCss');
		 var head = window.document.getElementsByTagName('head').item(0);
		 if(cssTag){
		   head.removeChild(cssTag);
		 }
		 css = document.createElement('link');
		 css.href = ""+file; 
		 css.rel = 'stylesheet';
		 css.type = 'text/css';
		 css.id = 'loadCss';
		 head.appendChild(css);
	},

	unloadCss:function (file, obj){
		var styleTags = window.document.getElementsByTagName('link');
		var head = obj || window.document.getElementsByTagName('head').item(0);
		var retVal = false;
		for( var i = 0; i < styleTags.length; i++){
			if(styleTags[i].href == file){
				head.removeChild(styleTags[i]);
				retVal = true;
			}
		}
		return retVal;
	},

	unloadDebuggerJS:function (obj){
		 var head = obj || window.document.getElementsByTagName('head').item(0);
		 var scriptTags = head.getElementsByTagName('script');
		 var retVal = false;
		 for(var i = 0; i < scriptTags.length; i++){
			 //alert(scriptTags[i].src + '    ' + scriptTags[i].src.substring((scriptTags[i].src.length - 11), 11));
			 if(scriptTags[i].src.indexOf('debugger.js') != -1){
				 head.removeChild(scriptTags[i]);
				 retVal = true;
			 }
		 }
		 return retVal;
	},
	loadDebuggerCss:function(){
		var cssTag = document.getElementById(this._g_ids.debugger_css);
		var head = document.getElementsByTagName('head')[0];
		if(cssTag){
		   head.removeChild(cssTag);
		}
		css = document.createElement('style');
		if(this._g_isIE){
			css.cssText = this.DebuggerCssStr; 
		}else{
			css.innerHTML = this.DebuggerCssStr; 
		}
		css.type = 'text/css';
		css.id = this._g_ids.debugger_css;
		head.appendChild(css);
		if(this._g_isIE){
			;
		}
	},
	unloadDebuggerCss:function(){
		var styleTags = document.getElementById(this._g_ids.debugger_css);
		var head = document.getElementsByTagName('head')[0];
		head.removeChild(styleTags);
		delete styleTags;
	},

	//create color text
	colorizeInput:function   (strGiven,   strColor){
		var oFont = appendElement('font');
		if(this._g_isIE){
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
		while(oTable.nodeType == 1 && oTable.tagName != 'TABLE'){
			oTable = oTable.parentNode;
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
		while(oTR.nodeType == 1 && oTR.tagName != 'TR'){
			oTR = oTR.parentNode;
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
				//alert(arguments[i+1]);
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
		if(this._g_isIE){
			var trng = document.body.createTextRange();
			trng.moveToElementText(obj);
			trng.scrollIntoView();
			trng.select();
			trng.execCommand("Copy");
			//window.status="Contents highlighted and copied to clipboard!"
			//setTimeout("window.status=''",1800)
			trng.collapse(false);
			//window.clipboardData.setData('Text','something');
		}else{
			var trng = document.getSelection();
		}
	},
	svhtml:function(obj) {
		var srcwin = window.open('', null, 'top=10000');
		srcwin.document.open('text/html', 'replace');
		srcwin.document.writeln(obj.outerHTML);
		srcwin.document.execCommand('saveas','','code.htm');
		srcwin.close();
	},
	selectAll:function(obj){
		if(this._g_isIE){
			var trng = document.body.createTextRange();
			trng.moveToElementText(obj);
			trng.scrollIntoView();
			trng.select();
			trng.collapse(false);
		}else{
			
		}
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
	bindEventListner:function(obj, evt, funcName, isDebuggerEventHandler){
		if(isDebuggerEventHandler){
			this._g_registedEventHandlers.push([obj, evt, funcName]);
		}
		if(window.addEventListener){ // Mozilla, Netscape, Firefox
			obj.addEventListener(evt.substring(2), funcName, false);
		} else { // IE
			obj.attachEvent(evt, funcName);
		}
	},
	releaseEventListner:function(obj, evt, funcName){
		if(window.addEventListener){ // Mozilla, Netscape, Firefox
			obj.removeEventListener(evt.substring(2), funcName, false);
		} else { // IE
			obj.detachEvent(evt, funcName);
		}
	},
	stopBubble:function(e) {
		if ( e && e.stopPropagation ){
			e.stopPropagation();
		}else{
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
			if(this.father._g_isIE){
				if(!this.father._g_eval('typeof(' + args + ') == \'function\'')){
					this.father.showoutput('arguments ' + args + ' looks not like a function', false, this.father.colors.ERROR);
					return false;
				}
			}else{
				if(!window.eval('typeof(' + args + ') == \'function\'')){
					this.father.showoutput('arguments ' + args + ' looks not like a function', false, this.father.colors.ERROR);
					return false;
				}
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
				if(this.father._g_isIE){
					this.father._g_eval('window.' + args.replace(/\./g, '_') + '_bak = ' + args + ';' + cmdSource);
				}else{
					window.eval('window.' + args.replace(/\./g, '_') + '_bak = ' + args + ';' + cmdSource);
				}
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

			' caller:\" + ' + args[1] + '.caller)) {';
			if(this.father._g_isIE){
				cmdSource += '        oDebugger._g_eval(cmd);';
			}else{
				cmdSource += '        window.eval(cmd);';
			}
			cmdSource += '    }' +
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
			' debugger;';
			if(this.father._g_isIE){
				cmdSource += ' oDebugger._g_eval(cmd);';
			}else{
				cmdSource += ' window.eval(cmd);';
			}
			cmdSource += '};';
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
				if(args.length < 2){
					this.father.showoutput('ERROR: bc command requires a numeric argument.', false, this.father.colors.ERROR);
					return;
				}
				args = parseInt(args[1]);
				if(!args && args != 0){
					this.father.showoutput('ERROR: bc command requires a numeric argument.', false, this.father.colors.ERROR);
					return;
				}
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
				if(this.father._g_isIE){
					this.father._g_eval(funcName + " = window." + funcName.replace(/\./g, '_') + '_bak');
				}else{
					window.eval(funcName + " = window." + funcName.replace(/\./g, '_') + '_bak');
				}
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
			this._g_lastMouseObject = null;
		}
	},
	showTopContent:function(args){
		if(args){
			this.DebuggerWin.$('debugger_contentTopDiv').style.display = 'block';
			this.DebuggerWin.$('DebuggerOutput').style.height = '50%';
			if(this._g_specialMode.debug){
				if(this._g_isIE){
					this.DebuggerWin.$('debugger_contentTopDiv').designMode = false;
				}else{
					this.DebuggerWin.$('debugger_contentTopDiv').contenteditable = false;
				}
			}
			if(this._g_specialMode.inject){
				if(this._g_isIE){
					this.DebuggerWin.$('debugger_contentTopDiv').designMode = true;
				}else{
					this.DebuggerWin.$('debugger_contentTopDiv').contenteditable = true;
				}
				this.DebuggerWin.$('debugger_contentTopDiv').focus();
			}
		}else{
			this.DebuggerWin.$('debugger_contentTopDiv').style.display = 'none';
			this.DebuggerWin.$('DebuggerOutput').style.height = '';
		}
	},
	injectSth:function(args){
		switch(args){
			case 'js':
				var script = document.createElement('script');
				if(this._g_isIE){
					script.text = this.DebuggerWin.$('debugger_contentTopDiv').innerText; 
				}else{
					script.innerHTML = this.DebuggerWin.$('debugger_contentTopDiv').textContent
				}
				script.type = 'text/javascript';
				script.id = 'injectedScripts';
				this.pHead.appendChild(script);
				break;
			default:
				return false;
				break;
		}
		return true;
	},
	/*
	*################################################################################################################################################
	*Run debugger commands
	*################################################################################################################################################
	*/
	dealOtherMode:function(obj){
		if(this._g_specialMode.getInput){
			return this.getInput(obj);
		}else{
			
		}
	},
	//run debugger commands // deal commands
	runCommand:function (obj){

		this.showoutput('COMMAND:', true, this.colors.COMMAND);
		this.showoutput(obj, false);
		if(this.userDefineCommand(obj)){try{this.DebuggerWin.$('debuggerCommand').value = '';return;}catch(e){return;}}
		if(this._g_specialMode.inject){
			if(this.dealInjectSth(obj)){
				return;
			}
		}
		if(!this._g_specialMode.execMode){return this.dealOtherMode();}
		try{
			this.showoutput('RETURN: ', true, this.colors.COMMAND);
			//this._g_returnValue = this._g_eval(obj);
			if(this._g_isIE){
				this._g_returnValue = this._g_eval(obj);//execScript
			}else{
				this._g_returnValue = window.eval(obj);
			}
			this.showoutput(this._g_returnValue, false, this.colors.TIP);
		}catch(e){
			if(this._g_isIE){
				this._g_returnValue = e.description;
				this.showoutput(e.description, false, this.colors.ERROR);
			}else{
				this._g_returnValue = e;
				this.showoutput(e, false, this.colors.ERROR);
			}
		}
	},
	getInput:function (obj){
		//this.$('debuggerCommand')._commandHistory.pop();
		//this.$('debuggerCommand')._commandHistory.unshift(this.$('debuggerCommand').value);

		this.showoutput('ANSWER:', true, this.colors.COMMAND);
		this.showoutput(obj.value, false);
		this._g_returnValue = obj.value;
		this.DebuggerWin.$('debuggerCommand').value = '';
		return this._g_returnValue;
	},
	dealInjectSth:function(args){
		var _args = args.split(" ");
		switch(_args[0]){
			case 'inject':
				this.injectSth(_args[1]);
				break;
			default:
				return false;
				break;
		}
		return true;
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
				this.DebuggerWin.$('DebuggerOutput').innerHTML = '';
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
			case 'debug':
				this._g_specialMode.debug = !this._g_specialMode.debug;
				this.showTopContent(this._g_specialMode.debug);
				break;
			case 'inject':
				this._g_specialMode.inject = !this._g_specialMode.inject;
				this._g_cmdFocus = !this._g_specialMode.inject;
				this.showTopContent(this._g_specialMode.inject);
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
			'M(obj) show methods or properties in obj<br/>' +
			'P(obj) or V(obj) to view obj property or value<br/>' +
			'L(obj) to list ListObject property value<br/>' +
			'l(Arrays) to list Arrays contents value<br/>' +
			'mode keycode to toggle show keyCode status<br/>' +
			'mode mousepos to toggle show mouse (x,y) pos<br/>' +
			'mode select to toggle onoff focus inputCommand<br/>' +
			'mode inspect to toggle status to inspect object which under mouse<br/>' +
			'mode inject to toggle status of inject mode<br/>' +
			'exit to exit debugger<br/>' +
			'$toHex to convert number to Hex datas<br/>' +
			'Move your mouse on some area, and press F8 or F7 to see what happend ;=) It\'s not just fan, there\'s some details in output<br/>' +
			'ps: If you like it, you can use it like a caculator, just input numbers like \"1+2\" and press RETURN to see what happend! ;=) <br/>' +
			'If you like it, please let me know, my EMail:<a href="mailto:Jackey.King@gmail.com" style="cursor:pointer;"><span color=blue>Jackey.King@gmail.com<span></a><br/>' +
			'Javascript debugger ' + this.Version + '\nauthor:Jackey\nCopyRight (C) Jackey.King 2008\n'
			,false, this.colors.HELP);
	}
}

setTimeout(function(evt){oDebugger.showdebugger(true)}, 1000);

