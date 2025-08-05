import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import FacebookLogin from 'react-facebook-login';
import './index.css';

const BASE_URL = 'http://localhost:8000/backend/api'

const searchMovies = (query, setSearchResults, setIsSearching) => {
    if (!query.trim()) {
        setSearchResults([]);
        return;
    }
    
    setIsSearching(true);
    fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(data => {
        setSearchResults(data.results || []);
        setIsSearching(false);
      })
      .catch(error => {
        console.error('Search error:', error);
        setSearchResults([]);
        setIsSearching(false);
      });
}

const uploadMovie = (username, movieId, movieName, setResult) => {
    const url = movieId 
        ? `${BASE_URL}/upload?username=${encodeURIComponent(username)}&movie_id=${movieId}`
        : `${BASE_URL}/upload?username=${encodeURIComponent(username)}&movie=${encodeURIComponent(movieName)}`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setResult(data);
      })
      .catch(error => {
        console.error('Upload error:', error);
        setResult(false);
      });
}

const MovieSearchResult = ({ movie, onSelect }) => {
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const rating = movie.vote_average ? `★ ${movie.vote_average.toFixed(1)}` : '';
  
  return (
    <div className="search-result-item" onClick={() => onSelect(movie)}>
      <div className="search-result-poster">
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt={movie.title} />
        ) : (
          <div className="poster-placeholder">No Image</div>
        )}
      </div>
      <div className="search-result-info">
        <h3>{movie.title} {releaseYear && `(${releaseYear})`}</h3>
        <p>{movie.description ? movie.description.substring(0, 150) + '...' : 'No description available'}</p>
        <div className="movie-meta">
          {rating && <span className="rating">{rating}</span>}
          {movie.in_database === false && <span className="new-movie">New Movie</span>}
        </div>
      </div>
    </div>
  );
};

const Upload = (props) => {
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue.length > 2) {
        searchMovies(inputValue, setSearchResults, setIsSearching);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
    setSelectedMovie(null);
    setResult(null);
  }

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setInputValue(movie.title);
    setShowResults(false);
    setSearchResults([]);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (selectedMovie) {
      // Use selected movie from search results
      uploadMovie(props.username, selectedMovie.id || selectedMovie.movieDbId, selectedMovie.title, setResult);
    } else if (inputValue.trim()) {
      // Fallback to text search
      uploadMovie(props.username, null, inputValue.trim(), setResult);
    }
  }

  return (
    <div className="main green">
        <div className="upload-container">
          <div className="upload-header">
            <button className="go-back-btn" onClick={() => props.changeState(0)}>
              ← Go Back to Home
            </button>
            <h1>Find and add a movie you want to see:</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="search-form">
            <div className="search-input-container">
              <input 
                className="textInput search-input" 
                type="text" 
                value={inputValue} 
                onChange={handleChange}
                placeholder="Search for movies (e.g., 'Inception', 'Marvel', 'Tom Hanks')..."
                autoComplete="off"
              />
              
              {isSearching && <div className="search-spinner">Searching...</div>}
              
              {showResults && searchResults.length > 0 && (
                <div className="search-results-dropdown">
                  {searchResults.map((movie, index) => (
                    <MovieSearchResult 
                      key={movie.id || movie.movieDbId || index}
                      movie={movie}
                      onSelect={handleMovieSelect}
                    />
                  ))}
                </div>
              )}
              
              {showResults && searchResults.length === 0 && !isSearching && inputValue.length > 2 && (
                <div className="search-results-dropdown">
                  <div className="no-results">No movies found. Try a different search term.</div>
                </div>
              )}
            </div>
            
            <input 
              className="submitButton" 
              type="submit" 
              value={selectedMovie ? `Add "${selectedMovie.title}"` : "Search & Add Movie"} 
              disabled={!inputValue.trim()}
            />
          </form>

          {selectedMovie && (
            <div className="selected-movie-preview">
              <h3>Selected Movie:</h3>
              <MovieSearchResult movie={selectedMovie} onSelect={() => {}} />
            </div>
          )}
        </div>
        
        <div className="upload-results">
            {!!result && (
                <>
                    <h2>✅ Successfully added to your watchlist:</h2>
                    <Card movie={result} />
                </>
            )}
            {result !== null && !result && (
                <div className="error-message">
                  <h2>❌ Sorry! We couldn't add that movie.</h2>
                  <p>Please try searching for a different movie or check your spelling.</p>
                </div>
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
        <div className="main brown">
            <div className="swipe-header">
                <button className="go-back-btn" onClick={() => props.changeState(0)}>
                    ← Go Back to Home
                </button>
                <h1>For each movie, let us know if you'd watch it or not!</h1>
            </div>
            <div className="cardContainer brown">
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
        <div className="main purple">
            <div className="compare-header">
                <button className="go-back-btn" onClick={() => props.changeState(0)}>
                    ← Go Back to Home
                </button>
            </div>
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
            <div className="button-container">
                <button className="buttonPanel green" onClick={() => props.changeState(1)}>
                    Pick
                </button>
                <button className="buttonPanel brown" onClick={() => props.changeState(2)}>
                    Swipe
                </button>
                <button className="buttonPanel purple" onClick={() => props.changeState(3)}>
                    Compare
                </button>
            </div>
        </div>
    )

}

const WelcomePage = (props) => {
    return (
        <div className="welcome-page">
            <div className="welcome-container">
                <h1 className="welcome-title">Welcome to Movie Finder</h1>
                <p className="welcome-subtitle">Discover your next favorite movie with friends</p>
                <div className="login-card">
                    <Login setUsername={props.setUsername} logIn={props.logIn} />
                </div>
            </div>
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
        <div className="login-form">
            <form onSubmit={handleSubmit}>
              <label>
                <h3>Enter your username:</h3>
                <input className="usernameInput" type="text" value={inputValue} onChange={handleChange} placeholder="Username" />
              </label>
              <input className="usernameSubmit" type="submit" value="Get Started" />
              <div className="or-divider">
                <span>OR</span>
              </div>
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
     {loggedIn && (
       <>
         <button className="nav" onClick={()=>setState(0)}>
            {username}'s Home
         </button>
         <button className="logout" onClick={logout}>Logout</button>
       </>
     )}
     {!loggedIn && < WelcomePage setUsername={setUsername} logIn={logIn}/>}
     {loggedIn && state === 0 && < Home changeState={changeState}/>}
     {loggedIn && state === 1 && < Upload username={username} changeState={changeState} />}
     {loggedIn && state === 2 && < Swipe username={username} changeState={changeState} />}
     {loggedIn && state === 3 && < Compare username={username} changeState={changeState} />}
    </>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
