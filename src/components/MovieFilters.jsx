import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const MovieFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [title, setTitle] = useState(searchParams.get('title') || '');
  const [ubication, setUbication] = useState(searchParams.get('ubication') || '');
  const [genre, setGenre] = useState(searchParams.get('genre') || '');

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleUbicationChange = (e) => {
    setUbication(e.target.value);
  };
  
  const handleGenreChange = (e) => {
    setGenre(e.target.value);
  };

  useEffect(() => {
    const params = {};
    if (title) params.title = title;
    if (ubication) params.ubication = ubication;
    if (genre) params.genre = genre;
    setSearchParams(params);
  }, [title, ubication, genre, setSearchParams]);

  return (
    <div className="container my-4">
      <div className="row g-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por título..."
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por ubicación..."
            value={ubication}
            onChange={handleUbicationChange}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por género..."
            value={genre}
            onChange={handleGenreChange}
          />
        </div>
      </div>
    </div>
  );
};

export default MovieFilters;