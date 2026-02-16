class LineEmitterOrigin extends EmitterOrigin {
  /* FIELDS */
  posX_2;                 // x position of the second point defining the line
  posY_2;                 // y position of the second point defining the line
  originalPosX_2;         // x position of the second point defining the line
  originalPosY_2;         // y position of the second point defining the line
  offset;                 // thickness of the line emitter



  /* CONSTRUCTOR */
  constructor(posX, posY, posX_2, posY_2, offset = -1) {
    super(posX, posY);
    this.originalPosX_2 = posX_2;
    this.originalPosY_2 = posY_2;
    this.offset = Math.max(0, offset);
  }



  /* FLUENT */
  build() {
    super.build();
    this.initializePosition_2();
    return this;
  }



  /* METHODS */
  generateParticleSpawnPosition() {
    const progress = Math.random();
    let x = PollenMath.lerp(this.posX_2, this.posX, progress);
    let y = PollenMath.lerp(this.posY_2, this.posY, progress);
    if (this.offset > 0) {
      const rico = this.getDirectionCoefficient(this.posX, this.posX_2, this.posY, this.posY_2);
      const inverseRico = -1 / rico;

      if (inverseRico == -Infinity) {
        y += Math.random() * this.offset - this.offset / 2;
      } else {
        const randOffsetAbs = Math.random() * this.offset;

        let xOffset = Math.sqrt(Math.abs(Math.pow(randOffsetAbs, 2) / (1 + Math.pow(inverseRico, 2))));
        let yOffset = xOffset * inverseRico;

        let randomMultiplier = Math.random() > 0.5 ? 1 : -1;

        xOffset = (xOffset / 2) * randomMultiplier;
        yOffset = (yOffset / 2) * randomMultiplier;

        x += xOffset;
        y += yOffset;
      }
    }
    return [x, y];
  }

  initializePosition_2() {
    if (this.posXNoise <= 0) {
      this.posX_2 = this.originalPosX_2;
    } else {
      this.posX_2 = this.originalPosX_2 + (this.posXNoise / -2 + this.posXNoise * Math.random());
    }
    if (this.posYNoise <= 0) {
      this.posY_2 = this.originalPosY_2;
    } else {
      this.posY_2 = this.originalPosY_2 + (this.posYNoise / -2 + this.posYNoise * Math.random());
    }
  }

  getDirectionCoefficient(x1, x2, y1, y2) {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    return deltaY == 0 ? 0 : deltaY / deltaX;
  }
}
