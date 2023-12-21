

class EmitterBurst extends Emitter {

  /* Constructor */
  constructor(emitterOrigin, particleCount, burstCount, emitterDuration, particleLifetime, delay = -1, particleLifetimeNoise = -1, burstIntervalTime = 500) {
    super(particleCount, emitterDuration, delay, emitterOrigin, particleLifetime, particleLifetimeNoise)
    this.burstCount = super.loop ? Number.MAX_VALUE : burstCount
    this.timeSinceLastBurst = 0
    this.burstedCount = 0
    if (super.loop) {
      this.burstIntervalTime = burstIntervalTime
    } else {
      this.burstIntervalTime = emitterDuration / Math.max(burstCount - 1, 1)
    }
    this.localBurstCount = 1
  }


  /**
   * Burst core act method
   */
  act(deltaTime) {
    super.act(deltaTime)
    if (super.active) {

      for (let i = 0; i < this.localBurstCount; i++) {
        this.burst()
        this.timeSinceLastBurst = this.timeSinceLastBurst % this.burstIntervalTime
      }

      /* Calculation for potential next burst */
      let localBurstCount = (deltaTime + this.cutOff) / this.burstIntervalTime
      this.cutOff = (deltaTime + this.cutOff) % this.burstIntervalTime
      this.localBurstCount = Math.min(Math.trunc(localBurstCount), this.burstCount - this.burstedCount)

      /* Death calculation? */
      if (super.emitterCreationTime + super.emitterLiveTime >= super.emitterCreationTime + super.lifeTime) {
        super.getActiveParticles().length = 0
      } else if (super.emitterLiveTime > super.delay) {
        super.active = true
      }
    }
  }


  /**
 * Spawn of another burst
 */
  burst() {
    super.emitterOrigin.initializePosition()  /* Configure next burst position */

    for (let i = 0; i < super.particleCount; i++) {
      let newParticleLifetime = super.generateNextParticleLifetime() /* Configure next particle lifetime */
      let particle;
      /* Recycle ? */
      if (super.particleManager.canRecycle()) {
        particle = super.particleManager.recycle().reset()
        particle.lifeTime = newParticleLifetime
        particle.showCSS(super.emitterBox)                // re-show the HTML element
      }
      /* New particle ? */
      else {
        particle = new Particle(newParticleLifetime)
        for (let [key, value] of super.particleData) {
          particle.addParticleData(value.createNew(false))
        }
        for (let [key, value] of super.particleBehavior) {
          particle.addParticleBehavior(value.createNew(false))
        }
        particle.createParticleBox(super.emitterBox);                   // Creation of the element
      }
      super.particleManager.activeFXItemPool.enqueue(particle)
    }
    this.burstedCount += super.spawnedCountAddend
  }






  get localBurstCount() {
    return this._localBurstCount
  }
  set localBurstCount(value) {
    this._localBurstCount = value
  }
  get burstCount() {
    return this._burstCount
  }
  set burstCount(value) {
    this._burstCount = value
  }

  get burstIntervalTime() {
    return this._burstIntervalTime
  }
  set burstIntervalTime(value) {
    this._burstIntervalTime = value
  }

  get timeSinceLastBurst() {
    return this._timeSinceLastBurst
  }
  set timeSinceLastBurst(value) {
    this._timeSinceLastBurst = value
  }
  get burstedCount() {
    return this._burstedCount
  }
  set burstedCount(value) {
    this._burstedCount = value
  }
}
