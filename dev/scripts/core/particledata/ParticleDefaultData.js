class ParticleDefaultData extends ParticleData {
  /* FIELDS */
  posX;
  posY;
  emitterOrigin; // provided in emitters build method.
  width;
  height;
  initialWidth;
  initialHeight;
  horizontalPivot = Pivot.CENTER;
  verticalPivot = Pivot.CENTER;
  noiseWidth = -1;
  noiseHeight = -1;
  uniformSizeWidth = false;
  particleBoxClass = null;
  mirrorX = false;
  mirrorY = false;
  mirrorXScale = 1;
  mirrorYScale = 1;

  /* CONSTRUCTOR */
  constructor(width, height) {
    super("default");
    this.initialWidth = width != null ? width : 10;
    this.initialHeight = height != null ? height : 10;
  }

  /* FLUENT */
  build() {
    const position = this.emitterOrigin.generateParticleSpawnPosition();
    this.posX = position[0];
    this.posY = position[1];
    this.initSizes(this.noiseWidth, this.noiseHeight, this.uniformSizeWidth, this.initialWidth, this.initialHeight);
    return this;
  }

  sizeNoise(noiseWidth = -1, noiseHeight = -1, uniformSizeWidth = false) {
    this.noiseWidth = noiseWidth;
    this.noiseHeight = noiseHeight;
    this.uniformSizeWidth = uniformSizeWidth;
    return this;
  }

  pivot(horizontalPivot, verticalPivot) {
    this.horizontalPivot = horizontalPivot;
    this.verticalPivot = verticalPivot;
    return this;
  }

  withClass(particleBoxClass) {
    this.particleBoxClass = particleBoxClass;
    return this;
  }

  withAllowMirrored(mirrorX, mirrorY = false) {
    this.mirrorX = mirrorX;
    this.mirrorY = mirrorY;
    return this;
  }

  /* METHODS */
  reset() {
    const position = this.emitterOrigin.generateParticleSpawnPosition();
    this.posX = position[0];
    this.posY = position[1];
  }

  getCSS() {
    return `top: ${this.posY - this.height * this.verticalPivot}px;
            left: ${this.posX - this.width * this.horizontalPivot}px;
            width: ${this.width}px;
            height: ${this.height}px;
            will-change : transform;
            transform: scale(${this.mirrorXScale}, ${this.mirrorYScale});`;
  }

  static createDefault() {
    return new ParticleDefaultData(10, 10, new PointEmitterOrigin(0, 0));
  }

  createNew(copy) {
    if (copy) {
      return this;
    }
    return new ParticleDefaultData(this.initialWidth, this.initialHeight)
      .sizeNoise(this.noiseWidth, this.noiseHeight, this.uniformSizeWidth)
      .pivot(this.horizontalPivot, this.verticalPivot)
      .setEmitterOrigin(this.emitterOrigin)
      .withClass(this.particleBoxClass)
      .withAllowMirrored(this.mirrorX, this.mirrorY);
  }

  initSizes(noiseWidth, noiseHeight, uniformSizeWidth, width, height) {
    if (noiseWidth > 0 || noiseHeight > 0) {
      let random = Math.random();
      if (noiseWidth >= 0 && noiseHeight >= 0) {
        this.width = PollenMath.relativeMap(this.initialWidth, 1 + Math.max(noiseWidth, 0), random);
        if (uniformSizeWidth) {
          this.height = PollenMath.relativeMap(this.initialHeight, 1 + Math.max(noiseWidth, 0), random);
        } else {
          random = Math.random();
          this.height = PollenMath.relativeMap(this.initialHeight, 1 + Math.max(noiseHeight, 0), random);
        }
      } else if (noiseWidth <= 0) {
        this.height = PollenMath.relativeMap(this.initialHeight, 1 + Math.max(noiseHeight, 0), random);
        if (uniformSizeWidth) {
          this.width = PollenMath.relativeMap(this.initialWidth, 1 + Math.max(noiseHeight, 0), random);
        } else {
          this.width = width;
        }
      } else if (noiseHeight <= 0) {
        this.width = PollenMath.relativeMap(this.initialWidth, 1 + Math.max(noiseWidth, 0), random);
        if (uniformSizeWidth) {
          this.height = PollenMath.relativeMap(this.initialHeight, 1 + Math.max(noiseWidth, 0), random);
        } else {
          this.height = height;
        }
      }
    } else {
      this.height = height;
      this.width = width;
    }
    // optional mirroring
    this.mirrorXScale *= this.mirrorX ? PollenMath.randomSign() : 1;
    this.mirrorYScale *= this.mirrorY ? PollenMath.randomSign() : 1;
  }

  /* GETTERS AND SETTERS */
  setEmitterOrigin(emitterOrigin) {
    this.emitterOrigin = emitterOrigin;
    return this;
  }
}
