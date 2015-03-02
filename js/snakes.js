/* 
* @Author: bbales
* @Date:   2015-02-24 13:41:01
* @Last Modified by:   bbales
* @Last Modified time: 2015-03-01 20:42:18
*/
(function(){
    'use strict';
    game.snakes = {};

    game.snakes.draw = function(sn){
        var bulletimg = new Image();
        var toRemove  = [];
        bulletimg.src = 'img/bullets.png';

        for(var i in game[sn].train){
            game.canvas.fillStyle = "rgba("+game[sn].color+","+(game[sn].len-i+Math.round(0.2*game[sn].len))/game[sn].len+")";
            game.canvas.fillRect(game[sn].train[i][0],game[sn].train[i][1],game.block,game.block);

            if(game.armour[sn].enabled && game.armour[sn].shown){
                game.canvas.fillStyle = "#CECECE";
                game.canvas.fillRect(game[sn].train[i][0]+game.block/4,game[sn].train[i][1] + game.block/4,game.block/2,game.block/2);
            }
        }

        game.armour[sn].timeout--;
        if(game.armour[sn].timeout === game.armour.seconds * game.frameRate -1){
            game.armour[sn].shown = true;
            game.armour[sn].counter = 0;
        }
        if(game.armour[sn].timeout < 0.15 * game.armour.seconds * game.frameRate){
            if(game.armour[sn].counter === Math.round(game.frameRate/9,0)){
                game.armour[sn].shown = !game.armour[sn].shown;
            }
            game.armour[sn].counter++;
            if(game.armour[sn].counter == Math.round(game.frameRate/9,0)+1) game.armour[sn].counter = 0;
        }else
        if(game.armour[sn].timeout < 0.4 * game.armour.seconds * game.frameRate){
            if(game.armour[sn].counter === Math.round(game.frameRate/4,0)){
                game.armour[sn].shown = !game.armour[sn].shown;
            }
            game.armour[sn].counter++;
            if(game.armour[sn].counter == Math.round(game.frameRate/4,0)+1) game.armour[sn].counter = 0;
        }

        if(game.armour[sn].timeout <= 0){
            game.armour[sn].enabled = false;
            game.armour[sn].shown = true;
            game.armour[sn].counter = 0;
        }

        for(i = 0; i < game[sn].bullets; i++){
            game.canvas.drawImage(bulletimg,game[sn].x - game.block* (i + 1),game[sn].y - game.block,game.block,game.block);
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