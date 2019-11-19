
(function(WGo, undefined){

WGo.SGF = {};


var to_num = function(str, i) {
	return str.charCodeAt(i)-97;
}

var sgf_player_info = function(type, black, kifu, node, value, ident) {
	var c = ident == black ? "black" : "white";
	kifu.info[c] = kifu.info[c] || {};
	kifu.info[c][type] = value[0];
}

// handling properties specifically
var properties = WGo.SGF.properties = {}

// Move properties
properties["B"] = properties["W"] = function(kifu, node, value, ident) {
	if(!value[0] || (kifu.size <= 19 && value[0] == "tt")) node.move = {
		pass: true,
		c: ident == "B" ? WGo.B : WGo.W
	};
	else node.move = {
		x: to_num(value[0], 0), 
		y: to_num(value[0], 1), 
		c: ident == "B" ? WGo.B : WGo.W
	};
}
	
// Setup properties
properties["AB"] = properties["AW"] = function(kifu, node, value, ident) {
	for(var i in value) {
		node.addSetup({
			x: to_num(value[i], 0), 
			y: to_num(value[i], 1), 
			c: ident == "AB" ? WGo.B : WGo.W
		});
	}
}
properties["AE"] = function(kifu, node, value) {
	for(var i in value) {
		node.addSetup({
			x: to_num(value[i], 0), 
			y: to_num(value[i], 1), 
		});
	}
}
properties["PL"] = function(kifu, node, value) {
	node.turn = (value[0] == "b" || value[0] == "B") ? WGo.B : WGo.W;
}
	
// Node annotation properties
properties["C"] = function(kifu, node, value) {
	if(!node.comment)
		node.comment = value.join();
	else
		node.comment +="\r\n"+value.join();
}

// LZ properties
	properties["LZ"] = function(kifu, node, value) {
		//node.comment = value.join();
		//var strs= new Array(); //定义一数组
		var strs=value.toString().split("\n"); //字符分割
		if(strs.length>=2)
		{
			var staticInfo=strs[0].split(" ");
			if(staticInfo.length==3)
			{
				if(!node.comment)
				node.comment ="\n胜率:"+staticInfo[1]+"计算量:"+staticInfo[2];
			}
			if(staticInfo.length==4)
			{
				if(!node.comment)
				node.comment ="\n胜率:"+staticInfo[1]+"计算量:"+staticInfo[2]+"目差:"+staticInfo[3];
			}
			var moveInfo=strs[1].split(" info ");
			// if(!node.comment)
			// 	node.comment =strs[1];
			// else
			// 	node.comment +="\r\n"+strs[1];
			node.bestMoves= new Array(new Object());
			for (var i=0;i<moveInfo.length ;i++ )
					{
						var bestMove = new  Object();
						//document.write(moveInfo[i]+"<br/>"+moveInfo.length+"<br/>"); //分割后的字符输出

						var data = moveInfo[i].trim().split(" ");
						// Todo: Proper tag parsing in case gtp protocol is extended(?)/changed
						for (var j = 0; j < data.length; j++) {
						var key = data[j];
						if (key==("pv")) {
							// Read variation to the end of line
							bestMove.variation = data.slice(j + 1, data.length);
							break;
						} else {
							var value = data[++j];
							if (key=="move") {
								bestMove.coordinate = value.toString();
							}
							if (key=="visits") {
								bestMove.playouts = parseInt(value);
							}
							if (key=="winrate") {
								// support 0.16 0.15
								bestMove.winrate = parseInt(value) / 100.0;
							}
							if (key=="scoreMean") {
								// support 0.16 0.15
								bestMove.scoreMean = parseFloat(value);
								bestMove.isKataData = true;
							}
						}
					}
						node.bestMoves.push(bestMove);
					}
		}
	}
	
// Markup properties
properties["LB"] = function(kifu, node, value) {
	for(var i in value) {
		node.addMarkup({
			x: to_num(value[i],0), 
			y: to_num(value[i],1), 
			type: "LB", 
			text: value[i].substr(3)
		});
	}
}
properties["CR"] = properties["SQ"] = properties["TR"] = properties["SL"] = properties["MA"] = function(kifu, node, value, ident) {
	for(var i in value) {
		node.addMarkup({
			x: to_num(value[i],0), 
			y: to_num(value[i],1), 
			type: ident
		});
	}
}

// Root properties
properties["SZ"] = function(kifu, node, value) {
	kifu.size = parseInt(value[0]);
}
	
// Game info properties
properties["BR"] = properties["WR"] = sgf_player_info.bind(this, "rank", "BR");
properties["PB"] = properties["PW"] = sgf_player_info.bind(this, "name", "PB");
properties["BT"] = properties["WT"] = sgf_player_info.bind(this, "team", "BT");
properties["TM"] =  function(kifu, node, value, ident) {
	kifu.info[ident] = value[0];
	node.BL = value[0];
	node.WL = value[0];
}

var reg_seq = /\(|\)|(;(\s*[A-Z]+(\s*((\[\])|(\[(.|\s)*?([^\\]\]))))+)*)/g;
var reg_node = /[A-Z]+(\s*((\[\])|(\[(.|\s)*?([^\\]\]))))+/g;
var reg_ident = /[A-Z]+/;
var reg_props = /(\[\])|(\[(.|\s)*?([^\\]\]))/g;

// parse SGF string, return WGo.Kifu object
WGo.SGF.parse = function(str) { 

	var stack = [],
		sequence, props, vals, ident,
		kifu = new WGo.Kifu(),
		node = null;
		
	// make sequence of elements and process it
	sequence = str.match(reg_seq);
	
	for(var i in sequence) {
		// push stack, if new variant
		if(sequence[i] == "(") stack.push(node);
		
		// pop stack at the end of variant
		else if(sequence[i] == ")") node = stack.pop();
		
		// reading node (string starting with ';')
		else {
			// create node or use root
			if(node) kifu.nodeCount++;
			node = node ? node.appendChild(new WGo.KNode()) : kifu.root;
			
			// make array of properties
			props = sequence[i].match(reg_node) || [];
			kifu.propertyCount += props.length;
			
			// insert all properties to node
			for(var j in props) {
				// get property's identificator
				ident = reg_ident.exec(props[j])[0];
				
				// separate property's values
				vals = props[j].match(reg_props);
				
				// remove additional braces [ and ]
				for(var k in vals) vals[k] = vals[k].substring(1, vals[k].length-1).replace(/\\(?!\\)/g, "");
				
				// call property handler if any
				if(WGo.SGF.properties[ident]) WGo.SGF.properties[ident](kifu, node, vals, ident);
				else {
					// if there is only one property, strip array
					if(vals.length <= 1) vals = vals[0];
					
					// default node property saving
					if(node.parent) node[ident] = vals;
					
					// default root property saving
					else {
						kifu.info[ident] = vals;
					}
				}
			}
		}
	}
	WGo.mianKifu=kifu;

	function bodyScale() {
		var devicewidth = document.documentElement.clientWidth;
		var deviceheight = document.documentElement.clientHeight;
		var scale = devicewidth / 700;  // 分母——设计稿的尺寸
		var scale2 = deviceheight / 1000;
		document.body.style.zoom = Math.min(scale,scale2);
		WGo.trueScale=Math.min(scale,scale2);
		// var devicewidth = document.documentElement.clientWidth;
		// var deviceheight = document.documentElement.clientHeight;
		// if(deviceheight>devicewidth){
		// 	WGo.isWide=false;
		// }
		// else{
		// 	WGo.isWide=true;
		// 	}
	}
	//window.onload = window.onresize = function () {
		bodyScale();
	//};
	return kifu;		
}
})(WGo);