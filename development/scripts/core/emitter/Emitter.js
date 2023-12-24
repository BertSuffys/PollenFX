
class Emitter extends FXItem {

  _spawnedCount = 0
  _particleBehavior = new Map()
  _particleData = new Map()
  _emitterContainer;
  _emitterBox;






  constructor(particleCount, emitterDuration, delay, emitterOrigin, particleLifetime = 2000, particleLifetimeNoise = -1) {
    /* Beware! the lifetime provided to the super() method = the outcome of the emitter-method: calculateFinalDuration */
    super(Emitter.calculateFinalDuration(particleLifetime, particleLifetimeNoise, emitterDuration, delay))
    this.loop = emitterDuration < 0
    this.spawnedCountAddend = this.loop ? 0 : 1
    this.particleLifetime = particleLifetime
    this.particleLifetimeNoise = particleLifetimeNoise
    this.delay = Math.max(0, delay)
    this.active = delay <= 0
    this.emitterOrigin = emitterOrigin;
    this.cutOff = 0
    this.particleCount = particleCount;
    // infinite emitter
    if (particleLifetime <= 0) {
      this.particleManager = new FXItemManager(this.loop ? -1 : particleCount)
    }
    // finite emitter
    else {
      this.particleManager = new FXItemLifeManager(this.loop ? -1 : particleCount)
    }
    this.ensureEmitterContainer();  // the invisible container storing all emitter-boxes within a singe anchor
    this.createEmitterBox();
  }



  /**
   * Emitter act logic
   */
  act(deltaTime) {
    super.act(deltaTime);
    this.particleManager.act(deltaTime)
  }



  /**
   * Calculates the final lifetime opf an emitter object taking into account possible delay, maximum lifetime of the particle and the duration of the emitter
   */
  calculateFinalDuration(delay, particleLifetime, particleLifetimeNoise, emitterDuration) {
    const maxParticleLifetime = particleLifetimeNoise > 0 ? PollenMath.relativeMap(particleLifetime, 1 + particleLifetimeNoise, 1) : particleLifetime
    return (emitterDuration + maxParticleLifetime + Math.max(0, particleLifetimeNoise) + Math.max(0, delay))
  }

  /**
   * When anchoring to an element, We add an imploded, sizeless container in which the emitterbox is going to then ultimately reside
   */
  ensureEmitterContainer() {
    let emitterContainer;
    let anchor = this.emitterOrigin.anchorElement != null ? this.emitterOrigin.anchorElement : document.body;

    // Create container
    emitterContainer = document.createElement('div');
    emitterContainer.classList.add(PollenFXClasses.EMITTER_CONTAINER_CLASS)
    if (anchor.hasChildNodes()) {
      anchor.insertBefore(emitterContainer, anchor.firstChild);       // non-empty anchor? stack ontop of child list
    } else {
      anchor.appendChild(emitterContainer);                           // empty anchor? just add
    }

    // Container is imploded, but relative with overflow.
    emitterContainer.style.width = "0px";                        // make larger to see where it is positioned
    emitterContainer.style.height = "0px";                       // make larger to see where it is positioned
    emitterContainer.style.top = "0px";                          // make larger to see where it is positioned
    emitterContainer.style.left = "0px";                         // make larger to see where it is positioned
    emitterContainer.style.position = "relative";                // been playing around with this relative/absolute item. uncertain
    if (FXManager.devConfig.DEBUG == true) {
      emitterContainer.style.backgroundColor = "red";
    }
    // Set.
    this.emitterContainer = emitterContainer;
  }



  /**
  * Emitter FXItems has Particle FXItems somewhere down the children-chain. These must be destroyed
  * The emitter was given this responsibility for technical reasons.
  */
  notifyDead() {
    this.particleManager.killAllFXItems();
  }


  /**
  * Voegt een emitterbox element toe (green) aan de container van het ge-anchorde item
  */
  createEmitterBox() {
    if (!valid(this.emitterContainer)) {
      pollenFXError("No emittercontainer was provided. Something went wrong.")
    } else {
      let emitterBox = document.createElement('div');
      emitterBox.classList.add(PollenFXClasses.EMITTER_BOX_CLASS);
      this.emitterContainer.appendChild(emitterBox);
      this.emitterBox = emitterBox;

      // Position & scale to optional anchorelement or document.body
      if (this.emitterOrigin.anchorElement != null) {
        this.initAnchorWidthResizeObserver();               // width and x position
        this.initAnchorHeightResizeObserver();              // height and y position
      } else {
        this.initBodyResizeObserver();
      }

      /* Green default emitterbox styling */
      emitterBox.style.overflow = this.emitterOrigin.overflow == true ? 'visible' : 'hidden';
      emitterBox.style.position = "relative";
      emitterBox.style.pointerEvents = "none";
      //emitterBox.style.zIndex = "2000";
      if (FXManager.devConfig.DEBUG == true) {
        emitterBox.style.backgroundImage = "linear-gradient(rgba(0, 255, 64, 0.164), rgba(0, 255, 64, 0.526))";
        //  emitterBox.style.border = "1px solid black";  // in comment, because it adds two pixels in width & height this adds to
      }
    }
  }

