/****************************************************************
 *  Cedraro Andrea - mat. 404690                                *
 *  CG final project                                            *
 *  Villa Forni Cerato (Montecchio Precalcino, Vicenza, Italy)  *
 ****************************************************************/
var Domains = {
    D1: INTERVALS(1)(32),

    D2: {
    },

    D3: {
        LOW: DOMAIN([[0,1],[0,1],[0,1]])([8,1,8]),
        MID: DOMAIN([[0,1],[0,1],[0,1]])([16,1,16]),
        HIG: DOMAIN([[0,1],[0,1],[0,1]])([32,1,32])
    },

    DR: DOMAIN([[0,1],[0,2*PI]])([32,32])
};

var Colors = {
    walls: [234/255,227/255,220/255,1],
    wood: [150/255,120/255,100/255,1]
};

var X = 0;
var Y = 1;
var Z = 2;

var Utils = {
    sequence: function (o, n, tot_gap, direction) {
        var el = [];
        for (var i=0; i < n; i++) {
            el.push(o, T([direction])([tot_gap]));
        }
        return STRUCT(el);
   },

    translate: function (dims) {
        return function (values) {
            return function (object) {
                return object.translate(dims, values);
            };
        };
    },

    colorize: function (rgba) {
        return function (object) {
            return object.color(rgba);
        };
    }
};

var BASE_HEIGHT = 0.1;

var STEP_HEIGHT = 0.5;
var STEP_WIDTH= 9;//7;
var STEP_DEPTH= 1;
var N_STEPS = 15;

var LANDING_DEPTH = 8;
var HANDRAIL_WIDTH = 0.75;


var Stairs = function () {
    /************
     *  stairs  *
     ************/


    var base = T([X,Z])([-1.5, -BASE_HEIGHT])(SIMPLEX_GRID([ [N_STEPS * STEP_DEPTH + LANDING_DEPTH + 1.5], [STEP_WIDTH], [BASE_HEIGHT] ]));

    var steps = (function () {
        var step = SIMPLEX_GRID([[STEP_DEPTH],[STEP_WIDTH],[STEP_HEIGHT]]);
        var landing = SIMPLEX_GRID([[LANDING_DEPTH], [STEP_WIDTH], [STEP_HEIGHT]]);
        var el = [];
        for (var i=0; i < N_STEPS; i++) {
            el.push(step,T([X,Z])([STEP_DEPTH, STEP_HEIGHT]));
        }
        el.push(landing);
        return STRUCT(el);
    })();


    var handrail_in_down_points  = [[0,0,0],                              [N_STEPS * STEP_DEPTH,0,0]];
    var handrail_out_down_points = [[0,HANDRAIL_WIDTH,0],                 [N_STEPS * STEP_DEPTH,HANDRAIL_WIDTH,0]];
    var handrail_in_up_points    = [[0,0,6.5 * STEP_HEIGHT],              [N_STEPS * STEP_DEPTH,0,(6.5 + N_STEPS) * STEP_HEIGHT]];
    var handrail_out_up_points   = [[0,HANDRAIL_WIDTH,6.5 * STEP_HEIGHT], [N_STEPS * STEP_DEPTH,HANDRAIL_WIDTH,(6.5 + N_STEPS) * STEP_HEIGHT]];

    var handrail_in_down  = BEZIER(S0)(handrail_in_down_points);
    var handrail_out_down = BEZIER(S0)(handrail_out_down_points);
    var handrail_in_up    = BEZIER(S0)(handrail_in_up_points);
    var handrail_out_up   = BEZIER(S0)(handrail_out_up_points);

    var handrail_down = BEZIER(S1)([handrail_in_down, handrail_out_down]);
    var handrail_up   = BEZIER(S1)([handrail_in_up, handrail_out_up]);

    var ramp_handrail = MAP(BEZIER(S2)([handrail_down, handrail_up]))(Domains.D3.LOW);

    var arc_handrail_border = SIMPLEX_GRID([[2.66,-5], [HANDRAIL_WIDTH], [(6.5 + N_STEPS) * STEP_HEIGHT]]);

    var handrail_arc_down_in_points  = [[0,0,0],[0.65,0,2.4],[4.35,0,2.4],[5,0,0]];
    var handrail_arc_down_out_points = [[0,HANDRAIL_WIDTH,0],[0.84,HANDRAIL_WIDTH,2.4],[4.16,HANDRAIL_WIDTH,2.4],[5,HANDRAIL_WIDTH,0]];
    var handrail_arc_up_in_points    = [[0,0,5.33], [5,0,5.33]];
    var handrail_arc_up_out_points   = [[0,HANDRAIL_WIDTH,5.33], [5,HANDRAIL_WIDTH,5.33]];


    var handrail_arc_down_in  = BEZIER(S0)(handrail_arc_down_in_points);
    var handrail_arc_down_out = BEZIER(S0)(handrail_arc_down_out_points);
    var handrail_arc_up_in    = BEZIER(S0)(handrail_arc_up_in_points);
    var handrail_arc_up_out   = BEZIER(S0)(handrail_arc_up_out_points);

    var handrail_arc_up   = BEZIER(S1)([handrail_arc_up_in, handrail_arc_up_out]);
    var handrail_arc_down = BEZIER(S1)([handrail_arc_down_in, handrail_arc_down_out]);

    var handrail_arc = MAP(BEZIER(S2)([handrail_arc_up, handrail_arc_down]))(Domains.D3.HIG);

    var handrail = STRUCT([ramp_handrail, T([X])([N_STEPS * STEP_DEPTH]), arc_handrail_border, T([X,Z])([2.66,((6.5 + N_STEPS) * STEP_HEIGHT) - 5.33]), handrail_arc]);

    return STRUCT([handrail, T([Y])([HANDRAIL_WIDTH]), steps, T([Y])(STEP_WIDTH), handrail]);
};

