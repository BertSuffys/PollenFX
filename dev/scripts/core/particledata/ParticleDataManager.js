class ParticleDataManager {
  /* FIELDS */
  particleData = new Map();
  default_particle_styles = "position:absolute;"; // A default or general style always applied. Global styles might be appended externally

  /* CONSTRUCTOR */
  constructor() {}

  /* FLUENT */
  build() {
    for (let [type, particleData] of this.particleData) {
      particleData.build();
    }
    return this;
  }

  /* METHODS */
  getCSS() {
    let resultCSS = "";
    for (let [type, particleData] of this.particleData) {
      resultCSS += particleData.getCSS();
    }
    return resultCSS + this.default_particle_styles;
  }

  reset() {
    for (let [type, particleData] of this.particleData) {
      particleData.reset();
    }
  }

  ensureData(key) {
    let particleData = this.particleData.get(key);
    if (!FXUtil.valid(particleData)) {
      return this.createDefaultData(key).build();
    }
    return particleData;
  }

  addDefaultCssStyle(style) {
    this.default_particle_styles += style;
  }

  addParticleData(particleData) {
    this.particleData.set(particleData.type, particleData);
  }

  getDataByKey(key){
    return this.particleData.get(key)
  }

  createDefaultData(key) {
    let newDefaultData;

    switch (key) {
      case "direction":
        newDefaultData = ParticleDirectionData.createDefault();
        break;
      case "rotation":
        newDefaultData = ParticleRotationData.createDefault();
        break;
      case "image":
        newDefaultData = ParticleImageData.createDefault();
        break;
      case "opacity":
        newDefaultData = ParticleOpacityData.createDefault();
        break;
      case "flipbook":
        newDefaultData = ParticleFlipbookData.createDefault();
        break;
      case "colorfilter":
        newDefaultData = ParticleColorfilterData.createDefault();
        break;
      case "customCSS":
        newDefaultData = ParticleCustomCssData.createDefault();
        break;

      case "default":
        newDefaultData = ParticleDefaultData.createDefault();
        break;
    }

    this.particleData.set(key, newDefaultData);
    return newDefaultData;
  }
}
