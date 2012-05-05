(function(exports){

var domain = DOMAIN([[0,1],[0,1]])([30,30]);
var domain1 = INTERVALS(1)(360);

var p00 = [[0,0,0],[8,0,0],[0,16,0],[0,-16,0]];
var p01 = [[0,0,16],[8,0,16],[0,16,0],[0,-16,0]];
var p02 = [[0,0,0],[8,0,0],[0,-16,0],[0,16,0]];
var p03 = [[0,0,16],[8,0,16],[0,-16,0],[0,16,0]];

var c00 = CUBIC_HERMITE(S0)(p00);
var c01 = CUBIC_HERMITE(S0)(p01);
var c02 = CUBIC_HERMITE(S0)(p02);
var c03 = CUBIC_HERMITE(S0)(p03);


var sur01 = BEZIER(S1)([c00,c01]);
var sur02 = BEZIER(S1)([c02,c03]);
var s01 = MAP(sur01)(domain);
var s02 = MAP(sur02)(domain);

var fuselage_front = COLOR([0.5,0.5,0.5])(STRUCT([s01,s02]));

// DRAW(s01);
// DRAW(s02);

var p10 = [[0,0,0],[8,0,0],[0,16,0],[0,-16,0]];
var p11 = [[0.5,0.5,5],[7.5,0.5,5],[0,14,0],[0,-14,0]];
var p12 = [[0,0,0],[8,0,0],[0,-16,0],[0,16,0]];
var p13 = [[0.5,0.5,5],[7.5,0.5,5],[0,-14,0],[0,14,0]];

var c10 = CUBIC_HERMITE(S0)(p10);
var c11 = CUBIC_HERMITE(S0)(p11);
var c12 = CUBIC_HERMITE(S0)(p12);
var c13 = CUBIC_HERMITE(S0)(p13);


var sur11 = BEZIER(S1)([c10,c11]);
var sur12 = BEZIER(S1)([c12,c13]);
var s11 = MAP(sur11)(domain);
var s12 = MAP(sur12)(domain);

var fuselage_med = COLOR([0.5,0.5,0.5])(STRUCT([s11,s12]));

// DRAW(s11);
// DRAW(s12);

var p20 = [[0.5,0.5,0],[7.5,0.5,0],[0,14,0],[0,-14,0]];
var p21 = [[2,2,17],[5,2,17],[0,6,0],[0,-6,0]];
var p22 = [[0.5,0.5,0],[7.5,0.5,0],[0,-14,0],[0,14,0]];
var p23 = [[2,2,17],[5,2,17],[0,-6,0],[0,6,0]];

var c20 = CUBIC_HERMITE(S0)(p20);
var c21 = CUBIC_HERMITE(S0)(p21);
var c22 = CUBIC_HERMITE(S0)(p22);
var c23 = CUBIC_HERMITE(S0)(p23);


var sur21 = BEZIER(S1)([c20,c21]);
var sur22 = BEZIER(S1)([c22,c23]);
var s21 = MAP(sur21)(domain);
var s22 = MAP(sur22)(domain);

var fuselage_tail = COLOR([0.5,0.5,0.5])(STRUCT([s21,s22]));

// DRAW(s21);
// DRAW(s22);

// nose

var p30 = [[0,0,0],[8,0,0],[0,16,0],[0,-16,0]];
var p31 = [[0.4,0,1],[7.6,0,1],[0,14.4,0],[0,-14.4,0]];
var p32 = [[2,0,2],[6,0,2],[0,8,0],[0,-8,0]];

var p33 = [[0,0,0],[8,0,0],[0,-16,0],[0,16,0]];
var p34 = [[0.4,0,1],[7.6,0,1],[0,-14.4,0],[0,14.4,0]];
var p35 = [[2,0,2],[6,0,2],[0,-8,0],[0,8,0]];

var c30 = CUBIC_HERMITE(S0)(p30);
var c31 = CUBIC_HERMITE(S0)(p31);
var c32 = CUBIC_HERMITE(S0)(p32);

var c33 = CUBIC_HERMITE(S0)(p33);
var c34 = CUBIC_HERMITE(S0)(p34);
var c35 = CUBIC_HERMITE(S0)(p35);

var sur31 = BEZIER(S1)([c30,c31,c32]);
var sur32 = BEZIER(S1)([c33,c34,c35]);
var s31 = MAP(sur31)(domain);
var s32 = MAP(sur32)(domain);

var fuselage_nose_head = STRUCT([s32,s31]);

// red nose
var p40 = [[0,0,0],[4,0,0],[0,8,0],[0,-8,0]];
var p41 = [[0.3,0,0.2],[3.7,0,0.2],[0,6.8,0],[0,-6.8,0]];
var p42 = [[1.5,0,0.5],[2.5,0,0.5],[0,2,0],[0,-2,0]];

var p43 = [[0,0,0],[4,0,0],[0,-8,0],[0,8,0]];
var p44 = [[0.3,0,0.2],[3.7,0,0.2],[0,-6.8,0],[0,6.8,0]];
var p45 = [[1.5,0,0.5],[2.5,0,0.5],[0,-2,0],[0,2,0]];

var c40 = CUBIC_HERMITE(S0)(p40);
var c41 = CUBIC_HERMITE(S0)(p41);
var c42 = CUBIC_HERMITE(S0)(p42);

var c43 = CUBIC_HERMITE(S0)(p43);
var c44 = CUBIC_HERMITE(S0)(p44);
var c45 = CUBIC_HERMITE(S0)(p45);

var sur41 = BEZIER(S1)([c40,c41,c42]);
var sur42 = BEZIER(S1)([c43,c44,c45]);
var s41 = MAP(sur41)(domain);
var s42 = MAP(sur42)(domain);


var fuselage_red_nose = COLOR([1,0,0,1])(STRUCT([s41,s42]));


//red ball nose

var p50 = [[0,0,0],[1,0,0],[0,2,0],[0,-2,0]];
var p51 = [[0.2,0,0.25],[0.8,0,0.25],[0,1.2,0],[0,-1.2,0]];
var p52 = [[0.5,0,0.5],[0.5,0,0.5],[0,0,0],[0,0,0]];

var p53 = [[0,0,0],[1,0,0],[0,-2,0],[0,2,0]];
var p54 = [[0.2,0,0.25],[0.8,0,0.25],[0,-1.2,0],[0,1.2,0]];
var p55 = [[0.45,0,0.5],[0.55,0,0.5],[0,0,0],[0,0,0]];

var c50 = CUBIC_HERMITE(S0)(p50);
var c51 = CUBIC_HERMITE(S0)(p51);
var c52 = CUBIC_HERMITE(S0)(p52);

var c53 = CUBIC_HERMITE(S0)(p53);
var c54 = CUBIC_HERMITE(S0)(p54);
var c55 = CUBIC_HERMITE(S0)(p55);

var sur51 = BEZIER(S1)([c50,c51,c52]);
var sur52 = BEZIER(S1)([c53,c54,c55]);
var s51 = MAP(sur51)(domain);
var s52 = MAP(sur52)(domain);

var fuselage_nose_ball = COLOR([1,0,0,1])(STRUCT([s51,s52]));


//all nose
var fuselage_nose = S([2])([-1])(STRUCT([fuselage_nose_head,T([0,2])([2,2]),fuselage_red_nose, T([0,2])([1.5,0.5]),fuselage_nose_ball]));


//all
var fuselage = STRUCT([fuselage_nose,fuselage_front, T([2])([16]), fuselage_med, T([2])([5]), fuselage_tail]);

DRAW(fuselage);

this.aircraft = this.aircraft || {};
this.aircraft.fuselage = fuselage;

}(this));
