let fxManager;

document.addEventListener("DOMContentLoaded", function () {
  createFX();
  initButtons();
});

function createFX() {
  fxManager = new FXManager()
  .setDebug(true)
  .withAllowDOMOverflow(false)
  .addEmitter(getFlipbookEmitter("fx_flipbook"))
  .addEmitter(getColorshiftEmitter("fx_colorshift"))
  .addEmitter(getColorFilterEmitter("fx_colorfilter"))
  .addEmitter(getChatGPTEmitter("fx_chatGPTEmitter"))
  .addEmitter(getSpiralEmitter("fx_spiral"))
  .build()
}

function getFlipbookEmitter(id) {
  // anchor
  let anchor = document.getElementById("anchor_1");

  // origin
  const origin_rect = new RectangularEmitterOrigin(25, 50, 65, 30)
    .withAnchor(anchor)
    .withMimicShape(true)
    .withOverflow(true)
    .withDomProperties(false, false, true)
    .withContainerProperties(100, 100, 0, 0)
    .withOriginProperties();

  // emitter
  let emitter_shoot = new EmitterShoot(origin_rect).infinite(400, 5000).withDelay(0).withId(id);

  // data
  const data_default = new ParticleDefaultData(120, 120).withClass("flame").pivot(Pivot.CENTER, Pivot.END).withAllowMirrored(true, false);
  const data_flipbook = new ParticleFlipbookData(`../img/fire.png`, 1920, 960, 4, 2);
  const data_css = new ParticleCustomCssData(`mix-blend-mode: color-dodge;`).zIndexRange(300,400);
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
  let emitter_shoot = new EmitterShoot(origin_point).finite(30, 10000, 3000).withDelay(0).withId(id);

  // data
  const data_direction = new ParticleDirectionData(90, 400).withConeNoise(45);
  const data_rotation = new ParticleRotationData(45, 20);
  const data_default = new ParticleDefaultData(70, 70).sizeNoise(0.2, 0.2, true).withClass("duck").pivot(Pivot.CENTER, Pivot.CENTER);
  const data_colorfilter = new ParticleColorfilterData().withColor("#ff7300")
  const data_image = new ParticleImageData(`./../img/rubber_duck.png`, 256, 256);
  emitter_shoot.addParticleData(data_default);
  emitter_shoot.addParticleData(data_image);
  emitter_shoot.addParticleData(data_direction);
  emitter_shoot.addParticleData(data_rotation);
  emitter_shoot.addParticleData(data_colorfilter);

  // behavior
  const behavior_size_by_life = new ParticleSizeByLifeBehavior([0, 1, 1, 1, 1, 1, 1]);
  const behavior_opacity_by_life = new ParticleOpacityByLifeBehavior([1, 1, 1, 0]);
  const behavior_directional = new ParticleDirectionalBehavior();
  const behavior_rotation = new ParticleRotationBehavior(200).withNoise(0.4);
  const behavior_gravity = new ParticleGravityBehavior(400).withNoise(0.5);
  const behavior_colorfilter = new ParticleColorfilterBehavior(["#9100ff", "#a9ff09", "#ff7300"])
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
  let emitter_shoot = new EmitterShoot(origin_circle).infinite(30, 1500).withDelay(0).withId(id);

  // data
  const data_default = new ParticleDefaultData(30, 28).sizeNoise(0.5, -1, false).withClass("flame").pivot(Pivot.CENTER, Pivot.END).withAllowMirrored(true, false);
  const data_css = new ParticleCustomCssData(`
    background: radial-gradient(circle at 35% 30%, #6a6b3a 0%, #5a4a2e 35%, #4a3b24 65%, #3a2e1c 100%);
    border-radius: 58% 42% 55% 45% / 48% 60% 40% 52%;
    border: 1px solid #3a2e1c;
  `).zIndexRange(100, 200);  
  const data_directional = new ParticleDirectionData(90, 300).withSpeedNoise(0.1)
  emitter_shoot.addParticleData(data_default);
  emitter_shoot.addParticleData(data_css);
  emitter_shoot.addParticleData(data_directional);

  // behavior
  const behavior_size_by_life = new ParticleSizeByLifeBehavior([0, 0.5, 0.8, 0.9, 1, 0.9, 0.8, 0.5, 0])
  const behavior_spiral = new ParticleSpiralBehavior(2000, false)
  const behavior_gravity = new ParticleGravityBehavior(7).withNoise(0.1);
  const behavior_direction_by_rotation = new ParticleRotationByDirectionBehavior()
  emitter_shoot.addParticleBehavior(behavior_spiral);
  emitter_shoot.addParticleBehavior(behavior_gravity);
  emitter_shoot.addParticleBehavior(behavior_size_by_life);
  emitter_shoot.addParticleBehavior(behavior_direction_by_rotation);
  
  // finish
  return emitter_shoot;
}


