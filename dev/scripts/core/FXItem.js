class FXItem {

    /* PARAMETERS */
    spawnTime;              // Moment/date (in ms) when spawning
    actTime;                // Time (in ms) something is alive for
    lifeTime;               // Time (in ms) something should in total be alive for
    liveTime;               // spawnTime + actTime, in essence.
    fxItemId;               // Unique identifier
    paused;                 // Whether this FXItem is paused



    /* CONSTRUCTOR */
    constructor(lifeTime) {
        this.setLifetime(lifeTime);
        this.spawnTime = Date.now();
        this.liveTime = this.spawnTime;
        this.actTime = 0;
    }



    /* METHODS */
    act(deltaTime) {
        if(!this.paused){
            this.actTime += deltaTime;
        }
        this.liveTime += deltaTime;
    }

    isDead() {
        return (this.actTime >= this.lifeTime);
    }

    reset(lifeTime) {
        this.lifeTime = lifeTime;
        this.spawnTime = Date.now();
        this.liveTime = this.spawnTime;
        this.actTime = 0;
    }

    isPermanent() {
        return this.lifeTime == -1;
    }

    die(cleanDOM) {
        FXUtil.pollenFXError("The die method is considered abstract and was not implemented by an FXItem subclass.");
    }

    revive() {
        FXUtil.pollenFXError("The revive method is considered abstract and was not implemented by an FXItem subclass.");
    }

    hideCSS() {
        FXUtil.pollenFXError("The hideCSS method is considered abstract and was not implemented by an FXItem subclass.");
    }

    showCSS() {
        FXUtil.pollenFXError("The showCSS method is considered abstract and was not implemented by an FXItem subclass.");
    }

    getClassName() {
        FXUtil.pollenFXError("The getClassName method is considered abstract and was not implemented by an FXItem subclass.");
    }

    /* FLUENT */
    withId(id){
        if(FXUtil.valid(id)){
            this.fxItemId = id;
        }else{
            FXUtil.pollenFXError("An invalid fxItemId was provided in the withId() method.");
        }
        return this;
    }

    /* GETTERS AND SETTERS */
    setLifetime(lifeTime){
        this.lifeTime = lifeTime ?? -1;
    }
}
