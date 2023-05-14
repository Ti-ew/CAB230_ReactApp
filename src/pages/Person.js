import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { AgGridReact } from "ag-grid-react";
import _ from "lodash";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";

const API_URL = `http://sefdb02.qut.edu.au:3000`;

function Person() {
  const defaultColDef = {
    flex: 1, // Flexibility ratio. All columns with `flex: 1` will distribute available extra width equally among themselves
    minWidth: 100, // Minimum column width
  };
  const { bearerToken } = useContext(AuthContext);
  const { id } = useParams();
  const [person, setPerson] = useState(null);

  const columnDefs = [
    {
      headerName: "Role",
      field: "category",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Movie",
      field: "movieName",
      sortable: true,
      filter: true,
      cellRendererFramework: (params) => (
        <Link to={`/movies/${params.data.movieId}`}>{params.value}</Link>
      ),
    },
    {
      headerName: "Characters",
      field: "characters",
      sortable: true,
      filter: true,
    },
    { headerName: "Rating", field: "imdbRating", sortable: true, filter: true },
  ];

  useEffect(() => {
    async function fetchPersonData() {
      try {
        const response = await fetch(`${API_URL}/people/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearerToken.token}`, // pass the token in the Authorization header
          },
        });
        const jsonResponse = await response.json();
        setPerson(jsonResponse);
        console.log(jsonResponse);
      } catch (error) {
        console.error("Error fetching person data:", error);
      }
    }

    fetchPersonData();
  }, [id, bearerToken]); // add token as a dependency

  if (!person) {
    return <div>Please login to view this page</div>;
  }
  const labels = _.range(0, 10, 1).map(
    (n) => `${n.toFixed(1)}-${(n + 1).toFixed(1)}`
  );
  const frequencies = _.countBy(person.roles, (role) => {
    const rating = Math.floor(role.imdbRating); // round down to nearest integer
    return `${rating.toFixed(1)}-${(rating + 1).toFixed(1)}`;
  });
  const data = labels.map((label) => frequencies[label] || 0);
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "IMDB Ratings",
        data: data,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
  return (
    <div>
      <h2>{person.name}</h2>
      <p>Birth Year: {person.birthYear}</p>
      <p>Death Year: {person.deathYear ? person.deathYear : "N/A"}</p>
      <div
        className="ag-theme-balham-dark"
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 550px)",
          width: "100%",
        }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={person.roles}
          pagination={true}
          paginationPageSize={10}
          domLayout="autoHeight"
        />
        <div style={{ height: "300px" }}>
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
}

export default Person;
