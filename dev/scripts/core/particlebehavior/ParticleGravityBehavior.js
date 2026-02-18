class ParticleGravityBehavior extends ParticleBehavior {
  
  /* FIELDS */
  initialFieldStrength;
  fieldStrength;
  fieldStrengthNoise = -1;
  particleDirectionData;


  /* CONSTRUCTOR */
  constructor(fieldStrength = 9.81) {
    super("gravity");
    this.initialFieldStrength = fieldStrength; // units per second²
  }


  /* FLUENT */
  build(particleDataManager, particleBehaviorManager) {
    // dependencies
    this.particleDirectionData = particleDataManager.ensureData("direction");
    particleBehaviorManager.ensureBehavior("direction").build(particleDataManager, particleBehaviorManager);
    // calculated values
    this.setFieldStrength();
    return this;
  }

  withNoise(noise) {
    this.fieldStrengthNoise = noise;
    return this;
  }

  reset() {
    this.setFieldStrength();
    return this;
  }



  /* METHODS */
  act(particle, startTimeMs, deltaTime, deltaTimeSeconds) {
    this.particleDirectionData.directionY += this.fieldStrength * deltaTimeSeconds;
  }

  createNewBehavior(copy) {
    if (copy) {
      return this;
    }
    return new ParticleGravityBehavior(this.initialFieldStrength).withNoise(this.fieldStrengthNoise);
  }

  setFieldStrength(){
    if (this.fieldStrengthNoise > 0) {
      this.fieldStrength = PollenMath.relativeMap(this.initialFieldStrength, this.fieldStrengthNoise, Math.random());
    } else {
      this.fieldStrength = this.initialFieldStrength;
    }
  }

  applyParticle(particle) {}

  static createDefault() {
    return new ParticleGravityBehavior(9.81);
  }
}
