class RectangularEmitterOrigin extends EmitterOrigin {
  /* FIELDS */
  width;
  height;



  /* CONSTRUCTOR */
  constructor(posX, posY, width, height) {
    super(posX, posY);
    this.width = width;
    this.height = height;
  }



  /* FLUENT */
  build() {
    super.build();
    return this;
  }



  /* METHODS */
  generateParticleSpawnPosition() {
    const x = Math.random() * this.width + this.posX - this.width / 2;
    const y = Math.random() * this.height + this.posY - this.height / 2;
    return [x, y];
  }
}
