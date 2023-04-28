import React, { useState, useEffect } from "react";

const App = () => {
  const [token, setToken] = useState(null);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    async function checkToken() {
      try {
        const response = await fetch('/token');
        if (!response.ok) {
          throw new Error('Failed to fetch access token');
        }
        const data = await response.json();
        if (data) {
          setToken(true);
          console.log(data)
        } else {
          setToken(null);
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

  return (
    <div>
      <h1>Spotalyze</h1>
      <p>
        Access token:{" "}
        {token ? (
          <span style={{ color: "green" }}>Set</span>
        ) : (
          <span style={{ color: "red" }}>Not Set</span>
        )}
      </p>
      {token && playlists.length > 0 && (
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
