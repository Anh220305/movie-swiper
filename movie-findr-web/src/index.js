import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import FacebookLogin from 'react-facebook-login';
import './index.css';

const BASE_URL = 'http://localhost:8000/backend/api'

// Navigation Component
const BackArrow = ({ onClick }) => (
  <div className="back-arrow" onClick={onClick}>
    <svg viewBox="0 0 24 24">
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
    </svg>
  </div>
);

// Icon Components
const UploadIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
  </svg>
);

const CompareIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V5H19V19M17,17H7V16H17V17M17,15H7V14H17V15M17,12H7V7H17V12Z"/>
  </svg>
);

// Home Component
const Home = ({ setCurrentView, username }) => (
  <div className="main">
    <div className="home-container">
      <div className="feature-card upload" onClick={() => setCurrentView('upload')}>
        <div className="card-content">
          <div className="card-icon">
            <UploadIcon />
          </div>
          <h2>Upload</h2>
          <p>Add new movies to your collection. Upload video files, posters, and metadata.</p>
        </div>
        <button className="card-button">Add Movies</button>
      </div>

      <div className="feature-card swipe" onClick={() => setCurrentView('swipe')}>
        <div className="card-content">
          <div className="card-icon">
            <HeartIcon />
          </div>
          <h2>Swipe</h2>
          <p>Discover your next favorite movie. Swipe right to like, left to pass.</p>
        </div>
        <button className="card-button">Start Swiping</button>
      </div>

      <div className="feature-card compare" onClick={() => setCurrentView('compare')}>
        <div className="card-content">
          <div className="card-icon">
            <CompareIcon />
          </div>
          <h2>Compare</h2>
          <p>Compare movies side by side. Ratings, cast, reviews, and more.</p>
        </div>
        <button className="card-button">Compare Now</button>
      </div>
    </div>
  </div>
);

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

const Upload = ({ username, setCurrentView }) => {
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
      uploadMovie(username, selectedMovie.id || selectedMovie.movieDbId, selectedMovie.title, setResult);
    } else if (inputValue.trim()) {
      uploadMovie(username, null, inputValue.trim(), setResult);
    }
  }

  return (
    <div className="main">
      <BackArrow onClick={() => setCurrentView('home')} />
      <div className="page-container">
        <div className="page-header">
          <h1>Upload Movies</h1>
          <p>Find and add movies to your collection</p>
        </div>
        <div className="page-content">
          <div className="upload-container">
            <form onSubmit={handleSubmit} className="search-form">
              <div className="search-input-container">
                <input 
                  className="search-input" 
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
              
              <button 
                className="submitButton" 
                type="submit" 
                disabled={!inputValue.trim()}
              >
                {selectedMovie ? `Add "${selectedMovie.title}"` : "Search & Add Movie"}
              </button>
            </form>

            {selectedMovie && (
              <div className="selected-movie-preview">
                <h3>Selected Movie:</h3>
                <MovieSearchResult movie={selectedMovie} onSelect={() => {}} />
              </div>
            )}
            
            {!!result && (
              <div className="upload-results success">
                <h2><span role="img" aria-label="success">✅</span> Successfully added to your watchlist!</h2>
                <Card movie={result} />
              </div>
            )}
            {result !== null && !result && (
              <div className="upload-results error">
                <h2><span role="img" aria-label="error">❌</span> Sorry! We couldn't add that movie.</h2>
                <p>Please try searching for a different movie or check your spelling.</p>
              </div>
            )}
          </div>
        </div>
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

const Swipe = ({ username, setCurrentView }) => {
    const [cards, setCards] = useState([]);
    const [cardIndex, setCardIndex] = useState(0);

    useEffect(() => {
        fetchSwipeContents(username, setCards);
    }, [username])

    const swipeLeft = () => {
        if (cardIndex < cards.length) {
            postSwipeResults(username, cards[cardIndex], false);
            setCardIndex((current) => current+1);
        }
    }

    const swipeRight = () => {
        if (cardIndex < cards.length) {
            postSwipeResults(username, cards[cardIndex], true);
            setCardIndex((current) => current+1);
        }
    }

    useEffect(() => {
        if (cardIndex >= cards.length) {
            fetchSwipeContents(username, setCards);
            setCardIndex(0);
        }
    }, [cardIndex, username])

    return (
        <div className="main">
            <BackArrow onClick={() => setCurrentView('home')} />
            <div className="page-container">
                <div className="page-header">
                    <h1>Swipe Movies</h1>
                    <p>Discover your next favorite movie by swiping</p>
                </div>
                <div className="page-content">
                    <div className="cardContainer">
                        {cardIndex < cards.length ? <Card movie={cards[cardIndex]} /> : <h3 className="emptyCard">No movies currently available!</h3>}
                        <button className="swipe swipeLeft" onClick={swipeLeft} ><span role="img" aria-label="dislike">❌</span></button>
                        <button className="swipe swipeRight" onClick={swipeRight} ><span role="img" aria-label="like">✅</span></button>
                    </div>
                </div>
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

const Compare = ({ username, setCurrentView }) => {
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
        getMovieIntersection(username, friends, setMovies);
    }, [friends, username]);

    return (
        <div className="main">
            <BackArrow onClick={() => setCurrentView('home')} />
            <div className="page-container">
                <div className="page-header">
                    <h1>Compare Movies</h1>
                    <p>Find movies you and your friends all want to watch</p>
                </div>
                <div className="page-content">
                    <div className="chooseFriends">
                        <form onSubmit={handleSubmit} className="search-form">
                            <input 
                                className="search-input" 
                                type="text" 
                                value={inputValue} 
                                onChange={handleChange}
                                placeholder="Enter a friend's username..."
                            />
                            <button className="submitButton" type="submit">Add Friend</button>
                        </form>
                        
                        {friends.length > 0 && (
                            <div className="friendList">
                                <h3>Comparing with:</h3>
                                {friends.map((f) => (<Friend name={f} key={f} removeFriend={() => removeFriend(f)} />))}
                            </div>
                        )}
                        
                        {movies.length > 0 && (
                            <div className="movieList">
                                <h2>Movies you all want to watch:</h2>
                                {movies.map((m) => (<Movie movie={m} key={m.title} />))}
                            </div>
                        )}
                        
                        {friends.length > 0 && movies.length === 0 && (
                            <div className="no-results">
                                <p>No common movies found. Try adding more friends or swipe more movies!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Old Home component replaced with new modern design at the top

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
  const [currentView, setCurrentView] = useState('home');
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const logIn = () => {
    setLoggedIn(true);
  }

  const logout = () => {
    if (loggedIn) {
      window.location.reload(false);
    }
  }

  // Render different views based on currentView state
  const renderView = () => {
    if (!loggedIn) {
      return <Login setUsername={setUsername} logIn={logIn} />;
    }

    switch(currentView) {
      case 'upload':
        return <Upload username={username} setCurrentView={setCurrentView} />;
      case 'swipe':
        return <Swipe username={username} setCurrentView={setCurrentView} />;
      case 'compare':
        return <Compare username={username} setCurrentView={setCurrentView} />;
      default:
        return <Home setCurrentView={setCurrentView} username={username} />;
    }
  }

  return (
    <div>
      {loggedIn && (
        <button className="logout" onClick={logout}>
          Logout
        </button>
      )}
      {renderView()}
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
