class EmitterShoot extends Emitter {
  /* FIELDS */
  spawnIntervalTime; // amount of time between each particle

  /* CONSTRUCTOR */
  constructor(emitterOrigin) {
    super(emitterOrigin);
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
  act(deltatime) {
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
    super.act(deltatime);
  }

  spawn() {
    this.spawnedCount++;
    let newParticleLifetime = super.generateNextParticleLifetime();
    let particle;
    // Recycled particle from the inactive pool
    if (this.particleManager.canRecycle()) {
      particle = this.particleManager.recycle().reset(newParticleLifetime);
      particle.showCSS(this.emitterBox); // re-show the HTML element
    }
    // Newly created particle
    else {
      particle = new Particle(newParticleLifetime);
      for (let [key, value] of this.particleData) {
        particle.addParticleData(value.createNew(false).build());
      }
      for (let [key, value] of this.particleBehavior) {
        particle.addParticleBehavior(value.createNew(false).build());
      }
    }
    this.particleManager.activeFXItemPool.enqueue(particle);
    particle.createParticleBox(this.emitterBox);
  }

  getAverigeAliveParticleCount() {
    if (!this.spawnIntervalTime || this.particleLifetime <= 0) return 0;

    let avgLifetime = this.particleLifetime;

    // Compute average lifetime considering noise
    if (this.particleLifetimeNoise > 0) {
      const min = this.particleLifetime / (1 + this.particleLifetimeNoise);
      const max = this.particleLifetime + (this.particleLifetimeNoise / 2) * this.particleLifetime;
      avgLifetime = (min + max) / 2;
    }

    // Compute average alive for continuous spawning
    let avgAlive = Math.round(avgLifetime / this.spawnIntervalTime);

    // Cap for finite emitters
    if (!this.loop) {
      avgAlive = Math.min(avgAlive, this.particleCount - this.spawnedCount);
    }

    return avgAlive;
  }

  getCurrentAliveParticleCount() {
    // todo
  }

}
