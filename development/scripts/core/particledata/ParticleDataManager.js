


class ParticleDataManager {


    _particleData = new Map()
    _default_particle_styles = "position:absolute;"       // A default or general style always applied. Global styles might be appended externally


  
    constructor() { }
  
    getCSS() {
      let resultCSS = ""
      for (let [type, particleData] of this.particleData) {
        resultCSS += particleData.getCSS()
      }
      return resultCSS+this.default_particle_styles;
    }
  
    reset() {
      for (let [type, particleData] of this.particleData) {
        particleData.reset()
      }
    }
  
  
    ensureData(key) {
      let particleData = this.particleData.get(key)
      if (!valid(particleData)) {
        return this.createDefaultData(key)
      }
      return particleData
    }

    /**
     * Add an additional global style to the data manager which applies this to all particles
     */
    addDefaultCssStyle(style){
      this.default_particle_styles += style;
    }
  
    createDefaultData(key) {
      let newDefaultData
  
      switch (key) {
        case "direction":
          newDefaultData = ParticleDirectionData.createDefault()
          break
        case "rotation":
          newDefaultData = ParticleRotationData.createDefault()
          break
        case "image":
          newDefaultData = ParticleImageData.createDefault()
          break
        case "opacity":
          newDefaultData = ParticleOpacityData.createDefault()
          break
        case "flipbook":
          newDefaultData = ParticleFlipbookData.createDefault()
          break
        case "colorfilter":
          newDefaultData = ParticleColorfilterData.createDefault()
          break
        case "customCSS":
          newDefaultData = ParticleCustomCssData.createDefault()
          break
  
        case "default":
          newDefaultData = ParticleDefaultData.createDefault()
          break
      }
  
      this.particleData.set(key, newDefaultData)
      return newDefaultData
    }
  
    addParticleData(particleData) {
      this.particleData.set(particleData.type, particleData)
    }
  
    get particleData() {
      return this._particleData
    }
    set particleData(value) {
      this._particleData = value
    }


    get default_particle_styles() {
      return this._default_particle_styles
    }
    set default_particle_styles(value) {
      this._default_particle_styles = value
    }


  }
  