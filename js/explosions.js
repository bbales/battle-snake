/* 
* @Author: bbales
* @Date:   2015-02-23 11:40:08
* @Last Modified by:   bbales
* @Last Modified time: 2015-02-24 19:48:59
*/

(function(){
    'use strict';

    game.addExplosion = function(color, max, x, y, points,font, message){
        if(typeof message === "undefined"){
            message = undefined;
        }

        var numAngles = 6 + Math.round(Math.random()*15);
        var angles = [];
        var sizes = [];
        var speed = [];
        for(var i = 0; i < numAngles; i++){
            angles.push(Math.round(Math.random()*360));
            sizes.push(4+Math.round(Math.random()*30));
            speed.push(2+Math.round(Math.random()*6));
        }
        console.log(angles);
        game.explosions.push({color: color, max : max, x : x, y : y,font : font, current : 0, angles : angles, sizes : sizes, speed : speed, points : points, message : message});
    };

    game.drawExplosions = function(){
        var i,j = 0;
        var toRemove = [];
        var origin,move,line,shim,tempAngles,max;
        var RAD = 0.0174532925;
        var xdir,ydir, completion;
        for(i in game.explosions){
            tempAngles = clone(game.explosions[i].angles);
            origin = [game.explosions[i].x,game.explosions[i].y];

            for(j in game.explosions[i].angles){
                if(game.explosions[i].angles[j] < 90){
                    ydir = xdir = 1;
                }else if(game.explosions[i].angles[j] < 180){
                    tempAngles[j]-=90;
                    xdir = -1;
                    ydir = 1;
                }else if(game.explosions[i].angles[j] < 270){
                    tempAngles[j]-=180;
                    ydir = xdir = -1;
                }else{
                    tempAngles[j]-=270;
                    ydir = -1;
                    xdir = 1;
                }
                shim = Math.easeOutQuad(game.explosions[i].current,2,200,80) * game.explosions[i].speed[j];
                move = [origin[0] + xdir*shim*Math.cos(tempAngles[j]*RAD),
                        origin[1] + ydir*shim*Math.sin(tempAngles[j]*RAD)];
                max = [origin[0] + xdir*game.explosions[i].max*(1+game.explosions[i].sizes[j]/23)*Math.cos(tempAngles[j]*RAD),
                       origin[1] + ydir*game.explosions[i].max*(1+game.explosions[i].sizes[j]/23)*Math.sin(tempAngles[j]*RAD)];
                line = [move[0] + xdir*game.explosions[i].sizes[j]*Math.cos(tempAngles[j]*RAD),
                        move[1] + ydir*game.explosions[i].sizes[j]*Math.sin(tempAngles[j]*RAD)];
                if((line[0] > max[0] && xdir === 1) || (line[0] < max[0] && xdir === -1)) line = clone(max);

                game.canvas.beginPath();
                game.canvas.shadowColor = "#D6D6D6";
                game.canvas.shadowBlur = 13;
                game.canvas.moveTo(move[0],move[1]);
                if((line[0] - move[0] < 0 && xdir === -1) || (line[0] - move[0] > 0 && xdir === 1)) game.canvas.lineTo(line[0],line[1]);
                game.canvas.lineWidth = 2;
                game.canvas.strokeStyle = game.explosions[i].color;
                game.canvas.fill();
                game.canvas.stroke();
            }

            // Text
            if(game.explosions[i].message === undefined){
                completion = game.explosions[i].current/(game.explosions[i].max*0.7);
                game.canvas.font = 'normal '+game.explosions[i].font+'pt karma';
                game.canvas.globalAlpha = 1-completion;
                game.canvas.fillStyle = game.explosions[i].color;
                if(1 - completion > 0) game.canvas.fillText('+'+game.explosions[i].points, origin[0] + 15, origin[1] - 15 - completion*10);
            }else if(game.explosions[i].message !== undefined){
                completion = game.explosions[i].current/(game.explosions[i].max*0.7);
                game.canvas.font = 'normal '+game.explosions[i].font+'pt karma';
                game.canvas.globalAlpha = 1-completion;
                game.canvas.fillStyle = game.explosions[i].color;
                if(1 - completion > 0) game.canvas.fillText(game.explosions[i].message, origin[0] + 15, origin[1] - 15 - completion*10);
            }
            
            game.canvas.globalAlpha = 1;

            game.explosions[i].current++;
            if(game.explosions[i].current > game.explosions[i].max) toRemove.push(i);
        }
        
        game.canvas.shadowColor = '#999';
        game.canvas.shadowBlur = 0;
        game.canvas.fill();

        for(i in toRemove){
            game.explosions.splice(toRemove[i],1);
        }
    };

    function clone(obj) {
        if (null === obj || "object" !== typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }
}());