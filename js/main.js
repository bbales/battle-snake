/* 
* @Author: bbales
* @Date:   2015-02-22 20:57:45
* @Last Modified by:   bbales
* @Last Modified time: 2015-02-24 19:09:47
*/


(function(){
    'use strict';

    game.start = function(){
        game.reset();

        game.canvas = document.getElementById("battlesnake").getContext("2d");
        game.sizeBoard();
        // Position players
        var height = game.quantize((game.height/2)*1);
        var w1 = game.quantize((game.width/4));
        var w2 = game.quantize((game.width/4)*3);

        game.p1.x = w1;
        game.p1.y = height;

        game.p2.x = w2;
        game.p2.y = height;


        // Start main loop
        game.showOverlay(false);
        setTimeout(game.mainLoop,1100);
    };

    game.over = function(){
        game.pause(false);
        game.showOverlay(true);

        for(var i = 0; i < document.getElementsByClassName("gameresult").length; i++){
            document.getElementsByClassName("gameresult")[i].style.display = "none";
        }

        if(game.flags.tie === true){
            document.getElementsByClassName("tie")[0].style.display = "block";
        }else{
            switch(game.flags.result){
                case P1LOSS:
                    game.snakes.addWin('p2');
                    document.getElementsByClassName("p2win")[0].style.display = "block";
                    break;
                case P2LOSS:
                    game.snakes.addWin('p2');
                    document.getElementsByClassName("p1win")[0].style.display = "block";
                    break;
            }
        }
    };

    game.mainLoop = function(){
        game.sizeBoard();
        
        // Check for game over
        if(game.flags.gameover){
            game.over();
            return;
        }

        // Stall if paused
        if(game.flags.paused){
            // Paused loop
            setTimeout(game.mainLoop,1000/game.frameRate);
            return;
        }

        // Reset canvas
        game.canvas.clearRect(0,0,game.width+game.block,game.height+game.block);

        game.controls();

        // Draw snakes
        game.snakes.draw("p1");
        game.snakes.draw("p2");

        // Draw food
        game.generateFood();

        // Bullets
        game.bullets.generate();
        
        // Draw any explosions
        game.drawExplosions();

        // Check for collisions
        var collisions = 0;

        for(var i in game.p1.train){
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

        // Player collisions (tie)
        if(game.p1.x == game.p2.x && game.p1.y == game.p2.y){
            game.flags.tie = true;
            game.flags.gameover = true;
        }
        
        if(collisions > 1) game.flags.tie = true;
        if(collisions >= 1 || game.flags.tie){
            game.flags.gameover = true;
            game.over();
            return;
        }
        

        // Push new tracers
        if(game.p2.train.length >= game.p2.len) game.p2.train.pop();
        game.p2.train.unshift([game.p2.x,game.p2.y]);

        if(game.p1.train.length >= game.p1.len) game.p1.train.pop();
        game.p1.train.unshift([game.p1.x,game.p1.y]);


        setTimeout(game.mainLoop,1000/game.frameRate);
    };
}());