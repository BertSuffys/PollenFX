
let fxManager;
FXManager.devConfig.DEBUG = true;
(function () {

    fxManager = new FXManager(false);

    /* Test of data components  */
    fxManager.addEmitter(dataTest_1(), "emitter_1")

    /* Start */
    this.start(0);

})();




function dataTest_1(){
    let anchor = document.getElementById("div3");
    let origin = new CircularEmitterOrigin(0, 0, 40, 40, -1, -1, true, anchor);
    let emitter = new EmitterShoot(origin, 200, 400, 1000, -1, 2)
    // Data
    let defaultData = new ParticleDefaultData(20, 20, origin, 4, 3 ,true);
    let cssData = new ParticleCustomCssData("background-color:pink;border:1px solid black;", 30, 500);
    let directionData = new ParticleDirectionData(20, 10, 90, 2)
    let rotationData = new ParticleRotationData(127, 45)
    emitter.addParticleData(defaultData);
    emitter.addParticleData(cssData);
    emitter.addParticleData(directionData);
    emitter.addParticleData(rotationData);
    // Behavior
    const sizeByLifeBehavior = new ParticleSizeByLifeBehavior([1,0], [1,0])
    let directionBehavior = new ParticleDirectionalBehavior(); 
    let rotationBehavior = new ParticleRotationBehavior(2, 4, true)
    emitter.addParticleBehavior(sizeByLifeBehavior);
    emitter.addParticleBehavior(directionBehavior);
    emitter.addParticleBehavior(rotationBehavior);
    return emitter
}





function start(nowTime) {
    fxManager.act(nowTime);
    window.requestAnimationFrame(this.start);
}


