import React, { PureComponent } from 'react'
import "../assets/styles/Body.css"

export default class Body extends PureComponent {
  render() {
    return (
      <div className="body"> 
        <div className="body-container">
          <h2 className="body-description">
            Turn your audio files into transcribed<br></br>music sheets in just a few clicks. 
          </h2>
          <h3 className="body-supported-formats">
            Supported formats: MP3, OGG, WAV
          </h3>
          <button className="upload-btn">
            Upload file
          </button>
        </div>
      </div>
    )
  }
}
