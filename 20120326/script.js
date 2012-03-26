var domain1d = DOMAIN([[0,10]])([10]);
var domain2d = DOMAIN([[2,6],[2,8]])([8,12]); 
var domain3d = DOMAIN([[2,6],[2,8],[2,8]])([8,12,12]);


var mapping = function (p) {
	var u = p[0];

	return [u, 1];
};

var bisection = function (p) {
	var u = p[0];

	return [u, u];
};

var mapped = MAP(mapping)(domain1d);
var bisect = MAP(bisection)(domain1d);