var WALL_DEPTH = 2;
var BASEMENT_HEIGHT = 7.23;

var Basement = function () {

    var w_1 = STRUCT([
                    SIMPLEX_GRID([[WALL_DEPTH],[2,-3.7,HANDRAIL_WIDTH + STEP_WIDTH + HANDRAIL_WIDTH,-3.7,2],[BASEMENT_HEIGHT]]),
                    SIMPLEX_GRID([[WALL_DEPTH],[-2,3.7,-(HANDRAIL_WIDTH + STEP_WIDTH + HANDRAIL_WIDTH),-3.7,2],[3.4,-2.13,1.7]])
                ]);

    var w_2 = SIMPLEX_GRID([[4],[WALL_DEPTH],[BASEMENT_HEIGHT]]);

    var w_3 = STRUCT([SIMPLEX_GRID([[WALL_DEPTH],[8, -3.8, 8.5],[BASEMENT_HEIGHT]]), SIMPLEX_GRID([[WALL_DEPTH],[-8,3.8],[3.4,-3.32,0.51]])]);
    var w_4 = STRUCT([
                SIMPLEX_GRID([[3.5,-3.64,8.23,-3.64,14,-3.64,3.13],[WALL_DEPTH],[BASEMENT_HEIGHT]]),
                SIMPLEX_GRID([[-15.37, 3.64],[WALL_DEPTH],[3.4,-3.32,0.51]]),
                SIMPLEX_GRID([[-33.01, 3.64],[WALL_DEPTH],[3.4]]),
                SIMPLEX_GRID([[-3.5,3.64,-25.87,3.64],[WALL_DEPTH],[-5.53,1.7]])
    ]);

    var w_5 = STRUCT([
                SIMPLEX_GRID([[WALL_DEPTH],[8, -3.8, 2*(8.5 + 5.7 -WALL_DEPTH + HANDRAIL_WIDTH + STEP_WIDTH/2),-3.8,8],[BASEMENT_HEIGHT]]),
                SIMPLEX_GRID([[WALL_DEPTH],[-8, 3.8, -2*(8.5 + 5.7 -WALL_DEPTH + HANDRAIL_WIDTH + STEP_WIDTH/2),3.8,-8],[3.4,-3.32,0.51]])
    ]);

    return STRUCT([
        w_1,
        T([X])([WALL_DEPTH]),
        w_2,
        T([X,Y])([4,-20.3 + WALL_DEPTH]),
        w_3,
        T([X])([WALL_DEPTH]),
        w_4,
        T([X])([39.78]),
        w_5,
        T([X,Y])([-39.78, 2*(8+3.8+8.5+5.7 - WALL_DEPTH + HANDRAIL_WIDTH + STEP_WIDTH/2) ]),
        w_4,
        T([X,Y])([WALL_DEPTH,-20.3+WALL_DEPTH]),
        w_3,
        T([X])([4]),
        w_2
    ]);

};

