/* 
* @Author: bbales
* @Date:   2015-02-24 13:41:01
* @Last Modified by:   bbales
* @Last Modified time: 2015-03-01 20:39:16
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
        game.armour.addArmour();
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
                    if(!game.armour.p1.enabled){
                        game.addExplosion("rgba("+game.p1.color+",1)",90,game.bullets.a[i].x,game.bullets.a[i].y,0,20,"BANGIN' EM");
                        game.bullets.cutTrain('p1',j);
                    }else{
                        game.addExplosion("rgba("+game.p1.color+",1)",90,game.bullets.a[i].x,game.bullets.a[i].y,0,20,"BLOCKED");
                    }
                    toRemove.push(i);
                }
            }

            for(j in game.p2.train){
                if((game.bullets.a[i].x == game.p2.train[j][0] && game.bullets.a[i].y == game.p2.train[j][1]) || (tracers[0] == game.p2.train[j][0] && tracers[1] == game.p2.train[j][1])){
                    if(!game.armour.p2.enabled){
                        game.addExplosion("rgba("+game.p2.color+",1)",90,game.bullets.a[i].x,game.bullets.a[i].y,0,20,"BANGIN' EM");
                        game.bullets.cutTrain('p2',j);
                    }else{
                        game.addExplosion("rgba("+game.p2.color+",1)",90,game.bullets.a[i].x,game.bullets.a[i].y,0,20,"BLOCKED");
                    }
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

    game.bullets.addToBoard = function(force){
        var img = new Image();
        var toRemove  = [];
        img.src = 'img/bullets.png';
        // Draw any bullets
        for(var i in game.bullets.b){
            game.canvas.drawImage(img,game.bullets.b[i][0] - game.block*0.4/2,game.bullets.b[i][1]- game.block*0.4/2 - 1,game.block * 1.4,game.block * 1.4);
            
            // Check for collisions
            if((game.bullets.b[i][0] == game.p2.x && game.bullets.b[i][1] == game.p2.y)){
                if(game.p2.bullets === game.bullets.max){
                    game.addExplosion("#FAE60E",90,game.bullets.b[i][0],game.bullets.b[i][1],0,20,"MAX BULLETS");
                }else{
                    game.p2.bullets++;
                    game.addExplosion("#FAE60E",90,game.bullets.b[i][0],game.bullets.b[i][1],0,20,"+ BULLET");
                }

                toRemove.push(i);
                break;
            }

            if((game.bullets.b[i][0] == game.p1.x && game.bullets.b[i][1] == game.p1.y)){
                if(game.p1.bullets === game.bullets.max){
                    game.addExplosion("#FAE60E",90,game.bullets.b[i][0],game.bullets.b[i][1],0,20,"MAX BULLETS");
                }else{
                    game.p1.bullets++;
                    game.addExplosion("#FAE60E",90,game.bullets.b[i][0],game.bullets.b[i][1],0,20,"+ BULLET");
                }
                
                toRemove.push(i);
                break;
            }
        }

        // Remove bullets        
        for(i in toRemove){
            game.bullets.b.splice(toRemove[i],1);
        }

        if(game.bullets.b.length === 1) return;
        // Random frequency
        if((Math.round(Math.random()*game.bullets.frequency) !== Math.round(Math.random()*game.bullets.frequency)) || force === true) return;
        // Add one to the board
        game.bullets.b.push([game.quantize(Math.random()*game.width),game.quantize(Math.random()*game.height)]);
    };

    game.bullets.cutTrain = function(sn,i){
        var num = game[sn].len - (i);
        game.snakes.addPoints(sn,-1 * num);
        game[sn].train.splice(i,num);
    };

    game.armour.addArmour = function(force){
        var img = new Image();
        var toRemove  = [];
        img.src = 'img/shield.png';
        // Draw any bullets
        for(var i in game.armour.a){
            game.canvas.drawImage(img,game.armour.a[i][0] - game.block*0.4/2,game.armour.a[i][1]- game.block*0.4/2 - 1,game.block * 1.4,game.block * 1.4);
            
            // Check for collisions
            if((game.armour.a[i][0] == game.p2.x && game.armour.a[i][1] == game.p2.y)){
                game.addExplosion("#D3D3D3",70,game.armour.a[i][0],game.armour.a[i][1],0,20,"+ ARMOUR");
                game.armour.p2.enabled = true;
                game.armour.p2.timeout = game.armour.seconds * game.frameRate;
                toRemove.push(i);
                break;
            }

            if((game.armour.a[i][0] == game.p1.x && game.armour.a[i][1] == game.p1.y)){
                game.addExplosion("#D3D3D3",70,game.armour.a[i][0],game.armour.a[i][1],0,20,"+ ARMOUR");
                game.armour.p1.enabled = true;
                game.armour.p1.timeout = game.armour.seconds * game.frameRate;
                toRemove.push(i);
                break;
            }
        }

        // Remove bullets        
        for(i in toRemove){
            game.armour.a.splice(toRemove[i],1);
        }

        if(game.armour.a.length === 1) return;
        // Random frequency
        if((Math.round(Math.random()*game.armour.frequency) !== Math.round(Math.random()*game.armour.frequency)) || force === true) return;
        // Add one to the board
        game.armour.a.push([game.quantize(Math.random()*game.width),game.quantize(Math.random()*game.height)]);
    };
}());