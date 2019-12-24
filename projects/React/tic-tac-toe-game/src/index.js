import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

let winningCombination = [];

function Square(props){
    let classNames = props.currentMove === true ? "square currentMoveSquare" : "square";
    classNames += props.winningSquare === true ? " winningSquare" : "";
    return(
        <button
            className={classNames}
            onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component{
    renderSquare(i){    
        let winningSquare= winningCombination.includes(i) ? true : false;
        return(
            <Square
                currentMove={this.props.currentMove === i}
                key={i}
                value={this.props.squares[i]}
                winningSquare={winningSquare}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
        
    render(){
        return(
            [0, 1, 2].map((row) => {
                return(
                    <div className="board-row" key={row}>
                        {[0, 1, 2].map((col) => this.renderSquare(row * 3 + col))}
                    </div>
                );
            })
        );
    }
}

class Game extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            coordinates: [{
                coords: [null, null],
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const coordinates = this.state.coordinates.slice(0, this.state.stepNumber + 1);
        const currCoord = calcCoords(i);

        if(calculateWinner(squares) || squares[i]){
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            coordinates: coordinates.concat([{
                coords: currCoord,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render(){
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const previous = this.state.stepNumber === 0 ? history[0] : history[this.state.stepNumber - 1];
        const winner = calculateWinner(current.squares);
        const currentMove = compareSteps(current, previous);

        const moves = history.map((step, move) => {
            const coords = this.state.coordinates[move];
            const desc = move ?
                'Go to move #' + move + ' coords: (' + (coords["coords"][0] + 1) + ',' + (coords["coords"][1] + 1) + ')' :
                'Go to game start';

            if(this.state.stepNumber === move){
                return(
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
                    </li>
                );
            }else{
                return(
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                );
            }
        });

        let status;
        if(winner){
            status = 'Winner: ' + winner;
        }else{
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O') + "Count: " + this.state.stepNumber;
        }
        if(!winner && this.state.stepNumber === 9){
            status = "There is no winner in this game. It´s a draw !";
        }

        return(
            <div className="game">
                <div className="game-board">
                    <Board
                        currentMove={currentMove}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winningCombination={winningCombination}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ul>{moves}</ul>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares){
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
    for(let i=0; i < lines.length; i++){
        const [a, b, c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            winningCombination = lines[i];
            return squares[a];
        }
    }
    winningCombination = [];
    return null;
}

function compareSteps(current, previous){
    let currentMove;
    for(let i = 0; i < current.squares.length; i++){
        if(current.squares[i] === previous.squares[i]){
            continue;
        }
        currentMove = i;
    }
    return currentMove;
}

function calcCoords(index){
    return [(index % 3), Math.floor(index / 3)];
}

// ----------

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);