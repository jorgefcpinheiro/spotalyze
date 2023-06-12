import React, { useState, useEffect } from "react";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
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
      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          {loggedIn && (
            <>
              <li>
                <button onClick={() => handleOptionSelect("playlists")}>
                  Playlists
                </button>
              </li>
              <li>
                <button onClick={() => handleOptionSelect("tracks")}>
                  Tracks
                </button>
              </li>
              <li>
                <button onClick={() => handleOptionSelect("profile")}>
                  Profile
                </button>
              </li>
              <li>
                <button onClick={() => handleOptionSelect("recommendations")}>
                  Recommendations
                </button>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
          {!loggedIn && (
            <li>
              <button onClick={handleLogin}>Login</button>
            </li>
          )}
        </ul>
      </nav>
      {selectedOption === "playlists" && (
        <div>
          <h1>Playlists</h1>
          <ul>
            {playlists.map((playlist) => (
              <li key={playlist.id}>
                <p href={playlist}>{playlist}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedOption === "tracks" && (
        <div>
          <h1>Tracks</h1>
          <ul>
            {tracks.map((track) => (
              <li key={track.id}>
                <p href={track}>{track}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedOption === "profile" && (
        <div>
          <h1>Profile</h1>
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
      {selectedOption === "recommendations" && (
        <div>
          <h1>Recommendations</h1>
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

      {selectedOption === null && (
        <div>
          <h1>Welcome to the app!</h1>
        </div>
      )}

      {!loggedIn && (
        <div>
          <h2>Please login to use the app.</h2>
        </div>
      )}
    </>
  );
};

export default App;
