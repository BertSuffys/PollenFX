class EmitterOrigin {


   /* Fields */
  _includeMargin;    // whether the emitterBox' width & height should also take into account the anchorElement's margin
  _includePadding;   // whether the emitterBox' width & height should also take into account the anchorElement's padding
  _includeBorder;    // whether the emitterBox' width & height should also take into account the anchorElement's margin


  /* Constructor */
    constructor(posX, posY, posXNoise = -1, posYNoise = -1,overflow=true, anchorElement = null, containerUnitWidth = PositionUnit.PERCENTAGE, containerUnitHeight = PositionUnit.PERCENTAGE , containerWidth = 100, containerHeight = 100, positionUnitWidth = PositionUnit.PIXEL, positionUnitHeight = PositionUnit.PIXEL, left = 0, top = 0, includeMargin = false, includePadding = true, includeBorder = true) {
      this.originalPosX = Math.round(posX);
      this.originalPosY = Math.round(posY);
      this.overflow = overflow;
      this.posXNoise = posXNoise;
      this.posYNoise = posYNoise;
      this.anchorElement = anchorElement;
      this.containerWidth = containerWidth;
      this.containerHeight = containerHeight;
      this.containerUnitWidth = containerUnitWidth;
      this.containerUnitHeight = containerUnitHeight;
      this.top = (top == null ? 0 : top);
      this.left = (left == null ? 0 : left);
      this.positionUnitWidth = positionUnitWidth;
      this.positionUnitHeight = positionUnitHeight;
      this.includeMargin = includeMargin;
      this.includePadding = includePadding;
      this.includeBorder = includeBorder;
      this.initializePosition();
    }
  
  
    initializePosition() {
      if (this.posXNoise > 0) {
        this.posX =
          this.originalPosX +
          (this.posXNoise / -2 + this.posXNoise * Math.random())
      } else {
        this.posX = this.originalPosX
      }
      if (this.posYNoise > 0) {
        this.posY =
          this.originalPosY +
          (this.posYNoise / -2 + this.posYNoise * Math.random())
      } else {
        this.posY = this.originalPosY
      }
    }
  

    get includeMargin() {
      return this._includeMargin
    }
    set includeMargin(value) {
      this._includeMargin = value
    }
    get includePadding() {
      return this._includePadding
    }
    set includePadding(value) {
      this._includePadding = value
    }
    get includeBorder() {
      return this._includeBorder
    }
    set includeBorder(value) {
      this._includeBorder = value
    }
    get containerWidth() {
      return this._containerWidth
    }
    set containerWidth(value) {
      this._containerWidth = value
    }
    get containerHeight() {
      return this._containerHeight
    }
    set containerHeight(value) {
      this._containerHeight = value
    }
    get top() {
      return this._top
    }
    set top(value) {
      this._top = value
    }
    get left() {
      return this._left
    }
    set left(value) {
      this._left = value
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
    get posYNoise() {
      return this._posYNoise
    }
    set posYNoise(value) {
      this._posYNoise = value
    }
    get posXNoise() {
      return this._posXNoise
    }
    set posXNoise(value) {
      this._posXNoise = value
    }
    get originalPosY() {
      return this._originalPosY
    }
    set originalPosY(value) {
      this._originalPosY = value
    }
    get originalPosX() {
      return this._originalPosX
    }
    set originalPosX(value) {
      this._originalPosX = value
    }

    get containerUnitHeight() {
      return this._containerUnitHeight;
    }
    set containerUnitHeight(value) {
      this._containerUnitHeight = value;
    }
    get containerUnitWidth() {
      return this._containerUnitWidth;
    }
    set containerUnitWidth(value) {
      this._containerUnitWidth = value;
    }

    get overflow() {
      return this._overflow;
    }
    set overflow(value) {
      this._overflow = value;
    }

    get positionUnitWidth() {
      return this._positionUnitWidth;
    }
    set positionUnitWidth(value) {
      this._positionUnitWidth = value;
    }
    get positionUnitHeight() {
      return this._positionUnitHeight;
    }
    set positionUnitHeight(value) {
      this._positionUnitHeight = value;
    }
    get anchorElement() {
      return this._anchorElement;
    }
    set anchorElement(value) {
      if (value == null || value instanceof HTMLElement) {
        this._anchorElement = value;
      } else {
        pollenFXError("The provided anchorelement must be of type HTMLElement!");
      }
    }
  }
  