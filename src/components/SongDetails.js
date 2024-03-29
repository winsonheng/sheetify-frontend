import React, { useEffect, useRef, useState } from 'react'
import '../assets/styles/SongDetails.css'
import { BACKEND_BASE_URL, PATH } from '../constants/config';
import { Link, useLocation, useParams } from 'react-router-dom';
import { removeFileExtension } from '../util/FileUtil';
import { HttpMethod, StatusCode, postData } from '../util/RestUtil';
import { SONGS_GET_SONG_BY_ID } from '../constants/endpoints';

export default function SongDetails(props) {
  const { songid } = useParams();

  const location = useLocation();

  const [song, setSong] = useState(location.state == null ? null : location.state.song);
  const [isLoaded, setIsLoaded] = useState(false);

  const visualizer = useRef();

  useEffect(() => {
    if (song === null) {
      return;
    }
    console.log("HERE");
    console.log(visualizer.current)
    setIsLoaded(prev => true);
  }, [song]);

  function getSong() {
    postData(
      HttpMethod.GET, 
      BACKEND_BASE_URL + SONGS_GET_SONG_BY_ID.replace(':songid', songid),
      {},
      true
    ).then(response => {
      if (response.status === StatusCode.OK) {
        console.log(response.data);
        setSong(prev => response.data.song[0]);
      }
    })
  }

  if (song === null) {
    getSong();
    return (
      <div className='loading-animation'></div>
    );
  }

  return (
    <div className='songdetails'>
      <div className='songdetails-top'>
        <h2 className='songdetails-title'>
          {removeFileExtension(song.name)}
        </h2>
        
      </div>
      <div className='songdetails-bottom'>
        <div className='midi-container'>
          {
          /**
           * sound-font takes the relative url + /soundfont.json and instrument.json
           * to obtain the json files.
           * However when using static html page it correctly takes from https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus/soundfont.json
           */
          }
          {(() => {
            if (isLoaded) {
              return (
                <midi-player
                  src={song.transcription}
                  sound-font='https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus' visualizer="#myVisualizer">
                </midi-player>
              );
            }
          })()}
          <midi-visualizer type="piano-roll" id="myVisualizer" ref={visualizer}></midi-visualizer>

        </div>
      </div>
    </div>
  )
}