  /**
   * Adda a width observer which observes the width of the anchorelement, and applies it to the emitterbox
   */
  initAnchorWidthResizeObserver() {
    const widthObserver = new ResizeObserver(entries => {
      /* Collect nessesary properties */
      const computedStyle = getComputedStyle(this.emitterOrigin.anchorElement)
      const anchorPaddingLeft = this.fromPixel(computedStyle.paddingLeft);
      const anchorPaddingRight = this.fromPixel(computedStyle.paddingRight);
      const anchorBorderLeftWidth = this.fromPixel(computedStyle.borderLeftWidth);
      const anchorBorderRightWidth = this.fromPixel(computedStyle.borderRightWidth);
      const anchorMarginLeft = this.fromPixel(computedStyle.marginLeft);
      const anchorMarginRight = this.fromPixel(computedStyle.marginRight);
      const anchorWidth = this.fromPixel(computedStyle.width);

      const totalBorderWidth = this.emitterOrigin.includeBorder === true ? anchorBorderRightWidth + anchorBorderLeftWidth : 0;
      const totalPaddingWidth = this.emitterOrigin.includePadding === true ? anchorPaddingRight + anchorPaddingLeft : 0;
      const totalMarginWidth = this.emitterOrigin.includeMargin === true ? anchorMarginLeft + anchorMarginRight : 0;
      const totalExtraWidth = totalBorderWidth + totalPaddingWidth + totalMarginWidth;

      let widthPercentage = this.emitterOrigin.containerWidth / 100

      /*******  Calculate Horizontal-Offset *******/
      let additionalOffsetWidth = 0;
      /*******  Calculate Horizontal-Offset of emitter  due to specificly added left value *******/
      if (this.emitterOrigin.positionUnitWidth == PositionUnit.PERCENTAGE) {
        additionalOffsetWidth = (anchorWidth + totalExtraWidth) * (this.emitterOrigin.left / 100)
      } else if (this.emitterOrigin.positionUnitWidth == PositionUnit.PIXEL) {
        additionalOffsetWidth = this.emitterOrigin.left;
      }
      else if (this.emitterOrigin.positionUnitWidth == PositionUnit.VIEW || this.emitterOrigin.positionUnitWidth == PositionUnit.VIEW_WIDTH) {
        additionalOffsetWidth = this.emitterOrigin.left * (window.innerWidth / 100)
      } else {
        pollenFXError("Invalid containerUnit provided for left: " + this.emitterOrigin.positionUnitWidth)
      }

      /*******  Calculate Horizontal-Offset due to margin/padding/border *******/
      additionalOffsetWidth -= this.emitterOrigin.includeMargin === true ? anchorMarginLeft : 0;
      additionalOffsetWidth -= this.emitterOrigin.includeBorder === true ? anchorBorderLeftWidth : 0;
      additionalOffsetWidth += this.emitterOrigin.includePadding === true ? 0 : anchorPaddingLeft;        // i know, a bit confusing
      additionalOffsetWidth *= -1


      /*******  Calculate Width *******/
      // anchor procentueel
      if (this.emitterOrigin.containerUnitWidth == PositionUnit.PERCENTAGE) {
        let newWidth = ((anchorWidth + totalExtraWidth) * widthPercentage);
        this.emitterBox.style.width = `${newWidth}px`;
        this.emitterBox.style.left = `${-1 * (anchorPaddingLeft + additionalOffsetWidth)}px`;
      }
      // Pixel-abolute
      else if (this.emitterOrigin.containerUnitWidth == PositionUnit.PIXEL) {
        this.emitterBox.style.width = `${this.emitterOrigin.containerWidth}${this.emitterOrigin.containerUnitWidth}`;
        this.emitterBox.style.left = `${-1 * (anchorPaddingLeft + additionalOffsetWidth)}px`;
      }
      // View-width absolute
      else if (this.emitterOrigin.containerUnitWidth == PositionUnit.VIEW || this.emitterOrigin.containerUnitWidth == PositionUnit.VIEW_WIDTH) {
        this.emitterBox.style.width = `${this.emitterOrigin.containerWidth}vw`;
        this.emitterBox.style.left = `${-1 * (anchorPaddingLeft + additionalOffsetWidth)}px`;
      } else {
        pollenFXError("Invalid containerUnit provided for width: " + this.emitterOrigin.containerUnitWidth)
      }
    });
    widthObserver.observe(this.emitterOrigin.anchorElement);
  }



