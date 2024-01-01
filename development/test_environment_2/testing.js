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
    const emitter = new EmitterShoot(origin, 1, 40, -1, -1, -1);


    /* Data objects */
    const defaultData = new ParticleDefaultData(100, 100, origin, 4, 4, true);
    const cssData = new ParticleCustomCssData("background-color:#eb4034; border:1px solid black; border-radius:100px;", 30, 500);
    const directionData = new ParticleDirectionData(90, 10, 45, 2);
    const rotationData = new ParticleRotationData(45, 20);
    const colorData = new ParticleColorfilterData(-1, new Color("#fcfffd"), -1, -1, 20, 230)
    const imgData = new ParticleImageData("../../demo_v1.0/img/fire.png");
    emitter.addParticleData(defaultData);
    emitter.addParticleData(cssData);
    emitter.addParticleData(directionData);
    emitter.addParticleData(rotationData);
    emitter.addParticleData(colorData);


    /* Behavior objects */
    const directionBehavior = new ParticleDirectionalBehavior();
    const gravityBehavior = new ParticleGravityBehavior(1);
    const colorShiftBehavior = new ParticleColorShiftBehavior([0, 20, 40], [1,2], [0,2, 1, 4], [0,100, 100, 0], false)
    const colorFilterBehavior = new ParticleColorfilterBehavior([new Color("#34e80c"),new Color("#0e2cc4")]);
    emitter.addParticleBehavior(directionBehavior);
    emitter.addParticleBehavior(gravityBehavior);
    //emitter.addParticleBehavior(colorShiftBehavior);
   // emitter.addParticleBehavior(colorFilterBehavior);

    /* Return */
    return emitter
}

/* Core loop */
function start(nowTime) {
    fxManager.act(nowTime);
    window.requestAnimationFrame(this.start);
}




