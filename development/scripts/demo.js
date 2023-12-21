
let fxManager;
FXManager.devConfig.DEBUG = false;
(function () {
    /* 1. create an FXManager */
    fxManager = new FXManager(true);

    /* 2. Optionally get the HTML Element to which you want to attach the particle effect. */
    const targetElement = document.getElementById("div7");

    /* 3. Create an Origin object. */
    let circularOrigin = new CircularEmitterOrigin(0, 0, 400, 400, -1, -1, true, targetElement, PositionUnit.PERCENTAGE, PositionUnit.PERCENTAGE, 100, 100, PositionUnit.PIXEL, PositionUnit.PIXEL, 0, 0, false, true, true);

    /* 4. Create an Emitter. */
    //let emitter = new EmitterShoot(circularOrigin, 500, 1000, 3000, -1, 1, -1);
    let emitter = new EmitterBurst(circularOrigin, 50, 4, 4000, 1000)

    /* 5. Create Data objects. */
    let defaultData = new ParticleDefaultData(10, 50, circularOrigin, 0.5, 0.5, true, Pivot.CENTER, Pivot.CENTER);
    let customCssData = new ParticleCustomCssData("background-color:black; border-radius:70px;", 390, 401);

    /* 6. Create Behavior objects. */
    let sizeByLifeBehavior = new ParticleSizeByLifeBehavior([0, 0.5, 0.9, 1, 0.9, 0.5, 0], [0, 0.1, 0.3, 1, 0.3, 0.1, 0], -1, -1);
    let opacityByLifeBehavior = new ParticleOpacityByLifeBehavior([0, 1, 1, 1, 1, 1, 0], -1, -1);
    let directionalBehavior = new ParticleDirectionalBehavior();
    let windBehavior = new ParticleWindBehavior([0, -90, -45, 0, -90, 180, 270, 300], -1, 50, false, false);
    let directionRotation = new ParticleRotationByDirectionBehavior(90);

    /* 7. Add the data & behavior configurations to the emitter */
    emitter.addParticleData(defaultData);
    emitter.addParticleData(customCssData);
    emitter.addParticleBehavior(sizeByLifeBehavior);
    emitter.addParticleBehavior(opacityByLifeBehavior);
    emitter.addParticleBehavior(directionalBehavior);
    emitter.addParticleBehavior(windBehavior);
    emitter.addParticleBehavior(directionRotation);

    /* Add the emitter to the FXManager */
    fxManager.addEmitter(emitter, "myFirstEmitter")

    /* Retrieve the emitter by its ID */
    fxManager.getFxItemById("myFirstEmitter");

    /* 9. Start by jumping into the loop */
    this.start(0)
})();



function start(nowTime) {
    /* Subscribe with our fxManager logic */
    fxManager.act(nowTime);
    window.requestAnimationFrame(this.start);
}


