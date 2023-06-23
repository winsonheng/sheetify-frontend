import React, { Component } from 'react'
import "../assets/styles/LandingPage.css"
import { BACKEND_BASE_URL } from '../constants/config';
import { postData } from '../util/RestUtil';
import { toBase64 } from '../util/FileUtil';
import { SONGS_UPLOAD } from '../constants/endpoints'; 
import CSRFToken from './csrftoken';

export default class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();

    this.state = {
      selectedFile: undefined,
      unsupportedFileFormat: false,
      isFileUploadSuccessful: undefined
    };

    this.uploadSong = this.uploadSong.bind(this);
  }


  async uploadSong(e) {
    e.persist();
    const file = e.target.files[0];
    console.log(file);
    this.setState({ selectedFile: file });

    if (file === undefined) {
      return;
    }

    let imageReg = /[/.](mp3|ogg|wav)$/i;
    if (!imageReg.test(file.name)) {
      this.setState({
        unsupportedFileFormat: true
      });
      return;
    }

    this.setState({
      unsupportedFileFormat: false
    });

    const songBase64 = await toBase64(file);

    //console.log(songBase64);

    postData(
      BACKEND_BASE_URL + SONGS_UPLOAD, 
      {
        songName: file.name,
        base64: songBase64
      }
    ).then(result => {
      if (result.status === 200) {
        console.log("Successful!");
        this.setState({ isFileUploadSuccessful: true });
      } else {
        console.log("Upload failed!");
        this.setState({ isFileUploadSuccessful: false });
      }
    });

  }

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
          <CSRFToken></CSRFToken>
          <input hidden
            className="upload-btn"
            type="file"
            accept=".mp3, .ogg, .wav"
            onChange={this.uploadSong}
            ref={this.fileInput}
          />
          <button 
            className="upload-btn" 
            onClick={e => {
              this.fileInput.current.dispatchEvent(new MouseEvent("click"));
            }}
          >
            Upload Audio
          </button>
          <h4 className="body-selected-file">
            {
              this.state.selectedFile === undefined ? 
                "No File Selected" : 
                this.state.unsupportedFileFormat ?
                  "Unsupported file format. Only .mp3, .ogg and .wav formats are supported." :
                  "Selected file: " + this.state.selectedFile.name
            }
          </h4>
          <h4 className={
            this.state.isFileUploadSuccessful === undefined ? 
              "invisible" :
              "body-upload-successful"
          }>
            {
              this.state.isFileUploadSuccessful ? 
                "File uploaded successfully!" :
                "Error while uploading file. Please try again"
            }
          </h4>
        </div>
      </div>
    )
  }
}
