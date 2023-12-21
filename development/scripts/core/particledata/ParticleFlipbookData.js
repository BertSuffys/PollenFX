

class ParticleFlipbookData extends ParticleImageData {
    constructor(url, imgWidth, imgHeight, frameCountX, frameCountY, startFrame = 0, imageFitting = ImageFitting.CONTAIN) {
      super(url, imgWidth, imgHeight, imageFitting, "flipbook", response => {
        this.imgWidth = imgWidth != null && imgHeight != null ? imgWidth : response[0]
        this.imgHeight = imgWidth != null && imgHeight != null ? imgHeight : response[1]
        this.frameWidth = response[0] / frameCountX
        this.frameHeight = response[1] / frameCountY
      })
  
      this.startFrame = startFrame
      this.frameCountX = frameCountX
      this.frameCountY = frameCountY
      this.frameCount = frameCountX * frameCountY
      if (this.startFrame == -1) {
        this.currentFrameIndex = Math.ceil(
          Math.random() * (frameCountX * frameCountY)
        )
      } else {
        this.currentFrameIndex = this.startFrame
      }
    }
  
    getBackgroundimageWidth() {
      return this.particleWidth * this.frameCountX
    }
  
    getBackgroundimageHeight() {
      return this.particleHeight * this.frameCountY
    }
  
    getCSS() {
      return `background-image : url(${this.url})
              background-size : ${this.getBackgroundimageWidth()}px ${this.getBackgroundimageHeight()}px
              background-position-x : -${this.left()}px
              background-position-y: -${this.top()}px`;
      
    }
  
    reset() { }
  
    left() {
      return (this.currentFrameIndex % this.frameCountX) * this.particleWidth
    }
  
    top() {
      return ~~(this.currentFrameIndex / this.frameCountX) * this.particleHeight
    }
  
    createNew(copy) {
      if (copy) {
        return this
      }
      return new ParticleFlipbookData(
        this.frameCountX,
        this.frameCountY,
        this.url,
        this.startFrame,
        super.imageFitting,
        super.imgWidth,
        super.imgHeight
      )
    }
  
    static createDefault() {
      return new ParticleFlipbookData(
        1,
        1,
        "./assets/images/placeholder.png",
        1,
        null,
        null
      )
    }
  
    get startFrame() {
      return this._startFrame
    }
    set startFrame(value) {
      this._startFrame = value
    }
  
    get frameCount() {
      return this._frameCount
    }
    set frameCount(value) {
      this._frameCount = value
    }
    get frameCountX() {
      return this._frameCountX
    }
    set frameCountX(value) {
      this._frameCountX = value
    }
    get frameCountY() {
      return this._frameCountY
    }
    set frameCountY(value) {
      this._frameCountY = value
    }
    get frameHeight() {
      return this._frameHeight
    }
    set frameHeight(value) {
      this._frameHeight = value
    }
    get frameWidth() {
      return this._frameWidth
    }
    set frameWidth(value) {
      this._frameWidth = value
    }
    get currentFrameIndex() {
      return this._currentFrameIndex
    }
    set currentFrameIndex(value) {
      this._currentFrameIndex = value
    }
  
    get particleHeight() {
      return this._particleHeight
    }
    set particleHeight(value) {
      this._particleHeight = value
    }
    get particleWidth() {
      return this._particleWidth
    }
    set particleWidth(value) {
      this._particleWidth = value
    }
  }