/* 
* @Author: bbales
* @Date:   2015-02-22 20:57:41
* @Last Modified by:   bbales
* @Last Modified time: 2015-02-23 01:10:00
*/

(function(){
    'use strict';

    function getKeyDown(e){
        // Only one key in each set at a time
        if((game.keys.w || game.keys.s) && (e.which == 87 || e.which == 83)) return;
        if((game.keys.a || game.keys.d) && (e.which == 65 || e.which == 68)) return;

        if((game.keys.up || game.keys.down) && (e.which == 38 || e.which == 40)) return;
        if((game.keys.right || game.keys.left) && (e.which == 37 || e.which == 39)) return;

        if([87,83,65,68].indexOf(e.which) != -1){
            game.keys.w = game.keys.s = game.keys.a = game.keys.d = false;
        }

        if([38,40,37,39].indexOf(e.which) != -1){
            game.keys.up = game.keys.down = game.keys.left = game.keys.right = false;
        }

        switch(e.which){
            case 87:
                game.keys.w = true;
                break;
            case 83:
                game.keys.s = true;
                break;
            case 65:
                game.keys.a = true;
                break;
            case 68:
                game.keys.d = true;
                break;
            case 38:
                game.keys.up = true;
                break;
            case 40:
                game.keys.down = true;
                break;
            case 37:
                game.keys.left = true;
                break;
            case 39:
                game.keys.right = true;
                break;
        }
    }

    window.addEventListener("keydown",getKeyDown,false);
    
    window.addEventListener("resize",function(){
        document.getElementById("battlesnake").setAttribute("width",document.getElementById("battlesnake").offsetWidth);
        document.getElementById("battlesnake").setAttribute("height",document.getElementById("battlesnake").offsetHeight);
    },false);

    window.onscroll = function () { window.scrollTo(0, 0); return false;};
}());