  /**
   * Adda a height observer which observes the height of the anchorelement, and applies it to the emitterbox
   */
  initAnchorHeightResizeObserver() {
    const heightObserver = new ResizeObserver(entries => {
      /* Collect nessesary properties */
      const computedStyle = getComputedStyle(this.emitterOrigin.anchorElement)
      const anchorPaddingTop = this.fromPixel(computedStyle.paddingTop);
      const anchorPaddingBottom = this.fromPixel(computedStyle.paddingBottom);
      const anchorBorderTopWidth = this.fromPixel(computedStyle.borderTopWidth);
      const anchorBorderBottomWidth = this.fromPixel(computedStyle.borderBottomWidth);
      const anchorMarginTop = this.fromPixel(computedStyle.marginTop);
      const anchorMarginBottom = this.fromPixel(computedStyle.marginBottom);
      const anchorHeight = this.fromPixel(computedStyle.height);

      const totalBorderHeight = this.emitterOrigin.includeBorder === true ? anchorBorderTopWidth + anchorBorderBottomWidth : 0;
      const totalPaddingWidth = this.emitterOrigin.includePadding === true ? anchorPaddingTop + anchorPaddingBottom : 0;
      const totalMarginWidth = this.emitterOrigin.includeMargin === true ? anchorMarginTop + anchorMarginBottom : 0;
      const totalExtraHeight = totalBorderHeight + totalPaddingWidth + totalMarginWidth;

      let heightPercentage = this.emitterOrigin.containerHeight / 100;

      /*******  Calculate Vertical-Offset *******/
      let additionalOffsetHeight = 0;
      /* Calculate y Offset due to specificly added top value */
      if (this.emitterOrigin.positionUnitHeight == PositionUnit.PERCENTAGE) {
        additionalOffsetHeight = (anchorHeight + totalExtraHeight) * (this.emitterOrigin.top / 100)
      } else if (this.emitterOrigin.positionUnitHeight == PositionUnit.PIXEL) {
        additionalOffsetHeight = this.emitterOrigin.top;
      }
      else if (this.emitterOrigin.positionUnitHeight == PositionUnit.VIEW || this.emitterOrigin.positionUnitHeight == PositionUnit.VIEW_HEIGHT) {
        additionalOffsetHeight = this.emitterOrigin.top * (window.innerHeight / 100)
      } else {
        pollenFXError("Invalid containerUnit provided for top: " + this.emitterOrigin.positionUnitHeight)
      }

      /*******  Calculate Vertical-Offset due to margin/padding/border *******/
      additionalOffsetHeight -= this.emitterOrigin.includeMargin === true ? anchorMarginTop : 0;
      additionalOffsetHeight -= this.emitterOrigin.includeBorder === true ? anchorBorderTopWidth : 0;
      additionalOffsetHeight += this.emitterOrigin.includePadding === true ? 0 : anchorPaddingTop;        // i know, a bit confusing
      additionalOffsetHeight *= -1



      /*******  Calculate Height *******/
      // anchor procentueel
      if (this.emitterOrigin.containerUnitHeight == PositionUnit.PERCENTAGE) {
        let newHeight = ((anchorHeight + totalExtraHeight) * heightPercentage) + 1;
        this.emitterBox.style.height = `${newHeight}px`;
        this.emitterBox.style.top = `${-1 * (anchorPaddingTop + additionalOffsetHeight)}px`;
      }
      // Pixel-abolute
      else if (this.emitterOrigin.containerUnitHeight == PositionUnit.PIXEL) {
        this.emitterBox.style.height = `${this.emitterOrigin.containerHeight}${this.emitterOrigin.containerUnitHeight}`;
        this.emitterBox.style.top = `${-1 * (anchorPaddingTop + additionalOffsetHeight)}px`;
      }
      // View-width absolute
      else if (this.emitterOrigin.containerUnitHeight == PositionUnit.VIEW || this.emitterOrigin.containerUnitHeight == PositionUnit.VIEW_HEIGHT) {
        this.emitterBox.style.height = `${this.emitterOrigin.containerHeight}vh`;
        this.emitterBox.style.top = `${-1 * (anchorPaddingTop + additionalOffsetHeight)}px`;
      }
      else {
        pollenFXError("Invalid containerUnit provided for height: " + this.emitterOrigin.containerUnitHeight)
      }
    });
    heightObserver.observe(this.emitterOrigin.anchorElement);
  }

