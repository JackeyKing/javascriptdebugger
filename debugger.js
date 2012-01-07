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
* 为了照顾英语不好的人（就像我），再作一份中文的声明如下：)
* 作者: Jackey.King
* 任何人可以免费获得这个软件的拷贝以及相关文档
* 任何人可以再次修改、发布这个软件，但是必须包含声明前的文件头以及本声明和本声明下面的版权信息。
*
* 版权所有 (C) Jackey.King 邮箱:Jackey.King@gmail.com
*
* 如果你喜欢它，请让我知道
* 如果你修改了它，请发给我一份拷贝
* 如果你有好的建议, 那就不要吝啬你的手和键盘，让我知道这些建议吧
* 统统发到我邮箱就好了，这是我的邮箱： Jackey.King@gmail.com
*
* 上述版权声明和本许可的内容必须包含在所有的副本或基于本软件开发的软件中。
*
* 还有，谁能帮做一份使用手册或是说明文件吗？
*
* 项目主页: http://code.google.com/p/javascriptdebugger
*
*/
/*
*################################################################################################################################################
* Dynamic load debugger
*################################################################################################################################################
*/
/* for All BetaMethod
javascript:var head = document.getElementsByTagName("head")[0];var js = document.createElement("script");js.type="text/javascript";js.language="javascript";js.src = "http://javascriptdebugger.googlecode.com/files/debugger.js";head.appendChild(js);js.onload=function(){oDebugger.showdebugger(true)};alert('inject success!');
*/
/* for IE6 or IE7
javascript:var head = document.getElementsByTagName("head")[0];var js = document.createElement("script");js.type="text/javascript";js.language="javascript";js.src = "file:///javascriptdebugger/debugger.js";head.appendChild(js);alert('inject success!');
javascript:var head = document.getElementsByTagName("head")[0];var js = document.createElement("script");js.type="text/javascript";js.language="javascript";js.src = "file:///javascriptdebugger/debugger.js";head.appendChild(js);alert('inject success!');

for Firefox or IE7:

javascript:var head = document.getElementsByTagName("head")[0];var js = document.createElement("script");js.type="text/javascript";js.language="javascript";js.src = "file://C:/javascriptdebugger/debugger.js";head.appendChild(js);js.onload=function(){oDebugger.showdebugger(true)};alert('inject success!');

for IE via web download
javascript:var head = document.getElementsByTagName("head")[0];var js = document.createElement("script");js.type="text/javascript";js.language="javascript";js.src = "http://javascriptdebugger.googlecode.com/files/debugger.js";head.appendChild(js);alert('inject success!');
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
*v0.8 change display from div to iframe //2009-02-12 deep night
*v0.81 supporting iframe injection. //2009-02-13 deep in the night
*v0.82 Unified error output. Add regular expression validation. //2009-02-16
*v0.85 pin/unpin support. //2009-02-20
*v0.86 watch variables. //2009-02-23
*v0.861 add clone functions. //2009-08-14
*v0.87 solve window in pin close. //2009-08-14
*      corrected scrolling bug //2009-12-04
*v0.90 add Ajax class to solve/test something ;) It's a beta  //2009-12-04
*      corrected Ajax query bug //2009-12-07
*the next...
*will make a complex real debugger by open a modal window...
*v0.91	improving the function of 'mode inspect' //2011-11-21
*		fixed inject error in IE9
*/

