class EmitterShoot extends Emitter {


  /* Constructor */
  constructor(emitterOrigin, particleCount, emitterDuration, particleLifetime, delay = -1, particleLifetimeNoise = -1, spawnIntervalTime = 500) {
    super(emitterDuration < 0 ? 1 : particleCount, emitterDuration, delay, emitterOrigin, particleLifetime, particleLifetimeNoise)
    if (super.loop) {
      this.spawnIntervalTime = spawnIntervalTime
    } else {
      this.spawnIntervalTime = emitterDuration / particleCount
    }
    this.timeSinceLastParticle = 0
  }


  /**
   * Core logic loop of the shoot emitter
   */
  act(deltatime) {
    // Spawn logic
    if (super.active) {
      let spawnCount = (deltatime + this.cutOff) / this.spawnIntervalTime
      this.cutOff = (spawnCount % 1) * this.spawnIntervalTime
      spawnCount = Math.trunc(spawnCount)
      spawnCount = Math.min(spawnCount, super.particleCount - super.spawnedCount)
      for (let i = 0; i < spawnCount; i++) {
        this.spawn()
        this.timeSinceLastParticle = this.timeSinceLastParticle % this.spawnIntervalTime;
      }
    }
    // in case of delay: check when to begin
    else if (super.actTime > super.delay) {
        super.active = true
    }
    super.act(deltatime)
  }


  /**
   * Spawns a new particle
   */
  spawn() {
    this.spawnedCount += super.spawnedCountAddend
    let newParticleLifetime = super.generateNextParticleLifetime()
    let particle;
    // Recycled particle from the inactive pool
    if (super.particleManager.canRecycle()) {
     // console.log('Recycle: shoot')
      particle = super.particleManager.recycle().reset(newParticleLifetime)
      particle.showCSS(super.emitterBox)                // re-show the HTML element
    }
    // Newly created particle
    else {
      particle = new Particle(newParticleLifetime)
      for (let [key, value] of super.particleData) {
        particle.addParticleData(value.createNew(false))
      }
      for (let [key, value] of super.particleBehavior) {
        particle.addParticleBehavior(value.createNew(false))
      }
    }
    super.particleManager.activeFXItemPool.enqueue(particle)
    particle.createParticleBox(super.emitterBox);
  }




  get spawnIntervalTime() {
    return this._spawnIntervalTime
  }
  set spawnIntervalTime(value) {
    this._spawnIntervalTime = value
  }
  get timeSinceLastParticle() {
    return this._timeSinceLastParticle
  }
  set timeSinceLastParticle(value) {
    this._timeSinceLastParticle = value
  }

}