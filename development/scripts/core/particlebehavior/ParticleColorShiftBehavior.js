
class ParticleColorShiftBehavior extends ParticleBehavior {

    /* FIELDS */
  /* CONSTRUCTOR */
  /* FLUENT */
  /* METHODS */

  KEY_HUE = "hue"
  KEY_CONTRAST = "contrast"
  KEY_SATURATION = "saturation"
  KEY_BRIGHTNESS = "brightness"

  _particleColorFilterData;

  _forceForwardHue = true

  _shifterMap = new Map()
  _maxValueMap = new Map()
  _actionMap = new Map()
  _lastAlteredValueMap = new Map()
  
  _duration;
  _durationOverride;





  constructor(hues = null, contrasts = null, saturations = null, brightnesses = null, forceForwardHue = true, duration = -1) {
    super("colorshift")
    this.forceForwardHue = forceForwardHue
    this.duration = duration;
    this.durationOverride = duration > 0;


    /* init Hues */
    if (hues != null) {
      this.shifterMap.set(this.KEY_HUE, forceForwardHue ? this.forceTraverseForward(hues, 0, 360) : hues);
      this.maxValueMap.set(this.KEY_HUE, 360);
      this.lastAlteredValueMap.set(this.KEY_HUE, 0);
      this.actionMap.set(this.KEY_HUE, (alteredValue, upadatedValue) => { 
        this.particleColorFilterData.hueRotate += upadatedValue;

      })
    } else {
      this.actionMap.set(this.KEY_HUE, (alteredValue, upadatedValue) => { })
    }

    /* init Contrasts */
    if (contrasts != null) {
      this.shifterMap.set(this.KEY_CONTRAST, contrasts);
      this.maxValueMap.set(this.KEY_CONTRAST, 100);
      this.lastAlteredValueMap.set(this.KEY_CONTRAST, 0);
      this.actionMap.set(this.KEY_CONTRAST, (alteredValue, upadatedValue) => { this.particleColorFilterData.contrast = alteredValue })
    } else {
      this.actionMap.set(this.KEY_CONTRAST, (alteredValue, upadatedValue) => { })
    }

    /* init Saturations */
    if (saturations != null) {
      this.shifterMap.set(this.KEY_SATURATION, saturations);
      this.maxValueMap.set(this.KEY_SATURATION, 100);
      this.lastAlteredValueMap.set(this.KEY_SATURATION, 0);
      this.actionMap.set(this.KEY_SATURATION, (alteredValue, upadatedValue) => { 
        this.particleColorFilterData.saturation = alteredValue;
      })
    } else {
      this.actionMap.set(this.KEY_SATURATION, (alteredValue, upadatedValue) => { })
    }

    /* init Brightnesses */
    if (brightnesses != null) {
      this.shifterMap.set(this.KEY_BRIGHTNESS, brightnesses);
      this.maxValueMap.set(this.KEY_BRIGHTNESS, 1000);
      this.lastAlteredValueMap.set(this.KEY_BRIGHTNESS, 0);
      this.actionMap.set(this.KEY_BRIGHTNESS, (alteredValue, upadatedValue) => { this.particleColorFilterData.brightness = alteredValue })
    } else {
      this.actionMap.set(this.KEY_BRIGHTNESS, (alteredValue, upadatedValue) => {})
    }
  }

      build() {
        // TODO
    }

  act(particle, actTime, deltaTime) {
    for (let [key, value] of this.shifterMap) {

      const fullRangeProgress = (actTime / this.duration) * (value.length - 1);
      const localProgress = fullRangeProgress % 1;

      const fromIndex = ~~fullRangeProgress % value.length;
      const toIndex = (fromIndex + 1) % value.length;

      const alteredValue = PollenMath.lerp(value[fromIndex], value[toIndex], localProgress) % this.maxValueMap.get(key);
      const upadatedValue = alteredValue - this.lastAlteredValueMap.get(key)

      this.actionMap.get(key)(alteredValue, upadatedValue);

      this.lastAlteredValueMap.set(key, alteredValue)
    }
  }


  forceTraverseForward(valueList, min, max) {
    for (let i = 0; i < valueList.length; i++) {
      if (i > 0) {
        if (valueList[i - 1] > valueList[i]) {
          valueList[i] += max
        }
      }
    }
    return valueList
  }





  reset() {
    this.lastAlteredValueMap.set(this.KEY_BRIGHTNESS, 0);
    this.lastAlteredValueMap.set(this.KEY_CONTRAST, 0);
    this.lastAlteredValueMap.set(this.KEY_HUE, 0);
    this.lastAlteredValueMap.set(this.KEY_SATURATION, 0);
   }


  applyParticle(particle) {
    if (!this.durationOverride) {
      this.duration = particle.lifeTime
    }
  }


  ensureDependencies(particleDataManager, particleBehaviorManager) {
    this.particleColorFilterData = particleDataManager.ensureData("colorfilter")
  }


  createNewBehavior(copy) {
    if (copy) {
      return this
    }
    return new ParticleColorShiftBehavior(
      this.shifterMap.get(this.KEY_HUE),
      this.shifterMap.get(this.KEY_CONTRAST),
      this.shifterMap.get(this.KEY_SATURATION),
      this.shifterMap.get(this.KEY_BRIGHTNESS),
      this.forceForwardHue,
      this.duration
    )
  }


  static createDefault() {
    return new ParticleColorShiftBehavior(
      [0, 360],
      [0, 360],
      [0, 360],
      [0, 360]
    )
  }


  get shifterMap() {
    return this._shifterMap
  }
  set shifterMap(value) {
    this._shifterMap = value
  }

  get particleColorFilterData() {
    return this._particleColorFilterData
  }
  set particleColorFilterData(value) {
    this._particleColorFilterData = value
  }

  get actionMap() {
    return this._actionMap
  }
  set actionMap(value) {
    this._actionMap = value
  }
  get maxValueMap() {
    return this._maxValueMap
  }
  set maxValueMap(value) {
    this._maxValueMap = value
  }
  get forceForwardHue() {
    return this._forceForwardHue
  }
  set forceForwardHue(value) {
    this._forceForwardHue = value
  }

  get duration() {
    return this._duration
  }
  set duration(value) {
    this._duration = value
  }
  get durationOverride() {
    return this._durationOverride
  }
  set durationOverride(value) {
    this._durationOverride = value
  }

  get lastAlteredValueMap() {
    return this._lastAlteredValueMap
  }
  set lastAlteredValueMap(value) {
    this._lastAlteredValueMap = value
  }
  
}