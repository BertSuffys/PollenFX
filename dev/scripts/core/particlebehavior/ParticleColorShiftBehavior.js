class ParticleColorShiftBehavior extends ParticleBehavior {
  /* FIELDS */
  // core fields
  duration = -1;
  forceForwardHue = true;
  particleColorFilterData;
  // keys for indexation
  KEY_HUE = "hue";
  KEY_CONTRAST = "contrast";
  KEY_SATURATION = "saturation";
  KEY_BRIGHTNESS = "brightness";
  // behavior maps
  shifterMap = new Map();
  maxValueMap = new Map();
  actionMap = new Map();
  lastAlteredValueMap = new Map();



  /* CONSTRUCTOR */
  constructor() {
    super("colorshift");
    this.actionMap.set(this.KEY_HUE, (alteredValue, upadatedValue) => {});
    this.actionMap.set(this.KEY_CONTRAST, (alteredValue, upadatedValue) => {});
    this.actionMap.set(this.KEY_SATURATION, (alteredValue, upadatedValue) => {});
    this.actionMap.set(this.KEY_BRIGHTNESS, (alteredValue, upadatedValue) => {});
  }



  /* FLUENT */
  build(particleDataManager, particleBehaviorManager) {
    // ensuring dependencies
    this.particleColorFilterData = particleDataManager.ensureData("colorfilter");
    // finish
    return this;
  }

  withDuration(duration) {
    this.duration = duration;
    return this;
  }

  withHues(hues, forceForwardHue = true) {
    this.forceForwardHue = forceForwardHue;
    if (hues) {
      this.initHues(hues);
    }
    return this;
  }

  withContrasts(contrasts) {
    if (contrasts) {
      this.initContrasts(contrasts);
    }
    return this;
  }

  withSaturations(saturations) {
    if (saturations) {
      this.initSaturation(saturations);
    }
    return this;
  }

  withBrightnesses(brightnesses) {
    if (brightnesses) {
      this.initBrightnesses(brightnesses);
    }
    return this;
  }

  reset() {
    this.lastAlteredValueMap.set(this.KEY_BRIGHTNESS, 0);
    this.lastAlteredValueMap.set(this.KEY_CONTRAST, 0);
    this.lastAlteredValueMap.set(this.KEY_HUE, 0);
    this.lastAlteredValueMap.set(this.KEY_SATURATION, 0);
    return this;
  }


  
  /* METHODS */
  act(particle, startTimeMs, deltaTime, deltaTimeSeconds) {
    for (let [key, value] of this.shifterMap) {
      const fullRangeProgress = (particle.actTime / this.duration) * (value.length - 1);
      const localProgress = fullRangeProgress % 1;

      const fromIndex = ~~fullRangeProgress % value.length;
      const toIndex = (fromIndex + 1) % value.length;

      const alteredValue = PollenMath.lerp(value[fromIndex], value[toIndex], localProgress) % this.maxValueMap.get(key);
      const upadatedValue = alteredValue - this.lastAlteredValueMap.get(key);

      this.actionMap.get(key)(alteredValue, upadatedValue);

      this.lastAlteredValueMap.set(key, alteredValue);
    }
  }

  initHues(hues) {
    this.shifterMap.set(this.KEY_HUE, this.forceForwardHue ? this.forceTraverseForward(hues, 0, 360) : hues);
    this.maxValueMap.set(this.KEY_HUE, 360);
    this.lastAlteredValueMap.set(this.KEY_HUE, 0);
    this.actionMap.set(this.KEY_HUE, (alteredValue, upadatedValue) => {
      this.particleColorFilterData.hueRotate += upadatedValue;
    });
  }

  initContrasts(contrasts) {
    this.shifterMap.set(this.KEY_CONTRAST, contrasts);
    this.maxValueMap.set(this.KEY_CONTRAST, 100);
    this.lastAlteredValueMap.set(this.KEY_CONTRAST, 0);
    this.actionMap.set(this.KEY_CONTRAST, (alteredValue, upadatedValue) => {
      this.particleColorFilterData.contrast = alteredValue;
    });
  }

  initSaturation(saturations) {
    this.shifterMap.set(this.KEY_SATURATION, saturations);
    this.maxValueMap.set(this.KEY_SATURATION, 100);
    this.lastAlteredValueMap.set(this.KEY_SATURATION, 0);
    this.actionMap.set(this.KEY_SATURATION, (alteredValue, upadatedValue) => {
      this.particleColorFilterData.saturation = alteredValue;
    });
  }

  initBrightnesses(brightnesses) {
    this.shifterMap.set(this.KEY_BRIGHTNESS, brightnesses);
    this.maxValueMap.set(this.KEY_BRIGHTNESS, 1000);
    this.lastAlteredValueMap.set(this.KEY_BRIGHTNESS, 0);
    this.actionMap.set(this.KEY_BRIGHTNESS, (alteredValue, upadatedValue) => {
      this.particleColorFilterData.brightness = alteredValue;
    });
  }

  forceTraverseForward(valueList, min, max) {
    for (let i = 0; i < valueList.length; i++) {
      if (i > 0) {
        if (valueList[i - 1] > valueList[i]) {
          valueList[i] += max;
        }
      }
    }
    return valueList;
  }

  applyParticle(particle) {
    if (this.duration <= 0) {
      this.duration = particle.lifeTime;
    }
  }

  createNewBehavior(copy) {
    if (copy) {
      return this;
    }

    return new ParticleColorShiftBehavior()
      .withHues(this.shifterMap.get(this.KEY_HUE), this.forceForwardHue)
      .withContrasts(this.shifterMap.get(this.KEY_CONTRAST))
      .withSaturations(this.shifterMap.get(this.KEY_SATURATION))
      .withBrightnesses(this.shifterMap.get(this.KEY_BRIGHTNESS))
      .withDuration(this.duration);
  }

  static createDefault() {
    return new ParticleColorShiftBehavior().withHues([0, 360]).withContrasts([0, 360]).withSaturations([0, 360]).withBrightnesses([0, 360]).withDuration(-1);
  }
}
