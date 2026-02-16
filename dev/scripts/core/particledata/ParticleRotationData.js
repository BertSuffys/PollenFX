class ParticleRotationData extends ParticleData {
  /* FIELDS */
  initialRotation;
  rotation;
  coneNoise;


  /* FIELDS */
  constructor(rotation, coneNoise = -1) {
    super("rotation");
    this.initialRotation = rotation;
    this.coneNoise = coneNoise;
  }


  /* FLUENT */
  build() {
    this.rotation = this.coneNoise >= 0 ? this.initialRotation + (Math.random() * this.coneNoise - this.coneNoise / 2) : this.initialRotation;
    return this;
  }

  /* METHODS */
  getCSS() {
    return `transform: rotate(${this.rotation}deg);`;
  }

  reset() {
    return this;
  }

  createNew(copy) {
    if (copy) {
      return this;
    }
    return new ParticleRotationData(this.initialRotation, this.coneNoise);
  }

  static createDefault() {
    return new ParticleRotationData(0);
  }

}
