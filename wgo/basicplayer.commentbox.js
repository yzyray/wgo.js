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
        this.comments_title.id="commenttitile";
        // if(WGo.isPC||WGo.isWideMode)
        //     this.comments_title.innerHTML = WGo.t("comments");
        this.box.appendChild(this.comments_title);
        WGo.commentTitle=this.comments_title;
//
// if(!WGo.isPC)
// {      this.comments = document.createElement("div");
//         this.comments.className = "wgo-comments-content";
//         this.box.appendChild(this.comments);
//         WGo.commentContent=this.comments;
// }
        this.winratePanel = document.createElement("div");
        this.winratePanel.className = "wgo-comments-winrate";
        this.box.appendChild(this.winratePanel)
        if(WGo.isPC){
            // this.winratePanel.onclick= function (e) {
            //     clickWinrate(e);
            // };
            this.winratePanel.addEventListener('mousedown', startMoveWinrate);
            this.winratePanel.addEventListener('mousemove', moveWinrate);
            this.winratePanel.addEventListener('mouseup', stopMoveWinrate);
            //     this.winratePanel.addEventListener('mouseout', stopMoveWinrate);

        }
        else{
            this.winratePanel.addEventListener('touchstart',touchWinrate, false);
            this.winratePanel.addEventListener('touchmove',touchWinrate, false);
            this.winratePanel.addEventListener('touchend',touchWinrate, false);
        }
        WGo.winratePanel=this.winratePanel;
        this.winratecanvas = document.createElement("canvas");
        this.winratecanvas.className = "wgo-comments-winrate-canvas";
        this.winratePanel.appendChild(this.winratecanvas)
        WGo.winratecanvas=this.winratecanvas;

        //  if(WGo.isPC)
        {      this.comments = document.createElement("div");
            this.comments.className = "wgo-comments-content";
            this.box.appendChild(this.comments);
            WGo.commentContent=this.comments;
        }
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


    var touchWinrate=function(event) {

        var event = event || window.event;

        var x;

        switch(event.type){
            case "touchstart":
                x=event.touches[0].clientX/WGo.trueScale;
                break;
            case "touchend":
                x=event.changedTouches[0].clientX/WGo.trueScale;
                break;
            case "touchmove":
                event.preventDefault();
                x=event.touches[0].clientX/WGo.trueScale;
                break;
        }

        var width=WGo.winrateWidth;
        var startWidth=WGo.winrateStartWidth;

        if (x<startWidth)
        {
            WGo.curPlayer.goTo(1);
        }
        else if (startWidth>width-startWidth)
        {
            WGo.curPlayer.goTo(WGo.allMoveNum);
        }
        else
        {
            var moveNum=Math.round ((x-startWidth)/(width-2*startWidth)*WGo.allMoveNum);
            WGo.curPlayer.goTo(moveNum);
        }
    }


    // var clickWinrate=function(e)
    // {
    // var width=WGo.winrateWidth;
    // var startWidth=WGo.winrateStartWidth;
    // var x=e.offsetX/WGo.trueScale;
    // if (x<startWidth)
    // {
    //     WGo.curPlayer.goTo(1);
    // }
    // else if (startWidth>width-startWidth)
    // {
    //     WGo.curPlayer.goTo(WGo.allMoveNum);
    // }
    // else
    // {
    //     var moveNum=Math.round ((x-startWidth)/(width-2*startWidth)*WGo.allMoveNum);
    //     WGo.curPlayer.goTo(moveNum);
    // }
    // };
    var clicked;
    var  startMoveWinrate=function(e)
    {
        var width=WGo.winrateWidth;
        var startWidth=WGo.winrateStartWidth;
        var x=e.offsetX/WGo.trueScale;
        if (x<startWidth)
        {
            WGo.curPlayer.goTo(1);
        }
        else if (startWidth>width-startWidth)
        {
            WGo.curPlayer.goTo(WGo.allMoveNum);
        }
        else
        {
            var moveNum=Math.round ((x-startWidth)/(width-2*startWidth)*WGo.allMoveNum);
            WGo.curPlayer.goTo(moveNum);
        }
        clicked=true;
    };

    var moveWinrate=function(e)
    {
        if(!clicked)
            return;
        var width=WGo.winrateWidth;
        var startWidth=WGo.winrateStartWidth;
        var x=e.offsetX/WGo.trueScale;
        if (x<startWidth)
        {
            WGo.curPlayer.goTo(1);
        }
        else if (startWidth>width-startWidth)
        {
            WGo.curPlayer.goTo(WGo.allMoveNum);
        }
        else
        {
            var moveNum=Math.round ((x-startWidth)/(width-2*startWidth)*WGo.allMoveNum);
            WGo.curPlayer.goTo(moveNum);
        }
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
    };
    var stopMoveWinrate=function()
    {
        clicked=false;
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
    }


    var drawWinrate=function() {
        var canvas = WGo.winratecanvas;
        var width = WGo.winratePanel.offsetWidth;
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
                height= canvas.offsetHeight-3;
        }
        // canvas.style.height=height+"px";
        WGo.winratePanel.style.height=height+"px";
        WGo.winrateWidth=width;
        width=width*2;
        height=height*2
        canvas.width = width;
        canvas.height = height;
        // if(!WGo.isPC&&!WGo.isWideMode) {
        canvas.style.width = width / 2 + "px";
        canvas.style.height = height / 2 + "px";

        var g2d = canvas.getContext("2d");
        g2d.clearRect(0,0,width,height);
        // canvas.width = width;
        // canvas.height = height;
        // if(WGo.isPC)
        // g2d.fillStyle="rgb(158,158,158)";
        //     else
        g2d.fillStyle="rgb(165,165,165)";
        g2d.fillRect(0,0,  parseInt(width), parseInt(height));

        var stratnode = WGo.mianKifu.root;
        var node = WGo.mianKifu.root;
        var moveNum = 0;
        var maxScoreMean=20;
        while (stratnode.children[0]) {
            stratnode = stratnode.children[0];
            moveNum++;
            if(WGo.isKataData) {
                if (stratnode.bestMoves && stratnode.bestMoves[0] && stratnode.bestMoves[0].scoreMean) {
                    var scoreMean = Math.abs(stratnode.bestMoves[0].scoreMean);
                    if (scoreMean > maxScoreMean)
                        maxScoreMean = scoreMean;
                }
            }
        }
        WGo.allMoveNum=moveNum;
        WGo.maxScoreMean=maxScoreMean;
        var lineWidth;
        if(WGo.isWideMode)
            lineWidth=Math.min(height,width*1.5)/120;
        else
            lineWidth=height/30;

        // if(!WGo.isPC&&!WGo.isWideMode)
        //     var sr=Math.max(Math.round(height/10),56);
        // else if(WGo.isIPAD)
        //     var sr=Math.max(Math.round(height/15),42);
        // else
        if(WGo.isIPAD)
            var sr=Math.max(Math.round(height/15),32);
        else
            var sr=Math.max(Math.round(height/15),36);
        g2d.lineWidth=lineWidth/2.3;
        g2d.setLineDash([16, 16]);
        g2d.strokeStyle= "rgb(200,200,0)";

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
        g2d.fillStyle = "rgb(210,210,0)";
        g2d.font = sr*3/4 + "px " + font;
        g2d.fillText("50",4, height/2+ Math.max(sr,14)/3);
        g2d.fillText("75",4, height/4+ Math.max(sr,14)/3);
        g2d.fillText("25",4, height*3/4+ Math.max(sr,14)/3);
        //
        // g2d.lineWidth=lineWidth;
        // g2d.beginPath();
        // g2d.moveTo(2, height-sr);
        // g2d.lineTo(sr*1.5, height-sr);
        // g2d.stroke();
        // g2d.closePath();

        var startWidth=sr*1.5;
        WGo.winrateStartWidth=startWidth/2;
        var nowWidth=width-startWidth*2;

        var lastWinrateHeight;


        if( WGo.isKataData ){
            var lastScoreHeight;
            node=node = WGo.mianKifu.root;
            for(var i=0;i<moveNum;i++)
            {
                node=node.children[0];
                if (node.bestMoves[0]&&node.bestMoves[0].scoreMean)
                {
                    var scoreHeight;
                    if(node.move.c==WGo.B)
                        scoreHeight=6+(height-12)*(0.5+node.bestMoves[0].scoreMean/(maxScoreMean*2));
                    else
                        scoreHeight=6+(height-12)*(0.5-(node.bestMoves[0].scoreMean)/(maxScoreMean*2));
                    g2d.strokeStyle="rgb(256,55,255)";
                    g2d.lineWidth=lineWidth;
                    g2d.beginPath();
                    if(lastScoreHeight)
                        g2d.moveTo(startWidth+nowWidth*i/moveNum, lastScoreHeight);
                    else
                        g2d.moveTo(startWidth+nowWidth*i/moveNum, scoreHeight);
                    g2d.lineTo(startWidth+nowWidth*(i+1)/moveNum, scoreHeight);
                    lastScoreHeight=scoreHeight;

                    g2d.stroke();
                    g2d.closePath();
                }
                else if(lastScoreHeight)
                {
                    g2d.strokeStyle="rgb(256,55,255)";
                    g2d.lineWidth=lineWidth;
                    g2d.beginPath();
                    g2d.moveTo(startWidth+nowWidth*i/moveNum, lastScoreHeight);
                    g2d.lineTo(startWidth+nowWidth*(i+1)/moveNum, lastScoreHeight);
                    g2d.stroke();
                    g2d.closePath();
                }
            }
        }
        node=node = WGo.mianKifu.root;
        for(var i=0;i<moveNum;i++)
        {
            node=node.children[0];
            if (node.bestMoves&&node.bestMoves[0]&&node.bestMoves[0].winrate)
            {
                var winHeight;
                if(node.move.c==WGo.B)
                    winHeight=6+(height-12)*node.bestMoves[0].winrate/100;
                else
                    winHeight=6+(height-12)*(100-node.bestMoves[0].winrate)/100;
                g2d.strokeStyle="rgb(0,255,255)";
                g2d.lineWidth=lineWidth*3.3/5;
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
                g2d.strokeStyle="rgb(0,255,0)";
                g2d.lineWidth=lineWidth*3.3/5;
                g2d.beginPath();
                g2d.moveTo(startWidth+nowWidth*i/moveNum, lastWinrateHeight);
                g2d.lineTo(startWidth+nowWidth*(i+1)/moveNum, lastWinrateHeight);
                g2d.stroke();
                g2d.closePath();
            }
        }


    }

    WGo.drawWinrate=drawWinrate;
    var drawWinrate2=function()
    {
        var canvas = WGo.winratecanvas2;
        var width = WGo.winratePanel.offsetWidth;
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
                height= WGo.winratePanel.offsetHeight;
        }
        // if(!WGo.isPC&&!WGo.isWideMode)
        {width=width*2;
            height=height*2}
        canvas.width = width;
        canvas.height = height;
        // if(!WGo.isPC&&!WGo.isWideMode) {
        canvas.style.width = width / 2 + "px";
        canvas.style.height = height / 2 + "px";
        // }
        // else
        // {     canvas.style.width = width  + "px";
        // canvas.style.height = height + "px";
        // }
        // canvas.style.zoom=;

        var g2d = canvas.getContext("2d");
        g2d.clearRect(0,0,width,height);
        // if(!WGo.isPC&&!WGo.isWideMode)
        //     var sr=Math.max(Math.round(height/10),56);
        // else
        if(WGo.isIPAD)
            var sr=Math.max(Math.round(height/15),32);
        else
            var sr=Math.max(Math.round(height/15),36);
        var startWidth=sr*1.5;
        var nowWidth=width-startWidth*2;
        var node = WGo.curNode;
        var moveNum=WGo.curPlayer.kifuReader.path.m;
        var lineWidth;
        if(WGo.isWideMode)
            lineWidth=Math.min(height,width*1.5)/180;
        else
            lineWidth=height/50;

        g2d.lineWidth=lineWidth/2;
        g2d.setLineDash([16, 16]);
        g2d.strokeStyle= "rgb(255,255,0)";

        g2d.beginPath();
        g2d.moveTo(startWidth+nowWidth*(moveNum/WGo.allMoveNum), 0);
        g2d.lineTo(startWidth+nowWidth*(moveNum/WGo.allMoveNum), height);
        g2d.stroke();
        g2d.closePath()
        g2d.setLineDash([]);
        if( WGo.isKataData ){
            if (node.bestMoves&&node.bestMoves[0]&&node.bestMoves[0].scoreMean)
            {
                var scoreHeight;
                var score;
                if(node.move.c==WGo.B)
                {scoreHeight=6+(height-12)*(0.5+node.bestMoves[0].scoreMean/(WGo.maxScoreMean*2));
                    score=-node.bestMoves[0].scoreMean;}
                else
                {  scoreHeight=6+(height-12)*(0.5-(node.bestMoves[0].scoreMean)/(WGo.maxScoreMean*2));
                    score=node.bestMoves[0].scoreMean;}


                var font = "Calibri";
                g2d.fillStyle = "rgb(0,0,255)";
                g2d.font = "bold "+sr*5/6 + "px " + font;
                var textHeight;
                if(scoreHeight<height*0.1)
                {
                    textHeight=scoreHeight+0.75*sr;
                }
                else
                {
                    textHeight=scoreHeight-0.2083*sr;
                }
                var text=score.toFixed(1);
                if(moveNum<WGo.allMoveNum*0.98)
                {
                    // if(score<0)
                    // { if(text.length==3)
                    // g2d.fillText(text,startWidth+nowWidth*(moveNum/WGo.allMoveNum)-sr*1.25, textHeight);
                    // if(text.length==4)
                    //     g2d.fillText(text,startWidth+nowWidth*(moveNum/WGo.allMoveNum)-sr*1.65, textHeight);
                    //     if(text.length==5)
                    //         g2d.fillText(text,startWidth+nowWidth*(moveNum/WGo.allMoveNum)-sr*2.1, textHeight);
                    // }
                    // else
                    {
                        if(text.length==3)
                            g2d.fillText(text,startWidth+nowWidth*(moveNum/WGo.allMoveNum)-sr*1.18, textHeight);
                        if(text.length==4)
                            g2d.fillText(text,startWidth+nowWidth*(moveNum/WGo.allMoveNum)-sr*1.59, textHeight);
                        if(text.length==5)
                            g2d.fillText(text,startWidth+nowWidth*(moveNum/WGo.allMoveNum)-sr*2.05, textHeight);
                    }
                }
                else {
                    if(text.length==3)
                        g2d.fillText(text,startWidth+nowWidth*(moveNum/WGo.allMoveNum)-sr*1.76, textHeight);
                    if(text.length==4)
                        g2d.fillText(text,startWidth+nowWidth*(moveNum/WGo.allMoveNum)-sr*2.22, textHeight);
                    if(text.length==5)
                        g2d.fillText(text,startWidth+nowWidth*(moveNum/WGo.allMoveNum)-sr*2.62, textHeight);
                }
            }
        }
        if (node.bestMoves&&node.bestMoves[0]&&node.bestMoves[0].winrate)
        {
            var winHeight;
            // if(!WGo.isPC&&!WGo.isWideMode)
            {if(node.move.c==WGo.B)
                winHeight=6+(height-12)*node.bestMoves[0].winrate/100;
            else
                winHeight=6+(height-12)*(100-node.bestMoves[0].winrate)/100;}
            // else
            // {if(node.move.c==WGo.B)
            //     winHeight=5+(height-10)*node.bestMoves[0].winrate/100;
            // else
            //     winHeight=5+(height-10)*(100-node.bestMoves[0].winrate)/100;
            // }


            var font = "Calibri";
            g2d.fillStyle = "rgb(0,0,0)";
            g2d.font = "bold "+sr + "px " + font;
            var textHeight;
            var winrate=node.bestMoves[0].winrate;
            if(node.move.c==WGo.B)
                winrate=100-winrate;
            if(winrate>80)
            {
                textHeight=winHeight+0.95*sr;
            }
            else
            {
                textHeight=winHeight-0.25*sr;
            }

            if(moveNum<WGo.allMoveNum*0.98)
                g2d.fillText(winrate.toFixed(1),startWidth+nowWidth*(moveNum/WGo.allMoveNum)+sr*0.15, textHeight);
            else
                g2d.fillText(winrate.toFixed(1),startWidth+nowWidth*(moveNum/WGo.allMoveNum)-sr*0.5, textHeight);

            g2d.fillStyle = "rgb(0,0,255)";
            g2d.beginPath();
            g2d.arc(startWidth+nowWidth*(moveNum/WGo.allMoveNum), scoreHeight, sr/ 7, 0, 2 * Math.PI, true);
            g2d.closePath();
            g2d.fill();


            g2d.fillStyle = "rgb(0,0,0)";
            g2d.beginPath();
            g2d.arc(startWidth+nowWidth*(moveNum/WGo.allMoveNum), winHeight, sr/ 7, 0, 2 * Math.PI, true);
            g2d.closePath();
            g2d.fill();

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
            if(!WGo.editMode)
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
        if(!WGo.editMode)
        {  var lastMark = new Object();
            lastMark.type="TRS";
            lastMark.x= node.move.x;
            lastMark.y=node.move.y;
            WGo.curBoard.addObject(lastMark);
        }
    }

    var mouse_click = function () {
//         var o = document.getElementById("main");
//         o.setAttribute("data-wgo", "qp\\test2.sgf");
//         var pl_elems = document.querySelectorAll("[data-wgo],[data-wgo-diagram]");
//
//         for (var i = 0; i < pl_elems.length; i++) {
//             WGo.player_from_tag(pl_elems[i]);
//         }
// return;

        if (! WGo.commentVarClickedNow&&WGo.isMouseOnBestMove) {
            //clearWinrate();
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
            if(!WGo.editMode)
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
                // if(WGo.isPC||WGo.isWideMode)
                //     this.comments_title.innerHTML = WGo.t("comments");
                this.element.className = "wgo-commentbox";

                this._update = function (e) {
                    // if(WGo.badMoveListW)
                    // if(WGo.curPlayer.kifuReader.path.m==WGo.badMoveListW[0].moveNum)
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
        if (bestMoves&&bestMoves[0])
        {
            comment="<p>"+WGo.curNode.comment2+"</p>";//+comment;
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
