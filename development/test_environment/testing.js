
let fxManager;

// behavior objects
// stop/start/restart
// pause resume

document.addEventListener('DOMContentLoaded', function () {
    fxManager = new FXManager().setDebug(true).withAllowDOMOverflow(true);
    //fxManager.addEmitter(getEmitterShoot("shoot_emitter"));
    fxManager.addEmitter(getEmitterBurst("burst_emitter"));
    //fxManager.addEmitter(getEmitter("second_emitter"));
    fxManager.build(false).start();
    start(0);

    //console.log(fxManager.getEmitterById("burst_emitter").getAverigeAliveParticleCount())
    //console.log(fxManager.getAverigeAliveParticleCount())
});


function getEmitterShoot(id) {
    // Tools
    let anchor = document.getElementById("core"); 
    let circle = this.getCircularEmitterOrigin(anchor);
    let line = this.getLineEmitterOrigin(anchor);
    let point = this.getPointEmitterOrigin(anchor);
    let rect = this.getRectangularEmitterOrigin(anchor);
    let emitter = new EmitterShoot(rect).infinite(50, 2000).withDelay(0);

    // Data
    const defaultData = new ParticleDefaultData(15, 15)//.sizeNoise(20, 20, false).pivot(Pivot.CENTER, Pivot.CENTER);
    const rotationData = new ParticleRotationData(0, 10);
    const opacityData = new ParticleOpacityData(0.5, 0.2);
    const imageData = new ParticleImageData('../img/logs.png').withImageFitting(ImageFitting.FIT);
    const customCSSData = new ParticleCustomCssData("background-color:red; border: 1px solid black; border-radius:20px;").zIndexRange(100, 200);
    const colorData = new ParticleColorfilterData().withBrightness(300);
    emitter.addParticleData(defaultData);
    emitter.addParticleData(customCSSData);
    //emitter.addParticleData(rotationData);
    //emitter.addParticleData(opacityData);
    //emitter.addParticleData(imageData);
    //emitter.addParticleData(colorData);

    // Behavior
    //const sizeByLifeBehavior = new ParticleSizeByLifeBehavior([0.5, 1, 1.3]);

    //emitter.addParticleBehavior(sizeByLifeBehavior);

    // Return
    emitter.withId(id)
    return emitter
}


function getEmitterBurst(id) {
    // Tools
    let anchor = document.getElementById("core"); 
    let circle = this.getCircularEmitterOrigin(anchor);
    let line = this.getLineEmitterOrigin(anchor);
    let point = this.getPointEmitterOrigin(anchor);
    let rect = this.getRectangularEmitterOrigin(anchor);
    let emitter = new EmitterBurst(rect).infinite(50, 2000, 1000, 1).withDelay(300);

    // Data
    const defaultData = new ParticleDefaultData(15, 15).sizeNoise(20, 20, false).pivot(Pivot.CENTER, Pivot.CENTER);
    const rotationData = new ParticleRotationData(0, 10);
    const opacityData = new ParticleOpacityData(0.5, 0.2);
    const imageData = new ParticleImageData('../img/logs.png').withImageFitting(ImageFitting.FIT);
    const customCSSData = new ParticleCustomCssData("background-color:red; border: 1px solid black; border-radius:20px;").zIndexRange(100, 200);
    const colorData = new ParticleColorfilterData().withBrightness(300);
    emitter.addParticleData(defaultData);
    emitter.addParticleData(customCSSData);
    emitter.addParticleData(rotationData);
    emitter.addParticleData(opacityData);
    emitter.addParticleData(imageData);
    emitter.addParticleData(colorData);

    // Return
    emitter.withId(id)
    return emitter
}

function start(nowTime) {
    fxManager.act(nowTime);
    window.requestAnimationFrame(this.start);
}

function getCircularEmitterOrigin(anchor){
    return new CircularEmitterOrigin(0, 0, 100, 100)
        .withAnchor(anchor)
        .withOverflow(true)
        .withDomProperties(false, false, true)
        .withContainerProperties(300, 300, -50, -50)
        .withOriginProperties();
}

function getRectangularEmitterOrigin(anchor){
    return new RectangularEmitterOrigin(0, 0, 100, 100)
        .withAnchor(anchor)
        .withOverflow(true)
        .withDomProperties(false, false, true)
        .withContainerProperties(300, 300, -50, -50)
        .withOriginProperties();
}

function getLineEmitterOrigin(anchor){
    return new LineEmitterOrigin(0, 0, 200, 200, 50)
        .withAnchor(anchor)
        .withOverflow(false)
        .withDomProperties(false, false, true)
        .withContainerProperties(300, 300, -100, -100)
        .withOriginProperties();
}

function getPointEmitterOrigin(anchor){
    return new PointEmitterOrigin(0, 0)
        .withAnchor(anchor)
        .withOverflow(true)
        .withDomProperties(false, false, true)
        .withContainerProperties(300, 300, -100, -100)
        .withOriginProperties();
}