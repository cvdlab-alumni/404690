var domain1d = DOMAIN([[0,10]])([10]);
var domain2d = DOMAIN([[2,6],[2,8]])([8,12]); 
var domain3d = DOMAIN([[2,6],[2,8],[2,8]])([8,12,12]);


var mapping = function (p) {
	var u = p[0];

	return [u, 1];
};



var mapped = MAP(mapping)(domain1d);



/**
 * drawBisect
 * draw a Bisection in plasm.js
 *
 * @param {Array} color the rgb color of the sine
 */

 var drawBisect = function (color) {
 	var domain = DOMAIN([[0,10]])(10);
 	var bisect = MAP(function (p) {
 		var u = p[0];

 		return [u, u];
 	})(domain);	

 	COLOR(color)(bisect);
 	DRAW(bisect);
 };

 /**
 * drawSine
 * draw a Sine in plasm.js
 *
 * @param {Integer} n number of segment in the radius interval
 * @param {Array} color the rgb color of the sine
 */

 var drawSine = function (n, color) {
 	var domain = DOMAIN([[0,2*PI]])(n);
 	var sine = MAP(function (p) {
 		var u = p[0];

 		return [u, Math.sin(u)];
 	})(domain);	

 	COLOR(color)(sine);
 	DRAW(sine);
 };


 /**
 * drawCircle
 * draw a Circle in plasm.js
 *
 * @param {Integer} r radius
 * @param {Integer} n number of segment in the radius interval
 * @param {Array} color the rgb color of the circle
 */

 var drawCircle = function (r, n, color) {
 	var domain = DOMAIN([[0,2*PI]])([n]);
 	var circle = MAP(function (p) {
 		var u = p[0];

 		return [r*Math.cos(u), r*Math.sin(u)];
 	})(domain);

 	COLOR(color)(circle);
 	DRAW(circle);
 }

 /**
 * drawCilinder
 * draw a Cilinder in plasm.js
 *
 * @param {Integer} r radius
 * @param {Integer} h height
 * @param {Integer} n number of segment in the radius interval
 * @param {Integer} m number of segment in the height interval
 * @param {Array} color the rgb color of the cilinder
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


/**
 * drawSphere
 * draw a Sphere in plasm.js
 *
 * @param {Integer} r radius
 * @param {Integer} n number of segment in the intervals
 * @param {Array} color the rgb color of the sphere
 */

var drawSphere = function (r, n, color) {
	var domain = DOMAIN([[0,PI],[0,2*PI]])([n/2,n]);
	var sphere = MAP(function (p) {
		var u = p[0]-PI/2;
		var v = p[1] -PI;

		return [-r*Math.cos(u)*Math.sin(v), r*Math.cos(u)*Math.cos(v), r*Math.sin(u)];
	})(domain);

	COLOR(color)(sphere);
	DRAW(sphere);
}

