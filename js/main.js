/* 
* @Author: bbales
* @Date:   2015-02-22 20:57:45
* @Last Modified by:   bbales
* @Last Modified time: 2015-02-23 17:17:48
*/


(function(){
    'use strict';

    // constants
    var P1LOSS = 1;
    var P2LOSS = 2;

    var UP = 1;
    var DOWN = 2;
    var LEFT = 3;
    var RIGHT = 4;

    game.start = function(){
        game.canvas = document.getElementById("battlesnake").getContext("2d");
        document.getElementById("battlesnake").setAttribute("width",document.getElementById("battlesnake").offsetWidth);
        document.getElementById("battlesnake").setAttribute("height",document.getElementById("battlesnake").offsetHeight);
        game.width = Math.round(document.getElementById("battlesnake").getAttribute("width")/10)*10;
        game.height = Math.round(document.getElementById("battlesnake").getAttribute("height")/10)*10;
        
        // Position players
        var height = game.quantize((game.height/2)*1);
        var w1 = game.quantize((game.width/4));
        var w2 = game.quantize((game.width/4)*3);

        game.p1.x = w1;
        game.p1.y = height;

        game.p2.x = w2;
        game.p2.y = height;

        // Start main loop
        game.mainLoop();
    };

    game.over = function(){
        document.getElementById("overlay").className = "overlay shown";
    };

    game.mainLoop = function(){
        game.width = game.quantize(document.getElementById("battlesnake").getAttribute("width"));
        game.height = game.quantize(document.getElementById("battlesnake").getAttribute("height"));
        var block = 10;
        if(game.flags.gameover){
            game.over();
            return;
        }
        if(game.flags.paused){
            // Paused loop
            setTimeout(game.mainLoop,1000/game.frameRate);
            return;
        }
        game.canvas.clearRect(0,0,game.width,game.height);

        

        // Draw old
        for(i in game.p2.train){
            game.canvas.fillStyle = "rgba(225,80,0,"+(game.p2.len-i+Math.round(0.2*game.p2.len))/game.p2.len+")";
            game.canvas.fillRect(game.p2.train[i][0],game.p2.train[i][1],block,block);
        }

        for(i in game.p1.train){
            game.canvas.fillStyle = "rgba(0,150,255,"+(game.p1.len-i+Math.round(0.2*game.p2.len))/game.p1.len+")";
            game.canvas.fillRect(game.p1.train[i][0],game.p1.train[i][1],block,block);
        }

        // Draw new
        
        if(!game.keys.w && !game.keys.s && !game.keys.a && !game.keys.d){
            switch(Math.round(Math.random()*3)){
                case 0:
                    game.p1.dir = UP;
                    game.keys.w = true;
                    break;
                case 1:
                    game.p1.dir = DOWN;
                    game.keys.s = true;
                    break;
                case 2:
                    game.p1.dir = LEFT;
                    game.keys.a = true;
                    break;
                case 3:
                    game.p1.dir = RIGHT;
                    game.keys.d = true;
                    break;
            }
            game.lastkeys = game.keys;
        }
        if(!game.keys.up && !game.keys.down && !game.keys.left && !game.keys.right){
            switch(Math.round(Math.random()*3)){
                case 0:
                    game.p2.dir = UP;
                    game.keys.up = true;
                    break;
                case 1:
                    game.p2.dir = DOWN;
                    game.keys.down = true;
                    break;
                case 2:
                    game.p2.dir = LEFT;
                    game.keys.left = true;
                    break;
                case 3:
                    game.p2.dir = RIGHT;
                    game.keys.right = true;
                    break;
            }
            game.lastkeys = game.keys;
        }

        var tempKeys = game.keys;

        if(game.lastkeys !== undefined){
            if(game.p1.dir === UP && tempKeys.s){tempKeys.s = false; tempKeys.w = true;}
            else if(game.p1.dir === DOWN && tempKeys.w){tempKeys.w = false; tempKeys.s = true;}
            else if(game.p1.dir === RIGHT && tempKeys.d){tempKeys.d = false; tempKeys.a = true;}
            else if(game.p1.dir === LEFT && tempKeys.a){tempKeys.a = false; tempKeys.d = true;}

            if(game.p2.dir === UP && tempKeys.down){tempKeys.down = false; tempKeys.up = true;}
            else if(game.p2.dir === DOWN && tempKeys.up){tempKeys.up = false; tempKeys.down = true;}
            else if(game.p2.dir === RIGHT && tempKeys.right){tempKeys.right = false; tempKeys.left = true;}
            else if(game.p2.dir === LEFT && tempKeys.left){tempKeys.left = false; tempKeys.right = true;}
        }

        game.lastkeys = tempKeys;

        if(tempKeys.w){
            game.p1.dir = UP;
            game.p1.y -= block;
        }else if(tempKeys.s){
            game.p1.dir = DOWN;
            game.p1.y += block;
        }else if(tempKeys.a){
            game.p1.dir = RIGHT;
            game.p1.x -= block;
        }else if(tempKeys.d){
            game.p1.dir = LEFT;
            game.p1.x += block;
        }

        if(game.p1.x < 0) game.p1.x = game.width;
        if(game.p1.x > game.width) game.p1.x = 0;
        if(game.p1.y < 0) game.p1.y = game.height;
        if(game.p1.y > game.height) game.p1.y = 0;

        if(tempKeys.up){
            game.p2.dir = UP;
            game.p2.y -= block;
        }else if(tempKeys.down){
            game.p2.dir = DOWN;
            game.p2.y += block;
        }else if(tempKeys.left){
            game.p2.dir = RIGHT;
            game.p2.x -= block;
        }else if(tempKeys.right){
            game.p2.dir = LEFT;
            game.p2.x += block;
        }

        if(game.p2.x < 0) game.p2.x = game.width;
        if(game.p2.x > game.width) game.p2.x = 0;
        if(game.p2.y < 0) game.p2.y = game.height;
        if(game.p2.y > game.height) game.p2.y = 0;

        // Check for collisions
        var collisions = 0;

        for(i in game.p1.train){
            if(game.p1.train[i][0] == game.p1.x && game.p1.train[i][1] == game.p1.y){
                collisions++;
                game.flags.result = P1LOSS;
                break;
            }
            if(game.p1.train[i][0] == game.p2.x && game.p1.train[i][1] == game.p2.y){
                collisions++;
                game.flags.result = P2LOSS;
                break;
            }
        }

        for(i in game.p2.train){
            if(game.p2.train[i][0] == game.p2.x && game.p2.train[i][1] == game.p2.y){
                collisions++;
                game.flags.result = P2LOSS;
                break;
            }

            if(game.p2.train[i][0] == game.p1.x && game.p2.train[i][1] == game.p1.y){
                collisions++;
                game.flags.result = P1LOSS;
                break;
            }

        }

        
        if(collisions > 1) game.flags.tie = true;
        if(collisions >= 1){
            game.flags.gameover = true;
            game.over();
            return;
        }

        if(game.p1.x == game.p2.x && game.p1.y == game.p2.y){
            game.flags.tie = true;
            game.flags.gameover = true;
        }

        // Check for food
        for(var i in game.food.a){
            if(game.food.a[i][0] == game.p2.x && game.food.a[i][1] == game.p2.y){
                game.p2.len += (game.food.a[i][2]+3)*2;
                game.addExplosion(game.food.colors[game.food.a[i][2]],50+Math.round(Math.random()*60),game.food.a[i][0],game.food.a[i][1],(game.food.a[i][2]+3)*2);
                game.food.a.splice(i,1);
                break;
            }

            if(game.food.a[i][0] == game.p1.x && game.food.a[i][1] == game.p1.y){
                game.p1.len += (game.food.a[i][2]+3)*2;
                game.addExplosion(game.food.colors[game.food.a[i][2]],50+Math.round(Math.random()*60),game.food.a[i][0],game.food.a[i][1],(game.food.a[i][2]+3)*2);
                game.food.a.splice(i,1);
                break;
            }
        }
        game.drawExplosions();

        // Generate food
        if(game.food.a.length < game.food.max && Math.round(Math.random()*20) == Math.round(Math.random()*55)){
            game.food.a.push([game.quantize(Math.random()*game.width),game.quantize(Math.random()*game.height),Math.round(Math.random()*4)]);
        }
        // Draw food
        if(game.shadow.dir){
            game.shadow.val += 0.07;
            if(game.shadow.val > 1) game.shadow.dir = false;
        }else{
            game.shadow.val -= 0.07;
            if(game.shadow.val < 0) game.shadow.dir = true;
        }

        for(i in game.food.a){
            game.canvas.shadowColor = game.food.colors[game.food.a[i][2]];
            game.canvas.shadowBlur = game.shadow.val * 18;
            game.canvas.fillStyle = game.food.colors[game.food.a[i][2]];
            game.canvas.beginPath();
            game.canvas.arc(game.food.a[i][0]+block/2,game.food.a[i][1]+block/2, block/2, 0, 2 * Math.PI, false);
            game.canvas.fill();
        }

        game.canvas.shadowColor = '#999';
        game.canvas.shadowBlur = 0;
        game.canvas.fill();

        // Push new
        if(game.p2.train.length >= game.p2.len) game.p2.train.pop();
        game.p2.train.unshift([game.p2.x,game.p2.y]);

        if(game.p1.train.length >= game.p1.len) game.p1.train.pop();
        game.p1.train.unshift([game.p1.x,game.p1.y]);

        // Meat n potatoes
        game.canvas.fillStyle = "rgba(0,150,255,1.2)";
        game.canvas.fillRect(game.p1.x,game.p1.y,block,block);

        game.canvas.fillStyle = "rgba(225,80,0,1.2)";
        game.canvas.fillRect(game.p2.x,game.p2.y,block,block);
        // console.log(tempKeys);

        setTimeout(game.mainLoop,1000/game.frameRate);
    };

    game.pause = function(t){
        game.flags.paused = t;
    };
}());