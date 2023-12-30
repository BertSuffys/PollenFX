
let fxManager;
FXManager.devConfig.DEBUG = false;


(function () {
    fxManager = new FXManager(false);

    fxManager.addEmitter(dataTest_1(), "emitter_1")
    fxManager.addEmitter(dataTest_2(), "emitter_2")
    fxManager.addEmitter(dataTest_3(), "emitter_3")
    fxManager.addEmitter(dataTest_4(), "emitter_4")
    fxManager.addEmitter(dataTest_5(), "emitter_5")
    fxManager.addEmitter(dataTest_6(), "emitter_6")
    fxManager.addEmitter(dataTest_7(), "emitter_7")

       
    /* Start */
    this.start(0);

})();

/**
 * Data : CSS, Rotation, Direction, Default
 * Behavior: SizeByLife, Direction, Rotation
 */
function dataTest_1() {
    let anchor = document.getElementById("div3");
    let origin = new CircularEmitterOrigin(0, 0, 40, 40, -1, -1, true, anchor);
    let emitter = new EmitterShoot(origin, 200, 400, 1000, 500, 2)
    // Data
    let defaultData = new ParticleDefaultData(20, 20, origin, 4, 3, true);
    let cssData = new ParticleCustomCssData("background-color:pink;border:1px solid black;", 30, 500);
    let directionData = new ParticleDirectionData(20, 10, 90, 2)
    let rotationData = new ParticleRotationData(127, 45)
    emitter.addParticleData(defaultData);
    emitter.addParticleData(cssData);
    emitter.addParticleData(directionData);
    emitter.addParticleData(rotationData);
    // Behavior
    const sizeByLifeBehavior = new ParticleSizeByLifeBehavior([1, 0], [1, 0])
    let directionBehavior = new ParticleDirectionalBehavior();
    let rotationBehavior = new ParticleRotationBehavior(2, 4, true)
    emitter.addParticleBehavior(sizeByLifeBehavior);
    emitter.addParticleBehavior(directionBehavior);
    emitter.addParticleBehavior(rotationBehavior);
    return emitter
}


/**
 * Data : 
 * Behavior: 
 */
function dataTest_2() {
    let anchor = document.getElementById("div4");
    let origin = new RectangularEmitterOrigin(70, 0, 150, 30, -1, -1, true, anchor);
    let emitter = new EmitterShoot(origin, -1, -1, 500, 1000, 2, 30)
    // Data
    let defaultData = new ParticleDefaultData(4, 4, origin, 5, 5, true, Pivot.CENTER, Pivot.END);
    let cssData = new ParticleCustomCssData("background-color:green; border-radius:30px;", 30, 500);
    emitter.addParticleData(defaultData);
    emitter.addParticleData(cssData);
    // Behavior
    const opacityBehavior = new ParticleOpacityByLifeBehavior([1,1,1,0])
    const sizeByLifeBehavior = new ParticleSizeByLifeBehavior([0, 3], [0, 3])
    emitter.addParticleBehavior(sizeByLifeBehavior);
    emitter.addParticleBehavior(opacityBehavior);
    

    return emitter
}



function dataTest_3() {
    let anchor = document.getElementById("div5");
    let line = new LineEmitterOrigin(70, 40, 400, -200, -1, -1, 20 , true, anchor);
    let emitter = new EmitterBurst(line, 50, 19, 6000, 1000)
    // Data
    let cssData = new ParticleCustomCssData("box-shadow: 0px 0px 64px 3px rgba(255,220,46,1); border-radius:30px; background-color:#ffc42e;", 30, 500);
    let defaultData = new ParticleDefaultData(4, 4, line, 5, 5, true, Pivot.CENTER, Pivot.END);
    let directionData = new ParticleDirectionData(90, 2, 180, 3)
    emitter.addParticleData(defaultData);
    emitter.addParticleData(cssData);
    emitter.addParticleData(directionData);
    // Behavior
    const gravity = new ParticleGravityBehavior(70, 3);
    const sizeByLifeBehavior = new ParticleSizeByLifeBehavior([1, 0], [1, 0])
    const directionBehavior = new ParticleDirectionalBehavior();
    emitter.addParticleBehavior(gravity);
    emitter.addParticleBehavior(sizeByLifeBehavior);
    emitter.addParticleBehavior(directionBehavior);
    return emitter
}




