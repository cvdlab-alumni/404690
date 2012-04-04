var tiled_plan = function (x,y, width, height, thick) {
	width = width || 1;
	height = height || 1;
	thick = thick || 0.5;

	return T([0,1])([x,y])(SIMPLEX_GRID([[width],[height],[thick]]));
}

var pool1 = COLOR([0.4,0.75,0.8])(tiled_plan(1,1,20,9, 0.4));
var pool2 = COLOR([0.4,0.75,0.8])(tiled_plan(47,5,4,11, 0.4));

var floor_A = tiled_plan(0,1);
var floor_B = tiled_plan(0,0,39);
var floor_C = tiled_plan(21,1,15,3);
var floor_D = tiled_plan(21,4,31);
var floor_E = tiled_plan(51,5);
var floor_F = tiled_plan(39,5,8,11);
var floor_G = tiled_plan(21,5,18,12);
var floor_H = tiled_plan(1,10,20,7);

var floor = COLOR([0.9,0.88,0.8])(STRUCT([
	floor_A,
	floor_B,
	floor_C,
	floor_D,
	floor_E,
	floor_F,
	floor_G,
	floor_H
]));

var bathroom = tiled_plan(1,17,8,5);


var _bench = function (x,y, n_inner, width_inner, width_outer, height, thick) {

	var inner_pillar = T([0])([width_outer])(SIMPLEX_GRID([
		REPLICA(n_inner)([0.25,-(width_inner-0.5), 0.25]),
		[0.5],
		[0.5]
	]));

	var left_outer_pillar = T([0])([0.1])(SIMPLEX_GRID([
			[0.5, -(width_outer-0.5-0.1-0.25), 0.25],
			[0.5],
			[0.5]
	]));

	var right_outer_pillar = T([0])([width_outer+width_inner*n_inner])(SIMPLEX_GRID([
			[0.25, -(width_outer-0.5-0.1-0.25), 0.5],
			[0.5],
			[0.5]
	]));

	var inner_seats = T([0])([width_outer])(SIMPLEX_GRID([
		REPLICA(n_inner)(width_inner),
		[height],
		[thick]
	]));

	var outer_seats = SIMPLEX_GRID([
		[width_outer, -n_inner*width_inner, width_outer],
		[height],
		[thick]
	]);

	var pillar = T([1])([0.1])(STRUCT([inner_pillar, left_outer_pillar, right_outer_pillar]));
	var seats = T([2])([0.5])(STRUCT([inner_seats, outer_seats]));


	return T([0,1,2])([x,y,0.5])(STRUCT([pillar, seats]));
}


var bench = COLOR([0.9,0.88,0.8])(_bench(7.8,14.1,5,2.1,2.4,0.7,0.2));



var horiz_wall = function (x,y,lenght, thick, height) {
	return T([0,1])([x,y])(
		SIMPLEX_GRID([
			[lenght],
			[thick],
			[height+0.5]
	]));
}

var vert_wall = function (x,y,lenght, thick, height) {
	return T([0,1])([x,y])(
		SIMPLEX_GRID([
			[thick],
			[lenght],
			[height+0.5]
	]));
}

var bench_wall = COLOR([0.9,0.88,0.8])(T([0,1,2])([7.5,15,0.5])(
	SIMPLEX_GRID([
		[19],
		[0.15],
		[3]
])));

var pool2_walls = STRUCT([
	horiz_wall(37.7,16,13+0.15+0.3,0.15,3),
	vert_wall(51,4.85,11+0.15+0.15,0.15,3),
	horiz_wall(41.4,4.85,9+0.15+0.6,0.15,3)
]);

var pool1_walls = STRUCT([
	horiz_wall(0.85,0.85,7+0.15,0.15,3),
	vert_wall(0.85,0.85,21+0.15+0.15,0.15,3),
	horiz_wall(0.85,22,4+0.15,0.15,3)
]);

var bathroom_walls = STRUCT([
	horiz_wall(5+0.025,21-0.025,1-0.025,0.05, 3),
	horiz_wall(6.8,21-0.025,2+0.2,0.05, 3),

	vert_wall(7-0.025,21+0.025,0.05,0.05, 3),
	vert_wall(7-0.05,21+0.95,0.05,0.05, 3),

	vert_wall(5-0.025,17,2,0.05, 3),
	vert_wall(5-0.025,19.8,2.2,0.05, 3),

	horiz_wall(5,22, 4+0.05,0.05, 3),
	vert_wall(9,16.8,5+0.2,0.05, 3),
	horiz_wall(1,17-0.05,6.2,0.05, 3),
	horiz_wall(8.2,17-0.05,0.8,0.05, 3)
]);



var roof = function (x,y, width, height,tall) {
	var thick_lower = 0.3;
	var higher = T([0,1,2])([x-0.1,y-0.1,tall+0.5+thick_lower])(
		SIMPLEX_GRID([
			[width+0.2],
			[height+0.2],
			[0.1]
	]));

	var lower = T([0,1,2])([x,y,tall+0.5])(
		SIMPLEX_GRID([
			[width],
			[height],
			[thick_lower]
	]));

	return STRUCT([COLOR([0.275,0.275,0.275])(higher), COLOR([1,1,1])(lower)]);
}

var bathroom_roof = roof(0.5,12.2, 9.3, 9.8, 3);