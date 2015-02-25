/* 
* @Author: bbales
* @Date:   2015-02-23 11:40:08
* @Last Modified by:   bbales
* @Last Modified time: 2015-02-24 20:26:08
*/
var size = [window.width,window.height];

(function(){
    'use strict';

    game.reset = function(){
        game.flags.gameover = false;
        game.flags.tie = false;

        game.p1.len = 3;
        game.p2.len = 3;
        game.p1.train = [];
        game.p2.train = [];

        game.food.a = [];
        game.bullets.a = [];
        game.explosions = [];

        game.snakes.addPoints('p1',0);
        game.snakes.addPoints('p2',0);
    };

    game.quantize = function(int){
        return Math.round(int/10)*10;
    };

    game.showOverlay = function(set){
        if(set){
            document.getElementsByTagName("body")[0].style.cursor = "default";
            document.getElementById("overlay").className = "overlay shown";
        }else{
            document.getElementsByTagName("body")[0].style.cursor = "none";
            document.getElementById("overlay").className = "overlay hidden";
        }
    };

    game.sizeBoard = function(){
        document.getElementById("battlesnake").setAttribute("width",document.getElementById("battlesnake").offsetWidth);
        document.getElementById("battlesnake").setAttribute("height",document.getElementById("battlesnake").offsetHeight);
        game.width = game.quantize(document.getElementById("battlesnake").getAttribute("width"));
        game.height = game.quantize(document.getElementById("battlesnake").getAttribute("height"));
    };

    game.generateFood = function(){
        // Check for food
        for(var i in game.food.a){
            if(game.food.a[i][0] == game.p2.x && game.food.a[i][1] == game.p2.y){
                game.snakes.addPoints('p2',(game.food.a[i][2]+3)*2);
                game.addExplosion(game.food.colors[game.food.a[i][2]],50+Math.round(Math.random()*60),game.food.a[i][0],game.food.a[i][1],(game.food.a[i][2]+3)*2,15);
                game.food.a.splice(i,1);
                break;
            }

            if(game.food.a[i][0] == game.p1.x && game.food.a[i][1] == game.p1.y){
                game.snakes.addPoints('p1',(game.food.a[i][2]+3)*2);
                game.addExplosion(game.food.colors[game.food.a[i][2]],50+Math.round(Math.random()*60),game.food.a[i][0],game.food.a[i][1],(game.food.a[i][2]+3)*2,15);
                game.food.a.splice(i,1);
                break;
            }
        }


        // Generate food
        if(game.food.a.length < game.food.max && Math.round(Math.random()*35) == Math.round(Math.random()*35)){
            game.food.a.push([game.quantize(Math.random()*game.width),game.quantize(Math.random()*game.height),Math.round(Math.random()*4)]);
        }

        // Food glow
        if(game.shadow.dir){
            game.shadow.val += 0.07;
            if(game.shadow.val > 1) game.shadow.dir = false;
        }else{
            game.shadow.val -= 0.07;
            if(game.shadow.val < 0) game.shadow.dir = true;
        }

        // Draw food
        for(i in game.food.a){
            game.canvas.shadowColor = game.food.colors[game.food.a[i][2]];
            game.canvas.shadowBlur = game.shadow.val * 18;
            game.canvas.fillStyle = game.food.colors[game.food.a[i][2]];
            game.canvas.beginPath();
            game.canvas.arc(game.food.a[i][0]+game.block/2,game.food.a[i][1]+game.block/2, game.block/2, 0, 2 * Math.PI, false);
            game.canvas.fill();
            game.canvas.fillStyle = "#000";
            game.canvas.beginPath();
            game.canvas.arc(game.food.a[i][0]+game.block/2,game.food.a[i][1]+game.block/2, game.block/3.5, 0, 2 * Math.PI, false);
            game.canvas.fill();
        }

        game.canvas.shadowColor = '#999';
        game.canvas.shadowBlur = 0;
        game.canvas.fill();

        game.generateSuperFood();
    };

    game.pause = function(t){
        if(game.flags.gameover) return;
        game.flags.paused = t;
        if(t){
            document.getElementsByClassName("paused")[0].style.display = "block";
            document.getElementsByTagName("body")[0].style.cursor = "default";
        }else{
            document.getElementsByClassName("paused")[0].style.display = "none";
            document.getElementsByTagName("body")[0].style.cursor = "none";
        }
    };

    game.generateSuperFood = function(){
        // Check for food
        var points = 50;
        for(var i in game.food.b){
            if(game.food.b[i][0] == game.p2.x && game.food.b[i][1] == game.p2.y){
                game.snakes.addPoints('p2',points);
                game.addExplosion("#46FF00",50+Math.round(Math.random()*60),game.food.b[i][0],game.food.b[i][1],points,20);
                game.food.b.splice(i,1);
                break;
            }

            if(game.food.b[i][0] == game.p1.x && game.food.b[i][1] == game.p1.y){
                game.snakes.addPoints('p1',points);
                game.addExplosion("#46FF00",50+Math.round(Math.random()*60),game.food.b[i][0],game.food.b[i][1],points,20);
                game.food.b.splice(i,1);
                break;
            }
        }

        // Generate food
        if(game.food.b.length < game.food.superMax && Math.round(Math.random()*20) == Math.round(Math.random()*20)){
            game.food.b.push([game.quantize(Math.random()*game.width),game.quantize(Math.random()*game.height),Math.round(Math.random()*4)]);
        }

        // Food glow
        if(game.shadow.dir){
            game.shadow.val += 0.07;
            if(game.shadow.val > 1) game.shadow.dir = false;
        }else{
            game.shadow.val -= 0.07;
            if(game.shadow.val < 0) game.shadow.dir = true;
        }

        // Draw food
        for(i in game.food.b){
            game.canvas.shadowColor = "#FFFF00";
            game.canvas.shadowBlur = Math.sin(2*game.shadow.val) * 35;
            game.canvas.fillStyle = "#00FF05";
            game.canvas.beginPath();
            game.canvas.arc(game.food.b[i][0]+game.block/2,game.food.b[i][1]+game.block/2, game.block/2, 0, 2 * Math.PI, false);
            game.canvas.fill();
            game.canvas.fillStyle = "#F7FF45";
            game.canvas.beginPath();
            game.canvas.arc(game.food.b[i][0]+game.block/2,game.food.b[i][1]+game.block/2, game.block/4, 0, 2 * Math.PI, false);
            game.canvas.fill();
        }

        game.canvas.shadowColor = '#999';
        game.canvas.shadowBlur = 0;
        game.canvas.fill();
    };

    window.addEventListener("resize",function(){
        document.getElementById("battlesnake").setAttribute("width",document.getElementById("battlesnake").offsetWidth);
        document.getElementById("battlesnake").setAttribute("height",document.getElementById("battlesnake").offsetHeight);
        game.width = Math.round(document.getElementById("battlesnake").getAttribute("width")/10)*10;
        game.height = Math.round(document.getElementById("battlesnake").getAttribute("height")/10)*10;
    },false);

    window.onscroll = function () { window.scrollTo(0, 0); return false;};
}());