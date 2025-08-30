import React from 'react';

const MovieCard = ({ movie, onEdit, onDelete }) => {
  return (
    <div className="card movie-card shadow-sm">
      <img src={movie.Poster} className="card-img-top" alt={movie.Title} />
      <div className="card-body">
        <h5 className="card-title text-truncate">{movie.Title}</h5>
        <p className="card-text">
          <small className="text-muted">Año: {movie.Year}</small><br />
          <small className="text-muted">Ubicación: {movie.Ubication}</small>
        </p>
        <div className="d-grid gap-2">
          <button className="btn btn-primary btn-sm" onClick={() => onEdit(movie)}>
            Editar
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(movie.imdbID)}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;