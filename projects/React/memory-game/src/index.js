import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Card(props){
    const imageURI = process.env.PUBLIC_URL + '/assets/' + props.imagePath;
    
    return(
        <div
            className="card"
            key={props.imagePath + Math.random()}
            onClick={props.onClick}>
            <img src={imageURI} />
        </div>
    );
}

class Board extends React.Component{
    renderCard(imagePath){
        return(
            <Card
                imagePath={imagePath}
                onClick={() => this.props.onClick()}
            />
        );
    }

    render(){
        return(
            this.props.images.map((imageSrc) =>{
                return(            
                    <div
                        className="board-row"
                        key={"theCard" + imageSrc + Math.random()}
                    >
                        {this.renderCard(imageSrc)}
                    </div>
                );
            })
        );
    };
}

class Game extends React.Component{
    constructor(props){
        super(props);
        const cardImagePaths = [
            'kitty01.png',
            'kitty02.png',
            'kitty03.png',
            'kitty04.png',
            'skeleton01.png',
        ];
        const doubleCardSet = cardImagePaths.concat(cardImagePaths);

        this.state = {
            cardImages: shuffleCards(doubleCardSet),
        };
    }

    handleClick(){
        console.log(this);
    }

    render(){
        return(
            <div className="game">
                <div className="game-board">
                    <Board
                        onClick={() => this.handleClick()}
                        images={this.state.cardImages}
                    />
                </div>
                <div className="game-info">
                    <div>status</div>
                </div>
            </div>
        );
    }
}

/*
    helper methods
*/

// SOURCE: https://javascript.info/task/shuffle
function shuffleCards(array){
    for(let i = array.length - 1; i > 0; i--){
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    };
    return array;
}

// ----------

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);