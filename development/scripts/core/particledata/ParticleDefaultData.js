
class ParticleDefaultData extends ParticleData {
    constructor(width, height, emitterOrigin, noiseWidth = -1, noiseHeight = -1, uniformSizeWidth = false, horizontalPivot = Pivot.CENTER, verticalPivot = Pivot.CENTER) {
      super("default")
      const position = emitterOrigin.generateParticleSpawnPosition()
      this.posX = position[0]
      this.posY = position[1]
      this.emitterOrigin = emitterOrigin
      this.horizontalPivot = horizontalPivot
      this.verticalPivot = verticalPivot
  
      this.initialWidth = width != null ? width : 10
      this.initialHeight = height != null ? height : 10
      this.noiseWidth = noiseWidth
      this.noiseHeight = noiseHeight
      this.uniformSizeWidth = uniformSizeWidth
  
      this.initSizes(noiseWidth, noiseHeight, uniformSizeWidth, width, height)
    }
  
    reset() {
      const position = this.emitterOrigin.generateParticleSpawnPosition()
      this.posX = position[0]
      this.posY = position[1]
    }
  
    getCSS() {
      return `top: ${this.posY - (this.height * this.verticalPivot)}px;
             left: ${this.posX - (this.width * this.horizontalPivot)}px;
             width: ${this.width}px;
             height: ${this.height}px;
             will-change : transform;`;
    }
  
    static createDefault() {
      return new ParticleDefaultData(
        10,
        10,
        new PointEmitterOrigin(0, 0)
      )
    }
  
  
    createNew(copy) {
      if (copy) {
        return this
      }
      return new ParticleDefaultData(
        this.initialWidth,
        this.initialHeight,
        this.emitterOrigin,
        this.noiseWidth,
        this.noiseHeight,
        this.uniformSizeWidth,
        this.horizontalPivot,
        this.verticalPivot
      )
    }
  
  
    initSizes(noiseWidth, noiseHeight, uniformSizeWidth, width, height) {
      if (noiseWidth > 0 || noiseHeight > 0) {
        let random = Math.random()
  
        if (noiseWidth >= 0 && noiseHeight >= 0) {
          this.width = PollenMath.relativeMap(
            this.initialWidth,
            1 + Math.max(noiseWidth, 0),
            random
          )
          if (uniformSizeWidth) {
            this.height = PollenMath.relativeMap(
              this.initialHeight,
              1 + Math.max(noiseWidth, 0),
              random
            )
          } else {
            random = Math.random()
            this.height = PollenMath.relativeMap(
              this.initialHeight,
              1 + Math.max(noiseHeight, 0),
              random
            )
          }
        }
        else if (noiseWidth <= 0) {
          this.height = PollenMath.relativeMap(
            this.initialHeight,
            1 + Math.max(noiseHeight, 0),
            random
          )
          if (uniformSizeWidth) {
            this.width = PollenMath.relativeMap(
              this.initialWidth,
              1 + Math.max(noiseHeight, 0),
              random
            )
          } else {
            this.width = width
          }
        }
  
        else if (noiseHeight <= 0) {
          this.width = PollenMath.relativeMap(
            this.initialWidth,
            1 + Math.max(noiseWidth, 0),
            random
          )
          if (uniformSizeWidth) {
            this.height = PollenMath.relativeMap(
              this.initialHeight,
              1 + Math.max(noiseWidth, 0),
              random
            )
          } else {
            this.height = height
          }
        }
      } else {
        this.height = height
        this.width = width
      }
    }
  
  
    get emitterOrigin() {
      return this._emitterOrigin
    }
    set emitterOrigin(value) {
      this._emitterOrigin = value
    }
    get posX() {
      return this._posX
    }
    set posX(value) {
      this._posX = value
    }
  
    get posY() {
      return this._posY
    }
    set posY(value) {
      this._posY = value
    }
    get verticalPivot() {
      return this._verticalPivot
    }
    set verticalPivot(value) {
      this._verticalPivot = value
    }
    get horizontalPivot() {
      return this._horizontalPivot
    }
    set horizontalPivot(value) {
      this._horizontalPivot = value
    }
    get uniformSizeWidth() {
      return this._uniformSizeWidth
    }
    set uniformSizeWidth(value) {
      this._uniformSizeWidth = value
    }
    get noiseHeight() {
      return this._noiseHeight
    }
    set noiseHeight(value) {
      this._noiseHeight = value
    }
    get noiseWidth() {
      return this._noiseWidth
    }
    set noiseWidth(value) {
      this._noiseWidth = value
    }
    get width() {
      return this._width
    }
    set width(value) {
      this._width = value
    }
    get height() {
      return this._height
    }
    set height(value) {
      this._height = value
    }
    get initialHeight() {
      return this._initialHeight
    }
    set initialHeight(value) {
      this._initialHeight = value
    }
    get initialWidth() {
      return this._initialWidth
    }
    set initialWidth(value) {
      this._initialWidth = value
    }
  }
  
  