
let fxManager;

document.addEventListener('DOMContentLoaded', function () {
    fxManager = new FXManager()
    .withAllowDOMOverflow(false)
    .setDebug(false);
    fxManager.addEmitter(getEmbers());
    fxManager.addEmitter(getLightSmoke());
    fxManager.addEmitter(getSparks());
    fxManager.addEmitter(getLight());
    fxManager.addEmitter(getFlames());
    fxManager.addEmitter(getBigSmoke());
    fxManager.build()
});


function getEmbers() {
  // Tools
  let anchor = document.getElementById("logWrapper");
  let origin = new CircularEmitterOrigin(200, 110, 180, 120).withOverflow(true).withAnchor(anchor);
  let emitter = new EmitterShoot(origin).finite(100, 10000, 3000, 2).withDelay(1000);

  // Data
  let defaultData = new ParticleDefaultData(10, 10).sizeNoise(0.5, 0.5, true);
  let cssData = new ParticleCustomCssData("background-color:#eb5f1a; border-radius:30px; mix-blend-mode: overlay; box-shadow: 0px 0px 10px 16px #eb5f1a;").zIndexRange(30, 500);
  let rotationData = new ParticleRotationData(127, 45);
  emitter.addParticleData(defaultData);
  emitter.addParticleData(cssData);
  emitter.addParticleData(rotationData);

  // Behavior
  const opacityByLifeBehavior = new ParticleOpacityByLifeBehavior([0, 0.6, 0]).withDuration(1500);
  emitter.addParticleBehavior(opacityByLifeBehavior);
  // Return
  return emitter;
}

function getLightSmoke() {
    // Tools
    let anchor = document.getElementById("logWrapper");
    let origin = new CircularEmitterOrigin(200, 110, 100, 75).withOverflow(true).withAnchor(anchor);
    let emitter = new EmitterShoot(origin).finite(350, 10000, 4000, 0.2).withDelay(2000);
    // Data
    let defaultData = new ParticleDefaultData(105, 105).sizeNoise(2, 2, true);
    let directionData = new ParticleDirectionData(90, 100).withSpeedNoise(2).withConeNoise(10);
    let rotationData = new ParticleRotationData(127, 45);
    let flipbookData = new ParticleFlipbookData("img/smoke.png", -1, -1, 6, 5);
    let colorData = new ParticleColorfilterData().withColor("#b99d23").withBrightness(200).withSaturation(81)
    emitter.addParticleData(defaultData);
    emitter.addParticleData(directionData);
    emitter.addParticleData(rotationData);
    emitter.addParticleData(flipbookData);
    emitter.addParticleData(colorData);
    // Behavior
    const opacityByLifeBehavior = new ParticleOpacityByLifeBehavior([0, 0.3, 0.1, 0]);
    const sizeByLifeBehavior = new ParticleSizeByLifeBehavior([0.5, 0.7, 1, 1.3]);
    const flipbookBehavior = new ParticleFlipbookBehavior(30)
    const directionBehavior = new ParticleDirectionalBehavior()
    const colorFilterBehavior = new ParticleColorShiftBehavior().withSaturations([100, 10, 0]).withBrightnesses([200,30]).withContrasts([1,0]);
    emitter.addParticleBehavior(opacityByLifeBehavior);
    emitter.addParticleBehavior(flipbookBehavior);
    emitter.addParticleBehavior(sizeByLifeBehavior);
    emitter.addParticleBehavior(directionBehavior);
    emitter.addParticleBehavior(colorFilterBehavior);
    // Return
    return emitter
}

function getSparks() {
    // Tools
    let anchor = document.getElementById("logWrapper");
    let origin = new CircularEmitterOrigin(180, 80, 180, 100).withOverflow(true).withAnchor(anchor);
    let emitter = new EmitterBurst(origin).infinite(10, 2000, 400, 2).withDelay(5000)
    // Data
    let cssData = new ParticleCustomCssData("background-color:#ff6f21; mix-blend-mode:screen; border-radius:30px; box-shadow: 0px 0px 24px 0px rgba(255,111,33,0.9);").zIndexRange(10, 30);
    let defaultData = new ParticleDefaultData(4, 2).sizeNoise(12);
    let directionData = new ParticleDirectionData(90, 60).withSpeedNoise(10).withConeNoise(180);
    emitter.addParticleData(defaultData);
    emitter.addParticleData(cssData);
    emitter.addParticleData(directionData);
    // Behavior
    let directionBehavior = new ParticleDirectionalBehavior()
    let gravityBehavior = new ParticleGravityBehavior(60).withNoise(5);
    let rotationByDirectionBehavior = new ParticleRotationByDirectionBehavior()
    emitter.addParticleBehavior(directionBehavior);
    emitter.addParticleBehavior(gravityBehavior);
    emitter.addParticleBehavior(rotationByDirectionBehavior);
    return emitter
}