var oDebugger = {
	Version: '0.91',
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
	_g_pinwinlastpos_x : -1,
	_g_pinwinlastpos_y : -1,
	_g_returnValue : null,
	_g_oDList : new Array(),	//eval can't create variables, however, we can use _g_oDList to save functions or variables
	//O : this.oDList, //make a shortcut ;=)
	_g_watchDatas: new Array(), //watch datas
	_g_watchIds: new Array(),
	_g_enableShowKeyCode : false,
	_g_enableShowMousePos : false,
	_g_enableShowMouseObject : false,
	_g_enableShowMouseObjectOutputMode: 0,  // -1: none, 0: detail(outerHTML), 1: tagName
	_g_lastMouseObject : null,
	_g_isExiting: false,
	_g_eventIsProcessed: false,
	_g_lastMouseObjectStyle:{
		border:'',
		borderLeft:'',
		borderRight:'',
		borderTop:'',
		borderBottom:'',
		borderStyle:'',
		borderColor:'',
		borderWidth:''
	},
	_g_EventShow:[
		'tagName',
		'clientTop',
		'offsetTop',
		'offsetLeft',
		'scrollLeft',
		'scrollTop',
		'STYLE',
		'style.position',
		'style.styleFloat'
	],
	_g_stopBubble: false,

	_g_breakpoints : new Array(),
	_g_eval: null,
	funcName : /^[a-zA-Z0-9_.]+$/i,

	_g_isIE:((document.all)?true:false),
	_g_isZh:(/zh/ig.test(navigator.userLanguage)),

	_g_registedVariables:[],
	_g_registedEventHandlers:[],
	_g_registedGarbage:[],
	
	_g_pinStatus: false,

	_g_ids:{
		debugger_id:'id_g_oDebugger',
		debugger_css:'id_g_debugger_css'
	},
	_g_specialMode:{
		debug:false,
		inject:false,
		execMode:true,
		getInput:false,
		regex: false
	},

	debuggerStr : "<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.0 Transitional//EN'><HTML><HEAD><TITLE>oDebugger</TITLE><META NAME='Generator' CONTENT='EditPlus'><META NAME='Author' CONTENT='Jackey.King'><META NAME='Mail' CONTENT='Jackey.King@gmail.com'><META http-equiv='Content-Type' content='text/html; charset=UTF-8'> <style type='text/css'> *{ 	font-family: 宋体, simsun, Arial, Verdana, Times New Roman; 	font-size: 12px; 	margin:0; 	padding:0; 	scrollbar-3dlight-color: #AEB4CD;     scrollbar-arrow-color: #45423c;     scrollbar-base-color: #AEB4CD;     scrollbar-darkshadow-color: #AEB4CD;     scrollbar-face-color: #D9E0F6;     scrollbar-highlight-color: #AEB4CD;     scrollbar-shadow-color: #AEB4CD;     scrollbar-track-color: #445289;     scrollbar-arrow-color:#38342C; } BODY{ 	position: relative; 	background-color: white; 	/*filter: Alpha(Opacity = 50);*/ 	overflow: hidden; 	cursor: move; 	background-color: #F7F8FE; } #debugger_runCommand{ 	border-right: #2c59aa 1px solid; 	padding-right: 2px; 	border-top: #2c59aa 1px solid; 	padding-left: 2px; 	border-left: #2c59aa 1px solid; 	color: #445289; 	padding-top: 2px; 	border-bottom: #2c59aa 1px solid; 	cursor: pointer; 	height: 15px; 	width:49px; 	line-height: 5px; 	background-color: #E2E3E9; }  #debuggerCommand{ 	border-width: 1px; 	border-color: #abb9df; 	border-style: solid; 	background-color: #F2F3F9; 	width: 100%; }  #debuggerClientDiv{ 	border-width: 0px; 	width: 100%; 	height: 100%; 	position: relative; 	overflow:hidden; }  #DebuggerOutput{ 	border-width: 1px; 	border-color: #abb9df; 	border-style: solid; 	background-color: #F2F3F9; 	width: 100%; 	height: 100%; 	cursor: text; 	position: relative; 	overflow-x: auto; 	overflow-y: auto; 	scrollbar-3dlight-color: #AEB4CD;     scrollbar-arrow-color: #45423c;     scrollbar-base-color: #AEB4CD;     scrollbar-darkshadow-color: #AEB4CD;     scrollbar-face-color: #D9E0F6;     scrollbar-highlight-color: #AEB4CD;     scrollbar-shadow-color: #AEB4CD;     scrollbar-track-color: #445289;     scrollbar-arrow-color:#38342C; 	overflow-y:auto; 	word-break: break-all; }  #debugger_clearOutput{ 	border-right: #2c59aa 1px solid; 	padding-right: 2px; 	border-top: #2c59aa 1px solid; 	padding-left: 2px; 	font-size: 12px; 	color: #000000; 	border-left: #2c59aa 1px solid; 	color: #445289; 	padding-top: 2px; 	border-bottom: #2c59aa 1px solid; 	cursor: pointer; 	height: 15px; 	width:49px; 	line-height: 5px; 	background-color: #E2E3E9; }  #debuggerInfo{ 	width: 100%; 	border-width: 1px; 	border-color: #abb9df; 	border-style: solid; 	background-color: #F2F3F9; }  #debugger_hiddenBtn{ 	top: 0; 	right: 0; 	position: absolute; 	float: right; 	width: 10px; 	height: 10px; 	border-width: 1px; 	border-color: #abb9df; 	border-style: solid; 	background-color: #F2F3F9; 	cursor: pointer; 	text-align: center; }  #debugger_pinBtn{ 	top: 0; 	right: 15px; 	position: absolute; 	float: right; 	width: 10px; 	height: 10px; 	border-width: 1px; 	border-color: #abb9df; 	border-style: solid; 	background-color: #F2F3F9; 	cursor: pointer; 	text-align: center; }  #debugger_contentTopDivContainer{ 	top: 0px; 	left: 0px; 	border-width: 1px; 	border-color: #abb9df; 	border-style: solid; 	background-color: #F2F3F9; 	width: 100%; 	height: 50%; 	display: none; 	position: relative; }  #debugger_contentTopText{ 	top: 0px; 	left: 0px; 	border-width: 0px; 	background-color: #F2F3F9; 	width: 100%; 	height: 100%; 	position: relative; 	overflow-x: auto; 	overflow-y: auto; 	scrollbar-3dlight-color: #AEB4CD;     scrollbar-arrow-color: #45423c;     scrollbar-base-color: #AEB4CD;     scrollbar-darkshadow-color: #AEB4CD;     scrollbar-face-color: #D9E0F6;     scrollbar-highlight-color: #AEB4CD;     scrollbar-shadow-color: #AEB4CD;     scrollbar-track-color: #445289;     scrollbar-arrow-color:#38342C; }  #layoutTable{ 	width: 100%; 	height:100%; 	border:0; 	margin: 0; 	padding: 0; }  .MainMenu{ 	position: absolute; 	width: 160px; 	height: auto; 	display: none; 	background-color: #FFFFFF; 	filter: Alpha(Opacity = 75); 	overflow: hidden; 	cursor: pointer; 	font-size: 12px; }  .MainMenu LI{ 	padding: 0; 	margin: 0px 0px 0px 0px; 	border-top: 1px solid #CCCCCC; 	border-bottom: 1px solid #CCCCCC; 	list-style-type: none; 	height: auto; 	background-color: #CCCCCC; 	width: 100%; }  .MainMenu LI UL{ 	padding: 0; 	margin: 0px 1px 1px 10px; 	width: 100%; 	height: 24px; 	line-height: 24px; 	background-color: #FFFFFF; }  .MainMenu LI UL A{ 	padding: 0; 	margin: 0; 	text-decoration: none; 	display: block; 	width: 100%; 	height: 100%; }  .MainMenu LI UL A:hover{ 	background-color: #E8E8E8; } </style> <script type='text/javascript' language='javascript'> var Version = ''; var parentWin = window; var parentDebugger = window; var Debugger = window.document.body; var pBody = null; try{ 	if(top || window.dialogArguments){ 		parentWin = top || window.dialogArguments; 		parentDebugger = parentWin.oDebugger; 		pBody = parentWin.document.body; 		Debugger = parentWin.document.getElementById('id_g_oDebugger');/*top.frames.id_g_oDebugger;*/ 	} }catch(e){} var _g_mouseDownStatus = false; var _g_maxCommandHistory = 10; var _g_maxCommandStore = 10; var _g_lastpos_x = 0; var _g_lastpos_y = 0; var _g_cmdFocus = true; var _g_isExiting = false; var _g_isAltDown = false;  var lastMouseX = 0; var lastMouseY = 0;  var Menu = null; var SubMenu = null;  var colors = { 	ERROR: 'red', 	COMMAND:'blue', 	HELP:'#FF00FF', 	BACKGROUNDCOLOR:'#FFFF00', 	BACKGROUNDCOLOR_DEACTIVE:'#CCCCCC', 	TIP: 'red', 	MOUSETIP: 'blue', 	MENUBACKGROUNDCOLOR:'#FFFFFF', 	MENUCOLOR:'#CCCCCC', 	MENUOVER: '#E8E8E8' }; var alpha = { 	MENU: '75', 	BODY: '75' };  var _commandHistory = new Array(_g_maxCommandHistory); var _commandStore = new Array(_g_maxCommandStore); var _curCommandHistoryIndex = 0;  function $(objId){ 	return document.getElementById(objId); }  function clearOutput(){ 	$('DebuggerOutput').innerHTML=\'\'; } function prerunCommand(){ 	_commandHistory.pop(); 	_commandHistory.unshift(this.$('debuggerCommand').value); 	parentDebugger.runCommand($('debuggerCommand').value); }  function debuggerCommandOnKeyDown(evt){     try{ 	    if(parentDebugger._g_isExiting){return;} 	}catch(e){ 	    return; 	}; 	parentDebugger._g_eventIsProcessed = false; 	evt = evt || window.event; 	var keyCode = evt.keyCode || evt.which; 	var keycode; 	try{ 		if(keyCode){ 			keycode = keyCode; 		}else{ 			keycode = null; 		} 	}catch(e){} 	if(parentDebugger._g_enableShowKeyCode){ 		parentDebugger.showoutput(keycode, false, colors.ERROR); 	} 	if(evt.ctrlKey){ 		switch(keycode){ 			case 48: /*0*/ 			case 49: /*1*/ 			case 50: /*2*/ 			case 51: /*3*/ 			case 52: /*4*/ 			case 53: /*5*/ 			case 54: /*6*/ 			case 55: /*7*/ 			case 56: /*8*/ 			case 57: /*9*/ 				$('debuggerCommand').value = _commandHistory[Number(keycode) - 48]; 				parentDebugger._g_eventIsProcessed = true; 				break; 			case 38: /*up arrow*/ 				$('debuggerCommand').value = _commandHistory[_curCommandHistoryIndex]; 				_curCommandHistoryIndex += 1; 				if(_curCommandHistoryIndex > (_g_maxCommandHistory - 1)){ 					_curCommandHistoryIndex = 0; 				} 				parentDebugger._g_eventIsProcessed = true; 				break; 			case 40: /*down arrow*/ 				$('debuggerCommand').value = _commandHistory[_curCommandHistoryIndex]; 				_curCommandHistoryIndex -= 1; 				if(_curCommandHistoryIndex < 0){ 					_curCommandHistoryIndex = _g_maxCommandHistory - 1; 				} 				parentDebugger._g_eventIsProcessed = true; 				break; 			default: 				break; 		} 	} 	if(evt.altKey){ 		switch(keycode){ 			case 48: /*0*/ 			case 49: /*1*/ 			case 50: /*2*/ 			case 51: /*3*/ 			case 52: /*4*/ 			case 53: /*5*/ 			case 54: /*6*/ 			case 55: /*7*/ 			case 56: /*8*/ 			case 57: /*9*/ 				if(evt.altLeft){ 					$('debuggerCommand').value = _commandStore[Number(keycode) - 48]; 				}else{ 					_commandStore[Number(keycode) - 48] = $('debuggerCommand').value; 				} 				parentDebugger._g_eventIsProcessed = true; 				break; 			default: 				break; 		} 	} 	if(keycode == '13'){ 		prerunCommand(); 		parentDebugger._g_eventIsProcessed = true; 	} 	if(keycode == '27'){setTimeout(function(){$('debuggerCommand').value = \'\';},1);parentDebugger._g_eventIsProcessed = true;} /*ESC pressed*/ 	if(parentDebugger._g_eventIsProcessed){ 		stopBubble(evt); 	} }  function debuggerCommandOnKeyUp(evt){ 	parentDebugger._g_eventIsProcessed = false; 	if(parentDebugger._g_isExiting){return;} 	evt = evt || window.event; 	var keycode = evt.keyCode || evt.which; 	if(keycode == 17){	/*ctrl key up*/ 		_curCommandHistoryIndex = 0; 		parentDebugger._g_eventIsProcessed = true; 	} 	if(parentDebugger._g_eventIsProcessed){ 		stopBubble(evt); 	} }  function debuggerContentTopDivOnKeyDown(evt){ 	if(parentDebugger._g_isExiting){return;} 	evt = evt || window.event; 	var keycode = evt.keyCode || evt.which; 	if(keycode == 13){	/*Enter key down*/ 		if(parentDebugger._g_isIE){ 			var txtobj = document.selection.createRange(); 			txtobj.text == \'\'?txtobj.text='\\n':(document.selection.clear())&(txtobj.text='\\n'); 			document.selection.createRange().select(); 			stopBubble(evt); 			return false; 		}else{ 		} 	} }  function debuggerOnMouseDown(evt){ 	if(parentDebugger._g_isExiting){return;} 	_g_mouseDownStatus = true; 	evt = evt || window.event; 	var mouseX = (evt.pageX)?evt.pageX:evt.clientX; 	var mouseY = (evt.pageY)?evt.pageY:evt.clientY; 	lastMouseX = mouseX; 	lastMouseY = mouseY; }  function debuggerOnMouseUp(){ 	if(parentDebugger._g_isExiting){return;} 	_g_mouseDownStatus = false; 	if(_g_cmdFocus){ 		$('debuggerCommand').focus(); 	} }  function debuggerOnMouseMove(evt){     try{ 	    if(parentDebugger._g_isExiting){return;} 	}catch(e){ 	    return; 	}; 	if(_g_mouseDownStatus){ 		evt = evt || window.event; 		var mouseX = (evt.pageX)?evt.pageX:evt.clientX; 		var mouseY = (evt.pageY)?evt.pageY:evt.clientY; 		 		_g_lastpos_x = Debugger.style.left; 		_g_lastpos_y = Debugger.style.top; 		 		mouseX -= lastMouseX; 		mouseY -= lastMouseY; 		mouseX += parseInt(Debugger.style.left.replace('px',\'\')); 		mouseY += parseInt(Debugger.style.top.replace('px',\'\')); 		Debugger.style.left = mouseX; 		Debugger.style.top = mouseY; 	} }  function debuggerOnKeyDown(evt){ 	if(parentDebugger._g_isExiting){return;} 	evt = evt || window.event; 	if(evt.keyCode == parentDebugger.hotKey){ 		parentDebugger.showdebugger(parentDebugger.Debugger.style.display == 'none'?true:false); 	} 	if(evt.altKey){ 		$('debugger_hiddenBtn').style.cursor = 'move'; 		$('debuggerInfo').style.cursor = 'move'; 		$('debugger_clearOutput').style.cursor = 'move'; 		$('debugger_contentTopText').style.cursor = 'move'; 		$('DebuggerOutput').style.cursor = 'move'; 		$('debugger_runCommand').style.cursor = 'move'; 		_g_isAltDown = true; 	} }  function debuggerOnKeyUp(evt){ 	if(parentDebugger._g_isExiting){return;} 	evt = evt || window.event; 	if(_g_isAltDown){ 		$('debugger_hiddenBtn').style.cursor = ''; 		$('debuggerInfo').style.cursor = ''; 		$('debugger_clearOutput').style.cursor = ''; 		$('debugger_contentTopText').style.cursor = ''; 		$('DebuggerOutput').style.cursor = ''; 		$('debugger_runCommand').style.cursor = ''; 		_g_isAltDown = false; 	} }  function debuggerOnContextMenu(evt){ 	if(parentDebugger._g_isExiting){return;} 	evt = evt || window.event; 	var elem = (evt.target) ? evt.target : evt.srcElement; 	showMenu(evt, $('MainMenu'), true); 	stopBubble(evt); }  function debuggerOutputOnContextMenu(evt){ 	if(parentDebugger._g_isExiting){return;} 	evt = evt || window.event; 	var elem = (evt.target) ? evt.target : evt.srcElement; 	showMenu(evt, $('SubMenu'), true); 	stopBubble(evt); }  function debuggerClientDivOnMouseDown(evt){ 	if(parentDebugger._g_isExiting){return;} 	evt = evt || window.event; 	if(evt.altKey){ 	}else{ 		stopBubble(evt); 	} }  function setDebuggerStyle(){ 	try{ 		Debugger.style.position = 'absolute'; 		Debugger.style.width = '320px'; 		Debugger.style.height = '425px'; 		Debugger.style.filter = 'Alpha(Opacity = ' + alpha.BODY + ')'; 		Debugger.style.backgroundColor = color.BACKGROUNDCOLOR + ' '; 		Debugger.style.left = _g_lastpos_x; 		Debugger.style.top = _g_lastpos_y; 	}catch(e){} }  function stopBubble(e) { 	e = e || window.event; 	if ( e && e.stopPropagation ){ 		e.stopPropagation(); 	}else{ 		window.event.cancelBubble = true; 		window.event.returnValue = false; 	} }  function bindEventListner(obj, evt, funcName){ 	if(window.addEventListener){ 		obj.addEventListener(evt.substring(2), funcName, false); 	} else { 		obj.attachEvent(evt, funcName); 	} }  function showMenu(evt, obj, show){ 	if(show){ 		obj.style.top = (evt.pageY)?evt.pageY:evt.clientY; 		obj.style.left = (evt.pageX)?evt.pageX:evt.clientX; 		obj.style.display = 'block'; 	}else{ 		obj.style.display = 'none'; 	} }  function keepMenu(evt, obj, show){ 	obj.style.display = 'block'; }  function initEnv(){ 	try{ 		$('MainMenu').innerHTML = parentDebugger.menuStr; 		$('SubMenu').innerHTML = parentDebugger.subMenuStr; 		$('Version').innerHTML = parentDebugger.Version; 	}catch(e){} }  setTimeout(initEnv, 1); </script> </HEAD> <BODY onmousedown='debuggerOnMouseDown(event)' onmouseup='debuggerOnMouseUp(event)' onmousemove='debuggerOnMouseMove(event)' onkeydown='debuggerOnKeyDown(event)' onkeyup='debuggerOnKeyUp(event)' oncontextmenu='debuggerOnContextMenu(event)'> <span onclick='parentDebugger.dopin();' id='debugger_pinBtn'>un/pin</span> <span onclick='parentDebugger.showdebugger(false);' id='debugger_hiddenBtn'>x</span> <table cellpading='0' cellspacing='0' id='layoutTable'><tr><td colspan='2' style='height:16px;'> Debugger(Version:<span id='Version'></span>): </td></tr><tr><td style='height:16px;width:100%;'> <input type='text' id='debuggerInfo' /> </td><td style='height:16px;width:49px;'> <button onclick='clearOutput(event);' id='debugger_clearOutput' >clear</button> </td></tr><tr><td colspan='2'><div id='debuggerClientDiv' onmousedown='debuggerClientDivOnMouseDown(event)'><div id='debugger_contentTopDivContainer'><textarea id='debugger_contentTopText'></textarea></div><div id='DebuggerOutput' oncontextmenu='debuggerOutputOnContextMenu(event)'></div></div></td></tr><tr><td style='height:16px;'> <input type='text' id='debuggerCommand' onkeydown='debuggerCommandOnKeyDown(event)' onkeyup='debuggerCommandOnKeyUp(event)' onmousedown='stopBubble(event)'/> </td><td style='height:16px;width:49px;'> <button onclick='prerunCommand();' id='debugger_runCommand'>run</button> </td></tr></table> <div id='MainMenu' class='MainMenu' oncontextmenu='stopBubble(event)' onmouseover='keepMenu(event, this, true)' onmouseout='showMenu(event, this, false)' onclick='showMenu(event, this, false)'></div> <div id='SubMenu' class='MainMenu' oncontextmenu='stopBubble(event)' onmouseover='keepMenu(event, this, true)' onmouseout='showMenu(event, this, false)' onclick='showMenu(event, this, false)'></div> <script language='javascript' type='text/script'> </script> </BODY></HTML> ",
	menuStr : '<li>' +
		'<ul onclick="javascript:parentDebugger.showCurPageSource();"><a>View Page Source</a></ul>' +
		'<ul onclick="javascript:parentDebugger.inject2IFrame();"><a>Inject to IFrames</a></ul>' +
		'<ul onclick="javascript:parentDebugger.showHelp();"><a>Help</a></ul>' +
		'<ul onclick="javascript:parentDebugger.showAbout();"><a>About</a></ul>' +
		'</li>',
	subMenuStr : '<li>' +
		'<ul onclick="javascript:parentDebugger.selectAll($(\'DebuggerOutput\'));"><a>Select All</a></ul>' +
		'<ul onclick="javascript:parentDebugger.copy($(\'DebuggerOutput\'));"><a>Copy</a></ul>' +
		'</li>',

	colors: {
		ERROR: 'red',
		WARNNING: 'red',
		COMMAND:'blue',
		HELP:'#FF00FF',
		BACKGROUNDCOLOR:'#FFFF00',
		BACKGROUNDCOLOR_DEACTIVE:'#CCCCCC',
		TIP: 'red',
		MOUSETIP: 'blue'
	},
	alpha: {
		BODY: '75'
	},
	funcKey: {
		F12: 123,
		F11: 122,
		F10: 121,
		F9: 120,
		F8: 119,
		F7: 118,
		F6: 117,
		F5: 116,
		F4: 115,
		F3: 114,
		F2: 113,
		F1: 112
	},
	hotKey: 123,
	/*
	*################################################################################################################################################
	*Debug method You can add your debugger code below ;=)
	*################################################################################################################################################
	*/
	tm:function (evt){
		var str = '<html><head><script language="javascript" type="text/javascript">function setRet(){window.returnValue="1";alert(window.returnValue);}</script></head><body><input type="button" value="setRet" onclick="setRet()"/><textarea id="text1" style="width:80%;height:100%;">window.dialogArguments</textarea><input type="button" value="eval" onclick="eval(document.getElementById(\'text1\').value)"/></body></html>';
		var newWinP = null;
		var newWin = null;
		var x = -1;
		var y = -1;
		if(this._g_isIE){
			if(x == -1 && y == -1){
				x = parseInt(window.screen.availWidth) - 320;
				y = parseInt(window.screen.availHeight) - 425;
			}
			newWin = showModelessDialog('about', window, 'dialogLeft:' + x + ';dialogTop:' + y + ';dialogWidth:320px;dialogHeight:425px;center:no;resizable:yes;status:no;scroll:no;help:no;edge:raised;', newWinP);
			newWin = newWinP || newWin;
		}else{
			newWin = window.open('about');
		}
		newWin.document.writeln(str);
		newWin.document.close();

		return 'ok';
	},
	t:function (){
		var str = 'file:///c:/javascriptdebugger/t.html';
		var ret1 = '';
		var ret = showModalDialog(str, window, 'dialogWidth:800px;dialogHeight:600px;center:yes;resizable:yes;', ret1);
		//var ret = showModalDialog('about:<iframe name=iframe1 width=100% height=100% scrollingyes frameborder=0 src="' + str + '" /></iframe>', window, 'dialogWidth:800px;dialogHeight:600px;center:yes;resizable:yes;', ret1);
		//alert(ret);
	},
	tt:function (){
		var str = '\'<html><head><script language="javascript" type="text/javascript">function setRet(){window.returnValue="1";alert(window.returnValue);}</script></head><body><input type="button" value="setRet" onclick="setRet()"/><textarea id="text1" style="width:80%;height:100%;"></textarea><input type="button" value="eval" onclick="eval(document.getElementById(\\\'text1\\\').value)"/></body></html>\'';
		//var ret = showModalDialog('javascript:document.write(\''+ document.documentElement.outerHTML.replace(document.getElementById('text1').innerHTML, '').replace(/\'/g, '\\\'') +'\')',window);
		///var str = '\'<script language="javascript" type="text/javascript">function setRet(){window.returnValue="1";alert(window.returnValue);}</script><input type="button" value="setRet" onclick="setRet()"/><textarea id="text1" style="width:80%;height:100%;">window.dialogArguments</textarea><input type="button" value="eval" onclick="eval(document.getElementById(\\\'text1\\\').value)"/>\'';
		var ret1 = '';
		var ret = showModalDialog('javascript:document.write(' + str + ')',window, ret1);
		//var ret = showModalDialog("javascript:window.returnValue = '1';alert(window.returnValue);", window, 'dialogWidth:800px;dialogHeight:600px;center:yes;resizable:yes;', ret1);
		//var ret = showModalDialog("javascript:var body = window.document.createElement('BODY');body.innerHTML=" + str + ";window.document.appendChild(body);", window, 'dialogWidth:800px;dialogHeight:600px;center:yes;resizable:yes;', ret1);
		///var ret = showModalessDialog("javascript:var body = window.document.createElement('BODY');body.innerHTML=" + str + ";window.document.appendChild(body);", window, 'dialogWidth:800px;dialogHeight:600px;center:yes;resizable:yes;', ret1);
		alert(ret);
		alert(ret1);
	},
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
			for( var i = 0; i < this._g_EventShow.length; i++){
				try{
					this.showoutput(this._g_EventShow[i] + ':' + this._g_eval('args.' + this._g_EventShow[i]), false);
				}catch(e){
					this.showoutput('Error occure on deal with: ' + this._g_EventShow[i], false);
					this.showoutput(e, false);
					this._g_EventShow.splice(i, 1);
				}
			}
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
	changeBorder:function (obj, args){
		if(this._g_lastMouseObject != null){
			//restore
			this._g_lastMouseObject.style.borderStyle = this._g_lastMouseObjectStyle.borderStyle;
			this._g_lastMouseObject.style.borderColor = this._g_lastMouseObjectStyle.borderColor;
			this._g_lastMouseObject.style.borderWidth = this._g_lastMouseObjectStyle.borderWidth;
		}
		if(this._g_lastMouseObject == obj){
			return;
		}
		this._g_lastMouseObject = obj;
		this._g_returnValue = obj;
		//backup
		this._g_lastMouseObjectStyle.borderStyle = obj.style.borderStyle;
		this._g_lastMouseObjectStyle.borderColor = obj.style.borderColor;
		this._g_lastMouseObjectStyle.borderWidth = obj.style.borderWidth;
		//set
		obj.style.borderStyle = 'solid';
		obj.style.borderColor = this.colors.MOUSETIP;
		obj.style.borderWidth = '2px';
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
	timerChangeBorder:function (obj, args){
		oDebugger.showoutput('Timer begin...', false);
		if(!obj){
			oDebugger.showoutput('Timer end with obj error!', fasle);
			return;
		}
		if(oDebugger._g_lastMouseObject != null){
			//resotre
			oDebugger._g_lastMouseObject.style.borderStyle = oDebugger._g_lastMouseObjectStyle.borderStyle;
			oDebugger._g_lastMouseObject.style.borderColor = oDebugger._g_lastMouseObjectStyle.borderColor;
			oDebugger._g_lastMouseObject.style.borderWidth = oDebugger._g_lastMouseObjectStyle.borderWidth;
		}
		oDebugger._g_lastMouseObject = obj;
		//oDebugger._g_returnValue.push(obj);
		//backup
		oDebugger._g_lastMouseObjectStyle.borderStyle = obj.style.borderStyle;
		oDebugger._g_lastMouseObjectStyle.borderColor = obj.style.borderColor;
		oDebugger._g_lastMouseObjectStyle.borderWidth = obj.style.borderWidth;
		
		oDebugger.showdetails(obj, args);
		//set
		obj.style.borderStyle = 'solid';
		obj.style.borderColor = this.colors.MOUSETIP;
		obj.style.borderWidth = '2px';
		oDebugger._g_lastMouseObject = obj;
		if(obj.parentNode && obj.parentNode.nodeType == 1){//if(obj.parentElement){
			setTimeout(function(evt){
					evt = (evt) ? evt : ((window.event) ? window.event : "");
					oDebugger.timerChangeBorder(oDebugger._g_lastMouseObject.parentNode);}, 900);
			return;
		}
		//restore
		if(oDebugger._g_lastMouseObject != null){
			oDebugger._g_lastMouseObject.style.borderStyle = oDebugger._g_lastMouseObjectStyle.borderStyle;
			oDebugger._g_lastMouseObject.style.borderColor = oDebugger._g_lastMouseObjectStyle.borderColor;
			oDebugger._g_lastMouseObject.style.borderWidth = oDebugger._g_lastMouseObjectStyle.borderWidth;
			oDebugger._g_lastMouseObject = null;
		}
		oDebugger.showoutput('Timer end...', false);
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
					oDebugger.showError(e);
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
		oDebugger.showoutput('Length:' + obj.length , false);
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

	watchVariable:function (Ids){//obj, timerCount){
		var obj = '';
		var property = this._g_watchDatas[Ids][3];
		//if(typeof(this._g_watchDatas[Ids][1]) == 'string'){
		//}
		if(property == ''){
			if(this._g_isIE){
				obj = this._g_eval(this._g_watchDatas[Ids][1]);
			}else{
				obj = window.eval(this._g_watchDatas[Ids][1]);
			}
		}else{
			if(this._g_isIE){
				obj = this._g_eval('document.getElementById("' + this._g_watchDatas[Ids][1] + '").' + property);
			}else{
				obj = window.eval('document.getElementById("' + this._g_watchDatas[Ids][1] + '").' + property);
			}
		}
		if(obj == this._g_watchDatas[Ids][2]){
			//this.showoutput('nochange', false);
			return;
		}
		this.showoutput('WATCH ' + Ids + ': ', true, this.colors.TIP);
		this.showoutput(this._g_watchDatas[Ids][2], true);
		this.showoutput(' to ', true, this.colors.TIP);
		this.showoutput(obj, false);//this._g_watchDatas[Ids][1], false);
		this._g_watchDatas[Ids][2] = obj;//this._g_watchDatas[Ids][1] + '';
		return;
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
		if(this.watch.caller != this.showMode){
			this.showoutput('Watch must be called by: mode watch (something to be watched)', false);
			return true;
		}
		if(timerCount && timerCount > 0){
		}else{
			timerCount = 100;
		}
		var Ids = this._g_watchDatas.length;
		var property = '';
		var objOldValue = '';
		if(typeof(obj) == 'string'){
			if(obj.indexOf('od.T') != -1){
				if(!this._g_isIE){
					this.showoutput('IE only!', false);
					return true;
				}
				property = obj.replace('od.T.', '');
				obj = od.T;
				objOldValue = this._g_eval('document.getElementById("' + obj.uniqueID + '").' + property);
			}else{
				if(this._g_isIE){
					objOldValue = this._g_eval(obj + '');
				}else{
					objOldValue = window.eval(obj + '');
				}
			}
		}else{
			objOldValue = obj + '';
		}
		var id = setInterval(function(){oDebugger.watchVariable(Ids);}, timerCount);
		if(typeof(obj) == 'string'){
			this._g_watchDatas.push([id, obj, objOldValue, property]);
		}else{
			this._g_watchDatas.push([id, obj.uniqueID, objOldValue, property]);
		}
		//this.showoutput('Add watch: ' + objOldValue, false);
		return 'Add watch: ' + objOldValue;
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
	listWatch:function(){
		for(var i = 0; i < this._g_watchDatas.length; i ++){
			this.showoutput(i + ': ' + this._g_watchDatas[i][1], false);
		}
		return true;
	},
	clearWatch:function(args){
		if(args != 0 && (!args || args == '*')){
			for(var i = 0; i < this._g_watchDatas.length; i++){
				clearInterval(this._g_watchDatas[i][0]);
			}
			this._g_watchDatas = new Array();
			return 'cleared All!';
		}
		clearInterval(this._g_watchDatas[args][0]);
		return this._g_watchDatas[args][1] + ' was deleted!';
		//this.showoutput(this._g_watchDatas[args][1] + ' was deleted!', false);
		//return this._g_watchDatas.splice(args, 1) + ' was deleted!';
	},
	getObjHTML:function(obj){
		var curObj = document.documentElement;
		if(arguments.length > 0 && obj){
			curObj = obj;
		}
		return curObj.outerHTML;
	},
	cloneCurPageSource:function(obj){
		var srcwin = window.open('', '', '');
		srcwin.opener = null;
		srcwin.document.write(this.getObjHTML(obj).replace(this.Debugger.outerHTML, ''));
		srcwin.document.close();
	},
	cloneObjSourceById:function(objId){
		var srcwin = window.open('', '', '');
		srcwin.opener = null;
		srcwin.document.write(this.getObjHTML(this.$(objId)).replace(this.Debugger.outerHTML, ''));
		srcwin.document.close();
	},
	removeODebuggerCode:function(args){
		//args.replace(//gi, '');
		//return args;
		if(this._g_isIE){
			return args.replace(String(this.Debugger.outerHTML), '');
			//return args.replace(/\<iframe id\=id_g_oDebugger[\s\S]*?\<\/iframe\>/ig, '');
			//return args.replace(/<div([a-z0-9\'\"\=]??)startX(?:[^(<div)])<\/div>/img, '');
		}else{
			return args.replace(String(this.Debugger.outerHTML), '');
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
	injectDebugger:function(obj, src){
		var head = obj.document.getElementsByTagName("head")[0];
		var js = obj.document.createElement("script");
		//js.type="text/javascript";
		js.language="javascript";
		if(arguments.length > 1){
			js.src = src;
		}else{
			js.src = "file:///javascriptdebugger/debugger.js";
		}
		head.appendChild(js);alert('inject success!');
	},
	inject2IFrame:function(){
		if(window.frames.length < 1){
			return 'Frame do not seem to exist here!';
		}
		var promptTip = '';
		var frameCheck = document.getElementsByTagName('IFRAME');
		for(var i = 0; i < frameCheck.length; i++){
			promptTip += '[' + i + ':id=' + frameCheck[i].id + ',name=' + frameCheck[i].name + ']\n';
		}
		var retVal = prompt('pls sel a iframe(need Num):' + promptTip, '0');
		if(retVal == null){
			return 'You do not select any iframe.';
		}else if(/^\d+$/.test(retVal) || /\D+/g.test(retVal)){
			this.showoutput('Trying to inject to iframe[' + retVal + ']...', false);
			this.loadDebuggerJs(window.frames[retVal]);
			return 'Injected Successful!';
		}else{
			return 'Nothing matched.';
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
		this._g_isIE7 = /msie\s+7/i.test(navigator.userAgent);
		this._g_isIE6 = /msie\s+6/i.test(navigator.userAgent);
		this._g_isFirefox = /firefox/i.test(navigator.userAgent);
		this._g_isChrome = /Chrome/i.test(navigator.userAgent);

		window.onerror = this.catchError;
		
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
		this.Debugger.style.width = '0';
		this.Debugger.style.height = '0';
		this.Debugger.id = this._g_ids.debugger_id;
		this.Debugger.name = this._g_ids.debugger_id;
		this.pBody.appendChild(this.Debugger);
		window.frames[this._g_ids.debugger_id].document.writeln(this.debuggerStr);
		window.frames[this._g_ids.debugger_id].document.close();
		this.DebuggerPageWin = window.frames[this._g_ids.debugger_id];
		this.DebuggerPinWin = null;
		this.DebuggerWin = this.DebuggerPageWin;
		window.frames[this._g_ids.debugger_id].parentDebugger = oDebugger;
		window.frames[this._g_ids.debugger_id].parentWin = window;
		window.frames[this._g_ids.debugger_id].Debugger = this.Debugger;
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
		this.out = this.showoutput;
		//this.T = this._g_targetObj; //T -> target
		//Attach EVENTs
		//keyCode 123 = F12
		//keyCode 118 , 119 = F7, F8
		this.bindEventListner(
			(this._g_isIE)?this.pBody:window, 'onkeydown',
			function(evt){
				evt = (evt) ? evt : ((window.event) ? window.event : "");
				var keycode = evt.keyCode || evt.which;
				if(keycode==oDebugger.hotKey){if(oDebugger._g_pinStatus){oDebugger.dopin();return;};oDebugger.showdebugger(oDebugger.Debugger.style.display == 'none'?true:false);try{oDebugger.DebuggerWin.$('debuggerCommand').focus();}catch(e){}}
				if(keycode=='118'){oDebugger._g_returnValue = [];oDebugger.timerChangeBorder(oDebugger._g_targetObj);}//timerChangeBackColor(oDebugger._g_targetObj);}
				if(keycode=='119' && oDebugger._g_targetObj != null){oDebugger.changeBorder(oDebugger._g_targetObj);oDebugger.showdetails(oDebugger._g_targetObj);}
				if(oDebugger._g_stopBubble){
					oDebugger.stopBubble(evt);
				}
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
			this.showoutput('Warnning: ' + objName + ' is defined!', false, this.colors.WARNNING);
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
			//this.showoutput('Warnning: $ is defined!', false, this.colors.WARNNING);
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
			oD = oD;
			//if(oD == 'undefine');
			//this.showoutput('Warnning: oD is defined!', false, 'red');
			errorStr = errorStr + 'Warnning: oD is defined!' + '<br/>';
		}catch(e){
			oD = oDebugger;
			this._g_registedVariables.push('oD');
		}
		
		try{
			od = od;
			//if(od){od = od;}
			//if(od == 'undefine');
			//this.showoutput('Warnning: od is defined!', false, 'red');
			errorStr = errorStr + 'Warnning: od is defined!' + '<br/>';
		}catch(e){
			od = oDebugger;
			this._g_registedVariables.push('od');
		}

		this.showoutput(errorStr, false, this.colors.WARNNING);
	},

	showdebugger:function (args){
		if(!this._g_isDR){
			if(!this.initdebugger()){
			}
		}else if(this.Debugger){
			this.Debugger.style.display=args?'block':'none';
		}
		try{
			this.DebuggerWin.$('debuggerCommand').focus();
		}catch(e){}
	},
	onExit:function(){
		this._g_isExiting = true;
		this.clearWatch();
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
		this.pBody.removeChild(this.Debugger);
		this.unloadDebuggerJS();
		//this.unloadDebuggerCss();
		if(this._g_pinStatus){
			this.DebuggerPinWin.close();
			this.DebuggerPinWin = null;
			this._g_pinStatus = false;
		}
		
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
	showError:function(e){
		this.showoutput('ERROR:', true, this.colors.ERROR);
		if(this._g_isIE){
			this.showoutput(e.description, false, this.colors.ERROR);
			return e.description;
		}else{
			this.showoutput(e, false, this.colors.ERROR);
			return e;
		}
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
		this.DebuggerWin.$('DebuggerOutput').style.overflowY = 'auto';
		this.DebuggerWin.$('DebuggerOutput').style.height = '375px';
		if(!this._g_isIE){
			this.DebuggerWin.$('debuggerClientDiv').style.height = '375px';
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
				this.showError(e);
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
				this.showError(e);
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
				this.showError(e);
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
				this.showError(e);
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
				this.showError(e);
			}
			newObj.className = arguments[2];
			return newObj;
		}

		if(arguments.length == 2 && typeof(arguments[0]) == 'string' && typeof(arguments[1]) == 'string'){
			var newObj = document.createElement(arguments[0]);
			try{
			newObj.innerHTML = arguments[1];
			}catch(e){
				this.showError(e);
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
	//	script.type = 'text/javascript';
		head.appendChild(script);
	},
	loadJs:function (file, args){
			   debugger;
		 var scriptTag = document.getElementById('loadScript');
		 var head = window.document.getElementsByTagName('head').item(0);
		 if(scriptTag) {
			head.removeChild(scriptTag);
		 }
		 script = document.createElement('script');
		 this.bindEventListner(script, 'onload', function(evt){try{evt = (evt) ? evt : ((window.event) ? window.event : "");var elem = (evt.target) ? evt.target : evt.srcElement; oDebugger.showoutput(elem.src + 'js have been loaded', false);}catch(e){}});
		 script.src = ""+file; 
		 script.type = 'text/javascript';
		 script.id = 'loadScript';
		 if(arguments.length > 1){
			 if(args){
				 for(var i in args){
					 var c = '' + i;
					 c = c.toLowerCase();
					try{
						switch(c){
							case 'charset':
								script.charset = args[i];
								this.showoutput('Set charset ' + args[i], false);
								break;
							default:
								break;
						}
					}catch(e){
						this.showoutput(e.description, false, this.colors.ERROR);
					}
				 }
			 }
		 }
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
			var trng = this.DebuggerWin.document.body.createTextRange();
			trng.moveToElementText(obj);
			trng.scrollIntoView();
			trng.select();
			trng.execCommand("Copy");
			//window.status="Contents highlighted and copied to clipboard!"
			//setTimeout("window.status=''",1800)
			trng.collapse(false);
			//window.clipboardData.setData('Text','something');
		}else{
			var trng = this.DebuggerWin.document.getSelection();
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
			var trng = this.DebuggerWin.document.body.createTextRange();
			trng.moveToElementText(obj);
			trng.scrollIntoView();
			trng.select();
			trng.collapse(false);
		}else{
			
		}
	},
	removeClassName:function(elem, className){
		elem.className = this.trim(elem.className.replace(className, ''));
	},
	addClassName:function(elem, className){
		this.removeClassName (elem, className);
		elem.className = this.trim((elem.className + ' ' + className));
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
			//e.preventDefault();
		}else{
			window.event.cancelBubble = true;
			window.event.returnValue = false;
		}
	},
	htmlEncode:function(args) {
		var s = args;
		if(s.prototype != String){
			s = s + '';
		}
		s = s.replace(/\&/g, '&amp;');
		s = s.replace(/\</g, '&lt;');
		s = s.replace(/\>/g, '&gt;');
		s = s.replace(/\"/g, '&quot;');
		return s;
	},
	dopin:function (evt){
		if(this._g_pinStatus){
			this.DebuggerWin = this.DebuggerPageWin;
			this.showdebugger(true);
			this.DebuggerPageWin.$('DebuggerOutput').innerHTML = this.DebuggerPinWin.$('DebuggerOutput').innerHTML;
			this.DebuggerPageWin.$('DebuggerOutput').style.height= this.DebuggerPinWin.$('DebuggerOutput').style.height;
			this.DebuggerPageWin.$('debugger_contentTopDivContainer').innerHTML = this.DebuggerPinWin.$('debugger_contentTopDivContainer').innerHTML;
			this.DebuggerPageWin.$('debugger_contentTopDivContainer').style.display = this.DebuggerPinWin.$('debugger_contentTopDivContainer').style.display;
			this.DebuggerPageWin.$('debugger_contentTopDivContainer').style.height= this.DebuggerPinWin.$('debugger_contentTopDivContainer').style.height;
			this.DebuggerPageWin.$('debuggerCommand').value = this.DebuggerPinWin.$('debuggerCommand').value;
			this.DebuggerPageWin.$('DebuggerOutput').scrollTop = this.DebuggerPinWin.$('DebuggerOutput').scrollTop;
			this.DebuggerPageWin._commandHistory = this.DebuggerPinWin._commandHistory;
			this.DebuggerPageWin._commandStore = this.DebuggerPinWin._commandStore;
			this.DebuggerPageWin._curCommandHistoryIndex = this.DebuggerPinWin._curCommandHistoryIndex;
			if(this._g_isIE){
				this._g_pinwinlastpos_x = this.DebuggerPinWin.screenLeft;
				this._g_pinwinlastpos_y = this.DebuggerPinWin.screenTop;
			}else{
				this._g_pinwinlastpos_x = this.DebuggerPinWin.screenX;
				this._g_pinwinlastpos_y = this.DebuggerPinWin.screenY;
			}
			this.DebuggerPinWin.close();
			this.DebuggerPinWin = null;
			this._g_pinStatus = false;
			return 'unpin';
		}
		if(evt) return;
		if(!this._g_isIE){
			this.showoutput('Warnning:', true, this.colors.WARNNING);
			//this.showoutput('The current function does not support browsers other than IE.', false);
			this.showoutput('Apart from the current function of a browser other than IE support and not good enough.', false);
			//return 'Not supported.';
		}
		this.showdebugger(false);
		var newWinP = null;
		var newWin = null;
		var x = this._g_pinwinlastpos_x;
		var y = this._g_pinwinlastpos_y;
		if(x == -1 && y == -1){
			x = parseInt(window.screen.availWidth) - 320;
			y = parseInt(window.screen.availHeight) - 425;
		}
		if(this._g_isIE){
			newWin = showModelessDialog('#', window, 'dialogLeft:' + x + 'px;dialogTop:' + y + 'px;dialogWidth:320px;dialogHeight:425px;center:no;resizable:yes;status:no;scroll:no;help:no;edge:raised;', newWinP);
			newWin = newWinP || newWin;
		}else{
			newWin = window.open('#', '', 'left=' + x + 'px,top=' + y + 'px,width=320px,height=425px,menubar=no,resizable=yes,scrollbars=no,status=no,titlebar=no,toolbar=no');
		}
		newWin.document.writeln(this.debuggerStr);
		newWin.document.close();

		newWin.parentWin = window;
		newWin.parentDebugger = newWin.parentWin.oDebugger;
		newWin.pBody = newWin.parentWin.document.body;
		newWin.Debugger = newWin.parentWin.document.getElementById('id_g_oDebugger');
		this.bindEventListner(newWin, 'onunload', function(evt){evt = evt || window.event;oDebugger.dopin(evt);});
		if(this._g_isIE){
			newWin.initEnv();
		}
		this.DebuggerPinWin = newWin;
		this.DebuggerPinWin.$('DebuggerOutput').innerHTML = this.DebuggerPageWin.$('DebuggerOutput').innerHTML;
		this.DebuggerPinWin.$('DebuggerOutput').style.height = this.DebuggerPageWin.$('DebuggerOutput').style.height;
		this.DebuggerPinWin.$('debugger_contentTopDivContainer').style.height = this.DebuggerPageWin.$('debugger_contentTopDivContainer').style.height;
		this.DebuggerPinWin.$('debugger_contentTopDivContainer').style.display = this.DebuggerPageWin.$('debugger_contentTopDivContainer').style.display;
		this.DebuggerPinWin.$('debugger_contentTopDivContainer').innerHTML = this.DebuggerPageWin.$('debugger_contentTopDivContainer').innerHTML;
		this.DebuggerPinWin.$('debuggerCommand').value = this.DebuggerPageWin.$('debuggerCommand').value;
		this.DebuggerPinWin.$('DebuggerOutput').scrollTop = this.DebuggerPageWin.$('DebuggerOutput').scrollTop;
		this.DebuggerPinWin._commandHistory = this.DebuggerPageWin._commandHistory;
		this.DebuggerPinWin._commandStore = this.DebuggerPageWin._commandStore;
		this.DebuggerPinWin._curCommandHistoryIndex = this.DebuggerPageWin._curCommandHistoryIndex;
		this.DebuggerWin = this.DebuggerPinWin;
		try{
			this.DebuggerWin.$('debuggerCommand').focus();
		}catch(e){}
		this._g_pinStatus = true;
		return 'pin';
	},
	clonePageObj:function (obj){
		if(!this._colonePageObj_deeploop) this._colonePageObj_deeploop = 1;
		if(this._colonePageObj_deeploop > 100) return obj;
		this._colonePageObj_deeploop += 1;
		if(obj == null || typeof(obj) != 'object')
			return obj;
		if (obj.constructor == Date)
			return new obj.constructor(obj.valueOf());
		
		var tmp = null;
		if(obj.constructor != undefined){
			tmp = new obj.constructor(); // changed (twice)
		}else if(obj.tagName != ''){
			tmp = document.createElement(obj.tagName);
		}else{
			tmp = new Object();
			//because it will clone all the object again and again in current page
			//it'll exhaust all the memory, so skip it
			//return;
		}
		for(var key in obj)
			tmp[key] = this.clonePageObj(obj[key]);
		return tmp;
	},
	clone:function (obj){
		if(obj == null || typeof(obj) != 'object')
			return obj;
		if (obj.constructor == Date)
			return new obj.constructor(obj.valueOf());

		var tmp = new obj.constructor(); // changed (twice)
		for(var key in obj)
			tmp[key] = this.clone(obj[key]);
		return tmp;
	},
	getCurTime:function(b)
	{
		var d = new Date();
		if(b){
			return d.toTimeString().substring(0, 8) + ' ' + d.getMilliseconds();
		}else{
			return d.toTimeString().substring(0, 8);
		}
	},
	Ajax:function (url, callbackFunc, method){
		try{
			if(!this.Ajax.init){
				this.Ajax.callback = callback;
				this.Ajax.init = true;
				this.Ajax.parent = this;
				this.Ajax.getRequest = getRequest;
			}
		}catch(e){this.showoutput(e.description, false, this.colors.ERROR);}
		if(arguments.length < 1 || !url){
			this.showoutput('Please give me a url', false, this.colors.ERROR);
			return false;
		}
		var request = getRequest();
		if(!request){
			this.showoutput('Create xmlHttpRequest Error', false, this.colors.ERROR);
			return false;
		}
		this.Ajax.httpRequest = request;
		if(method){
			if(method.toLowerCase() == 'post'){
				if(url.constructor == Object){
					request.open(method, url.action, true);
				}else if($(url).tagName == 'FORM'){
					request.open(method, $(url).action, true);
				}else{
					request.open(method, url, true);
				}
				request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			}else{
				request.open(method, url, true);
			}
		}else{
			request.open('GET', url, true);
		}
		this.Ajax.userCallBack = null;
		if(callbackFunc){
			this.Ajax.userCallBack = callbackFunc;
			if(callbackFunc == alert && this._g_isFirefox){
				this.showoutput("Warnning: alert in firefox doesn't work fine!", false, this.colors.ERROR);
			}
		}
		var callback = new CallBack(request, callbackFunc);
		//request.onreadystatechange = oDebugger.Ajax.callback;
		if(method && method.toLowerCase() == 'post'){
			request.setRequestHeader("Connection", "close");
			if(!oDebugger._g_isIE){
				request.overrideMimeType('text/html');
			}
			if((url.constructor == Object && url.tagName == 'FORM') || $(url).tagName == 'FORM'){
				var content = form2URIString(url);
				request.setRequestHeader("Content-Length",content.length);
				request.send(content);
			}else if(url){
				request.send(url);
			}else{
				request.send("");
			}
		}else{
			request.send(null);
		}
		return true;
		function getRequest(){
			var request = false;
			try{
				request = new ActiveXObject("Microsoft.XMLHTTP");
			}catch(eMS){//trymicrosoft
				try{
				request = new ActiveXObject("Msxml2.XMLHTTP");
				}catch(eOther){ //othermicrosoft
					try{
						request = new XMLHttpRequest();
					}catch (e){
						request = false;
					}
				}
			}
			return request;
		}
		function CallBack(httpRequest, callBackFunc){
			this.callBackFunc = callBackFunc;
			this.httpRequest = httpRequest;
			this.onReadyStateChange = onReadyStateChange;
			this.onReadyStateChange.httpRequest = httpRequest;
			this.onReadyStateChange.userCallBack = callBackFunc;
			httpRequest.onreadystatechange = this.onReadyStateChange;
			function onReadyStateChange(){
				var outStr = '';
				if (onReadyStateChange.httpRequest.readyState == 4){
					switch(onReadyStateChange.httpRequest.status){
						case 200:
							return onServer200(onReadyStateChange.httpRequest, onReadyStateChange);
							break;
						case 404:
							outStr = 'Request URL does not exist!';
							break;
						default:
							outStr = 'Unknown Server return code: ' + onReadyStateChange.httpRequest.status;
							break;
					}
					if(outStr != ''){
						oDebugger.showoutput('(' + oDebugger.getCurTime(true) + ') ' + outStr, false);
					}
					return false;
					//return oDebugger.showoutput(request.responseText, false);
				}
				switch(httpRequest.readyState){
					case 0:
						outStr = 'Request not send!';
						break;
					case 1:
						outStr = 'Request created but not send!';
						break;
					case 2:
						outStr = 'Request sent! processing...';
						break;
					case 3:
						outStr = 'Request proccessed! receving...';
						break;
					case 4:
						outStr = 'Requst recevied!';
						break;
					default:
						outStr = 'Unknown redeay status code: ' + onReadyStateChange.httpRequest.readyState;
						break;
				}
				return oDebugger.showoutput('(' + oDebugger.getCurTime(true) + ') ' + outStr, false);
			}
			function onServer200(httpRequest, onReadyStateChange){
				var outStr = 'Requst recevied!';
				oDebugger.showoutput('(' + oDebugger.getCurTime(true) + ') ' + outStr, false);
				var res = null;
				var otherRes = null;
				var headerContent = '';
				var httpContent = httpRequest.getResponseHeader('Content-Type');
				if(httpContent){
					httpContent = httpContent.split(';');
					for(var i = 0; i < httpContent.length; i ++){
						headerContent = oDebugger.trim(httpContent[i]).toLowerCase().split('/');
						switch(headerContent[0]){
							case 'text':
								switch(headerContent[1]){
									case 'xml':
										res = httpRequest.responseXML + '';
										break;
									//case 'javascript':
									case 'json':
										//oDebugger._g_eval(' res = ' + httpRequest.responseText);
										eval(' res = ' + httpRequest.responseText);
										break;
									case 'html':
										res = httpRequest.responseText + '';
										break;
									default:
										res = httpRequest.responseText;
										break;
								}
								break;
							case 'image':
								otherRes = 'image';
								break;
							case 'audio':
								otherRes = 'audio';
								break;
							case 'video':
								otherRes = 'video';
								break;
							case 'multipart':
								otherRes = 'multipart';
								break;
							case 'application':
								otherRes = 'application';
								break;
							case 'x-form':
								otherRes = 'x-form';
								break;
							case 'x-model':
								otherRes = 'x-model';
								break;
							case 'message':
								otherRes = 'message';
								break;
							case 'graphics':
								otherRes = 'graphics';
								break;
							default:
								res = httpRequest.responseText;
								break;
						}
						break;
					}
				}
				if(res == null){
					res = httpRequest.responseText + '';
				}
				try{
					if(onReadyStateChange.userCallBack){
						try{
							onReadyStateChange.userCallBack(res, onReadyStateChange.httpRequest);
							return true;
						}catch(e){
							oDebugger.showoutput('(' + oDebugger.getCurTime(true) + ') ' + 'trying user callback function catched a error: ', false, oDebugger.colors.ERROR);
							oDebugger.showoutput(e.description, false);
							return false;
						}
					}
				}catch(e){//userCallBack not define
				}
				if(otherRes){
					oDebugger.showoutput('No process func with ' + otherRes + ' type!', false, oDebugger.colors.ERROR);
					return false;
				}
				if(res.constructor == Object){
					oDebugger.listObject(res);
				}else{
					oDebugger.showoutput(res, false);
				}
				return true;
			}
		}
		function form2URIString(formID){
			var uriStr = '';
			var form = null;
			if(formID.constructor == Object){
				form = formID;
			}else{
				form = $(formID);
			}
			var childs = form.getElementsByTagName('INPUT');
			for(var i = 0; i < childs.length; i++){
				if(childs[i].id || childs[i].name){
					if(childs[i].type == 'text' || childs[i].type == 'hidden'){
						uriStr += '&' + (childs[i].name?childs[i].name:childs[i].id) + '=' + encodeURI(childs[i].value);
					}else if(childs[i].type == 'checkbox' || childs[i].type == 'radio'){
						if(childs[i].checked){
							uriStr += '&' + (childs[i].name?childs[i].name:childs[i].id) + '=' + encodeURI(childs[i].value);
						}
					}
				}
			}
			childs = form.getElementsByTagName('SELECT');
			for(var i = 0; i < childs.length; i++){
				if(childs[i].id || childs[i].name){
					uriStr += '&' + (childs[i].name?childs[i].name:childs[i].id) + '=' + encodeURI(childs[i].value);
				}
			}
			childs = form.getElementsByTagName('TEXTAREA');
			for(var i = 0; i < childs.length; i++){
				if(childs[i].id || childs[i].name){
					uriStr += '&' + (childs[i].name?childs[i].name:childs[i].id) + '=' + encodeURI(childs[i].value);
				}
			}
			return uriStr.substring(1, uriStr.length);
		}
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
			if(!args){
				this.father.showoutput('Please input a valid argument.', false, this.father.colors.ERROR);
				return false;
			}
			if(!this.father.funcName.test(args)){
				this.father.showoutput('Arguments ' + args + ' looks not like a function name', false, this.father.colors.ERROR);
				return false;
			}
			if(this.father._g_isIE){
				if(!this.father._g_eval('typeof(' + args + ') == \'function\'')){
					this.father.showoutput('Arguments ' + args + ' looks not like a function', false, this.father.colors.ERROR);
					return false;
				}
			}else{
				if(!window.eval('typeof(' + args + ') == \'function\'')){
					this.father.showoutput('Arguments ' + args + ' looks not like a function', false, this.father.colors.ERROR);
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
			this.father.showoutput('Breakpoint setted on function ' + args + ' successfully!', false);
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
				this.father.showError(e);
				this.father.showoutput('breakpoint set failed!', false, this.father.colors.ERROR);
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
			var cmdSource = args[1] + ' = ';
			if(this.father._g_isIE){
				cmdSource += (this.father._g_eval(args[1]) + '').replace(/\{/, '{debugger;').replace(/[a-z0-9\ _.\.]+\(/i, 'function(');
			}else{
				cmdSource += (window.eval(args[1]) + '').replace(/\{/, '{debugger;').replace(/[a-z0-9\ _.\.]+\(/i, 'function(');
			};
			return  this.setBreakPoint(cmdSource, args[1]);

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
			'    oDebugger.showoutput("Function ' + args[1] +

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
		bpt:function(args){
			
			
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

			if(args >= this.father._g_breakpoints.length){
				this.father.showoutput('ERROR: Please input a number between 0 to ' + this.father._g_breakpoints.length, false, this.father.color.ERROR);
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
				return this.father.showoutput('Breakpoint on function ' + funcName + ' deleted successfully.', false);
			} catch (e) {
				this.father.showError(e);
			}
			return;
		}
	},
	showMouseObject:function(evt, obj){
		try{
			if(obj && obj == this._g_lastMouseObject){
				return;
			}
			//restore
			if(this._g_lastMouseObject != null){
				this._g_lastMouseObject.style.borderStyle = this._g_lastMouseObjectStyle.borderStyle;
				this._g_lastMouseObject.style.borderColor = this._g_lastMouseObjectStyle.borderColor;
				this._g_lastMouseObject.style.borderWidth = this._g_lastMouseObjectStyle.borderWidth;
			}
			//backup
			if(obj){
				this._g_lastMouseObjectStyle.borderStyle = obj.style.borderStyle;
				this._g_lastMouseObjectStyle.borderColor = obj.style.borderColor;
				this._g_lastMouseObjectStyle.borderWidth = obj.style.borderWidth;
				switch(this._g_enableShowMouseObjectOutputMode){
					case -1:	//none
						break;
					case 1:
						this.showoutput('');
						this.showoutput(this.htmlEncode(obj.tagName), false, this.colors.TIP);
						break;
					case 0:
						this.showoutput('');
						this.showoutput(this.htmlEncode(obj.outerHTML), false, this.colors.TIP);
						break;
					default:
						this.showoutput('');
						this.showoutput(this.htmlEncode(this._g_eval('obj.' + this._g_enableShowMouseObjectOutputMode)), false, this.colors.TIP);
						break;
				}
				if(this._g_enableShowMouseObjectWithoutOutput){
					this.showoutput('');
					this.showoutput(this.htmlEncode(obj.outerHTML), false, this.colors.TIP);
				}
				obj.style.borderStyle = 'solid';
				obj.style.borderColor = this.colors.MOUSETIP;
				obj.style.borderWidth = '2px';
				this._g_lastMouseObject = obj;
			}
			if(arguments.length < 2 && this._g_lastMouseObject != null){
				this._g_lastMouseObject.style.borderStyle = this._g_lastMouseObjectStyle.borderStyle;
				this._g_lastMouseObject.style.borderColor = this._g_lastMouseObjectStyle.borderColor;
				this._g_lastMouseObject.style.borderWidth = this._g_lastMouseObjectStyle.borderWidth;
				this._g_lastMouseObject = null;
			}
		}catch(e){
			this.showError(e);
			this._g_lastMouseObject = null;
		}
	},
	showTopContent:function(args){
		if(args){
			this.DebuggerWin.$('debugger_contentTopDivContainer').style.display = 'block';
//			if(this._g_isIE){
//				this.DebuggerWin.$('DebuggerOutput').style.height = '50%';
//			}else{
				this.DebuggerWin.$('DebuggerOutput').style.height = this.DebuggerWin.$('debuggerClientDiv').offsetHeight/2.0 + 'px';
				this.DebuggerWin.$('debugger_contentTopDivContainer').style.height = this.DebuggerWin.$('debuggerClientDiv').offsetHeight/2.0 + 'px';
//			}
			if(this._g_specialMode.debug){
			}
			if(this._g_specialMode.inject || this._g_specialMode.regex){
				this.DebuggerWin.$('debugger_contentTopText').focus();
			}
		}else{
			this.DebuggerWin.$('debugger_contentTopDivContainer').style.display = 'none';
//			if(this._g_isIE){
//				this.DebuggerWin.$('DebuggerOutput').style.height = '';
//			}else{
				this.DebuggerWin.$('DebuggerOutput').style.height = this.DebuggerWin.$('debuggerClientDiv').offsetHeight + 'px';
//			}
		}
	},
	injectSth:function(args){
		switch(args){
			case 'js':
				var script = document.createElement('script');
				script.text = this.DebuggerWin.$('debugger_contentTopText').value;
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
	catchError:function(msg, url, line){
		var tip = '';
		if(oDebugger._g_isZh){
			tip += '出错了！\n';
			tip += '信息：' + msg + '\n';
			tip += '地址：' + url + '\n';
			tip += '行数：' + line;
		}else{
			tip += 'An error occur!\n';
			tip += 'msg: ' + msg + '\n';
			tip += 'address: ' + url + '\n';
			tip += 'lines: ' + line;
		}
		//alert(tip);
		oDebugger.showoutput(tip, false, oDebugger.colors.ERROR);
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
		if(this._g_isExiting){return;}
		this.showoutput('COMMAND(' + this.getCurTime(true) + '):', true, this.colors.COMMAND);
		this.showoutput(obj, false);
		if(this.userDefineCommand(obj)){try{this.DebuggerWin.$('debuggerCommand').value = '';return;}catch(e){return;}}
		if(this._g_specialMode.inject || this._g_specialMode.regex){
			if(this._g_specialMode.inject && this.dealInjectSth(obj)){
				return;
			}
			if(this._g_specialMode.regex && this.RegularExpressionsTool(obj)){
				return;
			}
		}
		if(!this._g_specialMode.execMode){return this.dealOtherMode();}
		try{
			this.showoutput('RETURN (' + this.getCurTime(true) + '):', true, this.colors.COMMAND);
			//this._g_returnValue = this._g_eval(obj);
			if(this._g_isIE){
				this._g_returnValue = this._g_eval(obj);//execScript
			}else{
				this._g_returnValue = window.eval(obj);
			}
			this.showoutput(this._g_returnValue, false, this.colors.TIP);
		}catch(e){
			this._g_returnValue = e.description;
			this.showError(e);
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
	RegularExpressionsTool:function(args){
		var _args = args.split(" ");
		switch(_args[0]){
			case 'mode':
				this.showMode(_args.unshift());
				return true;
				break;
			case 'case':
				switch(_args[1]){
					case 'i':
						this.RegularExpressionsTool.i = _args[2];
						break;
					case 'g':
						this.RegularExpressionsTool.g = _args[2];
						break;
					default:
						if(this.RegularExpressionsTool.g){}else{
							this.RegularExpressionsTool.g = 'off';
						}
						if(this.RegularExpressionsTool.i){}else{
							this.RegularExpressionsTool.i = 'off';
						}
						this.showoutput('CASE:', true, this.colors.TIP);
						this.showoutput('ignore(i)->' + this.RegularExpressionsTool.i + ' ,global(g)->' + this.RegularExpressionsTool.g, false);
						break;
				}
				this.DebuggerWin.$('debuggerCommand').value = '';
				break;
			default:
				var regStr = null;
				var param = '';
				if(this.RegularExpressionsTool.i == 'on'){
					param += 'i';
				}
				if(this.RegularExpressionsTool.g == 'on'){
					param += 'g';
				}
				try{
					regStr = new RegExp(this.DebuggerWin.$('debuggerCommand').value, param);
				}catch(e){
					this.showError(e);
					return true;
				}
				this.showoutput('RESULT:', true, this.colors.COMMAND);
				this.showoutput((this.DebuggerWin.$('debugger_contentTopText').value).replace(regStr, ''), false);
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
			case 'bpt':
				this.debug.bpt(args);
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
				this.DebuggerWin._g_cmdFocus = ! this.DebuggerWin._g_cmdFocus;
				break;
			case 'keycode':
				this._g_enableShowKeyCode = ! this._g_enableShowKeyCode;
				break;
			case 'mousepos':
				this._g_enableShowMousePos = ! this._g_enableShowMousePos;
				break;
			case 'inspect':
				this._g_enableShowMouseObject = ! this._g_enableShowMouseObject;
				if(args.length > 2){
					switch(args[2]){
						case 'none':
							this._g_enableShowMouseObjectOutputMode = -1;
							break;
						case 'tagName':
							this._g_enableShowMouseObjectOutputMode = 1;
							break;
						case 'outerHTML':
							this._g_enableShowMouseObjectOutputMode = 0;
							break;
						default:
							this._g_enableShowMouseObjectOutputMode = args[2];
							break;
					}
				}
				this.showMouseObject();
				break;
			case 'alpha':
				this.Debugger.style.filter = 'Alpha(Opacity = ' + (args[2] || 75) + ')';
				break;
			case 'bgcolor':
				this.colors.BACKGROUNDCOLOR = (args[2] || this.colors.BACKGROUNDCOLOR);
				this.DebuggerWin.document.body.style.backgroundColor = this.colors.BACKGROUNDCOLOR;
				break;
			case 'debug':
				this._g_specialMode.debug = !this._g_specialMode.debug;
				this.showTopContent(this._g_specialMode.debug);
				break;
			case 'inject':
				this._g_specialMode.inject = !this._g_specialMode.inject;
				this.DebuggerWin._g_cmdFocus = !this._g_specialMode.inject;
				this.showTopContent(this._g_specialMode.inject);
				break;
			case 'regex':
				this._g_specialMode.regex = !this._g_specialMode.regex;
				this.DebuggerWin._g_cmdFocus = !this._g_specialMode.regex;
				this.showTopContent(this._g_specialMode.regex);
				break;
			case 'watch':
				this.showoutput(this.watch(args[2]), false);
				break;
			case 'hotkey':
				var keyCode = 0;
				if(this._g_isIE){
					keyCode = this._g_eval('oDebugger.funcKey.' + args[2]);
				}else{
					keyCode = eval('oDebugger.funcKey.' + args[2]);
				}
				if(keyCode > 112 && keyCode <= 123){
					this.hotKey = keyCode;
				}else{
					return false;
				}
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
			'<b>Ctrl + Num</b> for recent commands, or <b>Ctrl + up arrow</b> & <b>Ctrl + down arrow</b> <br/>' +
			'<b>Right Alt + Num</b> to member a commands, <b>Left Alt + Num</b> to recall it to command lines<br/>' +
			'<b>bp &lt;funcName&gt;</b> to set a breakpoint on function funcName<br/>' +
			'<b>bpx &lt;funcName&gt;</b> to set a breakpoint on function funcName<br/>' +
			'  when funcName being called, will call debugger like VC to debug it.<br/>' +
			'<b>bl</b> to list breakpoints.<br/>' +
			'<b>bc &lt;Number&gt;</b> to remove a breakpoint which listed in bl.<br/>' +
			'<b>S(obj)</b> show obj in output<br/>' +
			'<b>M(obj)</b> show methods or properties in obj<br/>' +
			'<b>P(obj)</b> or V(obj) to view obj property or value<br/>' +
			'<b>L(obj)</b> to list ListObject property value<br/>' +
			'<b>l(Arrays)</b> to list Arrays contents value<br/>' +
			'<b>mode keycode</b> to toggle show keyCode status<br/>' +
			'<b>mode mousepos</b> to toggle show mouse (x,y) pos. works well in unpin mode.<br/>' +
			'<b>mode select</b> to toggle onoff focus inputCommand<br/>' +
			'<b>mode inspect [none/tagName/outerHTML/ or any other tagNames]</b> to toggle status to inspect object which under mouse, may be with output of object detail<br/>' +
			'<b>mode inject</b> to toggle status of inject mode<br/>' +
			'<b>mode hotkey &lt;F2~F12 Key&gt;</b> to modified show/hide hotkey.<br/>' +
			'<b>mode regex</b> to toggle status of regularExpression validation.<br/>' +
			'&nbsp;&nbsp;use \'<b>case i on/off</b>\' to set ignore case & \'<b>case g on/off</b>\' to set global & \'case\' to list current status.<br/>' +
			'<b>exit</b> to exit debugger<br/>' +
			'<b>$toHex</b> to convert number to Hex datas<br/>' +
			'Move your mouse on some area, and press <b>F8</b> or <b>F7</b> to see what happend ;=) It\'s not just fan, there\'s some details in output<br/>' +
			'ps: If you like it, you can use it like a caculator, just input numbers like \"<b>1+2</b>\" and press <b>RETURN</b> to see what happend! ;=) <br/>' +
			'If you like it, please let me know, my EMail:<a href="mailto:Jackey.King@gmail.com" style="cursor:pointer;"><span color=blue>Jackey.King@gmail.com<span></a><br/>' +
			'Javascript debugger ' + this.Version + '\nauthor:Jackey\nCopyRight (C) Jackey.King 2008-2009\n'
			,false, this.colors.HELP);
	},
	/*
	*################################################################################################################################################
	*Help
	*################################################################################################################################################
	*/
	//help
	showAbout:function (){
		setTimeout(function(){alert('Debug tools for javascript.\nCopyright (C) Jackey.King 2008-2009.\nMail:Jackey.King@gmail.com')}, 1);
	}
}

setTimeout(function(evt){oDebugger.showdebugger(true)}, 1000);

