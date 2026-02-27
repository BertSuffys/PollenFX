class EmitterBurst extends Emitter {
  /* FIELDS */
  burstCount;         // Amount of bursts that must occur.
  burstIntervalTime;  // Time between bursts
  localBurstCount;    // Number of bursts to spawn this frame
  burstedCount;       // Total bursts emitted
  timeSinceLastBurst; // Accumulator for burst timing

  /* CONSTRUCTOR */
  constructor(emitterOrigin) {
    super(emitterOrigin, "burst");
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
    this.burstCount = burstCount;
    this.burstIntervalTime = emitterDuration / Math.max(burstCount - 1, 1);
    return this;
  }

  infinite(particleCount, burstIntervalTime, particleLifetime, particleLifetimeNoise = -1) {
    super.initInfinite(particleLifetime, particleLifetimeNoise, particleCount);
    this.burstIntervalTime = burstIntervalTime;
    return this;
  }

  /* METHODS */
  act(deltaTime, startTimeMs) {
    if (this.active && !this.paused) {

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
    super.act(deltaTime, startTimeMs);
  }

  burst() {
    this.emitterOrigin.initializePosition();
    for (let i = 0; i < this.particleCount; i++) {
      super.spawn();
    }
    this.burstedCount++;
  }

  reset(){
    super.reset();
    this.timeSinceLastBurst = 0;
    this.burstedCount = 0;
    this.localBurstCount = 1;
  }

  getAverigeAliveParticleCount() {
    let avgLifetime = this.particleLifetime;

    if (this.particleLifetimeNoise > 0) {
      avgLifetime *= 1 + (this.particleLifetimeNoise * 0.5);
    }

    // How many bursts overlap in steady state
    let overlappingBursts = Math.ceil(avgLifetime / this.burstIntervalTime);

    // Finite emitters can't exceed total burst count
    if (!this.loop) {
      overlappingBursts = Math.min(overlappingBursts, this.burstCount);
    }

    const avgAlive = overlappingBursts * this.particleCount;

    return Math.max(0, Math.round(avgAlive));
  }

}