function getChatGPTEmitter(id) {
  // Anchor
  let anchor = document.getElementById("anchor_chatgpt");

  // Origin — tight circular neural core
  const origin = new CircularEmitterOrigin(50, 50, 10, 10)
    .withAnchor(anchor)
    .withOverflow(true)
    .withMimicShape(true)
    .withDomProperties(false, false, true)


  // Emitter — infinite intelligent pulse
  let emitter = new EmitterShoot(origin)
    .infinite(75, 3000, 5)
    .withId(id);

  /* =========================
     DATA
     ========================= */

  // Base particle
  const data_default = new ParticleDefaultData(18, 18)
    .sizeNoise(0.6, 0.6, true)
    .withAllowMirrored(true, true)
    .withClass("chatgpt-neuron");

  // Direction outward
  const data_direction = new ParticleDirectionData(0, 200)
    .withSpeedNoise(0.3)
    .withConeNoise(180);

  // Rotation
  const data_rotation = new ParticleRotationData(0, 1200);

  // Base color filter
  const data_colorfilter = new ParticleColorfilterData()
    .withColor("#00ffa3")
    .withBrightness(120)
    .withSaturation(120);

  // Cosmic glow CSS
  const data_css = new ParticleCustomCssData(`
    background: radial-gradient(circle at 30% 30%, 
      #ffffff 0%, 
      #00ffa3 25%, 
      #0099ff 55%, 
      #6f00ff 85%, 
      transparent 100%);
    border-radius: 50%;
    box-shadow:
      0 0 6px rgba(0,255,163,0.9),
      0 0 14px rgba(0,153,255,0.7),
      0 0 28px rgba(111,0,255,0.5),
      0 0 60px rgba(0,255,163,0.3);
    mix-blend-mode: screen;
  `).zIndexRange(500, 800);

  emitter.addParticleData(data_default);
  emitter.addParticleData(data_direction);
  emitter.addParticleData(data_rotation);
  emitter.addParticleData(data_colorfilter);
  emitter.addParticleData(data_css);

  /* =========================
     BEHAVIOR
     ========================= */

  // Spiral outward like expanding intelligence
  const behavior_spiral = new ParticleSpiralBehavior(2000, true)
    .withRandomStartRotation(true)
    .withSpeedNoise(0.3);

  // Gentle wind oscillation
  const behavior_wind = new ParticleWindBehavior([0, 45, -45, 90, -90], 0.1)
    .withDuration(3000)
    .randomizeShallow(true);

  // Gravity very subtle (floating effect)
  const behavior_gravity = new ParticleGravityBehavior(1)
    .withNoise(0.2);

  // Size breathing cycle
  const behavior_size = new ParticleSizeByLifeBehavior(
    [0, 0.8, 1.4, 1.8, 1.2, 0.5, 0]
  ).withNoise(0.15, true);

  // Opacity pulse
  const behavior_opacity = new ParticleOpacityByLifeBehavior(
    [0, 1, 0.7, 1, 0]
  ).withNoise(0.1);

  // Rotation following movement
  const behavior_rotation_follow = new ParticleRotationByDirectionBehavior(90);

  // Color shift over life (digital spectrum)
  const behavior_colorshift = new ParticleColorShiftBehavior()
    .withHues([0, 120, 240, 360], true)
    .withSaturations([100, 150, 200, 100])
    .withBrightnesses([100, 200, 300, 150])
    .withDuration(6000);

  // Color morph
  const behavior_colorfilter = new ParticleColorfilterBehavior([
    "#00ffa3",
    "#0099ff",
    "#6f00ff",
    "#ffffff"
  ])
  .withRandomStartColor(true)
  .withDuration(6000);

  emitter.addParticleBehavior(behavior_spiral);
  emitter.addParticleBehavior(behavior_wind);
  emitter.addParticleBehavior(behavior_gravity);
  emitter.addParticleBehavior(behavior_size);
  emitter.addParticleBehavior(behavior_opacity);
  emitter.addParticleBehavior(behavior_rotation_follow);
  emitter.addParticleBehavior(behavior_colorshift);
  emitter.addParticleBehavior(behavior_colorfilter);

  return emitter;
} 


function initButtons() {
  const stopBtn = document.querySelector(".buttons_btn--stop");
  const startBtn = document.querySelector(".buttons_btn--start");
  const pauseBtn = document.querySelector(".buttons_btn--pause");
  const pauseGentleBtn = document.querySelector(".buttons_btn--pause-gentle");
  const resumeBtn = document.querySelector(".buttons_btn--resume");
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

  pauseBtn.addEventListener("click", () => {
    fxManager.pause(false);
  });

  pauseGentleBtn.addEventListener("click", () => {
    fxManager.pause(true);
  });

  resumeBtn.addEventListener("click", () => {
    fxManager.resume();
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
