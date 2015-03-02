/* 
* @Author: bbales
* @Date:   2015-02-22 20:57:50
* @Last Modified by:   bbales
* @Last Modified time: 2015-03-01 20:26:22
*/

// constants
var P1LOSS = 1;
var P2LOSS = 2;
var UP = 1;
var DOWN = 2;
var LEFT = 3;
var RIGHT = 4;

// Main config
var game = {
    block : 10,
    frameRate : 26,
    frame : 0,
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

        fire1 : 0,
        fire2 : 0
    },
    lastkeys : undefined,
    canvas : null,
    food : {
        max : 10,
        superMax : 1,
        a : [],
        b : [],
        colors : ["rgba(255,252,99,1)",
                  "rgba(255,216,99,1)",
                  "rgba(255,176,99,1)",
                  "rgba(255,135,99,1)",
                  "rgba(255,95,99,1)"],
    },
    bullets : {
        frequency : 6,
        a : [],
        b : [],
        max : 2,
    },
    armour : {
        p1 : {
            enabled : false,
            shown : true,
            counter : 0,
            timeout : 0
        },
        p2 : {
            enabled : false,
            shown : true,
            counter : 0,
            timeout : 0
        },
        a : [],
        frequency : 20,
        seconds : 15,
    },
    explosions : [],
    shadow : {
        dir : true,
        val : 0,
    },

    p1 : {
        // UP DOWN LEFT RIGHT FIRE
        controls : [87,83,65,68,32],
        color: "0,150,255",
        bullets : 0,
        dir : 1,
        x : 200,
        y : 200,
        len : 3,
        train : [],
        wins : 0,
    },

    p2 : {
        controls : [38,40,37,39,13],
        color : "225,80,0",
        bullets : 0,
        dir : 1,
        x : 500,
        y : 200,
        len : 3,
        train : [],
        wins : 0,
    }
};

