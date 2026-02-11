class ParticleOpacityByLifeBehavior extends ParticleBehavior {
  /* FIELDS */
  duration = -1;
  initialOpacity = 0;
  lastOpacityIndexSum;
  opacityNoise = -1;
  initialOpacityMultipliers;
  opacityMultipliers;
  initialOpacity;
  particleOpacityData;
  opacityIterationCount = -1;
  opacityIteration;

  /* CONSTRUCTOR */
  constructor(opacityMultipliers) {
    super("opacity");
    this.initialOpacityMultipliers = opacityMultipliers;
  }

  /* FLUENT */
  build(particleDataManager, particleBehaviorManager) {
    // dependencies
    this.particleOpacityData = particleDataManager.ensureData("opacity");
    // calculated properties
    if (this.opacityNoise > 0) {
      this.opacityMultipliers = [];
      for (let i = 0; i < this.initialOpacityMultipliers.length; i++) {
        let noisedOpacity = PollenMath.relativeMap(this.initialOpacityMultipliers[i], this.opacityNoise, Math.random());
        noisedOpacity = Math.max(0, Math.min(1, noisedOpacity));
        this.opacityMultipliers[i] = noisedOpacity;
      }
    } else {
      this.opacityMultipliers = this.initialOpacityMultipliers;
    }

    this.opacityIteration = 0;
    this.lastOpacityIndexSum = 1 % this.opacityMultipliers.length;
    this.initialOpacity = Math.max(0.001, this.particleOpacityData.initialOpacity);
    this.setInitialOpacityData();

    return this;
  }

  withNoise(opacityNoise) {
    this.opacityNoise = opacityNoise;
    return this;
  }

  withDuration(duration, opacityIterationCount = -1) {
    if (opacityIterationCount < 0) {
      this.opacityIterationCount = Number.MAX_VALUE;
    } else {
      this.opacityIterationCount = opacityIterationCount;
    }
    this.duration = duration;
    return this;
  }

  reset() {
    this.setInitialOpacityData();
    this.opacityIteration = 0;
    this.lastOpacityIndexSum = 1 % this.opacityMultipliers.length;
    return this;
  }

  /* METHODS */
  static createDefault() {
    return new ParticleOpacityByLifeBehavior([0, 1]).withNoise(-1).withDuration(-1, -1);
  }

  act(particle, actTime, deltaTime, deltaTimeSeconds) {
    // note: deltatime is implemented implicitly due to lerping between values based on actTime.
    const steps = this.opacityMultipliers.length;
    const fullRangeProgress = actTime / this.duration;

    const fromIndex = Math.trunc(fullRangeProgress) % steps;
    const toIndex = (fromIndex + 1) % steps;

    const localProgress = fullRangeProgress % 1;
    const scalar = PollenMath.lerp(this.opacityMultipliers[fromIndex], this.opacityMultipliers[toIndex], localProgress);

    this.particleOpacityData.opacity = this.initialOpacity * scalar;
    this.checkBehaviorDeath(fromIndex, toIndex, particle);
  }

  checkBehaviorDeath(fromIndex, toIndex, particle) {
    this.opacityIteration += Math.abs(fromIndex + Math.max(toIndex, fromIndex) - this.lastOpacityIndexSum) / 2;
    this.lastOpacityIndexSum = fromIndex + toIndex;
    if (this.opacityIteration + 1 > this.opacityIterationCount) {
      this.particleOpacityData.opacity = this.opacityMultipliers[this.opacityIterationCount % this.opacityMultipliers.length];
      particle.disableBehavior(this.type);
    }
  }

  applyParticle(particle) {
    if (this.duration <= 0) {
      this.duration = particle.lifeTime;
    }
  }

  setInitialOpacityData() {
    if (this.initialOpacityMultipliers != null && this.initialOpacityMultipliers.length > 0) {
      this.particleOpacityData.opacity = this.initialOpacity * this.initialOpacityMultipliers[0];
    }
  }

  createNewBehavior(copy) {
    if (copy) {
      return this;
    } else {
      return new ParticleOpacityByLifeBehavior(this.initialOpacityMultipliers).withNoise(this.opacityNoise).withDuration(this.duration, this.opacityIterationCount)
    }
  }
}
