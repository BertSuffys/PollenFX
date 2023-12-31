
let fxManager;
FXManager.devConfig.DEBUG = false;


document.addEventListener('DOMContentLoaded', function () {
    fxManager = new FXManager(false)

    /* 1. Adds embers */
    fxManager.addEmitter(getEmbers(), "embers");
    /* 2. Adds light smoke */
    fxManager.addEmitter(getLightSmoke(), "light_smoke");
    /* 3. Adds sparks */
    fxManager.addEmitter(getSparks(), "sparks");

    start(0);
});



function getSparks() {
    // Tools
    let anchor = document.getElementById("logWrapper");
    let origin = new CircularEmitterOrigin(180, 80, 180, 100, -1, -1, true, anchor);
    let emitter = new EmitterBurst(origin, 10, -1, -1, 400, 5000, 2, 2000)
    // Data
    let cssData = new ParticleCustomCssData("background-color:#ff6f21; mix-blend-mode:screen; border-radius:30px; box-shadow: 0px 0px 24px 0px rgba(255,111,33,0.9);", 10, 30);
    let defaultData = new ParticleDefaultData(3, 2, origin, 0.5, 0.5, true);
    let directionData = new ParticleDirectionData(90, 6, 180, 10)
    emitter.addParticleData(defaultData);
    emitter.addParticleData(cssData);
    emitter.addParticleData(directionData);
    // Behavior
    let directionBehavior = new ParticleDirectionalBehavior()
    let gravityBehavior = new ParticleGravityBehavior(60, 5)
    let rotationByDirectionBehavior = new ParticleRotationByDirectionBehavior()
    emitter.addParticleBehavior(directionBehavior);
    emitter.addParticleBehavior(gravityBehavior);
    emitter.addParticleBehavior(rotationByDirectionBehavior);

    return emitter
}

function getLightSmoke() {
    // Tools
    let anchor = document.getElementById("logWrapper");
    let origin = new CircularEmitterOrigin(200, 110, 140, 100, -1, -1, true, anchor);
    let emitter = new EmitterShoot(origin, 350, 10000, 2000, 4000, 0.2)
    // Data
    let defaultData = new ParticleDefaultData(100, 100, origin, 0.5, 0.5, true);
    let directionData = new ParticleDirectionData(90, 6, 10, 2)
    let rotationData = new ParticleRotationData(127, 45)
    let flipbookData = new ParticleFlipbookData("./img/smoke.png", -1, -1, 6, 5);
    emitter.addParticleData(defaultData);
    emitter.addParticleData(directionData);
    emitter.addParticleData(rotationData);
    emitter.addParticleData(flipbookData);
    // Behavior
    const opacityByLifeBehavior = new ParticleOpacityByLifeBehavior([0, 0.01, 0.1, 0.4, 0]);
    const sizeByLifeBehavior = new ParticleSizeByLifeBehavior([0.5, 1, 1.3]);
    const flipbookBehavior = new ParticleFlipbookBehavior(100)
    const directionBehavior = new ParticleDirectionalBehavior()
    const colorFilterBehavior = new ParticleColorfilterBehavior([new Color("#eb5f1a"), new Color('#888833')])
    emitter.addParticleBehavior(opacityByLifeBehavior);
    emitter.addParticleBehavior(flipbookBehavior);
    emitter.addParticleBehavior(sizeByLifeBehavior);
    emitter.addParticleBehavior(directionBehavior);
    emitter.addParticleBehavior(colorFilterBehavior);
    // Return
    return emitter
}



function getEmbers() {
    // Tools
    let anchor = document.getElementById("logWrapper");
    let origin = new CircularEmitterOrigin(200, 110, 140, 100, -1, -1, true, anchor);
    let emitter = new EmitterShoot(origin, 50, 10000, 3000, 1000, 2)
    // Data
    let defaultData = new ParticleDefaultData(10, 10, origin, 0.5, 0.5, true);
    let cssData = new ParticleCustomCssData("background-color:#eb5f1a; border-radius:30px; mix-blend-mode: overlay; box-shadow: 0px 0px 10px 16px #eb5f1a;", 30, 500);
    let rotationData = new ParticleRotationData(127, 45)
    emitter.addParticleData(defaultData);
    emitter.addParticleData(cssData);
    emitter.addParticleData(rotationData);
    // Behavior
    const opacityByLifeBehavior = new ParticleOpacityByLifeBehavior([0, 0.6, 0], -1, 1500);
    emitter.addParticleBehavior(opacityByLifeBehavior);
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