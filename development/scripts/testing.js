
let fxManager;
FXManager.devConfig.DEBUG = true;
(function () {

    fxManager = new FXManager(false);

    /* Test of data components  */
    fxManager.addEmitter(dataTest_1(), "emitter_1")




    /* Start */
    this.start(0)
})();




/**
 * This function fully tests: 
 * 
 */
function dataTest_1(){
    let anchor = document.getElementById("div5");
    let origin = new CircularEmitterOrigin(0, 0, 40, 40, -1, -1, true, anchor);
    let emitter = new EmitterShoot(origin, 300, 1000, 500, -1, 0.3)
    // Data
    const defaultData = new ParticleDefaultData(10, 10, origin);
    const cssData = new ParticleCustomCssData("background-color:red;");
    const directionData = new ParticleDirectionData(90,20, 45, -1)
    emitter.addParticleData(defaultData);
    emitter.addParticleData(cssData);
    emitter.addParticleData(directionData);
    // Behavior
    const sizeByLifeBehavior = new ParticleSizeByLifeBehavior([1,0], [1,0])
    const directionBehavior = new ParticleDirectionalBehavior();
    emitter.addParticleBehavior(directionBehavior);
    emitter.addParticleBehavior(sizeByLifeBehavior);
    return emitter
}





function start(nowTime) {
    fxManager.act(nowTime);
    window.requestAnimationFrame(this.start);
}


