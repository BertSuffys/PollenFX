class CircularEmitterOrigin extends EmitterOrigin {
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



  /* METHOD */
  generateParticleSpawnPosition() {
    const randomScalar = Math.random();
    const randomAngle = Math.random() * (2 * Math.PI);
    const x = Math.cos(randomAngle) * (randomScalar * (this.width / 2)) + this.posX;
    const y = Math.sin(randomAngle) * (randomScalar * (this.height / 2)) + this.posY;
    return [x, y];
  }


}
