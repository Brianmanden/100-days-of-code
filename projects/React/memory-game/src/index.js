import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Card(props){
    const imageURI = process.env.PUBLIC_URL + props.imageSrc;
    const cardText = "Card " + props.index;

    return(
        <div
            className="card"
            key={props.imageSrc + "_" + props.index}
            onClick={props.onClick}>
                <div className="card-front">
                    <p>{props.index + 1}</p>
                </div>
                <div className="card-back">
                    <img src={imageURI} alt={cardText} title={cardText} />
                </div>
        </div>
    );
}

class Board extends React.Component{
    renderCard(imageSrc, index){
        return(
            <Card
                imageSrc={imageSrc}
                key={"key_" + index}
                index={index}
                onClick={() => this.props.onClick(imageSrc, index)}
            />
        );
    }

    render(){
        return(            
            [0, 1, 2, 3].map((row) => {
                return(
                    <div
                        className="board-row"
                        key={row}
                    >
                        {
                            [0, 1, 2]
                            .map(
                                (col) => {
                                    const index = row * 3 + col;
                                    const imageSrc = this.props.images[index];                                    
                                    return this.renderCard(imageSrc, index);
                            })
                        }
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
            '/assets/kitty01.png',
            '/assets/kitty02.png',
            '/assets/kitty03.png',
            '/assets/kitty04.png',
            '/assets/skeleton01.png',
            '/assets/grumpy01.png',
        ];
        const doubleCardSet = cardImagePaths.concat(cardImagePaths);

        this.state = {
            cardImages: shuffleCards(doubleCardSet),
            clickedCard: [],
            status: ""
        };
    }

    handleClick(cardImage, index){
        console.log(cardImage, index, this.state.clickedCard);
        if(this.state.clickedCard.length > 0){
            // return if clicking on same card multiple times
            if(this.state.clickedCard[1] === index){
                console.log("-1-", "multiple clicks");
                return;
            }
            // check for match
            if(this.state.clickedCard[0] === cardImage){
                console.log("-2-", "match");
                this.setState({
                    status: "match found"
                });
            }else{
                this.setState({
                    clickedCard: []
                });                
            }
        }
        //
        else{
            this.setState({
                clickedCard: [cardImage, index]
            });
            return;
        }
    }

    render(){
        return(
            <div className="game">
                <div className="game-board">
                    <Board
                        images={this.state.cardImages}
                        onClick={(cardImage, index) => this.handleClick(cardImage, index)}
                    />
                </div>
                <div className="game-info">
                <div>status: {this.state.status}</div>
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