class ParticleWindBehavior extends ParticleBehavior {

    _cycleDuration = 0
    _windSpeed = 0
  
    constructor(angles, cycleDuration = -1, windSpeed = 1, deepRandom = false, shallowRandom = false, considerDefault = false, overrideInitialDirection = false ) {
      super("wind")
      this.angles = angles
      this.considerDefault = considerDefault
      this.cycleDuration = cycleDuration
      this.windSpeed = windSpeed
      this.deepRandom = deepRandom
      this.shallowRandom = shallowRandom
      this.overrideInitialDirection = overrideInitialDirection
      this.lastWindEffectX = 0
      this.lastWindEffectY = 0
      this.configure()
    }
  
  
    reset() {
      this.lastWindEffectX = 0
      this.lastWindEffectY = 0
       
    }


    act(particle, actTime, deltaTime) { 
      const fullRangeProgress = (actTime / this.cycleDuration) * (this.directionsX.length - 1)
  
      const fromIndex = ~~fullRangeProgress % this.directionsX.length
      const toIndex = (fromIndex + 1) % this.directionsX.length
  
      const localProgress = fullRangeProgress % 1
  
      const xDirChange = PollenMath.lerp(this.directionsX[fromIndex],this.directionsX[toIndex], localProgress)
      const yDirChange = PollenMath.lerp(this.directionsY[fromIndex],this.directionsY[toIndex], localProgress)
  
      this.particleDirectionData.directionX += xDirChange - this.lastWindEffectX
      this.particleDirectionData.directionY += yDirChange - this.lastWindEffectY

  
      this.lastWindEffectX = xDirChange
      this.lastWindEffectY = yDirChange

    }
  
    applyParticle(particle) {
      if (this.cycleDuration == -1) {
        this.cycleDuration = particle.lifeTime
      }
    }


    initAngles() {
      for (let i = 0; i < this.angles.length; i++) {
        this.directionsX[i] = PollenMath.cos(this.angles[i]) * this.windSpeed
        this.directionsY[i] = PollenMath.sin(this.angles[i]) * this.windSpeed * -1
      }
    }

  
  
    configure() {
      if (this.angles != null) {
        this.directionsX = []
        this.directionsY = []
        if (this.deepRandom) {
          this.initDeepRandomAngles()
        } else if (this.shallowRandom) {
          this.initShallowRandomAngles()
        } else {
          this.initAngles()
        }
      }
    }
  
  
    initDeepRandomAngles() {
      const largestAngle = this.angles.reduce((prevAngle, curAngle) => {
        return prevAngle > curAngle ? prevAngle : curAngle
      })
      const smallestAngle = this.angles.reduce((prevAngle, curAngle) => {
        return prevAngle < curAngle ? prevAngle : curAngle
      })
      for (let i = 0; i < this.angles.length; i++) {
        this.initDeepRandomAngle(i, smallestAngle, largestAngle)
      }
    }
  
    initDeepRandomAngle(i, smallestAngle, largestAngle) {
      const randomAngle =
        smallestAngle + (largestAngle - smallestAngle) * Math.random()
      this.directionsX[i] = PollenMath.cos(randomAngle) * this.windSpeed
      this.directionsY[i] = PollenMath.sin(randomAngle) * this.windSpeed * -1
    }
  
  
    initShallowRandomAngles() {
      const largestAngle = this.angles.reduce((prevAngle, curAngle) => {
        return prevAngle > curAngle ? prevAngle : curAngle
      })
      const smallestAngle = this.angles.reduce((prevAngle, curAngle) => {
        return prevAngle < curAngle ? prevAngle : curAngle
      })
      const mobilityFactor = 360 / (largestAngle - smallestAngle)
      for (let i = 0; i < this.angles.length; i++) {
        this.initShallowRandomAngle(i, this.angles.length, mobilityFactor)
      }
    }
  
    initShallowRandomAngle(i, angleCount, mobilityFactor) {
      let lowerAngleBound = PollenMath.lerp(
        this.angles[PollenMath.modulo(i - 1, angleCount)],
        this.angles[i],
        mobilityFactor
      )
      let upperAngleBound = PollenMath.lerp(
        this.angles[i],
        this.angles[(i + 1) % angleCount],
        mobilityFactor
      )
      const alteredAngle = PollenMath.randomBetween(
        lowerAngleBound,
        upperAngleBound,
        true
      )
      this.directionsX[i] = PollenMath.cos(alteredAngle) * this.windSpeed
      this.directionsY[i] = PollenMath.sin(alteredAngle) * this.windSpeed * -1
    }
  
  

  
  
