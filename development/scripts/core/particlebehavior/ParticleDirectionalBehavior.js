
class ParticleDirectionalBehavior extends ParticleBehavior {

  constructor() {
    super("direction")
  }


  act(particle, actTime, deltaTime) {
    this._particleDefaultData.posX += this.particleDirectionData.directionX * (deltaTime / FXManager.IDEAL_FPS)
    this._particleDefaultData.posY += this.particleDirectionData.directionY * (deltaTime / FXManager.IDEAL_FPS)
  }


  ensureDependencies(particleDataManager, particleBehaviorManager) {
    this.particleDirectionData = particleDataManager.ensureData("direction")
    this._particleDefaultData = particleDataManager.ensureData("default")
  }


  reset() { }


  static createDefault() {
    return new ParticleDirectionalBehavior()
  }


  applyParticle(particle) { }


      build() {
        // TODO
    }

  createNew(copy) {
    if (copy) {
      return this
    } else {
      return new ParticleDirectionalBehavior()
    }
  }


  get particleDefaultData() {
    return this._particleDefaultData
  }
  set particleDefaultData(value) {
    this._particleDefaultData = value
  }

  get particleDirectionData() {
    return this._particleDirectionData
  }
  set particleDirectionData(value) {
    this._particleDirectionData = value
  }
}
