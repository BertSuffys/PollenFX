class FXManager {

  /* PARAMETERS */
  // children
  emitterManager;                      // Stores and manages all emitters
  // runnables
  runtime = 0;                         // time in milliseconds that the programm has been running
  lastTime = 0;                        // unupdated time in milliseconds that the programm has been running
  deltaTime = 0;                       // time passed between last two frames
  currentFPS = 0;                      // The current framerate
  totalDocumentClosedRuntime = 0;      // duration in milliseconds of the document being closed due to hiding or minimizing
  documentCloseTime = 0;               // timestamp in milliseconds when the document closed due to hiding or minimizing
  // config
  documentOpened = false;              // Whether the website window is opened or not. allows for pausing when on different tab
  built = false;                       // whether all initialization is complete
  started = false;                     // whether the FXManager was started
  canAct = false;                      // global field combining all other evaluation fields to base the act method on.
  static DEBUG = false;                // whether the debugging visuals must be displayed. static as must be available globally
  static ALLOW_DOM_OVERFLOW = false;   // whether or not overflow is allowed to occur on the body. static as there must only be such a value, regardless of manager count.
  static VERSION = "1.0.0";            // version

  

  /* CONSTRUCTOR */
  constructor() {
    this.setDocumentOpenHideHandler();
    this.emitterManager = new FXItemHybridLifeManager();   // emitters can be permanently active or temporarily active emitters, so always hybrid
  }



  /* FLUENT */
  withAllowDOMOverflow(allowDOMOverflow = true) {
    if(this.built){
      FXUtil.pollenFXError("setAllowDOMOverflow should only be called before building");
    }
    FXManager.ALLOW_DOM_OVERFLOW = allowDOMOverflow;
    return this;
  }

  setDebug(debug = true) {
    if(this.built){
      FXUtil.pollenFXError("setDebug should only be called before building");
    }
    FXManager.DEBUG = debug;
    return this;
  }

  build(start = true) {
    if (!this.built) {
      // sets the default pollenFX css
      FXUtil.addDocumentCSS([
        `.${PollenFXClasses.PFX_DISALLOW_OVERFLOW_CLASS}{${FXManager.ALLOW_DOM_OVERFLOW === true ? "overflow:auto;" : "overflow:hidden;"}}`,
      ]);
      // allow or disallow body overflow
      if (!FXManager.ALLOW_DOM_OVERFLOW) {
        FXUtil.disallowElementOverflow(document.body);
      }
      // propagate the building process
      this.emitterManager.build();
      // finish
      this.built = true;
    }
    this.setCanAct();
    // auto-start
    if(start){
      this.start();
    }
    return this;
  }



  /* METHODS */
  addEmitter(emitter) {
    this.emitterManager.addFXItem(emitter);
  }

  act(runtime) {
    if (this.canAct) {
      this.runtime = runtime - this.totalDocumentClosedRuntime;
      this.deltaTime = this.runtime - this.lastTime;
      this.currentFPS = this.deltaTime > 0 ? 1000 / this.deltaTime : 0; // clamped
      this.emitterManager.act(this.deltaTime);
      this.lastTime = this.runtime;
    }
  }

  pause(gentle = false) {
      this.emitterManager.pause();
  }

  restart(rebuild = true) {
    this.stop();
    if(rebuild){
      this.build();
    }
    this.start();
  }

  start() {
    if(!this.built){
      FXUtil.pollenFXError("The start() method cannot be called on an FXManager before build() gets called.")
    }else{
      this.started = true;
      this.setCanAct();
    }
    return this;
  }

  stop() {
    // todo cleanup
    this.emitterManager.killAllFXItems();
    this.started = false;
  }

  getAverigeAliveParticleCount(){
    // Note: This method assumes that all emitters are active at the same time and does not take into account delays, nor differences in duration.
    return this.emitterManager.allAddedFXItems.reduce((accum, emitter)=>{return accum + emitter.getAverigeAliveParticleCount()}, 0);
  }

  getCurrentAliveParticleCount(){
    // Note: This method assumes that all emitters are active at the same time and does not take into account delays, nor differences in duration.
    return this.emitterManager.getActiveFXItems().reduce((accum, emitter)=>{return accum + emitter.getCurrentAliveParticleCount()}, 0);
  }

  setDocumentOpenHideHandler() {
    this.documentOpened = !document.hidden;
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.documentOpened = false;
        this.documentCloseTime = performance.now();
      } else {
        this.documentOpened = true;
        this.totalDocumentClosedRuntime +=
          performance.now() - this.documentCloseTime;
      }
      this.setCanAct();
    });
    this.setCanAct();
  }

  getEmitterById(fxItemId) {
    return this.emitterManager.getFxItemById(fxItemId);
  }

  getFPS() {
    return this.currentFPS;
  }

  getActiveEmitters() {
    return this.emitterManager.getActiveFXItems();
  }

  setCanAct(){
    this.canAct = this.built && this.documentOpened && this.started;
  }

}
