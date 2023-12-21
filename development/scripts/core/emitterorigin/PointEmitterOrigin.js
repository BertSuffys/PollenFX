

class PointEmitterOrigin extends EmitterOrigin {

    constructor(posX, posY, posXNoise = -1, posYNoise = -1, overflow=true, anchorElement = null, containerUnitWidth = PositionUnit.PERCENTAGE, containerUnitHeight = PositionUnit.PERCENTAGE, containerWidth = 100, containerHeight = 100 ,positionUnitWidth = PositionUnit.PIXEL, positionUnitHeight = PositionUnit.PIXEL, left = 0, top = 0, includeMargin = false, includePadding = true, includeBorder = true) {
        super(posX, posY, posXNoise, posYNoise, overflow, anchorElement, containerUnitWidth, containerUnitHeight, containerWidth, containerHeight, positionUnitWidth, positionUnitHeight, left, top, includeMargin, includePadding, includeBorder)
    }

    generateParticleSpawnPosition() {
        return [super.posX, super.posY]
    }
}


