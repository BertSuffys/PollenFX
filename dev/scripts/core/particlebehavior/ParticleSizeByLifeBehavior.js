class ParticleSizeByLifeBehavior extends ParticleBehavior {
  /* FIELDS */
  // core
  sizeMultipliersX;
  sizeMultipliersY;
  duration = -1;
  initialDuration = -1;
  // noise
  scalarNoise = -1;
  uniformNoise = true;
  // calculated
  lastXSizeIndexSum;
  lastYSizeIndexSum;
  sizeIterationCount;
  xSizeIteration;
  ySizeIteration;
  initialSizeMultipliersX;
  initialSizeMultipliersY;
  // dependency
  particleDefaultData;
  initialWidth;
  initialHeight;

  /* CONSTRUCTOR */
  constructor(sizeMultipliersX, sizeMultipliersY) {
    super("size");
    this.initialSizeMultipliersX = sizeMultipliersX;
    this.initialSizeMultipliersY = sizeMultipliersY;
  }

  /* FLUENT */
  build(particleDataManager, particleBehaviorManager) {
    // general config
    this.setSizeMultipliers(this.initialSizeMultipliersX, this.initialSizeMultipliersY);
    this.xSizeIteration = 0;
    this.ySizeIteration = 0;
    this.lastXSizeIndexSum = Math.min(this.sizeMultipliersX.length, 1);
    this.lastYSizeIndexSum = Math.min(this.sizeMultipliersY.length, 1);
    // ensuring dependencies
    this.particleDefaultData = particleDataManager.ensureData("default");
    this.initialHeight = this.particleDefaultData.height;
    this.initialWidth = this.particleDefaultData.width;
    this.duration = this.initialDuration
    this.setInitialSizeData();
    return this;
  }

  withDuration(duration, sizeIterationCount = -1) {
    this.sizeIterationCount = sizeIterationCount < 0 ? Number.MAX_VALUE : sizeIterationCount;
    this.initialDuration = duration;
    return this;
  }

  withNoise(scalarNoise, uniformNoise = true) {
    this.scalarNoise = scalarNoise;
    this.uniformNoise = uniformNoise;
    return this;
  }

  reset(particle) {
    this.setInitialSizeData();
    this.applyParticle(particle);
    this.xSizeIteration = 0;
    this.ySizeIteration = 0;
    this.lastXSizeIndexSum = Math.min(this.sizeMultipliersX.length, 1);
    this.lastYSizeIndexSum = Math.min(this.sizeMultipliersY.length, 1);
    return this;
  }

  /* METHODS */

  /**
   * Important!
   * Consider sizeMultipliersX=[0,1], duration=1000 and sizeIterationCount=3
   * Then, it will cycle from 0 to 1 in 1000 ms, or 1 jump in 1000ms. Going back to 0 will thus also take 1000ms. G
   * Given that opacityIterationCount is 3, it will go 0-1-0, in 3000ms.
   */
  act(particle, startTimeMs, deltaTime, deltaTimeSeconds) {
    const xSteps = this.sizeMultipliersX.length;
    const xFullRangeProgress = (particle.actTime / this.duration) * Math.max(1, xSteps - 1);
    const xFromIndex = Math.trunc(xFullRangeProgress) % xSteps;
    const xToIndex = (xFromIndex + 1) % xSteps;
    const xLocalProgress = xFullRangeProgress % 1;

    const ySteps = this.sizeMultipliersY.length;
    const yFullRangeProgress = (particle.actTime / this.duration) * Math.max(1, ySteps - 1);
    const yFromIndex = Math.trunc(yFullRangeProgress) % ySteps;
    const yToIndex = (yFromIndex + 1) % ySteps;
    const yLocalProgress = yFullRangeProgress % 1;

    const scalarX = PollenMath.lerp(this.sizeMultipliersX[xFromIndex], this.sizeMultipliersX[xToIndex], xLocalProgress);
    const scalarY = PollenMath.lerp(this.sizeMultipliersY[yFromIndex], this.sizeMultipliersY[yToIndex], yLocalProgress);

    const newWidth = this.initialWidth * scalarX;
    const newHeight = this.initialHeight * scalarY;

    this.particleDefaultData.width = newWidth;
    this.particleDefaultData.height = newHeight;

    this.checkBehaviorDeath(yFromIndex, yToIndex, xFromIndex, xToIndex, particle);
  }


  checkBehaviorDeath(yFromIndex, yToIndex, xFromIndex, xToIndex, particle) {
    const maxIndexSumX = xFromIndex + Math.max(xToIndex, xFromIndex);
    const maxIndexSumY = yFromIndex + Math.max(yToIndex, yFromIndex);

    this.xSizeIteration += Math.min(1, Math.abs(this.lastXSizeIndexSum - maxIndexSumX))
    this.ySizeIteration += Math.min(1, Math.abs(this.lastYSizeIndexSum - maxIndexSumY))

    this.lastXSizeIndexSum = maxIndexSumX;
    this.lastYSizeIndexSum = maxIndexSumY;

    if (Math.max(this.xSizeIteration, this.ySizeIteration) + 1 > this.sizeIterationCount) {
      particle.disableBehavior(this.type);
    }
  }

  applyParticle(particle) {
    if (this.initialDuration <= 0) {
      this.duration = particle.lifeTime;
    }
  }

  setInitialSizeData() {
    if (this.sizeMultipliersX != null && this.sizeMultipliersX.length > 0) {
      this.particleDefaultData.width = this.initialWidth * this.sizeMultipliersX[0];
    }
    if (this.sizeMultipliersY != null && this.sizeMultipliersY.length > 0) {
      this.particleDefaultData.height = this.initialHeight * this.sizeMultipliersY[0];
    }
  }

  setSizeMultipliers(initialSizeMultipliersX, initialSizeMultipliersY) {
    const multipliersXProvided = initialSizeMultipliersX != null && initialSizeMultipliersX.length > 0;
    const multipliersYProvided = initialSizeMultipliersY != null && initialSizeMultipliersY.length > 0;
    if (!multipliersXProvided) {
      if (multipliersYProvided) {
        this.sizeMultipliersX = this.copyMultipliers(initialSizeMultipliersY);
        this.sizeMultipliersY = this.copyMultipliers(initialSizeMultipliersY);
      } else {
        this.sizeMultipliersX = [1];
        this.sizeMultipliersY = [1];
      }
    } else {
      this.sizeMultipliersX = this.copyMultipliers(initialSizeMultipliersX);
      if (!multipliersYProvided) {
        this.sizeMultipliersY = this.copyMultipliers(initialSizeMultipliersX);
      } else {
        this.sizeMultipliersY = this.copyMultipliers(initialSizeMultipliersY);
      }
    }
    if (this.scalarNoise > 0) {
      let randoms = [];
      if (this.uniformNoise) {
        const countTill = Math.max(initialSizeMultipliersY != null ? initialSizeMultipliersY.length : 0, initialSizeMultipliersX.length);
        for (let i = 0; i < countTill; i++) {
          randoms[i] = Math.random();
        }
      }
      for (let i = 0; i < this.sizeMultipliersX.length; i++) {
        let random = this.uniformNoise ? randoms[i] : Math.random();
        this.sizeMultipliersX[i] = PollenMath.relativeMap(this.sizeMultipliersX[i], 1 + this.scalarNoise, random);
      }
      for (let i = 0; i < this.sizeMultipliersY.length; i++) {
        let random = this.uniformNoise ? randoms[i] : Math.random();
        this.sizeMultipliersY[i] = PollenMath.relativeMap(this.sizeMultipliersY[i], 1 + this.scalarNoise, random);
      }
    }
  }

  copyMultipliers(from) {
    let to = [];
    if (from != null) {
      for (let i = 0; i < from.length; i++) {
        to.push(from[i]);
      }
    }
    return to;
  }

  static createDefault() {
    const newBehavior = new ParticleSizeByLifeBehavior([0, 1], [0, 1]).withNoise(-1, true).withDuration(-1, -1);
    return newBehavior;
  }

  createNewBehavior(copy) {
    if (copy) {
      return this;
    } else {
      const newBehavior = new ParticleSizeByLifeBehavior(this.initialSizeMultipliersX, this.initialSizeMultipliersY)
        .withNoise(this.scalarNoise, this.uniformNoise)
        .withDuration(this.initialDuration, this.sizeIterationCount);
      return newBehavior;
    }
  }
}
