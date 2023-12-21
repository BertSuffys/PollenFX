class ParticleBehavior {
    static _IDEAL_FPS = 60
  
    /* CONSTRUCTOR */
    constructor(type) {
      this.type = type
    }
  
    /* GETTERS AND SETTERS */
    get type() {
      return this._type
    }
    set type(value) {
      this._type = value
    }
  
    static get IDEAL_FPS() {
      return ParticleBehavior._IDEAL_FPS
    }
  }