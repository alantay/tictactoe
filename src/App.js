import React from 'react';
import {render} from 'react-dom';

const lines = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

const computerStartStr = [
	"Let the super smart AI go first.",
	"I'm too wussy to start first. AI please go ahead.",
	"Let AI go first, I'm gonna lose either way."
];

const computerWin = [
	"Wow, you're bad at this.",
	"Maybe you're the one with 'artificial' intelligence...",
	"LOL. NOOB! EASY GAME."
];

const computerDraw = [
	"Yea this is the furthest you can go. A draw.",
	"Next time, try winning... you wouldn't cut it with a draw.",
	"You couldn't even win an AI built with just a few line of codes?"
];

// Heuristic
const oneInLine = 1;
const twoInLine = 10;
const threeInLine = 100;

function Square(props){
	return(
		<button className="square" onClick={()=>props.onClick()}>
			{props.value}
		</button>
	);
}

function Board(props){

	function renderSquare(i) {
		return <Square value={props.squares[i]} onClick={() => props.onClick(i)} />;
	}

   
	return (
		<div>
			<div className="status">{status}</div>
			<div className="board-row">
				{renderSquare(0)}
				{renderSquare(1)}
				{renderSquare(2)}
			</div>
			<div className="board-row">
				{renderSquare(3)}
				{renderSquare(4)}
				{renderSquare(5)}
			</div>
			<div className="board-row">
				{renderSquare(6)}
				{renderSquare(7)}
				{renderSquare(8)}
			</div>
		</div>
	);
	
}

class Game extends React.Component {
	constructor() {
		super();


		this.state = {
			history: [{
				squares: Array(3*3).fill(null)
			}],
			xIsNext: true,
			stepNumber: 0,
		};
	}


	jumpTo(step) {
	  this.setState({
		stepNumber: step,
		xIsNext: (step % 2) ? false : true,
	  });
	}

	resetGame(){
		this.setState({
			history: [{
				squares: Array(3*3).fill(null)
			}],
			xIsNext: true,
			stepNumber: 0,
		});
	}

	aiTurn(){ 
		const history = this.state.history;
		const current = history[history.length-1];
		let squares = current.squares.slice();
		
		//wrapped in setTimeout due to long computation, thus have to make it async
		
		setTimeout(()=> {
			const computed = this.minimax(squares, this.state.xIsNext, 2, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
			squares[computed.bestMove] = "O";
			this.setState({
				history: history.concat([{
					squares: squares
				}]),
				xIsNext: true,
				stepNumber: this.state.stepNumber + 1
			})
		},0);
	}

	minimax(squares, isPlayerX, depth, alpha ,beta){
		let possibleMoves = generateMoves(squares);
		let bestMove = null;
		// let bestScore = isPlayerX? Number.MAX_SAFE_INTEGER:Number.MIN_SAFE_INTEGER;
		if(possibleMoves.length == 0) {
			return {bestMove:null,bestScore: evalBoard(squares)};
		}
		for(let m = 0; m < possibleMoves.length; m++){
			// Player O's turn
			if(!isPlayerX){ 
					let cell = possibleMoves[m];
					let tempSquares = squares.slice();	
					tempSquares[cell] = "O";
					let result = this.minimax(tempSquares, true, depth-1, alpha, beta);

					if(alpha < result.bestScore){
						alpha = result.bestScore;
						bestMove = cell;
					}
			}

			// Player X's turn
			if(isPlayerX){ 

					let cell = possibleMoves[m];
					let tempSquares = squares.slice();	
					tempSquares[cell] = "X";
					let result = this.minimax(tempSquares, false, depth-1,alpha, beta);
					if(beta > result.bestScore){
						bestMove = cell;
						beta = result.bestScore;
					}
			}
			if(alpha>=beta) break;
		}

		return {bestMove, bestScore:(isPlayerX ? beta:alpha)}

	}


	handleClick(i) {
		// If its Ai's turn, ignore click
		if(!this.state.xIsNext) return

		// Player's turn, proceed to log click/moves
		const history = this.state.history;
	  	const current = history[history.length-1];
	  	const squares = current.squares.slice();

	  	if (calculateWinner(squares) || squares[i]) {
			return;
	  	}
	  	squares[i] = this.state.xIsNext ? 'X' : 'O';
	  	this.setState({
			history: history.concat([{
		  		squares: squares
			}]),
			xIsNext: !this.state.xIsNext,
			stepNumber: this.state.stepNumber + 1
	  	},this.aiTurn);
	}

  

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		const moves = history.map((step, move) => {
			const desc = move ?
				'Move #' + move :
				'Game start';
			return (
			<li key={move}>
			  <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
			</li>
		  );
		});
		let status;
		if (winner) {
		  // status = 'Winner: ' + winner;
		  status = computerWin[Math.floor(Math.random() * computerWin.length)];
		} else {
		   // status = current
		   status = "";
		   if(current.squares.indexOf(null) == -1){

		   		status = computerDraw[Math.floor(Math.random() * computerDraw.length)]
		   }
		   
		   
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board 
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<button className={(history.length>1)?"hide":""} onClick={()=>this.aiTurn()}>{computerStartStr[Math.floor(Math.random() * computerStartStr.length)]}</button>
					<button className={(history.length>1)?"":"hide"} onClick={()=>this.resetGame()}>Reset Game</button>
					<ol>{}</ol>
				</div>
			</div>
		);
	}
}

// ========================================

render(
	<Game />,
	document.getElementById('container')
);

function calculateWinner(squares) {
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}

	return null;
}

function generateMoves(squares){
	let possibleMoves=[];
	
	// if game already ended with a winner
	if(calculateWinner(squares)) return possibleMoves;

	for(let cell = 0; cell < squares.length; cell++){
		if(!squares[cell])
			possibleMoves.push(cell);
	}
	return possibleMoves;
}

function evalBoard(squares){
	let score = 0;

	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		// console.log(evalLine([squares[a], squares[b], squares[c]]));
		score += evalLine([squares[a], squares[b], squares[c]]);
	}
	return score;
}

// console.log('evalboard' + evalBoard(["O","X","O","X","O","X","X","O","O"]));

function evalLine(line){
	let score = 0;
	// eval cell 1
	if(line[0]=="O") score = oneInLine;
	if(line[0]=="X") score = -oneInLine;

	// eval cell 2
	if(line[1] == "O"){
		if(score == oneInLine) score = twoInLine;
		else if(score == -oneInLine) return 0;
		else if(score == 0) score = oneInLine;
	}
	if(line[1] == "X"){
		if(score == -oneInLine) score = -twoInLine;
		else if(score == oneInLine) return 0;
		else if(score == 0) score = -oneInLine;
	}

	// eval cell 3
	if(line[2] == "O"){
		if(score == oneInLine) score = twoInLine;
		else if(score == twoInLine) score = threeInLine;
		else if(score < 0) return 0;
		else if(score == 0) score = oneInLine;
	}
	if(line[2] == "X"){
		if(score == -oneInLine) score = -twoInLine;
		else if(score == -twoInLine) score = -threeInLine;
		else if(score > 0) return 0;
		else if(score == 0) score = -oneInLine;
	}

	return score;
}

