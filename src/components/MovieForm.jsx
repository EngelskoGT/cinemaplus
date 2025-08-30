import React, { useState, useEffect } from 'react';

const MovieForm = ({ movieToEdit, onSave, onCancel }) => {
  const [movie, setMovie] = useState({
    imdbID: '',
    Title: '',
    Year: '',
    Type: '',
    Poster: '',
    Estado: true,
    description: '',
    Ubication: '',
  });

  useEffect(() => {
    if (movieToEdit) {
      setMovie(movieToEdit);
    } else {
      setMovie({
        imdbID: '',
        Title: '',
        Year: '',
        Type: '',
        Poster: '',
        Estado: true,
        description: '',
        Ubication: '',
      });
    }
  }, [movieToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie({ ...movie, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(movie);
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">{movieToEdit ? 'Editar Película' : 'Añadir Película'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Título</label>
            <input type="text" className="form-control" name="Title" value={movie.Title} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Año</label>
            <input type="text" className="form-control" name="Year" value={movie.Year} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Tipo</label>
            <input type="text" className="form-control" name="Type" value={movie.Type} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Ubicación</label>
            <input type="text" className="form-control" name="Ubication" value={movie.Ubication} onChange={handleChange} required />
          </div>
          <div className="col-12">
            <label className="form-label">URL del Póster</label>
            <input type="text" className="form-control" name="Poster" value={movie.Poster} onChange={handleChange} required />
          </div>
        </div>
        <div className="mt-4 d-grid gap-2 d-md-flex justify-content-md-end">
          <button type="submit" className="btn btn-success">
            Guardar
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default MovieForm;