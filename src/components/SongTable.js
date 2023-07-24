import React from 'react'
import { Table } from 'reactstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SongTable(props) {
  const songList = props.songList;
  console.log(songList);

  if (songList === null) {
    return (
      <div className='loading-animation'></div>
    );
  } else {
    return (
      <Table bordered striped dark className='mysongs-table'>
        <thead>
          <tr>
            <th>Uploader</th>
            <th>Song Name</th>
            <th>Upload Date</th>
            <th>Audio Track</th>
            <th>Transcription</th>
          </tr>
          {(() => {
            if (songList.length === 0) {
              return (
                <tr>
                  <td colSpan='5'>
                    No songs to be found 
                  </td>
                </tr>
              );
            }
          })()}
          {songList.map((item, index) => (    
            <tr key={item.id}>
              <td>{item.username}</td>
              <td>{item.name}</td>
              <td>{item.upload_date}</td>
              <td><a href={item.download_link} target='_blank'>{item.download_link != '' ? 'Download' : ''}</a></td>
              <td><a href={item.transcription} target='_blank'>{item.transcription != '' ? 'Download' : ''}</a></td>
            </tr>
          ))}
        </thead>
      </Table>
    );
  }
}
