class FXItem {


    _spawnTime;              // Moment/date (in ms) when spawning
    _actTime;                // Time (in ms) something is alive for
    _lifeTime;               // Time (in ms) something should in total be alive for
    _liveTime;               // spawnTime + actTime, in essence.
    _fxItemId;               // Unique identifier


    /**
     * Constructor
     */
    constructor(lifeTime) {
        this.lifeTime = lifeTime;
        this.spawnTime = Date.now()
        this.liveTime = this.spawnTime;
        this.actTime = 0;
    }

    /**
     * Core FXItem Logic
     */
    act(deltaTime) {
        this.actTime += deltaTime;
        this.liveTime += deltaTime;
    }

    /**
    * Checks whether an FXItem has come to the end of its life
    */
    isDead() {
        return this.actTime >= this.lifeTime;
    }


    /**
     * When an FXItem dies, it might have to kill underlying child FX Items if neccesairy. This method is considered abstract and must be implemented
     */
    notifyDead() {
        pollenFXError("The notifyDead method is considered abstract and was not implemented by an FXItem subclass.");
    }



    hideCSS() {
        pollenFXError("The hideCSS method is considered abstract and was not implemented by an FXItem subclass.");
    }


    showCSS() {
        pollenFXError("The showCSS method is considered abstract and was not implemented by an FXItem subclass.");
    }


    getClassName() {
        pollenFXError("The getClassName method is considered abstract and was not implemented by an FXItem subclass.");
    }



    get liveTime() {
        return this._liveTime;
    }

    set liveTime(value) {
        this._liveTime = value;
    }

    get lifeTime() {
        return this._lifeTime;
    }

    set lifeTime(value) {
        this._lifeTime = value;
    }

    get FXItemId() {
        return this._fxItemId;
    }

    set FXItemId(value) {
        this._fxItemId = value;
    }


    get spawnTime() {
        return this._spawnTime;
    }

    set spawnTime(value) {
        this._spawnTime = value
    }


    get actTime() {
        return this._actTime;
    }

    set actTime(value) {
        this._actTime = value
    }


}
