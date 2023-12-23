

class ParticleSizeByLifeBehavior extends ParticleBehavior {
    _duration = 0
  
    constructor(sizeMultipliersX, sizeMultipliersY, duration = -1, scalarNoise = -1, uniformNoise, sizeIterationCount = -1 ) {
      super("size")
      this.initialSizeMultipliersX = sizeMultipliersX
      this.initialSizeMultipliersY = sizeMultipliersY
      this.duration = duration
      this.scalarNoise = scalarNoise
      this.uniformNoise = uniformNoise
      this.setSizeMultipliers(
        this.initialSizeMultipliersX,
        this.initialSizeMultipliersY
      )
      this.xSizeIteration = 0
      this.ySizeIteration = 0
      this.lastXSizeIndexSum = Math.min(this.sizeMultipliersX.length, 1)
      this.lastYSizeIndexSum = Math.min(this.sizeMultipliersY.length, 1)
      if (sizeIterationCount < 0) {
        this.sizeIterationCount = Number.MAX_VALUE
      } else {
        this.sizeIterationCount = sizeIterationCount
      }
    }
  

  
    reset() {
      this.setInitialSizeData()
      this.xSizeIteration = 0
      this.ySizeIteration = 0
      this.lastXSizeIndexSum = Math.min(this.sizeMultipliersX.length, 1)
      this.lastYSizeIndexSum = Math.min(this.sizeMultipliersY.length, 1)
    }



    act(particle, actTime, deltaTime) {

      const xFullRangeProgress = (actTime / this.duration) * (this.sizeMultipliersX.length - 1);
      const xFromIndex = ~~xFullRangeProgress % this.sizeMultipliersX.length;
      const xToIndex = (xFromIndex + 1) % this.sizeMultipliersX.length;
      const xLocalProgress = xFullRangeProgress % 1;
  
      const yFullRangeProgress = (actTime / this.duration) * (this.sizeMultipliersY.length - 1);
      const yFromIndex = ~~yFullRangeProgress % this.sizeMultipliersY.length;
      const yToIndex = (yFromIndex + 1) % this.sizeMultipliersY.length;
      const yLocalProgress = yFullRangeProgress % 1;
  
      const scalarX = PollenMath.lerp( this.sizeMultipliersX[xFromIndex], this.sizeMultipliersX[xToIndex], xLocalProgress );
      const scalarY = PollenMath.lerp( this.sizeMultipliersY[yFromIndex], this.sizeMultipliersY[yToIndex], yLocalProgress );
  
      const newWidth = this.initialWidth * scalarX;
      const newHeight = this.initialHeight * scalarY;
  
      this.particleDefaultData.width = newWidth;
      this.particleDefaultData.height = newHeight;
  
      this.checkBehaviorDeath(
        yFromIndex,
        yToIndex,
        xFromIndex,
        xToIndex,
        particle
      )
    }
  
  
    applyParticle(particle) {
    //  if (this.duration <= 0) {
        this.duration = particle.lifeTime
        console.log(particle.lifeTime)
    //  }
    }
  
  
    setInitialSizeData() {
      if (this.sizeMultipliersX != null && this.sizeMultipliersX.length > 0) {
        this.particleDefaultData.width =
          this.initialWidth * this.sizeMultipliersX[0]
      }
      if (this.sizeMultipliersY != null && this.sizeMultipliersY.length > 0) {
        this.particleDefaultData.height =
          this.initialHeight * this.sizeMultipliersY[0]
      }
    }
  
  
    setSizeMultipliers(initialSizeMultipliersX, initialSizeMultipliersY) {
      const multipliersXProvided =
        initialSizeMultipliersX != null && initialSizeMultipliersX.length > 0
      const multipliersYProvided =
        initialSizeMultipliersY != null && initialSizeMultipliersY.length > 0
      if (!multipliersXProvided) {
        if (multipliersYProvided) {
          this.sizeMultipliersX = this.copyMultipliers(initialSizeMultipliersY)
          this.sizeMultipliersY = this.copyMultipliers(initialSizeMultipliersY)
        } else {
          this.sizeMultipliersX = [1]
          this.sizeMultipliersY = [1]
        }
      } else {
        this.sizeMultipliersX = this.copyMultipliers(initialSizeMultipliersX)
        if (!multipliersYProvided) {
          this.sizeMultipliersY = this.copyMultipliers(initialSizeMultipliersX)
        } else {
          this.sizeMultipliersY = this.copyMultipliers(initialSizeMultipliersY)
        }
      }
      if (this.scalarNoise > 0) {
        let randoms = []
        if (this.uniformNoise) {
          for (
            let i = 0;
            i <
            Math.max(
              initialSizeMultipliersX.length,
              initialSizeMultipliersY.length
            );
            i++
          ) {
            randoms[i] = Math.random()
          }
        }
        for (let i = 0; i < initialSizeMultipliersX.length; i++) {
          let random = this.uniformNoise ? randoms[i] : Math.random()
          this.sizeMultipliersX[i] = PollenMath.relativeMap(
            this.sizeMultipliersX[i],
            1 + this.scalarNoise,
            random
          )
        }
        for (let i = 0; i < initialSizeMultipliersY.length; i++) {
          let random = this.uniformNoise ? randoms[i] : Math.random()
          this.sizeMultipliersY[i] = PollenMath.relativeMap(
            this.sizeMultipliersY[i],
            1 + this.scalarNoise,
            random
          )
        }
      }
    }
  
  

  
  
