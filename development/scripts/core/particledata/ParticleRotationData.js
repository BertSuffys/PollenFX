class ParticleRotationData extends ParticleData {
  /* FIELDS */
  rotation;
  coneNoise;


  /* FIELDS */
  constructor(rotation, coneNoise = -1) {
    super("rotation");
    this.rotation = coneNoise >= 0 ? rotation + (Math.random() * coneNoise - coneNoise / 2) : rotation;
    this.coneNoise = coneNoise;
  }


  /* FLUENT */
  build() {
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
    return new ParticleRotationData(this.rotation, this.coneNoise);
  }

  static createDefault() {
    return new ParticleRotationData(0);
  }

}