    static createDefault() {
      return new ParticleWindBehavior([0], 1000, 1, true, false, false)
    }
  
  
    ensureDependencies(particleDataManager, particleBehaviorManager) {
      this.particleDirectionData = particleDataManager.ensureData("direction")
      let ensuredDirectionalBehavior = particleBehaviorManager.ensureBehavior(
        "direction"
      )
      if (
        ensuredDirectionalBehavior != null &&
        ensuredDirectionalBehavior != undefined
      ) {
        ensuredDirectionalBehavior.ensureDependencies(
          particleDataManager,
          particleBehaviorManager
        )
      }
      if (this.considerDefault) {
        if (!this.overrideInitialDirection) {
          this.directionsX.unshift(undefined)
          this.directionsY.unshift(undefined)
        }
        if (this.deepRandom) {
          let anglesModified = this.angles.slice()
          anglesModified.unshift(this.particleDirectionData.directionAngle)
          const largestAngle = anglesModified.reduce((prevAngle, curAngle) => {
            return prevAngle > curAngle ? prevAngle : curAngle
          })
          const smallestAngle = anglesModified.reduce((prevAngle, curAngle) => {
            return prevAngle < curAngle ? prevAngle : curAngle
          })
          this.initDeepRandomAngle(0, smallestAngle, largestAngle)
        } else if (this.shallowRandom) {
          let anglesModified = this.angles.slice()
          anglesModified.unshift(this.particleDirectionData.directionAngle)
          const largestAngle = anglesModified.reduce((prevAngle, curAngle) => {
            return prevAngle > curAngle ? prevAngle : curAngle
          })
          const smallestAngle = anglesModified.reduce((prevAngle, curAngle) => {
            return prevAngle < curAngle ? prevAngle : curAngle
          })
          const mobilityFactor = 360 / (largestAngle - smallestAngle)
          this.initShallowRandomAngle(0, this.angles.length, mobilityFactor)
        } else {
          this.directionsX[0] =
          PollenMath.cos(this.particleDirectionData.directionAngle) *
            this.windSpeed
          this.directionsY[0] =
          PollenMath.sin(this.particleDirectionData.directionAngle) *
            this.windSpeed *
            -1
        }
      }
    }
  
  

  
  
    createNew(copy) {
      if (copy) {
        return this
      } else {
        return new ParticleWindBehavior(
          this.angles,
          this.cycleDuration,
          this.windSpeed,
          this.deepRandom,
          this.shallowRandom,
          this.considerDefault,
          this.overrideInitialDirection
        )
      }
    }
  
    get considerDefault() {
      return this._considerDefault
    }
    set considerDefault(value) {
      this._considerDefault = value
    }
    get particleDirectionData() {
      return this._particleDirectionData
    }
    set particleDirectionData(value) {
      this._particleDirectionData = value
    }
    get windSpeed() {
      return this._windSpeed
    }
    set windSpeed(value) {
      this._windSpeed = value
    }
    get angles() {
      return this._angles
    }
    set angles(value) {
      this._angles = value
    }
    get shallowRandom() {
      return this._shallowRandom
    }
    set shallowRandom(value) {
      this._shallowRandom = value
    }
    get cycleDuration() {
      return this._cycleDuration
    }
    set cycleDuration(value) {
      this._cycleDuration = value
    }
    get deepRandom() {
      return this._deepRandom
    }
    set deepRandom(value) {
      this._deepRandom = value
    }
    get directionsX() {
      return this._directionsX
    }
    set directionsX(value) {
      this._directionsX = value
    }
    get directionsY() {
      return this._directionsY
    }
    set directionsY(value) {
      this._directionsY = value
    }
    get overrideInitialDirection() {
      return this._overrideInitialDirection
    }
    set overrideInitialDirection(value) {
      this._overrideInitialDirection = value
    }
    get lastWindEffectY() {
      return this._lastWindEffectY
    }
    set lastWindEffectY(value) {
      this._lastWindEffectY = value
    }
    get lastWindEffectX() {
      return this._lastWindEffectX
    }
    set lastWindEffectX(value) {
      this._lastWindEffectX = value
    }
  }