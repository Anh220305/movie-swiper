import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import FacebookLogin from 'react-facebook-login';
import './index.css';

const BASE_URL = 'http://moviefindr.ddns.net:8000/backend/api'

const uploadMovie = (username, movieName, setResult) => {
    fetch(`${BASE_URL}/upload?username=${encodeURIComponent(username)}&movie=${encodeURIComponent(movieName)}`)
      .then(response => response.json())
      .then(data => {
        setResult(data);
      });
}

const Upload = (props) => {
  const [inputValue, setInputValue] = useState('');

  const [result, setResult] = useState(null);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setInputValue('');
    uploadMovie(props.username, inputValue, setResult)
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
        <div class="pink">
            {!!result && (
                <>
                    <h2>We've made a note that you want to watch the following movie:</h2>
                    <Card movie={result} />
                </>
            )}
            {result !== null && !result && (
                <h1>Sorry! We can't find that movie.</h1>
            )}
        </div>
    </div>
  );
}

const fetchSwipeContents = (username, setCards) => {
    fetch(`${BASE_URL}/novel_movies/${username}/`,
        {headers: {'Content-Type': 'application/json'}}
    )
    .then(response => response.json())
    .then(data => {
        setCards(data);
    });
}

// TODO make API request
const postSwipeResults = (username, movie, liked) => {
    const data = { 'username':username, 'moviedb_id_to_rating': {[movie.movieDbId]: liked}}

    console.log(data);

    fetch(
        `${BASE_URL}/rate_movie`,
        {method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)}
    )

}

const Card = (props) => {

    return (

        <div className="movieCard">
            <img alt={`${props.movie.title} poster`}src={props.movie.posterUrl} className="poster"></img>
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
        fetchSwipeContents(props.username, setCards);
    }, [])

    const swipeLeft = () => {
        if (cardIndex < cards.length) {
            console.log(cards[cardIndex]);
            postSwipeResults(props.username, cards[cardIndex], false);
            setCardIndex((current) => current+1);
        }
    }

    const swipeRight = () => {
        if (cardIndex < cards.length) {
            postSwipeResults(props.username, cards[cardIndex], true);
            setCardIndex((current) => current+1);
        }
    }

    useEffect(() => {
        if (cardIndex >= cards.length) {
            fetchSwipeContents(props.username, setCards);
            setCardIndex(0);
        }
    }, [cardIndex])

    return (
        <div className="main blue">
            <h1>For each movie, let us know if you'd watch it or not!</h1>
            <div className="cardContainer blue">
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
            <img className="miniPoster" alt={`${props.movie.title} poster`} src={props.movie.posterUrl}></img>
            <div className="miniMovieInfo">
                <h4>{props.movie.title}</h4>
                <p>{props.movie.description}</p>
            </div>
        </div>
    )
}

const getMovieIntersection = (username, usernames, setMovies) => {
    fetch(`${BASE_URL}/intersection?usernames=${encodeURIComponent(usernames.concat([username]).join())}`,
    )
    .then(response => response.json())
    .then(data => {
        setMovies(data);
    });
}

const Compare = (props) => {

    const [friends, setFriends] = useState([]);
    const [movies, setMovies] = useState([]);

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
        setFriends(friends.filter((friend) => friend !== name));
    }

    useEffect(() => {
        getMovieIntersection(props.username, friends, setMovies);
    }, [friends]);

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
                <div className="movieList green">
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

    const responseFacebook = (response) => {
        console.log(response);
        props.setUsername(response.name);
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
              <p>OR</p>
              <FacebookLogin
                appId="3306640759452993" //APP ID NOT CREATED YET
                fields="name,email,picture"
                callback={responseFacebook}
              />
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

  const logout = () => {
    if (loggedIn) {
        window.location.reload(false);
    }
  }

  return (
    <>
     <button className="nav" onClick={()=>setState(0)}>
        {loggedIn ? `${username}'s Home` : 'Home'}
     </button>
     <button className="logout" onClick={logout}>Logout</button>
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
