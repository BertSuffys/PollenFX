class ParticleWindBehavior extends ParticleBehavior {
  /* FIELDS */
  // config
  angles;
  windSpeed = 0;
  cycleDuration = -1;
  initialCycleDuration = -1;
  // random
  shallowRandom = false;
  deepRandom = false;
  // config
  considerDefault = false; // if true, the initial direction as defined in the ParticleDirectionData will not be discarded
  overrideInitialDirection = false;
  // calculated
  particleDirectionData;
  directionsX;
  directionsY;
  lastWindEffectY;
  lastWindEffectX;


  
  /* CONSTRUCTOR */
  constructor(angles, windSpeed = 500) {
    super("wind");
    this.angles = angles;
    this.windSpeed = windSpeed;
  }



  /* FLUENT */
  build(particleDataManager, particleBehaviorManager) {
    // core config
    this.lastWindEffectX = 0;
    this.lastWindEffectY = 0;
    this.configure();
    // ensure dependencies
    this.particleDirectionData = particleDataManager.ensureData("direction");
    particleBehaviorManager.ensureBehavior("direction").build(particleDataManager, particleBehaviorManager);
    // config
    if (this.considerDefault) {
      if (!this.overrideInitialDirection) {
        this.directionsX.unshift(undefined);
        this.directionsY.unshift(undefined);
      }
      if (this.deepRandom) {
        let anglesModified = this.angles.slice();
        anglesModified.unshift(this.particleDirectionData.directionAngle);
        const largestAngle = anglesModified.reduce((prevAngle, curAngle) => {
          return prevAngle > curAngle ? prevAngle : curAngle;
        });
        const smallestAngle = anglesModified.reduce((prevAngle, curAngle) => {
          return prevAngle < curAngle ? prevAngle : curAngle;
        });
        this.initDeepRandomAngle(0, smallestAngle, largestAngle);
      } else if (this.shallowRandom) {
        let anglesModified = this.angles.slice();
        anglesModified.unshift(this.particleDirectionData.directionAngle);
        const largestAngle = anglesModified.reduce((prevAngle, curAngle) => {
          return prevAngle > curAngle ? prevAngle : curAngle;
        });
        const smallestAngle = anglesModified.reduce((prevAngle, curAngle) => {
          return prevAngle < curAngle ? prevAngle : curAngle;
        });
        const mobilityFactor = 360 / (largestAngle - smallestAngle);
        this.initShallowRandomAngle(0, this.angles.length, mobilityFactor);
      } else {
        this.directionsX[0] = PollenMath.cos(this.particleDirectionData.directionAngle) * this.windSpeed;
        this.directionsY[0] = PollenMath.sin(this.particleDirectionData.directionAngle) * this.windSpeed * -1;
      }
    }
    return this;
  }

  reset() {
    this.lastWindEffectX = 0;
    this.lastWindEffectY = 0;
    return this;
  }

  randomizeShallow(shallowRandom = true) {
    this.deepRandom = false;
    this.shallowRandom = shallowRandom;
    return this;
  }

  randomizeDeep(deepRandom = true) {
    this.shallowRandom = false;
    this.deepRandom = deepRandom;
    return this;
  }

  withDuration(cycleDuration) {
    this.initialCycleDuration = cycleDuration;
    return this;
  }

  withInitialDirection(considerDefault = false, overrideInitialDirection = false) {
    this.considerDefault = considerDefault;
    this.overrideInitialDirection = overrideInitialDirection;
    return this;
  }



  /* METHODS */
  act(particle, startTimeMs, deltaTime, deltaTimeSeconds) {
    // note: deltatime is implemented implicitly due to lerping between values based on actTime.
    const steps = this.directionsX.length;
    const fullRangeProgress = (particle.actTime / this.cycleDuration) * Math.max(steps - 1, 1);

    const fromIndex = Math.trunc(fullRangeProgress) % steps;
    const toIndex = (fromIndex + 1) % steps;

    const localProgress = fullRangeProgress % 1;

    const xDirChange = PollenMath.lerp(this.directionsX[fromIndex], this.directionsX[toIndex], localProgress);
    const yDirChange = PollenMath.lerp(this.directionsY[fromIndex], this.directionsY[toIndex], localProgress);

    this.particleDirectionData.directionX += xDirChange - this.lastWindEffectX;
    this.particleDirectionData.directionY += yDirChange - this.lastWindEffectY;

    this.lastWindEffectX = xDirChange;
    this.lastWindEffectY = yDirChange;
  }

  applyParticle(particle) {
    if (this.initialCycleDuration < 0) {
      this.cycleDuration = particle.lifeTime;
    }
  }

  initAngles() {
    for (let i = 0; i < this.angles.length; i++) {
      this.directionsX[i] = PollenMath.cos(this.angles[i]) * this.windSpeed;
      this.directionsY[i] = PollenMath.sin(this.angles[i]) * this.windSpeed * -1;
    }
  }

  configure() {
    this.cycleDuration = this.initialCycleDuration;
    if (this.angles != null) {
      this.directionsX = [];
      this.directionsY = [];
      if (this.deepRandom) {
        this.initDeepRandomAngles();
      } else if (this.shallowRandom) {
        this.initShallowRandomAngles();
      } else {
        this.initAngles();
      }
    }
  }

  initDeepRandomAngles() {
    const largestAngle = this.angles.reduce((prevAngle, curAngle) => {
      return prevAngle > curAngle ? prevAngle : curAngle;
    });
    const smallestAngle = this.angles.reduce((prevAngle, curAngle) => {
      return prevAngle < curAngle ? prevAngle : curAngle;
    });
    for (let i = 0; i < this.angles.length; i++) {
      this.initDeepRandomAngle(i, smallestAngle, largestAngle);
    }
  }

  initDeepRandomAngle(i, smallestAngle, largestAngle) {
    const randomAngle = smallestAngle + (largestAngle - smallestAngle) * Math.random();
    this.directionsX[i] = PollenMath.cos(randomAngle) * this.windSpeed;
    this.directionsY[i] = PollenMath.sin(randomAngle) * this.windSpeed * -1;
  }

  initShallowRandomAngles() {
    const largestAngle = this.angles.reduce((prevAngle, curAngle) => {
      return prevAngle > curAngle ? prevAngle : curAngle;
    });
    const smallestAngle = this.angles.reduce((prevAngle, curAngle) => {
      return prevAngle < curAngle ? prevAngle : curAngle;
    });
    const mobilityFactor = 360 / (largestAngle - smallestAngle);
    for (let i = 0; i < this.angles.length; i++) {
      this.initShallowRandomAngle(i, this.angles.length, mobilityFactor);
    }
  }

  initShallowRandomAngle(i, angleCount, mobilityFactor) {
    let lowerAngleBound = PollenMath.lerp(this.angles[PollenMath.modulo(i - 1, angleCount)], this.angles[i], mobilityFactor);
    let upperAngleBound = PollenMath.lerp(this.angles[i], this.angles[(i + 1) % angleCount], mobilityFactor);
    const alteredAngle = PollenMath.randomBetween(lowerAngleBound, upperAngleBound, true);
    this.directionsX[i] = PollenMath.cos(alteredAngle) * this.windSpeed;
    this.directionsY[i] = PollenMath.sin(alteredAngle) * this.windSpeed * -1;
  }

  createNewBehavior(copy) {
    if (copy) {
      return this;
    } else {
      return new ParticleWindBehavior(this.angles, this.windSpeed)
        .randomizeShallow(this.shallowRandom)
        .randomizeDeep(this.deepRandom)
        .withDuration(this.initialCycleDuration)
        .withInitialDirection(this.considerDefault, this.overrideInitialDirection);
    }
  }

  static createDefault() {
    return new ParticleWindBehavior([0], 1).withDuration(1000).randomizeShallow(false).randomizeDeep(false);
  }
}