var CURBE_DEPTH = WALL_DEPTH + 0.2;
var CURBE_HEIGHT = 0.75;

var Curbe = function () {

    var c_1 = SIMPLEX_GRID([[CURBE_DEPTH],[2*(0.2 + 5.7 + HANDRAIL_WIDTH + STEP_WIDTH/2)],[CURBE_HEIGHT]]);

    var c_2 = SIMPLEX_GRID([[4 - 0.2],[CURBE_DEPTH],[CURBE_HEIGHT]]);

    var c_3 = SIMPLEX_GRID([[CURBE_DEPTH],[20.5],[CURBE_HEIGHT]]);
    var c_4 = SIMPLEX_GRID([[39.78],[CURBE_DEPTH],[CURBE_HEIGHT]]);
    var c_5 = SIMPLEX_GRID([[CURBE_DEPTH],[2*(20.5 + 5.7 - WALL_DEPTH + HANDRAIL_WIDTH + STEP_WIDTH/2)],[CURBE_HEIGHT]]);

    return STRUCT([
        T([X,Y])([-0.2, -0.2]),
        c_1,
        T([X])([CURBE_DEPTH]),
        c_2,
        T([X,Y])([4 - 0.2,-20.5 + CURBE_DEPTH]),
        c_3,
        T([X])([CURBE_DEPTH]),
        c_4,
        T([X])([39.78]),
        c_5,
        T([X,Y])([-39.78,2*(20.5 + 5.7 - WALL_DEPTH + HANDRAIL_WIDTH + STEP_WIDTH/2)]),
        c_4
    ]);

};

var Floor = function () {
    var entrance = SIMPLEX_GRID([[6],[3.7 + HANDRAIL_WIDTH + STEP_WIDTH/2],[CURBE_HEIGHT]]);
    var inside = SIMPLEX_GRID([[39.78],[18.3+5.7+HANDRAIL_WIDTH+STEP_WIDTH/2],[CURBE_HEIGHT]]);

    var half_floor = STRUCT([
        T([X,Y])([WALL_DEPTH, WALL_DEPTH]),
        entrance,
        T([X,Y])([6,-18.5]),
        inside
    ]);

    return STRUCT([half_floor, T([Y])([2*(STEP_WIDTH/2 + HANDRAIL_WIDTH + 5.7)]), S([Y])([-1]), half_floor]);
};

var MIDDLE_WALL_HEIGHT = 2.46;

var Short_middle_wall = function () {


    var w_1 = SIMPLEX_GRID([[WALL_DEPTH],[20.3],[MIDDLE_WALL_HEIGHT]]);
    var d_1 = Utils.translate([X])([-0.15])(SIMPLEX_GRID([[0.25],[-(8-CURBE_HEIGHT), 3.8 + CURBE_HEIGHT + CURBE_HEIGHT], [MIDDLE_WALL_HEIGHT]]));
    var w_2 = SIMPLEX_GRID([[39.78],[WALL_DEPTH],[MIDDLE_WALL_HEIGHT]]);
    var w_3 = SIMPLEX_GRID([[WALL_DEPTH],[20.3+5.7+HANDRAIL_WIDTH + STEP_WIDTH/2],[MIDDLE_WALL_HEIGHT]]);


    var half_middle_wall = STRUCT([
        T([X,Y])([WALL_DEPTH+4,-(20.3 - WALL_DEPTH)]),
        w_1,
        d_1,
        T([X])([WALL_DEPTH]),
        w_2,
        T([X])([39.78]),
        w_3
    ]);

    return Utils.colorize(Colors.walls)(STRUCT([half_middle_wall, T([Y])([2*(STEP_WIDTH/2 + HANDRAIL_WIDTH + 5.7)]), S([Y])([-1]), half_middle_wall]));
};

