 class ParticleRotationBehavior extends ParticleBehavior {

    /* PARAMETERS */
     _rotation;                                  
     _rotationNoise;                           
     _rotationData;                           
     _allowReverse;




    /* CONSTRUCTOR */
    constructor(rotation, rotationNoise = null, allowReverse = true) {
        super("rotation")
        if (rotationNoise != null) {
            if(allowReverse){
                rotation = (Math.random()*rotationNoise) - (rotationNoise/2)
            }else{
                rotation = PollenMath.relativeMap(rotation, rotationNoise, Math.random())
            }
            rotation = rotation 
        }
        this.rotation = rotation;
        this.rotationNoise = rotationNoise;
        this.allowReverse = allowReverse;
    }


    /* METHODS */



    /**
     * Performs the behavior of the gravityparticlebehavior
     */
     act(particle, lastUpdateTime, deltaTime) {
        this.rotationData.rotation += this.rotation;
    }


    /**
     * Ensures that all data and or behaviorobjects are instantiated for this behavior type to function correctly.
     */
     ensureDependencies(particleDataManager , particleBehaviorManager) {
        this.rotationData = particleDataManager.ensureData("rotation")
    }


    /**
     * Gravitybehavior need not be unique for each particle, as
     */
    createNew(copy) {
        if (copy) {
            return this;
        }
        return new ParticleRotationBehavior(this.rotation, this.rotationNoise);
    }


    /**
     * Creates a default Particlebehavior object
     */
     static createDefault() {
        return new ParticleRotationBehavior(0.2, null);
    }



    /* GETTERS AND SETTERS */

     get allowReverse() {
        return this._allowReverse;
    }
     set allowReverse(value) {
        this._allowReverse = value;
    }
     get rotationNoise() {
        return this._rotationNoise;
    }
     set rotationNoise(value) {
        this._rotationNoise = value;
    }
     get rotation() {
        return this._rotation;
    }
     set rotation(value) {
        this._rotation = value;
    }
     get rotationData() {
        return this._rotationData;
    }
     set rotationData(value) {
        this._rotationData = value;
    }
}

