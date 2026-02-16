class PointEmitterOrigin extends EmitterOrigin {
  /* FIELDS */

  /* CONSTRUCTOR */
  constructor(posX, posY) {
    super(posX, posY);
  }

  /* FLUENT */
  build() {
    super.build();
    return this;
  }

  /* METHODS */
  generateParticleSpawnPosition() {
    return [this.posX, this.posY];
  }
}
