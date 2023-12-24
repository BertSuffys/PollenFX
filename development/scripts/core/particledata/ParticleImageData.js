class ParticleImageData extends ParticleData {

  constructor(url, imgWidth = null, imgHeight = null, imageFitting = ImageFitting.FIT, keyOverride = "image", imgLoadingCallback = response => {
                                                                                                    this.imgWidth = response[0];
                                                                                                    this.imgHeight = response[1];
                                                                                                  }) {
    super(keyOverride)
    this.url = url
    this.imageFitting = imageFitting
    let image = new Image()
    image.src = url
    this.extractImageDimensions(url, imgWidth, imgHeight, imgLoadingCallback)

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

  /**
   * Retrieve particle CSS
   */
  getCSS() {
    return `background-image: url(\'${this.url}\'); background-size : ${this.imageFitting};`;
  }

  reset() {

  }

  createNew(copy) {
    if (copy) {
      return this
    }
    return new ParticleImageData(this.url, this.imgWidth, this.imgHeight)
  }

  static createDefault() {
    return new ParticleImageData("./assets/images/placeholder.png", 1)
  }

  get url() {
    return this._url
  }
  set url(value) {
    this._url = value
  }
  get imgWidth() {
    return this._imgWidth
  }
  set imgWidth(value) {
    this._imgWidth = value
  }
  get imgHeight() {
    return this._imgHeight
  }
  set imgHeight(value) {
    this._imgHeight = value
  }
  get imageFitting() {
    return this._imageFitting
  }
  set imageFitting(value) {
    this._imageFitting = value
  }
}
