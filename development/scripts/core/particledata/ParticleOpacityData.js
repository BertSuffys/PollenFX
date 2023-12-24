
class ParticleOpacityData extends ParticleData {

    constructor(opacity = 1, opacityNoise = -1) {
      super("opacity")
      this.initialOpacity = opacity
      this.opacityNoise = opacityNoise
      if (opacityNoise > 0) {
        this.opacity = Math.min(
          1,
          Math.max(
            0,
            PollenMath.relativeMap(opacity, 1 + opacityNoise, Math.random())
          )
        )
      } else {
        this.opacity = opacity
      }
    }
  
    getCSS() {
      return  `opacity: ${this.opacity};` 
    }
  
    reset() {
    }
  
    createNew(copy) {
      if (copy) {
        return this
      }
      return new ParticleOpacityData(this.initialOpacity, this.opacityNoise)
    }
  
    static createDefault() {
      return new ParticleOpacityData(1)
    }
  
    get opacity() {
      return this._opacity
    }
    set opacity(value) {
      this._opacity = value
    }
  
    get initialOpacity() {
      return this._initialOpacity
    }
    set initialOpacity(value) {
      this._initialOpacity = value
    }
  
    get opacityNoise() {
      return this._opacityNoise
    }
    set opacityNoise(value) {
      this._opacityNoise = value
    }
  }