class Particle extends FXItem{

  /* Parameters */
  _dataManager;
  _behaviorManager;
  _particleBox;                                              // html element representing the particle
  _emitterBox;                                               // Parent emitter spawn box


  /* Constructor */
  constructor(lifetime) {
    super(Math.max(0, lifetime))
    this.dataManager = new ParticleDataManager()
    this.behaviorManager = new ParticleBehaviorManager()

    if(lifetime < 200){
      console.log(lifetime)
    }
  }

      

  /**
 * Coor loop behavior of a particle
 */
  act(deltaTime) {
    this.behaviorManager.act(this, super.actTime , deltaTime)
    super.act(deltaTime)        // used to be underneath this.behaviorManager.act(th...
    this.updateStyle();
  }



  /**
   * Creates the html element representing the particle and attaches it to the emitterBox
   */
  createParticleBox(emitterBox) {
    if (emitterBox != null && this.particleBox == null) {
      this.emitterBox = emitterBox
      this.particleBox = document.createElement('div');                            // create
      this.particleBox.classList.add(PollenFXClasses.PARTICLE_BOX_CLASS)           // add class
      this.updateStyle();                                                          // start css
      this.emitterBox.appendChild(this.particleBox);                               // empty anchor? just add
    }
  }

  /**
   * Removes the particlebox from the DOM through detaching it from its parent, making it invisible 
   */
  hideCSS() {
    this.particleBox.setAttribute('style', 'display:none;');
   // this.emitterBox.removeChild(this.particleBox);              // performance ??
  }

  /**
   * Adds the particlebox from the DOM through appending it from its parent, making it visible
   */
  showCSS() {
    //this.emitterBox.appendChild(this.particleBox);              // performance ??
    this.particleBox.setAttribute('style', 'display:block;');
    this.updateStyle();
  }



  /**
  * Collects all css from its dataobjects and applies it to the css of the particleBox
  */
  updateStyle() {
    this.particleBox.setAttribute('style', this.getCSS());
  }


  /**
* Adds particle data to the particle
*/
  addParticleData(particleData) {
    this.dataManager.addParticleData(particleData)
  }

  /**
* Adds particle behavior to the particle
*/
  addParticleBehavior(behavior) {
    this.behaviorManager.addParticleBehavior(behavior, this.dataManager)
    behavior.applyParticle(this)
  }

  /**
* Retrieves all CSS of all particle data-objects
*/
  getCSS() {
    return this.dataManager.getCSS()
  }


  disableBehavior(type) {
    this.behaviorManager.disableBehavior(type)
  }


  enableBehavior(type) {
    this.behaviorManager.enableBehavior(type)
  }

  /**
  * Particle FXItems do not carry FXItems as a child -> DO nothing
  */
  notifyDead(){
    this.hideCSS()
  }

  getClassName(){
    return "particle"
  }


  reset(lifeTime) {
    super.reset(lifeTime)
    this.behaviorManager.reset(this)
    this.dataManager.reset()
    return this
  }


  get emitterBox() {
    return this._emitterBox
  }
  set emitterBox(value) {
    this._emitterBox = value
  }
  get particleBox() {
    return this._particleBox
  }
  set particleBox(value) {
    this._particleBox = value
  }
  get index() {
    return this._index
  }
  set index(value) {
    this._index = value
  }
  get dataManager() {
    return this._dataManager
  }
  set dataManager(value) {
    this._dataManager = value
  }
  get behaviorManager() {
    return this._behaviorManager
  }
  set behaviorManager(value) {
    this._behaviorManager = value
  }
}

