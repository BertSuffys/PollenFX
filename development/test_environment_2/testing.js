let fxManager;

/* 1. Setup */
document.addEventListener('DOMContentLoaded', () => {
    fxManager = new FXManager(false);
    FXManager.devConfig.DEBUG = false;
    fxManager.addEmitter(createEmitter(), "my_emitter");
    this.start(0);
});

function createEmitter() {
    /* 2. Acquire an anchor element, emitter & origin creation*/
    const anchor = document.getElementById("div1");
    const origin = new CircularEmitterOrigin(50, 0, 100, 40, -1, -1, true, anchor);
    const emitter = new EmitterShoot(origin, 200, 4000, 500, 500)

    /* Data objects */
    const defaultData = new ParticleDefaultData(10, 10, origin, 4, 4, true);
    const cssData = new ParticleCustomCssData("background-color:#eb4034; border:1px solid black; border-radius:100px;", 30, 500);
    const directionData = new ParticleDirectionData(90, 1, 45, 2);
    const rotationData = new ParticleRotationData(45, 20);
    const colorData = new ParticleColorfilterData(0, new Color('#9a11d9'), 100, -1, -1, -1)
    emitter.addParticleData(defaultData);
    emitter.addParticleData(cssData);
    emitter.addParticleData(directionData);
    emitter.addParticleData(rotationData);
    emitter.addParticleData(colorData);

    /* Behavior objects */
    const sizeByLifeBehavior = new ParticleSizeByLifeBehavior([0, 1, 0], [0, 1, 0]);
    const directionBehavior = new ParticleDirectionalBehavior();
    const gravityBehavior = new ParticleGravityBehavior(1);
    const colorShiftBehavior = new ParticleColorShiftBehavior([0, 20, 40], [1,2], [0,2, 1, 4], [0,100, 100, 0], false)
    //emitter.addParticleBehavior(sizeByLifeBehavior);
    emitter.addParticleBehavior(directionBehavior);
    emitter.addParticleBehavior(gravityBehavior);
    emitter.addParticleBehavior(colorShiftBehavior);

    /* Return */
    return emitter
}

/* Core loop */
function start(nowTime) {
    fxManager.act(nowTime);
    window.requestAnimationFrame(this.start);
}




