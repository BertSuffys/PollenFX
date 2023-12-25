

class ParticleFlipbookData extends ParticleImageData {

  _frameCountY;
  _frameCountX;
  _frameCount;
  _startFrame;
  _frameWidth;
  _frameHeight;

  _particleWidth=100;  // altered by flipbook behavior
  _particleHeight=100; // altered by flipbook behavior

    constructor(url, imgWidth = null, imgHeight = null, frameCountX = 1, frameCountY = 1, startFrame = 0, imageFitting = ImageFitting.CONTAIN) {
      super(url, imgWidth, imgHeight, imageFitting, "flipbook", null)

      /* This is not ideal, but i had to find a workaround. */

      
      super.extractImageDimensions(super.url, imgWidth, imgHeight, (response)=>{
        super.imgWidth = imgWidth != null && imgHeight != null ? imgWidth : response[0]
        super.imgHeight = imgWidth != null && imgHeight != null ? imgHeight : response[1]
        this.frameWidth = super.imgWidth / frameCountX;
        this.frameHeight = super.imgHeight / frameCountY;
       // console.log( "shobec ",super.imgWidth, super.imgHeight, this.frameWidth, this.frameHeight)
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
      return `background-image : url(${this.url});
              background-size : ${this.getBackgroundimageWidth()}px ${this.getBackgroundimageHeight()}px;
              background-position-x : -${this.left()}px;
              background-position-y: -${this.top()}px;`;
      
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
        this.url,
        super.imgWidth,
        super.imgHeight,
        this.frameCountX,
        this.frameCountY,
        this.startFrame,
        super.imageFitting,
      )
    }
  


    static createDefault() {
      console.log("heypa")
      return new ParticleFlipbookData(
        1,
        1,
        "./assets/images/placeholder.png",
        1,
        null,
        null
      )
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