class ParticleImageData extends ParticleData {
  /* FIELDS */
  url;
  imgWidth;
  imgHeight;
  imageFitting = ImageFitting.FIT;



  /* CONSTRUCTOR */
  constructor(url, imgWidth = null, imgHeight = null) {
    super("image");
    this.url = url;
    this.imgWidth = imgWidth;
    this.imgHeight = imgHeight;
  }



  /* FLUENT */
  withImageFitting(imageFitting) {
    this.imageFitting = imageFitting;
    return this;
  }

  build() {
    if(!this.imgWidth || !this.imgHeight){
      this.extractImageDimensions(this.url, this.imgWidth, this.imgHeight, (response) => {
        this.imgWidth = response[0];
        this.imgHeight = response[1];
      });
    }
    return this;
  }

  reset() {
    return this;
  }



  /* METHODS */
  getCSS() {
    return `background-image: url(\'${this.url}\'); background-size : ${this.imageFitting};`;
  }

  extractImageDimensions(url, imgWidth, imgHeight, callback) {
    if (imgWidth != null && imgHeight != null) {
      callback([imgWidth, imgHeight]);
    } else {
      var image = new Image();
      image.src = url;
      image.onload = function (e) {
        const height = e.target.height;
        const width = e.target.width;
        callback([width, height]);
      };
    }
  }

  createNew(copy) {
    if (copy) {
      return this;
    }
    return new ParticleImageData(this.url, this.imgWidth, this.imgHeight).withImageFitting(this.imageFitting);
  }

  static createDefault() {
    return new ParticleImageData("./assets/images/placeholder.png", 1);
  }
}