var Curbe2 = function () {

    var c_2 = SIMPLEX_GRID([[4 - 0.2],[CURBE_DEPTH],[CURBE_HEIGHT]]);

    var c_3 = SIMPLEX_GRID([[CURBE_DEPTH],[20.5],[CURBE_HEIGHT]]);
    var d_1 = STRUCT([
        T([X])([-0.1]),
        SIMPLEX_GRID([[0.1],[3.8+0.8+0.8],[CURBE_HEIGHT]]),
        T([X])([-0.1]),
        SIMPLEX_GRID([[0.1],[3.8+0.8+0.8],[0.1,-(CURBE_HEIGHT - 0.1 -0.1),0.1]]),
        SIMPLEX_GRID([[0.1],[0.1,-(3.8+0.8+0.8-0.1-0.1),0.1],[-0.1,(CURBE_HEIGHT - 0.1 -0.1),-0.1]])
    ]).translate([Y],[8-0.6]);
    var c_4 = SIMPLEX_GRID([[39.78],[CURBE_DEPTH],[CURBE_HEIGHT]]);
    var c_5 = SIMPLEX_GRID([[CURBE_DEPTH],[20.5 + 5.7 - WALL_DEPTH + HANDRAIL_WIDTH + STEP_WIDTH/2],[CURBE_HEIGHT]]);

    //TODO: refactor this!!!
    var half_curbe = STRUCT([
        T([X,Y])([-0.2, -0.2]),
        T([X])([CURBE_DEPTH]),
        T([X,Y])([4 - 0.2,-20.5 + CURBE_DEPTH]),
        c_3,
        d_1,
        T([X])([CURBE_DEPTH]),
        c_4,
        T([X])([39.78]),
        c_5
    ]);

    return STRUCT([half_curbe, T([Y])([2*(STEP_WIDTH/2 + HANDRAIL_WIDTH + 5.7)]), S([Y])([-1]), half_curbe]);
};

var UPPER_WALL_HEIGHT = 18.86;

var Upper_wall = function () {

    var w_1 = STRUCT([
                     SIMPLEX_GRID([[WALL_DEPTH],[8, -3.8, 8.5],[UPPER_WALL_HEIGHT]]),
                     SIMPLEX_GRID([[WALL_DEPTH],[-8,3.8],[-7.34,8.3,-2.57,0.65]]),

                     //middle win decoration
                     Utils.translate([X,Y])([-0.1, 8-0.65])(SIMPLEX_GRID([[0.1], [3.8+0.65+0.65], [-7.34,0.65]])),
                     Utils.translate([X,Y])([-0.1, 8-0.65])(SIMPLEX_GRID([[0.1], [0.65,-3.8,0.65], [7.34]])),
                     Utils.translate([X,Y])([-0.2, 8-0.65])(SIMPLEX_GRID([[0.1], [3.8+0.65+0.65], [-7.79,0.2]])),
                     Utils.translate([X,Y])([-0.2, 8-0.65])(SIMPLEX_GRID([[0.1], [0.2,-4.7,0.2], [7.34+0.45]])),

                     //up win decoration
                     Utils.translate([X,Y,Z])([-0.1, 8-0.65, 15.64-0.65])(SIMPLEX_GRID([[0.1], [3.8+0.65+0.65], [0.65,-2.57,0.65]])),
                     Utils.translate([X,Y,Z])([-0.1, 8-0.65, 15.64])(SIMPLEX_GRID([[0.1], [0.65,-3.8,0.65], [2.57]])),
                     Utils.translate([X,Y,Z])([-0.2, 8-0.65, 15.64-0.65])(SIMPLEX_GRID([[0.1], [3.8+0.65+0.65], [0.2,-3.47,0.2]])),
                     Utils.translate([X,Y,Z])([-0.2, 8-0.65, 15.64-0.45])(SIMPLEX_GRID([[0.1], [0.2,-4.7,0.2], [0.45+2.57+0.45]]))
    ]);
    var w_2 = STRUCT([
                SIMPLEX_GRID([[3,-3.8,9.23,-3.8,3,-3.8,6.2,-3.8,3.15],[WALL_DEPTH],[UPPER_WALL_HEIGHT]]),
                SIMPLEX_GRID([[-3,3.8,-9.23,3.8,-13,3.8],[WALL_DEPTH],[-7.34,8.3,-2.57,0.65]]),
                SIMPLEX_GRID([[-22.83,3.8],[WALL_DEPTH],[0.24,-2.4,2.3,-2.4,8.3,-2.57,0.65]])
    ]);
    var w_3 = STRUCT([
                     SIMPLEX_GRID([[WALL_DEPTH],[8,-3.8,8.5 + 5.7+HANDRAIL_WIDTH + STEP_WIDTH/2],[UPPER_WALL_HEIGHT]]),
                     SIMPLEX_GRID([[WALL_DEPTH],[-8,3.8],[-7.34,8.3,-2.57,0.65]])
    ]);

    var half_upper_wall = STRUCT([
        T([X,Y])([WALL_DEPTH + 4, -20.3 + WALL_DEPTH]),
        w_1,
        T([X])([WALL_DEPTH]),
        w_2,
        T([X])([39.78]),
        w_3
    ]);


    return STRUCT([half_upper_wall, T([Y])([2*(STEP_WIDTH/2 + HANDRAIL_WIDTH + 5.7)]), S([Y])([-1]), half_upper_wall]);
};

