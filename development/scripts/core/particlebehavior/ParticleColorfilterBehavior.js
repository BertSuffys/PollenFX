

class ParticleColorfilterBehavior extends ParticleBehavior {

    constructor(
      colors,
      duration = -1,
      randomStartColor = false,
      startIndex = 0,
      colorIterationCount = -1
    ) {
      super("colorfilter")
      this.colorIteration = 0
      this.randomStartColor = randomStartColor
      this.durationOverride = duration > 0;
      this.startIndex =  startIndex % colors.length
      this.colors = colors
      this.duration = duration
      if (randomStartColor) {
        this.startIndex = Math.floor(Math.random() * colors.length)
      }
      this.lastColorIndexSum = this.startIndex + (1 % this.colors.length)
      if (colorIterationCount < 0) {
        this.colorIterationCount = Number.MAX_VALUE
      } else {
        this.colorIterationCount = colorIterationCount
      }
    }
  
  

  
    act(particle, actTime, deltaTime) {

      const fullRangeProgress = (actTime / this.duration) * (this.colors.length - 1)
      const localProgress = fullRangeProgress % 1
  
      const fromColorIndex = (~~fullRangeProgress + this.startIndex) % this.colors.length
      const toColorIndex = ((fromColorIndex + 1)) % this.colors.length

      ColorUtil.lerpColorToTarget( this.particleColorfilterData.color,  this.colors[fromColorIndex], this.colors[toColorIndex], localProgress )
      this.particleColorfilterData.calculateHueShiftForColorTargetFromSepia()
  
      this.checkBehaviorDeath(fromColorIndex, toColorIndex, particle)
    }
  
  
    checkBehaviorDeath(fromColorIndex, toColorIndex, particle) {
      this.colorIteration +=  Math.abs(fromColorIndex + Math.max(fromColorIndex,toColorIndex) - this.lastColorIndexSum) / 2
      this.lastColorIndexSum = fromColorIndex + toColorIndex
      if (this.colorIteration + 1 > this.colorIterationCount) {
        particle.disableBehavior(super.type)
      }
    }
  
  
    reset() {
      this.colorIteration = 0
      this.lastColorIndexSum = this.startIndex + (1 % this.colors.length)
      ColorUtil.lerpColorToTarget(
        this.particleColorfilterData.color,
        this.colors[0],
        this.colors[1 % this.colors.length],
        0
      )
      this.particleColorfilterData.calculateHueShiftForColorTargetFromSepia()
    }
  
  
    ensureDependencies(particleDataManager, particleBehaviorManager) {
      this.particleColorfilterData = particleDataManager.ensureData("colorfilter")
      this.reset()
    }
  
  
    applyParticle(particle) {
      if (!this.durationOverride) {
        this.duration = particle.lifeTime
      }
    }
  
  
    createNew(copy) {
      if (copy) {
        return this
      }
      return new ParticleColorfilterBehavior(
        this.colors,
        this.duration,
        this.randomStartColor,
        this.startIndex,
        this.colorIterationCount
      )
    }
  
    static createDefault() {
      return new ParticleColorfilterBehavior([
        new Color("#FFFFFF"),
        new Color(ColorUtil.debugColor)
      ])
    }
  
  
    get colors() {
      return this._colors
    }
    set colors(value) {
      this._colors = value
    }
  
    get particleColorfilterData() {
      return this._particleColorfilterData
    }
    set particleColorfilterData(value) {
      this._particleColorfilterData = value
    }
  
    get randomStartColor() {
      return this._randomStartColor
    }
    set randomStartColor(value) {
      this._randomStartColor = value
    }
    get startIndex() {
      return this._startIndex
    }
    set startIndex(value) {
      this._startIndex = value
    }
    get duration() {
      return this._duration
    }
    set duration(value) {
      this._duration = value
    }
    get colorIterationCount() {
      return this._colorIterationCount
    }
    set colorIterationCount(value) {
      this._colorIterationCount = value
    }
  
    get colorIteration() {
      return this._colorIteration
    }
    set colorIteration(value) {
      this._colorIteration = value
    }
    get lastColorIndexSum() {
      return this._lastColorIndexSum
    }
    set lastColorIndexSum(value) {
      this._lastColorIndexSum = value
    }

    get durationOverride() {
      return this._durationOverride
    }
    set durationOverride(value) {
      this._durationOverride = value
    }
  }
  