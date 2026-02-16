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
    this.opacityIterationCount = this.opacityIterationCount > 0 ? this.opacityIterationCount : this.initialOpacityMultipliers.length;
    this.calculateOpacityMultipliers();
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
    this.opacityIterationCount = opacityIterationCount;
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
  calculateOpacityMultipliers() {
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
  }

  /**
   * Important!
   * Consider opacityScalars=[0,1], duration=1000 and opacityIterationCount=3
   * Then, it will cycle from 0 to 1 in 1000 ms, or 1 jump in 1000ms. Going back to 0 will thus also take 1000ms. G
   * iven that opacityIterationCount is 3, it will go 0-1-0, in 3000ms.
   */
  act(particle, startTimeMs, deltaTime, deltaTimeSeconds) {
    // note: deltatime is implemented implicitly due to lerping between values based on actTime.
    const steps = this.opacityMultipliers.length;
    const fullRangeProgress = particle.actTime / this.duration;
    const scaledFullRangeProgress = fullRangeProgress * Math.max(1, steps - 1);

    const fromIndex = Math.trunc(scaledFullRangeProgress) % steps;
    const toIndex = (fromIndex + 1) % steps;

    const localProgress = scaledFullRangeProgress % 1;
    
    const scalar = PollenMath.lerp(this.opacityMultipliers[fromIndex], this.opacityMultipliers[toIndex], localProgress);
    this.particleOpacityData.opacity = this.initialOpacity * scalar;
    this.checkBehaviorDeath(fromIndex, toIndex, particle);
  }

  checkBehaviorDeath(fromIndex, toIndex, particle) {
    const maxIndexSum = fromIndex + Math.max(toIndex, fromIndex);
    this.opacityIteration += Math.min(1, Math.abs(this.lastOpacityIndexSum - maxIndexSum))
    this.lastOpacityIndexSum = maxIndexSum;
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
      return new ParticleOpacityByLifeBehavior(this.initialOpacityMultipliers).withNoise(this.opacityNoise).withDuration(this.duration, this.opacityIterationCount);
    }
  }

  static createDefault() {
    return new ParticleOpacityByLifeBehavior([0, 1, 0]).withNoise(-1).withDuration(-1, -1);
  }
}