var Front = function () {
    var columns_base = SIMPLEX_GRID([[2],[2,-3.7,2],[2.46]]);
    var columns_curbe = Utils.translate([X,Y])([-0.2,-0.2])(SIMPLEX_GRID([[2+ 0.4],[2+0.4,-3.3,2+0.4],[CURBE_HEIGHT]]));
    var columns_rest = SIMPLEX_GRID([[2],[2,-3.7,2],[7.34]]);//7.29
    var columns_conjuction = SIMPLEX_GRID([[2],[7.7],[0.27]]);//0.27
    var columns_unite_curbe = Utils.translate([X,Y])([-0.2,-0.2])(SIMPLEX_GRID([[2+ 0.4],[7.3+0.4+0.4],[CURBE_HEIGHT]]));
    var side_curbe = Utils.translate([X,Y])([2.2,-0.2])(SIMPLEX_GRID([[4-0.2],[2 + 0.4],[CURBE_HEIGHT]]));
    var front_border_window = SIMPLEX_GRID([[2],[2,-3.7,2],[10.5]]); //[((6.5 + N_STEPS) * STEP_HEIGHT)-BASEMENT_HEIGHT -CURBE_HEIGHT]]);
    var front_window = SIMPLEX_GRID([[2],[-2,3.7],[0.48,-2.57,4.23,-2.57,0.65]]);
    var front_statue_spot = SIMPLEX_GRID([[-1,1],[-2,3.7],[-0.48,2.56]]);
    var side_vertical_border_window = SIMPLEX_GRID([[-2,0.1,-3.7,0.2],[2],[10.5]]);
    var side_horizontal_border_window = SIMPLEX_GRID([[-2.1,3.7],[2],[0.48,-2.57,4.23,-2.57,0.65]]);
    var side_statue_spots = SIMPLEX_GRID([[-2.1,3.7],[-1,1],[-0.48,2.56,-4.24,2.56]]);
    var front_banister = Utils.translate([Y])([2.2])(SIMPLEX_GRID([[2],[3.7 - 0.2 - 0.2],[CURBE_HEIGHT]]));
    var side_banister = Utils.translate([X])([2.2])(SIMPLEX_GRID([[4 - 0.2 - 0.2],[2],[CURBE_HEIGHT]]));

    var front_arc_down_in_points  = [[0,0,0],[0,0,4.79],[0,6.5,4.79],[0,6.5,0]];
    var front_arc_down_out_points = [[2,0,0],[2,0,4.79],[2,6.5,4.79],[2,6.5,0]];
    var front_arc_up_in_points    = [[0,0,10.5],[0,6.5,10.5]];
    var front_arc_up_out_points   = [[2,0,10.5],[2,6.5,10.5]];

    var front_arc_down_in  = BEZIER(S0)(front_arc_down_in_points);
    var front_arc_down_out = BEZIER(S0)(front_arc_down_out_points);
    var front_arc_up_in    = BEZIER(S0)(front_arc_up_in_points);
    var front_arc_up_out   = BEZIER(S0)(front_arc_up_out_points);

    var front_arc_up   = BEZIER(S1)([front_arc_up_in, front_arc_up_out]);
    var front_arc_down = BEZIER(S1)([front_arc_down_in, front_arc_down_out]);

    var front_arc = Utils.translate([Y,Z])([7.7,2.46+CURBE_HEIGHT+7.34+0.27+CURBE_HEIGHT])(MAP(BEZIER(S2)([front_arc_up, front_arc_down]))(Domains.D3.HIG));

    var stake_down_points = [[-0.26,0,0],[0.13,0,0.35],[-0.42,0,0.57],[-0.2,0,1.12]];
    var stake_down_profile = BEZIER(S0)(stake_down_points);
    var stake_down_mapping = ROTATIONAL_SURFACE(stake_down_profile);
    var stake_down = MAP(stake_down_mapping)(Domains.DR);

    var stake_down_up = STRUCT([stake_down, T([Z])([2.46]),S([Z])([-1]), stake_down]);

    var stake_cyl_points = [[-0.1,0,1.08],[-0.3,0,1.12],[-0.3,0,1.34],[-0.1,0,1.38]];
    var stake_cyl_profile = BEZIER(S0)(stake_cyl_points);
    var stake_cyl_mapping = ROTATIONAL_SURFACE(stake_cyl_profile);
    var stake_cyl = MAP(stake_cyl_mapping)(Domains.DR);

    var stake = STRUCT([stake_down_up, stake_cyl]);

    var front_stakes = STRUCT([T([X,Y])([1,2]), stake, T([Y])([0.925]), stake, T([Y])([0.925]), stake, T([Y])([0.925]), stake, T([Y])([0.925]), stake]);
    var side_stakes = STRUCT([T([X,Y])([2,1]), stake, T([X])([1]), stake, T([X])([1]), stake, T([X])([1]), stake, T([X])([1]), stake]);

    var half_front = STRUCT([
        side_stakes,
        front_stakes,
        columns_base,
        T([Z])([2.46]),
        columns_curbe,
        front_banister,
        side_banister,
        T([Z])([CURBE_HEIGHT]),
        columns_rest,
        T([Z])([7.34]),
        columns_conjuction,
        T([Z])([0.27]),
        columns_unite_curbe,
        side_curbe,
        T([Z])([CURBE_HEIGHT]),
        front_border_window,
        front_window,
        front_statue_spot,
        side_vertical_border_window,
        side_horizontal_border_window,
        side_statue_spots
    ]);



    return STRUCT([front_arc, half_front, T([Y])([2*(STEP_WIDTH/2 + HANDRAIL_WIDTH + 5.7)]), S([Y])([-1]), half_front]);
};

