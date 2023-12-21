class ParticleImageData extends ParticleData {

  constructor(url, imgWidth, imgHeight, imageFitting = ImageFitting.FIT, keyOverride = "image", imgLoadingCallback = response => {
                                                                                                    this.imgWidth = response[0];
                                                                                                    this.imgHeight = response[1];
                                                                                                  }) {
    super(keyOverride)
    this.url = url
    this.imageFitting = imageFitting
    let image = new Image()
    image.src = url
    this.extractImageDimensions(url, imgWidth, imgHeight)
      .pipe(delay(0))
      .subscribe(imgLoadingCallback)
  }


  extractImageDimensions(url, imgWidth, imgHeight) {
    return new Observable(observer => {
      if (imgWidth != null && imgHeight != null) {
        observer.next([imgWidth, imgHeight])
        observer.complete()
      } else {
        var image = new Image()
        image.src = url
        image.onload = e => {
          const height = e.target.height
          const width = e.target.width
          observer.next([width, height])
          observer.complete()
        }
      }
    })
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
