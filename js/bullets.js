/* 
* @Author: bbales
* @Date:   2015-02-24 13:41:01
* @Last Modified by:   bbales
* @Last Modified time: 2015-02-25 21:46:07
*/

(function(){
    'use strict';

    game.bullets.frequency = 250;

    game.bullets.addBullet = function(sn){
        var bullet = {
            x : game[sn].x,
            y : game[sn].y,
            dir : game[sn].dir,
        };
        // Decement selected snakes bullets
        game[sn].bullets --;

        game.bullets.a.push(bullet);
    };

    game.bullets.generate = function(){
        var speed = 2*game.block;
        var i, j;
        var toRemove = [];
        var tracers = [];

        // Try to add a bullet to the board
        game.bullets.addToBoard();

        for(i in game.bullets.a){
            // Calculate new location
            switch(game.bullets.a[i].dir){
                case UP:
                    game.bullets.a[i].y -= speed;
                    break;
                case DOWN:
                    game.bullets.a[i].y += speed;
                    break;
                case LEFT:
                    game.bullets.a[i].x -= speed;
                    break;
                case RIGHT:
                    game.bullets.a[i].x += speed;
                    break;
            }

            // Draw
            game.canvas.shadowColor = "#B4B4B4";
            game.canvas.shadowBlur = game.shadow.val * 8;
            game.canvas.fillStyle = "#101010";
            game.canvas.beginPath();
            game.canvas.arc(game.bullets.a[i].x+game.block/2,game.bullets.a[i].y+game.block/2, game.block/2, 0, 2 * Math.PI, false);
            game.canvas.fill();

            // Check for collisions
            // Check for train collisions
            toRemove = [];
            tracers = [game.bullets.a[i].x,game.bullets.a[i].y];
            
            switch(game.bullets.a[i].dir){
                case UP:
                    tracers[1] = game.bullets.a[i].y + game.block;
                    break;
                case DOWN:
                    tracers[1] = game.bullets.a[i].y - game.block;
                    break;
                case LEFT:
                    tracers[0] = game.bullets.a[i].x + game.block;
                    break;
                case RIGHT:
                    tracers[0] = game.bullets.a[i].x - game.block;
                    break;
            }
            
            // Headshots
            if((game.bullets.a[i].x == game.p2.x && game.bullets.a[i].y == game.p2.y) || (tracers[0] == game.p2.x && tracers[1] == game.p2.y)){
                game.flags.result = P2LOSS;
                game.flags.gameover = true;
                break;
            }

            if((game.bullets.a[i].x == game.p1.x && game.bullets.a[i].y == game.p1.y) || (tracers[0] == game.p1.x && tracers[1] == game.p1.y)){
                game.flags.result = P1LOSS;
                game.flags.gameover = true;
                break;
            }

            // Tailshots
            for(j in game.p1.train){
                if((game.bullets.a[i].x == game.p1.train[j][0] && game.bullets.a[i].y == game.p1.train[j][1]) || (tracers[0] == game.p1.train[j][0] && tracers[1] == game.p1.train[j][1])){
                    game.addExplosion("rgba("+game.p1.color+",1)",90,game.bullets.a[i].x,game.bullets.a[i].y,0,20,"BANGIN' EM");
                    game.bullets.cutTrain('p1',j);
                    toRemove.push(i);
                }
            }

            for(j in game.p2.train){
                if((game.bullets.a[i].x == game.p2.train[j][0] && game.bullets.a[i].y == game.p2.train[j][1]) || (tracers[0] == game.p2.train[j][0] && tracers[1] == game.p2.train[j][1])){
                    game.addExplosion("rgba("+game.p2.color+",1)",90,game.bullets.a[i].x,game.bullets.a[i].y,0,20,"BANGIN' EM");
                    game.bullets.cutTrain('p2',j);
                    toRemove.push(i);
                }
            }


            // Bullets out of bounds
            if(game.bullets.a[i].x < 0 || game.bullets.a[i].x > game.width || game.bullets.a[i].y > game.height || game.bullets.a[i].y < 0) toRemove.push(i);
        }

        // Remove bullets        
        for(i in toRemove){
            game.bullets.a.splice(toRemove[i],1);
        }
    };

    game.bullets.addToBoard = function(){
        if(game.bullets.a.length === 1) return;
        // Random frequency
        if(Math.round(Math.random()*game.bullets.frequency) !== Math.round(Math.random()*game.bullets.frequency)) return;
        // Add one to the board

    };

    game.bullets.cutTrain = function(sn,i){
        var num = game[sn].len - (i);
        game.snakes.addPoints(sn,-1 * num);
        game[sn].train.splice(i,num);
    };
}());