/**
 * Created by larry on 2016/12/30.
 * display marks move in board
 */
(function (WGo) {
    "use strict";
    /*
     *  add solid triangle for show
     */

    var Marker = {};
    var defConfig = {
        markerStyle: 'TRS',//display style
        markerNum: 1,// Set to specify how many items should be displayed at once. from back to front
        lastMoveColor: 'red'
    }

    function bindEvent(e) {
        WGo.self.showMarker(e);
    }

    Marker = function (player, board, config) {
        this.player = player;
        this.board = board;
        this.config = config || {};
        for (var key in defConfig) if (this.config[key] === undefined && defConfig[key] !== undefined) this.config[key] = defConfig[key];
        this.init();
    }

    Marker.prototype = {
        init: function () {
            this._bindEvent();
        },
        clearDefaultSytle: function () {
            var node = this.player.kifuReader.node;
            if (node.move) {
                this.board.removeObject({
                    x: node.move.x,
                    y: node.move.y,
                    type: 'CR'
                })
            }
        },
        _bindEvent: function () {
            WGo.self = this;
            this.player.addEventListener('update', bindEvent)
        },
        clearMarker: function () {
            if (!this.lbs) return;
            for (var i = 0; i < this.lbs.length; i++) {
                this.board.removeObject(this.lbs[i])
            }
        },
        _unbindEvent: function () {
            WGo.self = this;
            WGo.editUnbind = true;
            this.player.removeEventListener('update', bindEvent);
        },
        switchMaker: function (config) {
            this.clearMarker();
            for (var key in config) this.config[key] = config[key];
            this.showMarker({
                position: this.player.kifuReader.game.getPosition()
            })
        },
        showMarker: function (e) {
            // if(WGo.editMode)
            // {
            //
            //     return;}
            this.clearMarker();
            this.lbs = [];
            var poss = new WGo.Position(this.player.kifu.size);
            var clonePos = e.position.clone();
            var num = this.player.kifuReader.path.m;
            if (WGo.editMode) {
                num = num - WGo.editMoveNumStart;
            }
            var node = this.player.kifuReader.node;
            var step = 0;
            while (node.move && (step < this.config.markerNum || this.config.markerNum == 0) && num > 0 || (WGo.editMode && num > 0)) {
                var x = node.move.x;
                var y = node.move.y;
                if (WGo.editMode) {
                    if (clonePos.get(x, y) && poss.get(x, y) == 0) {
                        poss.set(x, y, num);
                        if (step == 0) {
                            this.lbs.push({
                                x: x,
                                y: y,
                                text: num,
                                c: this.config.lastMoveColor,
                                type: 'LB'
                            })
                        } else {
                            this.lbs.push({
                                x: x,
                                y: y,
                                text: num,
                                type: 'LB'
                            })
                        }
                    }
                } else {
                    if (clonePos.get(x, y) && poss.get(x, y) == 0) {
                        poss.set(x, y, num);
                        if (step == 0) {
                            this.lbs.push({
                                x: x,
                                y: y,
                                text: num,
                                c: this.config.lastMoveColor,
                                type: this.config.markerStyle
                            })
                        } else {
                            this.lbs.push({
                                x: x,
                                y: y,
                                text: num,
                                type: this.config.markerStyle
                            })
                        }
                    }
                }
                num--;
                step++;
                node = node.parent;
            }
            for (var i = 0; i < this.lbs.length; i++) {
                this.board.addObject(this.lbs[i])
            }
        },
    }
    WGo.Player.Marker = Marker
    // function IsPC() {
    //     var userAgentInfo = navigator.userAgent;
    //     var Agents = ["Android", "iPhone",
    //         "SymbianOS", "Windows Phone",
    //         "iPad", "iPod"];
    //     var flag = true;
    //     for (var v = 0; v < Agents.length; v++) {
    //         if (userAgentInfo.indexOf(Agents[v]) > 0) {
    //             flag = false;
    //             break;
    //         }
    //     }
    //     return flag;
    // }

//
// if(!IsPC())
// {
//     return;
// }

    if (WGo.BasicPlayer && WGo.BasicPlayer.component.Control) {
        WGo.BasicPlayer.component.Control.menu.push({
            constructor: WGo.BasicPlayer.control.MenuItem,
            args: {
                name: "switchmarker",
                togglable: true,
                click: function (player) {
                    this._marker = this._marker || new WGo.Player.Marker(player, player.board);
                    if (!this._isFirst) {
                        player.config.markLastMove = false;
                        this._marker.clearDefaultSytle();
                        this._marker.switchMaker();
                        this._isFirst = true;
                        this._marker.switchMaker({
                            'markerStyle': 'LB',
                            'markerNum': 0
                        });
                        WGo.moveMaker = this._marker;
                        WGo.isShowingMoveNum = true;
                    } else if (this._marker.config.markerStyle == 'TRS') {
                        this._marker.switchMaker({
                            'markerStyle': 'LB',
                            'markerNum': 0
                        });
                    } else if (this._marker.config.markerStyle == 'LB' && this._marker.config.markerNum == 0) {
                        this._marker.switchMaker({
                            'markerStyle': 'LB',
                            'markerNum': 5
                        });
                    } else if (this._marker.config.markerStyle == 'LB' && this._marker.config.markerNum == 5) {
                        this._marker.switchMaker({
                            'markerStyle': 'TRS',
                            'markerNum': 1
                        });
                        WGo.isShowingMoveNum = false;
                    }
                },
            }
        });
    }

    WGo.i18n.en["switchmarker"] = "显示手数";
})(WGo)