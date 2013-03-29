/*
	+-----------------------------------------------------------+
	/ 15 Peg Game										  		/
	+-----------------------------------------------------------+
	/  This is a solution for a 15 peg game using backtracking	/	     		  /
	+-----------------------------------------------------------+
*/

// JavaScript Document
function Position(x) {
	this.x = x;
	this.y = 0;
}

//initial x positions for the slots on the board used for display
var _display_pos = [ 
	new Position(300), new Position(255), new Position(345), new Position(210), new Position(300), new Position(390), new Position(165),
	new Position(255), new Position(345), new Position(435), new Position(120),new Position(210),new Position(300),new Position(390),
	new Position(480)
];

//initial y positions for the slots on the board used for display
function init_initial_ypositions() {

	var upto = Math.ceil(Math.sqrt(_game_args.numpegs));
	var j = 0;
	var start_y = _game_args.top_y;
	var yindex = 0;
	
	for(var i = 1; i <= (upto + 1); i++) {
		var k = 0;
		
		while(k < i) {
			_display_pos[yindex++].y = start_y;
			++k;
		}
		start_y+=_game_args.inc_y;
	}
}

// valid moves represnted as triplet
var _moves = [
	[0,1,3],[1,3,6],[3,6,10],[2,4,7],[4,7,11],[5,8,12],[3,4,5],[6,7,8],[7,8,9],[10,11,12],[11,12,13],[12,13,14],[5,4,3],[9,8,7],[8,7,6],
	[12,11,10],[13,12,11],[14,13,12],[5,2,0],[9,5,2],[14,9,5],[13,8,4],[8,4,1],[12,7,3],[3,1,0],[10,6,3],[6,3,1],[11,7,4],[7,4,2],[12,8,5],
	[3,7,12],[1,4,8],[4,8,13],[0,2,5],[2,5,9],[5,9,14]
];

// board representation
function Board(boardConfig) {
	// board representation - 0 for empty and 1 for full
	this.boardConfig =  boardConfig;
	
	// make the move
	this.makeMove = function(move) {
		
		var src = move[0];
		var jump = move[1];
		var dest = move[2];
		
		this.boardConfig[src] = 0;
		this.boardConfig[jump] = 0;
		this.boardConfig[dest] = 1;		
		
	};
	
	// reverses the move
	this.makeReverseMove = function(move) {

		var src = move[0];
		var jump = move[1];
		var dest = move[2];
		
		this.boardConfig[src] = 1;
		this.boardConfig[jump] = 1;
		this.boardConfig[dest] = 0;			
	}
}

// stack containing triplets
function SolutionStack() {
	
	this.top = -1;				// keeps track of top of stack
	this.arr = new Array();		//stores the jump triplets
	
	// parameter move is a triplet
	this.pushMove = function(move) {				
		this.arr[++this.top] = move;
	};
	
	this.popMove = function() {
		return this.arr[this.top--];
	};
	
	this.isEmpty = function() {
		return this.top < 0;	
	}
}

var _solution = new SolutionStack();	// maintains the triplets

// returns true if jump can be made else returns false
function isJumpPossible(move) {	

	var b = _game_args.board.boardConfig;
	var src = b[move[0]];
	var jump = b[move[1]];
	var dest = b[move[2]];
	
	return (src == 1 && dest == 0 && jump == 1);
}

// returns true if current board configuration is desired configuration
function isSolved() {

	var currentBoard = _game_args.board.boardConfig;
	
	for(var i = 0; i < currentBoard.length; i++) {
		
		if(currentBoard[i] != _game_args.finalBoard[i])
			return false;
	}
	return true;
}

// recursive funciton that searches for all solutions
function findSolution() {

	if(isSolved())
		return true;
		
	for(var i = 0; i < _moves.length; i++) {		// for all legal moves
		
		if(isJumpPossible(_moves[i])) {	
			
			_game_args.board.makeMove(_moves[i]);		
			_solution.pushMove(_moves[i]);
			var found = findSolution();				// recurse
			
			if(found)
				return true;
			else {	
				_game_args.board.makeReverseMove(_moves[i]);		// revert the last move
				_solution.popMove();			// pop last jump
			}
		}
	}
	return false;
}

// draws the background (green triangle)
function draw_background_triangle() {
	var canvas = document.getElementById('canvas1');
	var context = canvas.getContext("2d");
	context.globalCompositeOperation = 'destination-over';
	
	context.fillStyle = "rgba(0,255,0,1)";
	context.beginPath();
	context.moveTo(300,80);
	context.lineTo(0,600);
	context.lineTo(600,600);
	context.fill();
	context.closePath();
}