var Entrance_Wall = function () {

    var w_1 = SIMPLEX_GRID([[3.2],[WALL_DEPTH],[MIDDLE_WALL_HEIGHT + CURBE_HEIGHT + UPPER_WALL_HEIGHT]]);
    var w_2 = STRUCT([
            SIMPLEX_GRID([[WALL_DEPTH],[WALL_DEPTH + 3.7 + WALL_DEPTH],[MIDDLE_WALL_HEIGHT + CURBE_HEIGHT + UPPER_WALL_HEIGHT]]),
            SIMPLEX_GRID([[WALL_DEPTH],[-(WALL_DEPTH + 3.7 + WALL_DEPTH), STEP_WIDTH/2],[-8.46, (MIDDLE_WALL_HEIGHT + CURBE_HEIGHT + UPPER_WALL_HEIGHT - 8.46)]])
    ]);

    var half_entrance = STRUCT([
        T([X])([WALL_DEPTH + 4 + WALL_DEPTH]),
        w_1,
        T([X])([3.2]),
        w_2
    ]);

    return STRUCT([half_entrance, T([Y])([2*(STEP_WIDTH/2 + HANDRAIL_WIDTH + 5.7)]), S([Y])([-1]), half_entrance]);
};

var Roof_Curbe = function () {

    var c_1 = SIMPLEX_GRID([[CURBE_DEPTH],[0.2 + 5.7 + HANDRAIL_WIDTH + STEP_WIDTH/2],[CURBE_HEIGHT]]);
    var c_2 = SIMPLEX_GRID([[4 - 0.2],[CURBE_DEPTH],[CURBE_HEIGHT]]);
    var c_3 = SIMPLEX_GRID([[CURBE_DEPTH],[20.5],[CURBE_HEIGHT]]);
    var c_4 = SIMPLEX_GRID([[39.78],[CURBE_DEPTH],[CURBE_HEIGHT]]);
    var c_5 = SIMPLEX_GRID([[CURBE_DEPTH],[20.5 + 5.7 - WALL_DEPTH + HANDRAIL_WIDTH + STEP_WIDTH/2],[CURBE_HEIGHT]]);

    var w_1 = SIMPLEX_GRID([[WALL_DEPTH],[5.7+HANDRAIL_WIDTH + STEP_WIDTH/2],[1]]);
    var w_2 = SIMPLEX_GRID([[4],[WALL_DEPTH],[1]]);
    var w_3 = SIMPLEX_GRID([[WALL_DEPTH],[20.3],[1]]);
    var w_4 = SIMPLEX_GRID([[39.78],[WALL_DEPTH],[1]]);
    var w_5 = SIMPLEX_GRID([[WALL_DEPTH],[20.3+5.7+HANDRAIL_WIDTH + STEP_WIDTH/2],[1]]);



    var half_roof_middle_wall = STRUCT([
        T([Z])([CURBE_HEIGHT]),
        w_1,
        T([X])([WALL_DEPTH]),
        w_2,
        T([X,Y])([4,-20.3 + WALL_DEPTH]),
        w_3,
        T([X])([WALL_DEPTH]),
        w_4,
        T([X])([39.78]),
        w_5
    ]);

    var half_roof_curbe = STRUCT([
        half_roof_middle_wall,
        T([X,Y])([-0.2, -0.2]),
        c_1,
        T([X])([CURBE_DEPTH]),
        c_2,
        T([X,Y])([4 - 0.2,-20.5 + CURBE_DEPTH]),
        c_3,
        T([X])([CURBE_DEPTH]),
        c_4,
        T([X])([39.78]),
        c_5
    ]);

    return STRUCT([half_roof_curbe, T([Y])([2*(STEP_WIDTH/2 + HANDRAIL_WIDTH + 5.7)]), S([Y])([-1]), half_roof_curbe]);

};

