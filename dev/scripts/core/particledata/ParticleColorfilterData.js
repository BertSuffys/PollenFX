class ParticleColorfilterData extends ParticleData {
  /* FIELDS */

  // CSS helper (sepia / grayscale prefix)
  helperStringCSS = "";
  // Target color
  color = null;
  // hue
  hueRotate = 0;
  initialHueRotate = 0;
  // saturation
  saturation = 1;
  initialSaturation = -1;
  // brightness
  brightness = 100;
  initialBrightness = -1;
  // contrast
  contrast = 1;
  initialContrast = -1;
  // noise (applied to hue)
  noise = -1;

  /* CONSTRUCTOR */
  constructor() {
    super("colorfilter");
  }

  /* FLUENT */
  withColor(color) {
    this.color = color;
    return this;
  }

  withHue(hueRotate, noise = -1) {
    this.initialHueRotate = hueRotate;
    this.noise = noise;
    return this;
  }

  withSaturation(saturation) {
    this.initialSaturation = saturation;
    return this;
  }

  clampSaturation(saturation) {
    return saturation < 0 ? 0 : Math.max(0, Math.min(100, saturation));
  }

  withBrightness(brightness) {
    this.initialBrightness = brightness;
    return this;
  }

  clampBrightness(brightness) {
    return brightness < 0 ? 0 : Math.max(0, Math.min(1000, brightness));
  }

  withContrast(contrast) {
    this.initialContrast = contrast;
    return this;
  }

  clampContrast(contrast) {
    return contrast < 0 ? 0 : Math.max(0, Math.min(100, contrast));
  }

  build() {
    this.calculateValues();
    return this;
  }

  reset() {
    this.calculateValues();
    return this;
  }

  /* METHODS */
  calculateValues() {
    this.helperStringCSS = "";
    if (this.color != null) {
      this.helperStringCSS = "grayscale(100%) sepia(100%)";
      const hsb = new Color(this.color).getHSB();
      const backupHueRotate = this.getHueRotateDelta();
      this.hueRotate = this.getHueShiftForColorTargetFromSepia(hsb, this.initialHueRotate) + backupHueRotate;
      this.saturation = this.initialSaturation > -1 ? this.clampSaturation(this.initialSaturation) : hsb[1];
      this.brightness = this.initialBrightness > -1 ? this.clampBrightness(this.initialBrightness) : hsb[2];
      this.contrast = this.initialContrast > -1 ? this.clampContrast(this.initialContrast) : this.contrast;
    } else {
      this.saturation = this.initialSaturation > -1 ? this.clampSaturation(this.initialSaturation) : this.saturation;
      this.brightness = this.initialBrightness > -1 ? this.clampBrightness(this.initialBrightness) : this.brightness;
      this.contrast = this.initialContrast > -1 ? this.clampContrast(this.initialContrast) : this.contrast;
      this.hueRotate = this.getHueRotateDelta();
    }
  }

  getHueRotateDelta() {
    if (this.noise > 0) {
      const half = this.noise / 2;
      const delta = PollenMath.randomBetween(-half, half, true);
      return this.initialHueRotate + delta;
    }
    return this.initialHueRotate;
  }

  getCSS() {
    return `filter: ${this.helperStringCSS} saturate(${this.saturation}) contrast(${this.contrast}) brightness(${this.brightness}%) hue-rotate(${this.hueRotate}deg);`;
  }

  getHueShiftForColorTargetFromSepia(hsb, offset = 0) {
    return hsb[0] - Color.SEPIA_HUE + offset;
  }

  createNew() {
    return new ParticleColorfilterData()
      .withColor(this.color)
      .withHue(this.initialHueRotate, this.noise)
      .withSaturation(this.initialSaturation)
      .withBrightness(this.initialBrightness)
      .withContrast(this.initialContrast);
  }

  static createDefault() {
    return new ParticleColorfilterData();
  }
}
