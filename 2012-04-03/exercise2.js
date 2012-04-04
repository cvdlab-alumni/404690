var tiled_plan = function (x,y, width, height, thick) {
	width = width || 1;
	height = height || 1;
	thick = thick || 0.5;

	return T([0,1])([x,y])(SIMPLEX_GRID([[width],[height],[thick]]));
}

var pool1 = tiled_plan(1,1,20,9, 0.4);
var pool2 = tiled_plan(47,5,4,11, 0.4);

var floor_A = tiled_plan(0,1);
var floor_B = tiled_plan(0,0,39);
var floor_C = tiled_plan(21,1,15,3);
var floor_D = tiled_plan(21,4,31);
var floor_E = tiled_plan(51,5);
var floor_F = tiled_plan(39,5,8,11);
var floor_G = tiled_plan(21,5,18,12);
var floor_H = tiled_plan(1,10,20,7);

var bathroom = tiled_plan(1,17,8,5);


var floor = STRUCT([
	floor_A,
	floor_B,
	floor_C,
	floor_D,
	floor_E,
	floor_F,
	floor_G,
	floor_H,
	bathroom
]);



var _bench = function (x,y, n_inner, width_inner, width_outer, height, thick) {

	var inner_pillar = T([0])([width_outer])(SIMPLEX_GRID([
		REPLICA(n_inner)([0.25,-(width_inner-0.5), 0.25]),
		[0.5],
		[0.5]
	]));

	var left_outer_pillar = T([0])([0.1])(
		SIMPLEX_GRID([
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


var bench = _bench(7.8,14.1,5,2.1,2.4,0.7,0.2);



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

var vert_windowed_wall = function (x,y,lenght, n, tall) {
	var vert_border = SIMPLEX_GRID([
		[0.05],
		[0.025, -(lenght/n -0.05), 0.025],
		[tall]
	]);
	var horiz_border = SIMPLEX_GRID([
		[0.05],
		[lenght/n],
		[0.05, -(tall-0.1), 0.05]
	])
	var border = STRUCT([
		vert_border,
		horiz_border
	]);

	var glass = T([0])([0.025])(
		SIMPLEX_GRID([
			[0.01],
			[lenght],
			[tall]
		]));


	var borders =  STRUCT(REPLICA(n)([border, T([1])([lenght/n])]));

	return T([0,1,2])([x,y,0.5])(STRUCT([borders, glass]));
}

var horiz_windowed_wall = function (x,y,lenght, n, tall) {
	var vert_border = SIMPLEX_GRID([
		[0.025, -(lenght/n -0.05), 0.025],
		[0.05],
		[tall]
	]);
	var horiz_border = SIMPLEX_GRID([
		[lenght/n],
		[0.05],
		[0.05, -(tall-0.1), 0.05]
	])
	var border = STRUCT([
		vert_border,
		horiz_border
	]);

	var glass = T([1])([0.025])(
		SIMPLEX_GRID([
			[lenght],
			[0.01],
			[tall]
		]));


	var borders =  STRUCT(REPLICA(n)([border, T([0])([lenght/n])]));

	return T([0,1,2])([x,y,0.5])(STRUCT([borders, glass]));
}

var bench_wall = T([0,1,2])([7.5,15,0.5])(
	SIMPLEX_GRID([
		[19],
		[0.15],
		[3]
]));

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

//	horiz_wall(1,17-0.05,6.2,0.05, 3),
//	horiz_wall(8.2,17-0.05,0.8,0.05, 3)
	horiz_windowed_wall(1,17-0.05,6.2,1, 3),
	horiz_windowed_wall(8.2,17-0.05,0.8,1, 3)
]);


var vert_windowed_wall = function (x,y,lenght, n, tall) {
	var vert_border = SIMPLEX_GRID([
		[0.05],
		[0.025, -(lenght/n -0.05), 0.025],
		[tall]
	]);
	var horiz_border = SIMPLEX_GRID([
		[0.05],
		[lenght/n],
		[0.05, -(tall-0.1), 0.05]
	])
	var border = STRUCT([
		vert_border,
		horiz_border
	]);

	var glass = T([0])([0.025])(
		SIMPLEX_GRID([
			[0.01],
			[lenght],
			[tall]
		]));


	var borders =  STRUCT(REPLICA(n)([border, T([1])([lenght/n])]));

	return T([0,1,2])([x,y,0.5])(STRUCT([borders, glass]));
}

var horiz_windowed_wall = function (x,y,lenght, n, tall) {
	var vert_border = SIMPLEX_GRID([
		[0.025, -(lenght/n -0.05), 0.025],
		[0.05],
		[tall]
	]);
	var horiz_border = SIMPLEX_GRID([
		[lenght/n],
		[0.05],
		[0.05, -(tall-0.1), 0.05]
	])
	var border = STRUCT([
		vert_border,
		horiz_border
	]);

	var glass = T([1])([0.025])(
		SIMPLEX_GRID([
			[lenght],
			[0.01],
			[tall]
		]));


	var borders =  STRUCT(REPLICA(n)([border, T([0])([lenght/n])]));

	return T([0,1,2])([x,y,0.5])(STRUCT([borders, glass]));
}

var entrance_wall = STRUCT([
	horiz_wall(25.2,7.3,7+0.8+0.8,0.15, 3),// marble wall

//	horiz_wall(30,5-0.05,11.4,0.05, 3), // glass
//	vert_wall(30,5,2.3, 0.01, 3), //glass door

	horiz_windowed_wall(30,5-0.05,11.4,10, 3), // glass
	vert_windowed_wall(30,5,2.3, 2, 3), //glass door

//	horiz_wall(30,13.7,10,0.05, 3), //glass
//	vert_wall(40,13.7,2.3, 0.01, 3) // glass door
	
	horiz_windowed_wall(30,13.7,10,10, 3), //glass
	vert_windowed_wall(40,13.7,2.3, 2, 3) // glass door

]);


var inside_wall = STRUCT([
	horiz_wall(37.1,10.5-0.15/2,0.9+4+0.5,0.15, 3),

	vert_windowed_wall(44.7,6.8,7.4,9, 3), //windowed with border

	vert_wall(38.8,5,5.5-0.15/2, 0.01, 3),
	vert_wall(42.5,5,5.5-0.15/2, 0.01, 3)

]);

var windowed_wall = STRUCT([
	vert_windowed_wall(30.95,7.45,0.55+5+0.7,1, 3),
	vert_windowed_wall(32,7.45,0.55+5+0.7,1, 3)
]);

var walls = STRUCT([
	pool1_walls,
	pool2_walls,
	bathroom_walls,
	bench_wall,
	entrance_wall,
	inside_wall,
	windowed_wall
]);


var pillar = function (x,y,tall) {
	var p1 = SIMPLEX_GRID([
		[0.05],
		[0.2],
		[tall]
	]);

	var p2 = SIMPLEX_GRID([
		[0.2],
		[0.05],
		[tall]
	]);

	var p = STRUCT([
		T([0])([0.075])(p1),
		T([1])([0.075])(p2)
	])

	return (T([0,1,2])([x-0.1,y-0.1,0.5])(p));
}

var pillars = STRUCT([
	pillar(26,7,3),
	pillar(26,14,3),
	pillar(32.3,14,3),
	pillar(38.7,14,3),
	pillar(45,14,3),
	pillar(45,7,3),
	pillar(38.7,7,3),
	pillar(32.3,7,3),
]);


var stairs = function (x,y) {
	return	T([0,1])([x,y])(STRUCT(
		REPLICA(7)([
			SIMPLEX_GRID([
				[0.375],
				[3],
				[0.125]
			]),
			T([0,2])([0.375,-0.125])
		])
	));
}



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

	return STRUCT([higher, lower]);
}

var bathroom_roof = roof(0.5,12.2, 9.3, 9.8, 3);
var main_roof = roof(24,4,23,13, 3);


var building = STRUCT([
	floor,
	pool1,
	pool2,
	bench,
	walls,
	pillars,
	bathroom_roof,
	main_roof,
]);