var PLACEHOLDER = true; //more fast to calculate

var Roof_Stakes = function () {

    var half_roof_stakes;

    if (!PLACEHOLDER) {
        var roof_stake_down_in_points = [[0,0,0],[-0.1,0,0.74],[-0.76,0,0.31],[-0.83,0,1]];
        var roof_stake_down_out_points = [[0,0.43,0],[-0.1,0.43,0.74],[-0.76,0.43,0.31],[-0.83,0.43,1]];
        var roof_stake_up_in_points = [[0,0,1],[-0.83,0,1]];
        var roof_stake_up_out_points = [[0,0.43,1],[-0.83,0.43,1]];

        var roof_stake_down_in  = BEZIER(S0)(roof_stake_down_in_points);
        var roof_stake_down_out = BEZIER(S0)(roof_stake_down_out_points);
        var roof_stake_up_in    = BEZIER(S0)(roof_stake_up_in_points);
        var roof_stake_up_out   = BEZIER(S0)(roof_stake_up_out_points);

        var roof_stake_up   = BEZIER(S1)([roof_stake_up_in, roof_stake_up_out]);
        var roof_stake_down = BEZIER(S1)([roof_stake_down_in, roof_stake_down_out]);

        var roof_stake = MAP(BEZIER(S2)([roof_stake_up, roof_stake_down]))(Domains.D3.LOW);
        Utils.colorize([0.8,0,0,1])(roof_stake);

        var side_roof_stake = R([X,Y])([PI/2])(roof_stake);
        var back_roof_stake = R([X,Y])([PI])(roof_stake);

        var r_1 = Utils.sequence(roof_stake, 10, 0.43+0.65, Y);
        var r_2 = Utils.sequence(side_roof_stake, 6, 0.43+0.65, X);
        var r_3 = Utils.sequence(roof_stake, 17, 0.43+0.65, Y);
        var r_4 = Utils.sequence(side_roof_stake, 40, 0.43+0.65,X);

        half_roof_stakes = STRUCT([
            rp_1,
            rp_2,
            T([X,Y])([WALL_DEPTH + 4, -20.3 + WALL_DEPTH]),
            rp_3,
            T([X])([0.43]),
            rp_4,
            T([X])([39.78 + 2*WALL_DEPTH - 0.43]),
            rp_5
        ]);
    }
    else {

        var roof_placeholder_stake      = Utils.translate([X])([-0.83])(CUBOID([0.83,0.43,1]));
        var side_roof_placeholder_stake = Utils.translate([Y])([-0.83])(CUBOID([0.43,0.83,1]));
        var back_roof_placeholder_stake = CUBOID([0.83,0.43,1]);


        var rp_1 = Utils.sequence(roof_placeholder_stake, 10, 0.43+0.65, Y);
        var rp_2 = Utils.sequence(side_roof_placeholder_stake, 5, 0.43+0.65, X);
        var rp_3 = Utils.sequence(roof_placeholder_stake, 17, 0.43+0.65, Y);
        var rp_4 = Utils.sequence(side_roof_placeholder_stake, 40, 0.43+0.65,X);
        var rp_5 = Utils.sequence(back_roof_placeholder_stake, 27, 0.43+0.65,Y);

        half_roof_stakes = STRUCT([
            rp_1,
            rp_2,
            T([X,Y])([WALL_DEPTH + 4, -20.3 + WALL_DEPTH]),
            rp_3,
            T([X])([0.43]),
            rp_4,
            T([X])([39.78 + 2*WALL_DEPTH - 0.43]),
            rp_5
        ]);
    }

    return STRUCT([half_roof_stakes, T([Y])([2*(STEP_WIDTH/2 + HANDRAIL_WIDTH + 5.7)]), S([Y])([-1]), half_roof_stakes]);
};

