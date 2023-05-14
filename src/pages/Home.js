import React from 'react';
import backgroundImage from '../components/photos/MovieImage.jpg';
import './Home.css';

function Home() {
  return (
    <div className="home-container" style={{ backgroundImage: `url(${backgroundImage})`}}>
      <h1 className = "Name">Matiu Kaufusi's</h1>
      <h1 className="Title">Movie Searching Website</h1>
      <h1 className = "Greeting">I hope you find the movie you're after!</h1>
    </div>
  );
}

export default Home;