// draw pegs
function draw_pegs() {
	
	var canvas = document.getElementById('canvas1');
	var context = canvas.getContext("2d");
	canvas.getContext("2d").clearRect(0,0,canvas.width, canvas.height);
	
	// turn 1 means current position turns red to indicate its going to be moved
	if(_game_args.turn == 1) {
		
		var src = _game_args.solution[_game_args.solution_move_index][0];
		var dest = _game_args.solution[_game_args.solution_move_index][2];		
		
		for(var i = 0; i < _game_args.numpegs; i++) {
			if(_game_args.draw_board[i] == 1 && i != src) {
				context.beginPath();
				context.arc(_display_pos[i].x,_display_pos[i].y,20, 2*Math.PI, false);
				context.closePath();
				context.fillStyle = "rgba(0,0,250,1)";  // blue for non-empty slot
				context.fill();
			} else if(i != src){
				context.beginPath();
				context.arc(_display_pos[i].x,_display_pos[i].y,20, 2*Math.PI, false);
				context.closePath();
				if(i != dest)
					context.fillStyle = "rgba(95,90,89,1)";  // to show which dest is to be populated
				else if(i == dest)
				{
						context.fillStyle = "rgba(255,255,255,1)";  // grey for empty
						context.strokeStyle = "rgba(0,0,0,1)";
						context.stroke();
				}
				context.fill();
			}
		}

		context.beginPath();
		context.arc(_display_pos[src].x,_display_pos[src].y,20, 2*Math.PI, false);
		context.closePath();
		context.fillStyle = "rgba(250,0,0,1)";  // red
		context.fill();						
	} 
	
	// turn 2 for moving peg, turn 0 for drawing initial board game
	else if(_game_args.turn ==2 || _game_args.turn == 0){

		if(_game_args.turn == 2)
			make_next_move();
		
		for(var i = 0; i < _game_args.numpegs; i++) {
	
				context.beginPath();
				context.arc(_display_pos[i].x,_display_pos[i].y,20, 2*Math.PI, false);
				context.closePath();			
				if(_game_args.draw_board[i] == 0)
					context.fillStyle = "rgba(95,90,89,1)";  // grey
				else
					context.fillStyle = "rgba(0,0,250,1)";  // blue for non-empty slot
				context.fill();			
		}
	} 
}

var _game_args = {
	numpegs:15,
	initial_empty_slot:-1,		// will be randomly generated
	board:new Board(null),		// current board, used for solving initially null
	finalBoard: new Array(),	// final board config desired
	turn: 0,
	solution: new Array(),		// final array of moves
	solution_move_index: 0,
	draw_board: new Array(),		// used for drawing
	top_y: 150,
	inc_y:75, // distance between two rows on the board
	solution_exists: true,
}

// select random empty slot
function randomize_gameboard_empty_slot() {
	_game_args.initial_empty_slot = Math.ceil((Math.random()*14));
}

// initializes current board and desired configuration
function init_game_board() {
	randomize_gameboard_empty_slot();		// randomly select empty slot
	var temp = new Array();
	
	for(var i = 0; i < _game_args.numpegs; i++) {
		
		if(i != _game_args.initial_empty_slot) {
		
			temp[i] = 1;
			_game_args.finalBoard[i] = 0;
			_game_args.draw_board[i] = 1;
		} else {
			
			temp[i] = 0;
			_game_args.finalBoard[i] = 1;
			_game_args.draw_board[i] = 0;			
		}	
	}
	_game_args.board.boardConfig = temp;
}

// draw the initial board
function init_game() {
	
	// solving
	init_game_board();
	var f = findSolution();					
	init_initial_ypositions();		// y positions of the pegs on the board
	
	if(!f) {
		// drawing
		_game_args.solution_exists = false;
		draw_game();
		document.getElementById('p1').style.color = 'red';
		document.getElementById('p1').innerHTML = 'No Solution for this board configuration exists. Please restart game for new configuration';
	}
	var j = 0;	
	while(!_solution.isEmpty())
		_game_args.solution[j++] = _solution.popMove();
	draw_game();
}

// draw the board on the canvas
function draw_game() {	

	if(!_game_args.solution_exists) {
			draw_pegs();
			draw_background_triangle();			
			return;
	}
	
	if(_game_args.solution_move_index == (_game_args.solution.length)) {
		var canvas = document.getElementById('canvas1');
		var ctx = canvas.getContext('2d');
		canvas.getContext("2d").clearRect(0,0,canvas.width, canvas.height);		
		ctx.fillStyle = '#f00';
		ctx.font = 'italic bold 20px sans-serif';
		ctx.textBaseline = 'bottom';
		ctx.fillText("Game Over! Click 'Reset' to reset the game.", 80, 350);
		document.getElementById('p1').innerHTML = "";
		return;
//		document.getElementById('p1').innerHTML = "Game Over! Click 'Reset' to begin new game";
	}
		
	draw_pegs();
	draw_background_triangle();
	
	switch(_game_args.turn) {
		
		case 0:	_game_args.turn = 1;		// turn = 0 means draw initial board
		break;
		
		case 1:	_game_args.turn = 2;		// turn = 1 means display peg to be moved
		break;
		
		case 2:	_game_args.turn = 1;		// turn = 2 means make move
		break;	
	}
}

// perform the next jump
function make_next_move() {

	var index = _game_args.solution_move_index;
	var next_move = _game_args.solution[index];
	_game_args.solution_move_index++;
	var b = _game_args.draw_board;
	var src = next_move[0];
	var jump = next_move[1];
	var dest = next_move[2];
	
	b[src] = 0;
	b[jump] = 0;
	b[dest] = 1;
}

function reset_game() {
	document.location.reload(true);
}