var Front_Basement_Grid = function () {
    var vert_bar = CYL_SURFACE([0.05,2.15])([32]);
    var hori_bar = R([Y,Z])([PI/2])(CYL_SURFACE([0.05,3.8])([32])).translate([Y],[3.75]);

    var vert_grid = Utils.sequence(vert_bar, 7, 0.45, Y).translate([X,Y,Z], [0.5,2.45,3.39]);
    var hori_grid = Utils.sequence(hori_bar, 4, 0.45, Z).translate([X,Y,Z], [0.5,2,3.85]);


    var half_grid = STRUCT([vert_grid, hori_grid]);

    return STRUCT([half_grid, T([Y])([2*(STEP_WIDTH/2 + HANDRAIL_WIDTH + 5.7)]), S([Y])([-1]), half_grid]);

};

var Basement_Blind = function () {
    var board = Utils.colorize(Colors.wood)(SIMPLEX_GRID([[0.1],[0.9],[3.2]]));
    var right_hinge = Utils.colorize([0.1,0.1,0.1,1])(SIMPLEX_GRID([[0.05],[1.7],[0.2]])).translate([X,Z],[-0.05,0.5]);
    var left_hinge = Utils.colorize([0.1,0.1,0.1,1])(SIMPLEX_GRID([[0.05],[1.7],[0.2]])).translate([X,Y,Z],[-0.05,2.1,0.5]);

    var blind = STRUCT([
        Utils.sequence(board, 4, 0.95, Y),
        Utils.sequence(right_hinge,2,2,Z),
        Utils.sequence(left_hinge,2,2,Z)
    ]);


    return blind.translate([X,Y,Z], [WALL_DEPTH + 4 + 0.1,-20.3 + WALL_DEPTH + 8, 3.41]);
};

var Upper_Window_Blind = function () {
    var board = Utils.colorize(Colors.wood)(SIMPLEX_GRID([[0.1],[0.9],[7.32]]));
    var right_hinge = Utils.colorize([0.1,0.1,0.1,1])(SIMPLEX_GRID([[0.05],[1.7],[0.2]])).translate([X,Z],[-0.05,0.5]);
    var left_hinge = Utils.colorize([0.1,0.1,0.1,1])(SIMPLEX_GRID([[0.05],[1.7],[0.2]])).translate([X,Y,Z],[-0.05,2.1,0.5]);

    var blind = STRUCT([
        Utils.sequence(board,4,0.95,Y),
        Utils.sequence(right_hinge,2,6,Z),
        Utils.sequence(left_hinge,2,6,Z)
    ]);

    return blind.translate([X,Y], [WALL_DEPTH + 4 + 0.1,-20.3 + WALL_DEPTH + 8]);
};

var Window_Decoration = function () {
    var front_win_middle_wall = SIMPLEX_GRID([0.1,3.8+0.75+0.75, MIDDLE_WALL_HEIGHT]);
};

var stairs = Utils.translate([X,Y])([-N_STEPS * STEP_DEPTH - 2.66 - 5,5.7])(Stairs());


var villa = STRUCT([
    stairs,
    Utils.colorize(Colors.walls)(Basement()),
    Utils.colorize([0.1,0.1,0.1,1])(Front_Basement_Grid()),
    Basement_Blind(),
    T([Z])([BASEMENT_HEIGHT]),
    Curbe(),
    Floor(),
    T([Z])([CURBE_HEIGHT]),
    Short_middle_wall(),
    Entrance_Wall(),
    Utils.colorize(Colors.walls)(Front()),
    T([Z])([MIDDLE_WALL_HEIGHT]),
    Curbe2(),
    T([Z])([CURBE_HEIGHT]),
    Utils.colorize(Colors.walls)(Upper_wall()),
    Upper_Window_Blind(),
    T([Z])([UPPER_WALL_HEIGHT]),
    Roof_Curbe(),
    T([Z])([CURBE_HEIGHT])
    // Roof_Stakes()
]);
DRAW(villa);
