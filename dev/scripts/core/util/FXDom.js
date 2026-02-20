class FXDom {
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
    if (emitterOrigin.anchorElement && emitterOrigin.mimicShape) {
      const computed = window.getComputedStyle(emitterOrigin.anchorElement);
      emitterBox.style.borderRadius = computed.borderRadius;
    }
    if (FXManager.DEBUG == true) {
      emitterBox.style.backgroundImage = `linear-gradient(${emitterOrigin.debugColor.toRgba(0.15)}, ${emitterOrigin.debugColor.toRgba(0.5)})`;
      // border
      emitterBox.style.border = "1px solid black";
      emitterBox.style.boxSizing = "border-box";
    }
    return emitterBox;
  }

  static createCircularOriginBox(circularEmitterOrigin, emitterContainer, overrideDimensions = null) {
    // validity
    if (!FXUtil.valid(emitterContainer)) {
      FXUtil.pollenFXError("No emittercontainer was provided. Something went wrong.");
      return;
    }

    // Create SVG
    let svg_wrapper = FXDom.getSvgWrapper();

    // Create Ellipse
    let ellipse = document.createElementNS(svgNS, "ellipse");
    ellipse.setAttribute("cx", circularEmitterOrigin.posX);
    ellipse.setAttribute("cy", circularEmitterOrigin.posY);
    ellipse.setAttribute("rx", overrideDimensions ?? circularEmitterOrigin.width / 2);
    ellipse.setAttribute("ry", overrideDimensions ?? circularEmitterOrigin.height / 2);
    ellipse.setAttribute("stroke", "black");
    ellipse.setAttribute("stroke-width", "1");
    FXDom.applySvgColor(svg_wrapper, ellipse, circularEmitterOrigin.debugColor);

    // Append circle to SVG
    svg_wrapper.appendChild(ellipse);

    // Append SVG to container
    emitterContainer.appendChild(svg_wrapper);
  }

  static createLineOriginBox(lineEmitterOrigin, emitterContainer) {
    if (!FXUtil.valid(emitterContainer)) {
      FXUtil.pollenFXError("No emittercontainer was provided. Something went wrong.");
      return;
    }

    const svg_wrapper = FXDom.getSvgWrapper();

    const x1 = lineEmitterOrigin.posX;
    const y1 = lineEmitterOrigin.posY;
    const x2 = lineEmitterOrigin.posX_2;
    const y2 = lineEmitterOrigin.posY_2;
    const thickness = lineEmitterOrigin.offset ?? 2; // perpendicular thickness

    // Compute perpendicular vector
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length === 0) return; // avoid zero-length line

    const ux = dx / length; // unit vector along the line
    const uy = dy / length;

    // Perpendicular vector
    const px = (-uy * thickness) / 2;
    const py = (ux * thickness) / 2;

    // Four corners of the thick line rectangle
    const points = [
      `${x1 + px},${y1 + py}`, // corner 1
      `${x2 + px},${y2 + py}`, // corner 2
      `${x2 - px},${y2 - py}`, // corner 3
      `${x1 - px},${y1 - py}`, // corner 4
    ].join(" ");

    // Create polygon
    const polygon = document.createElementNS(svgNS, "polygon");
    polygon.setAttribute("points", points);
    polygon.setAttribute("stroke", "black");
    polygon.setAttribute("stroke-width", "1");
    polygon.setAttribute("vector-effect", "non-scaling-stroke");

    // Apply gradient fill if debugColor exists
    if (lineEmitterOrigin.debugColor) {
      FXDom.applySvgColor(svg_wrapper, polygon, lineEmitterOrigin.debugColor);
    } else {
      polygon.setAttribute("fill", "black");
    }

    svg_wrapper.appendChild(polygon);
    emitterContainer.appendChild(svg_wrapper);
  }

  static createPointOriginBox(pointEmitterOrigin, emitterContainer) {
    FXDom.createCircularOriginBox(pointEmitterOrigin, emitterContainer, 20);
  }

  static createRectangularOriginBox(rectangularEmitterOrigin, emitterContainer) {
    // validity
    if (!FXUtil.valid(emitterContainer)) {
      FXUtil.pollenFXError("No emittercontainer was provided. Something went wrong.");
      return;
    }

    // Create SVG
    let svg_wrapper = FXDom.getSvgWrapper();

    // Create Rectangle
    let rect = document.createElementNS(svgNS, "rect");

    const width = rectangularEmitterOrigin.width;
    const height = rectangularEmitterOrigin.height;

    // Center-based positioning (like ellipse)
    rect.setAttribute("x", rectangularEmitterOrigin.posX - width / 2);
    rect.setAttribute("y", rectangularEmitterOrigin.posY - height / 2);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);

    // Border
    rect.setAttribute("stroke", "black");
    rect.setAttribute("stroke-width", "1");

    // Optional: prevent stroke scaling
    rect.setAttribute("vector-effect", "non-scaling-stroke");

    // Apply gradient fill
    FXDom.applySvgColor(svg_wrapper, rect, rectangularEmitterOrigin.debugColor);

    // Append to SVG
    svg_wrapper.appendChild(rect);

    // Append SVG to container
    emitterContainer.appendChild(svg_wrapper);
  }

  static initAnchorResizeObserver(emitterOrigin, emitterBox) {
    const heightObserver = new ResizeObserver((entries) => {
      // this is necessary because the size of the emitterbox can be expressed as a percentage of the anchor
      FXDom.handleAnchorWidthResizing(emitterOrigin, emitterBox); // emitterbox
      FXDom.handleAnchorHeightResizing(emitterOrigin, emitterBox); // emitterbox
      // Note: Above, the emitterbox is made responsive. This is not yet done for the EmitterOrigin, because withOriginProperties is not yet implemented.
    });
    heightObserver.observe(emitterOrigin.anchorElement);
  }

  static handleAnchorHeightResizing(emitterOrigin, emitterBox) {
    /* Collect nessesary properties */
    const computedStyle = getComputedStyle(emitterOrigin.anchorElement);
    const anchorPaddingTop = FXUtil.fromPixel(computedStyle.paddingTop);
    const anchorPaddingBottom = FXUtil.fromPixel(computedStyle.paddingBottom);
    const anchorBorderTopWidth = Math.ceil(FXUtil.fromPixel(computedStyle.borderTopWidth));
    const anchorBorderBottomWidth = Math.ceil(FXUtil.fromPixel(computedStyle.borderBottomWidth));
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
      let newHeight = (anchorHeight + totalExtraHeight) * heightPercentage;
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
  }

  static handleAnchorWidthResizing(emitterOrigin, emitterBox) {
    /* Collect nessesary properties */
    const computedStyle = getComputedStyle(emitterOrigin.anchorElement);
    const anchorPaddingLeft = FXUtil.fromPixel(computedStyle.paddingLeft);
    const anchorPaddingRight = FXUtil.fromPixel(computedStyle.paddingRight);
    const anchorBorderLeftWidth = Math.ceil(FXUtil.fromPixel(computedStyle.borderLeftWidth));
    const anchorBorderRightWidth = Math.ceil(FXUtil.fromPixel(computedStyle.borderRightWidth));
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
  }

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

  static getSvgWrapper() {
    const svg_wrapper = document.createElementNS(svgNS, "svg");
    svg_wrapper.setAttribute("width", 1);
    svg_wrapper.setAttribute("height", 1);
    svg_wrapper.style.position = "absolute";
    svg_wrapper.style.overflow = "visible";
    svg_wrapper.style.pointerEvents = "none";
    svg_wrapper.style.left = `0px`;
    svg_wrapper.style.top = `0px`;
    return svg_wrapper;
  }

  static applySvgColor(svgWrapper, svgShape, color) {
    const defs = document.createElementNS(svgNS, "defs");

    const gradient = document.createElementNS(svgNS, "linearGradient");
    const gradientId = "fxGradient_" + Math.random().toString(36).substr(2, 9);

    gradient.setAttribute("id", gradientId);
    gradient.setAttribute("x1", "0%");
    gradient.setAttribute("y1", "0%");
    gradient.setAttribute("x2", "0%");
    gradient.setAttribute("y2", "100%");

    const stop1 = document.createElementNS(svgNS, "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", color.toRgba(0.15));

    const stop2 = document.createElementNS(svgNS, "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", color.toRgba(0.5));

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);

    // append defs to SVG
    svgWrapper.appendChild(defs);

    // apply fill to shape
    svgShape.setAttribute("fill", `url(#${gradientId})`);
  }
}
