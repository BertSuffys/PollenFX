class Emitter extends FXItem {
  /* FIELDS */
  active;
  loop; // whether the emitter continues forever or not
  delay = 0;
  particleLifetime; // Time in ms a particle is alive for
  particleLifetimeNoise; // Noise multiplier, modifying the particle lifetime
  particleCount = -1; // amount of particles to be emitted over a certain emitterduration or present in a single burst.
  spawnedCount = 0;
  cutOff;
  emitterContainer;
  emitterBox;
  particleManager;
  emitterOrigin;
  particleBehavior = new Map();
  particleData = new Map();



  /* CONSTRUCTOR */
  constructor(emitterOrigin) {
    super(0);
    if (!emitterOrigin) {
      FXUtil.pollenFXError("An emitter must be provided an origin.");
    }
    this.emitterOrigin = emitterOrigin;
  }



  /* FLUENT */
  initFinite(particleCount, emitterDuration, particleLifetime, particleLifetimeNoise = -1) {
    this.particleCount = Math.max(0, particleCount);
    this.lifeTime = Math.max(0, emitterDuration);
    this.particleLifetime = particleLifetime;
    this.particleLifetimeNoise = particleLifetimeNoise;
    return this;
  }

  initInfinite(particleLifetime, particleLifetimeNoise = -1, particleCount = -1) {
    this.particleCount = particleCount;
    this.lifeTime = -1;
    this.particleLifetime = particleLifetime;
    this.particleLifetimeNoise = particleLifetimeNoise;
    return this;
  }

  withDelay(delay) {
    this.delay = Math.max(0, delay);
    return this;
  }

  addParticleBehavior(behavior) {
    this.particleBehavior.set(behavior.type, behavior);
    return this;
  }

  addParticleData(data) {
    this.particleData.set(data.type, data);
    return this;
  }

  getActiveParticles() {
    return this.particleManager.getActiveFXItems();
  }

  reset() {
    return this;
  }

  build() {
    // setup
    super.setLifetime(Emitter.calculateFinalDuration(this.particleLifetime, this.particleLifetimeNoise, this.lifeTime, this.delay));
    this.loop = this.lifeTime < 0;
    this.active = this.delay <= 0;
    this.cutOff = 0;

    // infinite emitter
    if (this.particleLifetime <= 0) {
      this.particleManager = new FXItemManager(this.loop ? -1 : this.particleCount); // todo build
    }

    // finite emitter
    else {
      this.particleManager = new FXItemLifeManager(this.loop ? -1 : this.particleCount); // todo build
    }

    // build the origin
    this.emitterOrigin.build();

    // propagate build to data and behavior
    this.particleData.get("default").setEmitterOrigin(this.emitterOrigin);
    this.particleData.forEach((dataObject, key) => {
      dataObject.build();
    });
    this.particleBehavior.forEach((behaviorObject, key) => {
      behaviorObject.build();
    });

    // All DOM related particle stuff
    this.createDOMDependencies();

    return this;
  }

  createDOMDependencies(){
    // The collapsed container
    this.emitterContainer = FXDom.createEmitterContainer(this.emitterOrigin);
    // The box or actual habitat
    this.emitterBox = FXDom.createEmitterBox(this.emitterOrigin, this.emitterContainer);
    // The size listeners
    if (this.emitterOrigin.anchorElement != null) {
      FXDom.initAnchorWidthResizeObserver(this.emitterOrigin, this.emitterBox); // width and x position
      FXDom.initAnchorHeightResizeObserver(this.emitterOrigin, this.emitterBox); // height and y position
    } else {
      FXDom.initBodyResizeObserver(this.emitterBox);
    }
    // The origin debug
    if(FXManager.DEBUG){
      switch(this.emitterOrigin.constructor.name){
        case 'CircularEmitterOrigin' : {
          FXDom.createCircularOriginBox(this.emitterOrigin, this.emitterContainer);break;
        }
        case 'LineEmitterOrigin' : {
          FXDom.createLineOriginBox(this.emitterOrigin, this.emitterContainer);break;
        }
        case 'PointEmitterOrigin' : {
          FXDom.createPointOriginBox(this.emitterOrigin, this.emitterContainer);break;
        }
        default : {
          FXDom.createRectangularOriginBox(this.emitterOrigin, this.emitterContainer);break;
        }
      }
    }
  }

  /* METHODS */
  act(deltaTime) {
    super.act(deltaTime);
    if (this.delay > 0 && this.actTime > this.delay) {
      this.active = true;
    }
    this.particleManager.act(deltaTime);
  }

  die() {
    this.particleManager.killAllFXItems();
  }

  static calculateFinalDuration(particleLifetime, particleLifetimeNoise, lifeTime, delay) {
    if (particleLifetime < 0 || lifeTime < 0) {
      return -1;
    }
    let finalLifeTime = Math.max(0, delay) + lifeTime;
    if (particleLifetimeNoise > 0) {
      let maxParticleLifetime = PollenMath.relativeMap(particleLifetime, particleLifetimeNoise, 1);
      finalLifeTime += maxParticleLifetime;
    } else {
      finalLifeTime += particleLifetime;
    }
    return finalLifeTime;
  }

  generateNextParticleLifetime() {
    if (this.particleLifetimeNoise > 0) {
      return PollenMath.relativeMap(this.particleLifetime, this.particleLifetimeNoise, Math.random());
    } else {
      return this.particleLifetime;
    }
  }
}
