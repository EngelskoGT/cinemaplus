import React from 'react';
import MovieCard from './MovieCard';

const MovieList = ({ movies, onEdit, onDelete }) => {
  if (movies.length === 0) {
    return (
      <div className="container text-center mt-5">
        <h4>No se encontraron películas.</h4>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row g-4 justify-content-center">
        {movies.map((movie) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={movie.imdbID}>
            <MovieCard
              movie={movie}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList;