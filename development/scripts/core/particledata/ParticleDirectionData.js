

class ParticleDirectionData extends ParticleData {

      /* Parameters */
    _speed = 0
  

    /* Constructor */
    constructor(directionAngle, speed, coneNoise = -1, speedNoise = -1) {
      super("direction")
      this.coneNoise = coneNoise
      this.speedNoise = speedNoise
      this.directionAngle = directionAngle
      this.speed = speed
  
      let alteredSpeed
      if (speedNoise > 0) {
        alteredSpeed = PollenMath.relativeMap(speed, 1 + speedNoise, Math.random())
      } else {
        alteredSpeed = speed
      }
      let alteredDirectionAngle
      if (coneNoise > 0) {
        alteredDirectionAngle =
          directionAngle + (Math.random() * coneNoise - coneNoise / 2)
      } else {
        alteredDirectionAngle = directionAngle
      }
      this.directionX = PollenMath.cos(alteredDirectionAngle) * alteredSpeed
      this.directionY = PollenMath.sin(alteredDirectionAngle) * alteredSpeed * -1
    }
  
  
    reset() {
      let alteredSpeed
      if (this.speedNoise > 0) {
        alteredSpeed = PollenMath.relativeMap(
          this.speed,
          1 + this.speedNoise,
          Math.random()
        )
      } else {
        alteredSpeed = this.speed
      }
  
      let alteredDirectionAngle
      if (this.coneNoise > 0) {
        alteredDirectionAngle =
          this.directionAngle +
          (Math.random() * this.coneNoise - this.coneNoise / 2)
      } else {
        alteredDirectionAngle = this.directionAngle
      }
      this.directionX = PollenMath.cos(alteredDirectionAngle) * alteredSpeed
      this.directionY = PollenMath.sin(alteredDirectionAngle) * alteredSpeed * -1
    }
  
    getCSS() {
      return ""
    }
  
    static createDefault() {
      return new ParticleDirectionData(45, 0)
    }
  
    createNew(copy) {
      if (copy) {
        return this
      }
      return new ParticleDirectionData(
        this.directionAngle,
        this.speed,
        this.coneNoise,
        this.speedNoise
      )
    }
  
    get directionX() {
      return this._directionX
    }
    set directionX(value) {
      this._directionX = value
    }
    get directionY() {
      return this._directionY
    }
    set directionY(value) {
      this._directionY = value
    }
    get speed() {
      return this._speed
    }
    set speed(value) {
      this._speed = value
    }
    get directionAngle() {
      return this._directionAngle
    }
    set directionAngle(value) {
      this._directionAngle = value
    }
    get coneNoise() {
      return this._coneNoise
    }
    set coneNoise(value) {
      this._coneNoise = value
    }
    get speedNoise() {
      return this._speedNoise
    }
    set speedNoise(value) {
      this._speedNoise = value
    }
  }
  