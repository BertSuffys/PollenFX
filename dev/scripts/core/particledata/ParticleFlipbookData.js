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
    // Image data overrides
    this.type = "flipbook";
    this.imageFitting = ImageFitting.CONTAIN;
  }

  /* FLUENT */
  build(particleDataManager, particleBehaviorManager) {
    this.currentFrameIndex = (this.startFrame == -1) ? (Math.ceil(Math.random() * (frameCountX * frameCountY))) : (this.startFrame);
    this.defaultData = particleDataManager.ensureData("default");
    this.particleWidth = this.defaultData.width;
    this.particleHeight = this.defaultData.height;
    super.extractImageDimensions(this.url, this.imgWidth, this.imgHeight, (response) => {
      this.imgWidth = this.imgWidth != null && this.imgHeight != null ? this.imgWidth : response[0];
      this.imgHeight = this.imgWidth != null && this.imgHeight != null ? this.imgHeight : response[1];
      this.frameWidth = this.imgWidth / this.frameCountX;
      this.frameHeight = this.imgHeight / this.frameCountY;
    });
    return this;
  }

  reset() {
    this.currentFrameIndex = (this.startFrame == -1) ? (Math.ceil(Math.random() * (frameCountX * frameCountY))) : (this.startFrame);
    return this;
  }

  withRandomStartFrame(){
    this.startFrame = (this.frameCountX * this.frameCountY) - 1;
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
    return new ParticleFlipbookData(this.url, this.imgWidth, this.imgHeight, this.frameCountX, this.frameCountY, this.startFrame).withImageFitting(this.imageFitting);
  }

  static createDefault() {
    return new ParticleFlipbookData(1, 1, "./assets/images/placeholder.png", 1, null, null);
  }
}
