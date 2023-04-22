const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
require("dotenv").config();
const fs = require("fs");

const scopes = [
  "ugc-image-upload",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "streaming",
  "app-remote-control",
  "user-read-email",
  "user-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-read-private",
  "playlist-modify-private",
  "user-library-modify",
  "user-library-read",
  "user-top-read",
  "user-read-playback-position",
  "user-read-recently-played",
  "user-follow-read",
  "user-follow-modify",
];

const spotifyApi = new SpotifyWebApi({
  redirectUri: "http://localhost:8888/callback",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

const app = express();

app.get("/login", (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get("/callback", async (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    console.error("Callback Error:", error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const access_token = data.body["access_token"];
    const refresh_token = data.body["refresh_token"];
    const expires_in = data.body["expires_in"];

    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    console.log("access_token:", access_token);
    console.log("refresh_token:", refresh_token);

    console.log(
      `Successfully retrieved access token. Expires in ${expires_in} s.`
    );
    res.send("Success! You can now close the window.");

    const me = await spotifyApi.getMe();
    console.log(me.body);

    setInterval(async () => {
      const data = await spotifyApi.refreshAccessToken();
      const access_token = data.body["access_token"];

      console.log("The access token has been refreshed!");
      console.log("access_token:", access_token);
      spotifyApi.setAccessToken(access_token);
    }, (expires_in / 2) * 1000);
  } catch (error) {
    console.error("Error getting Tokens:", error);
    res.send(`Error getting Tokens: ${error}`);
  }
});

app.get("/playlists", async (req, res) => {
  try {
    const me = await spotifyApi.getMe();
    const playlists = await spotifyApi.getUserPlaylists(me.body.id);
    const playlistsNames = playlists.body.items.map(
      (playlist) => playlist.name
    );
    res.json(playlistsNames);
  } catch (error) {
    console.error("Error getting user's playlists:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/tracks", async (req, res) => {
  try {
    const options = {
      time_range: "short_term", // Can be "short_term", "medium_term", or "long_term"
      limit: 10,
    };
    const topTracks = await spotifyApi.getMyTopTracks(options);
    const topTracksNames = topTracks.body.items.map((track) => track.name);
    res.json(topTracksNames);
  } catch (error) {
    console.error("Error getting top tracks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/disconnect", (req, res) => {
    try {
        spotifyApi.resetAccessToken();
        spotifyApi.resetRefreshToken();
        res.json({ message: "Successfully disconnected" });
      } catch (error) {
        console.error("Could not disconnect:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
});

app.get("/artists", async (req, res) => {
  try {
    const options = {
      time_range: "short_term", // Can be "short_term", "medium_term", or "long_term"
      limit: 10,
    };
    const topArtists = await spotifyApi.getMyTopArtists(options);
    const topArtistsNames = topArtists.body.items.map((artist) => artist.name);
    res.json(topArtistsNames);
  } catch (error) {
    console.error("Error getting top artists:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(8888, () =>
  console.log(
    "HTTP Server up. Now go to http://localhost:8888/login in your browser."
  )
);
