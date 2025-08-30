import React from 'react';
import { Modal } from 'bootstrap';

const MovieModal = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{movie.Title} ({movie.Year})</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-4">
                <img src={movie.Poster} className="img-fluid rounded" alt={movie.Title} />
              </div>
              <div className="col-md-8">
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