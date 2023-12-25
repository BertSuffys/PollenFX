
class ParticleColorfilterData extends ParticleData {
    constructor( hueRotate = 0, color = null, noise = 0, contrast = -1, saturation = -1, brightness = -1 ) {
      super("colorfilter")
      this.noise = noise
      this.helperStringCSS = ""
      this.hueRotate = hueRotate
      this.color = color
      this.contrast = contrast < 0 ? 1 : this.adjustFilter(contrast, 0, 100)
      this.saturation = saturation < 0 ? 1 : this.adjustFilter(saturation, 0, 100)
      this.brightness =  brightness < 0 ? 100 : this.adjustFilter(brightness, 0, 1000)
  
  
      if (color != null) {
        if (noise > 0) {
          const hueShiftNoiseHalf = noise / 2;
          noise = PollenMath.randomBetween(hueShiftNoiseHalf, hueShiftNoiseHalf * -1, true);
          color.hueShift(noise);
        }
        this.helperStringCSS = "grayscale(100%) sepia(100%) "
        this.calculateHueShiftForColorTargetFromSepia(color)
        if (saturation < 0) {
          this.saturation = 45
        }
      } else {
        if (noise > 0) {
          this.hueRotate = PollenMath.relativeMap(
            this.hueRotate,
            1 + noise,
            Math.random()
          )
        }
      }
    }
  
  
    adjustFilter(value, min, max) {
      return Math.max(min, Math.min(max, value))
    }
  
  
    getCSS() {
      return `filter: ${this.helperStringCSS} saturate(${this.saturation}) contrast(${this.contrast}) brightness(${this.brightness}%) hue-rotate(${this.hueRotate}deg);`
    }
  
  
    static createDefault() {
      return new ParticleColorfilterData(0, new Color(ColorUtil.debugColor), -1, -1, -1)
    }
  
  
    calculateHueShiftForColorTargetFromSepia(
      colorTarget = this.color,
      colorFrom = ColorUtil.getSepia()
    ) {
      const startHSB = 32
      const endHSB = ColorUtil.RGBtoHSV(
        colorTarget.r,
        colorTarget.g,
        colorTarget.b,
        true
      )
  
      let deltaHue = PollenMath.modulo(endHSB[0] * 100 - startHSB, 360)
  
      const deltaSaturation = endHSB[1] - startHSB
      const deltaBrightness = endHSB[2] - startHSB
  
      const colorTransform = `hue-rotate(${deltaHue}deg) saturate(${deltaSaturation}%) brightness(${deltaBrightness}%)`
  
      this.hueRotate = deltaHue
    }
  
    reset() { }
  
    createNew(copy) {
      if (copy) {
        return this
      }
      return new ParticleColorfilterData(
        this.hueRotate,
        Color.copy(this.color),
        this.noise,
        this.contrast,
        this.saturation,
        this.brightness
      )
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
  }
  
  