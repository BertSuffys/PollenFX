

class Color {

    /* RGB & normalised-RGB */
  _r;
  _g;
  _b;
  _r_norm;
  _g_norm;
  _b_norm;
  /* HSB */
  _hue;
  _brightness;
  _saturation;

  static HEX_LENGTH = 7
  static SEPIA_HUE = 38; // estimate for the hue level of sepia(100%);

  constructor(...args) {
    if (args.length == 3) {
      this.r = Math.max(0, Math.min(255, args[0]));
      this.g = Math.max(0, Math.min(255, args[1]));
      this.b = Math.max(0, Math.min(255, args[2]));
      this.r_norm = this.r/255;
      this.g_norm = this.g/255;
      this.b_norm = this.b/255;
      this.hexFromRGB()
    } else {
      this.hex = this.validateAndCorrectHexInput(args[0])
      this.rgbFromHex()
    }
    this.setHLS();
  }


  static copy(color) {
    if (color != null) {
      return new Color(color.r, color.g, color.b)
    }
    return null
  }

  hexFromRGB() {
    let hex = "#"
    hex += this.r.toString(16).length < 2 ? "0" + this.r.toString(16) : this.r.toString(16)
    hex += this.g.toString(16).length < 2 ? "0" + this.g.toString(16) : this.g.toString(16)
    hex += this.b.toString(16).length < 2 ? "0" + this.b.toString(16) : this.b.toString(16)
    this.hex = hex
  }


  rgbFromHex() {
    this.r = parseInt(this.hex.substring(1, 3), 16)
    this.g = parseInt(this.hex.substring(3, 5), 16)
    this.b = parseInt(this.hex.substring(5, 7), 16)
    this.r_norm = this.r/255;
    this.g_norm = this.g/255;
    this.b_norm = this.b/255;
  }

  setHLS(){
    const hls = this.getHSB()
    this.hue = hls[0]
    this.saturation = hls[1]
    this.brightness = hls[2]
  }


  hueShift(hueShift) {
    let hsv = ColorUtil.RGBtoHSV(this.r, this.g, this.b)
    hsv[0] = PollenMath.modulo(hsv[0] + hueShift, 1)
    let rgb = ColorUtil.HSVtoRGB(hsv[0], hsv[1], hsv[2])
    this.r = rgb[0]
    this.g = rgb[1]
    this.b = rgb[2]
    this.hexFromRGB()
  }




  /**
   * Initializes the color using r,g, and b values
   */
  setRGB(r, g, b) {
    this.r = r
    this.g = g
    this.b = b
    this.hexFromRGB()
  }

  /**
   * Returns the HLS value for this color.
   */
  getHSB() {
    // Find the maximum and minimum values among the RGB components
    const max = Math.max(this.r_norm, this.g_norm, this.b_norm);
    const min = Math.min(this.r_norm, this.g_norm, this.b_norm);

    // Calculate the brightness (B)
    const brightness = max;

    // If the max and min are equal, the color is a shade of gray (saturation is 0)
    if (max === min) {
        return [0, 0, Math.round(brightness * 100)];
    }

    // Calculate the saturation (S)
    const delta = max - min;
    const saturation = delta / max;

    // Calculate the hue (H)
    let hue;
    if (max === this.r_norm) {
        hue = ((this.g_norm - this.b_norm) / delta + 6) % 6;
    } else if (max === this.g_norm) {
        hue = (this.b_norm - this.r_norm) / delta + 2;
    } else {
        hue = (this.r_norm - this.g_norm) / delta + 4;
    }

    // Convert hue to degrees
    hue *= 60;


    return [Math.round(hue), Math.round(saturation * 100), Math.round(brightness * 100)];
  }



    /**
   * Helpermethod correcting provided color input
   */
    validateAndCorrectHexInput(hexColor) {
      if (!valid(hexColor)) {
        hexColor = ColorUtil.debugColor
      }
      if (!hexColor.startsWith("#")) {
        hexColor = "#".concat(hexColor)
      }
      for (let i = 1; i < hexColor.length; i++) {
        if (!/^[0-9a-fA-F]+$/.test(hexColor[i])) {
          hexColor = hexColor.substring(0, i) + "F" + hexColor.substring(i + 1)
        }
      }
      if (hexColor.length != Color.HEX_LENGTH) {
        if (hexColor.length > Color.HEX_LENGTH) {
          hexColor = hexColor.substring(0, Color.HEX_LENGTH)
        } else {
          const missingCharacterCount = Color.HEX_LENGTH - hexColor.length
          for (let i = 0; missingCharacterCount; i++) {
            hexColor = hexColor + "F"
          }
        }
      }
      return hexColor
    }
  




  // HSB
  get hue() {
    return this._hue
  }
  set hue(value) {
    this._hue = Math.max(0, Math.min(100, value))
  }
  get saturation() {
    return this._saturation
  }
  set saturation(value) {
    this._saturation = Math.max(0, Math.min(255, value))
  }
  get brightness() {
    return this._brightness
  }
  set brightness(value) {
    this._brightness = Math.max(0, Math.min(100, value))
  }

  // RGB
  get r() {
    return this._r
  }
  set r(value) {
    this._r = Math.max(0, Math.min(255, value))
  }
  get g() {
    return this._g
  }
  set g(value) {
    this._g = Math.max(0, Math.min(255, value))
  }
  get b() {
    return this._b
  }
  set b(value) {
    this._b = Math.max(0, Math.min(255, value))
  }


  // RGB Normalized
  get r_norm(){
    return this._r_norm
  }
  set r_norm(value) {
    this._r_norm = Math.max(0, Math.min(255, value))
  }
  get g_norm() {
    return this._g_norm
  }
  set g_norm(value) {
    this._g_norm = Math.max(0, Math.min(255, value))
  }
  get b_norm() {
    return this._b_norm
  }
  set b_norm(value) {
    this._b_norm = Math.max(0, Math.min(255, value))
  }



  get hex() {
    return this._hex
  }
  set hex(value) {
    this._hex = value
  }
}
