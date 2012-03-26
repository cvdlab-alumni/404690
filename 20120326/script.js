var domain1d = DOMAIN([[0,10]])([10]);
var domain2d = DOMAIN([[2,6],[2,8]])([8,12]); 
var domain3d = DOMAIN([[2,6],[2,8],[2,8]])([8,12,12]);


var mapping = function (p) {
	var u = p[0];

	return [u, 1];
};



var mapped = MAP(mapping)(domain1d);

//DRAW THE BISECT
var bisectDomain = DOMAIN([[0,10]])(10);

var bisection = function (p) {
	var u = p[0];

	return [u, u];
};

var bisect = MAP(bisection)(domain1d);
DRAW(bisect);

//DRAW A SINE
var sineDomain = DOMAIN([[0,2*PI]])([36]);

var sin = function (p) {
	var u = p[0];

	return [u, Math.sin(u)];
};

var sine = MAP(sin)(sineDomain); 
DRAW(sine);


/**
 * drawCircle
 * draw a circle in plasm.js
 * 
 */

 var drawCircle = function (r, n) {
 	var domain = DOMAIN([[0,2*PI]])([n]);
 	var circle = MAP(function (p) {
 		var u = p[0];

 		return [r*Math.cos(u), r*Math.sin(u)];
 	})(domain);

 	DRAW(circle);
 }

 /**
  *drawCilinder
  *
  *draw a cilinder in plasm.js
  */

 var drawCilinder = function (r, h, n, m, color) {
 	var domain = DOMAIN([[0, 2*PI],[0,h]])([n,m]);
 	var cilinder = MAP(function (p) {
 		var u = p[0];
 		var v = p[1];

 		return [v, r*Math.cos(u), r*Math.sin(u)];

 	})(domain);

 	COLOR(color)(cilinder);
 	DRAW(cilinder);
 };
















