import React, { useState, useEffect } from 'react';

const App = () => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const response = await fetch('/playlists');
      const data = await response.json();
      setPlaylists(data);
    };
    fetchPlaylists();
  }, []);

  return (
    <div>
      <h1>Spotify Playlists</h1>
      {playlists.length === 0 ? (
        <p>Loading playlists...</p>
      ) : (
        <ul>
          {playlists.map(playlist => (
            <li key={playlist}>{playlist}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;