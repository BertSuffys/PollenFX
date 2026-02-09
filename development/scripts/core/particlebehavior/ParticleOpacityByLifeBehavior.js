

class ParticleOpacityByLifeBehavior extends ParticleBehavior {
    _duration = 0
    _initialOpacity = 0
  
  
    constructor( opacityMultipliers, opacityNoise = -1, duration = -1, opacityIterationCount = -1 ) {
      super("opacity")
      this.durationOverride = duration > 0;
      if (opacityNoise > 0) {
        this.opacityMultipliers = []
        for (let i = 0; i < opacityMultipliers.length; i++) {
          let noisedOpacity = PollenMath.relativeMap(opacityMultipliers[i], opacityNoise, Math.random() )
          noisedOpacity = Math.max(0, Math.min(1, noisedOpacity))
          this.opacityMultipliers[i] = noisedOpacity
        }
      }
      else {
        this.opacityMultipliers = opacityMultipliers
      }
      this.opacityNoise = opacityNoise
      this.duration = duration
      this.opacityIteration = 0
      this.lastOpacityIndexSum = 1 % this.opacityMultipliers.length
      if (opacityIterationCount < 0) {
        this.opacityIterationCount = Number.MAX_VALUE
      } else {
        this.opacityIterationCount = opacityIterationCount
      }
    }
  
  
    static createDefault() {
      return new ParticleOpacityByLifeBehavior([0, 1], -1, -1)
    }
  
      build() {
        // TODO
    }

  
    ensureDependencies(particleDataManager, particleBehaviorManager) {
      this.particleOpacityData = particleDataManager.ensureData("opacity")
      this.initialOpacity = Math.max(0.001, this.particleOpacityData.opacity)
      this.setInitialOpacityData()
    }
  
  
    act(particle, actTime, deltaTime) {
      const fullRangeProgress = (actTime / this.duration) * (this.opacityMultipliers.length - 1)
  
      const fromIndex = ~~fullRangeProgress % this.opacityMultipliers.length
      const toIndex = (fromIndex + 1) % this.opacityMultipliers.length
      const localProgress = fullRangeProgress % 1

      const scalar = PollenMath.lerp(
        this.opacityMultipliers[fromIndex],
        this.opacityMultipliers[toIndex],
        localProgress
      )
  
      this.particleOpacityData.opacity = this.initialOpacity * scalar
      this.checkBehaviorDeath(fromIndex, toIndex, particle)
    }
  
  
    checkBehaviorDeath(fromIndex, toIndex, particle) {
      this.opacityIteration += Math.abs(fromIndex + Math.max(toIndex, fromIndex) - this.lastOpacityIndexSum) / 2
      this.lastOpacityIndexSum = fromIndex + toIndex
      if (this.opacityIteration + 1 > this.opacityIterationCount) {
        this.particleOpacityData.opacity = this.opacityMultipliers[this.opacityIterationCount % this.opacityMultipliers.length]
        particle.disableBehavior(super.type)
      }
    }
  
  
    reset() {
      this.setInitialOpacityData()
      this.opacityIteration = 0
      this.lastOpacityIndexSum = 1 % this.opacityMultipliers.length
    }
  
  
    applyParticle(particle) {
      if (!this.durationOverride) {
        this.duration = particle.lifeTime;
      }
    }
  
  
    setInitialOpacityData() {
      if (this.opacityMultipliers != null && this.opacityMultipliers.length > 0) {
        this.particleOpacityData.opacity = this.initialOpacity * this.opacityMultipliers[0]
      }
    }
  
  createNew(copy) {
    if (copy) {
      return this
    } else {
      return new ParticleOpacityByLifeBehavior(this.opacityMultipliers, this.opacityNoise, this.duration, this.opacityIterationCount)
    }
  }

    get lastOpacityIndexSum() {
      return this._lastOpacityIndexSum
    }
    set lastOpacityIndexSum(value) {
      this._lastOpacityIndexSum = value
    }
    get duration() {
      return this._duration
    }
    set duration(value) {
      this._duration = value
    }
    get opacityNoise() {
      return this._opacityNoise
    }
    set opacityNoise(value) {
      this._opacityNoise = value
    }
    get opacityMultipliers() {
      return this._opacityMultipliers
    }
    set opacityMultipliers(value) {
      this._opacityMultipliers = value
    }
  
    get initialOpacity() {
      return this._initialOpacity
    }
    set initialOpacity(value) {
      this._initialOpacity = value
    }
    get particleOpacityData() {
      return this._particleOpacityData
    }
    set particleOpacityData(value) {
      this._particleOpacityData = value
    }
  
    get opacityIterationCount() {
      return this._opacityIterationCount
    }
    set opacityIterationCount(value) {
      this._opacityIterationCount = value
    }
    get opacityIteration() {
      return this._opacityIteration
    }
    set opacityIteration(value) {
      this._opacityIteration = value
    }

    get durationOverride() {
      return this._durationOverride
    }
    set durationOverride(value) {
      this._durationOverride = value
    }
  }