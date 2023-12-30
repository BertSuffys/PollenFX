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
    const emitter = new EmitterShoot(origin, 100, 400, 2000, 500)

    /* Data objects */
    const defaultData = new ParticleDefaultData(10, 10, origin, 4, 4, true);
    const cssData = new ParticleCustomCssData("background-color:#eb4034; border:1px solid black; border-radius:100px;", 30, 500);
    const directionData = new ParticleDirectionData(90, 10, 45, 2);
    const rotationData = new ParticleRotationData(45, 20);
    const colorData = new ParticleColorfilterData(0, new Color('#9a11d9'), 100, -1, 2, -1)
    emitter.addParticleData(defaultData);
    emitter.addParticleData(cssData);
    emitter.addParticleData(directionData);
    emitter.addParticleData(rotationData);
    emitter.addParticleData(colorData);

    /* Behavior objects */
    const sizeByLifeBehavior = new ParticleSizeByLifeBehavior([0, 1, 0], [0, 1, 0]);
    const directionBehavior = new ParticleDirectionalBehavior();
    const gravityBehavior = new ParticleGravityBehavior(10, 3);
    const colorFilterBehavior = new ParticleColorfilterBehavior([new Color('#eb4034'), new Color('#22d8e6'), new Color('#b81c8e')],500, false, 2, 20)
    emitter.addParticleBehavior(sizeByLifeBehavior);
    emitter.addParticleBehavior(directionBehavior);
    emitter.addParticleBehavior(gravityBehavior);
    emitter.addParticleBehavior(colorFilterBehavior);

    /* Return */
    return emitter
}

/* Core loop */
function start(nowTime) {
    fxManager.act(nowTime);
    window.requestAnimationFrame(this.start);
}




