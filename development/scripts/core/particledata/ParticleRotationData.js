
class ParticleRotationData extends ParticleData {

    constructor(rotation, coneNoise = -1) {
      super("rotation")
      if (coneNoise >= 0) {
        this.rotation = rotation + (Math.random() * coneNoise - coneNoise / 2)
      } else {
        this.rotation = rotation
      }
      this.coneNoise = coneNoise
    }
  
    getCSS() {
      return  `transform: rotate(${this.rotation}deg);` 
    }
  
    reset() {
      return this
    }
  
    createNew(copy) {
      if (copy) {
        return this
      }
      return new ParticleRotationData(this.rotation, this.coneNoise)
    }
  
    static createDefault() {
      return new ParticleRotationData(0)
    }
  
    get coneNoise() {
      return this._coneNoise
    }
    set coneNoise(value) {
      this._coneNoise = value
    }
    get rotation() {
      return this._rotation
    }
    set rotation(value) {
      this._rotation = value
    }
  }
  