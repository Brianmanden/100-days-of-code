import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Card(props){
    const imageURI = process.env.PUBLIC_URL + props.imageSrc;
    const cardText = "Card " + (props.index + 1);
    const classNames = props.clicked ? "card flipped" : "card";

    return(
        <div
            className={classNames}
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
                clicked={this.props.clicked.includes(index)}
                imageSrc={imageSrc}
                index={index}
                key={"key_" + index}
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
            clickedCardsIndeces: [],
            clickedCardsImages: [],
            status: ""
        };
    }

    handleClick(cardImage, index){
        const indeces = this.state.clickedCardsIndeces;
        if(indeces.includes(index)){
            console.log("Already clicked - do nothing");
        }else{
            this.setState({
                clickedCardsIndeces: [...indeces, index],
                clickedCardsImages: [...this.state.clickedCardsImages, cardImage]
            });
        }
        
        // HERE
        if(this.state.clickedCardsIndeces.length === 1){
            if(this.state.clickedCardsImages[0] === cardImage){
                console.log("match");
                this.setState({
                    status: "You found a matching pair of cards."
                });
            }
            // else{
            //     console.log("no match");
            //     console.log(this.state.clickedCardsImages);
            //     // this.setState({
            //     //     clickedCardsIndeces: [],
            //     //     clickedCardsImages: []
            //     // });
            // }
        }
    }

    render(){
        return(
            <div className="game">
                <div className="game-board">
                    <Board
                        clicked={this.state.clickedCardsIndeces}
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