

class Color {
    static HEX_LENGTH = 7
    constructor(...args) {
      if (args.length == 3) {
        this.r = Math.max(0, Math.min(255, args[0]))
        this.g = Math.max(0, Math.min(255, args[1]))
        this.b = Math.max(0, Math.min(255, args[2]))
        this.hexFromRGB()
      } else {
        this.hex = this.validateAndCorrectHexInput(args[0])
        this.rgbFromHex()
      }
    }
  
  
    static copy(color) {
      if (color != null) {
        let copy = new Color(color.r, color.g, color.b)
        return copy
      }
      return null
    }
  
    hexFromRGB() {
      let hex = "#"
      hex +=
        this.r.toString(16).length < 2
          ? "0" + this.r.toString(16)
          : this.r.toString(16)
      hex +=
        this.g.toString(16).length < 2
          ? "0" + this.g.toString(16)
          : this.g.toString(16)
      hex +=
        this.b.toString(16).length < 2
          ? "0" + this.b.toString(16)
          : this.b.toString(16)
      this.hex = hex
    }
  
  
    rgbFromHex() {
      this.r = parseInt(this.hex.substring(1, 3), 16)
      this.g = parseInt(this.hex.substring(3, 5), 16)
      this.b = parseInt(this.hex.substring(5, 7), 16)
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
  
  
    setRGB(r, g, b) {
      this.r = r
      this.g = g
      this.b = b
      this.hexFromRGB()
    }
  
  
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
  
    get hex() {
      return this._hex
    }
    set hex(value) {
      this._hex = value
    }
  }
  