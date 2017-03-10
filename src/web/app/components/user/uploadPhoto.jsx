const React = require("react");
const RB = require('react-bootstrap');
const ReactCrop = require('react-image-crop');

class UploadPhotoModal extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      file: undefined,
      imagePreviewUrl: undefined
    };
  }

  handleFileChange(event){
    let reader = new FileReader();
    let file = event.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file);
  }

  render(){
    return(
    <div>
      <h1>Hello</h1>
      <RB.Modal show={this.props.visible} onHide={this.props.close}>
        <RB.Modal.Header closeButton>
          <RB.Modal.Title>Change Photo</RB.Modal.Title>
        </RB.Modal.Header>

        <RB.Modal.Body>
          <input type="file" onChange={(c) => this.handleFileChange(c)}/>
          <ReactCrop crop={{aspect:1}} src={this.state.imagePreviewUrl}/>
        </RB.Modal.Body>

        <RB.Modal.Footer>
          <RB.Button onClick={this.props.close}>Close</RB.Button>
          <RB.Button onClick={this.save}>Save</RB.Button>
        </RB.Modal.Footer>
      </RB.Modal>
    </div>
    );
  }
}

module.exports = UploadPhotoModal;
