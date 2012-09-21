/****************************************************************
 *  Cedraro Andrea - mat. 404690                                *
 *  CG final project                                            *
 *  Villa Forni Cerato (Montecchio Precalcino, Vicenza, Italy)  *
 ****************************************************************/
var Domains = {
    D1: INTERVALS(1)(32),

    D2: DOMAIN([[0,1],[0,1]])([16,16]),

    D3: {
        LOW: DOMAIN([[0,1],[0,1],[0,1]])([8,1,8]),
        MID: DOMAIN([[0,1],[0,1],[0,1]])([16,1,16]),
        HIG: DOMAIN([[0,1],[0,1],[0,1]])([32,1,32])
    },

    DR: {
        WHOLE: DOMAIN([[0,1],[0,2*PI]])([32,32]),
        HALF:  DOMAIN([[0,2],[PI/2,3/2*PI]])([32,32])
    }

};

var Colors = {
    walls: [240/255,235/255,230/255,1],
    middle_decoration: [220/255,200/255,170/255,1],
    window_decoration: [240/255,230/255,210/255,1],
    yellow_decoration: [220/255,200/255,170/255,1],
    curbe: [160/255,150/255,140/255,1],
    stair: [100/255,90/255,80/255,1],
    wood:  [150/255,120/255,100/255,1],
    roof:  [186/255,136/255,120/255,1],
    grass: [100/255,170/255,80/255,1],
    iron:  [0.1,0.1,0.1,1]
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

    quarter_sphere: function (r) {
        var domain = DOMAIN([[0,PI/2],[0,PI]])([20,40]);
        var mapping = function(p) {
            var u = p[0];
            var v = p[1];
            return [r*COS(u)*COS(v),r*COS(u)*SIN(v),r*SIN(u)];
        };
        return MAP(mapping)(domain);
    }
};

var BASE_HEIGHT = 0.1;

var STEP_HEIGHT = 0.5;
var STEP_WIDTH= 9;//7;
var STEP_DEPTH= 1;
var N_STEPS = 15;

var LANDING_DEPTH = 8;
var HANDRAIL_WIDTH = 0.75;

var Base = function () {
    return SIMPLEX_GRID([[130],[100],[0.1]]).translate([X,Y,Z],[-40,-40,-0.1]).color(Colors.grass);
};

