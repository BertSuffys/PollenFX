
/**
 * Setup
 */
let fxManager;
document.addEventListener('DOMContentLoaded', function () {
    fxManager = new FXManager();
    fxManager.addEmitter(getEmitter(), "myEmitter");
    start(0);
});


/**
 * Function emitter creation function
 */
function getEmitter() {
    
    /* Anchor, origin and emitter */
    let anchor = document.getElementById("my_element");
    let origin = new CircularEmitterOrigin(50, 0, 100, 100, -1, -1, true, anchor);
    let emitter = new EmitterShoot(origin, 400, 2000, 700, 1000, 2);

    /* Data */
    const defaultData = new ParticleDefaultData(14, 7, origin, 1, 1, true);
    const cssData = new ParticleCustomCssData("background-color:red;border:1px solid black; border-radius:5px;", 30, 500);
    const directionData = new ParticleDirectionData(90, 7, 50, 4);
    emitter.addParticleData(cssData);
    emitter.addParticleData(defaultData);
    emitter.addParticleData(directionData);

    /* Behavior */
    const directionBehavior = new ParticleDirectionalBehavior()
    const gravityBehavior = new ParticleGravityBehavior(10, 4)
    const sizeByLifeBehavior = new ParticleSizeByLifeBehavior([0,1,0])
    const rotationByDirectionBehavior = new ParticleRotationByDirectionBehavior()
    emitter.addParticleBehavior(directionBehavior);
    emitter.addParticleBehavior(gravityBehavior);
    emitter.addParticleBehavior(sizeByLifeBehavior);
    emitter.addParticleBehavior(rotationByDirectionBehavior);

    return emitter;
}


/**
 * Core logic loop
 */
function start(runtimeInMs) {
    fxManager.act(runtimeInMs);
    window.requestAnimationFrame(this.start);
}



