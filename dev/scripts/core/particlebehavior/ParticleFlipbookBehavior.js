class ParticleFlipbookBehavior extends ParticleBehavior {
  /* FIELDS */
  flipCount;
  initialSpeed;
  speedNoise = -1;
  timeSinceLastFrameshift;
  flipbookData;
  speed;
  defaultData;
  endingFrameCount = -1;

  

  /* CONSTRUCTOR */
  constructor(speed) {
    super("flipbook");
    this.initialSpeed = speed;
  }



  /* FLUENT */
  build(particleDataManager, particleBehaviorManager) {
    // core properties
    this.flipCount = 0;
    this.timeSinceLastFrameshift = 0;
    this.speed = this.speedNoise > 0 ? PollenMath.relativeMap(this.initialSpeed, 1 + this.speedNoise, Math.random()) : this.initialSpeed;
    // ensure dependencies
    this.flipbookData = particleDataManager.ensureData("flipbook");
    this.defaultData = particleDataManager.ensureData("default");
    this.flipbookData.particleWidth = this.defaultData.width;
    this.flipbookData.particleHeight = this.defaultData.height;
    this.flipbookData.imageFitting = ImageFitting.CONTAIN;
    return this;
  }

  reset() {
    this.flipCount = 0;
    this.timeSinceLastFrameshift = 0;
    if (this.speedNoise > 0) {
      this.speed = PollenMath.relativeMap(this.initialSpeed, 1 + this.speedNoise, Math.random());
    } else {
      this.speed = this.initialSpeed;
    }
    return this;
  }

  withEndingFrame(endingFrameCount) {
    this.endingFrameCount = endingFrameCount < 0 ? Number.MAX_VALUE : endingFrameCount;
    return this;
  }

  withNoise(speedNoise) {
    this.speedNoise = speedNoise;
    return this;
  }
  
  /* METHODS */
  act(particle, startTimeMs, deltaTime, deltaTimeSeconds) {
    // keep size synced
    this.flipbookData.particleWidth = this.defaultData.width;
    this.flipbookData.particleHeight = this.defaultData.height;

    // accumulate time in seconds
    this.timeSinceLastFrameshift += deltaTimeSeconds;

    // how many frames should we advance?
    const framesToAdvance = Math.floor(this.timeSinceLastFrameshift * this.speed);

    if (framesToAdvance > 0) {
      this.flipbookData.currentFrameIndex =
        (this.flipbookData.currentFrameIndex + framesToAdvance) %
        this.flipbookData.frameCount;

      // remove consumed time
      this.timeSinceLastFrameshift -= framesToAdvance / this.speed;

      this.checkBehaviorDeath(framesToAdvance, particle);
    }
  }

  checkBehaviorDeath(imageShift, particle) {
    this.flipCount += imageShift;
    if (this.flipCount + 1 > this.endingFrameCount) {
      this.speed = Number.MAX_VALUE;
    }
  }

  createNewBehavior(copy) {
    if (copy) {
      return this;
    }
    return new ParticleFlipbookBehavior(this.initialSpeed).withNoise(this.speedNoise).withEndingFrame(this.endingFrameCount);
  }

  applyParticle(particle) {}

  static createDefault() {
    return new ParticleFlipbookBehavior(30).withNoise(-1).withEndingFrame(-1);
  }
}
