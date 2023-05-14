import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import { AuthContext } from "../contexts/AuthContext";
import Footer from "../components/Footer";
const API_URL = `http://sefdb02.qut.edu.au:3000`;

function Movie() {
  const defaultColDef = {
    flex: 1, // Flexibility ratio. All columns with `flex: 1` will distribute available extra width equally among themselves
    minWidth: 100, // Minimum column width
  };
  const { isLoggedIn } = React.useContext(AuthContext);
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);

  const columnDefs = [
    { headerName: "Role", field: "category", sortable: true, filter: true },
    {
      headerName: "Name",
      field: "name",
      sortable: true,
      filter: true,
      cellRendererFramework: (params) =>
        isLoggedIn ? (
          <Link to={`/people/${params.data.id}`}>{params.value}</Link>
        ) : (
          <span>{params.value}</span>
        ),
    },
    {
      headerName: "Characters",
      field: "characters",
      sortable: true,
      filter: true,
    },
  ];

  useEffect(() => {
    async function fetchMovieData() {
      try {
        const response = await fetch(`${API_URL}/movies/data/${imdbID}`);
        const jsonResponse = await response.json();
        setMovie(jsonResponse);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    }

    fetchMovieData();
  }, [imdbID]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{movie.title}</h2>
      <img src={movie.poster} alt={movie.title} />
      <p>Release Date: {movie.year}</p>
      <p>Runtime: {movie.runtime} minutes</p>
      <p>
        Box Office:{" "}
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(movie.boxoffice)}
      </p>
      <p>Genres: {movie.genres.join(", ")}</p>
      <p>Country: {movie.country}</p>
      <p>{movie.plot}</p>

      <p>
        Ratings:
        {movie.ratings.map((rating, index) => (
          <span key={index}>
            {rating.source}: {rating.value}{" "}
          </span>
        ))}
      </p>


      <div
        className="ag-theme-balham-dark"
        style={{
          height: "600px",
          width: "100%",
        }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={movie.principals}
          pagination={true}
          paginationPageSize={10}
          domLayout="autoHeight"
        />
        <Footer />
      </div>
    </div>
  );
}

export default Movie;
