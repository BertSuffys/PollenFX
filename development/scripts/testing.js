
let fxManager;
FXManager.devConfig.DEBUG = true;
(function () {

    fxManager = new FXManager(false);

    /* Test of data components  */
    fxManager.addEmitter(dataTest_1(), "emitter_1")

    /* Start */
    this.start(0);

})();




/**
 * This function fully tests: 
 * 
 */
function dataTest_1(){
    let anchor = document.getElementById("div7");
    let origin = new CircularEmitterOrigin(0, 0, 40, 40, -1, -1, true, anchor);
    let emitter = new EmitterShoot(origin, 40, 700, 1000, -1, 8)
    // Data
    let defaultData = new ParticleDefaultData(10, 10, origin);
    let cssData = new ParticleCustomCssData("background-color:red;");
    let directionData = new ParticleDirectionData(90,8, 45, -1)
    emitter.addParticleData(defaultData);
    emitter.addParticleData(cssData);
    emitter.addParticleData(directionData);
    // Behavior
    const sizeByLifeBehavior = new ParticleSizeByLifeBehavior([1,0], [1,0], -1)
    let directionBehavior = new ParticleDirectionalBehavior();
    let opacityBehavior = new ParticleOpacityByLifeBehavior([0,1,0])
    emitter.addParticleBehavior(sizeByLifeBehavior);
    emitter.addParticleBehavior(directionBehavior);
     emitter.addParticleBehavior(opacityBehavior);
    return emitter
}





function start(nowTime) {
    fxManager.act(nowTime);
    window.requestAnimationFrame(this.start);
}


