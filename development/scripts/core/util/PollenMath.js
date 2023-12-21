
class PollenMath {
  static POLLEN_PI = 3.14159

  /*
* Maps a number between two given numbers (ex: 0.2 between 0 and 1) to another number between two different numbers
* EX: 0.2 fromStart=0 and fromEnd=1 will map to 10, given toStart=0 and toEnd=50
*/
  static mapNumber(fromStart, fromEnd, toStart, toEnd, mappedNumber) {
    if (fromEnd === fromStart) {
      return 0
    }
    return (
      ((mappedNumber - fromStart) / (fromEnd - fromStart)) * (toEnd - toStart) +
      toStart
    )
  }

  /**
* Generates a random number between two limits. In case of decimals not being allowed, the value is rounded.
*/
  static randomBetween(upperLimit, lowerLimit, allowDecimals) {
    let rand = Math.random() * (upperLimit - lowerLimit) + lowerLimit
    return allowDecimals ? rand : Math.round(rand)
  }

  /**
* Rounds a number to a certain amount of decimal places in number format.
* Used to combat typescrip's random addition of 0.00000001-ish values after calculation
*/
  static cleanRound(value, decimalPlaces) {
    const delimiter = Math.pow(10, decimalPlaces)
    return Math.round((value + Number.EPSILON) * delimiter) / delimiter
  }

  /**
* Converts and returns an angle in degrees to its equivalent in radials
*/
  static degToRad(degrees) {
    return (degrees / 180) * this.POLLEN_PI
  }

  /**
* Converts and returns an angle in radials to its equivalent in degrees
*/
  static radToDeg(rad) {
    return rad * (180 / this.POLLEN_PI);
  }

  /**
* Cos for radials
*/
  static cos(degrees) {
    return Math.cos(this.degToRad(degrees))
  }

  /**
* Sin for radials
*/
  static sin(radials) {
    return Math.sin(this.degToRad(radials))
  }

  /**
* Maps a positive number to another number between 0 and +infinity
* Example: positive map the number 2 by 5, will multiply 2 by a random number between [0, 5] to receive a number between [0, 10]
* Example: 7.positiveMap(4) -> random[0, 21]
*/
  static positiveMap(number, scalar, random = -1) {
    random = random == -1 ? Math.random() : random
    const halfRange = number * scalar - number
    const offset = random * (2 * halfRange) - halfRange
    return Math.max(0, number + offset)
  }

  /**
* Maps a positive number to another number between 0 and +infinity, but never 0
* Example: positive map the number 2 by 5, will multiply 2 by a random number between [0.2, 5] to receive a number between [0.4, 10]
* Example: 7.positiveMap(4) -> random[1.75, 21]
*/
  static relativeMap(number, scalar, random = -1) {
    random = random == -1 ? Math.random() : random
    const minScalar = 1 / scalar
    scalar = random * (scalar - minScalar) + minScalar
    return number * scalar
  }

  /**
* Linearly interpolates between number_1 and number_2 by the lerpfactor (value between 0 and 1)
*/
  static lerp(number_1, number_2, lerpFactor) {
    return number_1 - (number_1 - number_2) * lerpFactor
  }

  /**
* The built-in % works as a remainder, and not a true modulo. This modulo allows -1%5 to return a 4.
*/
  static modulo(value, moduloValue) {
    return ((value % moduloValue) + moduloValue) % moduloValue
  }

  static randomSign() {
    return Math.random() < 0.5 ? -1 : 1
  }
}

