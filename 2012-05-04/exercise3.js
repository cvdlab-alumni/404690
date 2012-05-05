var domain = INTERVALS(1)(100);
var domain2 = DOMAIN([[0,1],[0,1]])([100,100]);

var p0 = [[0,0,0],[4,4,0],[10,0,0],[0,4,0]];
var p1 = [[4,4,0],[0,13,0],[0,8,0],[-5,0,0]];
var p2i = [[0,0,0.5],[0,3,0.5],[0,1,0],[0,1,0]];
var p3i = [[-11,3,0.5],[0,3,0.5],[1,0,0],[1,0,0]];
var p2ii = [[0,0,-0.5],[0,3,-0.5],[0,1,0],[0,1,0]];
var p3ii = [[-11,3,-0.5],[0,3,-0.5],[1,0,0],[1,0,0]];
var pi = [[0,3,-0.5]];
var pii = [[0,3,0.5]];
var p4 = [[-11,3,0],[0,13,0],[25,0,0],[10,0,0]];

var c0 = CUBIC_HERMITE(S0)(p0);
var c1 = CUBIC_HERMITE(S0)(p1);
var c2i = CUBIC_HERMITE(S0)(p2i);
var c3i = CUBIC_HERMITE(S0)(p3i);
var c2ii = CUBIC_HERMITE(S0)(p2ii);
var c3ii = CUBIC_HERMITE(S0)(p3ii);
var ci = BEZIER(S0)(pi);
var cii = BEZIER(S0)(pii);
var c4 = CUBIC_HERMITE(S0)(p4);

var b0 = BEZIER(S1)([c4,c3i]);
var b1 = BEZIER(S1)([c4,c3ii]);
var b2 = BEZIER(S1)([c0,c2i]);
var b3 = BEZIER(S1)([c0,c2ii]);
var b4 = BEZIER(S1)([c1,ci]);
var b5 = BEZIER(S1)([c1,cii]);

var s0 = MAP(b0)(domain2);
var s1 = MAP(b1)(domain2);
var s2 = MAP(b2)(domain2);
var s3 = MAP(b3)(domain2);
var s4 = MAP(b4)(domain2);
var s5 = MAP(b5)(domain2);

var vert_stabilizer = COLOR([1,1,0,1])(STRUCT([s0,s1,s2,s3,s4,s5]));

// DRAW(vert_stabilizer);


var vp1i = [[0,12,0.5],[6,12,0.5],[1,0,0],[1,0,0]];
var vp1ii = [[0,12,-0.5],[6,12,-0.5],[1,0,0],[1,0,0]];
var vp3i = [[6,12,0.5],[10,10,0.5],[4,-2,0],[4,-2,0]];
var vp2 = [[0,12,0],[6,0,0],[0,-15,0],[5,0,0]];
var vp3ii = [[6,12,-0.5],[10,10,-0.5],[4,-2,0],[4,-2,0]];
var vp4 = [[0,12,0],[0,4,0],[6,0,0],[9,0,0],[10,10,0]];

var vc1i = CUBIC_HERMITE(S0)(vp1i);
var vc1ii = CUBIC_HERMITE(S0)(vp1ii);
var vc2 = CUBIC_HERMITE(S0)(vp2);
var vc3i = CUBIC_HERMITE(S0)(vp3i);
var vc3ii = CUBIC_HERMITE(S0)(vp3ii);
var vc4 = BEZIER(S0)(vp4);

var b0 = BEZIER(S1)([vc1i,vc2]);
var b1 = BEZIER(S1)([vc1ii,vc2]);
var b2 = BEZIER(S1)([vc3i,vc4]);
var b3 = BEZIER(S1)([vc3ii,vc4]);

var vs0 = MAP(b0)(domain2);
var vs1 = MAP(b1)(domain2);
var vs2 = MAP(b2)(domain2);
var vs3 = MAP(b3)(domain2);

var oriz_stabilizer = COLOR([1,1,0,1])(STRUCT([vs0,vs1,vs2,vs3]));

DRAW(oriz_stabilizer);
