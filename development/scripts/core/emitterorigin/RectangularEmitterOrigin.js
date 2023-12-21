class RectangularEmitterOrigin extends EmitterOrigin {
    constructor(posX, posY, width, height, posXNoise = -1, posYNoise = -1, overflow=true, anchorElement = null, containerUnitWidth = PositionUnit.PERCENTAGE, containerUnitHeight = PositionUnit.PERCENTAGE, containerWidth = 100, containerHeight = 100 ,positionUnitWidth = PositionUnit.PIXEL, positionUnitHeight = PositionUnit.PIXEL, left = 0, top = 0, includeMargin = false, includePadding = true, includeBorder = true) {
      super(posX, posY, posXNoise, posYNoise, overflow, anchorElement, containerUnitWidth, containerUnitHeight, containerWidth, containerHeight, positionUnitWidth, positionUnitHeight, left, top)
      this.width = width
      this.height = height
    }
  
    generateParticleSpawnPosition() {
      const x = Math.random() * this.width + super.posX - this.width / 2
      const y = Math.random() * this.height + super.posY - this.height / 2
      return [x, y]
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
  }