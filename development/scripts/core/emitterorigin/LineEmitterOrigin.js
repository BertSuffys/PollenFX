
class LineEmitterOrigin extends EmitterOrigin {
    constructor(posX_1, posY_1, posX_2, posY_2, posXNoise = -1, posYNoise = -1, offset = -1, overflow=true, anchorElement = null,  containerUnitWidth = PositionUnit.PERCENTAGE, containerUnitHeight = PositionUnit.PERCENTAGE, containerWidth = 100, containerHeight = 100 ,positionUnitWidth = PositionUnit.PIXEL, positionUnitHeight = PositionUnit.PIXEL, left = 0, top = 0, includeMargin = false, includePadding = true, includeBorder = true) {
      super(posX_1, posY_1, posXNoise, posYNoise, overflow, anchorElement, containerUnitWidth, containerUnitHeight , containerWidth, containerHeight, positionUnitWidth, positionUnitHeight, left, top, includeMargin, includePadding, includeBorder)
      this.originalPosX_2 = posX_2
      this.originalPosY_2 = posY_2
      this.offset = Math.max(0, offset)
      this.initializePosition_2()
    }
  
  
    generateParticleSpawnPosition() {
      const progress = Math.random()
      let x = PollenMath.lerp(this.posX_2, super.posX, progress)
      let y = PollenMath.lerp(this.posY_2, super.posY, progress)
      if (this.offset > 0) {
        const rico = this.getDirectionCoefficient(
          super.posX,
          this.posX_2,
          super.posY,
          this.posY_2
        )
        const inverseRico = -1 / rico
  
        if (inverseRico == -Infinity) {
          y += Math.random() * this.offset - this.offset / 2
        } else {
          const randOffsetAbs = Math.random() * this.offset
  
          let xOffset = Math.sqrt(
            Math.abs(Math.pow(randOffsetAbs, 2) / (1 + Math.pow(inverseRico, 2)))
          )
          let yOffset = xOffset * inverseRico
  
          let randomMultiplier = Math.random() > 0.5 ? 1 : -1
  
          xOffset = (xOffset / 2) * randomMultiplier
          yOffset = (yOffset / 2) * randomMultiplier
  
          x += xOffset
          y += yOffset
        }
      }
      return [x, y]
    }
  
  
    initializePosition_2() {
  
      if (super.posXNoise <= 0) {
        this.posX_2 = this.originalPosX_2
      } else {
        this.posX_2 =
          this.originalPosX_2 +
          (super.posXNoise / -2 + super.posXNoise * Math.random())
      }
  
      if (super.posYNoise <= 0) {
        this.posY_2 = this.originalPosY_2
      } else {
        this.posY_2 =
          this.originalPosY_2 +
          (super.posYNoise / -2 + super.posYNoise * Math.random())
      }
    }
  
  
    getDirectionCoefficient(x1, x2, y1, y2) {
      const deltaX = x2 - x1
      const deltaY = y2 - y1
      return deltaY == 0 ? 0 : deltaY / deltaX
    }
  
  
    get posY_2() {
      return this._posY_2
    }
    set posY_2(value) {
      this._posY_2 = value
    }
    get posX_2() {
      return this._posX_2
    }
    set posX_2(value) {
      this._posX_2 = value
    }
    get originalPosX_2() {
      return this._originalPosX_2
    }
    set originalPosX_2(value) {
      this._originalPosX_2 = value
    }
  
    get originalPosY_2() {
      return this._originalPosY_2
    }
    set originalPosY_2(value) {
      this._originalPosY_2 = value
    }
    get offset() {
      return this._offset
    }
    set offset(value) {
      this._offset = value
    }
  }
  
  