let fxManager;

// pauseresume
// Default particle behavior and data for debugging
// Origin visual + origin properties

document.addEventListener("DOMContentLoaded", function () {
  createFX();
  initButtons();
});

function createFX() {
  fxManager = new FXManager().setDebug(false).withAllowDOMOverflow(false)
  .addEmitter(getFlipbookEmitter("fx_flipbook"))
  .addEmitter(getColorshiftEmitter("fx_colorshift"))
  .addEmitter(getColorFilterEmitter("fx_colorfilter"))
  .addEmitter(getSpiralEmitter("fx_spiral"))
  .build(false)//.start();
}


function getFlipbookEmitter(id) {
  // anchor
  let anchor = document.getElementById("anchor_1");

  // origin
  const origin_rect = new RectangularEmitterOrigin(25, 20, 65, 10)
    .withAnchor(anchor)
    .withOverflow(true)
    .withDomProperties(false, false, true)
    .withContainerProperties(100, 100, 0, 0)
    .withOriginProperties();

  // emitter
  let emitter_shoot = new EmitterShoot(origin_rect).infinite(400, 5000).withDelay(0).withId(id);

  // data
  const data_default = new ParticleDefaultData(120, 120).withClass("flame").pivot(Pivot.CENTER, Pivot.END).withAllowMirrored(true, false);
  const data_flipbook = new ParticleFlipbookData(`../img/fire.png`, 1920, 960, 4, 2);
  const data_css = new ParticleCustomCssData(`mix-blend-mode: color-dodge;`);
  emitter_shoot.addParticleData(data_default);
  emitter_shoot.addParticleData(data_flipbook);
  emitter_shoot.addParticleData(data_css);

  // behavior
  const behavior_flipbook = new ParticleFlipbookBehavior(15).withNoise(0.2);
  const behavior_size_by_life = new ParticleSizeByLifeBehavior([0.3, 1, 1.5, 0.8]).withNoise(0.1);
  const behavior_opacity_by_life = new ParticleOpacityByLifeBehavior([0, 1, 0]);
  emitter_shoot.addParticleBehavior(behavior_flipbook);
  emitter_shoot.addParticleBehavior(behavior_size_by_life);
  emitter_shoot.addParticleBehavior(behavior_opacity_by_life);

  // finish
  return emitter_shoot;
}

function getColorshiftEmitter(id) {
  // anchor
  let anchor = document.getElementById("anchor_2");

  // origin
  const origin_circle = new CircularEmitterOrigin(25, 25, 50, 50)
    .withAnchor(anchor)
    .withOverflow(true)
    .withDomProperties(false, false, true)
    .withContainerProperties(100, 100, 0, 0)
    .withOriginProperties();

  // emitter
  let emitter_burst = new EmitterBurst(origin_circle).infinite(5, 500, 2000).withDelay(0).withId(id);

  //data
  const data_direction = new ParticleDirectionData(90, 400).withSpeedNoise(0.3).withConeNoise(30);
  const data_default = new ParticleDefaultData(6, 6).sizeNoise(2, 2, true).withClass("confettoid").pivot(Pivot.CENTER, Pivot.CENTER);
  const data_css = new ParticleCustomCssData(`
    background: radial-gradient(circle at 30% 30%, #fff8c6 0%, #ffd86b 35%, #ff9f1c 70%, #ff6a00 100%);
    border-radius: 50%;
    box-shadow:
      0 0 6px rgba(255, 200, 80, 0.9),
      0 0 12px rgba(255, 150, 0, 0.7),
      0 0 20px rgba(255, 120, 0, 0.4);
  `);
  emitter_burst.addParticleData(data_default);
  emitter_burst.addParticleData(data_css);
  emitter_burst.addParticleData(data_direction);

  // behavior
  const behavior_size_by_life = new ParticleSizeByLifeBehavior([0, 1, 1, 1, 1, 0]);
  const behavior_directional = new ParticleDirectionalBehavior();
  const behavior_gravity = new ParticleGravityBehavior(600);
  const behavior_colorshift = new ParticleColorShiftBehavior().withHues([0, -60], false).withSaturations([1, 7]).withBrightnesses([50, 150]).withContrasts([1, 2]);
  emitter_burst.addParticleBehavior(behavior_size_by_life);
  emitter_burst.addParticleBehavior(behavior_directional);
  emitter_burst.addParticleBehavior(behavior_gravity);
  emitter_burst.addParticleBehavior(behavior_colorshift);

  // finish
  return emitter_burst;
}

