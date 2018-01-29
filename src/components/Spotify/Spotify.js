import React from 'react';
//import {clientId, clientSecret} from './secret';

let accessToken;
let ttl;
let tracksArray = [];
const siteURL = 'http://localhost:3000/callback/';

const apiURL = 'https://api.spotify.com/v1';
const headers = { headers: { Authorization: `Bearer ${accessToken}` } };

const clientId = '4e5b93c4d0a447d499f3e232c8b7593b';
const clientSecret = '6596fb0749fe44dfa472a77b01934603';

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/'); // This clears the parameters, allowing us to grab a new access token when it expires.
      return accessToken;
    } else {
      const redirectUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${siteURL}`;
      window.location = redirectUrl;
    }
  },

  search(term) {
    if (!accessToken) { Spotify.getAccessToken(); }
    const searchUrl = `${apiURL}/search?type=track&q=${term}`;
    return fetch(searchUrl, headers).then(response => response.json()).then(jsonResponse => {
      if (!jsonResponse.tracks) { return []; }
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    });
  },

  savePlaylist(playlistName,playlistTracks) {
    if (!playlistName || !playlistTracks) { return }
    else {
      let userId;
      let url = 'me';
      // get userID //
      return fetch(url, headers).then(response => response.json()).then(jsonResponse => {
        userId = jsonResponse.id;
        url = `${apiURL}/users/${userId}/playlists`;
        let body = { name: playlistName };
        let thePost = { headers: headers, method: 'POST', body: JSON.stringify(body) };
        // get playlistID //
        return fetch(url, thePost).then(response => response.json()
          ).then(jsonResponse => jsonResponse.id).then(playlistId => {
          console.log("Spotify.playlistid: " + playlistId);
          url = `${apiURL}/users/${userId}/playlists/${playlistId}/tracks`;
          body = { uris: playlistTracks };
          thePost = { headers: headers, method: 'POST', body: JSON.stringify(body) };
          // save playlistTracks //
          return fetch(url, thePost).then(response => console.log("Spotify said: " + response));
        });
      });
    }
  }
}

export default Spotify;