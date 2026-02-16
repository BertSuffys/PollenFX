class ParticleSpiralBehavior extends ParticleDirectionalBehavior {
  /* FIELDS */
  // speed
  initialMsPerRotation;
  msPerRotation;
  msPerRotationNoise = -1;
  // start rotation of the spiral
  initialStartRotation = null;
  startRotation;
  randomStartRotation = false;
  // randomize direction
  randomRotationDirection = false;
  startRotationNoise = -1;
  startRotationNoiseRandom = null;
  rotationMultiplier = 1;
  //helpers
  lastSpiralEffectX = 0;
  lastSpiralEffectY = 0;

  /* CONSTRUCTOR */
  constructor(msPerRotation, randomRotationDirection = false) {
    super();
    this.randomRotationDirection = randomRotationDirection;
    this.initialMsPerRotation = Math.abs(msPerRotation);
    this.rotationMultiplier = Math.sign(msPerRotation);
    if (this.randomRotationDirection) {
      this.rotationMultiplier = PollenMath.randomSign();
    }
  }

  /* FLUENT */
  build(particleDataManager, particleBehaviorManager) {
    super.build(particleDataManager, particleBehaviorManager);
    this.calculateValues();
    return this;
  }

  withSpeedNoise(msPerRotationNoise) {
    this.msPerRotationNoise = msPerRotationNoise;
    if (this.msPerRotationNoise > 0) {
      this.msPerRotation = PollenMath.relativeMap(this.initialMsPerRotation, this.msPerRotationNoise, Math.random());
    } 
    return this;
  }

  withRandomStartRotation(randomStartRotation = true) {
    this.startRotationNoise = -1;
    this.randomStartRotation = randomStartRotation;
    if(this.randomStartRotation){
      this.initialStartRotation = PollenMath.randomBetween(0, 360, false);
    }
    return this;
  }

  withStartRotationNoise(startRotationNoise) {
    this.randomStartRotation = false;
    this.startRotationNoise = startRotationNoise;
    this.startRotationNoiseRandom = Math.random();
    return this;
  }

  reset() {
    this.calculateValues();
    return this;
  }

  /* METHODS */
  act(particle, startTimeMs, deltaTime, deltaTimeSeconds) {
    // define per particle, its direction within a spiral rotation
    const elapsed = particle.spawnTime - startTimeMs; // constant
    const fraction = (elapsed % this.msPerRotation) / this.msPerRotation;
    const particleDirection = this.startRotation + 360 * fraction * this.rotationMultiplier;

    const xUpdate = PollenMath.cos(particleDirection) * this.particleDirectionData.speed * deltaTimeSeconds;
    const yUpdate = PollenMath.sin(particleDirection) * this.particleDirectionData.speed * deltaTimeSeconds * -1;

    this.particleDirectionData.directionX += xUpdate - this.lastSpiralEffectX;
    this.particleDirectionData.directionY += yUpdate - this.lastSpiralEffectY;

    this.lastSpiralEffectX = xUpdate;
    this.lastSpiralEffectY = yUpdate;

    // position update. Note: This is the actual position update, as though it were directionalbehavior.
    this.particleDefaultData.posX += this.particleDirectionData.directionX;
    this.particleDefaultData.posY += this.particleDirectionData.directionY;
  }

  calculateValues() {
    this.lastSpiralEffectX = 0;
    this.lastSpiralEffectY = 0;

    this.msPerRotation = this.msPerRotation == null ? this.initialMsPerRotation : this.msPerRotation;

    // initialStartRotation
    if(this.initialStartRotation == null){
      this.initialStartRotation = this.startRotationNoiseRandom != null ? PollenMath.relativeMap(this.particleDirectionData.directionAngle, this.startRotationNoise, this.startRotationNoiseRandom) : this.particleDirectionData.directionAngle
    }else{
      this.initialStartRotation = this.startRotationNoiseRandom != null ? PollenMath.relativeMap(this.initialStartRotation, this.startRotationNoise, this.startRotationNoiseRandom) : this.initialStartRotation
    }

    this.startRotation = this.initialStartRotation;

    // reset the direction data
    this.particleDirectionData.directionX = 0;
    this.particleDirectionData.directionY = 0;
  }

  createNewBehavior(copy) {
    if (copy) {
      return this;
    } 

    const newParticleSpiralBehavior = new ParticleSpiralBehavior(this.initialMsPerRotation, false)

    // corrections
    newParticleSpiralBehavior.msPerRotation = this.msPerRotation;
    newParticleSpiralBehavior.startRotationNoiseRandom = this.startRotationNoiseRandom;
    newParticleSpiralBehavior.startRotationNoise = this.startRotationNoise;
    newParticleSpiralBehavior.initialStartRotation = this.initialStartRotation;
    newParticleSpiralBehavior.rotationMultiplier = this.rotationMultiplier;
    
    return newParticleSpiralBehavior;
  }

  applyParticle(particle) {}

  static createDefault() {
    return new ParticleSpiralBehavior();
  }
}
