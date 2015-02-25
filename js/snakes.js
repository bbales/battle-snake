/* 
* @Author: bbales
* @Date:   2015-02-24 13:41:01
* @Last Modified by:   bbales
* @Last Modified time: 2015-02-24 19:28:46
*/
(function(){
    'use strict';
    game.snakes = {};

    game.snakes.draw = function(sn){
        for(var i in game[sn].train){
            game.canvas.fillStyle = "rgba("+game[sn].color+","+(game[sn].len-i+Math.round(0.2*game[sn].len))/game[sn].len+")";
            game.canvas.fillRect(game[sn].train[i][0],game[sn].train[i][1],game.block,game.block);
        }

        game.canvas.fillStyle = "rgba("+game[sn].color+",1.2)";
        game.canvas.fillRect(game[sn].x,game[sn].y,game.block,game.block);

        game.snakes.drawEyes(sn);
    };

    game.snakes.drawEyes = function(sn){
        game.canvas.fillStyle = "white";
        if(game[sn].dir === UP){
            game.canvas.fillRect(game[sn].x+game.block/10,game[sn].y+game.block/10,game.block/5,game.block/3);
            game.canvas.fillRect(game[sn].x+(game.block-game.block/10 - game.block/5),game[sn].y+game.block/10,game.block/5,game.block/3);
        }else if(game[sn].dir === DOWN){
            game.canvas.fillRect(game[sn].x+game.block/10,game[sn].y+game.block-game.block/10 - game.block/3,game.block/5,game.block/3);
            game.canvas.fillRect(game[sn].x+(game.block-game.block/10 - game.block/5),game[sn].y+game.block-game.block/10 - game.block/3,game.block/5,game.block/3);
        }else if(game[sn].dir === RIGHT){
            game.canvas.fillRect(game[sn].x+game.block-game.block/10 - game.block/3,game[sn].y+game.block/10,game.block/3,game.block/5);
            game.canvas.fillRect(game[sn].x+game.block-game.block/10 - game.block/3,game[sn].y+(game.block-game.block/10 - game.block/5),game.block/3,game.block/5);
        }else if(game[sn].dir === LEFT){
            game.canvas.fillRect(game[sn].x+game.block/10,game[sn].y+game.block/10,game.block/3,game.block/5);
            game.canvas.fillRect(game[sn].x+game.block/10,game[sn].y+(game.block-game.block/10 - game.block/5),game.block/3,game.block/5);
        }
    };

    game.snakes.addPoints = function(sn,points){
        game[sn].len += points;
        document.getElementsByClassName(sn+"length")[0].innerHTML = game[sn].len;
    };

    game.snakes.addWin = function(sn){
        game[sn].wins++;
        document.getElementsByClassName(sn+"wins")[0].innerHTML = game[sn].wins;
    };
}());