import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import handlePlayTrailer from '../../utils/playTrailer';
import axios from '../../axios';
import classes from './exploreAll.module.css';
import NavBar from '../NavBar';
import TrailerModal from '../TrailerModal';
import ReservationContext from '../../Store/ReservationContext';

function ExploreAll(props) {
  const type = props.match.path.replace('/', '');
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState('');
  const [, dispatch] = useContext(ReservationContext);

  const { t } = useTranslation();

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get('/movie', {
        params: { type, limit: 16 }
      });
      setMovies(response.data.movies);
      return response;
    }
    fetchData();
  }, [type]);

  // To handle movie booking and redirect to ShowTimings page
  const handleBookNow = (movie) => {
    dispatch({ type: 'ADD_MOVIE_ID', payload: movie._id });
    dispatch({ type: 'ADD_MOVIE', payload: movie.title });
    dispatch({ type: 'ADD_MOVIE_IMG', payload: movie.bannerImage });
  };

  // Conditionally render TrailerModal
  let trailerModal = null;
  if (trailerUrl) {
    trailerModal = (
      <TrailerModal trailerUrl={trailerUrl} setTrailerUrl={setTrailerUrl} />
    );
  }
  return (
    <>
      <NavBar />
      <div className={classes.row}>
        <h2 className={classes.row_title}>{t(type)}</h2>
        <div className={classes.row_posters}>
          {movies.map((movie) => {
            return (
              <div className={classes.poster_container} key={movie._id}>
                <img
                  className={classes.row_poster}
                  src={movie.bannerImage}
                  alt={movie.name}
                />
                <div className={classes.movie_info}>
                  <h3>TITANIC</h3>
                  <h4>ENGLISH . ROMANTIC</h4>
                </div>
                <div className={classes.poster_actions}>
                  <button
                    type="button"
                    className={classes.play_btn}
                    onClick={() =>
                      handlePlayTrailer(movie, trailerUrl, setTrailerUrl)
                    }>
                    {t('play')}
                  </button>

                  {type === 'playingnow' && (
                    <NavLink
                      to={`/showtimings/${movie._id}`}
                      className={classes.nav_booknow_btn}>
                      <button
                        type="button"
                        className={classes.book_btn}
                        onClick={() => handleBookNow(movie)}>
                        {t('book_now')}
                      </button>
                    </NavLink>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {trailerModal}
    </>
  );
}

export default ExploreAll;
