class ParticleOpacityData extends ParticleData {
  /* FLUENT */
  opacity;
  opacityNoise;

  /* CONSTRUCTOR */
  constructor(opacity = 1, opacityNoise = -1) {
    super("opacity");
    this.initialOpacity = opacity;
    this.opacityNoise = opacityNoise;
    this.opacity = opacityNoise > 0 ? Math.min(1, Math.max(0, PollenMath.relativeMap(opacity, 1 + opacityNoise, Math.random()))) : opacity;
  }

  /* FLUENT */
  build() {
    return this;
  }
  
  /* METHODS */
  getCSS() {
    return `opacity: ${this.opacity};`;
  }

  reset() {}

  createNew(copy) {
    if (copy) {
      return this;
    }
    return new ParticleOpacityData(this.initialOpacity, this.opacityNoise);
  }

  static createDefault() {
    return new ParticleOpacityData(1);
  }
}
