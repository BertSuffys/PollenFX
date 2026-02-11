class EmitterBurst extends Emitter {
  /* FIELDS */
  burstCount; // Amount of bursts that must occur.
  burstIntervalTime; // Time between bursts
  localBurstCount; // Number of bursts to spawn this frame
  burstedCount; // Total bursts emitted
  timeSinceLastBurst; // Accumulator for burst timing

  /* CONSTRUCTOR */
  constructor(emitterOrigin) {
    super(emitterOrigin);
  }

  /* FLUENT */
  build() {
    super.build();
    this.burstCount = this.loop ? Number.MAX_VALUE : this.burstCount;
    this.timeSinceLastBurst = 0;
    this.burstedCount = 0;
    this.localBurstCount = 1;
    return this;
  }

  finite(particleCount, burstCount, emitterDuration, particleLifetime, particleLifetimeNoise = -1) {
    super.initFinite(particleCount, emitterDuration, particleLifetime, particleLifetimeNoise);
    this.burstIntervalTime = emitterDuration / Math.max(burstCount - 1, 1);
    return this;
  }

  infinite(particleCount, burstIntervalTime, particleLifetime, particleLifetimeNoise = -1) {
    super.initInfinite(particleLifetime, particleLifetimeNoise, particleCount);
    this.burstIntervalTime = burstIntervalTime;
    return this;
  }

  /* METHODS */
  act(deltaTime) {
    if (this.active) {
      for (let i = 0; i < this.localBurstCount; i++) {
        this.burst();
        this.timeSinceLastBurst = this.timeSinceLastBurst % this.burstIntervalTime;
      }

      /* Calculation for potential next burst */
      let localBurstCount = (deltaTime + this.cutOff) / this.burstIntervalTime;
      this.cutOff = (deltaTime + this.cutOff) % this.burstIntervalTime;
      this.localBurstCount = Math.min(Math.trunc(localBurstCount), this.burstCount - this.burstedCount);

      /* Death calculation? */
      if (this.emitterCreationTime + this.emitterLiveTime >= this.emitterCreationTime + this.lifeTime) {
        super.getActiveParticles().length = 0;
      } else if (this.emitterLiveTime > this.delay) {
        this.active = true;
      }
    }
    super.act(deltaTime);
  }

  burst() {
    this.emitterOrigin.initializePosition();
    for (let i = 0; i < this.particleCount; i++) {
      super.spawn();
    }
  }

  getAverigeAliveParticleCount() {
    let maxConcurrentBursts = Math.ceil(this.particleLifetime / this.burstIntervalTime);
    if (!this.loop) {
      maxConcurrentBursts = Math.min(maxConcurrentBursts, this.burstCount);
    }
    return Math.round(maxConcurrentBursts * this.particleCount);
  }

  getCurrentAliveParticleCount() {
    // todo
  }
}
