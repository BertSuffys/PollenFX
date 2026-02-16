class ParticleRotationBehavior extends ParticleBehavior {

  /* FIELDS */
  rotationData;
  initialRotationSpeed;
  rotationSpeed;
  rotationNoise = -1;
  allowReverse = true;

  /* CONSTRUCTOR */
  constructor(rotationSpeed) {
    super("rotation");
    this.initialRotationSpeed = rotationSpeed;
  }

  /* FLUENT */
  build(particleDataManager, particleBehaviorManager) {
    this.rotationData = particleDataManager.ensureData("rotation");
    this.rotationSpeed = this.initialRotationSpeed;
    this.adjustRotationSpeed();
    return this;
  }

  withNoise(rotationNoise, allowReverse = true) {
    this.rotationNoise = rotationNoise;
    this.allowReverse = allowReverse;
    return this;
  }

  reset() {
    this.adjustRotationSpeed();
    return this;
  }

  /* METHODS */
  act(particle, startTimeMs, deltaTime, deltaTimeSeconds) {
    this.rotationData.rotation += this.rotationSpeed * deltaTimeSeconds;
  }

  adjustRotationSpeed(){
    if (this.rotationNoise > 0) {
      if (this.allowReverse) {
        this.rotationSpeed = PollenMath.absoluteMap(this.rotationSpeed, this.rotationNoise, Math.random());
      } else {
        this.rotationSpeed = PollenMath.relativeMap(this.rotationSpeed, this.rotationNoise, Math.random());
      }
    }
  }

  createNewBehavior(copy) {
    if (copy) {
      return this;
    }
    return new ParticleRotationBehavior(this.initialRotationSpeed).withNoise(this.rotationNoise, this.allowReverse);
  }

  applyParticle(particle) {}

  static createDefault() {
    return new ParticleRotationBehavior(0.2).withNoise(-1, true);
  }
}
