
let fxManager;

document.addEventListener('DOMContentLoaded', function() {
    fxManager = new FXManager();
    FXManager.devConfig.DEBUG = true;

    let anchor = document.getElementById("my_element");
    let origin = new CircularEmitterOrigin(0, 0, 40, 40, -1, -1, true, anchor);
    let emitter = new EmitterShoot(origin, 200, 400, 1000, 500, 2)
    // Data
    let defaultData = new ParticleDefaultData(20, 20, origin, 4, 3, true);
    let cssData = new ParticleCustomCssData("background-color:pink;border:1px solid black;", 30, 500);

    // initialize
    emitter.addParticleData(cssData);
    emitter.addParticleData(defaultData);

    fxManager.addEmitter(emitter,"myEmitter");

    start(0);
});




function start(runtimeInMs){
    fxManager.act(runtimeInMs);
    window.requestAnimationFrame(this.start);
}



