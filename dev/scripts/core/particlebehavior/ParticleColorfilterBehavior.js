class ParticleColorfilterBehavior extends ParticleBehavior {
  /* FIELDS */
  duration = -1;
  initialDuration = -1;
  colors = [];
  colorsHsb = [];                  // array containing the hsb values
  particleColorfilterData;
  randomStartColor = false;
  startIndex = 0;
  colorIterationCount = -1;
  colorIteration;
  lastColorIndexSum;

  /* CONSTRUCTOR */
  constructor(colors) {
    super("colorfilter");
    this.colors = colors;
  }

  /* FLUENT */
  build(particleDataManager, particleBehaviorManager) {
    this.deriveHSBColors()
    // global config
    this.colorIteration = 0;
    this.startIndex = this.startIndex % this.colorsHsb.length;
    this.lastColorIndexSum = Math.min(this.colorsHsb.length, 1);
    this.duration = this.initialDuration;
    if (this.randomStartColor) {
      this.startIndex = Math.floor(Math.random() * this.colorsHsb.length);
    }
    // ensuring dependencies
    this.particleColorfilterData = particleDataManager.ensureData("colorfilter", false);
    if (this.particleColorfilterData.color === null) {
      this.particleColorfilterData.color = this.colors != null ? this.colors[0] : ColorUtil.debugColor;
      this.particleColorfilterData.build();
    }
    // finish
    return this;
  }

  withRandomStartColor(randomStartColor=true) {
    this.randomStartColor = randomStartColor;
    return this;
  }

  withDuration(duration, colorIterationCount = -1) {
    this.colorIterationCount = colorIterationCount < 0 ? Number.MAX_VALUE : colorIterationCount;
    this.initialDuration = duration;
    return this;
  }

  withStartIndex(startIndex) {
    this.startIndex = startIndex;
    return this;
  }

  reset() {
    this.lastColorIndexSum = Math.min(this.colorsHsb.length, 1);
    this.colorIteration = 0;
    return this;
  }

  /* METHODS */
  deriveHSBColors(){
    this.colorsHsb = this.colors.map((colorHex) => {
      const c = new Color(colorHex);
      return c.getHSB();
    })
  }

  act(particle, startTimeMs, deltaTime, deltaTimeSeconds) {
    const steps = this.colorsHsb.length;

    const fullRangeProgress = (particle.actTime / this.duration) * Math.max(1, steps - 1);
    const localProgress = fullRangeProgress % 1;

    const fromIndex = (this.startIndex + Math.trunc(fullRangeProgress)) % steps;
    const toIndex = (fromIndex + 1) % steps;

    // Color adjusting
    const h = PollenMath.lerp(this.colorsHsb[fromIndex][0], this.colorsHsb[toIndex][0], localProgress);
    const s = PollenMath.lerp(this.colorsHsb[fromIndex][1], this.colorsHsb[toIndex][1], localProgress);
    const b = PollenMath.lerp(this.colorsHsb[fromIndex][2], this.colorsHsb[toIndex][2], localProgress);
    const h_rot = this.particleColorfilterData.getHueShiftForColorTargetFromSepia([h,s,b], this.particleColorfilterData.initialHueRotate)
    // Update
    this.updateColors(h_rot, s, b);
    // check death
    this.checkBehaviorDeath(fromIndex, toIndex, particle);
  }

  updateColors(h, s, b) {
    this.particleColorfilterData.hueRotate = h;
    this.particleColorfilterData.saturation = s;
    this.particleColorfilterData.brightness = b;
  }

  checkBehaviorDeath(fromIndex, toIndex, particle) {
    const maxIndexSum = fromIndex + Math.max(toIndex, fromIndex);
    this.colorIteration += Math.min(1, Math.abs(this.lastColorIndexSum - maxIndexSum));
    this.lastColorIndexSum = maxIndexSum;    
    if (this.colorIteration + 1 > this.colorIterationCount) {
      particle.disableBehavior(this.type);
    }
  }

  applyParticle(particle) {
    if (this.initialDuration <= 0) {
      this.duration = particle.lifeTime;
    }
  }

  createNewBehavior(copy) {
    if (copy) {
      return this;
    }
    return new ParticleColorfilterBehavior(this.colors)
      .withDuration(this.initialDuration, this.colorIterationCount)
      .withRandomStartColor(this.randomStartColor)
      .withStartIndex(this.startIndex);
  }

  static createDefault() {
    return new ParticleColorfilterBehavior([new Color("#FFFFFF"), new Color(ColorUtil.debugColor)]);
  }
}
