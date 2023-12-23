

class ParticleGravityBehavior extends ParticleBehavior {
    _acceleration = 0
    _FIELD_SCALAR = 0.05
  
    constructor(fieldStrength, fieldStrengthNoise = -1) {
      super("gravity")
      this.initialFieldStrength = fieldStrength * this.FIELD_SCALAR
      if (fieldStrengthNoise > 0) {
        fieldStrength = WarMath.relativeMap(
          this.initialFieldStrength,
          fieldStrengthNoise,
          Math.random()
        )
        this.fieldStrength = fieldStrength
      } else {
        this.fieldStrength = this.initialFieldStrength
      }
      this.fieldStrengthNoise = fieldStrengthNoise
    }
  
  
  
    act(particle, actTime, deltaTime) {
      this.acceleration +=  this.fieldStrength * (deltaTime / FXManager.IDEAL_FPS)
      this.particleDirectionData.directionY += this.acceleration
    }
  
  
    ensureDependencies(particleDataManager, particleBehaviorManager) {
      this.particleDirectionData = particleDataManager.ensureData("direction")
      let ensuredDirectionalBehavior = particleBehaviorManager.ensureBehavior( "direction")
      if (ensuredDirectionalBehavior != null && ensuredDirectionalBehavior != undefined ) {
         ensuredDirectionalBehavior.ensureDependencies( particleDataManager,particleBehaviorManager)
      }
    }
  
  
    createNew(copy) {
      if (copy) {
        return this
      }
      return new ParticleGravityBehavior(
        this.initialFieldStrength,
        this.fieldStrengthNoise
      )
    }
  
  
    reset() {
      this.acceleration = 0
      if (this.fieldStrengthNoise > 0) {
        this.fieldStrength = WarMath.relativeMap(
          this.initialFieldStrength,
          this.fieldStrengthNoise,
          Math.random()
        )
      } else {
        this.fieldStrength = this.initialFieldStrength
      }
    }
  
  
    applyParticle(particle) { }
  
  
    static createDefault() {
      return new ParticleGravityBehavior(9.81, -1)
    }
  
    get acceleration() {
      return this._acceleration
    }
    set acceleration(value) {
      this._acceleration = value
    }
    get fieldStrength() {
      return this._fieldStrength
    }
    set fieldStrength(value) {
      this._fieldStrength = value
    }
    get fieldStrengthNoise() {
      return this._fieldStrengthNoise
    }
    set fieldStrengthNoise(value) {
      this._fieldStrengthNoise = value
    }
    get particleDirectionData() {
      return this._particleDirectionData
    }
    set particleDirectionData(value) {
      this._particleDirectionData = value
    }
    get FIELD_SCALAR() {
      return this._FIELD_SCALAR
    }
    get initialFieldStrength() {
      return this._initialFieldStrength
    }
    set initialFieldStrength(value) {
      this._initialFieldStrength = value
    }
  }
  
  