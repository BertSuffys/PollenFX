class ParticleRotationByDirectionBehavior extends ParticleBehavior {
  /* FIELDS */
  offset;                       // offset (in degrees) added to the direction angle of the particle
  particleDirectionData;
  particleRotationData;


  
  /* CONSTRUCTOR */
  constructor(offset = -1) {
    super("rotation");
    this.offset = offset == -1 ? 0 : Math.max(0, Math.min(360, offset));
  }



  /* FLUENT */
  build(particleDataManager, particleBehaviorManager) {
    this.particleDirectionData = particleDataManager.ensureData("direction");
    this.particleRotationData = particleDataManager.ensureData("rotation");
    return this;
  }

  reset() {
    return this;
  }



  /* METHODS */
  act(particle, startTimeMs, deltaTime, deltaTimeSeconds) {
    const hypotenuse = Math.sqrt(Math.pow(this.particleDirectionData.directionX, 2) + this.particleDirectionData.directionX, 2);
    const normalizedYFactor = this.particleDirectionData.directionY / hypotenuse;
    const normalizedXFactor = this.particleDirectionData.directionX / hypotenuse;
    this.particleRotationData.rotation = PollenMath.radToDeg(Math.atan(normalizedYFactor / normalizedXFactor) + this.offset);
  }

  applyParticle(particle) {}

  createNewBehavior(copy) {
    if (copy) {
      return this;
    } else {
      return new ParticleRotationByDirectionBehavior(this.offset);
    }
  }

  static createDefault() {
    return new ParticleRotationByDirectionBehavior(-1);
  }
}