  /**
   * Allows for an emittercontainer to always take the size of the body
   */
  initBodyResizeObserver() {
    const heightObserver = new ResizeObserver(entries => {
      const width = document.body.scrollWidth;
      const height = document.body.scrollHeight;
      this.emitterBox.style.width = `${width}px`;
      this.emitterBox.style.height = `${height}px`;
      this.emitterBox.style.left = `0px`;
      this.emitterBox.style.top = `0px`;
    });
    heightObserver.observe(document.body);
  }


  /**
   * Turns '138.4px' into 138.4
   */
  fromPixel(pixelValueString) {
    return parseInt(pixelValueString.replace("px", ""));
  }


  /**
   * Calculates the final lifetime opf an emitter object taking into account possible delay, maximum lifetime of the particle and the duration of the emitter
   */
  static calculateFinalDuration(particleLifetime, particleLifetimeNoise, emitterDuration, delay) {
    let finalEmitterDuration = Math.max(0, delay) + emitterDuration;
    if(particleLifetimeNoise > 0){
      let maxParticleLifetime = PollenMath.relativeMap(particleLifetime, particleLifetimeNoise, 1);
      finalEmitterDuration += maxParticleLifetime;
    }else{
      finalEmitterDuration += particleLifetime;
    }
    return finalEmitterDuration
  }


  /**
   * Generates a lifetime value for the enxt particle that is to be spawned
   */
  generateNextParticleLifetime() {
    if (this.particleLifetimeNoise > 0) {
      return PollenMath.relativeMap( this.particleLifetime, this.particleLifetimeNoise, Math.random())
    } else {
      return this.particleLifetime
    }
  }


  addParticleBehavior(behavior) {
    this.setParticleBehavior(behavior.type, behavior)
  }

  setParticleBehavior(key, behavior) {
    this.getActiveParticles().forEach(particle =>
      particle.addParticleBehavior(behavior.createNew(false))
    )
    this.particleBehavior.set(key, behavior)
  }


  addParticleData(data) {
    this.setParticleData(data.type, data)
  }



  getClassName() {
    return "emitter"
  }


  setParticleData(key, data) {
    this.getActiveParticles().forEach(particle =>
      particle.addParticleData(data.createNew(false))
    )
    this.particleData.set(key, data)
  }

  getActiveParticles() {
    return this.particleManager.getActiveFXItems()
  }




  reset() {
    return this
  }

  hideCSS() {

  }

  showCSS() {

  }

  get emitterContainer() {
    return this._emitterContainer
  }
  set emitterContainer(value) {
    this._emitterContainer = value
  }
  get emitterBox() {
    return this._emitterBox
  }
  set emitterBox(value) {
    this._emitterBox = value
  }
  get emitterOrigin() {
    return this._emitterOrigin
  }
  set emitterOrigin(value) {
    this._emitterOrigin = value
  }
  get delay() {
    return this._delay
  }
  set delay(value) {
    this._delay = value
  }
  get particleManager() {
    return this._particleManager
  }
  set particleManager(value) {
    this._particleManager = value
  }
  get active() {
    return this._active
  }
  set active(value) {
    this._active = value
  }

  get cutOff() {
    return this._cutOff
  }
  set cutOff(value) {
    this._cutOff = value
  }
  get spawnedCount() {
    return this._spawnedCount
  }
  set spawnedCount(value) {
    this._spawnedCount = value
  }
  get particleBehavior() {
    return this._particleBehavior
  }
  set particleBehavior(value) {
    this._particleBehavior = value
  }
  get particleData() {
    return this._particleData
  }
  set particleData(value) {
    this._particleData = value
  }

  get particleCount() {
    return this._particleCount
  }
  set particleCount(value) {
    this._particleCount = value
  }
  get particleLifetimeNoise() {
    return this._particleLifetimeNoise
  }
  set particleLifetimeNoise(value) {
    this._particleLifetimeNoise = value
  }
  get particleLifetime() {
    return this._particleLifetime
  }
  set particleLifetime(value) {
    this._particleLifetime = value
  }
  get loop() {
    return this._loop
  }
  set loop(value) {
    this._loop = value
  }
  get spawnedCountAddend() {
    return this._spawnedCountAddend
  }
  set spawnedCountAddend(value) {
    this._spawnedCountAddend = value
  }
}