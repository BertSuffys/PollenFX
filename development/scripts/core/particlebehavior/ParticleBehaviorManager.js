class ParticleBehaviorManager {

    _particleBehavior = new Map()
    _disabledBehaviors = new Map()

    constructor() { }

    act(particle, actTime, deltaTime) {
        for (let [key, value] of this.particleBehavior) {
            value.act(particle, actTime, deltaTime)
        }
    }


      build() {
        // TODO
    }

    reset(particle) {
        this.disabledBehaviors.forEach((disabledBehavior, type) => {
            this.particleBehavior.set(type, disabledBehavior)
        })
        this.disabledBehaviors.clear()
        for (let [type, particleBehavior] of this.particleBehavior) {
            particle.lifeTime
            particleBehavior.applyParticle(particle)
            particleBehavior.reset()
        }
    }


    addParticleBehavior(particleBehavior, particleDataManager) {
        particleBehavior.ensureDependencies(particleDataManager, this)
        this.particleBehavior.set(particleBehavior.type, particleBehavior)
    }


    ensureBehavior(key) {
        let particleBehavior = this.particleBehavior.get(key)
        if (!FXUtil.valid(particleBehavior)) {
            return this.createDefaultBehavior(key)
        }
    }


    disableBehavior(type) {
        let behaviorToDisable = this.particleBehavior.get(type)
        this.disabledBehaviors.set(behaviorToDisable.type, behaviorToDisable)
        this.particleBehavior.delete(behaviorToDisable.type)
    }


    enableBehavior(type) {
        let behaviorToDisable = this.disabledBehaviors.get(type)
        if (behaviorToDisable != null) {
            this.particleBehavior.set(behaviorToDisable.type, behaviorToDisable)
            this.disabledBehaviors.delete(behaviorToDisable.type)
        }
    }


    createDefaultBehavior(key) {
        let newDefaultBehavior
        switch (key) {
            case "direction":
                newDefaultBehavior = ParticleDirectionalBehavior.createDefault()
                break
            case "gravity":
                newDefaultBehavior = ParticleGravityBehavior.createDefault()
                break
            case "wind":
                newDefaultBehavior = ParticleWindBehavior.createDefault()
                break
            case "flipbook":
                newDefaultBehavior = ParticleFlipbookBehavior.createDefault()
                break
            case "rotation":
                newDefaultBehavior = ParticleRotationBehavior.createDefault()
                break
            case "opacity":
                newDefaultBehavior = ParticleOpacityByLifeBehavior.createDefault()
                break
            case "colorfilter":
                newDefaultBehavior = ParticleColorShiftBehavior.createDefault()
                break
            case "colorshift":
                newDefaultBehavior = ParticleColorShiftBehavior.createDefault()
                break
        }
        this.particleBehavior.set(key, newDefaultBehavior)
        return newDefaultBehavior
    }




    static createDefault() {
        return new ParticleGravityBehavior(0.01, 1)
    }

    get particleBehavior() {
        return this._particleBehavior
    }
    set particleBehavior(value) {
        this._particleBehavior = value
    }
    get disabledBehaviors() {
        return this._disabledBehaviors
    }
    set disabledBehaviors(value) {
        this._disabledBehaviors = value
    }
}

