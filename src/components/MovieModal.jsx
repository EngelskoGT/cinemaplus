import React from 'react';

const MovieModal = ({ movie, onClose, trailerUrl }) => {
  if (!movie) return null;

  // Añadimos el parámetro autoplay=1 al URL
  const trailerWithAutoplay = trailerUrl ? `${trailerUrl}?autoplay=1` : '';

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{movie.Title} ({movie.Year})</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-12">
                 {trailerWithAutoplay ? (
                    <div className="ratio ratio-16x9 mb-3">
                        <iframe src={trailerWithAutoplay} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                ) : (
                    <img src={movie.Poster} className="img-fluid rounded" alt={movie.Title} />
                )}
              </div>
              <div className="col-md-12">
                <p><strong>Tipo:</strong> {movie.Type}</p>
                <p><strong>Ubicación:</strong> {movie.Ubication}</p>
                <p><strong>Descripción:</strong> {movie.description}</p>
                <p><strong>ID:</strong> {movie.imdbID}</p>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;