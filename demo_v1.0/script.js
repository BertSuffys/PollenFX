
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
    /* 4. Add lighting */
    fxManager.addEmitter(getLight(), "light");
    /* 5. Add fire */
    fxManager.addEmitter(getFlames(), "flames");
    /* 6. Add fire */
    fxManager.addEmitter(getBigSmoke(), "big_smoke");

    start(0);
});




function getBigSmoke() {
    // Tools
    let anchor = document.getElementById("logWrapper");
    let origin = new CircularEmitterOrigin(200, 110, 140, 100, -1, -1, true, anchor);
    let emitter = new EmitterShoot(origin, -1, -1, 3000, 8600, -1, 30)
    // Data
    const defaultData = new ParticleDefaultData(200, 200, origin, 0.5, 0.5, true);
    const directionData = new ParticleDirectionData(90, 6, 10, 2)
    const rotationData = new ParticleRotationData(127, 45)
    const cssData = new ParticleCustomCssData("mix-blend-mode: plus-darker;", 90, 105);
    const flipbookData = new ParticleFlipbookData("./img/smoke.png", -1, -1, 6, 5);
    const colorData = new ParticleColorfilterData(-30, new Color("#b05500"), -1, -1, -1, -1)
    emitter.addParticleData(defaultData);
    emitter.addParticleData(directionData);
    emitter.addParticleData(cssData);
    emitter.addParticleData(rotationData);
    emitter.addParticleData(flipbookData);
    emitter.addParticleData(colorData);
    // Behavior
    const opacityByLifeBehavior = new ParticleOpacityByLifeBehavior([0, 1, 0.7, 0]);
    const sizeByLifeBehavior = new ParticleSizeByLifeBehavior([0.5, 1, 1.3]);
    const flipbookBehavior = new ParticleFlipbookBehavior(100)
    const directionBehavior = new ParticleDirectionalBehavior()
    const colorFilterBehavior = new ParticleColorShiftBehavior(null, [1, 0], [10, 2, 0, 0])
    const windBehavior = new ParticleWindBehavior([90, 180], -1, 10)
    emitter.addParticleBehavior(opacityByLifeBehavior);
    emitter.addParticleBehavior(flipbookBehavior);
    emitter.addParticleBehavior(sizeByLifeBehavior);
    emitter.addParticleBehavior(directionBehavior);
    emitter.addParticleBehavior(colorFilterBehavior);
    emitter.addParticleBehavior(windBehavior);

    // Return
    return emitter
}



function getFlames() {
    // Tools
    let anchor = document.getElementById("logWrapper");
    let origin = new CircularEmitterOrigin(200, 150, 200, 70, -1, -1, true, anchor);
    let emitter = new EmitterShoot(origin, 0, -1, 2500, 7000, -1, 100);
    // Data
    const cssData = new ParticleCustomCssData("mix-blend-mode: overlay;", 100, 120);
    const defaultData = new ParticleDefaultData(40, 40, origin, -1, -1, -1, Pivot.CENTER, Pivot.END);
    const flipbookData = new ParticleFlipbookData("./img/fire.png", -1, -1, 4, 2);
    emitter.addParticleData(defaultData);
    emitter.addParticleData(flipbookData);
    emitter.addParticleData(cssData);
    // Behavior
    const flipbookBehavior = new ParticleFlipbookBehavior(60)
    const sizeBehavior = new ParticleSizeByLifeBehavior([0, 2], [0, 2], -1, 5, true, -1);
    const opacityByLifeBehavior = new ParticleOpacityByLifeBehavior(([0, 0, 0.5, 1, 0]));

    emitter.addParticleBehavior(flipbookBehavior);
    emitter.addParticleBehavior(sizeBehavior);
    emitter.addParticleBehavior(opacityByLifeBehavior);

    return emitter;
}





function getLight() {
    // Tools
    let anchor = document.getElementById("logWrapper");
    let origin = new PointEmitterOrigin(200, 60, -1, -1, true, anchor);
    let emitter = new EmitterShoot(origin, 1, 20, -1, -1, -1);
    // Data
    const cssData = new ParticleCustomCssData("background-color:#ff6f21; border-radius : 50px; mix-blend-mode: darker color; box-shadow: 0px 0px 92px 92px #ff6f21;", 800, 802);
    const defaultData = new ParticleDefaultData(100, 40, origin, -1, -1, true);
    const opacity = new ParticleOpacityData(0.3);
    emitter.addParticleData(defaultData);
    emitter.addParticleData(opacity);
    emitter.addParticleData(cssData);

    const sizeBehavior = new ParticleSizeByLifeBehavior([0, 1], null, 7000, -1, -1, 2)
    emitter.addParticleBehavior(sizeBehavior);
    // Behavior
    return emitter;
}

function getSparks() {
    // Tools
    let anchor = document.getElementById("logWrapper");
    let origin = new CircularEmitterOrigin(180, 80, 180, 100, -1, -1, true, anchor);
    let emitter = new EmitterBurst(origin, 10, -1, -1, 400, 5000, 2, 2000)
    // Data
    let cssData = new ParticleCustomCssData("background-color:#ff6f21; mix-blend-mode:screen; border-radius:30px; box-shadow: 0px 0px 24px 0px rgba(255,111,33,0.9);", 10, 30);
    let defaultData = new ParticleDefaultData(2, 1, origin, 12, 1, false);
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
    let colorData = new ParticleColorfilterData(-30, new Color("#b05500"), -1, -1, -1, -1)
    emitter.addParticleData(defaultData);
    emitter.addParticleData(directionData);
    emitter.addParticleData(rotationData);
    emitter.addParticleData(flipbookData);
    emitter.addParticleData(colorData);
    // Behavior
    const opacityByLifeBehavior = new ParticleOpacityByLifeBehavior([0, 0.6, 0.4, 0]);
    const sizeByLifeBehavior = new ParticleSizeByLifeBehavior([0.5, 1, 1.3]);
    const flipbookBehavior = new ParticleFlipbookBehavior(100)
    const directionBehavior = new ParticleDirectionalBehavior()
    const colorFilterBehavior = new ParticleColorShiftBehavior(null, [1, 0], [10, 2, 0, 0])
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
    let emitter = new EmitterShoot(origin, 100, 10000, 3000, 1000, 2)
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