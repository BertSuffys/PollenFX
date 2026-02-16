class ParticleColorfilterBehavior extends ParticleBehavior {
  /* FIELDS */
  duration = -1;
  colors;
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
    this.colorIteration = 0;
    // global config
    this.startIndex = this.startIndex % this.colors.length;
    this.lastColorIndexSum = this.startIndex + (1 % this.colors.length);
    if (this.randomStartColor) {
      this.startIndex = Math.floor(Math.random() * this.colors.length);
    }
    // ensuring dependencies
    this.particleColorfilterData = particleDataManager.ensureData("colorfilter");
    if (this.particleColorfilterData.color === null) {
      this.particleColorfilterData.color = this.colors != null ? this.colors[0] : new Color(ColorUtil.debugColor);
    }
    this.reset();
    // finish
    return this;
  }

  withRandomStartColor(randomStartColor) {
    this.randomStartColor = randomStartColor;
    return this;
  }

  withDuration(duration, colorIterationCount = -1) {
    this.colorIterationCount = colorIterationCount < 0 ? Number.MAX_VALUE : colorIterationCount;
    this.duration = duration;
    return this;
  }

  withStartIndex(startIndex) {
    this.startIndex = startIndex;
    return this;
  }

  reset() {
    this.colorIteration = 0;
    this.lastColorIndexSum = this.startIndex + (1 % this.colors.length);
    ColorUtil.lerpColorToTarget(this.particleColorfilterData.color, this.colors[0], this.colors[1 % this.colors.length], 0);
    this.alterColoring();
    return this;
  }

  /* METHODS */
  act(particle, startTimeMs, deltaTime, deltaTimeSeconds) {
    const steps = this.colors.length;

    const fullRangeProgress = (particle.actTime / this.duration) * Math.max(1, steps - 1);
    const localProgress = fullRangeProgress % 1;

    const fromIndex = (this.startIndex + Math.trunc(fullRangeProgress)) % steps;
    const toIndex = (fromIndex + 1) % steps;

    /* Color adjusting */
    ColorUtil.lerpColorToTarget(this.particleColorfilterData.color, this.colors[fromIndex], this.colors[toIndex], localProgress);
    this.alterColoring();

    this.checkBehaviorDeath(fromIndex, toIndex, particle);
  }

  alterColoring() {
    this.particleColorfilterData.color.updateDerivedValues();
    const hsb = this.particleColorfilterData.color.getHSB();
    this.particleColorfilterData.hueRotate = this.particleColorfilterData.getHueShiftForColorTargetFromSepia(hsb, this.particleColorfilterData.initialHueRotate);
    this.particleColorfilterData.saturation = hsb[1];
    this.particleColorfilterData.brightness = hsb[2];
  }

  checkBehaviorDeath(fromIndex, toIndex, particle) {
    const maxIndexSum = fromIndex + Math.max(toIndex, fromIndex);
    this.colorIteration += Math.min(1, Math.abs(this.lastColorIndexSum - maxIndexSum));
    this.lastOpacityIndexSum = maxIndexSum;
    if (this.colorIteration + 1 > this.colorIterationCount) {
      particle.disableBehavior(this.type);
    }
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
    return new ParticleColorfilterBehavior(this.colors)
      .withDuration(this.duration, this.colorIterationCount)
      .withRandomStartColor(this.randomStartColor)
      .withStartIndex(this.startIndex);
  }

  static createDefault() {
    return new ParticleColorfilterBehavior([new Color("#FFFFFF"), new Color(ColorUtil.debugColor)]);
  }
}
