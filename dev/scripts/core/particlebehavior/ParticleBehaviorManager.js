class ParticleBehaviorManager {
  /* FIELDS */
  particleBehaviors = new Map();
  disabledBehaviors = new Map();

  /* CONSTRUCTOR */
  constructor() {}

  /* FLUENT */
  build(particleDataManager, particleBehaviorManager) {
    this.particleBehaviors.forEach((particleBehavior, type) => {
      particleBehavior.build(particleDataManager, particleBehaviorManager);
    });
    return this;
  }

  /* METHODS */
  act(particle, actTime, deltaTime) {
    const deltaTimeSeconds = deltaTime / 1000;
    for (let [key, value] of this.particleBehaviors) {
      value.act(particle, actTime, deltaTime, deltaTimeSeconds);
    }
  }

  addParticleBehavior(particleBehavior, particleDataManager) {
    this.particleBehaviors.set(particleBehavior.type, particleBehavior);
  }

  reset(particle) {
    this.disabledBehaviors.forEach((disabledBehavior, type) => {
      this.particleBehaviors.set(type, disabledBehavior);
    });
    this.disabledBehaviors.clear();
    for (let [type, particleBehavior] of this.particleBehaviors) {
      particleBehavior.applyParticle(particle);
      particleBehavior.reset();
    }
  }

  ensureBehavior(key) {
    let particleBehavior = this.particleBehaviors.get(key);
    if (!FXUtil.valid(particleBehavior)) {
      return this.createDefaultBehavior(key).build();
    }
    return particleBehavior;
  }

  disableBehavior(type) {
    let behaviorToDisable = this.particleBehaviors.get(type);
    this.disabledBehaviors.set(behaviorToDisable.type, behaviorToDisable);
    this.particleBehaviors.delete(behaviorToDisable.type);
  }

  enableBehavior(type) {
    let behaviorToDisable = this.disabledBehaviors.get(type);
    if (behaviorToDisable != null) {
      this.particleBehaviors.set(behaviorToDisable.type, behaviorToDisable);
      this.disabledBehaviors.delete(behaviorToDisable.type);
    }
  }

  createDefaultBehavior(key) {
    let newDefaultBehavior;
    switch (key) {
      case "direction":
        newDefaultBehavior = ParticleDirectionalBehavior.createDefault();
        break;
      case "gravity":
        newDefaultBehavior = ParticleGravityBehavior.createDefault();
        break;
      case "wind":
        newDefaultBehavior = ParticleWindBehavior.createDefault();
        break;
      case "flipbook":
        newDefaultBehavior = ParticleFlipbookBehavior.createDefault();
        break;
      case "rotation":
        newDefaultBehavior = ParticleRotationBehavior.createDefault();
        break;
      case "opacity":
        newDefaultBehavior = ParticleOpacityByLifeBehavior.createDefault();
        break;
      case "colorfilter":
        newDefaultBehavior = ParticleColorShiftBehavior.createDefault();
        break;
      case "colorshift":
        newDefaultBehavior = ParticleColorShiftBehavior.createDefault();
        break;
    }
    this.particleBehaviors.set(key, newDefaultBehavior);
    return newDefaultBehavior;
  }

  static createDefault() {
    return new ParticleGravityBehavior(0.01, 1);
  }
}