function getBigSmoke() {
    // Tools
    let anchor = document.getElementById("logWrapper");
    let origin = new CircularEmitterOrigin(200, 110, 140, 100).withOverflow(true).withAnchor(anchor);
    let emitter = new EmitterShoot(origin).infinite(30, 3000, 400).withDelay(5000);
    // Data
    const defaultData = new ParticleDefaultData(200, 200).sizeNoise(0.5, 0.5);
    const directionData = new ParticleDirectionData(90, 70).withSpeedNoise(2).withConeNoise(10)
    const rotationData = new ParticleRotationData(127, 45)
    const cssData = new ParticleCustomCssData("mix-blend-mode: plus-darker;").zIndexRange(90, 105);
    const flipbookData = new ParticleFlipbookData("img/smoke.png", -1, -1, 6, 5);
    const colorData = new ParticleColorfilterData().withColor("#b05500").withHue(-30);
    emitter.addParticleData(defaultData);
    emitter.addParticleData(directionData);
    emitter.addParticleData(cssData);
    emitter.addParticleData(rotationData);
    emitter.addParticleData(flipbookData);
    emitter.addParticleData(colorData);
    // Behavior
    const opacityByLifeBehavior = new ParticleOpacityByLifeBehavior([0, 1, 0.7, 0]);
    const sizeByLifeBehavior = new ParticleSizeByLifeBehavior([0.5, 1, 1.3]);
    const flipbookBehavior = new ParticleFlipbookBehavior(100)
    const directionBehavior = new ParticleDirectionalBehavior()
    const colorFilterBehavior = new ParticleColorShiftBehavior().withSaturations([1, 0]).withHues([10, 2, 0, 0])
    const windBehavior = new ParticleWindBehavior([90, 180], 10)
    emitter.addParticleBehavior(opacityByLifeBehavior);
    emitter.addParticleBehavior(flipbookBehavior);
    emitter.addParticleBehavior(sizeByLifeBehavior);
    emitter.addParticleBehavior(directionBehavior);
    emitter.addParticleBehavior(colorFilterBehavior);
    emitter.addParticleBehavior(windBehavior);

    // Return
    return emitter
}



function getFlames() {
    // Tools
    let anchor = document.getElementById("logWrapper");
    let origin = new CircularEmitterOrigin(200, 150, 200, 70).withOverflow(true).withAnchor(anchor);
    let emitter = new EmitterShoot(origin).infinite(100, 2500).withDelay(7000);

    // Data
    const cssData = new ParticleCustomCssData("mix-blend-mode: overlay;").zIndexRange(100, 120);
    const defaultData = new ParticleDefaultData(40, 40 ).pivot(Pivot.CENTER, Pivot.END);
    const flipbookData = new ParticleFlipbookData("img/fire.png", -1, -1, 4, 2);
    emitter.addParticleData(defaultData);
    emitter.addParticleData(flipbookData);
    emitter.addParticleData(cssData);
    // Behavior
    const flipbookBehavior = new ParticleFlipbookBehavior(60)
    const sizeBehavior = new ParticleSizeByLifeBehavior([0, 2], [0, 2]).withNoise(5, true);
    const opacityByLifeBehavior = new ParticleOpacityByLifeBehavior([0, 0, 0.5, 1, 0]);

    emitter.addParticleBehavior(flipbookBehavior);
    emitter.addParticleBehavior(sizeBehavior);
    emitter.addParticleBehavior(opacityByLifeBehavior);

    return emitter;
}





function getLight() {
    // Tools
    let anchor = document.getElementById("logWrapper");
    let origin = new PointEmitterOrigin(200, 60, -1, -1).withOverflow(true).withAnchor(anchor);
    let emitter = new EmitterShoot(origin).finite(20, 1, -1).withDelay(0);

    // Data
    const cssData = new ParticleCustomCssData("background-color:#ff6f21; border-radius : 50px; mix-blend-mode: darker color; box-shadow: 0px 0px 92px 92px #ff6f21;").zIndexRange(800, 802);
    const defaultData = new ParticleDefaultData(100, 40);
    const opacity = new ParticleOpacityData(0.3);
    emitter.addParticleData(defaultData);
    emitter.addParticleData(opacity);
    emitter.addParticleData(cssData);

    const sizeBehavior = new ParticleSizeByLifeBehavior([0, 1]).withDuration(7000, 2)
    emitter.addParticleBehavior(sizeBehavior);
    // Behavior
    return emitter;
}







