(function (WGo, undefined) {

    "use strict";

    var prepare_dom = function () {
        this.box = document.createElement("div");
        this.box.className = "wgo-box-wrapper wgo-comments-wrapper";
        this.box.onclick = function () {
            mouse_click()
        };
        this.element.appendChild(this.box);
    WGo.commentWrapper= this.box;

        if (WGo.commentheight)
        {    this.box.style.height = (WGo.commentheight) + "px";
        // this.box.style.top=-3+"px";
        }
        this.comments_title = document.createElement("div");
        this.comments_title.className = "wgo-box-title";
        if(WGo.isPC||WGo.isWideMode)
        this.comments_title.innerHTML = WGo.t("comments");
        this.box.appendChild(this.comments_title);
    WGo.commentTitle=this.comments_title;


        this.comments = document.createElement("div");
        this.comments.className = "wgo-comments-content";
        this.box.appendChild(this.comments);
        WGo.commentContent=this.comments;

        this.winratePanel = document.createElement("div");
        this.winratePanel.className = "wgo-comments-winrate";
        this.box.appendChild(this.winratePanel)
    WGo.winratePanel=this.winratePanel;
        this.winratecanvas = document.createElement("canvas");
        this.winratecanvas.className = "wgo-comments-winrate-canvas";
        this.winratePanel.appendChild(this.winratecanvas)
        WGo.winratecanvas=this.winratecanvas;

        this.winratecanvas2 = document.createElement("canvas");
        this.winratecanvas2.className = "wgo-comments-winrate-canvas2";
        this.winratePanel.appendChild(this.winratecanvas2)
        WGo.winratecanvas2=this.winratecanvas2;


        this.help = document.createElement("div");
        this.help.className = "wgo-help";
        this.help.style.display = "none";
        this.comments.appendChild(this.help);


        this.notification = document.createElement("div");
        this.notification.className = "wgo-notification";
        this.notification.style.display = "none";
        this.comments.appendChild(this.notification);

        this.comment_text = document.createElement("div");
        this.comment_text.className = "wgo-comment-text";
        this.comments.appendChild(this.comment_text);




    }

    var drawWinrate=function() {

        var canvas = WGo.winratecanvas;
        var width = canvas.offsetWidth;
        var height;
        if(WGo.isPC)
        {if(WGo.isWideMode)
         height = WGo.commentWrapper.offsetHeight-WGo.commentTitle.offsetHeight-WGo.commentContent.offsetHeight;
        else
            height = WGo.commentWrapper.offsetHeight-WGo.commentContent.offsetHeight;}
        else
        {
            if(WGo.isWideMode)
                height = WGo.commentWrapper.offsetHeight-WGo.commentTitle.offsetHeight-WGo.commentContent.offsetHeight;
                else
            height= canvas.offsetHeight;
        }
        canvas.style.height=height+"px";
        var g2d = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        g2d.fillStyle="rgb(135,135,135)";
        g2d.fillRect(0,0,  parseInt(width), parseInt(height));

        var stratnode = WGo.mianKifu.root;
        var node = WGo.mianKifu.root;
        var moveNum = 0;
        while (stratnode.children[0]) {
            stratnode = stratnode.children[0];
            moveNum++;
        }
        WGo.allMoveNum=moveNum;
        var lineWidth;
        if(WGo.isPC||WGo.isWideMode)
            lineWidth=height/100;
        else
            lineWidth=height/50;

        var sr=Math.max(Math.round(height/20),14);
        g2d.lineWidth=lineWidth/2;
        g2d.setLineDash([10, 10]);
        g2d.strokeStyle= "rgb(210,210,210)";

        g2d.beginPath();
        g2d.moveTo(sr*1.5, height*3/4);
        g2d.lineTo(width, height*3/4);
        g2d.stroke();
        g2d.closePath();


        g2d.beginPath();
        g2d.moveTo(sr*1.5, height/2);
        g2d.lineTo(width, height/2);
        g2d.stroke();
        g2d.closePath();

        g2d.beginPath();
        g2d.moveTo(sr*1.5, height/4);
        g2d.lineTo(width, height/4);
        g2d.stroke();
        g2d.closePath();
        g2d.setLineDash([]);


        var font = "Calibri";
        g2d.fillStyle = "rgb(210,210,210)";
        g2d.font = sr + "px " + font;
        g2d.fillText("50",1, height/2+ Math.max(sr,14)/3);
        g2d.fillText("75",1, height/4+ Math.max(sr,14)/3);
        g2d.fillText("25",1, height*3/4+ Math.max(sr,14)/3);
        //
        // g2d.lineWidth=lineWidth;
        // g2d.beginPath();
        // g2d.moveTo(2, height-sr);
        // g2d.lineTo(sr*1.5, height-sr);
        // g2d.stroke();
        // g2d.closePath();

        var startWidth=sr*1.5;
        var nowWidth=width-startWidth;

        var lastWinrateHeight;

        for(var i=0;i<moveNum;i++)
        {
            node=node.children[0];
            if (node.bestMoves[0]&&node.bestMoves[0].winrate)
        {
            var winHeight;
            if(node.move.c==WGo.B)
                winHeight=height*node.bestMoves[0].winrate/100;
            else
                winHeight=height*(100-node.bestMoves[0].winrate)/100;
            g2d.strokeStyle="rgb(0,255,0)";
            g2d.lineWidth=lineWidth;
            g2d.beginPath();
            if(lastWinrateHeight)
            g2d.moveTo(startWidth+nowWidth*i/moveNum, lastWinrateHeight);
            else
                g2d.moveTo(startWidth+nowWidth*i/moveNum, winHeight);
            g2d.lineTo(startWidth+nowWidth*(i+1)/moveNum, winHeight);
            lastWinrateHeight=winHeight;

            g2d.stroke();
            g2d.closePath();
        }
            else if(lastWinrateHeight)
            {
                g2d.strokeStyle="rgb(0,0,255)";
                g2d.lineWidth=lineWidth;
                g2d.beginPath();
                g2d.moveTo(startWidth+nowWidth*i/moveNum, lastWinrateHeight);
                g2d.lineTo(startWidth+nowWidth*(i+1)/moveNum, lastWinrateHeight);
                g2d.stroke();
                g2d.closePath();
            }
        }

      //  g2d.fillRect(0,0,  parseInt(width/2), parseInt(height/2));
        // alert(width+"_"+height);
        //drawWinrate2();

    }

WGo.drawWinrate=drawWinrate;
    var drawWinrate2=function()
    {
        var canvas = WGo.winratecanvas2;
        var width = canvas.offsetWidth;
        var height;
        if(WGo.isPC)
        {if(WGo.isWideMode)
            height = WGo.commentWrapper.offsetHeight-WGo.commentTitle.offsetHeight-WGo.commentContent.offsetHeight;
        else
            height = WGo.commentWrapper.offsetHeight-WGo.commentContent.offsetHeight;}
        else
        {
            if(WGo.isWideMode)
                height = WGo.commentWrapper.offsetHeight-WGo.commentTitle.offsetHeight-WGo.commentContent.offsetHeight;
            else
                height= canvas.offsetHeight;
        }
        canvas.style.height=height+"px";
        canvas.width = width;
        canvas.height = height;
        var g2d = canvas.getContext("2d");
        g2d.clearRect(0,0,width,height);
        var sr=Math.max(Math.round(height/20),14);
        var startWidth=sr*1.5;
        var nowWidth=width-startWidth;
        var node = WGo.curNode;
        var moveNum=WGo.curPlayer.kifuReader.path.m;
        var lineWidth;
        if(WGo.isPC||WGo.isWideMode)
            lineWidth=height/100;
        else
            lineWidth=height/50;

        g2d.lineWidth=lineWidth/2;
        g2d.setLineDash([10, 10]);
        g2d.strokeStyle= "rgb(210,210,210)";

        g2d.beginPath();
        g2d.moveTo(startWidth+nowWidth*(moveNum/WGo.allMoveNum), 0);
        g2d.lineTo(startWidth+nowWidth*(moveNum/WGo.allMoveNum), height);
        g2d.stroke();
        g2d.closePath()
        g2d.setLineDash([]);
        if (node.bestMoves&&node.bestMoves[0]&&node.bestMoves[0].winrate)
        {
            var winHeight;
            if(node.move.c==WGo.B)
                winHeight=height*node.bestMoves[0].winrate/100;
            else
                winHeight=height*(100-node.bestMoves[0].winrate)/100;

            g2d.fillStyle = "rgb(255,0,0)";
            g2d.beginPath();
            g2d.arc(startWidth+nowWidth*(moveNum/WGo.allMoveNum), winHeight, sr/ 5, 0, 2 * Math.PI, true);
            g2d.closePath();
            g2d.fill();

            var font = "Calibri";
            g2d.fillStyle = "rgb(0,0,0)";
            g2d.font = "bold "+sr + "px " + font;
            var textHeight;
            var winrate=node.bestMoves[0].winrate;
            if(node.move.c==WGo.B)
                winrate=100-winrate;
            if(winrate>80)
            {
                textHeight=winHeight+sr;
            }
                else
            {
                textHeight=winHeight-0.3*sr;
            }
                if(WGo.isPC||WGo.isWideMode)
                {if(moveNum<WGo.allMoveNum*0.9)
            g2d.fillText(winrate.toFixed(1),startWidth+nowWidth*(moveNum/WGo.allMoveNum), textHeight);
                else
                    g2d.fillText(winrate.toFixed(1),startWidth+nowWidth*(moveNum/WGo.allMoveNum)-sr*1.9, textHeight);
                }
                else
                {
                    if(moveNum<WGo.allMoveNum*0.94)
                        g2d.fillText(winrate.toFixed(1),startWidth+nowWidth*(moveNum/WGo.allMoveNum), textHeight);
                    else
                        g2d.fillText(winrate.toFixed(1),startWidth+nowWidth*(moveNum/WGo.allMoveNum)-sr*1.9, textHeight);

                }
        }







    }
    WGo.drawWinrate2=drawWinrate2;

    var clearWinrate=function()
    {
        var canvas = WGo.winratecanvas2;
        var height=canvas.height;
        var width=canvas.width;
        var g2d = canvas.getContext("2d");
        g2d.clearRect(0,0,width,height);

    }


    var mark = function (index) {
if(WGo.clickedComment|| WGo.commentVarClicked)
    return;
        // var x, y;
        //
        // x = move.charCodeAt(0) - 'a'.charCodeAt(0);
        // if (x < 0) x += 'a'.charCodeAt(0) - 'A'.charCodeAt(0);
        // if (x > 7) x--;
        // y = (move.charCodeAt(1) - '0'.charCodeAt(0));
        // if (move.length > 2) y = y * 10 + (move.charCodeAt(2) - '0'.charCodeAt(0));
        // y = this.kifuReader.game.size - y;
        //
        // this._tmp_mark = {type: 'MS', x: x, y: y};
        // this.board.addObject(this._tmp_mark);
        WGo.curBoard.removeAllObjectsVR();
        WGo.curBoard.removeAllObjectsBM();
        var   bestmove = WGo.curNode.bestMoves[index];
        if( WGo.lastX== bestmove.x&&  WGo.lastY == bestmove.y)
        {
          return;
        }
      //  WGo.lastX = bestmove.x;
      //  WGo.lastY = bestmove.y;
        WGo.isMouseOnBestMove = true;
        WGo.mouseBestMove = bestmove;
        this.board.removeAllObjectsBM(bestmove.x, bestmove.y);
        {
            var bestMoveInfo = new Object();
            bestMoveInfo.c = WGo.mainGame.turn;
            bestMoveInfo.BMbyComment=true;
            bestMoveInfo.x = bestmove.x;
            bestMoveInfo.y = bestmove.y;
            bestMoveInfo.winrate = bestmove.winrate;
            bestMoveInfo.scoreMean = bestmove.scoreMean;
            bestMoveInfo.playouts = bestmove.playouts;
            bestMoveInfo.percentplayouts = bestmove.percentplayouts;
            bestMoveInfo.type = "BM";
            this.board.addObject(bestMoveInfo);
        }
        var variations = bestmove.variation;
        for (var i = 1; i < variations.length; i++) {
            var data = variations[i].split("_");
            WGo.var_length = variations.length;
            var mark = {
                type: "variation",
                x: data[0],
                y: data[1],
                c: WGo.mainGame.turn,
                num: i + 1
            };
            this.board.addObject(mark);
            if (WGo.isAutoMode)
                WGo.display_var_length = 1;
            else
                WGo.display_var_length = -1;
        }
        WGo._last_mark=true;
    }


    var mark_variations = function (index) {

        WGo.commentVarClickedNow=true;
        setTimeout(function(){  WGo.commentVarClickedNow=false; }, 100);
        WGo.curBoard.removeAllObjectsVR();
        WGo.curBoard.removeAllObjectsBM();
        var   bestmove = WGo.curNode.bestMoves[index];
        if( WGo.lastX== bestmove.x&&  WGo.lastY == bestmove.y)
        {
            WGo.commentVarClicked=false;
            WGo.clickedComment=false;
            WGo.lastX=-1;
            WGo.lastY=-1;
            WGo.isMouseOnBestMove = false;
            WGo._last_mark=false;
                var node = WGo.curNode;
                if (node.bestMoves)
                    for (var i = 0; i < node.bestMoves.length; i++) {
                        var bestMove = node.bestMoves[i];
                        if (bestMove.coordinate) {
                            var bestMoveInfo = new Object();
                            bestMoveInfo.x = bestMove.x;
                            bestMoveInfo.y = bestMove.y;
                            bestMoveInfo.scoreMean = bestMove.scoreMean;
                            bestMoveInfo.winrate = bestMove.winrate;
                            bestMoveInfo.playouts = bestMove.playouts;
                            bestMoveInfo.percentplayouts = bestMove.percentplayouts;
                            bestMoveInfo.type = "BM";
                            this.board.addObject(bestMoveInfo);
                        }
                    }
            if(!WGo.isShowingMoveNum&&!WGo.editMode)
            {  var lastMark = new Object();
                lastMark.type="TRS";
                lastMark.x= node.move.x;
                lastMark.y=node.move.y;
                this.board.addObject(lastMark);
            }
                return;
        }
        WGo.commentVarClicked=true;
        WGo.clickedComment=true;
        WGo.lastX = bestmove.x;
        WGo.lastY = bestmove.y;
        WGo.isMouseOnBestMove = true;
        WGo.mouseBestMove = bestmove;
        this.board.removeAllObjectsBM(bestmove.x, bestmove.y);
        {
            var bestMoveInfo = new Object();
            bestMoveInfo.c = WGo.mainGame.turn;
            bestMoveInfo.BMbyComment=true;
            bestMoveInfo.x = bestmove.x;
            bestMoveInfo.y = bestmove.y;
            bestMoveInfo.winrate = bestmove.winrate;
            bestMoveInfo.scoreMean = bestmove.scoreMean;
            bestMoveInfo.playouts = bestmove.playouts;
            bestMoveInfo.percentplayouts = bestmove.percentplayouts;
            bestMoveInfo.type = "BM";
            this.board.addObject(bestMoveInfo);
        }
        var variations = bestmove.variation;
        if (WGo.isAutoMode)
            WGo.display_var_length = 1;
        else
            WGo.display_var_length = -1;
        for (var i = 1; i < variations.length; i++) {
            var data = variations[i].split("_");
            WGo.var_length = variations.length;
            var mark = {
                type: "variation",
                x: data[0],
                y: data[1],
                c: WGo.mainGame.turn,
                num: i + 1
            };
            this.board.addObject(mark);
        }
        WGo._last_mark=true;
    }

   var formatWidth= function(str, width){
        str += '';
       var blank =String.fromCharCode(160);
        if(str.length<width)
            return formatWidth(blank+str, width)
        else
            return str
    }

    var unmark = function () {
        if(  WGo.commentVarClicked)
            return;
        // this.board.removeObject(this._tmp_mark);
        // delete this._tmp_mark;
        WGo.curBoard.removeAllObjectsVR();
        WGo.curBoard.removeAllObjectsBM();
        WGo.isMouseOnBestMove = false;
            var node = WGo.curNode;
            if (node.bestMoves)
                for (var i = 0; i < node.bestMoves.length; i++) {
                    var bestMove = node.bestMoves[i];
                    if (bestMove.coordinate) {
                        var bestMoveInfo = new Object();
                        bestMoveInfo.x = bestMove.x;
                        bestMoveInfo.y = bestMove.y;
                        bestMoveInfo.scoreMean = bestMove.scoreMean;
                        bestMoveInfo.winrate = bestMove.winrate;
                        bestMoveInfo.playouts = bestMove.playouts;
                        bestMoveInfo.percentplayouts = bestMove.percentplayouts;
                        bestMoveInfo.type = "BM";
                        this.board.addObject(bestMoveInfo);
                    }
                }
        if(!WGo.isShowingMoveNum&&!WGo.editMode)
        {  var lastMark = new Object();
            lastMark.type="TRS";
            lastMark.x= node.move.x;
            lastMark.y=node.move.y;
            WGo.curBoard.addObject(lastMark);
        }
    }

    var mouse_click = function () {
        if (! WGo.commentVarClickedNow&&WGo.isMouseOnBestMove) {
            clearWinrate();
            WGo.commentVarClicked=false;
            WGo.lastX = -1;
            WGo.lastY = -1;
            WGo.clickedComment=false
            WGo.isMouseOnBestMove = false;
            WGo.curBoard.removeAllObjectsVR();
            var node = WGo.curNode;
            if (node.bestMoves)
                for (var i = 0; i < node.bestMoves.length; i++) {
                    var bestMove = node.bestMoves[i];
                    if (bestMove.coordinate) {
                        var bestMoveInfo = new Object();
                        bestMoveInfo.x = bestMove.x;
                        bestMoveInfo.y = bestMove.y;
                        bestMoveInfo.scoreMean = bestMove.scoreMean;
                        bestMoveInfo.winrate = bestMove.winrate;
                        bestMoveInfo.playouts = bestMove.playouts;
                        bestMoveInfo.percentplayouts = bestMove.percentplayouts;
                        bestMoveInfo.type = "BM";
                        WGo.curBoard.addObject(bestMoveInfo);
                    }
                }
            if(!WGo.isShowingMoveNum&&!WGo.editMode)
            {  var lastMark = new Object();
                lastMark.type="TRS";
                lastMark.x= node.move.x;
                lastMark.y=node.move.y;
                WGo.curBoard.addObject(lastMark);
            }
        }
    }

    var search_nodes = function (nodes, player) {
        for (var i in nodes) {
            if (nodes[i].className && nodes[i].className == "wgo-move-link") {
                if(WGo.curNode.bestMoves[WGo.commentBindBestMoveIndex].coordinate)
                {
                    if(WGo.isPC)
                        nodes[i].addEventListener("mousemove", mark.bind(player, WGo.commentBindBestMoveIndex));
                    nodes[i].addEventListener("click", mark_variations.bind(player, WGo.commentBindBestMoveIndex));
                nodes[i].addEventListener("mouseout", unmark.bind(player));
                }
                WGo.commentBindBestMoveIndex++;
            } else if (nodes[i].childNodes && nodes[i].childNodes.length) search_nodes(nodes[i].childNodes, player);
        }
    }

    var format_info = function (info, title) {
        var ret = '<div class="wgo-info-list">';
        if (title) ret += '<div class="wgo-info-title">' + WGo.t("gameinfo") + '</div>';
        for (var key in info) {
            ret += '<div class="wgo-info-item"><span class="wgo-info-label">' + key + '</span><span class="wgo-info-value">' + info[key] + '</span></div>';
        }
        ret += '</div>';
        return ret;
    }

    /**
     * Implements box for comments and game informations.
     */

    var CommentBox = WGo.extendClass(WGo.BasicPlayer.component.Component, function (player) {
        this.super(player);
        this.player = player;
        WGo.curPlayer = player;
        this.element.className = "wgo-commentbox";
        prepare_dom.call(this);
        player.addEventListener("kifuLoaded", function (e) {
            if (e.kifu.hasComments()) {
                if(WGo.isPC||WGo.isWideMode)
                this.comments_title.innerHTML = WGo.t("comments");
                this.element.className = "wgo-commentbox";

                this._update = function (e) {
                    this.setComments(e);
                }.bind(this);

                player.addEventListener("update", this._update);
            } else {
                this.comments_title.innerHTML = WGo.t("gameinfo");
                this.element.className = "wgo-commentbox wgo-gameinfo";

                if (this._update) {
                    player.removeEventListener("update", this._update);
                    delete this._update;
                }
                this.comment_text.innerHTML = format_info(e.target.getGameInfo());
            }
        }.bind(this));

        player.notification = function (text) {
            if (text) {
                this.notification.style.display = "block";
                this.notification.innerHTML = text;
                this.is_notification = true;
            } else {
                this.notification.style.display = "none";
                this.is_notification = false;
            }
        }.bind(this);

        player.help = function (text) {
            if (text) {
                this.help.style.display = "block";
                this.help.innerHTML = text;
                this.is_help = true;
            } else {
                this.help.style.display = "none";
                this.is_help = false;
            }
        }.bind(this);
    });

    CommentBox.prototype.setComments = function (e) {
        if (this.player._tmp_mark) unmark.call(this.player);

        var msg = "";
        if (!e.node.parent) {
            msg = format_info(e.target.getGameInfo(), true);
        }

        this.comment_text.innerHTML = msg + this.getCommentText(e.node.comment, e.node.bestMoves, this.player.config.formatNicks, this.player.config.formatMoves);
        if(WGo.isWideMode)
            this.comment_text.style.fontSize = 14 + 'px';
            else
                this.comment_text.style.fontSize = 18 + 'px';
        WGo.commentBindBestMoveIndex=0;
        if (this.player.config.formatMoves) {
            if (this.comment_text.childNodes && this.comment_text.childNodes.length) search_nodes(this.comment_text.childNodes, this.player);
        }
    };

    var getPlayoutsString = function (arg) {
        if (arg >= 1000000) {
            //	var playoutsDouble =  // 1234567 -> 12.34567
            return (arg / 100000 / 10.0).toFixed(1) + "m";
        }
        // else if (arg >= 10000) {
        // 	// playoutsDouble = ; // 13265 -> 13.265
        // 	return arg / 1000.0.toFixed(1) + "k";
        // }
        else if (arg >= 1000) {
            // playoutsDouble = ; // 1265 -> 12.65
            return (arg / 1000.0).toFixed(1) + "k";
        } else {
            return arg;
        }
    }

    CommentBox.prototype.getCommentText = function (comment, bestMoves, formatNicks, formatMoves) {
        // to avoid XSS we must transform < and > to entities, it is highly recomanded not to change it
        //.replace(/</g,"&lt;").replace(/>/g,"&gt;") : "";
        // if(bestMoves)
        // 	if(bestMoves[1])
        // 		if(bestMoves[1].coordinate)
        // return bestMoves[1].variation;
        var moveComment = "";
        var finalcomment = "";
        if (bestMoves)
            for (var i = 0; i < bestMoves.length; i++) {
                if (bestMoves[i])
                    if (bestMoves[i].coordinate) {
                        moveComment +="<p><a class=\"wgo-move-link\">";
                        var playouts = getPlayoutsString(bestMoves[i].playouts);
                        var coords=formatWidth(bestMoves[i].coordinate+"",3);
                        var percent = bestMoves[i].playouts / bestMoves[i].totalplayouts * 100;
                        moveComment += "\n"+"选点" + formatWidth(i + 1,2) + ": "+ coords + "　胜率:" + formatWidth(bestMoves[i].winrate.toFixed(1),4);

                        if (bestMoves[i].scoreMean)
                            moveComment += "　目差" + bestMoves[i].scoreMean.toFixed(1);
                        moveComment += "　计算量:";
                        if(percent<10)
                        {
                            if(percent<3)
                            {
                                moveComment+="▎";
                            }
                           else if(percent<5)
                            {
                                moveComment+="▋";
                            }
                            else
                            moveComment+="▉";
                        }

                        else if(percent>70){
                            moveComment+="███████";
                        }
                        else
                        {
                            for (var s=0;s*10<percent;s++)
                            {
                                moveComment+="█";
                            }
                        }
                        moveComment+=" "+percent.toFixed(1)+"%"+" ("+ playouts+")";
                        moveComment +="</a></p>";
                    }
            }
        if (comment && WGo.isWideMode) {
            finalcomment = "<p>"+comment +"</p>"+ moveComment;
        } else {
            finalcomment = moveComment;
        }

        if (finalcomment.length > 0) {
            var comm = finalcomment;//"<p>" + WGo.filterHTML(finalcomment).replace(/\n/g, "</p><p>") + "</p>";
           // if (formatMoves) comm ="<a href=\"javascript:void(0)\" class=\"wgo-move-link\">"+comm+"</a>";
          //  if (formatNicks) comm = comm.replace(/(<p>)([^:]{3,}:)\s/g, '<p><span class="wgo-comments-nick">$2</span> ');
          //  if (formatMoves) comm = comm.replace(/\b[a-zA-Z]1?\d\b/g, '<a href="javascript:void(0)" class="wgo-move-link">$&</a>');
            return comm;
        }
        return "";
    };

    /**
     * Adding 2 configuration to BasicPlayer:
     *
     * - formatNicks: tries to highlight nicknames in comments (default: true)
     * - formatMoves: tries to highlight coordinates in comments (default: true)
     */

    WGo.BasicPlayer.default.formatNicks = true;
    WGo.BasicPlayer.default.formatMoves = true;

    WGo.BasicPlayer.attributes["data-wgo-formatnicks"] = function (value) {
        if (value.toLowerCase() == "false") this.formatNicks = false;
    }

    WGo.BasicPlayer.attributes["data-wgo-formatmoves"] = function (value) {
        if (value.toLowerCase() == "false") this.formatMoves = false;
    }

    WGo.BasicPlayer.layouts["right_top"].right.push("CommentBox");
    WGo.BasicPlayer.layouts["right"].right.push("CommentBox");
    WGo.BasicPlayer.layouts["one_column"].bottom.push("CommentBox");

    WGo.i18n.en["comments"] = "Comments";
    WGo.i18n.en["gameinfo"] = "Game info";


    WGo.BasicPlayer.component.CommentBox = CommentBox

})(WGo);
