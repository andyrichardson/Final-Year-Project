const React = require("react");
const RB = require('react-bootstrap');
const ReactCrop = require('react-image-crop');
const Prom = require('bluebird');
const Api = require('../../includes/api');

class UploadPhotoModal extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      file: undefined,
      imagePreviewUrl: undefined,
      crop: {
        x: 10,
        y: 10,
        width: 80,
        aspect: 1
      }
    };
  }

  /* UPLOAD OF NEW IMAGE */
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

  /* FOLLOWING CROP */
  cropComplete(crop, pixelCrop){
    this.setState({crop: crop})
  }

  /* LOAD IMAGE */
  loadImage(src) {
    return new Prom((resolve, reject) => {
      var image = new Image();
      image.onload = e => resolve(image);

      image.src = src;
    });
  }

  /* CROP IMAGE */
  cropImage(img){
    const crop = this.state.crop;

    const width = img.width;
    const height = img.height;

    const xCrop = (crop.x / 100) * width;
    const yCrop = (crop.y / 100) * height;

    const newWidth = (crop.width / 100) * width;
    const newHeight = (crop.height / 100) * height;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img, xCrop, yCrop, newWidth, newHeight, 0, 0, newWidth, newHeight);

    return canvas.toDataURL('image/jpeg');
  }

  /* SAVE */
  save(){
    return this.loadImage(this.state.imagePreviewUrl)
    .then((img)=>{
      return this.cropImage(img);
    })
    .then((image)=>{
      return Api.changeImage({
        accessToken: this.props.accessToken,
        image: image
      })
    })
    .then((data)=>{
      alert(data.message)
      this.props.close();
      this.props.update();
    })
  }

  render(){
    return(
    <div>
      <RB.Modal show={this.props.visible} onHide={this.props.close}>
        <RB.Modal.Header closeButton>
          <RB.Modal.Title>Change Photo</RB.Modal.Title>
        </RB.Modal.Header>

        <RB.Modal.Body>
          <input type="file" accept="image/*" onChange={(c) => this.handleFileChange(c)}/>
          <ReactCrop
            src={this.state.imagePreviewUrl}
            crop={this.state.crop}
            onChange={(c)=>this.cropComplete(c)}
          />
        </RB.Modal.Body>

        <RB.Modal.Footer>
          <RB.Button onClick={this.props.close}>Close</RB.Button>
          <RB.Button onClick={()=>this.save()}>Save</RB.Button>
        </RB.Modal.Footer>
      </RB.Modal>
    </div>
    );
  }
}

module.exports = UploadPhotoModal;
