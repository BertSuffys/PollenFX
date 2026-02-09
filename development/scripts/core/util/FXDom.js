class FXDom {
  /**
   * Creates the first, collapsed container element in which the particle effect is going to reside
   */
  static createEmitterContainer(emitterOrigin) {
    let emitterContainer;

    // define a valid anchor. either provided or the document body.
    let anchor;
    let computedStyles;
    if (FXUtil.valid(emitterOrigin.anchorElement)) {
      const invalidAnchor = UNSTABLE_ANCHOR_TYPES.includes(emitterOrigin.anchorElement.tagName.toLowerCase());
      if (invalidAnchor) {
        // wrapper was already made
        if (emitterOrigin.anchorElement.parentNode.classList.contains(PollenFXClasses.EMITTER_CONTAINER_WRAPPER_CLASS)) {
          anchor = emitterOrigin.anchorElement.parentNode;
          computedStyles = window.getComputedStyle(anchor);
        }
        // wrapper must be created
        else {
          anchor = emitterOrigin.anchorElement;
          var anchorParent = document.createElement("div");
          let parent = anchor.parentNode;
          parent.replaceChild(anchorParent, anchor);
          anchorParent.appendChild(anchor);
          anchorParent.classList.add(PollenFXClasses.EMITTER_CONTAINER_WRAPPER_CLASS);
          // Modify styling
          computedStyles = window.getComputedStyle(anchor);
          anchorParent.style.margin = computedStyles.margin;
          anchorParent.style.padding = computedStyles.padding;
          anchor.style.margin = "0";
          anchor.style.padding = "0";
          anchorParent.style.width = "fit-content";
          anchorParent.style.height = "fit-content";
          anchor = anchorParent;
        }
      } else {
        // valid anchor
        anchor = emitterOrigin.anchorElement;
        computedStyles = window.getComputedStyle(anchor);
      }
    } else {
      anchor = document.body;
      computedStyles = window.getComputedStyle(anchor);
    }

    // Create the physical container
    emitterContainer = document.createElement("div");
    emitterContainer.classList.add(PollenFXClasses.EMITTER_CONTAINER_CLASS);
    if (anchor.hasChildNodes()) {
      anchor.insertBefore(emitterContainer, anchor.firstChild); // non-empty anchor -> stack ontop of child list
    } else {
      anchor.appendChild(emitterContainer); // empty anchor -> add
    }

    // Implode the physical container
    emitterContainer.style.width = "0px";
    emitterContainer.style.height = "0px";
    emitterContainer.style.top = "0px";
    emitterContainer.style.left = "0px";
    emitterContainer.style.position = "relative"; // been playing around with the relative/absolute item. uncertain
    if (computedStyles.display == "flex") {
      emitterContainer.style.alignSelf = "start";
    }
    if (FXManager.DEBUG) {
      emitterContainer.style.backgroundColor = "red";
    }
    return emitterContainer;
  }

  /**
   * Voegt een emitterbox element toe aan de container. Dit is de leefwereld van de particles en doen vaak een anchorelement na.
   */
  static createEmitterBox(emitterOrigin, emitterContainer) {
    if (!FXUtil.valid(emitterContainer)) {
      FXUtil.pollenFXError("No emittercontainer was provided. Something went wrong.");
      return;
    }
    let emitterBox = document.createElement("div");
    emitterBox.classList.add(PollenFXClasses.EMITTER_BOX_CLASS);
    emitterContainer.appendChild(emitterBox);

    // Green default emitterbox styling
    emitterBox.style.overflow = emitterOrigin.overflow == true ? "visible" : "hidden";
    emitterBox.style.position = "relative";
    emitterBox.style.pointerEvents = "none";
    if (FXManager.DEBUG == true) {
      const color = Color.randomColor(100, 0.5);
      emitterBox.style.backgroundImage = `linear-gradient(${color.toRgba(0.15)}, ${color.toRgba(0.5)})`;
    }
    return emitterBox;
  }

  /**
   * Debugging circular origin visual
   */
  static createCircularOriginBox(emitterOrigin, emitterContainer) {

  }

  /**
   * Debugging line origin visual
   */
  static createLineOriginBox(emitterOrigin, emitterContainer) {

  }

  /**
   * Debugging point origin visual
   */
  static createPointOriginBox(emitterOrigin, emitterContainer) {

  }

  /**
   * Debugging rectangular origin visual
   */
   static createRectangularOriginBox(emitterOrigin, emitterContainer) {
  //   let originBox = document.createElement("div");
  //   originBox.classList.add(PollenFXClasses.ORIGIN_BOX_CLASS);
  //   originBox.style.position = "absolute";
  //   originBox.style.backgroundColor = "red";
  //   originBox.style.width = "200px";
  //   originBox.style.height = "200px";
  //   emitterContainer.appendChild(originBox);
   }

  /**
   * Adds a width observer which observes the width of the anchorelement, and applies it to the emitterbox
   */
  static initAnchorWidthResizeObserver(emitterOrigin, emitterBox) {
    const widthObserver = new ResizeObserver((entries) => {
      /* Collect nessesary properties */
      const computedStyle = getComputedStyle(emitterOrigin.anchorElement);
      const anchorPaddingLeft = FXUtil.fromPixel(computedStyle.paddingLeft);
      const anchorPaddingRight = FXUtil.fromPixel(computedStyle.paddingRight);
      const anchorBorderLeftWidth = FXUtil.fromPixel(computedStyle.borderLeftWidth);
      const anchorBorderRightWidth = FXUtil.fromPixel(computedStyle.borderRightWidth);
      const anchorMarginLeft = FXUtil.fromPixel(computedStyle.marginLeft);
      const anchorMarginRight = FXUtil.fromPixel(computedStyle.marginRight);
      const anchorWidth = FXUtil.fromPixel(computedStyle.width);

      const totalBorderWidth = emitterOrigin.includeBorder === true ? anchorBorderRightWidth + anchorBorderLeftWidth : 0;
      const totalPaddingWidth = emitterOrigin.includePadding === true ? anchorPaddingRight + anchorPaddingLeft : 0;
      const totalMarginWidth = emitterOrigin.includeMargin === true ? anchorMarginLeft + anchorMarginRight : 0;
      const totalExtraWidth = totalBorderWidth + totalPaddingWidth + totalMarginWidth;

      let widthPercentage = emitterOrigin.containerWidth / 100;

      /*******  Calculate Horizontal-Offset *******/
      let additionalOffsetWidth = 0;
      /*******  Calculate Horizontal-Offset of emitter  due to specificly added left value *******/
      if (emitterOrigin.containerUnitPosX == PositionUnit.PERCENTAGE) {
        additionalOffsetWidth = (anchorWidth + totalExtraWidth) * (emitterOrigin.left / 100);
      } else if (emitterOrigin.containerUnitPosX == PositionUnit.PIXEL) {
        additionalOffsetWidth = emitterOrigin.left;
      } else if (emitterOrigin.containerUnitPosX == PositionUnit.VIEW || emitterOrigin.containerUnitPosX == PositionUnit.VIEW_WIDTH) {
        additionalOffsetWidth = emitterOrigin.left * (window.innerWidth / 100);
      } else {
        FXUtil.pollenFXError("Invalid containerUnit provided for left: " + emitterOrigin.containerUnitPosX);
      }

      /*******  Calculate Horizontal-Offset due to margin/padding/border *******/
      additionalOffsetWidth -= emitterOrigin.includeMargin === true ? anchorMarginLeft : 0;
      additionalOffsetWidth -= emitterOrigin.includeBorder === true ? anchorBorderLeftWidth : 0;
      additionalOffsetWidth += emitterOrigin.includePadding === true ? 0 : anchorPaddingLeft; // i know, a bit confusing
      additionalOffsetWidth *= -1;

      /*******  Calculate Width *******/
      // anchor procentueel
      if (emitterOrigin.containerUnitWidth == PositionUnit.PERCENTAGE) {
        let newWidth = (anchorWidth + totalExtraWidth) * widthPercentage;
        emitterBox.style.width = `${newWidth}px`;
        emitterBox.style.left = `${-1 * (anchorPaddingLeft + additionalOffsetWidth)}px`;
      }
      // Pixel-abolute
      else if (emitterOrigin.containerUnitWidth == PositionUnit.PIXEL) {
        emitterBox.style.width = `${emitterOrigin.containerWidth}${emitterOrigin.containerUnitWidth}`;
        emitterBox.style.left = `${-1 * (anchorPaddingLeft + additionalOffsetWidth)}px`;
      }
      // View-width absolute
      else if (emitterOrigin.containerUnitWidth == PositionUnit.VIEW || emitterOrigin.containerUnitWidth == PositionUnit.VIEW_WIDTH) {
        emitterBox.style.width = `${emitterOrigin.containerWidth}vw`;
        emitterBox.style.left = `${-1 * (anchorPaddingLeft + additionalOffsetWidth)}px`;
      } else {
        FXUtil.pollenFXError("Invalid containerUnit provided for width: " + emitterOrigin.containerUnitWidth);
      }
    });
    widthObserver.observe(emitterOrigin.anchorElement);
  }

  /**
   * Adda a height observer which observes the height of the anchorelement, and applies it to the emitterbox
   */
  static initAnchorHeightResizeObserver(emitterOrigin, emitterBox) {
    const heightObserver = new ResizeObserver((entries) => {
      /* Collect nessesary properties */
      const computedStyle = getComputedStyle(emitterOrigin.anchorElement);
      const anchorPaddingTop = FXUtil.fromPixel(computedStyle.paddingTop);
      const anchorPaddingBottom = FXUtil.fromPixel(computedStyle.paddingBottom);
      const anchorBorderTopWidth = FXUtil.fromPixel(computedStyle.borderTopWidth);
      const anchorBorderBottomWidth = FXUtil.fromPixel(computedStyle.borderBottomWidth);
      const anchorMarginTop = FXUtil.fromPixel(computedStyle.marginTop);
      const anchorMarginBottom = FXUtil.fromPixel(computedStyle.marginBottom);
      const anchorHeight = FXUtil.fromPixel(computedStyle.height);

      const totalBorderHeight = emitterOrigin.includeBorder === true ? anchorBorderTopWidth + anchorBorderBottomWidth : 0;
      const totalPaddingWidth = emitterOrigin.includePadding === true ? anchorPaddingTop + anchorPaddingBottom : 0;
      const totalMarginWidth = emitterOrigin.includeMargin === true ? anchorMarginTop + anchorMarginBottom : 0;
      const totalExtraHeight = totalBorderHeight + totalPaddingWidth + totalMarginWidth;

      let heightPercentage = emitterOrigin.containerHeight / 100;

      /*******  Calculate Vertical-Offset *******/
      let additionalOffsetHeight = 0;
      // Calculate y Offset due to specificly added top value
      if (emitterOrigin.containerUnitPosY == PositionUnit.PERCENTAGE) {
        additionalOffsetHeight = (anchorHeight + totalExtraHeight) * (emitterOrigin.top / 100);
      } else if (emitterOrigin.containerUnitPosY == PositionUnit.PIXEL) {
        additionalOffsetHeight = emitterOrigin.top;
      } else if (emitterOrigin.containerUnitPosY == PositionUnit.VIEW || emitterOrigin.containerUnitPosY == PositionUnit.VIEW_HEIGHT) {
        additionalOffsetHeight = emitterOrigin.top * (window.innerHeight / 100);
      } else {
        FXUtil.pollenFXError("Invalid containerUnit provided for top: " + emitterOrigin.containerUnitPosY);
      }

      /*******  Calculate Vertical-Offset due to margin/padding/border *******/
      additionalOffsetHeight -= emitterOrigin.includeMargin === true ? anchorMarginTop : 0;
      additionalOffsetHeight -= emitterOrigin.includeBorder === true ? anchorBorderTopWidth : 0;
      additionalOffsetHeight += emitterOrigin.includePadding === true ? 0 : anchorPaddingTop; // i know, a bit confusing
      additionalOffsetHeight *= -1;

      /*******  Calculate Height *******/
      // anchor procentueel
      if (emitterOrigin.containerUnitHeight == PositionUnit.PERCENTAGE) {
        let newHeight = (anchorHeight + totalExtraHeight) * heightPercentage + 1;
        emitterBox.style.height = `${newHeight}px`;
        emitterBox.style.top = `${-1 * (anchorPaddingTop + additionalOffsetHeight)}px`;
      }
      // Pixel-abolute
      else if (emitterOrigin.containerUnitHeight == PositionUnit.PIXEL) {
        emitterBox.style.height = `${emitterOrigin.containerHeight}${emitterOrigin.containerUnitHeight}`;
        emitterBox.style.top = `${-1 * (anchorPaddingTop + additionalOffsetHeight)}px`;
      }
      // View-width absolute
      else if (emitterOrigin.containerUnitHeight == PositionUnit.VIEW || emitterOrigin.containerUnitHeight == PositionUnit.VIEW_HEIGHT) {
        emitterBox.style.height = `${emitterOrigin.containerHeight}vh`;
        emitterBox.style.top = `${-1 * (anchorPaddingTop + additionalOffsetHeight)}px`;
      } else {
        FXUtil.pollenFXError("Invalid containerUnit provided for height: " + emitterOrigin.containerUnitHeight);
      }
    });
    heightObserver.observe(emitterOrigin.anchorElement);
  }

  /**
   * Allows for an emittercontainer to always take the size of the body
   */
  static initBodyResizeObserver(emitterBox) {
    const heightObserver = new ResizeObserver((entries) => {
      const width = document.body.scrollWidth;
      const height = document.body.scrollHeight;
      emitterBox.style.width = `${width}px`;
      emitterBox.style.height = `${height}px`;
      emitterBox.style.left = `0px`;
      emitterBox.style.top = `0px`;
    });
    heightObserver.observe(document.body);
  }
}


