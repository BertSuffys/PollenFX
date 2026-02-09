class ParticleFlipbookData extends ParticleImageData {
  /* FIELDS */
  frameCountY;
  frameCountX;
  frameCount;
  startFrame;
  frameWidth;
  frameHeight;
  particleWidth = 100;  // altered by flipbook behavior
  particleHeight = 100; // altered by flipbook behavior

  /* CONSTRUCTOR */
  constructor(url, imgWidth = null, imgHeight = null, frameCountX = 1, frameCountY = 1, startFrame = 0) {
    super(url, imgWidth, imgHeight);
    this.startFrame = startFrame;
    this.frameCountX = frameCountX;
    this.frameCountY = frameCountY;
    this.frameCount = frameCountX * frameCountY;
    this.currentFrameIndex = (this.startFrame == -1) ? (Math.ceil(Math.random() * (frameCountX * frameCountY))) : (this.startFrame);
    // Image data overrides
    this.type = "flipbook";
    this.imageFitting = ImageFitting.CONTAIN;
  }

  /* FLUENT */
  build() {
    super.extractImageDimensions(super.url, this.imgWidth, this.imgHeight, (response) => {
      super.imgWidth = imgWidth != null && imgHeight != null ? imgWidth : response[0];
      super.imgHeight = imgWidth != null && imgHeight != null ? imgHeight : response[1];
      this.frameWidth = super.imgWidth / frameCountX;
      this.frameHeight = super.imgHeight / frameCountY;
      this.particleWidth = super.imgWidth;
      this.particleHeight = super.imgHeight;
    });
    return this;
  }

  reset() {
    return this;
  }

  /* METHODS */
  getBackgroundimageWidth() {
    return this.particleWidth * this.frameCountX;
  }

  getBackgroundimageHeight() {
    return this.particleHeight * this.frameCountY;
  }

  getCSS() {
    return `background-image : url(${this.url});
            background-size : ${this.getBackgroundimageWidth()}px ${this.getBackgroundimageHeight()}px;
            background-position-x : -${this.left()}px;
            background-position-y: -${this.top()}px;`;
  }

  left() {
    return (this.currentFrameIndex % this.frameCountX) * this.particleWidth;
  }

  top() {
    return ~~(this.currentFrameIndex / this.frameCountX) * this.particleHeight;
  }

  createNew(copy) {
    if (copy) {
      return this;
    }
    return new ParticleFlipbookData(this.url, super.imgWidth, super.imgHeight, this.frameCountX, this.frameCountY, this.startFrame).withImageFitting(this.imageFitting);
  }

  static createDefault() {
    return new ParticleFlipbookData(1, 1, "./assets/images/placeholder.png", 1, null, null);
  }
}
