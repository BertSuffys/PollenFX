
let fxManager;
FXManager.devConfig.DEBUG = true;
(function () {

    /* 1. create an FXManager */
    fxManager = new FXManager(false);

    fxManager.addEmitter(createEmitter_1(), "myFirstEmitter")
    //fxManager.addEmitter(createEmitter_2(), "mySecondEmitter")
   // fxManager.addEmitter(createEmitter_3(), "myThirdEmitter")



    /* 9. Start by jumping into the loop */
    this.start(0)
})();









function createEmitter_1(){

    const targetElement = document.getElementById("div3");

    //let pointEmitterOrigin = new PointEmitterOrigin(0, 0, -1, -1, true, targetElement );
    let pointEmitterOrigin = new CircularEmitterOrigin(0, 0, 1, 1, -1, -1, true, targetElement );


    let emitter = new EmitterShoot(pointEmitterOrigin, 4000, 4000, 1000, 1000)

    let defaultData = new ParticleDefaultData(30, 30, pointEmitterOrigin, 0.5, 0.5, true, Pivot.CENTER, Pivot.CENTER);
    let customCssData = new ParticleCustomCssData("background-color:black; border-radius:70px;", 390, 401);

    let sizeByLifeBehavior = new ParticleSizeByLifeBehavior([0, 1], [0, 1]);
    let opacityByLifeBehavior = new ParticleOpacityByLifeBehavior([0, 1, 1, 1, 1, 1, 0], -1, -1);
    let directionalBehavior = new ParticleDirectionalBehavior();
    let windBehavior = new ParticleWindBehavior([90, 180, -45, 0, -90, -180, 90, -90], -1, 100, false, false);
    let particleDirectionData =  new ParticleDirectionData(45, 120 )
    let directionRotation = new ParticleRotationByDirectionBehavior(80);
    let gravityparticlebehavior = new ParticleGravityBehavior(490)

    //emitter.addParticleData(defaultData);
    emitter.addParticleData(customCssData);
    emitter.addParticleData(particleDirectionData);
     emitter.addParticleBehavior(sizeByLifeBehavior);
    //emitter.addParticleBehavior(opacityByLifeBehavior);
   // emitter.addParticleBehavior(directionalBehavior);
    //emitter.addParticleBehavior(windBehavior);
   // emitter.addParticleBehavior(directionRotation);
     emitter.addParticleBehavior(gravityparticlebehavior);

    return emitter;
}




function createEmitter_2(){

    const targetElement = document.getElementById("div5");

    let circularOrigin = new CircularEmitterOrigin(0, 0, 400, 400, -1, -1, true, targetElement, PositionUnit.PERCENTAGE, PositionUnit.PERCENTAGE, 100, 100, PositionUnit.PIXEL, PositionUnit.PIXEL, 0, 0, false, true, true);

    let emitter = new EmitterBurst(circularOrigin, 50, 4, 4000, 1000)

    let defaultData = new ParticleDefaultData(10, 50, circularOrigin, 0.5, 0.5, true, Pivot.CENTER, Pivot.CENTER);
    let customCssData = new ParticleCustomCssData("background-color:black; border-radius:70px;", 390, 401);

    let sizeByLifeBehavior = new ParticleSizeByLifeBehavior([0, 0.5, 0.9, 1, 0.9, 0.5, 0], [0, 0.1, 0.3, 1, 0.3, 0.1, 0], -1, -1);
    let opacityByLifeBehavior = new ParticleOpacityByLifeBehavior([0, 1, 1, 1, 1, 1, 0], -1, -1);
    let directionalBehavior = new ParticleDirectionalBehavior();
    let windBehavior = new ParticleWindBehavior([0, -90, -45, 0, -90, 180, 270, 300], -1, 50, false, false);
    let directionRotation = new ParticleRotationByDirectionBehavior(90);

    emitter.addParticleData(defaultData);
    emitter.addParticleData(customCssData);
    emitter.addParticleBehavior(sizeByLifeBehavior);
    emitter.addParticleBehavior(opacityByLifeBehavior);
    emitter.addParticleBehavior(directionalBehavior);
    emitter.addParticleBehavior(windBehavior);
    emitter.addParticleBehavior(directionRotation);

    return emitter;
}



function createEmitter_3(){

    const targetElement = document.getElementById("div5");

    let circularOrigin = new CircularEmitterOrigin(0, 0, 400, 400, -1, -1, true, targetElement, PositionUnit.PERCENTAGE, PositionUnit.PERCENTAGE, 100, 100, PositionUnit.PIXEL, PositionUnit.PIXEL, 0, 0, false, true, true);

    let emitter = new EmitterBurst(circularOrigin, 50, 4, 4000, 1000)

    let defaultData = new ParticleDefaultData(10, 50, circularOrigin, 0.5, 0.5, true, Pivot.CENTER, Pivot.CENTER);
    let customCssData = new ParticleCustomCssData("background-color:black; border-radius:70px;", 390, 401);

    let sizeByLifeBehavior = new ParticleSizeByLifeBehavior([0, 0.5, 0.9, 1, 0.9, 0.5, 0], [0, 0.1, 0.3, 1, 0.3, 0.1, 0], -1, -1);
    let opacityByLifeBehavior = new ParticleOpacityByLifeBehavior([0, 1, 1, 1, 1, 1, 0], -1, -1);
    let directionalBehavior = new ParticleDirectionalBehavior();
    let windBehavior = new ParticleWindBehavior([0, -90, -45, 0, -90, 180, 270, 300], -1, 50, false, false);
    let directionRotation = new ParticleRotationByDirectionBehavior(90);

    emitter.addParticleData(defaultData);
    emitter.addParticleData(customCssData);
    emitter.addParticleBehavior(sizeByLifeBehavior);
    emitter.addParticleBehavior(opacityByLifeBehavior);
    emitter.addParticleBehavior(directionalBehavior);
    emitter.addParticleBehavior(windBehavior);
    emitter.addParticleBehavior(directionRotation);

    return emitter;
}







function start(nowTime) {
    /* Subscribe with our fxManager logic */
    fxManager.act(nowTime);
    window.requestAnimationFrame(this.start);
}


