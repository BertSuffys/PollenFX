class EmitterShoot extends Emitter {
  /* FIELDS */
  spawnIntervalTime; // amount of time between each particle

  /* CONSTRUCTOR */
  constructor(emitterOrigin) {
    super(emitterOrigin, "shoot");
  }

  /* FLUENT */
  build() {
    super.build();
    return this;
  }

  finite(particleCount, emitterDuration, particleLifetime, particleLifetimeNoise = -1) {
    super.initFinite(particleCount, emitterDuration, particleLifetime, particleLifetimeNoise);
    this.spawnIntervalTime = this.lifeTime / this.particleCount;
    return this;
  }

  infinite(spawnIntervalTime, particleLifetime, particleLifetimeNoise = -1) {
    super.initInfinite(particleLifetime, particleLifetimeNoise);
    this.spawnIntervalTime = spawnIntervalTime;
    return this;
  }

  /* METHODS */
  act(deltatime, startTimeMs) {
    // Spawn logic
    if (this.active) {
      let spawnCount = (deltatime + this.cutOff) / this.spawnIntervalTime;
      this.cutOff = (spawnCount % 1) * this.spawnIntervalTime;
      spawnCount = Math.trunc(spawnCount);
      const maxSpawnCount = this.loop ? Infinity : this.particleCount - this.spawnedCount;
      spawnCount = Math.min(spawnCount, maxSpawnCount);
      for (let i = 0; i < spawnCount; i++) {
        this.spawn();
      }
    }
    super.act(deltatime, startTimeMs);
  }

  spawn() {
    super.spawn()
    this.spawnedCount++;
  }

  getAverigeAliveParticleCount() {
    // Simple noise handling (loose symmetric assumption)
    let avgLifetime = this.particleLifetime;

    if (this.particleLifetimeNoise > 0) {
      avgLifetime *= 1 + (this.particleLifetimeNoise * 0.5);
    }

    // Continuous steady-state overlap
    let avgAlive = avgLifetime / this.spawnIntervalTime;

    // Finite emitters can't exceed total particles
    if (!this.loop) {
      avgAlive = Math.min(avgAlive, this.particleCount);
    }

    return Math.max(0, Math.round(avgAlive));
  }
}
