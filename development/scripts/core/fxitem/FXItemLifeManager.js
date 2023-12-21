class FXItemLifeManager extends FXItemManager {

  _inactiveFXItemPool = new Array()


  act(deltaTime) {
    this.checkDeath()
    super.act(deltaTime)
  }


  canRecycle() {
    return this.inactiveFXItemPool.length > 0
  }


  recycle() {
    const revivedFXItem = this.inactiveFXItemPool.shift();
    revivedFXItem.showCSS()
    return revivedFXItem
  }


  /**
   * Checks for to-be-dead particles in the active pool and kills them
   */
  checkDeath() {
    while (!this.activeFXItemPool.isEmpty() && this.activeFXItemPool.peek().isDead()) {
      const deadFXItem = super.activeFXItemPool.dequeue()
      this.inactiveFXItemPool.push(deadFXItem)
      deadFXItem.notifyDead()
    }
  }

  /**
* Attempts to collect and fxItem from the active pool by its provided ID
*/
  getFxItemById(fxItemId) {
    let foundFXItem = super.getFxItemById(fxItemId);
    if (foundFXItem == null) {
      let newAttempt = this.inactiveFXItemPool.collect().filter(it => it.fxItemID == fxItemId);
      if (newAttempt.length == 0) {
        foundFXItem = null
      }
      else {
        return newAttempt[0];
      }
    }
    return foundFXItem;
  }


  /**
  * Empties the whole of the active FXItem pool and moves to the recyclable pool
  */
  killAllFXItems() {
    while (!this.activeFXItemPool.isEmpty()) {
      const deadFXItem = super.activeFXItemPool.dequeue()
      this.inactiveFXItemPool.push(deadFXItem)
      deadFXItem.notifyDead()
    }
  }


  get inactiveFXItemPool() {
    return this._inactiveFXItemPool
  }
  set inactiveFXItemPool(value) {
    this._inactiveFXItemPool = value
  }
}