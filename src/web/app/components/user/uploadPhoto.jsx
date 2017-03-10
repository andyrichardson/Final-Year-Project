const React = require("react");
const RB = require('react-bootstrap');
const ReactCrop = require('react-image-crop');

class UploadPhotoModal extends React.Component{
  render(){
    return(
    <div>
      <h1>Hello</h1>
      <RB.Modal show={this.props.visible} onHide={this.props.close}>
        <RB.Modal.Header closeButton>
          <RB.Modal.Title>Change Photo</RB.Modal.Title>
        </RB.Modal.Header>
        <RB.Modal.Body>
          <ReactCrop crop={{aspect:1}} src="https://scontent.flcy1-1.fna.fbcdn.net/v/t1.0-9/14089025_1217198911634007_3545650935448468708_n.jpg?oh=793665c7cf361f2407649ba95a145354&oe=596819BF"/>
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
