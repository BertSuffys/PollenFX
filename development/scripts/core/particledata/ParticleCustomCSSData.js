

class ParticleCustomCssData extends ParticleData {

  _customCssObject;  // string of multiple css stylelines
  _minZIndex;        // lowest ZIndex value possible
  _maxZIndex;        // lowest ZIndex value possible
  _zIndex;           // final zIndex

  constructor(customCssObject, minZIndex=2001, maxZIndex=2001) {
    super("customCSS")
    this.customCssObject = customCssObject;
    this.minZIndex = minZIndex;
    this.maxZIndex = maxZIndex;
    this.zIndex = PollenMath.randomBetween(minZIndex, maxZIndex, false);
  }

  getCSS() {
    return `${this.customCssObject}z-index:${this.zIndex}!important;`
  }

  reset() { }

  static createDefault() {
    return new ParticleCustomCssData("background-color:red;")
  }

  createNew(copy) {
    if (copy) {
      return this
    }
    return new ParticleCustomCssData(this.customCssObject, this.minZIndex, this.maxZIndex);
  }

  get customCssObject() {
    return this._customCssObject
  }
  set customCssObject(value) {
    this._customCssObject = value
  }


  get minZIndex() {
    return this._minZIndex
  }
  set minZIndex(value) {
    this._minZIndex = value
  }


  get maxZIndex() {
    return this._maxZIndex
  }
  set maxZIndex(value) {
    this._maxZIndex = value
  }


  get zIndex() {
    return this._zIndex
  }
  set zIndex(value) {
    this._zIndex = value
  }
}