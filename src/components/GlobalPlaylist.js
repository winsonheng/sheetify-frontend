import '../assets/styles/GlobalPlaylist.css'
import React, { useEffect, useState } from 'react'
import { Table } from 'reactstrap'
import { Link } from 'react-router-dom'
import { BACKEND_BASE_URL, PATH } from '../constants/config'
import { HttpMethod, StatusCode, postData } from '../util/RestUtil'
import { SONGS_GET_ALL_SONGS, SONGS_GET_MY_SONGS } from '../constants/endpoints'
import SongTable from './SongTable'

export default function GlobalPlaylist() {
  const [songList, setSongList] = useState(null);

  useEffect(() => {
    getSongsFromDB();
  }, []);

  function getSongsFromDB() {
    console.log('Retrieving your songs...');
    setSongList((prev) => null);
    postData(
      HttpMethod.GET,
      BACKEND_BASE_URL + SONGS_GET_ALL_SONGS,
      {},
      true
    ).then(response => {
      if (response.status === StatusCode.OK) {
        console.log("Here are all the songs: ");
        setSongList((prev) => {
          return response.data.songList;
        });
      }
    });
  }

  return (
    <div className='mysongs'>
      <div className='mysongs-top'>
        <h2 className='mysongs-title'>
          Global Playlist
        </h2>
        <Link to={PATH.LANDING_PAGE} className='mysongs-upload-btn-wrapper'>
          <button className='mysongs-upload-btn'>
            + Add New Song
          </button>
        </Link>
      </div>
      <div className='mysongs-bottom'>
        <SongTable songList={songList}></SongTable>
      </div>
    </div>
  )
}
