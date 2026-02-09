class ParticleDirectionData extends ParticleData {
  /* PARAMETERS */
  directionAngle = 0;
  speed = 0;
  coneNoise = -1;
  speedNoise = -1;
  directionX = 0;
  directionY = 0;

  /* CONSTRUCTOR */
  constructor(directionAngle, speed) {
    super("direction");
    this.directionAngle = directionAngle;
    this.speed = speed;
  }

  /* FLUENT */
  withConeNoise(coneNoise) {
    this.coneNoise = coneNoise;
    return this;
  }

  withSpeedNoise(speedNoise) {
    this.speedNoise = speedNoise;
    return this;
  }

  build() {
    this.calculateDirection();
    return this;
  }

  reset() {
    this.calculateDirection();
    return this;
  }

  /* METHODS */
  calculateDirection() {
    let alteredSpeed = speedNoise > 0 ? PollenMath.relativeMap(speed, 1 + speedNoise, Math.random()) : speed;
    let alteredDirectionAngle = coneNoise > 0 ? directionAngle + (Math.random() * coneNoise - coneNoise / 2) : directionAngle;
    this.directionX = PollenMath.cos(alteredDirectionAngle) * alteredSpeed;
    this.directionY = PollenMath.sin(alteredDirectionAngle) * alteredSpeed * -1;
  }

  getCSS() {
    return "";
  }

  createNew(copy) {
    if (copy) {
      return this;
    }
    return new ParticleDirectionData(this.directionAngle, this.speed).withConeNoise(this.coneNoise).withSpeedNoise(this.speedNoise);
  }

  static createDefault() {
    return new ParticleDirectionData(45, 0);
  }
}
