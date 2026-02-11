class ParticleRotationByDirectionBehavior extends ParticleBehavior {

  /* FIELDS */
  /* CONSTRUCTOR */
  /* FLUENT */
  /* METHODS */
    _offset;                   // offset (in degrees) added to the direction angle of the particle
    _particleDirectionData;
    _particleRotationData;



    /* Constructor */
    constructor(offset = -1) {
        super("rotation");
        this.offset = offset == -1 ? 0 : Math.max(0, Math.min(360, offset));
    }


    reset() {

    }

    
    applyParticle(particle) { }

    /**
     * Ensures all data/behavior this behavior object requires to function is created
     */
    ensureDependencies(particleDataManager, particleBehaviorManager) {
        this.particleDirectionData = particleDataManager.ensureData("direction")
        this.particleRotationData = particleDataManager.ensureData("rotation")

    }



     /**
     * Alters the particles rotation so as to always match the direction its going towards.
     */
    act(particle, actTime, deltaTime){
        const hypotenuse = Math.sqrt(Math.pow(this.particleDirectionData.directionX, 2) + this.particleDirectionData.directionX, 2);
        const normalizedYFactor = this.particleDirectionData.directionY/hypotenuse;
        const normalizedXFactor = this.particleDirectionData.directionX/hypotenuse;
        this.particleRotationData.rotation = PollenMath.radToDeg(Math.atan(normalizedYFactor/normalizedXFactor) + this.offset);
    }


      build() {
        // TODO
    }


    createNewBehavior(copy) {
        if (copy) {
            return this;
        } else {
            return new ParticleRotationByDirectionBehavior(this.offset);
        }
    }



    static createDefault() {
        return new ParticleRotationByDirectionBehavior();
    }





    get offset() {
        return this._offset
    }
    set offset(value) {
        this._offset = value
    }


    get particleDirectionData() {
        return this._particleDirectionData
    }
    set particleDirectionData(value) {
        this._particleDirectionData = value
    }


    get particleRotationData() {
        return this._particleRotationData
    }
    set particleRotationData(value) {
        this._particleRotationData = value
    }
}