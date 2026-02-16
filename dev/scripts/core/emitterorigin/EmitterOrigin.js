class EmitterOrigin {
  /* FIELDS */
  // position
  originalPosX;
  originalPosY;
  posX;
  posY;
  posXNoise = -1;
  posYNoise = -1;
  // overflow from container
  overflow = true;
  // anchor as container
  anchorElement = null;
  // origin metric system
  originUnitWidth = PositionUnit.PIXEL;
  originUnitHeight = PositionUnit.PIXEL;
  originUnitPosX = PositionUnit.PIXEL;
  originUnitPosY = PositionUnit.PIXEL;
  // container scaling
  containerWidth = 100;
  containerHeight = 100;
  containerUnitWidth = PositionUnit.PERCENTAGE;
  containerUnitHeight = PositionUnit.PERCENTAGE;
  // container offset
  top = 0;
  left = 0;
  containerUnitPosX = PositionUnit.PERCENTAGE;
  containerUnitPosY = PositionUnit.PERCENTAGE;
  // emitterbox
  mimicShape = false;         // whether the emitterBox mimics shape or transform influencing properties from the anchorElement
  includeMargin = false;      // whether the emitterBox' width & height should also take into account the anchorElement's margin
  includePadding = true;      // whether the emitterBox' width & height should also take into account the anchorElement's padding
  includeBorder = true;       // whether the emitterBox' width & height should also take into account the anchorElement's margin

  /* CONSTRUCTOR */
  constructor(posX, posY) {
    this.originalPosX = Math.round(posX);
    this.originalPosY = Math.round(posY);
  }

  /* FLUENT */
  withDomProperties(includeMargin, includePadding, includeBorder) {
    this.includeMargin = includeMargin;
    this.includePadding = includePadding;
    this.includeBorder = includeBorder;
    return this;
  }

  withMimicShape(mimicShape = true) {
    this.mimicShape = mimicShape; // todo
    return this;
  }

  withContainerProperties(
    containerWidth,
    containerHeight,
    left,
    top,
    containerUnitWidth = PositionUnit.PERCENTAGE,
    containerUnitHeight = PositionUnit.PERCENTAGE,
    containerUnitPosX = PositionUnit.PERCENTAGE,
    containerUnitPosY = PositionUnit.PERCENTAGE,
  ) {
    this.containerWidth = containerWidth ?? 100;
    this.containerHeight = containerHeight ?? 100;
    this.containerUnitWidth = containerUnitWidth ?? PositionUnit.PERCENTAGE;
    this.containerUnitHeight = containerUnitHeight ?? PositionUnit.PERCENTAGE;
    this.top = top == null ? 0 : top;
    this.left = left == null ? 0 : left;
    this.containerUnitPosX = containerUnitPosX ?? PositionUnit.PERCENTAGE;
    this.containerUnitPosY = containerUnitPosY ?? PositionUnit.PERCENTAGE;
    return this;
  }

  withOriginProperties(originUnitWidth = PositionUnit.PIXEL, originUnitHeight = PositionUnit.PIXEL, originUnitPosX = PositionUnit.PIXEL, originUnitPosY = PositionUnit.PIXEL) {
    this.originUnitWidth = originUnitWidth ?? PositionUnit.PIXEL;
    this.originUnitHeight = originUnitHeight ?? PositionUnit.PIXEL;
    this.originUnitPosX = originUnitPosX ?? PositionUnit.PIXEL;
    this.originUnitPosY = originUnitPosY ?? PositionUnit.PIXEL;
    return this;
  }

  withPositionNoise(posXNoise) {
    this.posXNoise = posXNoise;
    this.posYNoise = posYNoise;
    return this;
  }

  withOverflow(overflow) {
    this.overflow = overflow;
    return this;
  }

  withAnchor(anchorElement) {
    this.setAnchorElement(anchorElement);
    return this;
  }

  build() {
    this.initializePosition();
    return this;
  }

  /* METHODS */
  initializePosition() {
    if (this.posXNoise > 0) {
      this.posX = this.originalPosX + (this.posXNoise / -2 + this.posXNoise * Math.random());
    } else {
      this.posX = this.originalPosX;
    }
    if (this.posYNoise > 0) {
      this.posY = this.originalPosY + (this.posYNoise / -2 + this.posYNoise * Math.random());
    } else {
      this.posY = this.originalPosY;
    }
  }

  /* GETTERS AND SETTERS */
  setAnchorElement(value) {
    if (value == null || value instanceof HTMLElement) {
      this.anchorElement = value;
    } else {
      FXUtil.pollenFXError("The provided anchorelement must be of type HTMLElement!");
    }
  }
}
