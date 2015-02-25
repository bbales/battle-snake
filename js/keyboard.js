/* 
* @Author: bbales
* @Date:   2015-02-22 20:57:41
* @Last Modified by:   bbales
* @Last Modified time: 2015-02-24 20:25:17
*/

(function(){
    'use strict';

    game.controls = function(){
        // Set initial direction of each snake
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

        // Put this frame's keys into temporary object to prevent changes in the frame
        var tempKeys = game.keys;

        // Dont allow going backward
        if(game.lastkeys !== undefined){
            if(game.p1.dir === UP && tempKeys.s){tempKeys.s = false; tempKeys.w = true;}
            else if(game.p1.dir === DOWN && tempKeys.w){tempKeys.w = false; tempKeys.s = true;}
            else if(game.p1.dir === LEFT && tempKeys.d){tempKeys.d = false; tempKeys.a = true;}
            else if(game.p1.dir === RIGHT && tempKeys.a){tempKeys.a = false; tempKeys.d = true;}

            if(game.p2.dir === UP && tempKeys.down){tempKeys.down = false; tempKeys.up = true;}
            else if(game.p2.dir === DOWN && tempKeys.up){tempKeys.up = false; tempKeys.down = true;}
            else if(game.p2.dir === LEFT && tempKeys.right){tempKeys.right = false; tempKeys.left = true;}
            else if(game.p2.dir === RIGHT && tempKeys.left){tempKeys.left = false; tempKeys.right = true;}
        }

        // Set last keys
        game.lastkeys = tempKeys;

        // Detect direction
        if(tempKeys.w){
            game.p1.dir = UP;
            game.p1.y -= game.block;
        }else if(tempKeys.s){
            game.p1.dir = DOWN;
            game.p1.y += game.block;
        }else if(tempKeys.a){
            game.p1.dir = LEFT;
            game.p1.x -= game.block;
        }else if(tempKeys.d){
            game.p1.dir = RIGHT;
            game.p1.x += game.block;
        }

        if(tempKeys.up){
            game.p2.dir = UP;
            game.p2.y -= game.block;
        }else if(tempKeys.down){
            game.p2.dir = DOWN;
            game.p2.y += game.block;
        }else if(tempKeys.left){
            game.p2.dir = LEFT;
            game.p2.x -= game.block;
        }else if(tempKeys.right){
            game.p2.dir = RIGHT;
            game.p2.x += game.block;
        }

        // Edge detection
        if(game.p1.x < 0) game.p1.x = game.width-game.block;
        else if(game.p1.x >= game.width-game.block) game.p1.x = 0;
        if(game.p1.y < 0) game.p1.y = game.height - game.block;
        else if(game.p1.y > game.height - game.block) game.p1.y = 0;

        if(game.p2.x < 0) game.p2.x = game.width-game.block;
        else if(game.p2.x > game.width-game.block) game.p2.x = 0;
        if(game.p2.y < 0) game.p2.y = game.height-game.block;
        else if(game.p2.y > game.height-game.block) game.p2.y = 0;

        // Bullets
        if(tempKeys.fire1 === 1){
            game.bullets.addBullet("p1");
            game.keys.fire1 = 2;
        }

        if(tempKeys.fire2 === 1){
            game.bullets.addBullet("p2");
            game.keys.fire2 = 2;
        }
    };

    function getKeyDown(e){
        // Pause
        if(e.which == 80){
            return game.pause(!game.flags.paused);
        }

        if(game.p1.controls.slice(0,4).indexOf(e.which) != -1){
            game.keys.w = game.keys.s = game.keys.a = game.keys.d = false;
        }

        if(game.p2.controls.slice(0,4).indexOf(e.which) != -1){
            game.keys.up = game.keys.down = game.keys.left = game.keys.right = false;
        }

        switch(e.which){
            case game.p1.controls[0]:
                game.keys.w = true;
                break;
            case game.p1.controls[1]:
                game.keys.s = true;
                break;
            case game.p1.controls[2]:
                game.keys.a = true;
                break;
            case game.p1.controls[3]:
                game.keys.d = true;
                break;
            case game.p2.controls[0]:
                game.keys.up = true;
                break;
            case game.p2.controls[1]:
                game.keys.down = true;
                break;
            case game.p2.controls[2]:
                game.keys.left = true;
                break;
            case game.p2.controls[3]:
                game.keys.right = true;
                break;
        }

        switch(e.which){
            case game.p1.controls[4]:
                if(game.keys.fire1 === 0) game.keys.fire1 = 1;
                break;
            case game.p2.controls[4]:
                if(game.keys.fire2 === 0) game.keys.fire2 = 1;
                break;
        }
    }

    function getKeyUp(e){
        switch(e.which){
            case game.p1.controls[4]:
                game.keys.fire1 = 0;
                break;
            case game.p2.controls[4]:
                game.keys.fire2 = 0;
                break;
        }

        if(e.which === 32 && game.flags.gameover){
            game.start();
        }
    }

    window.addEventListener("keydown",getKeyDown,false);
    window.addEventListener("keyup",getKeyUp,false);

}());