    checkBehaviorDeath(yFromIndex, yToIndex, xFromIndex, xToIndex, particle) {
      this.xSizeIteration +=
        Math.abs(xFromIndex + xToIndex - this.lastXSizeIndexSum) / 2
      this.ySizeIteration +=
        Math.abs(yFromIndex + yToIndex - this.lastYSizeIndexSum) / 2
  
      this.lastXSizeIndexSum = xFromIndex + xToIndex
      this.lastYSizeIndexSum = yFromIndex + yToIndex
  
      if (
        Math.max(this.xSizeIteration, this.ySizeIteration) + 1 >
        this.sizeIterationCount
      ) {
        particle.disableBehavior(super.type)
      }
    }
  
  
    copyMultipliers(from) {
      let to = []
      if (from != null) {
        for (let i = 0; i < from.length; i++) {
          to.push(from[i])
        }
      }
      return to
    }
  
  
    static createDefault() {
      return new ParticleSizeByLifeBehavior([0, 1], [0, 1], -1, -1, true)
    }
  
  
    ensureDependencies(particleDataManager, particleBehaviorManager) {
      this.particleDefaultData = particleDataManager.ensureData("default")
      this.initialHeight = this.particleDefaultData.height
      this.initialWidth = this.particleDefaultData.width
      this.setInitialSizeData()
    }
  
  
    createNew(copy) {
      if (copy) {
        return this
      } else {
        return new ParticleSizeByLifeBehavior(
          this.initialSizeMultipliersX,
          this.initialSizeMultipliersY,
          this.duration,
          this.scalarNoise,
          this.uniformNoise,
          this.sizeIterationCount
        )
      }
    }
  
    get lastYSizeIndexSum() {
      return this._lastYSizeIndexSum
    }
    set lastYSizeIndexSum(value) {
      this._lastYSizeIndexSum = value
    }
    get lastXSizeIndexSum() {
      return this._lastXSizeIndexSum
    }
    set lastXSizeIndexSum(value) {
      this._lastXSizeIndexSum = value
    }
    get initialWidth() {
      return this._initialWidth
    }
    set initialWidth(value) {
      this._initialWidth = value
    }
    get initialHeight() {
      return this._initialHeight
    }
    set initialHeight(value) {
      this._initialHeight = value
    }
    get uniformNoise() {
      return this._uniformNoise
    }
    set uniformNoise(value) {
      this._uniformNoise = value
    }
  
    get sizeMultipliersX() {
      return this._sizeMultipliersX
    }
    set sizeMultipliersX(value) {
      this._sizeMultipliersX = value
    }
    get sizeMultipliersY() {
      return this._sizeMultipliersY
    }
    set sizeMultipliersY(value) {
      this._sizeMultipliersY = value
    }
    get duration() {
      return this._duration
    }
    set duration(value) {
      this._duration = value
    }
    get scalarNoise() {
      return this._scalarNoise
    }
    set scalarNoise(value) {
      this._scalarNoise = value
    }
  
    get particleDefaultData() {
      return this._particleDefaultData
    }
    set particleDefaultData(value) {
      this._particleDefaultData = value
    }
    get sizeIterationCount() {
      return this._sizeIterationCount
    }
    set sizeIterationCount(value) {
      this._sizeIterationCount = value
    }
    get xSizeIteration() {
      return this._xSizeIteration
    }
    set xSizeIteration(value) {
      this._xSizeIteration = value
    }
    get ySizeIteration() {
      return this._ySizeIteration
    }
    set ySizeIteration(value) {
      this._ySizeIteration = value
    }
    get initialSizeMultipliersY() {
      return this._initialSizeMultipliersY
    }
    set initialSizeMultipliersY(value) {
      this._initialSizeMultipliersY = value
    }
    get initialSizeMultipliersX() {
      return this._initialSizeMultipliersX
    }
    set initialSizeMultipliersX(value) {
      this._initialSizeMultipliersX = value
    }
  }
  