/* 
* @Author: bbales
* @Date:   2015-02-22 20:57:50
* @Last Modified by:   bbales
* @Last Modified time: 2015-02-23 17:52:19
*/

var game = {
    frameRate : 26,
    flags : {
        gameover : false,
        paused : false,
        tie : false,
        result : undefined,
    },

    keys : {
        w : false,
        s : false,
        a : false,
        d : false,
        up : false,
        down : false,
        left : false,
        right : false,
    },
    lastkeys : undefined,
    canvas : null,
    food : {
        max : 10,
        a : [],
        colors : ["rgba(255,252,99,1)",
                  "rgba(255,216,99,1)",
                  "rgba(255,176,99,1)",
                  "rgba(255,135,99,1)",
                  "rgba(255,95,99,1)"],
    },
    explosions : [],
    shadow : {
        dir : true,
        val : 0,
    },

    p1 : {
        dir : 1,
        x : 200,
        y : 200,
        len : 3,
        train : []
    },

    p2 : {
        x : 500,
        y : 200,
        len : 3,
        train : []
    }
};

