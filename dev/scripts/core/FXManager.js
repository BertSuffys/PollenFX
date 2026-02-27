class FXManager {
  /* PARAMETERS */
  // children
  emitterManager; // Stores and manages all emitters
  // runnables
  startTime = 0; // actual start time when the FXManager was started.
  runtime = 0; // time in milliseconds that the programm has been running for.
  lastRuntime = 0; // unupdated time in milliseconds that the programm has been running
  deltaTime = 0; // time passed between last two frames
  // config
  built = false; // whether all initialization is complete
  started = false; // whether the FXManager was started
  stopped = false; // whether the FXManager was stopped
  canAct = false; // global field combining all other evaluation fields to base the act method on.
  static DEBUG = false; // whether the debugging visuals must be displayed. static as must be available globally
  static ALLOW_DOM_OVERFLOW = false; // whether or not overflow is allowed to occur on the body. static as there must only be such a value, regardless of manager count.
  static VERSION = "1.0.0"; // version
  // misc
  subscribers = [];
  // animation
  renderfunction = (nowTime) => {
    this.act(nowTime);
    window.requestAnimationFrame(this.renderfunction);
  };
  // document visibility
  totalDocumentClosedRuntime = 0; // duration in milliseconds of the document being closed due to hiding or minimizing
  documentCloseTime = 0; // timestamp in milliseconds when the document closed due to hiding or minimizing
  documentOpened = false; // Whether the website window is opened or not. allows for pausing when on different tab

  /* CONSTRUCTOR */
  constructor() {
    this.setDocumentOpenHideHandler();
    this.emitterManager = new FXItemHybridLifeManager(); // emitters can be permanently active or temporarily active emitters, so always hybrid
  }

  /* FLUENT */
  withAllowDOMOverflow(allowDOMOverflow = true) {
    if (this.built) {
      FXUtil.pollenFXError("setAllowDOMOverflow should only be called before building");
    }
    FXManager.ALLOW_DOM_OVERFLOW = allowDOMOverflow;
    return this;
  }

  setDebug(debug = true) {
    if (this.built) {
      FXUtil.pollenFXError("setDebug should only be called before building");
    }
    FXManager.DEBUG = debug;
    return this;
  }

  build(start = true) {
    if (!this.built) {
      // sets the default pollenFX css
      FXUtil.addDocumentCSS([`.${PollenFXClasses.PFX_DISALLOW_OVERFLOW_CLASS}{${FXManager.ALLOW_DOM_OVERFLOW === true ? "overflow:auto;" : "overflow:hidden;"}}`]);
      // allow or disallow body overflow
      if (!FXManager.ALLOW_DOM_OVERFLOW) {
        FXUtil.disallowElementOverflow(document.body);
      }
      // Add default emitter, if building without emitters
      if (!this.emitterManager.hasAnyFXItem()) {
        this.addDefaultEmitter();
      }
      // propagate the building process
      this.emitterManager.build();
      // start the loop
      window.requestAnimationFrame(this.renderfunction);
      // finish
      this.built = true;
    }
    this.setCanAct();
    // auto-start
    if (start) {
      this.start();
    }
    return this;
  }

  addEmitter(emitter) {
    this.emitterManager.addFXItem(emitter);
    return this;
  }

  subscribe(subscription) {
    if (typeof subscription !== "function") {
      FXUtil.pollenFXError("You must only subscribe to an FXManager with functions of type void=>(runtime, fxManager)");
      return;
    }
    this.subscribers.push(subscription);
    return this;
  }

  start() {
    if (this.canStart()) {
      if (this.stopped) {
        this.emitterManager.reviveAllFXItems();
        this.emitterManager.resume();
      }
      this.reset();
      this.started = true;
      this.stopped = false;
      this.setCanAct();
    }
    return this;
  }

  /* METHODS */
  stop() {
    this.started = false;
    this.stopped = true;
    this.setCanAct();
    this.emitterManager.killAllFXItems(false);
  }

  restart() {
    this.stop();
    this.start();
  }

  pause(gentle = false) {
    this.emitterManager.pause(gentle);
  }

  resume() {
    this.emitterManager.resume();
  }

  pauseEmitter(id, gentle = true) {
    this.emitterManager.pauseFXItem(id, gentle);
  }

  resumeEmitter(id) {
    this.emitterManager.resumeFXItem(id);
  }

  getAverigeAliveParticleCount() {
    // Note: This method assumes that all emitters are active at the same time and does not take into account delays, nor differences in duration.
    return this.emitterManager.allAddedFXItems.reduce((accum, emitter) => {
      return accum + emitter.getAverigeAliveParticleCount();
    }, 0);
  }

  getCurrentAliveParticleCount() {
    return this.emitterManager.getActiveFXItems().reduce((accum, emitter) => {
      return accum + emitter.getCurrentAliveParticleCount();
    }, 0);
  }

  getEmitterById(fxItemId) {
    return this.emitterManager.getFxItemById(fxItemId);
  }

  getFPS() {
    const currentFPS = this.deltaTime > 0 ? 1000 / this.deltaTime : 0;
    return Math.round(currentFPS);
  }

  getActiveEmitters() {
    return this.emitterManager.getActiveFXItems();
  }

  act(nowTime) {
    if (this.documentOpened) {
      // calculation update
      this.runtime = nowTime - this.totalDocumentClosedRuntime;
      this.deltaTime = this.runtime - this.lastRuntime;
      this.lastRuntime = this.runtime;  
      // logic update
      if (this.canAct) {
        this.emitterManager.act(this.deltaTime, this.startTime);
        for (let subscriber of this.subscribers) {
          subscriber(this.runtime, this);
        }
      }
    }
  }

  canStart() {
    if (this.started) {
      return false;
    }
    if (!this.built) {
      FXUtil.pollenFXError("The start() method cannot be called on an FXManager before build() gets called.");
      return false;
    }
    return true;
  }

  reset() {
    // note: lastRuntime must never be reset, as runtime itself never resets.
    this.startTime = performance.now();
    this.runtime = 0;
    this.deltaTime = 0;
    this.totalDocumentClosedRuntime = 0;
  }

  setDocumentOpenHideHandler() {
    this.documentOpened = !document.hidden;
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.documentOpened = false;
        this.documentCloseTime = performance.now();
      } else {
        this.documentOpened = true;
        this.totalDocumentClosedRuntime += performance.now() - this.documentCloseTime;
      }
      this.setCanAct();
    });
    this.setCanAct();
  }

  addDefaultEmitter() {
    const originSize = 40;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const origin = new CircularEmitterOrigin(windowWidth / 2 - originSize / 2, windowHeight / 2 - originSize / 2, originSize, originSize);
    let emitter = new EmitterShoot(origin).infinite(50, 1000);
    this.addEmitter(emitter);
  }

  setCanAct() {
    this.canAct = this.built && this.documentOpened && this.started;
  }
}