function getColorFilterEmitter(id) {
  // anchor
  let anchor = document.getElementById("anchor_3");

  // origin
  const origin_point = new PointEmitterOrigin(25, 25).withAnchor(anchor).withOverflow(true).withDomProperties(false, false, true).withContainerProperties(100, 100, 0, 0).withOriginProperties();

  // emitter
  let emitter_shoot = new EmitterShoot(origin_point).infinite(500, 2500).withDelay(0).withId(id);

  // data
  const data_direction = new ParticleDirectionData(90, 600);
  const data_rotation = new ParticleRotationData(45);
  const data_default = new ParticleDefaultData(30, 30).sizeNoise(2, 2, true).withClass("cube").pivot(Pivot.CENTER, Pivot.CENTER);
  const data_css = new ParticleCustomCssData(`background: cyan; border: 2px solid black;`);
  emitter_shoot.addParticleData(data_default);
  emitter_shoot.addParticleData(data_css);
  emitter_shoot.addParticleData(data_direction);
  emitter_shoot.addParticleData(data_rotation);

  // behavior
  const behavior_size_by_life = new ParticleSizeByLifeBehavior([0, 1, 1, 1, 1, 1, 1]);
  const behavior_opacity_by_life = new ParticleOpacityByLifeBehavior([1, 1, 1, 0]);
  const behavior_directional = new ParticleDirectionalBehavior();
  const behavior_rotation = new ParticleRotationBehavior(200).withNoise(0.4);
  const behavior_gravity = new ParticleGravityBehavior(600).withNoise(0.5);
  const behavior_colorfilter = new ParticleColorfilterBehavior([new Color("#f715f7")]);
  emitter_shoot.addParticleBehavior(behavior_size_by_life);
  emitter_shoot.addParticleBehavior(behavior_directional);
  emitter_shoot.addParticleBehavior(behavior_gravity);
  emitter_shoot.addParticleBehavior(behavior_opacity_by_life);
  emitter_shoot.addParticleBehavior(behavior_rotation);
  emitter_shoot.addParticleBehavior(behavior_rotation);
  emitter_shoot.addParticleBehavior(behavior_colorfilter);

  // finish
  return emitter_shoot;
}

function getSpiralEmitter(id) {
  // anchor
  let anchor = document.getElementById("anchor_4");

  // origin
  const origin_circle = new CircularEmitterOrigin(25, 25, 1, 1)
    .withAnchor(anchor)
    .withOverflow(true)
    .withDomProperties(false, false, true)
    .withContainerProperties(100, 100, 0, 0)
    .withOriginProperties();

  // emitter
  let emitter_shoot = new EmitterShoot(origin_circle).infinite(10, 400).withDelay(0).withId(id);

  // data
  const data_default = new ParticleDefaultData(30, 22).sizeNoise(0.2, -1, false).withClass("flame").pivot(Pivot.CENTER, Pivot.END).withAllowMirrored(true, false);
  const data_css = new ParticleCustomCssData(`background-color: #4A412A; border-radius:30px; border:1px solid #4A412A;`).zIndexRange(100, 200);
  const data_directional = new ParticleDirectionData(90, 300)
  emitter_shoot.addParticleData(data_default);
  emitter_shoot.addParticleData(data_css);
  emitter_shoot.addParticleData(data_directional);

  // behavior
  const behavior_size_by_life = new ParticleSizeByLifeBehavior([0, 0.5, 0.8, 0.9, 1, 0.9, 0.8, 0.5, 0]);
  const behavior_spiral = new ParticleSpiralBehavior(2000, false).withSpeedNoise(1)
  const behavior_gravity = new ParticleGravityBehavior(4).withNoise(3);
  const behavior_direction_by_rotation = new ParticleRotationByDirectionBehavior()
  emitter_shoot.addParticleBehavior(behavior_spiral);
  emitter_shoot.addParticleBehavior(behavior_gravity);
  emitter_shoot.addParticleBehavior(behavior_size_by_life);
  emitter_shoot.addParticleBehavior(behavior_direction_by_rotation);
  
  // finish
  return emitter_shoot;
}

function getLineEmitterOrigin(anchor) {
  return new LineEmitterOrigin(0, 0, 200, 200, 50).withAnchor(anchor).withOverflow(false).withDomProperties(false, false, true).withContainerProperties(300, 300, -100, -100).withOriginProperties();
}


function initButtons() {
  const stopBtn = document.querySelector(".buttons_btn--stop");
  const startBtn = document.querySelector(".buttons_btn--start");
  const restartBtn = document.querySelector(".buttons_btn--restart");
  const CountBtn = document.querySelector(".buttons_btn--count");
  const AvgBtn = document.querySelector(".buttons_btn--avg");
  const FpsBtn = document.querySelector(".buttons_btn--fps");

  stopBtn.addEventListener("click", () => {
    fxManager?.stop();
  });

  startBtn.addEventListener("click", () => {
    fxManager?.start();
  });

  restartBtn.addEventListener("click", () => {
    fxManager?.restart();
  });

  CountBtn.addEventListener("click", () => {
    alert(`There are currently ${fxManager?.getCurrentAliveParticleCount()} active particles.`);
  });

  AvgBtn.addEventListener("click", () => {
    alert(`There are on average ${fxManager?.getAverigeAliveParticleCount()} active particles.`);
  });

  FpsBtn.addEventListener("click", () => {
    alert(`The current FPS rate is ${fxManager?.getFPS()} frames per second`);
  });
  
}
