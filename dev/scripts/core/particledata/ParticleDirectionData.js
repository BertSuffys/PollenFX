class ParticleDirectionData extends ParticleData {
  /* PARAMETERS */
  directionAngle = 0;
  initialSpeed = 0;
  speed = 0;
  coneNoise = -1;
  speedNoise = -1;
  directionX = 0;
  directionY = 0;

  /* CONSTRUCTOR */
  constructor(directionAngle, speed) {
    super("direction");
    this.directionAngle = directionAngle;
    this.initialSpeed = speed;
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
    this.speed = this.speedNoise > 0 ? PollenMath.relativeMap(this.initialSpeed, this.speedNoise, Math.random()) : this.initialSpeed;
    let alteredDirectionAngle = this.coneNoise > 0 ? this.directionAngle + (Math.random() * this.coneNoise - this.coneNoise / 2) : this.directionAngle;
    this.directionX = PollenMath.cos(alteredDirectionAngle) * this.speed;
    this.directionY = PollenMath.sin(alteredDirectionAngle) * this.speed * -1;
  }

  getCSS() {
    return "";
  }

  createNew(copy) {
    if (copy) {
      return this;
    }
    return new ParticleDirectionData(this.directionAngle, this.initialSpeed).withConeNoise(this.coneNoise).withSpeedNoise(this.speedNoise);
  }

  static createDefault() {
    return new ParticleDirectionData(45, 100);
  }
}
