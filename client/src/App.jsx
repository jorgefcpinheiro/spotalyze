import React, { useState, useEffect } from "react";

const Menu = ({ handleOptionSelect }) => {
  return (
    <nav>
      <ul style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <li>
          <button onClick={() => handleOptionSelect(null)}>Home</button>
        </li>
        <li>
          <button onClick={() => handleOptionSelect("playlists")}>Playlists</button>
        </li>
        <li>
          <button onClick={() => handleOptionSelect("tracks")}>Tracks</button>
        </li>
        <li>
          <button onClick={() => handleOptionSelect("artists")}>Artists</button>
        </li>
        <li>
          <button onClick={() => handleOptionSelect("profile")}>Profile</button>
        </li>
        <li>
          <button onClick={() => handleOptionSelect("recommendations")}>Recommendations</button>
        </li>
      </ul>
    </nav>
  );
};

const App = () => {
  const [loggedIn, setLoggedIn] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [profile, setProfile] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    async function checkToken() {
      try {
        const response = await fetch("/token");
        if (!response.ok) {
          throw new Error("Failed to fetch access token");
        }
        const data = await response.json();
        if (data) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
          throw new Error("Access token not found");
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
    const fetchArtists = async () => {
      const response = await fetch("/artists");
      const data = await response.json();
      setArtists(data);
    };
    const fetchTracks = async () => {
      const response = await fetch("/tracks");
      const data = await response.json();
      setTracks(data);
    };
    const fetchRecommendations = async () => {
      const response = await fetch("/recommendations");
      const data = await response.json();
      setRecommendations(data);
    };
    if (selectedOption === "playlists") {
      fetchPlaylists();
    } else if (selectedOption === "tracks") {
      fetchTracks();
    } else if (selectedOption === "recommendations") {
      fetchRecommendations();
    } else if (selectedOption === "artists") {
      fetchArtists();
    }
  }, [selectedOption]);

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
    const popup = window.open(
      "http://localhost:8888/login",
      "",
      "width=600,height=600"
    );
    const interval = setInterval(() => {
      if (popup.closed) {
        clearInterval(interval);
        window.location.reload();
      }
    }, 1000);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    const popup = window.open(
      "http://localhost:8888/logout",
      "",
      "width=600,height=600"
    );
    const interval = setInterval(() => {
      if (popup.closed) {
        clearInterval(interval);
        window.location.reload();
      }
    }, 1000);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <>
      {loggedIn && <Menu handleOptionSelect={handleOptionSelect} />}
      {!loggedIn && (
        <div>
          <h2>Please login to use the app.</h2>
          <button onClick={handleLogin}>Login</button>
        </div>
      )}

      {loggedIn && selectedOption === null && (
        <div>
          <h1>Welcome to Spotalyze!</h1>
        </div>
      )}

      {loggedIn && selectedOption === "playlists" && (
        <div>
          <h1>Playlists created by you</h1>
          <ul>
            {playlists.map((playlist) => (
              <li key={playlist.id}>
                <p href={playlist}>{playlist}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {loggedIn && selectedOption === "tracks" && (
        <div>
          <h1>Most listened tracks</h1>
          <ul>
            {tracks.map((track) => (
              <li key={track.id}>
                <p href={track}>{track}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {loggedIn && selectedOption === "artists" && (
        <div>
          <h1>Most listened artists</h1>
          <ul>
            {artists.map((artist) => (
              <li key={artist.id}>
                <p href={artist}>{artist}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {loggedIn && selectedOption === "profile" && (
        <div>
          <h1>Your profile</h1>
          <ul>
            <li style={{ display: "flex", alignItems: "center" }}>
              <img
                src={profile.images[0].url}
                alt="profile"
                style={{ width: "50px", height: "50px", marginRight: "10px" }}
              />
              <p>{profile.display_name}</p>
            </li>
            <li>
              <p>{profile.email}</p>
            </li>
            <li>
              <p>{profile.country}</p>
            </li>
          </ul>
        </div>
      )}

      {loggedIn && selectedOption === "recommendations" && (
        <div>
          <h1>Recommendations based on your most listened songs</h1>
          <ul>
            {recommendations.map((recommendation) => (
              <li key={recommendation.id}>
                <p>
                  {recommendation.name} by {recommendation.artist}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {loggedIn && (
        <button onClick={handleLogout}>Logout</button>
      )}
    </>
  );
};

export default App;
