class CircularEmitterOrigin extends EmitterOrigin {
    constructor(posX, posY, width, height, posXNoise = -1, posYNoise = -1, overflow=true, anchorElement = null, containerUnitWidth = PositionUnit.PERCENTAGE, containerUnitHeight = PositionUnit.PERCENTAGE, containerWidth = 100, containerHeight = 100 ,positionUnitWidth = PositionUnit.PIXEL, positionUnitHeight = PositionUnit.PIXEL, left = 0, top = 0, includeMargin = false, includePadding = true, includeBorder = true) {
        super(posX, posY, posXNoise, posYNoise, overflow, anchorElement, containerUnitWidth, containerUnitHeight , containerWidth, containerHeight, positionUnitWidth, positionUnitHeight, left, top, includeMargin, includePadding, includeBorder)
        this.width = width
        this.height = height
    }
    
    generateParticleSpawnPosition() {
        const randomScalar = Math.random()
        const randomAngle = Math.random() * (2 * Math.PI)
        const x =
            Math.cos(randomAngle) * (randomScalar * (this.width / 2)) + super.posX
        const y =
            Math.sin(randomAngle) * (randomScalar * (this.height / 2)) + super.posY
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