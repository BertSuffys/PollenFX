let fxManager;

document.addEventListener("DOMContentLoaded", function () {
  createFX();
  initButtons();
});

function createFX() {
  fxManager = new FXManager().addEmitter(getEmitter()).setDebug(false).build();
}

function getEmitter() {
  // anchor
  let anchor = document.getElementById("anchor_1");

  // origin
  const origin = new RectangularEmitterOrigin(27, 27, 54, 54).withAnchor(anchor).withOverflow(true);

  // emitter
  let emitter_shoot = new EmitterShoot(origin).infinite(30, 2500).withId("my_origin");

  // data
  const data_default = new ParticleDefaultData(75, 75);
  const data_css = new ParticleCustomCssData(`background-color: red; border-radius: 20px; border: 1px solid white;`).zIndexRange(300, 400);
  const data_direction = new ParticleDirectionData(90, 500).withConeNoise(45);
  const data_flipbook = new ParticleFlipbookData('./img/soap_bubbles.png', 4000, 2298, 7, 4);
  emitter_shoot.addParticleData(data_default);
  //emitter_shoot.addParticleData(data_css);
  emitter_shoot.addParticleData(data_direction);
  emitter_shoot.addParticleData(data_flipbook);

  // behavior
  const behavior_direction = new ParticleDirectionalBehavior();
  const behavior_gravity = new ParticleGravityBehavior(340);
  const behavior_size = new ParticleSizeByLifeBehavior([0,0.65,0.8,1,1,2]);
  const behavior_flipbook = new ParticleFlipbookBehavior(14);
  emitter_shoot.addParticleBehavior(behavior_direction);
  emitter_shoot.addParticleBehavior(behavior_gravity);
  emitter_shoot.addParticleBehavior(behavior_size);
  emitter_shoot.addParticleBehavior(behavior_flipbook);

  // finish
  return emitter_shoot;
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
