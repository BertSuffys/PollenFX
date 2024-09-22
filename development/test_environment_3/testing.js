
let fxManager;
FXManager.devConfig.DEBUG = false;


document.addEventListener('DOMContentLoaded', function () {
    fxManager = new FXManager(false)

    /* 1. Adds smoke */
    fxManager.addEmitter(getClouds(), "clouds");

    start(0);
});




function getClouds() {
    // Tools
    let anchor = document.getElementById("cloudWrapper");
    let origin = new CircularEmitterOrigin(150, 100, 600, 300, -1, -1, true, anchor);
    let emitter = new EmitterShoot(origin, 300, 3000, -1, -1, -1, -1);

    // Data
    const defaultData = new ParticleDefaultData(200, 200, origin, -1, -1, true);
    const customCSSData = new ParticleCustomCssData("mix-blend-mode: color-burn;", 100, 200);
    const particleFlipbookData = new ParticleFlipbookData("./img/smoke.png",-1, -1, 6, 5);
    emitter.addParticleData(defaultData);
    emitter.addParticleData(particleFlipbookData);
    emitter.addParticleData(customCSSData);


    // Behavior
    const flipbookBehavior = new ParticleFlipbookBehavior(100)
    const sizeByLifeBehavior = new ParticleSizeByLifeBehavior([0.5, 1, 1.3]);

    emitter.addParticleBehavior(sizeByLifeBehavior);
    emitter.addParticleBehavior(flipbookBehavior);



    // Return
    return emitter
}




/**
 * oore FX loop 
 */
function start(nowTime) {
    fxManager.act(nowTime);
    window.requestAnimationFrame(this.start);
}