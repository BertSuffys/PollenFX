class ParticleRotationData extends ParticleData {
  /* FIELDS */
  initialRotation;
  rotation;
  coneNoise;
  mirrorX = false;
  mirrorY = false;
  mirrorXScale = 1;
  mirrorYScale = 1;


  /* FIELDS */
  constructor(rotation, coneNoise = -1) {
    super("rotation");
    this.initialRotation = rotation;
    this.coneNoise = coneNoise;
  }


  /* FLUENT */
  build() {
    this.rotation = this.coneNoise >= 0 ? this.initialRotation + (Math.random() * this.coneNoise - this.coneNoise / 2) : this.initialRotation;
    this.mirrorXScale *= this.mirrorX ? PollenMath.randomSign() : 1;
    this.mirrorYScale *= this.mirrorY ? PollenMath.randomSign() : 1;
    return this;
  }

  withAllowMirrored(mirrorX, mirrorY = false) {
    this.mirrorX = mirrorX;
    this.mirrorY = mirrorY;
    return this;
  }

  /* METHODS */
  getCSS() {
    return `transform: rotate(${this.rotation}deg) scale(${this.mirrorXScale}, ${this.mirrorYScale});`;
  }

  reset() {
    return this;
  }

  createNew(copy) {
    if (copy) {
      return this;
    }
    return new ParticleRotationData(this.initialRotation, this.coneNoise)
          .withAllowMirrored(this.mirrorX, this.mirrorY);
  }

  static createDefault() {
    return new ParticleRotationData(0);
  }

}
