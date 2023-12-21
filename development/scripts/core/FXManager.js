

class FXManager {

  /* Parameters */
  _emitterManager;
  _documentOpened;    // allows for pausing when on different tab
  _runtime;
  _lastTime = 0;
  _currentFPS = 0;
  _allowDOMOvervlow;
  static _devConfig = {
     DEBUG: false
  }



  constructor(allowDOMOvervlow = false) {
    /* emitters can be permanently active or temporarily active emitters, so always hybrid */
    this.emitterManager = new FXItemHybridLifeManager(1)
    this.documentOpened = !document.hidden
    this.setDocumentOpenHideHandler()
    /* Allow overflow out of the whole document or allow scrollbar */
    document.body.style.overflow = allowDOMOvervlow === true ? "scroll" : 'hidden';
  }

  setDocumentOpenHideHandler() {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.documentOpened = false
      } else {
        this.documentOpened = true
      }
    })
  }

  addEmitter(emitter, fxItemId = null) {
    this.emitterManager.addFXItem(emitter, fxItemId)
  }

  act(runtime) {
    this.runtime = runtime;
    const deltaTime = this.runtime - this.lastTime;
    this.currentFPS = 1000 / deltaTime;
    if (this.documentOpened) {
      this.emitterManager.act(deltaTime)
    }
    this.lastTime = this.runtime;
  }

  /**
* Attempts to collect and fxItem from the active pool by its provided ID
*/
  getFxItemById(fxItemId) {
    return this.emitterManager.getFxItemById(fxItemId);
  }


  getActiveEmitters() {
    return this.emitterManager.getActiveFXItems()
  }


  get emitterManager() {
    return this._emitterManager
  }
  set emitterManager(value) {
    this._emitterManager = value
  }
  get documentOpened() {
    return this._documentOpened
  }
  set documentOpened(value) {
    this._documentOpened = value
  }
  get runtime() {
    return this._runtime
  }
  set runtime(value) {
    this._runtime = value
  }
  get lastTime() {
    return this._lastTime;
  }
  set lastTime(value) {
    this._lastTime = value
  }
  get currentFPS() {
    return this._currentFPS;
  }
  set currentFPS(value) {
    this._currentFPS = value;
  }

  get allowDOMOvervlow() {
    return this._allowDOMOvervlow;
  }
  set allowDOMOvervlow(value) {
    this._allowDOMOvervlow = value;
  }

  static get devConfig() {
    return this._devConfig;
  }
  static set devConfig(value) {
    this._devConfig = value;
  }

}


