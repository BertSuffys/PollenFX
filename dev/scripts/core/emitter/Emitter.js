class Emitter extends FXItem {
  /* FIELDS */
  active;
  loop;                    // whether the emitter continues forever or not
  delay = 0;
  particleLifetime;        // Time in ms a particle is alive for
  particleLifetimeNoise;   // Noise multiplier, modifying the particle lifetime
  particleCount = null;    // amount of particles to be emitted over a certain emitterduration or present in a single burst.
  spawnedCount = 0;
  cutOff;
  emitterContainer;
  emitterBox;
  particleManager;
  emitterOrigin;
  particleBehavior = new Map();
  particleData = new Map();
  type;
  pausedGentle;            // If paused, whether it abruptly pauses everything, or lets the particles that were already alive continue.


  /* CONSTRUCTOR */
  constructor(emitterOrigin, type) {
    super(0);
    this.type = type
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
  
  addParticleData(data) {
    this.particleData.set(data.type, data);
    return this;
  }

  addParticleBehavior(behavior) {
    this.checkBehaviorValidityByEmitterType(behavior);
    this.particleBehavior.set(behavior.type, behavior);
    return this;
  }

  checkBehaviorValidityByEmitterType(behavior){
    if(this.type == 'burst'){
      if(behavior instanceof ParticleSpiralBehavior){
        FXUtil.pollenFXError("A burst emitter cannot be given particleSpiralBehavior.");
      }
    }
  }

  getActiveParticles() {
    return this.particleManager.getActiveFXItems();
  }

  reset() {
    super.reset(this.lifeTime);
    this.spawnedCount = 0;
    this.cutOff = 0;
    return this;
  }

  build() {
    if(this.particleCount == null){
      FXUtil.pollenFXError("An emitter must be initialized using .finite() or .infinite()!");
    }
    // setup
    super.setLifetime(Emitter.calculateFinalDuration(this.particleLifetime, this.particleLifetimeNoise, this.lifeTime, this.delay));
    this.loop = this.lifeTime < 0;
    this.active = this.delay <= 0;
    this.cutOff = 0;

    // create the particleManager
    this.createParticleManager();

    // build the origin
    this.emitterOrigin.build();

    // Set default data and behavior if none was provided
    if(this.mustAddDefaultDataAndBehavior()){
      this.setDefaultDataAndBehavior();
    }

    // Provide origin to defaultData if present, and if not, provide it.
    const particleDefaultData = this.particleData.get("default");
    if(!particleDefaultData){
      particleDefaultData = ParticleDefaultData.createDefault();
      this.addParticleData(particleDefaultData);
    }
    particleDefaultData.setEmitterOrigin(this.emitterOrigin);

    // All DOM related particle stuff
    this.createDOMDependencies();

    return this;
  }

  setDefaultDataAndBehavior(){
    // data
    const data_default = new ParticleDefaultData(20, 20).withClass("default_particle");
    const data_directional = new ParticleDirectionData(90, 200);
    const data_css = new ParticleCustomCssData(`background-color: red; border: 1px solid white; border-radius: 30px;`);
    this.addParticleData(data_directional);
    this.addParticleData(data_default);
    this.addParticleData(data_css);
    // behavior
    const behavior_size_by_life = new ParticleSizeByLifeBehavior([0,1,0]);
    const behavior_directional = new ParticleDirectionalBehavior();
    this.addParticleBehavior(behavior_size_by_life);
    this.addParticleBehavior(behavior_directional);
  }

  createParticleManager(){
    // infinite emitter
    if (this.particleLifetime <= 0) {
      this.particleManager = new FXItemManager(this.loop ? -1 : this.particleCount);
    }
    // finite emitter
    else {
      this.particleManager = new FXItemLifeManager(this.loop ? -1 : this.particleCount);
    }
  }

  pause(gentle=true){
    this.paused = true;
    this.pausedGentle = gentle;
    return this;
  }

  resume(){
    this.paused = false;
    this.pausedGentle = null;
    return this;
  }

  /* METHODS */
  act(deltaTime, startTimeMs) {
    super.act(deltaTime);
    if(!this.paused){
      this.checkSetActive();
      this.particleManager.act(deltaTime, startTimeMs);
    }else if(this.pausedGentle == true){
      this.particleManager.act(deltaTime, startTimeMs);
    }
  }

  checkSetActive(){
    if (this.delay > 0 && this.actTime > this.delay) {
      this.active = true;
    }
  }

  createDOMDependencies() {
    // The collapsed container
    this.emitterContainer = FXDom.createEmitterContainer(this.emitterOrigin, this.fxItemId);
    // The box or actual habitat
    this.emitterBox = FXDom.createEmitterBox(this.emitterOrigin, this.emitterContainer);
    // The size listeners
    if (this.emitterOrigin.anchorElement != null) {
      FXDom.initAnchorResizeObserver(this.emitterOrigin, this.emitterBox);
    } else {
      FXDom.initBodyResizeObserver(this.emitterBox);
    }
    // The origin debug
    if (FXManager.DEBUG) {
      switch (this.emitterOrigin.constructor.name) {
        case "CircularEmitterOrigin": {
          FXDom.createCircularOriginBox(this.emitterOrigin, this.emitterContainer, this.emitterBox);
          break;
        }
        case "LineEmitterOrigin": {
          FXDom.createLineOriginBox(this.emitterOrigin, this.emitterContainer, this.emitterBox);
          break;
        }
        case "PointEmitterOrigin": {
          FXDom.createPointOriginBox(this.emitterOrigin, this.emitterContainer, this.emitterBox);
          break;
        }
        default: {
          FXDom.createRectangularOriginBox(this.emitterOrigin, this.emitterContainer, this.emitterBox);
          break;
        }
      }
    }
  }

  mustAddDefaultDataAndBehavior(){
    return this.particleData.size == 0 && this.particleBehavior.size == 0;
  }

  spawn() {
    let newParticleLifetime = this.generateNextParticleLifetime();
    let particle;
    // Recycled particle from the inactive pool
    if (this.particleManager.canRecycle()) {
      particle = this.particleManager.recycle().reset(newParticleLifetime);
      particle.tryCreateParticleBox(this.emitterBox);
      particle.showCSS(this.emitterBox);                 // re-show the HTML element
    }
    // Newly created particle
    else {
      particle = new Particle(newParticleLifetime)
      for (let [key, value] of this.particleData) {
        particle.addParticleData(value.createNew(false));
      }
      for (let [key, value] of this.particleBehavior) {
        particle.addParticleBehavior(value.createNewBehavior(false));
      }
    }
    this.particleManager.activeFXItemPool.enqueue(particle);
    particle.build();
    particle.tryCreateParticleBox(this.emitterBox);
  }

  die(cleanDOM) {
    this.particleManager.killAllFXItems(true);
  }

  revive() {
    this.reset()
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
    }
      return this.particleLifetime;
  }

  getCurrentAliveParticleCount() {
    return this.particleManager.getActiveFXItemCount()
  }
}
