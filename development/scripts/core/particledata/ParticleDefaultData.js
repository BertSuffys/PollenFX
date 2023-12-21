
class ParticleDefaultData extends ParticleData {
    constructor(width, height, emitterOrigin, noiseX = -1, noiseY = -1, uniformNoiseX = false, horizontalPivot = Pivot.CENTER, verticalPivot = Pivot.CENTER) {
      super("default")
      const position = emitterOrigin.generateParticleSpawnPosition()
      this.posX = position[0]
      this.posY = position[1]
      this.emitterOrigin = emitterOrigin
      this.horizontalPivot = horizontalPivot
      this.verticalPivot = verticalPivot
  
      this.initialWidth = width != null ? width : 10
      this.initialHeight = height != null ? height : 10
      this.noiseX = noiseX
      this.noiseY = noiseY
      this.uniformNoiseX = uniformNoiseX
  
      this.initSizes(noiseX, noiseY, uniformNoiseX, width, height)
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
        this.noiseX,
        this.noiseY,
        this.uniformNoiseX,
        this.horizontalPivot,
        this.verticalPivot
      )
    }
  
  
    initSizes(noiseX, noiseY, uniformNoiseX, width, height) {
      if (noiseX > 0 || noiseY > 0) {
        let random = Math.random()
  
        if (noiseX >= 0 && noiseY >= 0) {
          this.width = PollenMath.relativeMap(
            this.initialWidth,
            1 + Math.max(noiseX, 0),
            random
          )
          if (uniformNoiseX) {
            this.height = PollenMath.relativeMap(
              this.initialHeight,
              1 + Math.max(noiseX, 0),
              random
            )
          } else {
            random = Math.random()
            this.height = PollenMath.relativeMap(
              this.initialHeight,
              1 + Math.max(noiseY, 0),
              random
            )
          }
        }
        else if (noiseX <= 0) {
          this.height = PollenMath.relativeMap(
            this.initialHeight,
            1 + Math.max(noiseY, 0),
            random
          )
          if (uniformNoiseX) {
            this.width = PollenMath.relativeMap(
              this.initialWidth,
              1 + Math.max(noiseY, 0),
              random
            )
          } else {
            this.width = width
          }
        }
  
        else if (noiseY <= 0) {
          this.width = PollenMath.relativeMap(
            this.initialWidth,
            1 + Math.max(noiseX, 0),
            random
          )
          if (uniformNoiseX) {
            this.height = PollenMath.relativeMap(
              this.initialHeight,
              1 + Math.max(noiseX, 0),
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
    get uniformNoiseX() {
      return this._uniformNoiseX
    }
    set uniformNoiseX(value) {
      this._uniformNoiseX = value
    }
    get noiseY() {
      return this._noiseY
    }
    set noiseY(value) {
      this._noiseY = value
    }
    get noiseX() {
      return this._noiseX
    }
    set noiseX(value) {
      this._noiseX = value
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
  
  