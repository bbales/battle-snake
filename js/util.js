/* 
* @Author: bbales
* @Date:   2015-02-23 11:40:08
* @Last Modified by:   bbales
* @Last Modified time: 2015-02-23 13:48:44
*/
var size = [window.width,window.height];

(function(){
    'use strict';

    game.resetFlags = function(){
        game.flags.gameover = false;
        game.flags.tie = false;

        game.p1 = game.p2 = {x : 0, y : 0, len : 3, train : []};
    };

    game.quantize = function(int){
        return Math.round(int/10)*10;
    };

    window.addEventListener("resize",function(){
        document.getElementById("battlesnake").setAttribute("width",document.getElementById("battlesnake").offsetWidth);
        document.getElementById("battlesnake").setAttribute("height",document.getElementById("battlesnake").offsetHeight);
        game.width = Math.round(document.getElementById("battlesnake").getAttribute("width")/10)*10;
        game.height = Math.round(document.getElementById("battlesnake").getAttribute("height")/10)*10;
    },false);

    window.onscroll = function () { window.scrollTo(0, 0); return false;};
}());