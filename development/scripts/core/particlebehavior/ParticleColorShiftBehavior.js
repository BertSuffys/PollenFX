
class ParticleColorShiftBehavior extends ParticleBehavior {

    KEY_HUE = "hue"
    KEY_CONTRAST = "contrast"
    KEY_SATURATION = "saturation"
    KEY_BRIGHTNESS = "brightness"
  
    _forceForwardHue = true
  
    _shifterMap = new Map()
    _maxValueMap = new Map()
    _actionMap = new Map()
  
  
    constructor(
      hues = null,
      contrasts = null,
      saturations = null,
      brightnesses = null,
      forceForwardHue = true
    ) {
      super("colorshift")
      this.forceForwardHue = forceForwardHue
  
      if (hues != null) {
        this.shifterMap.set(
          this.KEY_HUE,
          forceForwardHue ? this.forceTraverseForward(hues, 0, 360) : hues
        )
        this.maxValueMap.set(this.KEY_HUE, 360)
        this.actionMap.set(this.KEY_HUE, alteredValue => {
          this.particleColorFilterData.hueRotate = alteredValue
        })
      } else {
        this.actionMap.set(this.KEY_HUE, alteredValue => {
  
        })
      }
  
      if (contrasts != null) {
        this.shifterMap.set(this.KEY_CONTRAST, contrasts)
        this.maxValueMap.set(this.KEY_CONTRAST, 100)
        this.actionMap.set(this.KEY_CONTRAST, alteredValue => {
          this.particleColorFilterData.contrast = alteredValue
        })
      } else {
        this.actionMap.set(this.KEY_CONTRAST, alteredValue => {
  
        })
      }
  
  
      if (saturations != null) {
        this.shifterMap.set(this.KEY_SATURATION, saturations)
        this.maxValueMap.set(this.KEY_SATURATION, 100)
        this.actionMap.set(this.KEY_SATURATION, alteredValue => {
          this.particleColorFilterData.saturation = alteredValue
        })
      } else {
        this.actionMap.set(this.KEY_SATURATION, alteredValue => {
        })
      }
  
  
      if (brightnesses != null) {
        this.shifterMap.set(this.KEY_BRIGHTNESS, brightnesses)
        this.maxValueMap.set(this.KEY_BRIGHTNESS, 1000)
        this.actionMap.set(this.KEY_BRIGHTNESS, alteredValue => {
          this.particleColorFilterData.brightness = alteredValue
        })
      } else {
        this.actionMap.set(this.KEY_BRIGHTNESS, alteredValue => {
        })
      }
    }
  
    act(particle, actTime, deltaTime) {
      for (let [key, value] of this.shifterMap) {
        const fullRangeProgress =
          (actTime / particle.lifeTime) * (value.length - 1)
        const localProgress = fullRangeProgress % 1
  
        const fromIndex = ~~fullRangeProgress % value.length
        const toIndex = (fromIndex + 1) % value.length
        const alteredValue =
        PollenMath.lerp(value[fromIndex], value[toIndex], localProgress) %
          this.maxValueMap.get(key)
  
        this.actionMap.get(key)(alteredValue)
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
  
  

  
  
    reset() { }
  
  
    applyParticle(particle) { }
  
  
    ensureDependencies(particleDataManager, particleBehaviorManager) {
      this.particleColorFilterData = particleDataManager.ensureData("colorfilter")
    }
  
  
    createNew(copy) {
      if (copy) {
        return this
      }
      return new ParticleColorShiftBehavior(
        this.shifterMap.get(this.KEY_HUE),
        this.shifterMap.get(this.KEY_CONTRAST),
        this.shifterMap.get(this.KEY_SATURATION),
        this.shifterMap.get(this.KEY_BRIGHTNESS),
        this.forceForwardHue
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
  }