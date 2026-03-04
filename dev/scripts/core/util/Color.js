class Color {
  // RGB (0–255)
  r = 0;
  g = 0;
  b = 0;

  // Normalized RGB (0–1)
  r_norm = 0;
  g_norm = 0;
  b_norm = 0;

  // HSB
  hue = 0;         // 0–360
  saturation = 0; // 0–100
  brightness = 0; // 0–100

  // Alpha
  opacity = 1;    // 0–1

  hex = "#000000";

  static HEX_LENGTH = 7;
  static SEPIA_HUE = 38;

  /* -------------------------------------------------------------------------- */
  /*  Construction                                                              */
  /* -------------------------------------------------------------------------- */

  constructor(...args) {
    if (args.length === 3) {
      this.setRGB(args[0], args[1], args[2]);
    } else {
      this.hex = this.validateAndCorrectHexInput(args[0]);
      this.rgbFromHex();
    }
    this.updateDerivedValues();
  }

  static copy(color) {
    if (!color) return null;
    const c = new Color(color.r, color.g, color.b);
    c.opacity = color.opacity;
    return c;
  }

  /* -------------------------------------------------------------------------- */
  /*  Core Setters                                                               */
  /* -------------------------------------------------------------------------- */

  setRGB(r, g, b) {
    this.r = Color.clamp255(r);
    this.g = Color.clamp255(g);
    this.b = Color.clamp255(b);
    this.updateDerivedValues();
    return this;
  }

  setOpacity(value) {
    this.opacity = Color.clamp01(value);
    return this;
  }

  multiplyOpacity(factor) {
    this.opacity = Color.clamp01(this.opacity * factor);
    return this;
  }

  hueShift(degrees) {
    const hsv = ColorUtil.RGBtoHSV(this.r, this.g, this.b);
    hsv[0] = PollenMath.modulo(hsv[0] + degrees / 360, 1);
    const rgb = ColorUtil.HSVtoRGB(hsv[0], hsv[1], hsv[2]);
    this.setRGB(rgb[0], rgb[1], rgb[2]);
    return this;
  }

  /* -------------------------------------------------------------------------- */
  /*  Derived Value Updates                                                      */
  /* -------------------------------------------------------------------------- */

  updateDerivedValues() {
    this.r_norm = this.r / 255;
    this.g_norm = this.g / 255;
    this.b_norm = this.b / 255;
    this.hexFromRGB();
    this.updateHSB();
  }

  updateHSB() {
    const max = Math.max(this.r_norm, this.g_norm, this.b_norm);
    const min = Math.min(this.r_norm, this.g_norm, this.b_norm);
    const delta = max - min;

    this.brightness = Math.round(max * 100);

    if (delta === 0) {
      this.hue = 0;
      this.saturation = 0;
      return;
    }

    this.saturation = Math.round((delta / max) * 100);

    let hue;
    if (max === this.r_norm) {
      hue = ((this.g_norm - this.b_norm) / delta) % 6;
    } else if (max === this.g_norm) {
      hue = (this.b_norm - this.r_norm) / delta + 2;
    } else {
      hue = (this.r_norm - this.g_norm) / delta + 4;
    }

    this.hue = Math.round((hue * 60 + 360) % 360);
  }

  getHSB(){
    return [this.hue, this.saturation, this.brightness]
  }

  /* -------------------------------------------------------------------------- */
  /*  Hex / String Output                                                        */
  /* -------------------------------------------------------------------------- */

  hexFromRGB() {
    this.hex =
      "#" +
      this.r.toString(16).padStart(2, "0") +
      this.g.toString(16).padStart(2, "0") +
      this.b.toString(16).padStart(2, "0");
  }

  rgbFromHex() {
    this.r = parseInt(this.hex.slice(1, 3), 16);
    this.g = parseInt(this.hex.slice(3, 5), 16);
    this.b = parseInt(this.hex.slice(5, 7), 16);
  }

  toRgba(opacityOverride = null) {
    const a = opacityOverride !== null
      ? Color.clamp01(opacityOverride)
      : this.opacity;

    return `rgba(${this.r}, ${this.g}, ${this.b}, ${a})`;
  }

  /* -------------------------------------------------------------------------- */
  /*  Randomization                                                             */
  /* -------------------------------------------------------------------------- */

  static randomColor(saturation = 100, opacity = 1) {
    saturation = Color.clamp100(saturation);
    opacity = Color.clamp01(opacity);

    const hue = Math.random();
    const rgb = ColorUtil.HSVtoRGB(hue, saturation / 100, 1);

    const c = new Color(rgb[0], rgb[1], rgb[2]);
    c.opacity = opacity;
    return c;
  }

  /* -------------------------------------------------------------------------- */
  /*  Validation & Helpers                                                       */
  /* -------------------------------------------------------------------------- */

  validateAndCorrectHexInput(hex) {
    if (!FXUtil.valid(hex)) hex = ColorUtil.debugColor;
    if (!hex.startsWith("#")) hex = "#" + hex;

    hex = hex.slice(0, Color.HEX_LENGTH).padEnd(Color.HEX_LENGTH, "F");

    return "#" + hex
      .slice(1)
      .replace(/[^0-9a-fA-F]/g, "F");
  }

  static clamp01(v) {
    return Math.max(0, Math.min(1, v));
  }

  static clamp100(v) {
    return Math.max(0, Math.min(100, v));
  }

  static clamp255(v) {
    return Math.max(0, Math.min(255, v));
  }
}
