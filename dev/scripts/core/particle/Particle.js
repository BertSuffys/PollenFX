class Particle extends FXItem {
  /* FIELDS */
  dataManager;     // manager of this particle's data
  behaviorManager; // manager of this particle's behavior
  particleBox;     // html element representing the particle
  emitterBox;      // Parent emitter spawn box



  /* CONSTRUCTOR */
  constructor(lifetime) {
    super(Math.max(0, lifetime));
    this.dataManager = new ParticleDataManager();
    this.behaviorManager = new ParticleBehaviorManager();
  }



  /* FLUENT */
  build() {
    this.dataManager.build(this.dataManager, this.behaviorManager, this);
    this.behaviorManager.build(this.dataManager, this.behaviorManager, this);
    return this;
  }

  reset(lifeTime) {
    super.reset(lifeTime);
    this.behaviorManager.reset(this);
    this.dataManager.reset();
    return this;
  }



  /* METHODS */
  act(deltaTime, startTimeMs) {
    super.act(deltaTime);
    this.behaviorManager.act(this, startTimeMs, deltaTime);
    this.updateStyle();
  }

  tryCreateParticleBox(emitterBox) {
    if (emitterBox != null && !this.particleBox) {
      this.emitterBox = emitterBox;
      this.particleBox = document.createElement("div"); 
      this.particleBox.classList.add(PollenFXClasses.PARTICLE_BOX_CLASS); 
      const particleBoxClass = this.dataManager.getDataByKey("default")?.particleBoxClass;
      if (particleBoxClass) {
        this.particleBox.classList.add(particleBoxClass); 
      }
      this.updateStyle();
      this.emitterBox.appendChild(this.particleBox); 
    }
  }

  removeParticleBox() {
    this.emitterBox.removeChild(this.particleBox);
    this.particleBox = null;
  }

  hideCSS() {
    this.particleBox.setAttribute("style", "display:none;");
  }

  showCSS() {
    this.particleBox.setAttribute("style", "display:block;");
    this.updateStyle();
  }

  updateStyle() {
    this.particleBox.setAttribute("style", this.getCSS());
  }

  addParticleData(particleData) {
    this.dataManager.addParticleData(particleData);
  }

  addParticleBehavior(behavior) {
    this.behaviorManager.addParticleBehavior(behavior, this.dataManager);
  }

  getCSS() {
    return this.dataManager.getCSS();
  }

  disableBehavior(type) {
    this.behaviorManager.disableBehavior(type);
  }

  enableBehavior(type) {
    this.behaviorManager.enableBehavior(type);
  }

  die(cleanDOM = false) {
    if(cleanDOM){
      this.removeParticleBox()
      return;
    }
    this.hideCSS();
  }

  revive() {
    this.showCSS();
  }
}
