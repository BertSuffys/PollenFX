/*
=========================================================================
                            TERMS OF USE
=========================================================================

All rights reserved. This JavaScript particle engine script (PollenFX - v1.0.0BETA)
is the intellectual property of Bert Suffys. By accessing
and using this script, you agree to the following terms:

1. Ownership and Copyright:
   - The script is owned by Bert Suffys.
   - Copyright © 2026 Bert Suffys. All rights reserved.

2. Permitted Use:
   - You are granted a non-exclusive, non-transferable license to use the
     script for personal or non-commercial purposes.

3. Prohibited Activities:
   - You may not reproduce, distribute, sell, or otherwise exploit the script
     for commercial purposes without the express written consent of Bert Suffys.
   - Any unauthorized use of the script is strictly prohibited and in case of violation 
     legal actions might follow. Bert Suffys reserves the right to pursue all available
     legal remedies.

4. No Warranty:
   - The script is provided "as is" without any warranty of any kind,
     express or implied. Bert Suffys makes no representations
     or warranties regarding the accuracy or completeness of the script. Although,
     once legally obtained, updated versions will always be granted upon requesting.

5. Limitation of Liability:
   - Bert Suffys can never be liable for any direct, indirect,
     incidental, special, or consequential damages resulting from the use or
     inability to use the script.

6. Modifications:
   - Bert Suffys reserves the right to modify, suspend, or
     discontinue the script at any time.

By using the script, you acknowledge that you have read, understood, and agree
to be bound by these terms. Any violation of these terms may result in legal
action.

For licensing inquiries or other questions, contact bert-suffys@hotmail.com.

=========================================================================
*/
const svgNS = "http://www.w3.org/2000/svg";
const FXConfig = {
PFX_STYLES_SET: false,
};
const Pivot = {
BEGIN: 0,
CENTER: 0.5,
END: 1,
};
const PollenFXClasses = {
EMITTER_CONTAINER_WRAPPER_CLASS: "pollenfx_emitter_wrapper",
EMITTER_CONTAINER_CLASS: "pollenfx_emitter_container",
EMITTER_BOX_CLASS: "pollenfx_emitter_box",
ORIGIN_BOX_CLASS: "pollenfx_origin_box",
PARTICLE_BOX_CLASS: "pollenfx_particle_box",
PFX_DISALLOW_OVERFLOW_CLASS: "pfx-disallow-overflow"
};
const PositionUnit = {
PERCENTAGE: "%",
PIXEL: "px",
VIEW_WIDTH: "vw",
VIEW_HEIGHT: "vh",
VIEW: "v",
};
const ImageFitting = {
COVER: "cover",
FIT: "100% 100%",
CONTAIN: "contain",
};
const UNSTABLE_ANCHOR_TYPES = ["img", "button", "address", "h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "em"];
class FXUtil {
static pollenFXError(msg) {
let fullMessage = "PollenFX Error -> ".concat(FXUtil.valid(msg) ? msg : "");
throw new Error(fullMessage);
}
static valid(value) {
if (value == null) return false;
if (typeof value === "string") return value !== "";
return true;
}
static writeClassToDomElement(element, clazz) {
if (FXUtil.valid(element) && FXUtil.valid(clazz)) {
element.classList.add(clazz);
}
}
static disallowElementOverflow(element) {
FXUtil.writeClassToDomElement(element, PollenFXClasses.PFX_DISALLOW_OVERFLOW_CLASS);
}
static addDocumentCSS(styles) {
if (!FXConfig.PFX_STYLES_SET && FXUtil.valid(styles) && Array.isArray(styles)) {
const styleElement = document.createElement("style");
styleElement.type = "text/css";
const stylesJoined = styles.join();
styleElement.textContent = stylesJoined;
document.head.appendChild(styleElement);
FXConfig.PFX_STYLES_SET = true;
}
}
static fromPixel(pixelValueString) {
return parseInt(pixelValueString.replace("px", ""));
}
}
class FXItem {
spawnTime;
actTime;
lifeTime;
liveTime;
fxItemId;
paused;
constructor(lifeTime) {
this.setLifetime(lifeTime);
this.spawnTime = Date.now();
this.liveTime = this.spawnTime;
this.actTime = 0;
}
act(deltaTime) {
if(!this.paused){
this.actTime += deltaTime;
}
this.liveTime += deltaTime;
}
isDead() {
return (this.actTime >= this.lifeTime);
}
reset(lifeTime) {
this.lifeTime = lifeTime;
this.spawnTime = Date.now();
this.liveTime = this.spawnTime;
this.actTime = 0;
}
isPermanent() {
return this.lifeTime == -1;
}
die(cleanDOM) {
FXUtil.pollenFXError("The die method is considered abstract and was not implemented by an FXItem subclass.");
}
revive() {
FXUtil.pollenFXError("The revive method is considered abstract and was not implemented by an FXItem subclass.");
}
hideCSS() {
FXUtil.pollenFXError("The hideCSS method is considered abstract and was not implemented by an FXItem subclass.");
}
showCSS() {
FXUtil.pollenFXError("The showCSS method is considered abstract and was not implemented by an FXItem subclass.");
}
getClassName() {
FXUtil.pollenFXError("The getClassName method is considered abstract and was not implemented by an FXItem subclass.");
}
withId(id){
if(FXUtil.valid(id)){
this.fxItemId = id;
}else{
FXUtil.pollenFXError("An invalid fxItemId was provided in the withId() method.");
}
return this;
}
setLifetime(lifeTime){
this.lifeTime = lifeTime ?? -1;
}
}
class PollenMath {
static POLLEN_PI = 3.14159;
static mapNumber(fromStart, fromEnd, toStart, toEnd, mappedNumber) {
if (fromEnd === fromStart) {
return 0;
}
return ((mappedNumber - fromStart) / (fromEnd - fromStart)) * (toEnd - toStart) + toStart;
}
static randomBetween(upperLimit, lowerLimit, allowDecimals) {
let rand = Math.random() * (upperLimit - lowerLimit) + lowerLimit;
return allowDecimals ? rand : Math.round(rand);
}
static cleanRound(value, decimalPlaces) {
const delimiter = Math.pow(10, decimalPlaces);
return Math.round((value + Number.EPSILON) * delimiter) / delimiter;
}
static degToRad(degrees) {
return (degrees / 180) * this.POLLEN_PI;
}
static radToDeg(rad) {
return rad * (180 / this.POLLEN_PI);
}
static cos(degrees) {
return Math.cos(this.degToRad(degrees));
}
static sin(radials) {
return Math.sin(this.degToRad(radials));
}
static positiveMap(number, scalar, random = -1) {
random = random == -1 ? Math.random() : random;
const halfRange = number * scalar - number;
const offset = random * (2 * halfRange) - halfRange;
return Math.max(0, number + offset);
}
static relativeMap(number, scalar, random = -1) {
random = random == -1 ? Math.random() : random;
scalar = Math.max(0, scalar);
const max = number + (scalar / 2) * number;
const min = (1 / (scalar + 1)) * number;
const range = max - min;
const value = random * range + min;
return value;
}
static absoluteMap(number, scalar, random = -1) {
random = random == -1 ? Math.random() : random;
scalar = Math.max(0, scalar);
const maxOffset = (scalar / 2) * number;
const max = number + maxOffset;
const min = number - maxOffset;
const range = max - min;
const value = random * range + min;
return value;
}
static lerp(number_1, number_2, lerpFactor) {
return number_1 - (number_1 - number_2) * lerpFactor;
}
static modulo(value, moduloValue) {
if (moduloValue == 0) {
return value;
}
return ((value % moduloValue) + moduloValue) % moduloValue;
}
static randomSign() {
return Math.random() < 0.5 ? -1 : 1;
}
}
class ColorUtil {
static HEX_LENGTH = 7;
static debugColor = "#14f548";
static getSepia() {
return new Color("#704214");
}
static lerpColor(color_1, color_2, lerpFactor) {
const rLerp = Math.floor(PollenMath.lerp(color_1.r, color_2.r, lerpFactor));
const gLerp = Math.floor(PollenMath.lerp(color_1.g, color_2.g, lerpFactor));
const bLerp = Math.floor(PollenMath.lerp(color_1.b, color_2.b, lerpFactor));
return new Color(rLerp, gLerp, bLerp);
}
static validateHexColors(hexColors) {
if (FXUtil.valid(hexColors)) {
for (let i = 0; i < hexColors.length; i++) {
hexColors[i] = this.validateHexColor(hexColors[i]);
}
}
return hexColors;
}
static validateHexColor(hexColor) {
if (FXUtil.valid(hexColor)) {
return this.debugColor;
}
if (!hexColor.startsWith("#")) {
hexColor = "#".concat(hexColor);
}
for (let i = 1; hexColor.length; i++) {
if (!/^[0-9a-fA-F]+$/.test(hexColor[i])) {
hexColor = hexColor.substring(0, i) + "F" + hexColor.substring(i + 1);
}
}
if (hexColor.length != this.HEX_LENGTH) {
if (hexColor.length > this.HEX_LENGTH) {
hexColor = hexColor.substring(0, this.HEX_LENGTH);
} else {
const missingCharacterCount = this.HEX_LENGTH - hexColor.length;
for (let i = 0; missingCharacterCount; i++) {
hexColor = hexColor + "F";
}
}
}
return hexColor;
}
static RGBtoHSV(r, g, b, hue_360_range = false) {
const max = Math.max(r, g, b);
const min = Math.min(r, g, b);
const d = max - min;
let h;
let s = max === 0 ? 0 : d / max;
let v = max / 255;
switch (max) {
case min:
h = 0;
break;
case r:
h = g - b + d * (g < b ? 6 : 0);
h /= 6 * d;
break;
case g:
h = b - r + d * 2;
h /= 6 * d;
break;
case b:
h = r - g + d * 4;
h /= 6 * d;
break;
}
return [(h *= hue_360_range ? 3.6 : 1), s, v];
}
static rgbToHSL(color) {
let r = color.r / 255;
let g = color.g / 255;
let b = color.b / 255;
let cmin = Math.min(r, g, b),
cmax = Math.max(r, g, b),
delta = cmax - cmin,
h = 0,
s = 0,
l = 0;
if (delta == 0) h = 0;
else if (cmax == r) h = ((g - b) / delta) % 6;
else if (cmax == g) h = (b - r) / delta + 2;
else h = (r - g) / delta + 4;
h = Math.round(h * 60);
if (h < 0) h += 360;
l = (cmax + cmin) / 2;
s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
s = +(s * 100).toFixed(1);
l = +(l * 100).toFixed(1);
return [h, s, l];
}
static HSVtoRGB(h, s, v) {
let r;
let g;
let b;
let i = Math.floor(h * 6);
let f = h * 6 - i;
let p = v * (1 - s);
let q = v * (1 - f * s);
let t = v * (1 - (1 - f) * s);
switch (i % 6) {
case 0:
((r = v), (g = t), (b = p));
break;
case 1:
((r = q), (g = v), (b = p));
break;
case 2:
((r = p), (g = v), (b = t));
break;
case 3:
((r = p), (g = q), (b = v));
break;
case 4:
((r = t), (g = p), (b = v));
break;
case 5:
((r = v), (g = p), (b = q));
break;
}
return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
}
class Color {
r = 0;
g = 0;
b = 0;
r_norm = 0;
g_norm = 0;
b_norm = 0;
hue = 0;
saturation = 0;
brightness = 0;
opacity = 1;
hex = "#000000";
static HEX_LENGTH = 7;
static SEPIA_HUE = 38;
constructor(...args) {
if (args.length === 3) {
this.setRGB(args[0], args[1], args[2]);
} else {
this.hex = this.validateAndCorrectHexInput(args[0]);
this.rgbFromHex();
}
this.updateDerivedValues();
}
static copy(color) {
if (!color) return null;
const c = new Color(color.r, color.g, color.b);
c.opacity = color.opacity;
return c;
}
setRGB(r, g, b) {
this.r = Color.clamp255(r);
this.g = Color.clamp255(g);
this.b = Color.clamp255(b);
this.updateDerivedValues();
return this;
}
setOpacity(value) {
this.opacity = Color.clamp01(value);
return this;
}
multiplyOpacity(factor) {
this.opacity = Color.clamp01(this.opacity * factor);
return this;
}
hueShift(degrees) {
const hsv = ColorUtil.RGBtoHSV(this.r, this.g, this.b);
hsv[0] = PollenMath.modulo(hsv[0] + degrees / 360, 1);
const rgb = ColorUtil.HSVtoRGB(hsv[0], hsv[1], hsv[2]);
this.setRGB(rgb[0], rgb[1], rgb[2]);
return this;
}
updateDerivedValues() {
this.r_norm = this.r / 255;
this.g_norm = this.g / 255;
this.b_norm = this.b / 255;
this.hexFromRGB();
this.updateHSB();
}
updateHSB() {
const max = Math.max(this.r_norm, this.g_norm, this.b_norm);
const min = Math.min(this.r_norm, this.g_norm, this.b_norm);
const delta = max - min;
this.brightness = Math.round(max * 100);
if (delta === 0) {
this.hue = 0;
this.saturation = 0;
return;
}
this.saturation = Math.round((delta / max) * 100);
let hue;
if (max === this.r_norm) {
hue = ((this.g_norm - this.b_norm) / delta) % 6;
} else if (max === this.g_norm) {
hue = (this.b_norm - this.r_norm) / delta + 2;
} else {
hue = (this.r_norm - this.g_norm) / delta + 4;
}
this.hue = Math.round((hue * 60 + 360) % 360);
}
getHSB(){
return [this.hue, this.saturation, this.brightness]
}
hexFromRGB() {
this.hex =
"#" +
this.r.toString(16).padStart(2, "0") +
this.g.toString(16).padStart(2, "0") +
this.b.toString(16).padStart(2, "0");
}
rgbFromHex() {
this.r = parseInt(this.hex.slice(1, 3), 16);
this.g = parseInt(this.hex.slice(3, 5), 16);
this.b = parseInt(this.hex.slice(5, 7), 16);
}
toRgba(opacityOverride = null) {
const a = opacityOverride !== null
? Color.clamp01(opacityOverride)
: this.opacity;
return `rgba(${this.r}, ${this.g}, ${this.b}, ${a})`;
}
static randomColor(saturation = 100, opacity = 1) {
saturation = Color.clamp100(saturation);
opacity = Color.clamp01(opacity);
const hue = Math.random();
const rgb = ColorUtil.HSVtoRGB(hue, saturation / 100, 1);
const c = new Color(rgb[0], rgb[1], rgb[2]);
c.opacity = opacity;
return c;
}
validateAndCorrectHexInput(hex) {
if (!FXUtil.valid(hex)) hex = ColorUtil.debugColor;
if (!hex.startsWith("#")) hex = "#" + hex;
hex = hex.slice(0, Color.HEX_LENGTH).padEnd(Color.HEX_LENGTH, "F");
return "#" + hex
.slice(1)
.replace(/[^0-9a-fA-F]/g, "F");
}
static clamp01(v) {
return Math.max(0, Math.min(1, v));
}
static clamp100(v) {
return Math.max(0, Math.min(100, v));
}
static clamp255(v) {
return Math.max(0, Math.min(255, v));
}
}
class EmitterOrigin {
originalPosX;
originalPosY;
posX;
posY;
posXNoise = -1;
posYNoise = -1;
overflow = true;
anchorElement = null;
originUnitWidth = PositionUnit.PIXEL;
originUnitHeight = PositionUnit.PIXEL;
originUnitPosX = PositionUnit.PIXEL;
originUnitPosY = PositionUnit.PIXEL;
containerWidth = 100;
containerHeight = 100;
containerUnitWidth = PositionUnit.PERCENTAGE;
containerUnitHeight = PositionUnit.PERCENTAGE;
top = 0;
left = 0;
containerUnitPosX = PositionUnit.PERCENTAGE;
containerUnitPosY = PositionUnit.PERCENTAGE;
mimicShape = false;
includeMargin = false;
includePadding = true;
includeBorder = true;
debugColor = null;
constructor(posX, posY) {
this.originalPosX = Math.round(posX);
this.originalPosY = Math.round(posY);
}
withDomProperties(includeMargin=false, includePadding=true, includeBorder=true) {
this.includeMargin = includeMargin;
this.includePadding = includePadding;
this.includeBorder = includeBorder;
return this;
}
withMimicShape(mimicShape = true) {
this.mimicShape = mimicShape;
return this;
}
withContainerProperties(
containerWidth,
containerHeight,
left,
top,
containerUnitWidth = PositionUnit.PERCENTAGE,
containerUnitHeight = PositionUnit.PERCENTAGE,
containerUnitPosX = PositionUnit.PERCENTAGE,
containerUnitPosY = PositionUnit.PERCENTAGE,
) {
this.containerWidth = containerWidth ?? 100;
this.containerHeight = containerHeight ?? 100;
this.containerUnitWidth = containerUnitWidth ?? PositionUnit.PERCENTAGE;
this.containerUnitHeight = containerUnitHeight ?? PositionUnit.PERCENTAGE;
this.top = top == null ? 0 : top;
this.left = left == null ? 0 : left;
this.containerUnitPosX = containerUnitPosX ?? PositionUnit.PERCENTAGE;
this.containerUnitPosY = containerUnitPosY ?? PositionUnit.PERCENTAGE;
return this;
}
withOriginProperties(originUnitWidth = PositionUnit.PIXEL, originUnitHeight = PositionUnit.PIXEL, originUnitPosX = PositionUnit.PIXEL, originUnitPosY = PositionUnit.PIXEL) {
this.originUnitWidth = originUnitWidth ?? PositionUnit.PIXEL;
this.originUnitHeight = originUnitHeight ?? PositionUnit.PIXEL;
this.originUnitPosX = originUnitPosX ?? PositionUnit.PIXEL;
this.originUnitPosY = originUnitPosY ?? PositionUnit.PIXEL;
return this;
}
withPositionNoise(posXNoise, posYNoise) {
this.posXNoise = posXNoise;
this.posYNoise = posYNoise;
return this;
}
withOverflow(overflow) {
this.overflow = overflow;
return this;
}
withAnchor(anchorElement) {
this.setAnchorElement(anchorElement);
return this;
}
build() {
this.initializePosition();
if(FXManager.DEBUG){
this.debugColor = Color.randomColor(100, 0.5);
}
return this;
}
initializePosition() {
if (this.posXNoise > 0) {
this.posX = this.originalPosX + (this.posXNoise / -2 + this.posXNoise * Math.random());
} else {
this.posX = this.originalPosX;
}
if (this.posYNoise > 0) {
this.posY = this.originalPosY + (this.posYNoise / -2 + this.posYNoise * Math.random());
} else {
this.posY = this.originalPosY;
}
}
setAnchorElement(value) {
if (value == null || value instanceof HTMLElement) {
this.anchorElement = value;
} else {
FXUtil.pollenFXError("The provided anchorelement must be of type HTMLElement!");
}
}
}
class CircularEmitterOrigin extends EmitterOrigin {
width;
height;
constructor(posX, posY, width, height) {
super(posX, posY);
this.width = width;
this.height = height;
}
build() {
super.build();
return this;
}
generateParticleSpawnPosition() {
const randomScalar = Math.random();
const randomAngle = Math.random() * (2 * Math.PI);
const x = Math.cos(randomAngle) * (randomScalar * (this.width / 2)) + this.posX;
const y = Math.sin(randomAngle) * (randomScalar * (this.height / 2)) + this.posY;
return [x, y];
}
}
class LineEmitterOrigin extends EmitterOrigin {
posX_2;
posY_2;
originalPosX_2;
originalPosY_2;
offset;
constructor(posX, posY, posX_2, posY_2, offset = -1) {
super(posX, posY);
this.originalPosX_2 = posX_2;
this.originalPosY_2 = posY_2;
this.offset = Math.max(0, offset);
}
build() {
super.build();
this.initializePosition_2();
return this;
}
generateParticleSpawnPosition() {
const progress = Math.random();
let x = PollenMath.lerp(this.posX_2, this.posX, progress);
let y = PollenMath.lerp(this.posY_2, this.posY, progress);
if (this.offset > 0) {
const rico = this.getDirectionCoefficient(this.posX, this.posX_2, this.posY, this.posY_2);
const inverseRico = -1 / rico;
if (inverseRico == -Infinity) {
y += Math.random() * this.offset - this.offset / 2;
} else {
const randOffsetAbs = Math.random() * this.offset;
let xOffset = Math.sqrt(Math.abs(Math.pow(randOffsetAbs, 2) / (1 + Math.pow(inverseRico, 2))));
let yOffset = xOffset * inverseRico;
let randomMultiplier = Math.random() > 0.5 ? 1 : -1;
xOffset = (xOffset / 2) * randomMultiplier;
yOffset = (yOffset / 2) * randomMultiplier;
x += xOffset;
y += yOffset;
}
}
return [x, y];
}
initializePosition_2() {
if (this.posXNoise <= 0) {
this.posX_2 = this.originalPosX_2;
} else {
this.posX_2 = this.originalPosX_2 + (this.posXNoise / -2 + this.posXNoise * Math.random());
}
if (this.posYNoise <= 0) {
this.posY_2 = this.originalPosY_2;
} else {
this.posY_2 = this.originalPosY_2 + (this.posYNoise / -2 + this.posYNoise * Math.random());
}
}
getDirectionCoefficient(x1, x2, y1, y2) {
const deltaX = x2 - x1;
const deltaY = y2 - y1;
return deltaY == 0 ? 0 : deltaY / deltaX;
}
}
class PointEmitterOrigin extends EmitterOrigin {
constructor(posX, posY) {
super(posX, posY);
}
build() {
super.build();
return this;
}
generateParticleSpawnPosition() {
return [this.posX, this.posY];
}
}
class PriorityQueue {
elements = [];
constructor(comparator) {
this.comparator = comparator;
}
enqueue(item) {
this.elements.push(item);
this.elements.sort(this.comparator);
}
dequeue() {
return this.elements.shift();
}
peek() {
return this.elements[0];
}
collect() {
return this.elements;
}
isEmpty() {
return this.elements.length === 0;
}
empty() {
this.elements.length = 0;
}
size() {
return this.elements.length;
}
}
class FXItemManager {
fxItemCount;
activeFXItemPool;
allAddedFXItems;
constructor() {
this.fxItemCount = 0;
this.allAddedFXItems = [];
this.activeFXItemPool = new PriorityQueue((cur, next) => {
return cur.lifeTime - cur.actTime - (next.lifeTime - next.actTime);
});
}
build() {
for (const fxItem of this.activeFXItemPool.collect()) {
fxItem.build();
}
return this;
}
act(deltaTime, startTimeMs) {
for (let fxItem of this.getActiveFXItems()) {
fxItem.act(deltaTime, startTimeMs);
}
}
getFxItemById(fxItemId) {
return this.activeFXItemPool.collect().find((it) => it.fxItemId === fxItemId);
}
addFXItem(fxItem) {
this.allAddedFXItems.push(fxItem);
this.fxItemCount += 1;
}
killAllFXItems() {
for (const fxItem of this.activeFXItemPool.collect()) {
fxItem.die();
}
this.activeFXItemPool.length = 0;
}
resetAllFXItems(){
for (const fxItem of this.allAddedFXItems) {
fxItem.reset();
}
}
getActiveFXItems() {
return this.activeFXItemPool.collect();
}
getActiveFXItemCount() {
return this.activeFXItemPool.collect()?.length;
}
canRecycle() {
return false;
}
hasAnyFXItem(){
return this.allAddedFXItems?.length > 0;
}
}
class FXItemLifeManager extends FXItemManager {
inactiveFXItemPool = new Array();
constructor(){
super();
}
act(deltaTime, startTimeMs) {
super.act(deltaTime, startTimeMs);
this.checkDeath();
}
canRecycle() {
return this.inactiveFXItemPool.length > 0;
}
addFXItem(fxItem) {
super.addFXItem(fxItem);
this.activeFXItemPool.enqueue(fxItem);
}
recycle() {
const revivedFXItem = this.inactiveFXItemPool.shift();
return revivedFXItem;
}
checkDeath() {
while (!this.activeFXItemPool.isEmpty() && this.activeFXItemPool.peek().isDead()) {
const deadFXItem = this.activeFXItemPool.dequeue();
this.inactiveFXItemPool.push(deadFXItem);
deadFXItem.die();
}
}
getFxItemById(fxItemId) {
let foundFXItem = super.getFxItemById(fxItemId);
if (foundFXItem == null) {
foundFXItem = this.inactiveFXItemPool.find(it => it.fxItemID === fxItemId);
}
return foundFXItem ?? null;
}
killAllFXItems(cleanDOM = false) {
const pool = this.activeFXItemPool;
while (!pool.isEmpty()) {
const fxItem = pool.dequeue();
fxItem.die(cleanDOM);
this.inactiveFXItemPool.push(fxItem);
}
}
}
class ParticleBehavior {
type;
constructor(type) {
this.setType(type);
}
build() {
FXUtil.pollenFXError("A concrete instance of ParticleBehavior should never be created or built.");
}
getType() {
return this.type;
}
setType(value) {
this.type = value;
}
}
class ParticleColorShiftBehavior extends ParticleBehavior {
duration = -1;
initialDuration = -1;
forceForwardHue = true;
particleColorFilterData;
KEY_HUE = "hue";
KEY_CONTRAST = "contrast";
KEY_SATURATION = "saturation";
KEY_BRIGHTNESS = "brightness";
shifterMap = new Map();
maxValueMap = new Map();
actionMap = new Map();
lastAlteredValueMap = new Map();
constructor() {
super("colorshift");
this.actionMap.set(this.KEY_HUE, (alteredValue, upadatedValue) => {});
this.actionMap.set(this.KEY_CONTRAST, (alteredValue, upadatedValue) => {});
this.actionMap.set(this.KEY_SATURATION, (alteredValue, upadatedValue) => {});
this.actionMap.set(this.KEY_BRIGHTNESS, (alteredValue, upadatedValue) => {});
}
build(particleDataManager, particleBehaviorManager) {
this.particleColorFilterData = particleDataManager.ensureData("colorfilter");
this.duration = this.initialDuration;
return this;
}
withDuration(duration) {
this.initialDuration = duration;
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
if (this.initialDuration <= 0) {
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
.withDuration(this.initialDuration);
}
static createDefault() {
return new ParticleColorShiftBehavior().withHues([0, 360]).withContrasts([0, 360]).withSaturations([0, 360]).withBrightnesses([0, 360]).withDuration(-1);
}
}
class ParticleDirectionalBehavior extends ParticleBehavior {
particleDefaultData;
particleDirectionData;
constructor() {
super("direction");
}
build(particleDataManager, particleBehaviorManager) {
this.particleDirectionData = particleDataManager.ensureData("direction");
this.particleDefaultData = particleDataManager.ensureData("default");
return this;
}
act(particle, startTimeMs, deltaTime, deltaTimeSeconds) {
this.particleDefaultData.posX += this.particleDirectionData.directionX * deltaTimeSeconds;
this.particleDefaultData.posY += this.particleDirectionData.directionY * deltaTimeSeconds;
}
createNewBehavior(copy) {
if (copy) {
return this;
} else {
return new ParticleDirectionalBehavior();
}
}
reset() {}
applyParticle(particle) {}
static createDefault() {
return new ParticleDirectionalBehavior();
}
}
class ParticleFlipbookBehavior extends ParticleBehavior {
flipCount;
initialSpeed;
speedNoise = -1;
timeSinceLastFrameshift;
flipbookData;
speed;
defaultData;
endingFrameCount = -1;
constructor(speed) {
super("flipbook");
this.initialSpeed = speed;
}
build(particleDataManager, particleBehaviorManager) {
this.flipCount = 0;
this.timeSinceLastFrameshift = 0;
this.speed = this.speedNoise > 0 ? PollenMath.relativeMap(this.initialSpeed, 1 + this.speedNoise, Math.random()) : this.initialSpeed;
this.flipbookData = particleDataManager.ensureData("flipbook");
this.defaultData = particleDataManager.ensureData("default");
this.flipbookData.particleWidth = this.defaultData.width;
this.flipbookData.particleHeight = this.defaultData.height;
this.flipbookData.imageFitting = ImageFitting.CONTAIN;
return this;
}
reset() {
this.flipCount = 0;
this.timeSinceLastFrameshift = 0;
if (this.speedNoise > 0) {
this.speed = PollenMath.relativeMap(this.initialSpeed, 1 + this.speedNoise, Math.random());
} else {
this.speed = this.initialSpeed;
}
return this;
}
withEndingFrame(endingFrameCount) {
this.endingFrameCount = endingFrameCount < 0 ? Number.MAX_VALUE : endingFrameCount;
return this;
}
withNoise(speedNoise) {
this.speedNoise = speedNoise;
return this;
}
act(particle, startTimeMs, deltaTime, deltaTimeSeconds) {
this.flipbookData.particleWidth = this.defaultData.width;
this.flipbookData.particleHeight = this.defaultData.height;
this.timeSinceLastFrameshift += deltaTimeSeconds;
const framesToAdvance = Math.floor(this.timeSinceLastFrameshift * this.speed);
if (framesToAdvance > 0) {
this.flipbookData.currentFrameIndex = (this.flipbookData.currentFrameIndex + framesToAdvance) % this.flipbookData.frameCount;
this.timeSinceLastFrameshift -= framesToAdvance / this.speed;
this.checkBehaviorDeath(framesToAdvance, particle);
}
}
checkBehaviorDeath(imageShift, particle) {
this.flipCount += imageShift;
if (this.flipCount + 1 > this.endingFrameCount) {
this.speed = Number.MAX_VALUE;
}
}
createNewBehavior(copy) {
if (copy) {
return this;
}
return new ParticleFlipbookBehavior(this.initialSpeed).withNoise(this.speedNoise).withEndingFrame(this.endingFrameCount);
}
applyParticle(particle) {}
static createDefault() {
return new ParticleFlipbookBehavior(30).withNoise(-1).withEndingFrame(-1);
}
}
class ParticleGravityBehavior extends ParticleBehavior {
initialFieldStrength;
fieldStrength;
fieldStrengthNoise = -1;
particleDirectionData;
constructor(fieldStrength = 9.81) {
super("gravity");
this.initialFieldStrength = fieldStrength;
}
build(particleDataManager, particleBehaviorManager) {
this.particleDirectionData = particleDataManager.ensureData("direction");
particleBehaviorManager.ensureBehavior("direction").build(particleDataManager, particleBehaviorManager);
this.setFieldStrength();
return this;
}
withNoise(noise) {
this.fieldStrengthNoise = noise;
return this;
}
reset() {
this.setFieldStrength();
return this;
}
act(particle, startTimeMs, deltaTime, deltaTimeSeconds) {
this.particleDirectionData.directionY += this.fieldStrength * deltaTimeSeconds;
}
createNewBehavior(copy) {
if (copy) {
return this;
}
return new ParticleGravityBehavior(this.initialFieldStrength).withNoise(this.fieldStrengthNoise);
}
setFieldStrength(){
if (this.fieldStrengthNoise > 0) {
this.fieldStrength = PollenMath.relativeMap(this.initialFieldStrength, this.fieldStrengthNoise, Math.random());
} else {
this.fieldStrength = this.initialFieldStrength;
}
}
applyParticle(particle) {}
static createDefault() {
return new ParticleGravityBehavior(9.81);
}
}
class ParticleOpacityByLifeBehavior extends ParticleBehavior {
duration = -1;
initialDuration = -1;
initialOpacity = 0;
lastOpacityIndexSum;
opacityNoise = -1;
initialOpacityMultipliers;
opacityMultipliers;
initialOpacity;
particleOpacityData;
opacityIterationCount = -1;
opacityIteration;
constructor(opacityMultipliers) {
super("opacity");
this.initialOpacityMultipliers = opacityMultipliers;
}
build(particleDataManager, particleBehaviorManager) {
this.particleOpacityData = particleDataManager.ensureData("opacity");
this.duration = this.initialDuration;
this.opacityIterationCount = this.opacityIterationCount > 0 ? this.opacityIterationCount : this.initialOpacityMultipliers.length;
this.calculateOpacityMultipliers();
this.opacityIteration = 0;
this.lastOpacityIndexSum = 1 % this.opacityMultipliers.length;
this.initialOpacity = Math.max(0.001, this.particleOpacityData.initialOpacity);
this.setInitialOpacityData();
return this;
}
withNoise(opacityNoise) {
this.opacityNoise = opacityNoise;
return this;
}
withDuration(duration, opacityIterationCount = -1) {
this.opacityIterationCount = opacityIterationCount < 0 ? Number.MAX_VALUE : opacityIterationCount;
this.initialDuration = duration;
return this;
}
reset(particle) {
this.setInitialOpacityData();
this.applyParticle(particle)
this.opacityIteration = 0;
this.lastOpacityIndexSum = 1 % this.opacityMultipliers.length;
return this;
}
calculateOpacityMultipliers() {
if (this.opacityNoise > 0) {
this.opacityMultipliers = [];
for (let i = 0; i < this.initialOpacityMultipliers.length; i++) {
let noisedOpacity = PollenMath.relativeMap(this.initialOpacityMultipliers[i], this.opacityNoise, Math.random());
noisedOpacity = Math.max(0, Math.min(1, noisedOpacity));
this.opacityMultipliers[i] = noisedOpacity;
}
} else {
this.opacityMultipliers = this.initialOpacityMultipliers;
}
}
act(particle, startTimeMs, deltaTime, deltaTimeSeconds) {
const steps = this.opacityMultipliers.length;
const fullRangeProgress = particle.actTime / this.duration;
const scaledFullRangeProgress = fullRangeProgress * Math.max(1, steps - 1);
const fromIndex = Math.trunc(scaledFullRangeProgress) % steps;
const toIndex = (fromIndex + 1) % steps;
const localProgress = scaledFullRangeProgress % 1;
const scalar = PollenMath.lerp(this.opacityMultipliers[fromIndex], this.opacityMultipliers[toIndex], localProgress);
this.particleOpacityData.opacity = this.initialOpacity * scalar;
this.checkBehaviorDeath(fromIndex, toIndex, particle);
}
checkBehaviorDeath(fromIndex, toIndex, particle) {
const maxIndexSum = fromIndex + Math.max(toIndex, fromIndex);
this.opacityIteration += Math.min(1, Math.abs(this.lastOpacityIndexSum - maxIndexSum))
this.lastOpacityIndexSum = maxIndexSum;
if (this.opacityIteration + 1 > this.opacityIterationCount) {
this.particleOpacityData.opacity = this.opacityMultipliers[this.opacityIterationCount % this.opacityMultipliers.length];
particle.disableBehavior(this.type);
}
}
applyParticle(particle) {
if (this.initialDuration <= 0) {
this.duration = particle.lifeTime;
}
}
setInitialOpacityData() {
if (this.initialOpacityMultipliers != null && this.initialOpacityMultipliers.length > 0) {
this.particleOpacityData.opacity = this.initialOpacity * this.initialOpacityMultipliers[0];
}
}
createNewBehavior(copy) {
if (copy) {
return this;
} else {
return new ParticleOpacityByLifeBehavior(this.initialOpacityMultipliers).withNoise(this.opacityNoise).withDuration(this.initialDuration, this.opacityIterationCount);
}
}
static createDefault() {
return new ParticleOpacityByLifeBehavior([0, 1, 0]).withNoise(-1).withDuration(-1, -1);
}
}
class ParticleRotationBehavior extends ParticleBehavior {
rotationData;
initialRotationSpeed;
rotationSpeed;
rotationNoise = -1;
allowReverse = true;
constructor(rotationSpeed) {
super("rotation");
this.initialRotationSpeed = rotationSpeed;
}
build(particleDataManager, particleBehaviorManager) {
this.rotationData = particleDataManager.ensureData("rotation");
this.rotationSpeed = this.initialRotationSpeed;
this.adjustRotationSpeed();
return this;
}
withNoise(rotationNoise, allowReverse = true) {
this.rotationNoise = rotationNoise;
this.allowReverse = allowReverse;
return this;
}
reset() {
this.adjustRotationSpeed();
return this;
}
act(particle, startTimeMs, deltaTime, deltaTimeSeconds) {
this.rotationData.rotation += this.rotationSpeed * deltaTimeSeconds;
}
adjustRotationSpeed(){
if (this.rotationNoise > 0) {
if (this.allowReverse) {
this.rotationSpeed = PollenMath.absoluteMap(this.rotationSpeed, this.rotationNoise, Math.random());
} else {
this.rotationSpeed = PollenMath.relativeMap(this.rotationSpeed, this.rotationNoise, Math.random());
}
}
}
createNewBehavior(copy) {
if (copy) {
return this;
}
return new ParticleRotationBehavior(this.initialRotationSpeed).withNoise(this.rotationNoise, this.allowReverse);
}
applyParticle(particle) {}
static createDefault() {
return new ParticleRotationBehavior(0.2).withNoise(-1, true);
}
}
class ParticleWindBehavior extends ParticleBehavior {
angles;
windSpeed = 0;
cycleDuration = -1;
initialCycleDuration = -1;
shallowRandom = false;
deepRandom = false;
considerDefault = false;
overrideInitialDirection = false;
particleDirectionData;
directionsX;
directionsY;
lastWindEffectY;
lastWindEffectX;
constructor(angles, windSpeed = 500) {
super("wind");
this.angles = angles;
this.windSpeed = windSpeed;
}
build(particleDataManager, particleBehaviorManager) {
this.lastWindEffectX = 0;
this.lastWindEffectY = 0;
this.configure();
this.particleDirectionData = particleDataManager.ensureData("direction");
particleBehaviorManager.ensureBehavior("direction").build(particleDataManager, particleBehaviorManager);
if (this.considerDefault) {
if (!this.overrideInitialDirection) {
this.directionsX.unshift(undefined);
this.directionsY.unshift(undefined);
}
if (this.deepRandom) {
let anglesModified = this.angles.slice();
anglesModified.unshift(this.particleDirectionData.directionAngle);
const largestAngle = anglesModified.reduce((prevAngle, curAngle) => {
return prevAngle > curAngle ? prevAngle : curAngle;
});
const smallestAngle = anglesModified.reduce((prevAngle, curAngle) => {
return prevAngle < curAngle ? prevAngle : curAngle;
});
this.initDeepRandomAngle(0, smallestAngle, largestAngle);
} else if (this.shallowRandom) {
let anglesModified = this.angles.slice();
anglesModified.unshift(this.particleDirectionData.directionAngle);
const largestAngle = anglesModified.reduce((prevAngle, curAngle) => {
return prevAngle > curAngle ? prevAngle : curAngle;
});
const smallestAngle = anglesModified.reduce((prevAngle, curAngle) => {
return prevAngle < curAngle ? prevAngle : curAngle;
});
const mobilityFactor = 360 / (largestAngle - smallestAngle);
this.initShallowRandomAngle(0, this.angles.length, mobilityFactor);
} else {
this.directionsX[0] = PollenMath.cos(this.particleDirectionData.directionAngle) * this.windSpeed;
this.directionsY[0] = PollenMath.sin(this.particleDirectionData.directionAngle) * this.windSpeed * -1;
}
}
return this;
}
reset() {
this.lastWindEffectX = 0;
this.lastWindEffectY = 0;
return this;
}
randomizeShallow(shallowRandom = true) {
this.deepRandom = false;
this.shallowRandom = shallowRandom;
return this;
}
randomizeDeep(deepRandom = true) {
this.shallowRandom = false;
this.deepRandom = deepRandom;
return this;
}
withDuration(cycleDuration) {
this.initialCycleDuration = cycleDuration;
return this;
}
withInitialDirection(considerDefault = false, overrideInitialDirection = false) {
this.considerDefault = considerDefault;
this.overrideInitialDirection = overrideInitialDirection;
return this;
}
act(particle, startTimeMs, deltaTime, deltaTimeSeconds) {
const steps = this.directionsX.length;
const fullRangeProgress = (particle.actTime / this.cycleDuration) * Math.max(steps - 1, 1);
const fromIndex = Math.trunc(fullRangeProgress) % steps;
const toIndex = (fromIndex + 1) % steps;
const localProgress = fullRangeProgress % 1;
const xDirChange = PollenMath.lerp(this.directionsX[fromIndex], this.directionsX[toIndex], localProgress);
const yDirChange = PollenMath.lerp(this.directionsY[fromIndex], this.directionsY[toIndex], localProgress);
this.particleDirectionData.directionX += xDirChange - this.lastWindEffectX;
this.particleDirectionData.directionY += yDirChange - this.lastWindEffectY;
this.lastWindEffectX = xDirChange;
this.lastWindEffectY = yDirChange;
}
applyParticle(particle) {
if (this.initialCycleDuration < 0) {
this.cycleDuration = particle.lifeTime;
}
}
initAngles() {
for (let i = 0; i < this.angles.length; i++) {
this.directionsX[i] = PollenMath.cos(this.angles[i]) * this.windSpeed;
this.directionsY[i] = PollenMath.sin(this.angles[i]) * this.windSpeed * -1;
}
}
configure() {
this.cycleDuration = this.initialCycleDuration;
if (this.angles != null) {
this.directionsX = [];
this.directionsY = [];
if (this.deepRandom) {
this.initDeepRandomAngles();
} else if (this.shallowRandom) {
this.initShallowRandomAngles();
} else {
this.initAngles();
}
}
}
initDeepRandomAngles() {
const largestAngle = this.angles.reduce((prevAngle, curAngle) => {
return prevAngle > curAngle ? prevAngle : curAngle;
});
const smallestAngle = this.angles.reduce((prevAngle, curAngle) => {
return prevAngle < curAngle ? prevAngle : curAngle;
});
for (let i = 0; i < this.angles.length; i++) {
this.initDeepRandomAngle(i, smallestAngle, largestAngle);
}
}
initDeepRandomAngle(i, smallestAngle, largestAngle) {
const randomAngle = smallestAngle + (largestAngle - smallestAngle) * Math.random();
this.directionsX[i] = PollenMath.cos(randomAngle) * this.windSpeed;
this.directionsY[i] = PollenMath.sin(randomAngle) * this.windSpeed * -1;
}
initShallowRandomAngles() {
const largestAngle = this.angles.reduce((prevAngle, curAngle) => {
return prevAngle > curAngle ? prevAngle : curAngle;
});
const smallestAngle = this.angles.reduce((prevAngle, curAngle) => {
return prevAngle < curAngle ? prevAngle : curAngle;
});
const mobilityFactor = 360 / (largestAngle - smallestAngle);
for (let i = 0; i < this.angles.length; i++) {
this.initShallowRandomAngle(i, this.angles.length, mobilityFactor);
}
}
initShallowRandomAngle(i, angleCount, mobilityFactor) {
let lowerAngleBound = PollenMath.lerp(this.angles[PollenMath.modulo(i - 1, angleCount)], this.angles[i], mobilityFactor);
let upperAngleBound = PollenMath.lerp(this.angles[i], this.angles[(i + 1) % angleCount], mobilityFactor);
const alteredAngle = PollenMath.randomBetween(lowerAngleBound, upperAngleBound, true);
this.directionsX[i] = PollenMath.cos(alteredAngle) * this.windSpeed;
this.directionsY[i] = PollenMath.sin(alteredAngle) * this.windSpeed * -1;
}
createNewBehavior(copy) {
if (copy) {
return this;
} else {
return new ParticleWindBehavior(this.angles, this.windSpeed)
.randomizeShallow(this.shallowRandom)
.randomizeDeep(this.deepRandom)
.withDuration(this.initialCycleDuration)
.withInitialDirection(this.considerDefault, this.overrideInitialDirection);
}
}
static createDefault() {
return new ParticleWindBehavior([0], 1).withDuration(1000).randomizeShallow(false).randomizeDeep(false);
}
}
class ParticleBehaviorManager {
particleBehaviors = new Map();
disabledBehaviors = new Map();
constructor() {}
build(particleDataManager, particleBehaviorManager, particle) {
this.particleBehaviors.forEach((particleBehavior, type) => {
particleBehavior.build(particleDataManager, particleBehaviorManager);
particleBehavior.applyParticle(particle)
});
return this;
}
act(particle, actTime, deltaTime) {
const deltaTimeSeconds = deltaTime / 1000;
for (let [key, value] of this.particleBehaviors) {
value.act(particle, actTime, deltaTime, deltaTimeSeconds);
}
}
addParticleBehavior(particleBehavior, particleDataManager) {
this.particleBehaviors.set(particleBehavior.type, particleBehavior);
}
reset(particle) {
this.disabledBehaviors.forEach((disabledBehavior, type) => {
this.particleBehaviors.set(type, disabledBehavior);
});
this.disabledBehaviors.clear();
for (let [type, particleBehavior] of this.particleBehaviors) {
particleBehavior.reset(particle);
}
}
ensureBehavior(key) {
let particleBehavior = this.particleBehaviors.get(key);
if (!FXUtil.valid(particleBehavior)) {
return this.createDefaultBehavior(key);
}
return particleBehavior;
}
disableBehavior(type) {
let behaviorToDisable = this.particleBehaviors.get(type);
this.disabledBehaviors.set(behaviorToDisable.type, behaviorToDisable);
this.particleBehaviors.delete(behaviorToDisable.type);
}
enableBehavior(type) {
let behaviorToDisable = this.disabledBehaviors.get(type);
if (behaviorToDisable != null) {
this.particleBehaviors.set(behaviorToDisable.type, behaviorToDisable);
this.disabledBehaviors.delete(behaviorToDisable.type);
}
}
createDefaultBehavior(key) {
let newDefaultBehavior;
switch (key) {
case "direction":
newDefaultBehavior = ParticleDirectionalBehavior.createDefault();
break;
case "gravity":
newDefaultBehavior = ParticleGravityBehavior.createDefault();
break;
case "wind":
newDefaultBehavior = ParticleWindBehavior.createDefault();
break;
case "flipbook":
newDefaultBehavior = ParticleFlipbookBehavior.createDefault();
break;
case "rotation":
newDefaultBehavior = ParticleRotationBehavior.createDefault();
break;
case "opacity":
newDefaultBehavior = ParticleOpacityByLifeBehavior.createDefault();
break;
case "colorfilter":
newDefaultBehavior = ParticleColorShiftBehavior.createDefault();
break;
case "colorshift":
newDefaultBehavior = ParticleColorShiftBehavior.createDefault();
break;
}
this.particleBehaviors.set(key, newDefaultBehavior);
return newDefaultBehavior;
}
static createDefault() {
return new ParticleGravityBehavior(0.01, 1);
}
}
class ParticleData {
type;
constructor(type) {
this.setType(type);
}
build() {
FXUtil.pollenFXError("A concrete instance of ParticleData should never be created or built.");
}
getType() {
return this.type;
}
setType(value) {
this.type = value;
}
}
class ParticleColorfilterData extends ParticleData {
helperStringCSS = "";
color = null;
hueRotate = 0;
initialHueRotate = 0;
saturation = 1;
initialSaturation = -1;
brightness = 100;
initialBrightness = -1;
contrast = 1;
initialContrast = -1;
noise = -1;
constructor() {
super("colorfilter");
}
withColor(color) {
this.color = color;
return this;
}
withHue(hueRotate, noise = -1) {
this.initialHueRotate = hueRotate;
this.noise = noise;
return this;
}
withSaturation(saturation) {
this.initialSaturation = saturation;
return this;
}
clampSaturation(saturation) {
return saturation < 0 ? 0 : Math.max(0, Math.min(100, saturation));
}
withBrightness(brightness) {
this.initialBrightness = brightness;
return this;
}
clampBrightness(brightness) {
return brightness < 0 ? 0 : Math.max(0, Math.min(1000, brightness));
}
withContrast(contrast) {
this.initialContrast = contrast;
return this;
}
clampContrast(contrast) {
return contrast < 0 ? 0 : Math.max(0, Math.min(100, contrast));
}
build() {
this.calculateValues();
return this;
}
reset() {
this.calculateValues();
return this;
}
calculateValues() {
this.helperStringCSS = "";
if (this.color != null) {
this.helperStringCSS = "grayscale(100%) sepia(100%)";
const hsb = new Color(this.color).getHSB();
const backupHueRotate = this.getHueRotateDelta();
this.hueRotate = this.getHueShiftForColorTargetFromSepia(hsb, this.initialHueRotate) + backupHueRotate;
this.saturation = this.initialSaturation > -1 ? this.clampSaturation(this.initialSaturation) : hsb[1];
this.brightness = this.initialBrightness > -1 ? this.clampBrightness(this.initialBrightness) : hsb[2];
this.contrast = this.initialContrast > -1 ? this.clampContrast(this.initialContrast) : this.contrast;
} else {
this.saturation = this.initialSaturation > -1 ? this.clampSaturation(this.initialSaturation) : this.saturation;
this.brightness = this.initialBrightness > -1 ? this.clampBrightness(this.initialBrightness) : this.brightness;
this.contrast = this.initialContrast > -1 ? this.clampContrast(this.initialContrast) : this.contrast;
this.hueRotate = this.getHueRotateDelta();
}
}
getHueRotateDelta() {
if (this.noise > 0) {
const half = this.noise / 2;
const delta = PollenMath.randomBetween(-half, half, true);
return this.initialHueRotate + delta;
}
return this.initialHueRotate;
}
getCSS() {
return `filter: ${this.helperStringCSS} saturate(${this.saturation}) contrast(${this.contrast}) brightness(${this.brightness}%) hue-rotate(${this.hueRotate}deg);`;
}
getHueShiftForColorTargetFromSepia(hsb, offset = 0) {
return hsb[0] - Color.SEPIA_HUE + offset;
}
createNew() {
return new ParticleColorfilterData()
.withColor(this.color)
.withHue(this.initialHueRotate, this.noise)
.withSaturation(this.initialSaturation)
.withBrightness(this.initialBrightness)
.withContrast(this.initialContrast);
}
static createDefault() {
return new ParticleColorfilterData();
}
}
class ParticleDefaultData extends ParticleData {
posX;
posY;
emitterOrigin;
width;
height;
initialWidth;
initialHeight;
horizontalPivot = Pivot.CENTER;
verticalPivot = Pivot.CENTER;
noiseWidth = -1;
noiseHeight = -1;
uniformSizeWidth = false;
particleBoxClass = null;
constructor(width, height) {
super("default");
this.initialWidth = width != null ? width : 10;
this.initialHeight = height != null ? height : 10;
}
build() {
const position = this.emitterOrigin.generateParticleSpawnPosition();
this.posX = position[0];
this.posY = position[1];
this.initSizes(this.noiseWidth, this.noiseHeight, this.uniformSizeWidth, this.initialWidth, this.initialHeight);
return this;
}
sizeNoise(noiseWidth = -1, noiseHeight = -1, uniformSizeWidth = false) {
this.noiseWidth = noiseWidth;
this.noiseHeight = noiseHeight;
this.uniformSizeWidth = uniformSizeWidth;
return this;
}
pivot(horizontalPivot, verticalPivot) {
this.horizontalPivot = horizontalPivot;
this.verticalPivot = verticalPivot;
return this;
}
withClass(particleBoxClass) {
this.particleBoxClass = particleBoxClass;
return this;
}
reset() {
const position = this.emitterOrigin.generateParticleSpawnPosition();
this.posX = position[0];
this.posY = position[1];
}
getCSS() {
return `top: ${this.posY - this.height * this.verticalPivot}px;
left: ${this.posX - this.width * this.horizontalPivot}px;
width: ${this.width}px;
height: ${this.height}px;
will-change : transform;`;
}
static createDefault() {
return new ParticleDefaultData(10, 10, new PointEmitterOrigin(0, 0));
}
createNew(copy) {
if (copy) {
return this;
}
return new ParticleDefaultData(this.initialWidth, this.initialHeight)
.sizeNoise(this.noiseWidth, this.noiseHeight, this.uniformSizeWidth)
.pivot(this.horizontalPivot, this.verticalPivot)
.setEmitterOrigin(this.emitterOrigin)
.withClass(this.particleBoxClass);
}
initSizes(noiseWidth, noiseHeight, uniformSizeWidth, width, height) {
if (noiseWidth > 0 || noiseHeight > 0) {
let random = Math.random();
if (noiseWidth >= 0 && noiseHeight >= 0) {
this.width = PollenMath.relativeMap(this.initialWidth, 1 + Math.max(noiseWidth, 0), random);
if (uniformSizeWidth) {
this.height = PollenMath.relativeMap(this.initialHeight, 1 + Math.max(noiseWidth, 0), random);
} else {
random = Math.random();
this.height = PollenMath.relativeMap(this.initialHeight, 1 + Math.max(noiseHeight, 0), random);
}
} else if (noiseWidth <= 0) {
this.height = PollenMath.relativeMap(this.initialHeight, 1 + Math.max(noiseHeight, 0), random);
if (uniformSizeWidth) {
this.width = PollenMath.relativeMap(this.initialWidth, 1 + Math.max(noiseHeight, 0), random);
} else {
this.width = width;
}
} else if (noiseHeight <= 0) {
this.width = PollenMath.relativeMap(this.initialWidth, 1 + Math.max(noiseWidth, 0), random);
if (uniformSizeWidth) {
this.height = PollenMath.relativeMap(this.initialHeight, 1 + Math.max(noiseWidth, 0), random);
} else {
this.height = height;
}
}
} else {
this.height = height;
this.width = width;
}
}
setEmitterOrigin(emitterOrigin) {
this.emitterOrigin = emitterOrigin;
return this;
}
}
class ParticleDirectionData extends ParticleData {
directionAngle = 0;
initialSpeed = 0;
speed = 0;
coneNoise = -1;
speedNoise = -1;
directionX = 0;
directionY = 0;
constructor(directionAngle, speed) {
super("direction");
this.directionAngle = directionAngle;
this.initialSpeed = speed;
}
withConeNoise(coneNoise) {
this.coneNoise = coneNoise;
return this;
}
withSpeedNoise(speedNoise) {
this.speedNoise = speedNoise;
return this;
}
build() {
this.calculateDirection();
return this;
}
reset() {
this.calculateDirection();
return this;
}
calculateDirection() {
this.speed = this.speedNoise > 0 ? PollenMath.relativeMap(this.initialSpeed, this.speedNoise, Math.random()) : this.initialSpeed;
let alteredDirectionAngle = this.coneNoise > 0 ? this.directionAngle + (Math.random() * this.coneNoise - this.coneNoise / 2) : this.directionAngle;
this.directionX = PollenMath.cos(alteredDirectionAngle) * this.speed;
this.directionY = PollenMath.sin(alteredDirectionAngle) * this.speed * -1;
}
getCSS() {
return "";
}
createNew(copy) {
if (copy) {
return this;
}
return new ParticleDirectionData(this.directionAngle, this.initialSpeed).withConeNoise(this.coneNoise).withSpeedNoise(this.speedNoise);
}
static createDefault() {
return new ParticleDirectionData(45, 100);
}
}
class ParticleImageData extends ParticleData {
url;
imgWidth;
imgHeight;
imageFitting = ImageFitting.FIT;
constructor(url, imgWidth = null, imgHeight = null) {
super("image");
this.url = url;
this.imgWidth = imgWidth;
this.imgHeight = imgHeight;
}
withImageFitting(imageFitting) {
this.imageFitting = imageFitting;
return this;
}
build() {
if(!this.imgWidth || !this.imgHeight){
this.extractImageDimensions(this.url, this.imgWidth, this.imgHeight, (response) => {
this.imgWidth = response[0];
this.imgHeight = response[1];
});
}
return this;
}
reset() {
return this;
}
getCSS() {
return `background-image: url(\'${this.url}\'); background-size : ${this.imageFitting};`;
}
extractImageDimensions(url, imgWidth, imgHeight, callback) {
if (imgWidth != null && imgHeight != null) {
callback([imgWidth, imgHeight]);
} else {
var image = new Image();
image.src = url;
image.onload = function (e) {
const height = e.target.height;
const width = e.target.width;
callback([width, height]);
};
}
}
createNew(copy) {
if (copy) {
return this;
}
return new ParticleImageData(this.url, this.imgWidth, this.imgHeight).withImageFitting(this.imageFitting);
}
static createDefault() {
return new ParticleImageData("./assets/images/placeholder.png", 1);
}
}
class ParticleFlipbookData extends ParticleImageData {
frameCountY;
frameCountX;
frameCount;
startFrame;
frameWidth;
frameHeight;
particleWidth = 100;
particleHeight = 100;
constructor(url, imgWidth = null, imgHeight = null, frameCountX = 1, frameCountY = 1, startFrame = 0) {
super(url, imgWidth, imgHeight);
this.startFrame = startFrame;
this.frameCountX = frameCountX;
this.frameCountY = frameCountY;
this.frameCount = frameCountX * frameCountY;
this.currentFrameIndex = (this.startFrame == -1) ? (Math.ceil(Math.random() * (frameCountX * frameCountY))) : (this.startFrame);
this.type = "flipbook";
this.imageFitting = ImageFitting.CONTAIN;
}
build(particleDataManager, particleBehaviorManager) {
this.defaultData = particleDataManager.ensureData("default");
this.particleWidth = this.defaultData.width;
this.particleHeight = this.defaultData.height;
super.extractImageDimensions(this.url, this.imgWidth, this.imgHeight, (response) => {
this.imgWidth = this.imgWidth != null && this.imgHeight != null ? this.imgWidth : response[0];
this.imgHeight = this.imgWidth != null && this.imgHeight != null ? this.imgHeight : response[1];
this.frameWidth = this.imgWidth / this.frameCountX;
this.frameHeight = this.imgHeight / this.frameCountY;
});
return this;
}
reset() {
return this;
}
withRandomStartFrame(){
this.startFrame = (this.frameCountX * this.frameCountY) - 1;
return this;
}
getBackgroundimageWidth() {
return this.particleWidth * this.frameCountX;
}
getBackgroundimageHeight() {
return this.particleHeight * this.frameCountY;
}
getCSS() {
return `background-image : url(${this.url});
background-size : ${this.getBackgroundimageWidth()}px ${this.getBackgroundimageHeight()}px;
background-position-x : -${this.left()}px;
background-position-y: -${this.top()}px;`;
}
left() {
return (this.currentFrameIndex % this.frameCountX) * this.particleWidth;
}
top() {
return ~~(this.currentFrameIndex / this.frameCountX) * this.particleHeight;
}
createNew(copy) {
if (copy) {
return this;
}
return new ParticleFlipbookData(this.url, this.imgWidth, this.imgHeight, this.frameCountX, this.frameCountY, this.startFrame).withImageFitting(this.imageFitting);
}
static createDefault() {
return new ParticleFlipbookData(1, 1, "./assets/images/placeholder.png", 1, null, null);
}
}
class ParticleOpacityData extends ParticleData {
opacity;
opacityNoise;
constructor(opacity = 1, opacityNoise = -1) {
super("opacity");
this.initialOpacity = opacity;
this.opacityNoise = opacityNoise;
this.opacity = opacityNoise > 0 ? Math.min(1, Math.max(0, PollenMath.relativeMap(opacity, 1 + opacityNoise, Math.random()))) : opacity;
}
build() {
return this;
}
getCSS() {
return `opacity: ${this.opacity};`;
}
reset() {}
createNew(copy) {
if (copy) {
return this;
}
return new ParticleOpacityData(this.initialOpacity, this.opacityNoise);
}
static createDefault() {
return new ParticleOpacityData(1);
}
}
class ParticleRotationData extends ParticleData {
initialRotation;
rotation;
coneNoise;
mirrorX = false;
mirrorY = false;
mirrorXScale = 1;
mirrorYScale = 1;
constructor(rotation, coneNoise = -1) {
super("rotation");
this.initialRotation = rotation;
this.coneNoise = coneNoise;
}
build() {
this.rotation = this.coneNoise >= 0 ? this.initialRotation + (Math.random() * this.coneNoise - this.coneNoise / 2) : this.initialRotation;
this.mirrorXScale *= this.mirrorX ? PollenMath.randomSign() : 1;
this.mirrorYScale *= this.mirrorY ? PollenMath.randomSign() : 1;
return this;
}
withAllowMirrored(mirrorX, mirrorY = false) {
this.mirrorX = mirrorX;
this.mirrorY = mirrorY;
return this;
}
getCSS() {
return `transform: rotate(${this.rotation}deg) scale(${this.mirrorXScale}, ${this.mirrorYScale});`;
}
reset() {
return this;
}
createNew(copy) {
if (copy) {
return this;
}
return new ParticleRotationData(this.initialRotation, this.coneNoise)
.withAllowMirrored(this.mirrorX, this.mirrorY);
}
static createDefault() {
return new ParticleRotationData(0);
}
}
class ParticleDataManager {
particleData = new Map();
default_particle_styles = "position:absolute;";
constructor() {}
build(particleDataManager, particleBehaviorManager) {
for (let [type, particleData] of this.particleData) {
particleData.build(particleDataManager, particleBehaviorManager);
}
return this;
}
getCSS() {
let resultCSS = "";
for (let [type, particleData] of this.particleData) {
resultCSS += particleData.getCSS();
}
return resultCSS + this.default_particle_styles;
}
reset() {
for (let [type, particleData] of this.particleData) {
particleData.reset();
}
}
ensureData(key, build = true) {
let particleData = this.particleData.get(key);
if (!FXUtil.valid(particleData)) {
particleData = this.createDefaultData(key)
if(build){
particleData.build();
}
}
return particleData;
}
addDefaultCssStyle(style) {
this.default_particle_styles += style;
}
addParticleData(particleData) {
this.particleData.set(particleData.type, particleData);
}
getDataByKey(key){
return this.particleData.get(key)
}
createDefaultData(key) {
let newDefaultData;
switch (key) {
case "direction":
newDefaultData = ParticleDirectionData.createDefault();
break;
case "rotation":
newDefaultData = ParticleRotationData.createDefault();
break;
case "image":
newDefaultData = ParticleImageData.createDefault();
break;
case "opacity":
newDefaultData = ParticleOpacityData.createDefault();
break;
case "flipbook":
newDefaultData = ParticleFlipbookData.createDefault();
break;
case "colorfilter":
newDefaultData = ParticleColorfilterData.createDefault();
break;
case "customCSS":
newDefaultData = ParticleCustomCssData.createDefault();
break;
case "default":
newDefaultData = ParticleDefaultData.createDefault();
break;
}
this.particleData.set(key, newDefaultData);
return newDefaultData;
}
}
class Particle extends FXItem {
dataManager;
behaviorManager;
particleBox;
emitterBox;
constructor(lifetime) {
super(Math.max(0, lifetime));
this.dataManager = new ParticleDataManager();
this.behaviorManager = new ParticleBehaviorManager();
}
build() {
this.dataManager.build(this.dataManager, this.behaviorManager, this);
this.behaviorManager.build(this.dataManager, this.behaviorManager, this);
return this;
}
reset(lifeTime) {
super.reset(lifeTime);
this.behaviorManager.reset(this);
this.dataManager.reset();
return this;
}
act(deltaTime, startTimeMs) {
super.act(deltaTime);
this.behaviorManager.act(this, startTimeMs, deltaTime);
this.updateStyle();
}
tryCreateParticleBox(emitterBox) {
if (emitterBox != null && !this.particleBox) {
this.emitterBox = emitterBox;
this.particleBox = document.createElement("div");
this.particleBox.classList.add(PollenFXClasses.PARTICLE_BOX_CLASS);
const particleBoxClass = this.dataManager.getDataByKey("default")?.particleBoxClass;
if (particleBoxClass) {
this.particleBox.classList.add(particleBoxClass);
}
this.updateStyle();
this.emitterBox.appendChild(this.particleBox);
}
}
removeParticleBox() {
this.emitterBox.removeChild(this.particleBox);
this.particleBox = null;
}
hideCSS() {
this.particleBox.setAttribute("style", "display:none;");
}
showCSS() {
this.particleBox.setAttribute("style", "display:block;");
this.updateStyle();
}
updateStyle() {
this.particleBox.setAttribute("style", this.getCSS());
}
addParticleData(particleData) {
this.dataManager.addParticleData(particleData);
}
addParticleBehavior(behavior) {
this.behaviorManager.addParticleBehavior(behavior, this.dataManager);
}
getCSS() {
return this.dataManager.getCSS();
}
disableBehavior(type) {
this.behaviorManager.disableBehavior(type);
}
enableBehavior(type) {
this.behaviorManager.enableBehavior(type);
}
die(cleanDOM = false) {
if(cleanDOM){
this.removeParticleBox()
return;
}
this.hideCSS();
}
revive() {
this.showCSS();
}
}
class ParticleSpiralBehavior extends ParticleDirectionalBehavior {
initialMsPerRotation;
msPerRotation;
msPerRotationNoise = -1;
initialStartRotation = null;
startRotation;
randomStartRotation = false;
randomRotationDirection = false;
startRotationNoise = -1;
startRotationNoiseRandom = null;
rotationMultiplier = 1;
lastSpiralEffectX = 0;
lastSpiralEffectY = 0;
constructor(msPerRotation, randomRotationDirection = false) {
super("direction");
this.randomRotationDirection = randomRotationDirection;
this.initialMsPerRotation = Math.abs(msPerRotation);
this.rotationMultiplier = Math.sign(msPerRotation);
if (this.randomRotationDirection) {
this.rotationMultiplier = PollenMath.randomSign();
}
}
build(particleDataManager, particleBehaviorManager) {
super.build(particleDataManager, particleBehaviorManager);
this.calculateValues();
return this;
}
withSpeedNoise(msPerRotationNoise) {
this.msPerRotationNoise = msPerRotationNoise;
if (this.msPerRotationNoise > 0) {
this.msPerRotation = PollenMath.relativeMap(this.initialMsPerRotation, this.msPerRotationNoise, Math.random());
}
return this;
}
withRandomStartRotation(randomStartRotation = true) {
this.startRotationNoise = -1;
this.randomStartRotation = randomStartRotation;
if(this.randomStartRotation){
this.initialStartRotation = PollenMath.randomBetween(0, 360, false);
}
return this;
}
withStartRotationNoise(startRotationNoise) {
this.randomStartRotation = false;
this.startRotationNoise = startRotationNoise;
this.startRotationNoiseRandom = Math.random();
return this;
}
reset() {
this.calculateValues();
return this;
}
act(particle, startTimeMs, deltaTime, deltaTimeSeconds) {
const elapsed = particle.spawnTime - startTimeMs;
const fraction = (elapsed % this.msPerRotation) / this.msPerRotation;
const particleDirection = this.startRotation + 360 * fraction * this.rotationMultiplier;
const xUpdate = PollenMath.cos(particleDirection) * this.particleDirectionData.speed ;
const yUpdate = PollenMath.sin(particleDirection) * this.particleDirectionData.speed * -1;
this.particleDirectionData.directionX += xUpdate - this.lastSpiralEffectX;
this.particleDirectionData.directionY += yUpdate - this.lastSpiralEffectY;
this.lastSpiralEffectX = xUpdate;
this.lastSpiralEffectY = yUpdate;
this.particleDefaultData.posX += this.particleDirectionData.directionX * deltaTimeSeconds;
this.particleDefaultData.posY += this.particleDirectionData.directionY * deltaTimeSeconds;
}
calculateValues() {
this.lastSpiralEffectX = 0;
this.lastSpiralEffectY = 0;
this.msPerRotation = this.msPerRotation == null ? this.initialMsPerRotation : this.msPerRotation;
if(this.initialStartRotation == null){
this.initialStartRotation = this.startRotationNoiseRandom != null ? PollenMath.relativeMap(this.particleDirectionData.directionAngle, this.startRotationNoise, this.startRotationNoiseRandom) : this.particleDirectionData.directionAngle
}else{
this.initialStartRotation = this.startRotationNoiseRandom != null ? PollenMath.relativeMap(this.initialStartRotation, this.startRotationNoise, this.startRotationNoiseRandom) : this.initialStartRotation
}
this.startRotation = this.initialStartRotation;
this.particleDirectionData.directionX = 0;
this.particleDirectionData.directionY = 0;
}
createNewBehavior(copy) {
if (copy) {
return this;
}
const newParticleSpiralBehavior = new ParticleSpiralBehavior(this.initialMsPerRotation, false)
newParticleSpiralBehavior.msPerRotation = this.msPerRotation;
newParticleSpiralBehavior.startRotationNoiseRandom = this.startRotationNoiseRandom;
newParticleSpiralBehavior.startRotationNoise = this.startRotationNoise;
newParticleSpiralBehavior.initialStartRotation = this.initialStartRotation;
newParticleSpiralBehavior.rotationMultiplier = this.rotationMultiplier;
return newParticleSpiralBehavior;
}
applyParticle(particle) {}
static createDefault() {
return new ParticleSpiralBehavior();
}
}
class ParticleSizeByLifeBehavior extends ParticleBehavior {
sizeMultipliersX;
sizeMultipliersY;
duration = -1;
initialDuration = -1;
scalarNoise = -1;
uniformNoise = true;
lastXSizeIndexSum;
lastYSizeIndexSum;
sizeIterationCount;
xSizeIteration;
ySizeIteration;
initialSizeMultipliersX;
initialSizeMultipliersY;
particleDefaultData;
initialWidth;
initialHeight;
constructor(sizeMultipliersX, sizeMultipliersY) {
super("size");
this.initialSizeMultipliersX = sizeMultipliersX;
this.initialSizeMultipliersY = sizeMultipliersY;
}
build(particleDataManager, particleBehaviorManager) {
this.setSizeMultipliers(this.initialSizeMultipliersX, this.initialSizeMultipliersY);
this.xSizeIteration = 0;
this.ySizeIteration = 0;
this.lastXSizeIndexSum = Math.min(this.sizeMultipliersX.length, 1);
this.lastYSizeIndexSum = Math.min(this.sizeMultipliersY.length, 1);
this.particleDefaultData = particleDataManager.ensureData("default");
this.initialHeight = this.particleDefaultData.height;
this.initialWidth = this.particleDefaultData.width;
this.duration = this.initialDuration
this.setInitialSizeData();
return this;
}
withDuration(duration, sizeIterationCount = -1) {
this.sizeIterationCount = sizeIterationCount < 0 ? Number.MAX_VALUE : sizeIterationCount;
this.initialDuration = duration;
return this;
}
withNoise(scalarNoise, uniformNoise = true) {
this.scalarNoise = scalarNoise;
this.uniformNoise = uniformNoise;
return this;
}
reset(particle) {
this.setInitialSizeData();
this.applyParticle(particle);
this.xSizeIteration = 0;
this.ySizeIteration = 0;
this.lastXSizeIndexSum = Math.min(this.sizeMultipliersX.length, 1);
this.lastYSizeIndexSum = Math.min(this.sizeMultipliersY.length, 1);
return this;
}
act(particle, startTimeMs, deltaTime, deltaTimeSeconds) {
const xSteps = this.sizeMultipliersX.length;
const xFullRangeProgress = (particle.actTime / this.duration) * Math.max(1, xSteps - 1);
const xFromIndex = Math.trunc(xFullRangeProgress) % xSteps;
const xToIndex = (xFromIndex + 1) % xSteps;
const xLocalProgress = xFullRangeProgress % 1;
const ySteps = this.sizeMultipliersY.length;
const yFullRangeProgress = (particle.actTime / this.duration) * Math.max(1, ySteps - 1);
const yFromIndex = Math.trunc(yFullRangeProgress) % ySteps;
const yToIndex = (yFromIndex + 1) % ySteps;
const yLocalProgress = yFullRangeProgress % 1;
const scalarX = PollenMath.lerp(this.sizeMultipliersX[xFromIndex], this.sizeMultipliersX[xToIndex], xLocalProgress);
const scalarY = PollenMath.lerp(this.sizeMultipliersY[yFromIndex], this.sizeMultipliersY[yToIndex], yLocalProgress);
const newWidth = this.initialWidth * scalarX;
const newHeight = this.initialHeight * scalarY;
this.particleDefaultData.width = newWidth;
this.particleDefaultData.height = newHeight;
this.checkBehaviorDeath(yFromIndex, yToIndex, xFromIndex, xToIndex, particle);
}
checkBehaviorDeath(yFromIndex, yToIndex, xFromIndex, xToIndex, particle) {
const maxIndexSumX = xFromIndex + Math.max(xToIndex, xFromIndex);
const maxIndexSumY = yFromIndex + Math.max(yToIndex, yFromIndex);
this.xSizeIteration += Math.min(1, Math.abs(this.lastXSizeIndexSum - maxIndexSumX))
this.ySizeIteration += Math.min(1, Math.abs(this.lastYSizeIndexSum - maxIndexSumY))
this.lastXSizeIndexSum = maxIndexSumX;
this.lastYSizeIndexSum = maxIndexSumY;
if (Math.max(this.xSizeIteration, this.ySizeIteration) + 1 > this.sizeIterationCount) {
particle.disableBehavior(this.type);
}
}
applyParticle(particle) {
if (this.initialDuration <= 0) {
this.duration = particle.lifeTime;
}
}
setInitialSizeData() {
if (this.sizeMultipliersX != null && this.sizeMultipliersX.length > 0) {
this.particleDefaultData.width = this.initialWidth * this.sizeMultipliersX[0];
}
if (this.sizeMultipliersY != null && this.sizeMultipliersY.length > 0) {
this.particleDefaultData.height = this.initialHeight * this.sizeMultipliersY[0];
}
}
setSizeMultipliers(initialSizeMultipliersX, initialSizeMultipliersY) {
const multipliersXProvided = initialSizeMultipliersX != null && initialSizeMultipliersX.length > 0;
const multipliersYProvided = initialSizeMultipliersY != null && initialSizeMultipliersY.length > 0;
if (!multipliersXProvided) {
if (multipliersYProvided) {
this.sizeMultipliersX = this.copyMultipliers(initialSizeMultipliersY);
this.sizeMultipliersY = this.copyMultipliers(initialSizeMultipliersY);
} else {
this.sizeMultipliersX = [1];
this.sizeMultipliersY = [1];
}
} else {
this.sizeMultipliersX = this.copyMultipliers(initialSizeMultipliersX);
if (!multipliersYProvided) {
this.sizeMultipliersY = this.copyMultipliers(initialSizeMultipliersX);
} else {
this.sizeMultipliersY = this.copyMultipliers(initialSizeMultipliersY);
}
}
if (this.scalarNoise > 0) {
let randoms = [];
if (this.uniformNoise) {
const countTill = Math.max(initialSizeMultipliersY != null ? initialSizeMultipliersY.length : 0, initialSizeMultipliersX.length);
for (let i = 0; i < countTill; i++) {
randoms[i] = Math.random();
}
}
for (let i = 0; i < this.sizeMultipliersX.length; i++) {
let random = this.uniformNoise ? randoms[i] : Math.random();
this.sizeMultipliersX[i] = PollenMath.relativeMap(this.sizeMultipliersX[i], 1 + this.scalarNoise, random);
}
for (let i = 0; i < this.sizeMultipliersY.length; i++) {
let random = this.uniformNoise ? randoms[i] : Math.random();
this.sizeMultipliersY[i] = PollenMath.relativeMap(this.sizeMultipliersY[i], 1 + this.scalarNoise, random);
}
}
}
copyMultipliers(from) {
let to = [];
if (from != null) {
for (let i = 0; i < from.length; i++) {
to.push(from[i]);
}
}
return to;
}
static createDefault() {
const newBehavior = new ParticleSizeByLifeBehavior([0, 1], [0, 1]).withNoise(-1, true).withDuration(-1, -1);
return newBehavior;
}
createNewBehavior(copy) {
if (copy) {
return this;
} else {
const newBehavior = new ParticleSizeByLifeBehavior(this.initialSizeMultipliersX, this.initialSizeMultipliersY)
.withNoise(this.scalarNoise, this.uniformNoise)
.withDuration(this.initialDuration, this.sizeIterationCount);
return newBehavior;
}
}
}
class FXDom {
static createEmitterContainer(emitterOrigin, fxItemId) {
let emitterContainer;
let anchor;
let computedStyles;
if (FXUtil.valid(emitterOrigin.anchorElement)) {
const invalidAnchor = UNSTABLE_ANCHOR_TYPES.includes(emitterOrigin.anchorElement.tagName.toLowerCase());
if (invalidAnchor) {
if (emitterOrigin.anchorElement.parentNode.classList.contains(PollenFXClasses.EMITTER_CONTAINER_WRAPPER_CLASS)) {
anchor = emitterOrigin.anchorElement.parentNode;
computedStyles = window.getComputedStyle(anchor);
}
else {
anchor = emitterOrigin.anchorElement;
var anchorParent = document.createElement("div");
let parent = anchor.parentNode;
parent.replaceChild(anchorParent, anchor);
anchorParent.appendChild(anchor);
anchorParent.classList.add(PollenFXClasses.EMITTER_CONTAINER_WRAPPER_CLASS);
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
anchor = emitterOrigin.anchorElement;
computedStyles = window.getComputedStyle(anchor);
}
} else {
anchor = document.body;
computedStyles = window.getComputedStyle(anchor);
}
emitterContainer = document.createElement("div");
emitterContainer.classList.add(PollenFXClasses.EMITTER_CONTAINER_CLASS);
if (fxItemId) {
emitterContainer.classList.add(fxItemId);
}
if (anchor.hasChildNodes()) {
anchor.insertBefore(emitterContainer, anchor.firstChild);
} else {
anchor.appendChild(emitterContainer);
}
emitterContainer.style.width = "0px";
emitterContainer.style.height = "0px";
emitterContainer.style.top = "0px";
emitterContainer.style.left = "0px";
emitterContainer.style.position = "relative";
if (computedStyles.display == "flex") {
emitterContainer.style.alignSelf = "start";
}
return emitterContainer;
}
static createEmitterBox(emitterOrigin, emitterContainer) {
if (!FXUtil.valid(emitterContainer)) {
FXUtil.pollenFXError("No emittercontainer was provided. Something went wrong.");
return;
}
let emitterBox = document.createElement("div");
emitterBox.classList.add(PollenFXClasses.EMITTER_BOX_CLASS);
emitterContainer.appendChild(emitterBox);
emitterBox.style.overflow = emitterOrigin.overflow == true ? "visible" : "hidden";
emitterBox.style.position = "relative";
emitterBox.style.pointerEvents = "none";
if (emitterOrigin.anchorElement && emitterOrigin.mimicShape) {
const computed = window.getComputedStyle(emitterOrigin.anchorElement);
emitterBox.style.borderRadius = computed.borderRadius;
}
if (FXManager.DEBUG == true) {
emitterBox.style.backgroundImage = `linear-gradient(${emitterOrigin.debugColor.toRgba(0.15)}, ${emitterOrigin.debugColor.toRgba(0.5)})`;
emitterBox.style.border = "1px solid black";
emitterBox.style.boxSizing = "border-box";
}
return emitterBox;
}
static createCircularOriginBox(circularEmitterOrigin, emitterContainer, emitterBox, overrideDimensions = null) {
if (!FXUtil.valid(emitterContainer)) {
FXUtil.pollenFXError("No emittercontainer was provided. Something went wrong.");
return;
}
const emitterBoxLeft = FXUtil.fromPixel(emitterBox.style.left);
const emitterBoxTop = FXUtil.fromPixel(emitterBox.style.top);
let svg_wrapper = FXDom.getSvgWrapper();
let ellipse = document.createElementNS(svgNS, "ellipse");
ellipse.setAttribute("cx", circularEmitterOrigin.posX + emitterBoxLeft);
ellipse.setAttribute("cy", circularEmitterOrigin.posY + emitterBoxTop);
ellipse.setAttribute("rx", overrideDimensions ?? circularEmitterOrigin.width / 2);
ellipse.setAttribute("ry", overrideDimensions ?? circularEmitterOrigin.height / 2);
ellipse.setAttribute("stroke", "black");
ellipse.setAttribute("stroke-width", "1");
FXDom.applySvgColor(svg_wrapper, ellipse, circularEmitterOrigin.debugColor);
svg_wrapper.appendChild(ellipse);
emitterContainer.appendChild(svg_wrapper);
}
static createLineOriginBox(lineEmitterOrigin, emitterContainer, emitterBox) {
if (!FXUtil.valid(emitterContainer)) {
FXUtil.pollenFXError("No emittercontainer was provided. Something went wrong.");
return;
}
const emitterBoxLeft = FXUtil.fromPixel(emitterBox.style.left);
const emitterBoxTop = FXUtil.fromPixel(emitterBox.style.top);
const svg_wrapper = FXDom.getSvgWrapper();
const x1 = lineEmitterOrigin.posX + emitterBoxLeft;
const y1 = lineEmitterOrigin.posY + emitterBoxTop;
const x2 = lineEmitterOrigin.posX_2 + emitterBoxLeft;
const y2 = lineEmitterOrigin.posY_2 + emitterBoxTop;
const thickness = lineEmitterOrigin.offset ?? 2;
const dx = x2 - x1;
const dy = y2 - y1;
const length = Math.sqrt(dx * dx + dy * dy);
if (length === 0) return;
const ux = dx / length;
const uy = dy / length;
const px = (-uy * thickness) / 2;
const py = (ux * thickness) / 2;
const points = [
`${x1 + px},${y1 + py}`,
`${x2 + px},${y2 + py}`,
`${x2 - px},${y2 - py}`,
`${x1 - px},${y1 - py}`,
].join(" ");
const polygon = document.createElementNS(svgNS, "polygon");
polygon.setAttribute("points", points);
polygon.setAttribute("stroke", "black");
polygon.setAttribute("stroke-width", "1");
polygon.setAttribute("vector-effect", "non-scaling-stroke");
if (lineEmitterOrigin.debugColor) {
FXDom.applySvgColor(svg_wrapper, polygon, lineEmitterOrigin.debugColor);
} else {
polygon.setAttribute("fill", "black");
}
svg_wrapper.appendChild(polygon);
emitterContainer.appendChild(svg_wrapper);
}
static createPointOriginBox(pointEmitterOrigin, emitterContainer, emitterBox) {
FXDom.createCircularOriginBox(pointEmitterOrigin, emitterContainer, emitterBox, 5);
}
static createRectangularOriginBox(rectangularEmitterOrigin, emitterContainer, emitterBox) {
if (!FXUtil.valid(emitterContainer)) {
FXUtil.pollenFXError("No emittercontainer was provided. Something went wrong.");
return;
}
const emitterBoxLeft = FXUtil.fromPixel(emitterBox.style.left);
const emitterBoxTop = FXUtil.fromPixel(emitterBox.style.top);
let svg_wrapper = FXDom.getSvgWrapper();
let rect = document.createElementNS(svgNS, "rect");
const width = rectangularEmitterOrigin.width;
const height = rectangularEmitterOrigin.height;
rect.setAttribute("x", (rectangularEmitterOrigin.posX - width / 2) + emitterBoxLeft);
rect.setAttribute("y", (rectangularEmitterOrigin.posY - height / 2) + emitterBoxTop);
rect.setAttribute("width", width);
rect.setAttribute("height", height);
rect.setAttribute("stroke", "black");
rect.setAttribute("stroke-width", "1");
rect.setAttribute("vector-effect", "non-scaling-stroke");
FXDom.applySvgColor(svg_wrapper, rect, rectangularEmitterOrigin.debugColor);
svg_wrapper.appendChild(rect);
emitterContainer.appendChild(svg_wrapper);
}
static initAnchorResizeObserver(emitterOrigin, emitterBox) {
FXDom.handleResizing(emitterOrigin, emitterBox);
const heightObserver = new ResizeObserver((entries) => {
FXDom.handleResizing(emitterOrigin, emitterBox);
});
heightObserver.observe(emitterOrigin.anchorElement);
}
static handleResizing(emitterOrigin, emitterBox) {
FXDom.handleAnchorWidthResizing(emitterOrigin, emitterBox);
FXDom.handleAnchorHeightResizing(emitterOrigin, emitterBox);
}
static handleAnchorHeightResizing(emitterOrigin, emitterBox) {
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
let additionalOffsetHeight = 0;
if (emitterOrigin.containerUnitPosY == PositionUnit.PERCENTAGE) {
additionalOffsetHeight = (anchorHeight + totalExtraHeight) * (emitterOrigin.top / 100);
} else if (emitterOrigin.containerUnitPosY == PositionUnit.PIXEL) {
additionalOffsetHeight = emitterOrigin.top;
} else if (emitterOrigin.containerUnitPosY == PositionUnit.VIEW || emitterOrigin.containerUnitPosY == PositionUnit.VIEW_HEIGHT) {
additionalOffsetHeight = emitterOrigin.top * (window.innerHeight / 100);
} else {
FXUtil.pollenFXError("Invalid containerUnit provided for top: " + emitterOrigin.containerUnitPosY);
}
additionalOffsetHeight -= emitterOrigin.includeMargin === true ? anchorMarginTop : 0;
additionalOffsetHeight -= emitterOrigin.includeBorder === true ? anchorBorderTopWidth : 0;
additionalOffsetHeight += emitterOrigin.includePadding === true ? 0 : anchorPaddingTop;
additionalOffsetHeight *= -1;
if (emitterOrigin.containerUnitHeight == PositionUnit.PERCENTAGE) {
let newHeight = (anchorHeight + totalExtraHeight) * heightPercentage;
emitterBox.style.height = `${newHeight}px`;
emitterBox.style.top = `${-1 * (anchorPaddingTop + additionalOffsetHeight)}px`;
}
else if (emitterOrigin.containerUnitHeight == PositionUnit.PIXEL) {
emitterBox.style.height = `${emitterOrigin.containerHeight}${emitterOrigin.containerUnitHeight}`;
emitterBox.style.top = `${-1 * (anchorPaddingTop + additionalOffsetHeight)}px`;
}
else if (emitterOrigin.containerUnitHeight == PositionUnit.VIEW || emitterOrigin.containerUnitHeight == PositionUnit.VIEW_HEIGHT) {
emitterBox.style.height = `${emitterOrigin.containerHeight}vh`;
emitterBox.style.top = `${-1 * (anchorPaddingTop + additionalOffsetHeight)}px`;
} else {
FXUtil.pollenFXError("Invalid containerUnit provided for height: " + emitterOrigin.containerUnitHeight);
}
}
static handleAnchorWidthResizing(emitterOrigin, emitterBox) {
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
let additionalOffsetWidth = 0;
if (emitterOrigin.containerUnitPosX == PositionUnit.PERCENTAGE) {
additionalOffsetWidth = (anchorWidth + totalExtraWidth) * (emitterOrigin.left / 100);
} else if (emitterOrigin.containerUnitPosX == PositionUnit.PIXEL) {
additionalOffsetWidth = emitterOrigin.left;
} else if (emitterOrigin.containerUnitPosX == PositionUnit.VIEW || emitterOrigin.containerUnitPosX == PositionUnit.VIEW_WIDTH) {
additionalOffsetWidth = emitterOrigin.left * (window.innerWidth / 100);
} else {
FXUtil.pollenFXError("Invalid containerUnit provided for left: " + emitterOrigin.containerUnitPosX);
}
additionalOffsetWidth -= emitterOrigin.includeMargin === true ? anchorMarginLeft : 0;
additionalOffsetWidth -= emitterOrigin.includeBorder === true ? anchorBorderLeftWidth : 0;
additionalOffsetWidth += emitterOrigin.includePadding === true ? 0 : anchorPaddingLeft;
additionalOffsetWidth *= -1;
if (emitterOrigin.containerUnitWidth == PositionUnit.PERCENTAGE) {
let newWidth = (anchorWidth + totalExtraWidth) * widthPercentage;
emitterBox.style.width = `${newWidth}px`;
emitterBox.style.left = `${-1 * (anchorPaddingLeft + additionalOffsetWidth)}px`;
}
else if (emitterOrigin.containerUnitWidth == PositionUnit.PIXEL) {
emitterBox.style.width = `${emitterOrigin.containerWidth}${emitterOrigin.containerUnitWidth}`;
emitterBox.style.left = `${-1 * (anchorPaddingLeft + additionalOffsetWidth)}px`;
}
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
svgWrapper.appendChild(defs);
svgShape.setAttribute("fill", `url(#${gradientId})`);
}
}
class Emitter extends FXItem {
active;
loop;
delay = 0;
particleLifetime;
particleLifetimeNoise;
particleCount = null;
spawnedCount = 0;
cutOff;
emitterContainer;
emitterBox;
particleManager;
emitterOrigin;
particleBehavior = new Map();
particleData = new Map();
type;
pausedGentle;
constructor(emitterOrigin, type) {
super(0);
this.type = type
if (!emitterOrigin) {
FXUtil.pollenFXError("An emitter must be provided an origin.");
}
this.emitterOrigin = emitterOrigin;
}
initFinite(particleCount, emitterDuration, particleLifetime, particleLifetimeNoise = -1) {
this.particleCount = Math.max(0, particleCount);
this.lifeTime = Math.max(0, emitterDuration);
this.particleLifetime = particleLifetime;
this.particleLifetimeNoise = particleLifetimeNoise;
return this;
}
initInfinite(particleLifetime, particleLifetimeNoise = -1, particleCount = -1) {
this.particleCount = particleCount;
this.lifeTime = -1;
this.particleLifetime = particleLifetime;
this.particleLifetimeNoise = particleLifetimeNoise;
return this;
}
withDelay(delay) {
this.delay = Math.max(0, delay);
return this;
}
addParticleData(data) {
this.particleData.set(data.type, data);
return this;
}
addParticleBehavior(behavior) {
this.checkBehaviorValidityByEmitterType(behavior);
this.particleBehavior.set(behavior.type, behavior);
return this;
}
checkBehaviorValidityByEmitterType(behavior){
if(this.type == 'burst'){
if(behavior instanceof ParticleSpiralBehavior){
FXUtil.pollenFXError("A burst emitter cannot be given particleSpiralBehavior.");
}
}
}
getActiveParticles() {
return this.particleManager.getActiveFXItems();
}
reset() {
super.reset(this.lifeTime);
this.spawnedCount = 0;
this.cutOff = 0;
return this;
}
build() {
if(this.particleCount == null){
FXUtil.pollenFXError("An emitter must be initialized using .finite() or .infinite()!");
}
super.setLifetime(Emitter.calculateFinalDuration(this.particleLifetime, this.particleLifetimeNoise, this.lifeTime, this.delay));
this.loop = this.lifeTime < 0;
this.active = this.delay <= 0;
this.cutOff = 0;
this.createParticleManager();
this.emitterOrigin.build();
if(this.mustAddDefaultDataAndBehavior()){
this.setDefaultDataAndBehavior();
}
this.particleData.get("default")?.setEmitterOrigin(this.emitterOrigin);
this.createDOMDependencies();
return this;
}
setDefaultDataAndBehavior(){
const data_default = new ParticleDefaultData(20, 20).withClass("default_particle");
const data_directional = new ParticleDirectionData(90, 200);
const data_css = new ParticleCustomCssData(`background-color: red; border: 1px solid white; border-radius: 30px;`);
this.addParticleData(data_directional);
this.addParticleData(data_default);
this.addParticleData(data_css);
const behavior_size_by_life = new ParticleSizeByLifeBehavior([0,1,0]);
const behavior_directional = new ParticleDirectionalBehavior();
this.addParticleBehavior(behavior_size_by_life);
this.addParticleBehavior(behavior_directional);
}
createParticleManager(){
if (this.particleLifetime <= 0) {
this.particleManager = new FXItemManager(this.loop ? -1 : this.particleCount);
}
else {
this.particleManager = new FXItemLifeManager(this.loop ? -1 : this.particleCount);
}
}
pause(gentle=true){
this.paused = true;
this.pausedGentle = gentle;
return this;
}
resume(){
this.paused = false;
this.pausedGentle = null;
return this;
}
act(deltaTime, startTimeMs) {
super.act(deltaTime);
if(!this.paused){
this.checkSetActive();
this.particleManager.act(deltaTime, startTimeMs);
}else if(this.pausedGentle == true){
this.particleManager.act(deltaTime, startTimeMs);
}
}
checkSetActive(){
if (this.delay > 0 && this.actTime > this.delay) {
this.active = true;
}
}
createDOMDependencies() {
this.emitterContainer = FXDom.createEmitterContainer(this.emitterOrigin, this.fxItemId);
this.emitterBox = FXDom.createEmitterBox(this.emitterOrigin, this.emitterContainer);
if (this.emitterOrigin.anchorElement != null) {
FXDom.initAnchorResizeObserver(this.emitterOrigin, this.emitterBox);
} else {
FXDom.initBodyResizeObserver(this.emitterBox);
}
if (FXManager.DEBUG) {
switch (this.emitterOrigin.constructor.name) {
case "CircularEmitterOrigin": {
FXDom.createCircularOriginBox(this.emitterOrigin, this.emitterContainer, this.emitterBox);
break;
}
case "LineEmitterOrigin": {
FXDom.createLineOriginBox(this.emitterOrigin, this.emitterContainer, this.emitterBox);
break;
}
case "PointEmitterOrigin": {
FXDom.createPointOriginBox(this.emitterOrigin, this.emitterContainer, this.emitterBox);
break;
}
default: {
FXDom.createRectangularOriginBox(this.emitterOrigin, this.emitterContainer, this.emitterBox);
break;
}
}
}
}
mustAddDefaultDataAndBehavior(){
return this.particleData.size == 0 && this.particleBehavior.size == 0;
}
spawn() {
let newParticleLifetime = this.generateNextParticleLifetime();
let particle;
if (this.particleManager.canRecycle()) {
particle = this.particleManager.recycle().reset(newParticleLifetime);
particle.tryCreateParticleBox(this.emitterBox);
particle.showCSS(this.emitterBox);
}
else {
particle = new Particle(newParticleLifetime)
for (let [key, value] of this.particleData) {
particle.addParticleData(value.createNew(false));
}
for (let [key, value] of this.particleBehavior) {
particle.addParticleBehavior(value.createNewBehavior(false));
}
}
this.particleManager.activeFXItemPool.enqueue(particle);
particle.build();
particle.tryCreateParticleBox(this.emitterBox);
}
die(cleanDOM) {
this.particleManager.killAllFXItems(true);
}
revive() {
this.reset()
}
static calculateFinalDuration(particleLifetime, particleLifetimeNoise, lifeTime, delay) {
if (particleLifetime < 0 || lifeTime < 0) {
return -1;
}
let finalLifeTime = Math.max(0, delay) + lifeTime;
if (particleLifetimeNoise > 0) {
let maxParticleLifetime = PollenMath.relativeMap(particleLifetime, particleLifetimeNoise, 1);
finalLifeTime += maxParticleLifetime;
} else {
finalLifeTime += particleLifetime;
}
return finalLifeTime;
}
generateNextParticleLifetime() {
if (this.particleLifetimeNoise > 0) {
return PollenMath.relativeMap(this.particleLifetime, this.particleLifetimeNoise, Math.random());
}
return this.particleLifetime;
}
getCurrentAliveParticleCount() {
return this.particleManager.getActiveFXItemCount()
}
}
class EmitterShoot extends Emitter {
spawnIntervalTime;
constructor(emitterOrigin) {
super(emitterOrigin, "shoot");
}
build() {
super.build();
return this;
}
finite(particleCount, emitterDuration, particleLifetime, particleLifetimeNoise = -1) {
super.initFinite(particleCount, emitterDuration, particleLifetime, particleLifetimeNoise);
this.spawnIntervalTime = this.lifeTime / this.particleCount;
return this;
}
infinite(spawnIntervalTime, particleLifetime, particleLifetimeNoise = -1) {
super.initInfinite(particleLifetime, particleLifetimeNoise);
this.spawnIntervalTime = spawnIntervalTime;
return this;
}
act(deltatime, startTimeMs) {
if (this.active && !this.paused) {
let spawnCount = (deltatime + this.cutOff) / this.spawnIntervalTime;
this.cutOff = (spawnCount % 1) * this.spawnIntervalTime;
spawnCount = Math.trunc(spawnCount);
const maxSpawnCount = this.loop ? Infinity : this.particleCount - this.spawnedCount;
spawnCount = Math.min(spawnCount, maxSpawnCount);
for (let i = 0; i < spawnCount; i++) {
this.spawn();
}
}
super.act(deltatime, startTimeMs);
}
spawn() {
super.spawn();
this.spawnedCount++;
}
getAverigeAliveParticleCount() {
let avgLifetime = this.particleLifetime;
if (this.particleLifetimeNoise > 0) {
avgLifetime *= 1 + this.particleLifetimeNoise * 0.5;
}
let avgAlive = avgLifetime / this.spawnIntervalTime;
if (!this.loop) {
avgAlive = Math.min(avgAlive, this.particleCount);
}
return Math.max(0, Math.round(avgAlive));
}
}
class FXItemHybridLifeManager extends FXItemManager {
permanentlyActiveFXItemPool = new Array();
inactiveFXItemPool = new Array();
sharedActivePool = new Array();
constructor() {
super();
}
build() {
super.build();
for (const fxItem of this.permanentlyActiveFXItemPool) {
fxItem.build();
}
return this;
}
act(deltaTime, startTimeMs) {
super.act(deltaTime, startTimeMs);
this.checkDeath();
}
pause(gentle = false) {
this.sharedActivePool.forEach(fxItem => {
fxItem.pause(gentle);
});
}
resume() {
this.sharedActivePool.forEach(fxItem => {
if(fxItem.paused){
fxItem.resume();
}
});
}
pauseFXItem(id, gentle=true){
this.getFxItemById(id).pause(gentle);
}
resumeFXItem(id){
this.getFxItemById(id).resume();
}
addFXItem(fxItem) {
super.addFXItem(fxItem);
if (fxItem.isPermanent()) {
this.permanentlyActiveFXItemPool.push(fxItem);
} else {
this.activeFXItemPool.enqueue(fxItem);
}
this.sharedActivePool.push(fxItem);
}
getFxItemById(fxItemId) {
let foundFXItem = this.getActiveFXItems().find((it) => it.fxItemId == fxItemId);
if (foundFXItem == null) {
foundFXItem = this.inactiveFXItemPool.find((it) => it.fxItemId == fxItemId);
}
return foundFXItem ?? null;
}
getActiveFXItems() {
return this.sharedActivePool;
}
checkDeath() {
while (!this.activeFXItemPool.isEmpty() && this.activeFXItemPool.peek().isDead()) {
const deadFXItem = this.activeFXItemPool.dequeue();
deadFXItem.die();
const deadFXItemIndex = this.sharedActivePool.indexOf(deadFXItem);
if (deadFXItemIndex !== -1) {
this.sharedActivePool.splice(deadFXItemIndex, 1);
this.inactiveFXItemPool.push(deadFXItem);
}
}
}
canRecycle() {
return this.inactiveFXItemPool.length > 0;
}
recycle() {
return this.inactiveFXItemPool.shift();
}
killAllFXItems(cleanDOM = false) {
for (const sharedFxItem of this.sharedActivePool) {
this.inactiveFXItemPool.push(sharedFxItem);
sharedFxItem.die(cleanDOM);
}
this.sharedActivePool.length = 0;
this.permanentlyActiveFXItemPool.length = 0;
this.activeFXItemPool.length = 0;
}
reviveAllFXItems() {
for (const inactiveFxItem of this.inactiveFXItemPool) {
inactiveFxItem.revive();
if (inactiveFxItem.isPermanent()) {
this.permanentlyActiveFXItemPool.push(inactiveFxItem);
} else {
this.activeFXItemPool.enqueue(inactiveFxItem);
}
this.sharedActivePool.push(inactiveFxItem);
}
this.inactiveFXItemPool.length = 0;
}
}
class FXManager {
emitterManager;
startTime = 0;
runtime = 0;
lastRuntime = 0;
deltaTime = 0;
built = false;
started = false;
stopped = false;
canAct = false;
static DEBUG = false;
static ALLOW_DOM_OVERFLOW = false;
static VERSION = "1.0.0";
subscribers = [];
renderfunction = (nowTime) => {
this.act(nowTime);
window.requestAnimationFrame(this.renderfunction);
};
totalDocumentClosedRuntime = 0;
documentCloseTime = 0;
documentOpened = false;
constructor() {
this.setDocumentOpenHideHandler();
this.emitterManager = new FXItemHybridLifeManager();
}
withAllowDOMOverflow(allowDOMOverflow = true) {
if (this.built) {
FXUtil.pollenFXError("setAllowDOMOverflow should only be called before building");
}
FXManager.ALLOW_DOM_OVERFLOW = allowDOMOverflow;
return this;
}
setDebug(debug = true) {
if (this.built) {
FXUtil.pollenFXError("setDebug should only be called before building");
}
FXManager.DEBUG = debug;
return this;
}
build(start = true) {
if (!this.built) {
FXUtil.addDocumentCSS([`.${PollenFXClasses.PFX_DISALLOW_OVERFLOW_CLASS}{${FXManager.ALLOW_DOM_OVERFLOW === true ? "overflow:auto;" : "overflow:hidden;"}}`]);
if (!FXManager.ALLOW_DOM_OVERFLOW) {
FXUtil.disallowElementOverflow(document.body);
}
if (!this.emitterManager.hasAnyFXItem()) {
this.addDefaultEmitter();
}
this.emitterManager.build();
window.requestAnimationFrame(this.renderfunction);
this.built = true;
}
this.setCanAct();
if (start) {
this.start();
}
return this;
}
addEmitter(emitter) {
this.emitterManager.addFXItem(emitter);
return this;
}
subscribe(subscription) {
if (typeof subscription !== "function") {
FXUtil.pollenFXError("You must only subscribe to an FXManager with functions of type void=>(runtime, fxManager)");
return;
}
this.subscribers.push(subscription);
return this;
}
start() {
if (this.canStart()) {
if (this.stopped) {
this.emitterManager.reviveAllFXItems();
this.emitterManager.resume();
}
this.reset();
this.started = true;
this.stopped = false;
this.setCanAct();
}
return this;
}
stop() {
this.started = false;
this.stopped = true;
this.setCanAct();
this.emitterManager.killAllFXItems(false);
}
restart() {
this.stop();
this.start();
}
pause(gentle = false) {
this.emitterManager.pause(gentle);
}
resume() {
this.emitterManager.resume();
}
pauseEmitter(id, gentle = true) {
this.emitterManager.pauseFXItem(id, gentle);
}
resumeEmitter(id) {
this.emitterManager.resumeFXItem(id);
}
getAverigeAliveParticleCount() {
return this.emitterManager.allAddedFXItems.reduce((accum, emitter) => {
return accum + emitter.getAverigeAliveParticleCount();
}, 0);
}
getCurrentAliveParticleCount() {
return this.emitterManager.getActiveFXItems().reduce((accum, emitter) => {
return accum + emitter.getCurrentAliveParticleCount();
}, 0);
}
getEmitterById(fxItemId) {
return this.emitterManager.getFxItemById(fxItemId);
}
getFPS() {
const currentFPS = this.deltaTime > 0 ? 1000 / this.deltaTime : 0;
return Math.round(currentFPS);
}
getActiveEmitters() {
return this.emitterManager.getActiveFXItems();
}
act(nowTime) {
if (this.documentOpened) {
this.runtime = nowTime - this.totalDocumentClosedRuntime;
this.deltaTime = this.runtime - this.lastRuntime;
this.lastRuntime = this.runtime;
if (this.canAct) {
this.emitterManager.act(this.deltaTime, this.startTime);
for (let subscriber of this.subscribers) {
subscriber(this.runtime, this);
}
}
}
}
canStart() {
if (this.started) {
return false;
}
if (!this.built) {
FXUtil.pollenFXError("The start() method cannot be called on an FXManager before build() gets called.");
return false;
}
return true;
}
reset() {
this.startTime = performance.now();
this.runtime = 0;
this.deltaTime = 0;
this.totalDocumentClosedRuntime = 0;
}
setDocumentOpenHideHandler() {
this.documentOpened = !document.hidden;
document.addEventListener("visibilitychange", () => {
if (document.hidden) {
this.documentOpened = false;
this.documentCloseTime = performance.now();
} else {
this.documentOpened = true;
this.totalDocumentClosedRuntime += performance.now() - this.documentCloseTime;
}
this.setCanAct();
});
this.setCanAct();
}
addDefaultEmitter() {
const originSize = 40;
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const origin = new CircularEmitterOrigin(windowWidth / 2 - originSize / 2, windowHeight / 2 - originSize / 2, originSize, originSize);
let emitter = new EmitterShoot(origin).infinite(50, 1000);
this.addEmitter(emitter);
}
setCanAct() {
this.canAct = this.built && this.documentOpened && this.started;
}
}
class EmitterBurst extends Emitter {
burstCount;
burstIntervalTime;
localBurstCount;
burstedCount;
timeSinceLastBurst;
constructor(emitterOrigin) {
super(emitterOrigin, "burst");
}
build() {
super.build();
this.burstCount = this.loop ? Number.MAX_VALUE : this.burstCount;
this.timeSinceLastBurst = 0;
this.burstedCount = 0;
this.localBurstCount = 1;
return this;
}
finite(particleCount, burstCount, emitterDuration, particleLifetime, particleLifetimeNoise = -1) {
super.initFinite(particleCount, emitterDuration, particleLifetime, particleLifetimeNoise);
this.burstCount = burstCount;
this.burstIntervalTime = emitterDuration / Math.max(burstCount - 1, 1);
return this;
}
infinite(particleCount, burstIntervalTime, particleLifetime, particleLifetimeNoise = -1) {
super.initInfinite(particleLifetime, particleLifetimeNoise, particleCount);
this.burstIntervalTime = burstIntervalTime;
return this;
}
act(deltaTime, startTimeMs) {
if (this.active && !this.paused) {
for (let i = 0; i < this.localBurstCount; i++) {
this.burst();
this.timeSinceLastBurst = this.timeSinceLastBurst % this.burstIntervalTime;
}
let localBurstCount = (deltaTime + this.cutOff) / this.burstIntervalTime;
this.cutOff = (deltaTime + this.cutOff) % this.burstIntervalTime;
this.localBurstCount = Math.min(Math.trunc(localBurstCount), this.burstCount - this.burstedCount);
if (this.emitterCreationTime + this.emitterLiveTime >= this.emitterCreationTime + this.lifeTime) {
super.getActiveParticles().length = 0;
} else if (this.emitterLiveTime > this.delay) {
this.active = true;
}
}
super.act(deltaTime, startTimeMs);
}
burst() {
this.emitterOrigin.initializePosition();
for (let i = 0; i < this.particleCount; i++) {
super.spawn();
}
this.burstedCount++;
}
reset(){
super.reset();
this.timeSinceLastBurst = 0;
this.burstedCount = 0;
this.localBurstCount = 1;
}
getAverigeAliveParticleCount() {
let avgLifetime = this.particleLifetime;
if (this.particleLifetimeNoise > 0) {
avgLifetime *= 1 + (this.particleLifetimeNoise * 0.5);
}
let overlappingBursts = Math.ceil(avgLifetime / this.burstIntervalTime);
if (!this.loop) {
overlappingBursts = Math.min(overlappingBursts, this.burstCount);
}
const avgAlive = overlappingBursts * this.particleCount;
return Math.max(0, Math.round(avgAlive));
}
}
class RectangularEmitterOrigin extends EmitterOrigin {
width;
height;
constructor(posX, posY, width, height) {
super(posX, posY);
this.width = width;
this.height = height;
}
build() {
super.build();
return this;
}
generateParticleSpawnPosition() {
const x = Math.random() * this.width + this.posX - this.width / 2;
const y = Math.random() * this.height + this.posY - this.height / 2;
return [x, y];
}
}
class ParticleColorfilterBehavior extends ParticleBehavior {
duration = -1;
initialDuration = -1;
colors = [];
colorsHsb = [];
particleColorfilterData;
randomStartColor = false;
startIndex = 0;
colorIterationCount = -1;
colorIteration;
lastColorIndexSum;
constructor(colors) {
super("colorfilter");
this.colors = colors;
}
build(particleDataManager, particleBehaviorManager) {
this.deriveHSBColors()
this.colorIteration = 0;
this.startIndex = this.startIndex % this.colorsHsb.length;
this.lastColorIndexSum = Math.min(this.colorsHsb.length, 1);
this.duration = this.initialDuration;
if (this.randomStartColor) {
this.startIndex = Math.floor(Math.random() * this.colorsHsb.length);
}
this.particleColorfilterData = particleDataManager.ensureData("colorfilter", false);
if (this.particleColorfilterData.color === null) {
this.particleColorfilterData.color = this.colors != null ? this.colors[0] : ColorUtil.debugColor;
this.particleColorfilterData.build();
}
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
const h = PollenMath.lerp(this.colorsHsb[fromIndex][0], this.colorsHsb[toIndex][0], localProgress);
const s = PollenMath.lerp(this.colorsHsb[fromIndex][1], this.colorsHsb[toIndex][1], localProgress);
const b = PollenMath.lerp(this.colorsHsb[fromIndex][2], this.colorsHsb[toIndex][2], localProgress);
const h_rot = this.particleColorfilterData.getHueShiftForColorTargetFromSepia([h,s,b], this.particleColorfilterData.initialHueRotate)
this.updateColors(h_rot, s, b);
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
class ParticleRotationByDirectionBehavior extends ParticleBehavior {
offset;
particleDirectionData;
particleRotationData;
constructor(offset = -1) {
super("rotation");
this.offset = Math.max(0, Math.min(360, offset))
}
build(particleDataManager, particleBehaviorManager) {
this.particleDirectionData = particleDataManager.ensureData("direction");
this.particleRotationData = particleDataManager.ensureData("rotation");
return this;
}
reset() {
return this;
}
act(particle, startTimeMs, deltaTime, deltaTimeSeconds) {
const hypotenuse = Math.sqrt(Math.pow(this.particleDirectionData.directionX, 2) + this.particleDirectionData.directionX, 2);
const normalizedYFactor = this.particleDirectionData.directionY / hypotenuse;
const normalizedXFactor = this.particleDirectionData.directionX / hypotenuse;
this.particleRotationData.rotation = PollenMath.radToDeg(Math.atan(normalizedYFactor / normalizedXFactor) + this.offset);
}
applyParticle(particle) {}
createNewBehavior(copy) {
if (copy) {
return this;
} else {
return new ParticleRotationByDirectionBehavior(this.offset);
}
}
static createDefault() {
return new ParticleRotationByDirectionBehavior(-1);
}
}
class ParticleCustomCssData extends ParticleData {
customCssObject;
minZIndex = 2001;
maxZIndex = 2001;
zIndex = 2001;
constructor(customCssObject) {
super("customCSS");
this.customCssObject = customCssObject;
}
zIndex(zIndex) {
this.minZIndex = zIndex;
this.maxZIndex = zIndex;
return this;
}
zIndexRange(minZIndex = 2001, maxZIndex = 2001) {
this.minZIndex = minZIndex;
this.maxZIndex = maxZIndex;
return this;
}
reset() {
return this;
}
build() {
this.zIndex = PollenMath.randomBetween(this.minZIndex, this.maxZIndex, false);
return this;
}
getCSS() {
return `${this.customCssObject}z-index:${this.zIndex}!important;`;
}
static createDefault() {
return new ParticleCustomCssData("background-color:red;");
}
createNew(copy) {
if (copy) {
return this;
}
return new ParticleCustomCssData(this.customCssObject).zIndexRange(this.minZIndex, this.maxZIndex);
}
}