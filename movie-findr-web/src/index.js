import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Upload = () => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event) => {
    setInputValue(event.target.value);
  }

  const handleSubmit = (event) => {
    alert('A movie was submitted: ' + inputValue);
    event.preventDefault();
  }

  return (
    <div className="main pink">
        <form onSubmit={handleSubmit}>
          <label>
            <h1>Enter a movie you want to see:</h1>
            <input className="textInput" type="text" value={inputValue} onChange={handleChange} />
          </label>
          <input className="submitButton" type="submit" value="submit" />
        </form>
    </div>
  );
}

const fetchSwipeContents = () => {
    return [];
}

const postSwipeResults = (cards) => {}

const Card = (props) => {

    return (

        <div className="movieCard">
            <img src={props.movie.posterUrl} className="poster"></img>
            <div className="movieInfo">
                <h3>{props.movie.title}</h3>
                <p>{props.movie.description}</p>
            </div>
        </div>

    )

}

const Swipe = (props) => {

    const [cards, setCards] = useState([]);
    const [cardIndex, setCardIndex] = useState(0);

    useEffect(() => {
        setCards(fetchSwipeContents());
    }, [])

    const swipeLeft = () => {
        if (cardIndex < cards.length) {
            cards[cardIndex].liked = false;
            cardIndex++;
        }
    }

    const swipeRight = () => {
        if (cardIndex < cards.length) {
            cards[cardIndex].liked = true;
            cardIndex++;
        }
    }

    useEffect(() => {
        if (cardIndex >= cards.length) {
            postSwipeResults(cards);
            setCards(fetchSwipeContents());
            setCardIndex(0);
        }
    }, [cardIndex])

    return (
        <div className="main blue">
            <h1>For each movie, let us know if you'd watch it or not!</h1>
            <div className="cardContainer">
                {cardIndex < cards.length ? <Card movie={cards[cardIndex]} /> : <h3 className="emptyCard">No movies currently available!</h3>}
                <button className="swipe swipeLeft" onClick={swipeLeft} >X</button>
                <button className="swipe swipeRight" onClick={swipeRight} >✓</button>
            </div>
        </div>
    )

}

const Compare = (props) => {

    return (
        <div className="main green">
            Compare
        </div>
    )

}

const Home = (props) => {

    return (
        <div className="main black">
            <button className="buttonPanel pink" onClick={() => props.changeState(1)}>
                Upload
            </button>
            <button className="buttonPanel blue" onClick={() => props.changeState(2)}>
                Swipe
            </button>
            <button className="buttonPanel green" onClick={() => props.changeState(3)}>
                Compare
            </button>
        </div>
    )

}

const App = () => {

  const [state, setState] = useState(0);

  const changeState = (newState) => {
    setState(newState);
  }

  return (
    <>
     <button className="nav" onClick={()=>setState(0)}>
        Home
     </button>
     {state === 0 && < Home changeState={changeState}/>}
     {state === 1 && < Upload />}
     {state === 2 && < Swipe />}
     {state === 3 && < Compare />}
    </>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);