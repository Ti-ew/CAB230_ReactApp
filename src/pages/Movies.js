import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import "./Movies.css";
const API_URL = `http://sefdb02.qut.edu.au:3000`;
function Movies() {
  const defaultColDef = {
    flex: 1, // Flexibility ratio. All columns with `flex: 1` will distribute available extra width equally among themselves
    minWidth: 100, // Minimum column width
  };
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const columnDefs = [
    {
      headerName: "Title",
      field: "title",
      sortable: true,
      filter: true,
      cellRendererFramework: (params) => (
        <Link to={`/movies/${params.data.imdbID}`}>{params.value}</Link>
      ),
    },
    { headerName: "Year", field: "year", sortable: true, filter: true },
    {
      headerName: "IMDb ID",
      field: "imdbID",
      sortable: true,
      filter: true,
      cellRendererFramework: (params) => (
        <Link to={`/movies/${params.data.imdbID}`}>{params.value}</Link>
      ),
    },
    { headerName: "Runtime", field: "runtime", sortable: true, filter: true },
    { headerName: "Genres", field: "genres", sortable: true, filter: true },
    {
      headerName: "IMDb Rating",
      field: "imdbRating",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Rotten Tomatoes Rating",
      field: "rottenTomatoesRating",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Metacritic Rating",
      field: "metacriticRating",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Classification",
      field: "classification",
      sortable: true,
      filter: true,
    },
  ];

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const searchMovies = async () => {
    try {
      const response = await fetch(`${API_URL}/movies/search?title=${search}`);
      const jsonResponse = await response.json();
      const movieIds = jsonResponse.data;
      const movieDataPromises = movieIds.map(async (movie) => {
        const res = await fetch(`${API_URL}/movies/data/${movie.imdbID}`);
        const movieData = await res.json();

        const ratings = movieData.ratings.reduce((acc, rating) => {
          if (rating.source === "Internet Movie Database") {
            acc.imdbRating = rating.value;
          } else if (rating.source === "Rotten Tomatoes") {
            acc.rottenTomatoesRating = rating.value;
          } else if (rating.source === "Metacritic") {
            acc.metacriticRating = rating.value;
          }
          return acc;
        }, {});

        return {
          ...movieData,
          imdbID: movie.imdbID,
          classification: movie.classification,
          ...ratings,
        };
      });
      const movieDataArray = await Promise.all(movieDataPromises);
      console.log(movieDataArray);
      setMovies(movieDataArray);
    } catch (error) {
      console.error("Error fetching movie data:", error);
    }
  };

  return (
    <div className="movies-container">
      <div className="Real">
        <h1 className="title">Movies containing the text</h1>
        <div className="search-container">
          <input
            className="search-bar"
            type="text"
            placeholder="Search movies"
            value={search}
            onChange={handleChange}
          />
          <button className="button" onClick={searchMovies}>
            Search
          </button>
        </div>
      </div>

      <div
        className="ag-theme-balham-dark"
        style={{
          width: "90%",
          marginTop: "20px",
        }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={movies}
          pagination={true}
          paginationPageSize={10}
          domLayout="autoHeight"
        />
      </div>
    </div>
  );
}

export default Movies;