function dataTest_4() {

    let anchor = document.getElementById("div3");
    let line = new PointEmitterOrigin(700, 200, -1, -1 , true, anchor);
    let emitter = new EmitterBurst(line, 15, 3, -1, 3000, 500, -1, 1000)
    // Data
    let imagedata = new ParticleImageData('https://pngfre.com/wp-content/uploads/apple-43-1024x1015.png')
    let defaultData = new ParticleDefaultData(30, 30, line, 5, 5, true, Pivot.CENTER, Pivot.END);
    let directionData = new ParticleDirectionData(45, 15, 90, 3)
    emitter.addParticleData(defaultData);
    emitter.addParticleData(imagedata);
    emitter.addParticleData(directionData);
    // Behavior
    const gravity = new ParticleGravityBehavior(60, 3);
    const sizeByLifeBehavior = new ParticleSizeByLifeBehavior([1, 0], [1, 0])
    const directionBehavior = new ParticleDirectionalBehavior();
    const rot = new ParticleRotationByDirectionBehavior()
    emitter.addParticleBehavior(gravity);
    emitter.addParticleBehavior(sizeByLifeBehavior);
    emitter.addParticleBehavior(directionBehavior);
    emitter.addParticleBehavior(rot);
    return emitter

}


function dataTest_5() {

    let line = new PointEmitterOrigin(700, 200, -1, -1 , true);
    let emitter = new EmitterShoot(origin, -1, -1, 500, 1000, 2, 30)
    // Data
    let cssData = new ParticleCustomCssData("background-color:#B37F46;", 30, 500);
    let defaultData = new ParticleDefaultData(10, 10, line, 5, 5, true, Pivot.CENTER, Pivot.END);
    let directionData = new ParticleDirectionData(0, 5, 360, 3)
    let filterdata = new ParticleColorfilterData(-1, new Color("#B37F46"), 3, 5, 5, 75)
    emitter.addParticleData(defaultData);
    emitter.addParticleData(filterdata);
    emitter.addParticleData(cssData);
    emitter.addParticleData(directionData);
    // Behavior
    const opacityBehavior = new ParticleOpacityByLifeBehavior([0,1,1,0])
    const directionBehavior = new ParticleDirectionalBehavior();
    const rot = new ParticleRotationByDirectionBehavior()
    const wind = new ParticleWindBehavior([-45, -90, -128, -270], -1, 40)
    emitter.addParticleBehavior(opacityBehavior);
    emitter.addParticleBehavior(directionBehavior);
    emitter.addParticleBehavior(rot);
    emitter.addParticleBehavior(wind);
    return emitter

}



function dataTest_6() {

    let line = new PointEmitterOrigin(1000, 750, -1, -1 , true);
    let emitter = new EmitterShoot(origin, -1, -1, 2000, 500, 2, 30)
    // Data
    let cssData = new ParticleCustomCssData("background-color:#B37F46;", 30, 500);
    let defaultData = new ParticleDefaultData(10, 10, line, 5, 5, true, Pivot.CENTER, Pivot.END);
    let directionData = new ParticleDirectionData(0, 5, 360, 3)
    let filterdata = new ParticleColorfilterData(-1, new Color("#B37F46"), 3, 5, 5, 75)
    emitter.addParticleData(defaultData);
    emitter.addParticleData(filterdata);
    emitter.addParticleData(cssData);
    emitter.addParticleData(directionData);
    // Behavior
    const opacityBehavior = new ParticleOpacityByLifeBehavior([0,1,1,0])
    const directionBehavior = new ParticleDirectionalBehavior();
    const wind = new ParticleWindBehavior([120, 360, -45, 38], -1, 40)
    const colorFilter = new ParticleColorfilterBehavior([new Color("#55de2f"), new Color("#b32045"), new Color("#eb0cc5")], 400, false, 2, 10)
   // emitter.addParticleBehavior(opacityBehavior);
    emitter.addParticleBehavior(directionBehavior);
    emitter.addParticleBehavior(wind);
    emitter.addParticleBehavior(colorFilter);
    return emitter

}


function dataTest_7() {

    let line = new RectangularEmitterOrigin(500, 600, -1, -1 , true);
    let emitter = new EmitterShoot(origin, -1, -1, 2000, 500, 2, 30)
    // Data
    const flipbookData = new ParticleFlipbookData("./img/smoke.png", -1, -1, 6, 5, -1, ImageFitting.COVER);
    const css = new ParticleCustomCssData("mix-blend-mode:luminosity;");
    const defaultData = new ParticleDefaultData(50, 50, line, 1, 1, true, Pivot.CENTER, Pivot.END);
    const directionData = new ParticleDirectionData(90, 2, 45, 3)
    emitter.addParticleData(defaultData);
    emitter.addParticleData(flipbookData);
    emitter.addParticleData(directionData);
    emitter.addParticleData(css);
    // Behavior
    const directionBehavior = new ParticleDirectionalBehavior();
    const flipbookBehavior = new ParticleFlipbookBehavior(60, -1, 20);
    const opacity = new ParticleOpacityByLifeBehavior([0,1,0]);
    const sizeByLife = new ParticleSizeByLifeBehavior([0,5],[0,5])

    emitter.addParticleBehavior(opacity);
    emitter.addParticleBehavior(directionBehavior);
    emitter.addParticleBehavior(flipbookBehavior);
    emitter.addParticleBehavior(sizeByLife);

    
    return emitter

}






function start(nowTime) {
    fxManager.act(nowTime);
    window.requestAnimationFrame(this.start);
}


