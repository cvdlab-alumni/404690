var vert_line = function (x,y, lenght) {
	return COLOR([0.2,0.2,0.2])(POLYLINE([[x,y],[x, y+lenght]]));
}

var square = function (x, y, width, height) {
	width = width || 1;
	height = height || 1;

	return POLYLINE([[x,y],[x+width,y],[x+width,y+height],[x,y+height],[x,y]]);
}

var rectangled_line = function (x,y,width, height,n) {
	return STRUCT(REPLICA(n)([square(x,y, width, height), T([1])([height])]))
}

var squared_line = function (x, y, lenght) {
	return STRUCT(REPLICA(lenght)([square(x,y), T([0])([1])]));
}

var squared_plan = function (x, y, width, height) {
	
	var plan = squared_line(x,y,width);

	for(var i=1; i<height; ++i) {
		plan = STRUCT([plan, squared_line(x,y+i, width)]);
	}

	return plan;
}

var stair = function (x,y,n,width) {
	var stair_A = rectangled_line(x,y,width,1.5,2);
	var stair_B = rectangled_line(x+width,y,width,1,3);

	var stairs_A = STRUCT(REPLICA(n/2)([stair_A, T([0])([width*2])]));
	var stairs_B = STRUCT(REPLICA(n/2)([stair_B, T([0])([width*2])]));


	return COLOR([0.2,0.2,0.2])(STRUCT([stairs_A, stairs_B]));
}

var _bench = function (x,y, n_inner, width_inner, width_outer, height) {
	var inner_bench = STRUCT(REPLICA(n_inner)([square(x+width_outer,y, width_inner, height), T([0])([width_inner])]));
	var outer_bench = STRUCT(REPLICA(2)([square(x,y,width_outer,height), T([0])([width_outer+n_inner*width_inner])]));

	return COLOR([0.2,0.2,0.2])(STRUCT([inner_bench, outer_bench]));
}

var horiz_wall = function (x,y,lenght, thickness) {
	return COLOR([0.2,0.2,0.2])(square(x,y,lenght, thickness));
}
var vert_wall = function (x,y,lenght, thickness) {
	return COLOR([0.2,0.2,0.2])(square(x,y,thickness, lenght));
}

var pool1 = square(1,1,20,9);
var pool2 = square(47,5,4,11);

var floor_A = square(0,1);
var floor_B = squared_line(0,0,39);
var floor_C = squared_plan(21,1,15,3);
var floor_D = squared_line(21,4,31);
var floor_E = square(51,5);
var floor_F = squared_plan(39,5,8,11);
var floor_G = squared_plan(21,5,18,12);
var floor_H = squared_plan(1,10,20,7);

var squared_floor = STRUCT([
	floor_A,
	floor_B,
	floor_C,
	floor_D,
	floor_E,
	floor_F,
	floor_G,
	floor_H,
]);


//bathroom
var bathroom = squared_plan(1,17,8,5);
//var floor_J

//stair
var stairs = stair(36,1,8, 0.36);

//bench
var bench = _bench(7.8,14.1,5,2.1,2.4,0.7);

//bench wall
var bench_wall = horiz_wall(7.5,15,19, 0.15);

//pool2 walls
var pool2_walls = STRUCT([
	horiz_wall(37.7,16,13+0.15+0.3,0.15),
	vert_wall(51,4.85,11+0.15+0.15,0.15),
	horiz_wall(41.4,4.85,9+0.15+0.6,0.15)
]);

var pool1_walls = STRUCT([
	horiz_wall(0.85,0.85,7+0.15,0.15),
	vert_wall(0.85,0.85,21+0.15+0.15,0.15),
	horiz_wall(0.85,22,4+0.15,0.15)
]);

var inside_wall = STRUCT([
	horiz_wall(37.1,10.5-0.15/2,0.9+4+0.5,0.15),

	vert_wall(44.7,6.8,7.4,0.05),

	vert_line(38.8,5,5.5-0.15/2),
	vert_line(42.5,5,5.5-0.15/2)

]);

var entrance_wall = STRUCT([
	horiz_wall(25.2,7.3,7+0.8+0.8,0.15),
	horiz_wall(30,5-0.05,11.4,0.05),
	vert_line(30,5,2.3),

	horiz_wall(30,13.7,10,0.05),
	vert_line(40,13.7,2.3)
]);

var windowed_wall = STRUCT([
	vert_wall(30.95,7.45,0.55+5+0.7,0.05),
	vert_wall(32,7.45,0.55+5+0.7,0.05),

	vert_line(31.1,7.6,5.8),
	vert_line(31.5,7.6,5.8),
	vert_line(31.9,7.6,5.8)

]);

var bathroom_walls = STRUCT([
	horiz_wall(5+0.025,21-0.025,1-0.025,0.05),
	horiz_wall(6.8,21-0.025,2+0.2,0.05),

	vert_wall(7-0.025,21+0.025,0.05,0.05),
	vert_wall(7-0.05,21+0.95,0.05,0.05),

	vert_wall(5-0.025,17,2,0.05),
	vert_wall(5-0.025,19.8,2.2,0.05),

	horiz_wall(5,22, 4+0.05,0.05),
	vert_wall(9,16.8,5+0.2,0.05),
	horiz_wall(1,17-0.05,8,0.05)

]);

var walls = STRUCT([
	bench_wall,
	pool1_walls,
	pool2_walls,
	entrance_wall,
	inside_wall,
	bathroom_walls,
	windowed_wall
]);

var floor = STRUCT([squared_floor, bathroom, stairs, bench, walls, pool1, pool2]);

DRAW(floor);