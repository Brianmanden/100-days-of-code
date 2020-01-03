import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Card(props){
    const imageURI = process.env.PUBLIC_URL + props.imageSrc;
    const cardText = "Card " + (props.index + 1);
    let classNames = "card ";
    classNames += props.clicked ? "flipped " : "";
    classNames += props.locked ? "locked " : "";

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
                locked={this.props.locked.includes(index)}
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
        this.handleClick = this.handleClick.bind(this);
        this.newGame = this.newGame.bind(this);
        this.initGame();
    }

    handleClick(cardImage, index){ 
        if(this.state.lockedForClicks || this.state.lockedCards.includes(index)){
            return;
        }
        const indeces = this.state.clickedCardsIndeces;
        // check for clicking same card over and over
        if(indeces.includes(index) || indeces.length > 1){
            return;
        }else{
            this.setState({
                clickedCardsIndeces: [...indeces, index],
                clickedCardsImages: [...this.state.clickedCardsImages, cardImage]
            });
        }
        
        if(indeces.length === 1){
            if(this.state.clickedCardsImages[0] === cardImage){
                console.log("match");

                this.setState({
                    lockedCards: [
                        ...this.state.lockedCards,
                        this.state.lockedCards.indexOf(this.state.clickedCardsIndeces[0]) === -1 ? this.state.clickedCardsIndeces[0] : null,
                        this.state.lockedCards.indexOf(index) === -1 ? index : null],
                    lockedForClicks: true,
                    status: "You found a matching pair of cards!",
                });

                setTimeout(() => {
                        console.log("lock = false");
                        this.setState({
                            clickedCardsIndeces: [],
                            clickedCardsImages: [],
                            lockedForClicks: false,
                            status: this.state.lockedCards.length === this.state.cardImages.length ? "You found them all" : ""
                        });
                    }, 700
                );
                
            }else{
                this.setState({
                    status: "Those cards are not a match"
                });          
                setTimeout(() => {
                        this.setState({
                            clickedCardsIndeces: [],
                            clickedCardsImages: [],
                            status: ""
                        });
                    }, 700
                );
            }
        }
    }

    initGame(){
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
            lockedCards: [],
            lockedForClicks: false,
            running: false,
            status: "",
            time: 0
        };
    }

    render(){
        return(
            <div className="game">
                <div className="game-board">
                    <Board
                        clicked={this.state.clickedCardsIndeces}
                        images={this.state.cardImages}
                        locked={this.state.lockedCards}
                        onClick={(cardImage, index) => this.handleClick(cardImage, index)}
                    />
                </div>
                <div className="game-info"></div>
                <div>
                    status: {this.state.status}<br />
                    locked: {this.state.lockedForClicks}<br />
                    clickedCardsIndeces: {this.state.clickedCardsIndeces}<br />
                    clickedCardsImages: {this.state.clickedCardsImages}<br />
                    You have found {(this.state.lockedCards.length / 2) > 0 ? (this.state.lockedCards.length / 2) : 0} {(this.state.lockedCards.length / 2) === 1 ? "pair" : "pairs"}.<br />
                    lockedCards: {this.state.lockedCards}<br />
                    lockedCards: {this.state.lockedCards.length}<br />
                    time: {this.state.time}<br />
                    {this.state.lockedCards.length > 10 &&
                        <button
                            onClick={() => this.newGame()}>
                            Start new game
                        </button>
                    }
                </div>
            </div>
        );
    }

    newGame(){
        console.log("new game");
        this.initGame();
        //this.timer();
    }

    // timer(){
    //     if(this.state.running){
    //         return;
    //     }

    //     setInterval(() => {
    //         console.log("tick");
    //         this.setState({
    //             time: this.state.time + 1
    //         });
    //     }, 1000);
    //     this.setState({
    //         running: true
    //     });
    // }
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