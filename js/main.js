/* 
* @Author: bbales
* @Date:   2015-02-22 20:57:45
* @Last Modified by:   bbales
* @Last Modified time: 2015-02-23 01:10:18
*/


(function(){
    'use strict';

    game.start = function(){
        game.canvas = document.getElementById("battlesnake").getContext("2d");
        document.getElementById("battlesnake").setAttribute("width",document.getElementById("battlesnake").offsetWidth);
        document.getElementById("battlesnake").setAttribute("height",document.getElementById("battlesnake").offsetHeight);
        game.mainLoop();
    };

    game.mainLoop = function(){
        game.width = Math.round(document.getElementById("battlesnake").getAttribute("width")/10)*10;
        game.height = Math.round(document.getElementById("battlesnake").getAttribute("height")/10)*10;
        var block = 10;
        if(game.flags.gameover){
            console.log("Game over");
            return;
        }
        if(game.flags.paused){
            // Paused loop
            setTimeout(game.mainLoop,1000/game.frameRate);
            return;
        }
        game.canvas.clearRect(0,0,game.width,game.height);

        // Generate food
        if(game.food.a.length < game.food.max && Math.round(Math.random()*55) == Math.round(Math.random()*55)){
            game.food.a.push([Math.round(Math.random()*game.width/10)*10,Math.round(Math.random()*game.height/10)*10,Math.round(Math.random()*4)]);
        }
        // Draw food
        if(game.shadow.dir){
            game.shadow.val += 0.07;
            if(game.shadow.val > 1) game.shadow.dir = false;
        }else{
            game.shadow.val -= 0.07;
            if(game.shadow.val < 0) game.shadow.dir = true;
        }

        for(var i in game.food.a){
            game.canvas.shadowColor = game.food.colors[game.food.a[i][2]];
            game.canvas.shadowBlur = game.shadow.val * 18;
            game.canvas.fillStyle = game.food.colors[game.food.a[i][2]];
            // game.canvas.fillRect(game.food.a[i][0],game.food.a[i][1],block,block);
            game.canvas.beginPath();
            game.canvas.arc(game.food.a[i][0]+block/2,game.food.a[i][1]+block/2, block/2, 0, 2 * Math.PI, false);
            game.canvas.fill();
        }

        game.canvas.shadowColor = '#999';
        game.canvas.shadowBlur = 0;
        game.canvas.fill();

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
        if(game.keys.w) game.p1.y -= block;
        if(game.keys.s) game.p1.y += block;
        if(game.keys.a) game.p1.x -= block;
        if(game.keys.d) game.p1.x += block;

        if(game.p1.x < 0) game.p1.x = game.width;
        if(game.p1.x > game.width) game.p1.x = 0;
        if(game.p1.y < 0) game.p1.y = game.height;
        if(game.p1.y > game.height) game.p1.y = 0;

        if(game.keys.up) game.p2.y -= block;
        if(game.keys.down) game.p2.y += block;
        if(game.keys.left) game.p2.x -= block;
        if(game.keys.right) game.p2.x += block;

        if(game.p2.x < 0) game.p2.x = game.width;
        if(game.p2.x > game.width) game.p2.x = 0;
        if(game.p2.y < 0) game.p2.y = game.height;
        if(game.p2.y > game.height) game.p2.y = 0;

        // Check for collisions
        var collisions = 0;
        for(i in game.p1.train){
            if(game.p1.train[i][0] == game.p1.x && game.p1.train[i][1] == game.p1.y){
                game.flags.gameover = true;
                collisions++;
                console.log("p1 collided with self");
                break;
            }
            if(game.p1.train[i][0] == game.p2.x && game.p1.train[i][1] == game.p2.y){
                game.flags.gameover = true;
                collisions++;
                console.log("p2 collided with p1");
                break;
            }
        }

        for(i in game.p2.train){
            if(game.p2.train[i][0] == game.p2.x && game.p2.train[i][1] == game.p2.y){
                game.flags.gameover = true;
                collisions++;
                console.log("p2 collided with self");
                break;
            }

            if(game.p2.train[i][0] == game.p1.x && game.p2.train[i][1] == game.p1.y){
                game.flags.gameover = true;
                collisions++;
                console.log("p1 collided with p2");
                break;
            }

        }

        if(collisions > 1) console.log("Tie!");
        if(collisions >= 1){
            console.log("gayme over");
            return;
        }

        // Check for food
        for(i in game.food.a){
            if(game.food.a[i][0] == game.p2.x && game.food.a[i][1] == game.p2.y){
                game.p2.len += (game.food.a[i][2]+3)*2;
                game.food.a.splice(i,1);
                break;
            }

            if(game.food.a[i][0] == game.p1.x && game.food.a[i][1] == game.p1.y){
                game.p1.len += (game.food.a[i][2]+3)*2;
                game.food.a.splice(i,1);
                break;
            }
        }

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
        // console.log(game.keys);

        setTimeout(game.mainLoop,1000/game.frameRate);
    };

    game.pause = function(t){
        game.flags.paused = t;
    };
}());