class ParticleDirectionalBehavior extends ParticleBehavior {
  /* FIELDS */
  particleDefaultData;
  particleDirectionData;



  /* CONSTRUCTOR */
  constructor() {
    super("direction");
  }



  /* FLUENT */
  build(particleDataManager, particleBehaviorManager) {
    this.particleDirectionData = particleDataManager.ensureData("direction");
    this.particleDefaultData = particleDataManager.ensureData("default");
    return this;
  }



  /* METHODS */
  act(particle, startTimeMs, deltaTime, deltaTimeSeconds) {
    this.particleDefaultData.posX += this.particleDirectionData.directionX * deltaTimeSeconds;
    this.particleDefaultData.posY += this.particleDirectionData.directionY * deltaTimeSeconds;
  }

  createNewBehavior(copy) {
    if (copy) {
      return this;
    } else {
      return new ParticleDirectionalBehavior();
    }
  }

  reset() {}

  applyParticle(particle) {}

  static createDefault() {
    return new ParticleDirectionalBehavior();
  }
}
