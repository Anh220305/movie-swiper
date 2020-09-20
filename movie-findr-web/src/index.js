import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// TODO make API request
const uploadMovie = (username, movieName) => {
    return false;
}

const Upload = (props) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event) => {
    setInputValue(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setInputValue('');
    alert('A movie was submitted: ' + inputValue + ' by '+props.username);
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

// TODO make API request
const fetchSwipeContents = (username) => {
    return [{"title": "We Summon the Darkness", "movieDbId": 546724, "description": "Three best friends attending a heavy-metal show cross paths with sadistic killers after they travel to a secluded country home for an after party.", "posterUrl": "http://image.tmdb.org/t/p/w342/zXAwq18CJYmzhLZNbLpBf3dG3A5.jpg", "netflixOk": false}, {"title": "Weathering with You", "movieDbId": 568160, "description": "Tokyo is currently experiencing rain showers that seem to disrupt the usual pace of everyone living there to no end. Amidst this seemingly eternal downpour arrives the runaway high school student Hodaka Morishima, who struggles to financially support himself\u2014ending up with a job at a small-time publisher. At the same time, the orphaned Hina Amano also strives to find work to sustain herself and her younger brother.\r Both fates intertwine when Hodaka attempts to rescue Hina from shady men, deciding to run away together. Subsequently, Hodaka discovers that Hina has a strange yet astounding power: the ability to call out the sun whenever she prays for it. With Tokyo's unusual weather in mind, Hodaka sees the potential of this ability. He suggests that Hina should become a \"sunshine girl\"\u2014someone who will clear the sky for people when they need it the most.\r Things begin looking up for them at first. However, it is common knowledge that power always comes with a hefty price...", "posterUrl": "http://image.tmdb.org/t/p/w342/qgrk7r1fV4IjuoeiGS5HOhXNdLJ.jpg", "netflixOk": false}, {"title": "Your Name.", "movieDbId": 372058, "description": "High schoolers Mitsuha and Taki are complete strangers living separate lives. But one night, they suddenly switch places. Mitsuha wakes up in Taki\u2019s body, and he in hers. This bizarre occurrence continues to happen randomly, and the two must adjust their lives around each other.", "posterUrl": "http://image.tmdb.org/t/p/w342/q719jXXEzOoYaps6babgKnONONX.jpg", "netflixOk": false}, {"title": "Zombieland: Double Tap", "movieDbId": 338967, "description": "Columbus, Tallahassee, Wichita, and Little Rock move to the American heartland as they face off against evolved zombies, fellow survivors, and the growing pains of the snarky makeshift family.", "posterUrl": "http://image.tmdb.org/t/p/w342/dtRbVsUb5O12WWO54SRpiMtHKC0.jpg", "netflixOk": false}];
}

// TODO make API request
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
        setCards(fetchSwipeContents(props.username));
    }, [])

    const swipeLeft = () => {
        if (cardIndex < cards.length) {
            setCards((currentCards) => Object.assign([], cards, {cardIndex: {...cards[cardIndex], liked: false}}));
            setCardIndex((current) => current+1);
        }
    }

    const swipeRight = () => {
        if (cardIndex < cards.length) {
            setCards((currentCards) => Object.assign([], cards, {cardIndex: {...cards[cardIndex], liked: true}}));
            setCardIndex((current) => current+1);
        }
    }

    useEffect(() => {
        if (cardIndex >= cards.length) {
            postSwipeResults(cards);
            setCards(fetchSwipeContents(props.username));
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

const Friend = (props) => {
    return (
        <div className="friend">
            {props.name}
            <button className="removeFriend" onClick={props.removeFriend}>x</button>
        </div>
    )
}

const Movie = (props) => {
    return (
        <div className="movie">
            <img className="miniPoster" src={props.movie.posterUrl}></img>
            <div className="miniMovieInfo">
                <h4>{props.movie.title}</h4>
                <p>{props.movie.description}</p>
            </div>
        </div>
    )
}

// TODO make API request
const getMovieIntersection = (usernames) => {
    return [{"title": "We Summon the Darkness", "movieDbId": 546724, "description": "Three best friends attending a heavy-metal show cross paths with sadistic killers after they travel to a secluded country home for an after party.", "posterUrl": "http://image.tmdb.org/t/p/w342/zXAwq18CJYmzhLZNbLpBf3dG3A5.jpg", "netflixOk": false}, {"title": "Weathering with You", "movieDbId": 568160, "description": "Tokyo is currently experiencing rain showers that seem to disrupt the usual pace of everyone living there to no end. Amidst this seemingly eternal downpour arrives the runaway high school student Hodaka Morishima, who struggles to financially support himself\u2014ending up with a job at a small-time publisher. At the same time, the orphaned Hina Amano also strives to find work to sustain herself and her younger brother.\r Both fates intertwine when Hodaka attempts to rescue Hina from shady men, deciding to run away together. Subsequently, Hodaka discovers that Hina has a strange yet astounding power: the ability to call out the sun whenever she prays for it. With Tokyo's unusual weather in mind, Hodaka sees the potential of this ability. He suggests that Hina should become a \"sunshine girl\"\u2014someone who will clear the sky for people when they need it the most.\r Things begin looking up for them at first. However, it is common knowledge that power always comes with a hefty price...", "posterUrl": "http://image.tmdb.org/t/p/w342/qgrk7r1fV4IjuoeiGS5HOhXNdLJ.jpg", "netflixOk": false}, {"title": "Your Name.", "movieDbId": 372058, "description": "High schoolers Mitsuha and Taki are complete strangers living separate lives. But one night, they suddenly switch places. Mitsuha wakes up in Taki\u2019s body, and he in hers. This bizarre occurrence continues to happen randomly, and the two must adjust their lives around each other.", "posterUrl": "http://image.tmdb.org/t/p/w342/q719jXXEzOoYaps6babgKnONONX.jpg", "netflixOk": false}, {"title": "Zombieland: Double Tap", "movieDbId": 338967, "description": "Columbus, Tallahassee, Wichita, and Little Rock move to the American heartland as they face off against evolved zombies, fellow survivors, and the growing pains of the snarky makeshift family.", "posterUrl": "http://image.tmdb.org/t/p/w342/dtRbVsUb5O12WWO54SRpiMtHKC0.jpg", "netflixOk": false}];
}

const Compare = (props) => {

    const [friends, setFriends] = useState([])

    const [inputValue, setInputValue] = useState('');

    const handleChange = (event) => {
        setInputValue(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setInputValue('');
        setFriends([...friends, inputValue]);
    }

    const removeFriend = (name) => {
        setFriends(friends.filter((friend) => friend != name));
    }

    const movies = getMovieIntersection(friends);

    return (
        <div className="main green">
            <div className="chooseFriends">
                <form onSubmit={handleSubmit}>
                  <label>
                    Enter the username of a friend to compare with:{' '}
                    <input className="friendInput" type="text" value={inputValue} onChange={handleChange} />
                  </label>
                  <input className="friendSubmit" type="submit" value="submit" />
                </form>
                <div className="friendList">
                    {friends.map((f) => (<Friend name={f} key={f} removeFriend={() => removeFriend(f)} />))}
                </div>
                <div className="movieList">
                    <h2>Movies you all want to watch:</h2>
                    {movies.map((m) => (<Movie movie={m} key={m.title} />))}
                </div>
            </div>
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

const Login = (props) => {

    const [inputValue, setInputValue] = useState('');

    const handleChange = (event) => {
        setInputValue(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        props.setUsername(inputValue);
        props.logIn();
    }

    return (
        <div className="loginPopup">
            <form onSubmit={handleSubmit}>
              <label>
                <h1>Enter your username:</h1>
                <input className="usernameInput" type="text" value={inputValue} onChange={handleChange} />
              </label>
              <input className="usernameSubmit" type="submit" value="submit" />
            </form>
        </div>
    );

}

const App = () => {

  const [state, setState] = useState(0);

  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const changeState = (newState) => {
    if (loggedIn) {
        setState(newState);
    }
  }

  const logIn = () => {
    setLoggedIn(true);
  }

  return (
    <>
     <button className="nav" onClick={()=>setState(0)}>
        {loggedIn ? `${username}'s Home` : 'Home'}
     </button>
     {state === 0 && < Home changeState={changeState}/>}
     {state === 1 && < Upload username={username} />}
     {state === 2 && < Swipe username={username} />}
     {state === 3 && < Compare username={username} />}
     {!loggedIn && < Login setUsername={setUsername} logIn={logIn}/>}
    </>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);