var Stairs = function () {
    /************
     *  stairs  *
     ************/
    var steps = (function () {
        var step = SIMPLEX_GRID([[STEP_DEPTH],[STEP_WIDTH/2],[STEP_HEIGHT]]);
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

    var half_stairs = STRUCT([handrail, T([Y])([HANDRAIL_WIDTH]), steps]);

    return STRUCT([half_stairs, T([Y])([2*( HANDRAIL_WIDTH + STEP_WIDTH/2 )]), S([Y])([-1]), half_stairs]);
};

var WALL_DEPTH = 2;
var BASEMENT_HEIGHT = 7.23;

var Basement = function () {

    var w_1 = STRUCT([
        SIMPLEX_GRID([[WALL_DEPTH],[2,-3.7,HANDRAIL_WIDTH + STEP_WIDTH/2],[BASEMENT_HEIGHT]]),
        SIMPLEX_GRID([[WALL_DEPTH],[-2,3.7],[3.4,-2.13,1.7]])
    ]).color(Colors.walls);


    var w_2 = SIMPLEX_GRID([[4],[WALL_DEPTH],[BASEMENT_HEIGHT]]).color(Colors.walls);

    var w_3 = STRUCT([
        SIMPLEX_GRID([[WALL_DEPTH],[8, -3.8, 8.5],[BASEMENT_HEIGHT]]),
        SIMPLEX_GRID([[WALL_DEPTH],[-8,3.8],[3.4,-3.32,0.51]])
    ]).color(Colors.walls);

    var b_1 = Basement_Blind().translate([Y,Z],[8,3.4]);

    var w_4 = STRUCT([
        SIMPLEX_GRID([[3,-3.8,9.23,-3.8,13,-3.8,3.15],[WALL_DEPTH],[BASEMENT_HEIGHT]]),
        SIMPLEX_GRID([[-16.03, 3.8],[WALL_DEPTH],[3.4,-3.32,0.51]]),
        SIMPLEX_GRID([[-32.83, 3.8],[WALL_DEPTH],[3.4]]),
        SIMPLEX_GRID([[-3,3.8,-26.03,3.8],[WALL_DEPTH],[-5.53,1.7]])
    ]).color(Colors.walls);

    var b_2 = Basement_Blind().rotate([X,Y],[PI/2]).translate([X,Z],[16.03+3.8,3.4]);

    var w_5 = STRUCT([
        SIMPLEX_GRID([[WALL_DEPTH],[8, -3.8, 8.5 + 5.7 -WALL_DEPTH + HANDRAIL_WIDTH + STEP_WIDTH/2],[BASEMENT_HEIGHT]]),
        SIMPLEX_GRID([[WALL_DEPTH],[-8,3.8],[3.4,-3.32,0.51]])
    ]).color(Colors.walls);

    var b_3 = Basement_Blind().rotate([X,Y],[PI]).translate([X,Y,Z],[WALL_DEPTH,8+3.8,3.4]);

    var half_basement = STRUCT([
        w_1,
        T([X])([WALL_DEPTH]),
        w_2,
        T([X,Y])([4,-20.3 + WALL_DEPTH]),
        w_3,
        b_1,
        T([X])([WALL_DEPTH]),
        b_2,
        w_4,
        T([X])([39.78]),
        w_5,
        b_3
    ]);


    return STRUCT([half_basement, T([Y])([2*(STEP_WIDTH/2 + HANDRAIL_WIDTH + 5.7)]), S([Y])([-1]), half_basement]);
};

var CURBE_DEPTH = WALL_DEPTH + 0.2;
var CURBE_HEIGHT = 0.75;

var Curbe = function () {

    var c_1 = SIMPLEX_GRID([[CURBE_DEPTH],[0.2 + 5.7 + HANDRAIL_WIDTH + STEP_WIDTH/2],[CURBE_HEIGHT]]);

    var c_2 = SIMPLEX_GRID([[4 - 0.2],[CURBE_DEPTH],[CURBE_HEIGHT]]);

    var c_3 = SIMPLEX_GRID([[CURBE_DEPTH],[20.5],[CURBE_HEIGHT]]);
    var c_4 = SIMPLEX_GRID([[39.78],[CURBE_DEPTH],[CURBE_HEIGHT]]);
    var c_5 = SIMPLEX_GRID([[CURBE_DEPTH],[20.5 + 5.7 - WALL_DEPTH + HANDRAIL_WIDTH + STEP_WIDTH/2],[CURBE_HEIGHT]]);

    var half_curbe = STRUCT([
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

    return STRUCT([half_curbe, T([Y])([2*(STEP_WIDTH/2 + HANDRAIL_WIDTH + 5.7)]), S([Y])([-1]), half_curbe]).color(Colors.walls);
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


    var w_1 = SIMPLEX_GRID([[WALL_DEPTH],[20.3],[MIDDLE_WALL_HEIGHT]]).color(Colors.walls);
    var d_1 = SIMPLEX_GRID([[0.25],[-(8-CURBE_HEIGHT), 3.8 + CURBE_HEIGHT + CURBE_HEIGHT], [MIDDLE_WALL_HEIGHT]]).translate([X],[-0.15]).color(Colors.middle_decoration);
    var w_2 = SIMPLEX_GRID([[39.78],[WALL_DEPTH],[MIDDLE_WALL_HEIGHT]]).color(Colors.walls);
    var w_3 = SIMPLEX_GRID([[WALL_DEPTH],[20.3+5.7+HANDRAIL_WIDTH + STEP_WIDTH/2],[MIDDLE_WALL_HEIGHT]]).color(Colors.walls);


    var half_middle_wall = STRUCT([
        T([X,Y])([WALL_DEPTH+4,-(20.3 - WALL_DEPTH)]),
        w_1,
        d_1,
        T([X])([WALL_DEPTH]),
        w_2,
        T([X])([39.78]),
        w_3
    ]);

    return STRUCT([half_middle_wall, T([Y])([2*(STEP_WIDTH/2 + HANDRAIL_WIDTH + 5.7)]), S([Y])([-1]), half_middle_wall]);
};

var Curbe2 = function () {

    var c_2 = SIMPLEX_GRID([[4 - 0.2],[CURBE_DEPTH],[CURBE_HEIGHT]]).color(Colors.walls);

    var c_3 = SIMPLEX_GRID([[CURBE_DEPTH],[20.5],[CURBE_HEIGHT]]).color(Colors.walls);
    var d_1 = STRUCT([
        T([X])([-0.1]),
        SIMPLEX_GRID([[0.1],[3.8+0.8+0.8],[CURBE_HEIGHT]]),
        T([X])([-0.1]),
        SIMPLEX_GRID([[0.1],[3.8+0.8+0.8],[0.1,-(CURBE_HEIGHT - 0.1 -0.1),0.1]]),
        SIMPLEX_GRID([[0.1],[0.1,-(3.8+0.8+0.8-0.1-0.1),0.1],[-0.1,(CURBE_HEIGHT - 0.1 -0.1),-0.1]])
    ]).translate([Y],[8-0.6]).color(Colors.window_decoration);
    var c_4 = SIMPLEX_GRID([[39.78],[CURBE_DEPTH],[CURBE_HEIGHT]]).color(Colors.walls);
    var c_5 = SIMPLEX_GRID([[CURBE_DEPTH],[20.5 + 5.7 - WALL_DEPTH + HANDRAIL_WIDTH + STEP_WIDTH/2],[CURBE_HEIGHT]]).color(Colors.walls);

    var half_curbe = STRUCT([
        T([X,Y])([4+CURBE_DEPTH-0.2-0.2, CURBE_DEPTH-0.2-20.5]),
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

    var profile = BEZIER(S0)([[0.2,0,0],[0.2,0,2.3]]);
    var mapping = ROTATIONAL_SURFACE(profile);
    var surface = MAP(mapping)(Domains.DR.HALF).rotate([1,2],[PI/2]);
    var left    = Utils.quarter_sphere(0.2).rotate([0,2],[-PI/2]);

    var f_right_in  = BEZIER(S0)([[0,0,0],[0,-0.2,0.3]]);
    var f_right_out = BEZIER(S0)([[-0.2,0,0],[-0.4,-0.2,0.3]]);
    var f_left_in   = BEZIER(S0)([[0,5.1,0],[0,5.3,0.3]]);
    var f_left_out  = BEZIER(S0)([[-0.2,5.1,0],[-0.4,5.3,0.3]]);

    var f_right = BEZIER(S1)([f_right_in,f_right_out]);
    var f_left  = BEZIER(S1)([f_left_in,f_left_out]);

    var f = MAP(BEZIER(S2)([f_right,f_left]))(Domains.D3.MID);

    var s_right_in  = BEZIER(S0)([[0,0,0],[0,-0.3,0.3]]);
    var s_right_out = BEZIER(S0)([[-0.5,0,0],[-0.8,-0.3,0.3]]);
    var s_left_in   = BEZIER(S0)([[0,5.7,0],[0,6,0.3]]);
    var s_left_out  = BEZIER(S0)([[-0.5,5.7,0],[-0.8,6,0.3]]);

    var s_right = BEZIER(S1)([s_right_in,s_right_out]);
    var s_left  = BEZIER(S1)([s_left_in,s_left_out]);

    var s = MAP(BEZIER(S2)([s_right,s_left]))(Domains.D3.MID);

    var w_1 = STRUCT([
                     SIMPLEX_GRID([[WALL_DEPTH],[8, -3.8, 8.5],[UPPER_WALL_HEIGHT]]).color(Colors.walls),
                     SIMPLEX_GRID([[WALL_DEPTH],[-8,3.8],[-7.34,8.3,-2.57,0.65]]).color(Colors.walls),

                     //middle win decoration
                     SIMPLEX_GRID([[0.1], [3.8+0.65+0.65], [-7.34,0.65]]).translate([X,Y],[-0.1, 8-0.65]).color(Colors.window_decoration),
                     SIMPLEX_GRID([[0.1], [0.65,-3.8,0.65], [7.34]]).translate([X,Y],[-0.1, 8-0.65]).color(Colors.window_decoration),
                     SIMPLEX_GRID([[0.1], [3.8+0.65+0.65], [-7.79,0.2]]).translate([X,Y],[-0.2, 8-0.65]).color(Colors.window_decoration),
                     SIMPLEX_GRID([[0.1], [0.2,-4.7,0.2], [7.34+0.45]]).translate([X,Y],[-0.2, 8-0.65]).color(Colors.window_decoration),

                     //round middle win decoration
                     STRUCT([left, surface, T([Y])([-5]), S([Y])([-1]), left, surface]).translate([Y,Z],[8+3.8+0.6,7.34+0.65+0.2]).color(Colors.window_decoration),

                     //first step
                     f.translate([Y,Z],[8-0.65,7.34+0.65+0.4]).color(Colors.window_decoration),

                     //second step
                     CUBOID([0.5,5.7,0.2]).translate([X,Y,Z],[-0.5,8-0.65-0.2-0.1,7.34+0.65+0.4+0.3]).color(Colors.window_decoration),

                     //third step
                     s.translate([Y,Z],[8-0.65-0.2-0.1,7.34+0.65+0.4+0.3+0.2]).color(Colors.window_decoration),


                     //up win decoration
                     SIMPLEX_GRID([[0.1], [3.8+0.65+0.65], [0.65,-2.57,0.65]]).translate([X,Y,Z],[-0.1, 8-0.65, 15.64-0.65]).color(Colors.window_decoration),
                     SIMPLEX_GRID([[0.1], [0.65,-3.8,0.65], [2.57]]).translate([X,Y,Z],[-0.1, 8-0.65, 15.64]).color(Colors.window_decoration),
                     SIMPLEX_GRID([[0.1], [3.8+0.65+0.65], [0.2,-3.47,0.2]]).translate([X,Y,Z],[-0.2, 8-0.65, 15.64-0.65]).color(Colors.window_decoration),
                     SIMPLEX_GRID([[0.1], [0.2,-4.7,0.2], [0.45+2.57+0.45]]).translate([X,Y,Z],[-0.2, 8-0.65, 15.64-0.45]).color(Colors.window_decoration)

    ]);

    var b_1 = Upper_Window_Blind().translate([Y],[8]);

    var w_2 = STRUCT([
                SIMPLEX_GRID([[3,-3.8,9.23,-3.8,3,-3.8,6.2,-3.8,3.15],[WALL_DEPTH],[UPPER_WALL_HEIGHT]]),
                SIMPLEX_GRID([[-3,3.8,-9.23,3.8,-13,3.8],[WALL_DEPTH],[-7.34,8.3,-2.57,0.65]]),
                SIMPLEX_GRID([[-22.83,3.8],[WALL_DEPTH],[0.24,-2.4,2.3,-2.4,8.3,-2.57,0.65]])
    ]).color(Colors.walls);

    var b_2 = Upper_Window_Blind().rotate([X,Y],[PI/2]).translate([X],[3+3.8]);
    var b_3 = Upper_Window_Blind().rotate([X,Y],[PI/2]).translate([X],[16.03+3.8]);
    var b_4 = Upper_Window_Blind().rotate([X,Y],[PI/2]).translate([X],[32.83+3.8]);


    var w_3 = STRUCT([
                     SIMPLEX_GRID([[WALL_DEPTH],[8,-3.8,8.5 + 5.7+HANDRAIL_WIDTH + STEP_WIDTH/2],[UPPER_WALL_HEIGHT]]),
                     SIMPLEX_GRID([[WALL_DEPTH],[-8,3.8],[-7.34,8.3,-2.57,0.65]])
    ]).color(Colors.walls);

    var b_5 = Upper_Window_Blind().rotate([X,Y],[PI]).translate([X],[WALL_DEPTH]).translate([Y],[3.8+8]);

    var half_upper_wall = STRUCT([
        T([X,Y])([WALL_DEPTH + 4, -20.3 + WALL_DEPTH]),
        w_1,
        b_1,
        T([X])([WALL_DEPTH]),
        w_2,
        b_2,
        b_3,
        b_4,
        T([X])([39.78]),
        w_3,
        b_5
    ]);


    return STRUCT([half_upper_wall, T([Y])([2*(STEP_WIDTH/2 + HANDRAIL_WIDTH + 5.7)]), S([Y])([-1]), half_upper_wall]);
};

var Front = function () {
    var columns_base = SIMPLEX_GRID([[2],[2,-3.7,2],[2.46]]);
    var columns_curbe = SIMPLEX_GRID([[2+ 0.4],[2+0.4,-3.3,2+0.4],[CURBE_HEIGHT]]).translate([X,Y],[-0.2,-0.2]);
    var columns_rest = SIMPLEX_GRID([[2],[2,-3.7,2],[7.34]]);
    var columns_conjuction = SIMPLEX_GRID([[2],[7.7],[0.27]]);
    var columns_unite_curbe = SIMPLEX_GRID([[2+ 0.4],[7.3+0.4+0.4],[CURBE_HEIGHT]]).translate([X,Y],[-0.2,-0.2]);
    var side_curbe = SIMPLEX_GRID([[4-0.2],[2 + 0.4],[CURBE_HEIGHT]]).translate([X,Y],[2.2,-0.2]);
    var front_border_window = SIMPLEX_GRID([[2],[2,-3.7,2],[10.5]]);
    var front_window = SIMPLEX_GRID([[2],[-2,3.7],[0.48,-2.57,4.23,-2.57,0.65]]);
    var front_statue_spot = SIMPLEX_GRID([[-1,1],[-2,3.7],[-0.48,2.56]]);
    var side_vertical_border_window = SIMPLEX_GRID([[-2,0.1,-3.7,0.2],[2],[10.5]]);
    var side_horizontal_border_window = SIMPLEX_GRID([[-2.1,3.7],[2],[0.48,-2.57,4.23,-2.57,0.65]]);
    var side_statue_spots = SIMPLEX_GRID([[-2.1,3.7],[-1,1],[-0.48,2.56,-4.24,2.56]]);
    var front_banister = SIMPLEX_GRID([[2],[3.7 - 0.2 - 0.2],[CURBE_HEIGHT]]).translate([Y],[2.2]);
    var side_banister = SIMPLEX_GRID([[4 - 0.2 - 0.2],[2],[CURBE_HEIGHT]]).translate([X],[2.2]);

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

    var front_arc = MAP(BEZIER(S2)([front_arc_up, front_arc_down]))(Domains.D3.HIG).translate([Y,Z],[7.7,2.46+CURBE_HEIGHT+7.34+0.27+CURBE_HEIGHT]).color(Colors.walls);

    var pillar_down_points = [[-0.26,0,0],[0.13,0,0.35],[-0.42,0,0.57],[-0.2,0,1.12]];
    var pillar_down_profile = BEZIER(S0)(pillar_down_points);
    var pillar_down_mapping = ROTATIONAL_SURFACE(pillar_down_profile);
    var pillar_down = MAP(pillar_down_mapping)(Domains.DR.WHOLE);

    var pillar_down_up = STRUCT([pillar_down, T([Z])([2.46]),S([Z])([-1]), pillar_down]);

    var pillar_cyl_points = [[-0.1,0,1.08],[-0.3,0,1.12],[-0.3,0,1.34],[-0.1,0,1.38]];
    var pillar_cyl_profile = BEZIER(S0)(pillar_cyl_points);
    var pillar_cyl_mapping = ROTATIONAL_SURFACE(pillar_cyl_profile);
    var pillar_cyl = MAP(pillar_cyl_mapping)(Domains.DR.WHOLE);

    var pillar = STRUCT([pillar_down_up, pillar_cyl]);

    var front_pillars = STRUCT([T([X,Y])([1,2]), pillar, T([Y])([0.925]), pillar, T([Y])([0.925]), pillar, T([Y])([0.925]), pillar, T([Y])([0.925]), pillar]);
    var side_pillars = STRUCT([T([X,Y])([2,1]), pillar, T([X])([1]), pillar, T([X])([1]), pillar, T([X])([1]), pillar, T([X])([1]), pillar]);

    var half_front = STRUCT([
        side_pillars,
        front_pillars,
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
    ]).color(Colors.walls);



    return STRUCT([front_arc, half_front, T([Y])([2*(STEP_WIDTH/2 + HANDRAIL_WIDTH + 5.7)]), S([Y])([-1]), half_front]);
};

var Entrance_Wall = function () {

    var profile = BEZIER(S0)([[0.2,0,0],[0.2,0,STEP_WIDTH/4 - 0.2]]);
    var mapping = ROTATIONAL_SURFACE(profile);
    var surface = MAP(mapping)(Domains.DR.HALF).rotate([1,2],[PI/2]);
    var left    = Utils.quarter_sphere(0.2).rotate([0,2],[-PI/2]);


    //
    var ubw_down_in = BEZIER(S0)([[0,(STEP_WIDTH/2+0.65)/2,0],[-0.1,(STEP_WIDTH/2+0.65)/2,0]]);
    var ubw_down_out  = BEZIER(S0)([[0,-1,0],[-0.1,-1,0]]);
    var ubw_up_left  = BEZIER(S0)([[0,(STEP_WIDTH/2+0.65)/2,0.4+0.65+0.3+0.3],[-0.1,(STEP_WIDTH/2+0.65)/2,0.4+0.65+0.3+0.3]]);

    var ubw_down = BEZIER(S1)([ubw_down_in,ubw_down_out]);
    var ubw_up  = BEZIER(S1)([ubw_down_in,ubw_up_left]);

    var ubw_right = MAP(BEZIER(S2)([ubw_down,ubw_up]))(Domains.D3.MID);

    var ubw_left = S([Y])([-1])(ubw_right).translate([Y],[STEP_WIDTH/2+0.65]);

    //
    var ur_right_in = BEZIER(S0)([[-0.1,-0.4,0],[-0.6,-0.4,0]]);
    var ur_right_out  = BEZIER(S0)([[-0.1,-1,0],[-0.9,-1,0]]);
    var ur_left_in   = BEZIER(S0)([[-0.1,(STEP_WIDTH/2+0.65)/2,0.4+0.65+0.3],[-0.6,(STEP_WIDTH/2+0.65)/2,0.4+0.65+0.3]]);
    var ur_left_out  = BEZIER(S0)([[-0.1,(STEP_WIDTH/2+0.65)/2,0.4+0.65+0.3+0.3],[-0.9,(STEP_WIDTH/2+0.65)/2,0.4+0.65+0.3+0.3]]);

    var ur_right = BEZIER(S1)([ur_right_in,ur_right_out]);
    var ur_left  = BEZIER(S1)([ur_left_in,ur_left_out]);

    var ur = MAP(BEZIER(S2)([ur_right,ur_left]))(Domains.D3.MID);

    //
    var ul_right_in   = BEZIER(S0)([[-0.1,(STEP_WIDTH/2+0.65)/2,0.4+0.65+0.3],[-0.6,(STEP_WIDTH/2+0.65)/2,0.4+0.65+0.3]]);
    var ul_right_out  = BEZIER(S0)([[-0.1,(STEP_WIDTH/2+0.65)/2,0.4+0.65+0.3+0.3],[-0.9,(STEP_WIDTH/2+0.65)/2,0.4+0.65+0.3+0.3]]);
    var ul_left_in = BEZIER(S0)([[-0.1,STEP_WIDTH/2+0.65+1-0.6,0],[-0.6,STEP_WIDTH/2+0.65+1-0.6,0]]);
    var ul_left_out  = BEZIER(S0)([[-0.1,STEP_WIDTH/2+0.65+1,0],[-0.9,STEP_WIDTH/2+0.65+1,0]]);

    var ul_right = BEZIER(S1)([ul_right_in,ul_right_out]);
    var ul_left  = BEZIER(S1)([ul_left_in,ul_left_out]);

    var ul = MAP(BEZIER(S2)([ul_right,ul_left]))(Domains.D3.MID);
    //
    var s_right_in  = BEZIER(S0)([[0,-0.6,0],[0,-1,0.3]]);
    var s_right_out = BEZIER(S0)([[-0.5,-0.6,0],[-0.9,-1,0.3]]);
    var s_left_in   = BEZIER(S0)([[0,STEP_WIDTH/2+0.65+0.6,0],[0,STEP_WIDTH/2+0.65+1,0.3]]);
    var s_left_out  = BEZIER(S0)([[-0.5,STEP_WIDTH/2+0.65+0.6,0],[-0.9,STEP_WIDTH/2+0.65+1,0.3]]);

    var s_right = BEZIER(S1)([s_right_in,s_right_out]);
    var s_left  = BEZIER(S1)([s_left_in,s_left_out]);

    var s = MAP(BEZIER(S2)([s_right,s_left]))(Domains.D3.MID);

    var w_1 = SIMPLEX_GRID([[3.2],[WALL_DEPTH],[MIDDLE_WALL_HEIGHT + 2*CURBE_HEIGHT + UPPER_WALL_HEIGHT + 1]]).color(Colors.walls);
    var w_2 = STRUCT([
            SIMPLEX_GRID([[WALL_DEPTH],[WALL_DEPTH + 3.7 + WALL_DEPTH+0.65+0.65],[MIDDLE_WALL_HEIGHT + 2*CURBE_HEIGHT + UPPER_WALL_HEIGHT + 1]]),
            SIMPLEX_GRID([[WALL_DEPTH],[-(WALL_DEPTH + 3.7 + WALL_DEPTH+0.65+0.65), STEP_WIDTH/2-0.65-0.65],[-8.46, (MIDDLE_WALL_HEIGHT + 2*CURBE_HEIGHT + UPPER_WALL_HEIGHT + 1 - 8.46)]])
    ]).color(Colors.walls);

    var d_1 = STRUCT([
        SIMPLEX_GRID([[0.1],[0.65],[8.46]]),
        SIMPLEX_GRID([[0.1],[STEP_WIDTH/2-0.65],[0.64]]).translate([Z],[8.46])
    ]).translate([X,Y],[-0.1,WALL_DEPTH+WALL_DEPTH+3.7+0.65]).color(Colors.window_decoration);

    var d_2 = STRUCT([
        //round decoration
        STRUCT([left, surface, T([Y])([-STEP_WIDTH/2-0.4]), S([Y])([-1]), left, surface]).translate([Y,Z],[WALL_DEPTH+WALL_DEPTH+3.7+0.65+STEP_WIDTH/2+0.65-0.1,8.46+0.65+0.2]),

        //step
        CUBOID([0.5,STEP_WIDTH/2+0.65,0.3]).translate([X,Y,Z],[-0.5,WALL_DEPTH+WALL_DEPTH+3.7+0.65,8.46+0.65+0.2+0.2]),

        //second step
        s.translate([Y,Z],[WALL_DEPTH+WALL_DEPTH+3.7+0.6,8.46+0.65+0.4+0.3]),

        ur.translate([Y,Z],[WALL_DEPTH+WALL_DEPTH+3.7+0.6,8.46+0.65+0.4+0.3+0.3]),
        ul.translate([Y,Z],[WALL_DEPTH+WALL_DEPTH+3.7+0.6,8.46+0.65+0.4+0.3+0.3]),
        ubw_right.translate([Y,Z],[WALL_DEPTH+WALL_DEPTH+3.7+0.6,8.46+0.65+0.4+0.3+0.3]),
        ubw_left.translate([Y,Z],[WALL_DEPTH+WALL_DEPTH+3.7+0.6,8.46+0.65+0.4+0.3+0.3])

    ]).translate([X],[WALL_DEPTH+4+WALL_DEPTH+3.2]).color(Colors.window_decoration);

    var half_entrance = STRUCT([
        T([X])([WALL_DEPTH + 4 + WALL_DEPTH]),
        w_1,
        T([X])([3.2]),
        w_2,
        d_1
    ]);

    return STRUCT([d_2,half_entrance, T([Y])([2*(STEP_WIDTH/2 + HANDRAIL_WIDTH + 5.7)]), S([Y])([-1]), half_entrance]);
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

    return STRUCT([half_roof_curbe, T([Y])([2*(STEP_WIDTH/2 + HANDRAIL_WIDTH + 5.7)]), S([Y])([-1]), half_roof_curbe]).color(Colors.yellow_decoration);

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

        var side_roof_stake = R([X,Y])([PI/2])(roof_stake);
        var back_roof_stake = R([X,Y])([PI])(roof_stake);

        var r_1 = Utils.sequence(roof_stake, 10, 0.43+0.65, Y);
        var r_2 = Utils.sequence(side_roof_stake, 6, 0.43+0.65, X);
        var r_3 = Utils.sequence(roof_stake, 17, 0.43+0.65, Y);
        var r_4 = Utils.sequence(side_roof_stake, 40, 0.43+0.65,X);
        var r_5 = Utils.sequence(back_roof_stake, 27, 0.43+0.65,Y);

        half_roof_stakes = STRUCT([
            r_1,
            r_2,
            T([X,Y])([WALL_DEPTH + 4, -20.3 + WALL_DEPTH]),
            r_3,
            T([X])([0.43]),
            r_4,
            T([X])([39.78 + 2*WALL_DEPTH - 0.43]),
            r_5
        ]);
    }
    else {

        var roof_placeholder_stake      = CUBOID([0.83,0.43,1]).translate([X],[-0.83]);
        var side_roof_placeholder_stake = CUBOID([0.43,0.83,1]).translate([Y],[-0.83]);
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
        ]).color(Colors.yellow_decoration);
    }

    return STRUCT([half_roof_stakes, T([Y])([2*(STEP_WIDTH/2 + HANDRAIL_WIDTH + 5.7)]), S([Y])([-1]), half_roof_stakes]);
};

var UPPER_ROOF_CURBE_DEPTH = WALL_DEPTH+0.83;
var Upper_Roof_Curbe = function () {

    var c_1 = SIMPLEX_GRID([[UPPER_ROOF_CURBE_DEPTH],[0.83 + 5.7 + HANDRAIL_WIDTH + STEP_WIDTH/2],[CURBE_HEIGHT/3]]);
    var c_1_2 = SIMPLEX_GRID([[UPPER_ROOF_CURBE_DEPTH+0.2],[0.2+0.83 + 5.7 + HANDRAIL_WIDTH + STEP_WIDTH/2],[CURBE_HEIGHT*2/3]]).translate([X,Y,Z],[-0.2,-0.2,CURBE_HEIGHT/3]);

    var c_2 = SIMPLEX_GRID([[4-0.83],[UPPER_ROOF_CURBE_DEPTH],[CURBE_HEIGHT/3]]);
    var c_2_2 = SIMPLEX_GRID([[4-0.83],[UPPER_ROOF_CURBE_DEPTH+0.2],[CURBE_HEIGHT*2/3]]).translate([Y,Z],[-0.2,CURBE_HEIGHT/3]);

    var c_3 = SIMPLEX_GRID([[UPPER_ROOF_CURBE_DEPTH],[21.13],[CURBE_HEIGHT]]);
    var c_4 = SIMPLEX_GRID([[39.78],[UPPER_ROOF_CURBE_DEPTH],[CURBE_HEIGHT]]);
    var c_5 = SIMPLEX_GRID([[UPPER_ROOF_CURBE_DEPTH],[20.5 + 0.83 + 5.7 - WALL_DEPTH + HANDRAIL_WIDTH + STEP_WIDTH/2],[CURBE_HEIGHT]]);

    var w_up_in = BEZIER(S0)([[0,0,0],[0,0.2+0.83 + 5.7 + HANDRAIL_WIDTH + STEP_WIDTH/2,5]]);
    var w_up_out = BEZIER(S0)([[1,0,0],[1,0.2+0.83 + 5.7 + HANDRAIL_WIDTH + STEP_WIDTH/2,5]]);
    var w_down_in = BEZIER(S0)([[0,0,0],[0,0.2+0.83 + 5.7 + HANDRAIL_WIDTH + STEP_WIDTH/2,0]]);
    var w_down_out = BEZIER(S0)([[1,0,0],[1,0.2+0.83 + 5.7 + HANDRAIL_WIDTH + STEP_WIDTH/2,0]]);

    var w_up = BEZIER(S1)([w_up_in, w_up_out]);
    var w_down = BEZIER(S1)([w_down_in, w_down_out]);

    var w = MAP(BEZIER(S2)([w_up,w_down]))(Domains.D3.LOW).translate([X,Y,Z],[1,-1.03,CURBE_HEIGHT]);

    //decoration
    var d1_up_in = BEZIER(S0)([[0,0,0],[0,0.2+0.83 + 5.7 + HANDRAIL_WIDTH + STEP_WIDTH/2,5]]);
    var d1_up_out = BEZIER(S0)([[UPPER_ROOF_CURBE_DEPTH-1,0,0],[UPPER_ROOF_CURBE_DEPTH-1,0.2+0.83 + 5.7 + HANDRAIL_WIDTH + STEP_WIDTH/2,5]]);
    var d1_down_in = BEZIER(S0)([[0,0,-0.2],[0,0.2+0.83 + 5.7 + HANDRAIL_WIDTH + STEP_WIDTH/2,5-0.2]]);
    var d1_down_out = BEZIER(S0)([[UPPER_ROOF_CURBE_DEPTH-1,0,-0.2],[UPPER_ROOF_CURBE_DEPTH-1,0.2+0.83 + 5.7 + HANDRAIL_WIDTH + STEP_WIDTH/2,5-0.2]]);

    var d1_up = BEZIER(S1)([d1_up_in, d1_up_out]);
    var d1_down = BEZIER(S1)([d1_down_in, d1_down_out]);

    var d1 = MAP(BEZIER(S2)([d1_up,d1_down]))(Domains.D3.LOW).translate([X,Y,Z],[-0.83,-1.03,CURBE_HEIGHT]);

    var d2_up_in = BEZIER(S0)([[0,0,-0.2],[0,0.2+0.83 + 5.7 + HANDRAIL_WIDTH + STEP_WIDTH/2,5-0.2]]);
    var d2_up_out = BEZIER(S0)([[0.2,0,-0.2],[0.2,0.2+0.83 + 5.7 + HANDRAIL_WIDTH + STEP_WIDTH/2,5-0.2]]);
    var d2_down_in = BEZIER(S0)([[0,2.3,0],[0,0.2+0.83 + 5.7 + HANDRAIL_WIDTH + STEP_WIDTH/2,5-1]]);
    var d2_down_out = BEZIER(S0)([[0.2,2.3,0],[0.2,0.2+0.83 + 5.7 + HANDRAIL_WIDTH + STEP_WIDTH/2,5-1]]);

    var d2_up = BEZIER(S1)([d2_up_in, d2_up_out]);
    var d2_down = BEZIER(S1)([d2_down_in, d2_down_out]);

    var d2 = MAP(BEZIER(S2)([d2_up,d2_down]))(Domains.D3.LOW).translate([X,Y,Z],[0.8,-1.03,CURBE_HEIGHT]);


    var d3_down_in = BEZIER(S0)([[0,1.8,0],[0,0.2+0.83 + 5.7 + HANDRAIL_WIDTH + STEP_WIDTH/2,5-0.8]]);
    var d3_down_out = BEZIER(S0)([[0.8,1.8,0],[0.8,0.2+0.83 + 5.7 + HANDRAIL_WIDTH + STEP_WIDTH/2,5-0.8]]);
    var d3_up_in = BEZIER(S0)([[0,0,0],[0,0.2+0.83 + 5.7 + HANDRAIL_WIDTH + STEP_WIDTH/2,5-0.2]]);
    var d3_up_out = BEZIER(S0)([[0.8,0,0],[0.8,0.2+0.83 + 5.7 + HANDRAIL_WIDTH + STEP_WIDTH/2,5-0.2]]);

    var d3_down = BEZIER(S1)([d3_down_in,d3_down_out]);
    var d3_up = BEZIER(S1)([d3_up_in,d3_up_out]);

    var d3 = MAP(BEZIER(S2)([d3_down, d3_up]))(Domains.D3.LOW).translate([X,Y,Z],[0,-1.03,CURBE_HEIGHT]);

    var half_roof_curbe = STRUCT([
        w,
        d1,
        d2,
        d3,
        T([X,Y])([-0.83,-0.83]),
        c_1,
        c_1_2,
        T([X])([UPPER_ROOF_CURBE_DEPTH]),
        c_2,
        c_2_2,
        T([X,Y])([4 -0.83,-20.5 + CURBE_DEPTH]),
        c_3,
        T([X])([UPPER_ROOF_CURBE_DEPTH]),
        c_4,
        T([X])([39.78]),
        c_5
    ]).color(Colors.yellow_decoration);

    return STRUCT([half_roof_curbe, T([Y])([2*(STEP_WIDTH/2 + HANDRAIL_WIDTH + 5.7)]), S([Y])([-1]), half_roof_curbe]);
};

var Back_Roof = function () {

    var c0 = BEZIER(S0)([[0,0,0],[(39.78+WALL_DEPTH+WALL_DEPTH)/2 + 0.63, 20.5 + 0.63,9.9]]); //front right
    var c1 = BEZIER(S0)([[0,2*(20.5+5.7-WALL_DEPTH+HANDRAIL_WIDTH+STEP_WIDTH/2)+0.63+0.63,0],[(39.78+WALL_DEPTH+WALL_DEPTH)/2+0.63,20.5+ 2*(5.7-WALL_DEPTH+HANDRAIL_WIDTH+STEP_WIDTH/2)+0.63,9.9]]); //front left
    var c2 = BEZIER(S0)([[39.78+WALL_DEPTH+WALL_DEPTH+0.2+0.2+0.63+0.63,0,0],[(39.78+WALL_DEPTH+WALL_DEPTH)/2+0.63,20.5+0.63,9.9]]); //back right
    var c3 = BEZIER(S0)([[39.78+WALL_DEPTH+WALL_DEPTH+0.2+0.2+0.63+0.63,2*(20.5+5.7-WALL_DEPTH+HANDRAIL_WIDTH+STEP_WIDTH/2)+0.63+0.63,0],[(39.78+WALL_DEPTH+WALL_DEPTH)/2+0.63,20.5+ 2*(5.7-WALL_DEPTH+HANDRAIL_WIDTH+STEP_WIDTH/2)+0.63,9.9]]); //back left

    var d_fr_l = BEZIER(S0)([[0,0+0.5,0],[(39.78+WALL_DEPTH+WALL_DEPTH)/2 + 0.63, 20.5 + 0.63 + 0.5,9.9]]);
    var d_fr_c = BEZIER(S0)([[0,0,0+0.5],[(39.78+WALL_DEPTH+WALL_DEPTH)/2 + 0.63, 20.5 + 0.63,9.9 + 0.5]]);
    var d_fr_r = BEZIER(S0)([[0+0.5,0,0],[(39.78+WALL_DEPTH+WALL_DEPTH)/2 + 0.63 + 0.5, 20.5 + 0.63,9.9]]);

    var d_fr = MAP(BEZIER(S1)([d_fr_l,d_fr_c,d_fr_r]))(Domains.D2);

    var d_fl_l = BEZIER(S0)([[0 + 0.5,2*(20.5+5.7-WALL_DEPTH+HANDRAIL_WIDTH+STEP_WIDTH/2)+0.63+0.63,0],[(39.78+WALL_DEPTH+WALL_DEPTH)/2+0.63 + 0.5,20.5+ 2*(5.7-WALL_DEPTH+HANDRAIL_WIDTH+STEP_WIDTH/2)+0.63,9.9]]);
    var d_fl_c = BEZIER(S0)([[0,2*(20.5+5.7-WALL_DEPTH+HANDRAIL_WIDTH+STEP_WIDTH/2)+0.63+0.63,0 + 0.5],[(39.78+WALL_DEPTH+WALL_DEPTH)/2+0.63,20.5+ 2*(5.7-WALL_DEPTH+HANDRAIL_WIDTH+STEP_WIDTH/2)+0.63,9.9 + 0.5]]);
    var d_fl_r = BEZIER(S0)([[0,2*(20.5+5.7-WALL_DEPTH+HANDRAIL_WIDTH+STEP_WIDTH/2)+0.63+0.63 - 0.5,0],[(39.78+WALL_DEPTH+WALL_DEPTH)/2+0.63,20.5+ 2*(5.7-WALL_DEPTH+HANDRAIL_WIDTH+STEP_WIDTH/2)+0.63 - 0.5,9.9]]);

    var d_fl = MAP(BEZIER(S1)([d_fl_l,d_fl_c,d_fl_r]))(Domains.D2);

    var d_br_l = BEZIER(S0)([[39.78+WALL_DEPTH+WALL_DEPTH+0.2+0.2+0.63+0.63 - 0.5,0,0],[(39.78+WALL_DEPTH+WALL_DEPTH)/2+0.63 - 0.5,20.5+0.63,9.9]]);
    var d_br_c = BEZIER(S0)([[39.78+WALL_DEPTH+WALL_DEPTH+0.2+0.2+0.63+0.63,0,0+0.5],[(39.78+WALL_DEPTH+WALL_DEPTH)/2+0.63,20.5+0.63,9.9+0.5]]);
    var d_br_r = BEZIER(S0)([[39.78+WALL_DEPTH+WALL_DEPTH+0.2+0.2+0.63+0.63,0 + 0.5,0],[(39.78+WALL_DEPTH+WALL_DEPTH)/2+0.63,20.5+0.63 + 0.5,9.9]]);

    var d_br = MAP(BEZIER(S1)([d_br_l,d_br_c,d_br_r]))(Domains.D2);

    var d_bl_l = BEZIER(S0)([[39.78+WALL_DEPTH+WALL_DEPTH+0.2+0.2+0.63+0.63,2*(20.5+5.7-WALL_DEPTH+HANDRAIL_WIDTH+STEP_WIDTH/2)+0.63+0.63 - 0.5,0],[(39.78+WALL_DEPTH+WALL_DEPTH)/2+0.63,20.5+ 2*(5.7-WALL_DEPTH+HANDRAIL_WIDTH+STEP_WIDTH/2)+0.63 - 0.5,9.9]]);
    var d_bl_c = BEZIER(S0)([[39.78+WALL_DEPTH+WALL_DEPTH+0.2+0.2+0.63+0.63,2*(20.5+5.7-WALL_DEPTH+HANDRAIL_WIDTH+STEP_WIDTH/2)+0.63+0.63,0 + 0.5],[(39.78+WALL_DEPTH+WALL_DEPTH)/2+0.63,20.5+ 2*(5.7-WALL_DEPTH+HANDRAIL_WIDTH+STEP_WIDTH/2)+0.63,9.9 + 0.5]]);
    var d_bl_r = BEZIER(S0)([[39.78+WALL_DEPTH+WALL_DEPTH+0.2+0.2+0.63+0.63 - 0.5,2*(20.5+5.7-WALL_DEPTH+HANDRAIL_WIDTH+STEP_WIDTH/2)+0.63+0.63,0],[(39.78+WALL_DEPTH+WALL_DEPTH)/2+0.63 - 0.5,20.5+ 2*(5.7-WALL_DEPTH+HANDRAIL_WIDTH+STEP_WIDTH/2)+0.63,9.9]]);

    var d_bl = MAP(BEZIER(S1)([d_bl_l,d_bl_c,d_bl_r]))(Domains.D2);

    var d_up_l = BEZIER(S0)([[(39.78+WALL_DEPTH+WALL_DEPTH)/2 + 0.63 - 0.5, 20.5 + 0.63,9.9],[(39.78+WALL_DEPTH+WALL_DEPTH)/2+0.63 - 0.5,20.5+ 2*(5.7-WALL_DEPTH+HANDRAIL_WIDTH+STEP_WIDTH/2)+0.63,9.9]]);
    var d_up_c = BEZIER(S0)([[(39.78+WALL_DEPTH+WALL_DEPTH)/2 + 0.63, 20.5 + 0.63,9.9 + 0.5],[(39.78+WALL_DEPTH+WALL_DEPTH)/2+0.63,20.5+ 2*(5.7-WALL_DEPTH+HANDRAIL_WIDTH+STEP_WIDTH/2)+0.63,9.9 + 0.5]]);
    var d_up_r = BEZIER(S0)([[(39.78+WALL_DEPTH+WALL_DEPTH)/2 + 0.63 + 0.5, 20.5 + 0.63,9.9],[(39.78+WALL_DEPTH+WALL_DEPTH)/2+0.63 + 0.5,20.5+ 2*(5.7-WALL_DEPTH+HANDRAIL_WIDTH+STEP_WIDTH/2)+0.63,9.9]]);

    var d_up = MAP(BEZIER(S1)([d_up_l,d_up_c,d_up_r]))(Domains.D2);

    var r0 = MAP(BEZIER(S1)([c0,c1]))(Domains.D2);
    var r1 = MAP(BEZIER(S1)([c2,c3]))(Domains.D2);
    var r2 = MAP(BEZIER(S1)([c0,c2]))(Domains.D2);
    var r3 = MAP(BEZIER(S1)([c1,c3]))(Domains.D2);

    return STRUCT([r0,r1,r2,r3, d_fr, d_fl, d_br, d_bl, d_up]).translate([X,Y],[4+WALL_DEPTH-0.83,-20.5-0.63+WALL_DEPTH]).color(Colors.roof);
};

var Chimney = function () {

    var chimney_top_up_front = BEZIER(S0)([[0,0,0],[0,1.2,0.69]]);
    var chimney_top_up_back = BEZIER(S0)([[2.4,0,0],[2.4,1.2,0.69]]);
    var chimney_top_down_front = BEZIER(S0)([[0,0,0],[0,1.2,0]]);
    var chimney_top_down_back = BEZIER(S0)([[2.4,0,0],[2.4,1.2,0]]);

    var chimney_top_up = BEZIER(S1)([chimney_top_up_front, chimney_top_up_back]);
    var chimney_top_down = BEZIER(S1)([chimney_top_down_front, chimney_top_down_back]);

    var chimney_top = MAP(BEZIER(S2)([chimney_top_up,chimney_top_down]))(Domains.D3.LOW);


    var chimney_roof_up_front = BEZIER(S0)([[0,-0.27,-0.06],[0,1.2,0.79]]);
    var chimney_roof_up_back = BEZIER(S0)([[2.4,-0.27,-0.06],[2.4,1.2,0.79]]);
    var chimney_roof_down_front = BEZIER(S0)([[0,-0.27,-0.16],[0,1.2,0.69]]);
    var chimney_roof_down_back = BEZIER(S0)([[2.4,-0.27,-0.16],[2.4,1.2,0.69]]);

    var chimney_roof_up = BEZIER(S1)([chimney_roof_up_front, chimney_roof_up_back]);
    var chimney_roof_down = BEZIER(S1)([chimney_roof_down_front, chimney_roof_down_back]);

    var chimney_roof = MAP(BEZIER(S2)([chimney_roof_up,chimney_roof_down]))(Domains.D3.LOW).color(Colors.roof);

    var chimney_top_roof = STRUCT([chimney_top, chimney_roof, T([Y])([2.4]), S([Y])([-1]), chimney_top, chimney_roof]);

    return STRUCT([
        CUBOID([2,2,6]),
        T([X,Y,Z])([-0.2,-0.2,6]),
        CUBOID([2.4,2.4,0.3]).color(Colors.roof),
        SIMPLEX_GRID([[-0.2,2],[-0.2,0.2,-0.7,0.2,-0.7,0.2],[1]]),
        T([Z])([1]),
        CUBOID([2.4,2.4,0.3]).color(Colors.roof),
        T([Z])([0.3]),
        chimney_top_roof
    ]);
};

var Front_Roof = function () {

    var c0 = BEZIER(S0)([[0,0,0],[0,0.2+0.83 + 5.7 + HANDRAIL_WIDTH + STEP_WIDTH/2,5]]);
    var c0u = BEZIER(S0)([[0,0,0.3],[0,0.2+0.83 + 5.7 + HANDRAIL_WIDTH + STEP_WIDTH/2,5.3]]);
    var c1 = BEZIER(S0)([[19,0,0],[19,0.2+0.83 + 5.7 + HANDRAIL_WIDTH + STEP_WIDTH/2,5]]);
    var c1u = BEZIER(S0)([[19,0,0.3],[19,0.2+0.83 + 5.7 + HANDRAIL_WIDTH + STEP_WIDTH/2,5.3]]);

    var s0 = BEZIER(S1)([c0,c0u]);
    var s1 = BEZIER(S1)([c1,c1u]);

    var r = MAP(BEZIER(S2)([s0,s1]))(Domains.D3.LOW).translate([X,Y],[-1.03,-1.03]).color(Colors.roof);

    return STRUCT([r, T([Y])([2*(STEP_WIDTH/2 + HANDRAIL_WIDTH + 5.7)]), S([Y])([-1]), r]);
};

var Front_Basement_Grid = function () {
    var vert_bar = CYL_SURFACE([0.05,2.15])([32]);
    var hori_bar = R([Y,Z])([PI/2])(CYL_SURFACE([0.05,3.8])([32])).translate([Y],[3.75]);

    var vert_grid = Utils.sequence(vert_bar, 7, 0.45, Y).translate([X,Y,Z], [0.5,2.45,3.39]);
    var hori_grid = Utils.sequence(hori_bar, 4, 0.45, Z).translate([X,Y,Z], [0.5,2,3.85]);


    var half_grid = STRUCT([vert_grid, hori_grid]);

    return STRUCT([half_grid, T([Y])([2*(STEP_WIDTH/2 + HANDRAIL_WIDTH + 5.7)]), S([Y])([-1]), half_grid]).color(Colors.iron);

};

var Basement_Blind = function () {
    var board = SIMPLEX_GRID([[0.1],[0.9],[3.2]]).color(Colors.wood);
    var right_hinge = SIMPLEX_GRID([[0.05],[1.7],[0.2]]).translate([X,Z],[-0.05,0.5]).color(Colors.iron);
    var left_hinge = SIMPLEX_GRID([[0.05],[1.7],[0.2]]).translate([X,Y,Z],[-0.05,2.1,0.5]).color(Colors.iron);

    var blind = STRUCT([
        Utils.sequence(board, 4, 0.95, Y),
        Utils.sequence(right_hinge,2,2,Z),
        Utils.sequence(left_hinge,2,2,Z)
    ]);


    return blind.translate([X,Y,Z], [0.1,0.1,0.01]);
};

var Upper_Window_Blind = function () {
    var board = SIMPLEX_GRID([[0.1],[0.9],[7.32]]).color(Colors.wood);
    var right_hinge = SIMPLEX_GRID([[0.05],[1.7],[0.2]]).translate([X,Z],[-0.05,0.5]).color(Colors.iron);
    var left_hinge = SIMPLEX_GRID([[0.05],[1.7],[0.2]]).translate([X,Y,Z],[-0.05,2.1,0.5]).color(Colors.iron);

    var blind = STRUCT([
        Utils.sequence(board,4,0.95,Y),
        Utils.sequence(right_hinge,2,6,Z),
        Utils.sequence(left_hinge,2,6,Z)
    ]);

    return blind.translate([X,Y], [0.1,0.1]);
};

var Window_Decoration = function () {
    var front_win_middle_wall = SIMPLEX_GRID([0.1,3.8+0.75+0.75, MIDDLE_WALL_HEIGHT]);
};

var stairs = Stairs().translate([X,Y],[-N_STEPS * STEP_DEPTH - 2.66 - 5,5.7]).color(Colors.walls);


var villa = STRUCT([
    Base(),
    Floor(),
    stairs,
    Basement(),
    Front_Basement_Grid(),
    T([Z])([BASEMENT_HEIGHT]),
    Curbe(),
    Floor(),
    T([Z])([CURBE_HEIGHT]),
    Short_middle_wall(),
    Entrance_Wall(),
    Front(),
    T([Z])([MIDDLE_WALL_HEIGHT]),
    Curbe2(),
    T([Z])([CURBE_HEIGHT]),
    Upper_wall(),
    T([Z])([UPPER_WALL_HEIGHT]),
    Roof_Curbe(),
    T([Z])([CURBE_HEIGHT]),
    Roof_Stakes(),
    T([Z])([1]),
    Upper_Roof_Curbe(),
    Floor(), //that is the top
    T([Z])([CURBE_HEIGHT]),
    Back_Roof(),
    Front_Roof(),
    T([Z])([33 - 4*CURBE_HEIGHT - BASEMENT_HEIGHT - MIDDLE_WALL_HEIGHT - UPPER_WALL_HEIGHT]),
    Chimney().translate([X,Y],[14,-14]),
    Chimney().rotate([X,Y],[PI/2]).translate([X,Y],[16,36]),
    T([Z])([6]),
    Chimney().translate([X,Y],[30,15])
]);
DRAW(villa);
