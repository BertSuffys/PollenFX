class ParticleData {
    
    _type;

    constructor(type) {
      this.type = type
    }
    get type() {
      return this._type
    }
    set type(value) {
      this._type = value
    }
  }