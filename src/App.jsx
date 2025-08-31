import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieList from './components/MovieList';
import MovieFilters from './components/MovieFilters';
import AddMovieForm from './components/AddMovieForm';
import MovieForm from './components/MovieForm';
import MovieModal from './components/MovieModal';

const API_URL = 'https://movie.azurewebsites.net/api/cartelera';
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY; // <-- ¡Aquí es donde la lees!

function App() {
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('list');
  const [editingMovie, setEditingMovie] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState('');

  const [searchParams] = useSearchParams();

  const fetchAllMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}?title=&ubication=`, { method: 'GET' });
      
      if (!response.ok) {
        throw new Error(`Error de red: ${response.status}`);
      }
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setAllMovies(data);
      } else {
        throw new Error("Los datos de la API no son un array.");
      }
    } catch (err) {
      setError(`Error al cargar la cartelera: ${err.message}.`);
      setAllMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMovies();
  }, []);

  useEffect(() => {
    if (!Array.isArray(allMovies)) {
      setFilteredMovies([]);
      return;
    }
    const titleFilter = searchParams.get('title')?.toLowerCase() || '';
    const ubicationFilter = searchParams.get('ubication')?.toLowerCase() || '';
    const genreFilter = searchParams.get('genre')?.toLowerCase() || '';
    
    let currentFilteredList = allMovies.filter(movie => {
      const movieTitle = movie.Title?.toLowerCase() || '';
      const movieUbication = movie.Ubication?.toLowerCase() || '';
      const movieType = movie.Type?.toLowerCase() || '';
      
      return movieTitle.includes(titleFilter) &&
             movieUbication.includes(ubicationFilter) &&
             movieType.includes(genreFilter);
    });
    
    setFilteredMovies(currentFilteredList);
  }, [searchParams, allMovies]);

  const handleDelete = async (imdbID) => {
    const isConfirmed = window.confirm('¿Estás seguro de que quieres eliminar esta película?');
    if (!isConfirmed) return;
    
    try {
      const response = await fetch(`${API_URL}?imdbID=${imdbID}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error al eliminar: ${response.status}`);
      }
      fetchAllMovies();
    } catch (err) {
      console.error('Error deleting movie:', err);
      setError(`Error al eliminar la película: ${err.message}`);
    }
  };

  const handleAddMovie = async (movieData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieData),
      });
      if (!response.ok) {
        throw new Error(`Error al añadir: ${response.status}`);
      }
      setCurrentView('list');
      fetchAllMovies();
    } catch (err) {
      setError(`Error al añadir la película: ${err.message}`);
    }
  };

  const handleUpdateMovie = async (movieData) => {
    try {
      const response = await fetch(`${API_URL}?imdbID=${movieData.imdbID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieData),
      });
      if (!response.ok) {
        throw new Error(`Error al actualizar: ${response.status}`);
      }
      setCurrentView('list');
      setEditingMovie(null);
      fetchAllMovies();
    } catch (err) {
      setError(`Error al actualizar la película: ${err.message}`);
    }
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setCurrentView('edit');
  };

  const handleShowList = () => {
    setCurrentView('list');
    setEditingMovie(null);
    setError(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const fetchTrailer = async (title, year) => {
    if (!TMDB_API_KEY) {
      setError('Clave de API de TMDb no configurada.');
      return '';
    }

    try {
      const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&year=${year}&language=es-ES`;
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      const movieId = searchData.results?.[0]?.id;
      if (!movieId) {
        return '';
      }

      const videosUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=es-ES`;
      const videosResponse = await fetch(videosUrl);
      const videosData = await videosResponse.json();

      const trailer = videosData.results?.find(video => video.type === 'Trailer' && video.site === 'YouTube');
      return trailer ? `https://www.youtube.com/embed/${trailer.key}` : '';

    } catch (err) {
      console.error('Error fetching trailer:', err);
      return '';
    }
  };

  const handleOpenModal = async (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
    setTrailerUrl('');
    
    if (movie.Title && movie.Year) {
        const trailer = await fetchTrailer(movie.Title, movie.Year);
        setTrailerUrl(trailer);
    }
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
    setShowModal(false);
    setTrailerUrl('');
  };

  return (
    <>
      <button 
        className="sidebar-toggle-button" 
        onClick={toggleSidebar}
        style={{ left: isSidebarOpen ? '260px' : '15px' }}
      >
        {isSidebarOpen ? 'Cerrar Menú' : 'Abrir Menú'}
      </button>

      <div className={`sidebar ${isSidebarOpen ? '' : 'hidden'}`}>
        <h3 className="text-center my-4">CinemaPlus</h3>
        <button className="btn btn-primary my-2 mx-3" onClick={handleShowList}>
          Cartelera
        </button>
        <button className="btn btn-success my-2 mx-3" onClick={() => setCurrentView('add')}>
          Añadir Película
        </button>
      </div>

      <div className={`main-content ${isSidebarOpen ? '' : 'expanded'}`}>
        {currentView === 'add' && (
          <AddMovieForm onSave={handleAddMovie} onCancel={() => setCurrentView('list')} />
        )}
        {currentView === 'edit' && (
          <MovieForm movieToEdit={editingMovie} onSave={handleUpdateMovie} onCancel={() => setCurrentView('list')} />
        )}
        {currentView === 'list' && (
          <>
            <div className="container-fluid p-0 mb-4">
                <div id="movieCarousel" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#movieCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#movieCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#movieCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
                        <button type="button" data-bs-target="#movieCarousel" data-bs-slide-to="3" aria-label="Slide 4"></button>
                    </div>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src="img/banner/3209.webp" className="d-block w-100" alt="Banner de oferta 1" />
                        </div>
                        <div className="carousel-item">
                            <img src="img/banner/3210.webp" className="d-block w-100" alt="Banner de oferta 2" />
                        </div>
                        <div className="carousel-item">
                            <img src="img/banner/3211.webp" className="d-block w-100" alt="Banner de oferta 3" />
                        </div>
                        <div className="carousel-item">
                            <img src="img/banner/3217.webp" className="d-block w-100" alt="Banner de oferta 4" />
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#movieCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#movieCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>

            <h1 className="display-4 text-center mb-5 text-dark fw-bold text-stroke">Cartelera de Películas</h1>
            
            <MovieFilters />
            
            {loading && (
              <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="alert alert-danger text-center mt-5" role="alert">
                {error}
              </div>
            )}

            {!loading && !error && (
              <MovieList movies={filteredMovies} onDelete={handleDelete} onEdit={handleEdit} onOpenModal={handleOpenModal} />
            )}
            
            {showModal && (
                <MovieModal movie={selectedMovie} onClose={handleCloseModal} trailerUrl={trailerUrl} />
            )}
          </>
        )}
      </div>
    </>
  );
}

export default App;