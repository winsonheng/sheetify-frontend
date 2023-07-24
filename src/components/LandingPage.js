import React, { Component } from 'react'
import "../assets/styles/LandingPage.css"
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form'
import { BACKEND_BASE_URL, PATH, ROOT } from '../constants/config';
import { HttpMethod, postData } from '../util/RestUtil';
import { toBase64 } from '../util/FileUtil';
import { SONGS_UPLOAD } from '../constants/endpoints';
import 'html-midi-player';


export default class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
    this.changeFileInput = React.createRef();
    this.body = React.createRef();
    this.bodyDescription = React.createRef();
    this.bodyGif = React.createRef();
    this.bodyTop = React.createRef();
    this.bodyBottom = React.createRef();

    this.state = {
      selectedFile: undefined,
      unsupportedFileFormat: false,
      isFileUploadSuccessful: undefined,
      showPreferences: false,
      difficulty: 'Any',
      bpm: '',
      waitingForResult: false,
      obtainedResult: false,
      transcription: '',
      transcription_url: ''
    };

    this.uploadSong = this.uploadSong.bind(this);
    this.beginTranscription = this.beginTranscription.bind(this);
    this.handleBpmChange = this.handleBpmChange.bind(this);
  }


  uploadSong(e) {
    e.persist();
    const file = e.target.files[0];
    console.log(file);
    // Reset input value so that this method is triggered when same file is selected again
    e.target.value = null;
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

    if (!this.state.showPreferences) {
      this.animateBody();
    }

    this.setState({
      unsupportedFileFormat: false,
      showPreferences: true
    });
  }

  animateBody() {
    console.log('animating');
    console.log(this.bodyDescription.current.offsetHeight,
      this.bodyDescription.current.offsetWidth);
    
    const translateY = this.bodyDescription.current.offsetHeight 
                      + this.bodyDescription.current.offsetTop
                      + this.bodyGif.current.offsetHeight;

    const duration = 1000;
    const easing = 'linear';

    const keyframesTop = [
      { transform: `translateY(-100%)`, opacity: 0, easing: easing }
    ];
    const optionsTop = {
      duration: duration, 
      fill: 'forwards' 
    }

    const keyframesBottom = [
      { transform: `translateY(-100%)`, opacity: 1, easing: easing }
    ];
    const optionsBottom = {
      duration: duration, 
      fill: 'forwards' 
    }

    this.bodyTop.current.animate(keyframesTop, optionsTop);
    this.bodyBottom.current.animate(keyframesBottom, optionsBottom);

  }

  async uploadSongToCloud() {
    const file = this.state.selectedFile;
    const songBase64 = await toBase64(file);

    //console.log(songBase64);

    postData(
      HttpMethod.POST, 
      BACKEND_BASE_URL + SONGS_UPLOAD, 
      {
        songName: file.name,
        base64: songBase64,
        difficulty: this.state.difficulty,
        bpm: this.state.bpm === '' ? '0' : this.state.bpm
      },
      true
    ).then(result => {
      if (result.status === 200) {
        console.log("Upload Successful!");
        this.setState({ 
          isFileUploadSuccessful: true,
          waitingForResult: false,
          obtainedResult: true,
          transcription: result.data.transcription,
          transcription_url: result.data.transcription_url
         });
      } else {
        console.log("Upload failed!");
        this.setState({ 
          isFileUploadSuccessful: false,
          waitingForResult: false
        });
      }
    });

    this.setState({ waitingForResult: true });
  }

  beginTranscription(e) {
    console.log('Beginning to transcribe...');

    this.uploadSongToCloud();
  }

  handleBpmChange(e) {
    const key = e.key;

    if (key === '.' || key === '-') {
      e.preventDefault();
      return false;
    }

    return true;
  }

  render() {
    return (
      <div className="body" ref={this.body}> 
        <div className="body-container-top" ref={this.bodyTop}>
          <h2 className="body-description" ref={this.bodyDescription}>
            Transform your audio files into customized
            music sheets in just a few clicks. 
          </h2>
          <div className='body-gif' ref={this.bodyGif}></div>
          <h3 className="body-supported-formats">
            Supported formats: MP3, OGG, WAV
          </h3>
          <input hidden
            className="upload-btn"
            type="file"
            accept=".mp3, .ogg, .wav"
            onChange={this.uploadSong}
            ref={this.fileInput}
          />
          {(() => {
            if (sessionStorage.getItem('token') === null) {
              return (
                <Link to={PATH.SIGNUP_PAGE}>
                  <button 
                    className="upload-btn" 
                  >
                    Sign Up Now!
                  </button>
                </Link>
              ); 
            } else {
               return (
                <>
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
                </>
               );
            }
          })()}
          
        </div>
        <div className='body-container-bottom' ref={this.bodyBottom}>
          <div className='body-change-file-wrapper'>
            <h3 className="body-supported-formats">
              Supported formats: MP3, OGG, WAV
            </h3>
            <input hidden
              className="upload-btn"
              type="file"
              accept=".mp3, .ogg, .wav"
              onChange={this.uploadSong}
              onSelect={this.uploadSong}
              ref={this.changeFileInput}
            />
            <button 
              id="change-file-btn"
              className="upload-btn" 
              onClick={e => {
                this.fileInput.current.dispatchEvent(new MouseEvent("click"));
              }}
            >
              Upload File
            </button>
            <h4 id="selected-file-bottom" className="body-selected-file">
              {
                this.state.selectedFile === undefined ? 
                  "No File Selected" : 
                  this.state.unsupportedFileFormat ?
                    "Unsupported file format. Only .mp3, .ogg and .wav formats are supported." :
                    "Selected file: " + this.state.selectedFile.name
              }
            </h4>
          </div>
          <div className='body-preferences'>
            <div className='body-preferences-top'>
              <p className='body-preferences-text'>
                Select your preferences and we'll tailor the transcription accordingly.
              </p>
            </div>
            <div className='body-preferences-bottom'>
              <div className='body-difficulty-wrapper'>
                <p className='body-difficulty-text'>
                  Difficulty:
                </p>
                <div className='body-difficulty-group'>
                  <p 
                    className={'body-difficulty-option' + (this.state.difficulty === 'Any' ? ' selected' : '')} 
                    onClick={() => this.setState({ difficulty: 'Any' })}
                  >
                    Any
                  </p>
                  <p 
                    className={'body-difficulty-option' + (this.state.difficulty === 'Easy' ? ' selected' : '')} 
                    onClick={() => this.setState({ difficulty: 'Easy' })}
                  >
                    Easy
                  </p>
                  <p 
                    className={'body-difficulty-option' + (this.state.difficulty === 'Medium' ? ' selected' : '')} 
                    onClick={() => this.setState({ difficulty: 'Medium' })}
                  >
                    Medium
                  </p>
                  <p 
                    className={'body-difficulty-option' + (this.state.difficulty === 'Hard' ? ' selected' : '')} 
                    onClick={() => this.setState({ difficulty: 'Hard' })}
                  >
                    Hard
                  </p>
                  <p 
                    className={'body-difficulty-option' + (this.state.difficulty === 'Extreme' ? ' selected' : '')} 
                    onClick={() => this.setState({ difficulty: 'Extreme' })}
                  >
                    Extreme
                  </p>
                </div>

              </div>
              <div className='body-bpm-wrapper'>
                <p className='body-bpm-text'>
                  BPM:
                </p>
                <Form.Group 
                  className='body-bpm-group' 
                  controlId='bpm'
                >
                  <Form.Control 
                    className='form-control'
                    type='number'
                    min='0' 
                    placeholder='(Optional)'
                    onInput={(e) => this.setState({ bpm: e.target.value })}
                    onKeyDown={this.handleBpmChange}
                  />
                </Form.Group>
                <p className='body-bpm-description'>
                  *Providing this helps us to improve accuracy. Alternatively, you may leave it blank and we'll try to figure out the tempo.
                </p>
              </div>
            </div>
          </div>
          {(() => {
            if (this.state.waitingForResult) {
              return (
                <div className='transcribe-waiting-container'>
                  <div id='transcribe-loading-animation' className='loading-animation'></div>
                  <h4 className='transcribe-waiting-time'>Estimated time: 1-2 minutes</h4>
                </div>
              );
            } else if (!this.state.obtainedResult) {
              return (
                <div className='transcribe-btn-container'>
                  <button 
                    className="transcribe-btn" 
                    onClick={this.beginTranscription}
                  >
                    Begin Transcription
                  </button>
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
              );
            } else {
              return (
                <div className='transcribe-result-container'>
                  <midi-player
                    className='midi-player'
                    src={this.state.transcription}
                    sound-font>
                  </midi-player>
                  <h4 className='transcribe-result-text'>
                    Here's your transcription:&nbsp;&nbsp;&nbsp;
                    <a href={this.state.transcription_url}>Download</a>
                  </h4>
                  
                </div>
              )
            }
          })()}
          
        </div>
      </div>
    )
  }
}
