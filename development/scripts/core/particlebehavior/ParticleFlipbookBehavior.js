

class ParticleFlipbookBehavior extends ParticleBehavior {
    constructor(speed, speedNoise = -1, endingFrameCount = -1) {
      super("flipbook")
      this.flipCount = 0
      this.initialSpeed = speed
      this.speedNoise = speedNoise
      this.timeSinceLastFrameshift = 0
      if (speedNoise > 0) {
        this.speed = PollenMath.relativeMap(this.initialSpeed, 1 + speedNoise,Math.random())
      } else {
        this.speed = this.initialSpeed
      }
      if (endingFrameCount < 0) {
        this.endingFrameCount = Number.MAX_VALUE
      } else {
        this.endingFrameCount = endingFrameCount
      }
    }
  
  
    act(particle, actTime, deltaTime) {
      // image dimension in respect to its size
      this.flipbookData.particleWidth = this.defaultData.width;
      this.flipbookData.particleHeight = this.defaultData.height;
      // image shifting
      this.timeSinceLastFrameshift += deltaTime;
      const imageShift = ~~(this.timeSinceLastFrameshift / this.speed);
      this.flipbookData.currentFrameIndex = (this.flipbookData.currentFrameIndex + imageShift) %  this.flipbookData.frameCount;
      this.timeSinceLastFrameshift = this.timeSinceLastFrameshift % this.speed
  
      this.checkBehaviorDeath(imageShift, particle)
    }
  
  
    checkBehaviorDeath(imageShift, particle) {
      this.flipCount += imageShift
      if (this.flipCount + 1 > this.endingFrameCount) {
        this.speed = Number.MAX_VALUE;
      }
    }
  
    reset() {
      this.flipCount = 0
      this.timeSinceLastFrameshift = 0
      if (this.speedNoise > 0) {
        this.speed = PollenMath.relativeMap( this.initialSpeed, 1 + this.speedNoise,  Math.random() )
      } else {
        this.speed = this.initialSpeed
      }
    }
  
    applyParticle(particle) { }
  
  
    ensureDependencies(particleDataManager, particleBehaviorManager) {
      this.flipbookData = particleDataManager.ensureData("flipbook")
      this.defaultData = particleDataManager.ensureData("default")
      this.flipbookData.particleWidth = this.defaultData.width
      this.flipbookData.particleHeight = this.defaultData.height
      this.flipbookData.imageFitting = ImageFitting.CONTAIN
    }
  
  
    createNew(copy) {
      if (copy) {
        return this
      }
      return new ParticleFlipbookBehavior(
        this.initialSpeed,
        this.speedNoise,
        this.endingFrameCount
      )
    }
  
  
    static createDefault() {
      return new ParticleFlipbookBehavior(30, -1, -1)
    }
  
    get flipCount() {
      return this._flipCount
    }
    set flipCount(value) {
      this._flipCount = value
    }
    get initialSpeed() {
      return this._initialSpeed
    }
    set initialSpeed(value) {
      this._initialSpeed = value
    }
    get speedNoise() {
      return this._speedNoise
    }
    set speedNoise(value) {
      this._speedNoise = value
    }
    get timeSinceLastFrameshift() {
      return this._timeSinceLastFrameshift
    }
    set timeSinceLastFrameshift(value) {
      this._timeSinceLastFrameshift = value
    }
    get flipbookData() {
      return this._flipbookData
    }
    set flipbookData(value) {
      this._flipbookData = value
    }
    get speed() {
      return this._speed
    }
    set speed(value) {
      this._speed = value
    }
    get defaultData() {
      return this._defaultData
    }
    set defaultData(value) {
      this._defaultData = value
    }
    get endingFrameCount() {
      return this._endingFrameCount
    }
    set endingFrameCount(value) {
      this._endingFrameCount = value
    }
  }
  