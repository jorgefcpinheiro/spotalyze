import React, { useState, useEffect } from "react";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function checkToken() {
      try {
        const response = await fetch('/token');
        if (!response.ok) {
          throw new Error('Failed to fetch access token');
        }
        const data = await response.json();
        if (data) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
          throw new Error('Access token not found');
        }
      } catch (error) {
        console.error(error);
      }
    }
    checkToken();
  }, []);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const response = await fetch("/playlists");
      const data = await response.json();
      setPlaylists(data);
    };
    fetchPlaylists();
  }, []);

  //use effect to get the profile of the user
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch("/profile");
      const data = await response.json();
      setProfile(data);
    };
    fetchProfile();
  }, []);


  const handleLogin = (e) => {
    e.preventDefault();
    const popup = window.open("http://localhost:8888/login", "", "width=600,height=600");
    const interval = setInterval(() => {
      if (popup.closed) {
        clearInterval(interval);
        window.location.reload();
      }
    }, 1000);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    const popup = window.open("http://localhost:8888/logout", "", "width=600,height=600");
    const interval = setInterval(() => {
      if (popup.closed) {
        clearInterval(interval);
        window.location.reload();
      }
    }, 1000);
  };

  return (
    <div>
      <h1>Spotalyze</h1>
      {profile && (
        <div>
          <h2>Logged in as {profile.display_name}</h2>
          <img src={profile.images[0].url} alt="avatar" />
        </div>
      )}
      {!loggedIn ? (
        <a href="#" onClick={handleLogin}>
          Login to Spotify
        </a>
      ) : (
        <a href="#" onClick={handleLogout}>
          Logout
        </a>
      )}
      {loggedIn && playlists.length > 0 && (
        <ul>
          {playlists.map((playlist) => (
            <li key={playlist}>{playlist}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;