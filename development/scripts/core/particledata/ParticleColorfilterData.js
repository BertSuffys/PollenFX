
class ParticleColorfilterData extends ParticleData {
  constructor(hueRotate = 0, color = null, noise = -1, contrast = -1, saturation = -1, brightness = -1) {
    super("colorfilter")
    this.noise = noise
    this.helperStringCSS = ""
    this.initialHueRotate = hueRotate;
    this.initialSaturation = saturation;
    this.initialBrightness = brightness;
    this.initialContrast = contrast;

    this.color = color
    this.contrast = this.initContrast(contrast);

    if (color != null) {
      /* Noise effect to color */
      if (noise > 0) {
        const hueShiftNoiseHalf = noise / 2;
        const noised = PollenMath.randomBetween(hueShiftNoiseHalf, hueShiftNoiseHalf * -1, true);
        hueRotate += noised;
      }
      /* Turn sepia. Beware that the brightness of the original color/image remains expressed in this sepia color. the saturation is entirely lost.*/
      this.helperStringCSS = "grayscale(100%) sepia(100%) "
      const hsb = color.getHSB();
      this.hueRotate = this.getHueShiftForColorTargetFromSepia(hsb, this.initHueRotate(hueRotate), this.color);
      this.saturation = saturation > -1 ? this.initSaturation(saturation) : hsb[1];
      this.brightness = brightness > -1 ? this.initBrightness(brightness) : hsb[2];
    } else {
      /* Noise effect to hueRotate */
      if (noise > 0) {
        this.hueRotate = PollenMath.relativeMap(this.initHueRotate(hueRotate), noise, Math.random());
      }else{
        this.hueRotate = this.initHueRotate(hueRotate);
      }
      this.saturation = this.initSaturation(saturation);
      this.brightness = this.initBrightness(brightness);
    }
  }

  initHueRotate(hueRotate){
    return hueRotate 
  }

  initBrightness(brightness) {
    return brightness < 0 ? 100 : this.adjustFilter(brightness, 0, 1000);
  }

  initSaturation(saturation) {
    return saturation < 0 ? 1 : this.adjustFilter(saturation, 0, 100);
  }

  initContrast(contrast) {
    return contrast < 0 ? 1 : this.adjustFilter(contrast, 0, 100)
  }

  adjustFilter(value, min, max) {
    return Math.max(min, Math.min(max, value))
  }


  getCSS() {
   // console.log(`filter: ${this.helperStringCSS} saturate(${this.saturation}) contrast(${this.contrast}) brightness(${this.brightness}%) hue-rotate(${this.hueRotate}deg);`)
    return `filter: ${this.helperStringCSS} saturate(${this.saturation}) contrast(${this.contrast}) brightness(${this.brightness}%) hue-rotate(${this.hueRotate}deg);`

  }


  static createDefault() {
    return new ParticleColorfilterData(-1, new Color(ColorUtil.debugColor), -1, -1, -1)
  }


  /**
   * Sets the hue-rotation to the required value for sepia to be rotated towards the provided color.
   */
  getHueShiftForColorTargetFromSepia(hsb = null, offset = 0, colorTarget = this.color) {
    hsb = hsb == null? colorTarget.getHSB() : hsb;
    return hsb[0] - Color.SEPIA_HUE + offset;
  }



  reset() {
    if (this.color != null) {
      if (this.noise > 0) {
        const hueShiftNoiseHalf = this.noise / 2;
        const noised = PollenMath.randomBetween(hueShiftNoiseHalf, hueShiftNoiseHalf * -1, true);
        this.hueRotate += noised;
      }
      const hsb = this.color.getHSB();
      this.hueRotate = this.getHueShiftForColorTargetFromSepia(hsb, this.initHueRotate(this.initialHueRotate), this.color);
      this.saturation = this.initialSaturation > -1 ? this.initSaturation(this.initialSaturation) : hsb[1];
      this.brightness = this.initialBrightness > -1 ? this.initBrightness(this.initialBrightness) : hsb[2];
    } else {
      if (this.noise > 0) {
        this.hueRotate = PollenMath.relativeMap(this.initHueRotate(this.initialHueRotate), this.noise, Math.random());
      }else{
        this.hueRotate = this.initHueRotate(this.initialHueRotate);
      }
      this.saturation = this.initSaturation(this.initialSaturation);
      this.brightness = this.initBrightness(this.initialBrightness);
    }
   }

  createNew(copy) {
    if (copy) {
      return this;
    }
    return new ParticleColorfilterData(this.initialHueRotate, Color.copy(this.color), this.noise, this.contrast, this.saturation, this.brightness)
  }

  get color() {
    return this._color
  }
  set color(value) {
    this._color = value
  }
  get noise() {
    return this._noise
  }
  set noise(value) {
    this._noise = value
  }
  get hueRotate() {
    return this._hueRotate
  }
  set hueRotate(value) {
    this._hueRotate = value
  }
  get initialSaturation() {
    return this._initialSaturation
  }
  set initialSaturation(value) {
    this._initialSaturation = value
  }
  get helperStringCSS() {
    return this._helperStringCSS
  }
  set helperStringCSS(value) {
    this._helperStringCSS = value
  }
  get saturation() {
    return this._saturation
  }
  set saturation(value) {
    this._saturation = value
  }
  get contrast() {
    return this._contrast
  }
  set contrast(value) {
    this._contrast = value
  }
  get brightness() {
    return this._brightness
  }
  set brightness(value) {
    this._brightness = value
  }

  get initialBrightness() {
    return this._initialBrightness
  }
  set initialBrightness(value) {
    this._initialBrightness = value
  }

  get initialContrast() {
    return this._initialHueRotate
  }
  set initialContrast(value) {
    this._initialContrast = value
  }
}

