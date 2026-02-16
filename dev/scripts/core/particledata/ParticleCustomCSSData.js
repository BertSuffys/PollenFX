class ParticleCustomCssData extends ParticleData {

  /* FIELDS */
  customCssObject;
  minZIndex = 2001;
  maxZIndex = 2001;
  zIndex = 2001;



  /* CONSTRUCTOR */
  constructor(customCssObject) {
    super("customCSS");
    this.customCssObject = customCssObject;
  }



  /* FLUENT */
  zIndex(zIndex) {
    this.minZIndex = zIndex;
    this.maxZIndex = zIndex;
    return this;
  }
  
  zIndexRange(minZIndex = 2001, maxZIndex = 2001) {
    this.minZIndex = minZIndex;
    this.maxZIndex = maxZIndex;
    return this;
  }

  reset() {
    return this;
  }

  build() {
    this.zIndex = PollenMath.randomBetween(this.minZIndex, this.maxZIndex, false);
    return this;
  }



  /* METHODS */
  getCSS() {
    return `${this.customCssObject}z-index:${this.zIndex}!important;`;
  }

  static createDefault() {
    return new ParticleCustomCssData("background-color:red;");
  }

  createNew(copy) {
    if (copy) {
      return this;
    }
    return new ParticleCustomCssData(this.customCssObject).zIndexRange(this.minZIndex, this.maxZIndex);
  }
}
