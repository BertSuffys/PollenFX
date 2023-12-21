class FXItemHybridLifeManager extends FXItemManager {

  /* Parameters */
  _permanentlyActiveFXPool = new Array()
  _inactiveFXItemPool = new Array()
  _sharedActivePool = new Array()




  act(deltaTime) {
    for(let fxItem of this.getActiveFXItems()){
      fxItem.act(deltaTime);
    }
    this.checkDeath()
  }


  addFXItem(fxItem, fxItemId = null) {
    if (fxItem.loop) {
      this.permanentlyActiveFXPool.push(fxItem)
      super.fxItemCount += 1;
      fxItem.fxItemId = (fxItemId == null || fxItemId == '') ? fxItem.getClassName()+'_'+ this.fxItemCount : fxItemId;
    } else {
      super.addFXItem(fxItem, fxItemId)
    }
    this.sharedActivePool.push(fxItem)
  }





  /**
* Attempts to collect and fxItem from the active pool by its provided ID
*/
  getFxItemById(fxItemId) {
    let foundFXItem = super.getFxItemById(fxItemId);
    if (foundFXItem == null) {
      let newAttempt = this.permanentlyActiveFXPool.filter(it => it.fxItemID == fxItemId);
      if (newAttempt.length == 0) {
        foundFXItem = null
      }
      else {
        return newAttempt[0];
      }
    }
    if (foundFXItem == null) {
      let newAttempt = this.inactiveFXItemPool.filter(it => it.fxItemID == fxItemId);
      if (newAttempt.length == 0) {
        foundFXItem = null
      }
      else {
        return newAttempt[0];
      }
    }
    return foundFXItem;
  }


  getActiveFXItems() {
    return this.sharedActivePool
  }

  checkDeath() {
    while (!this.activeFXItemPool.isEmpty() && this.activeFXItemPool.peek().isDead()) {
      const deadFXItem = super.activeFXItemPool.dequeue()
      deadFXItem.notifyDead() // dying FXItem might have to unwind its worldly affaires
      this.sharedActivePool.splice(this.sharedActivePool.indexOf(deadFXItem), 1)
      this.inactiveFXItemPool.push(deadFXItem)
    }
  }

  canRecycle() {
    return this.inactiveFXItemPool.length > 0
  }


  recycle() {
    return this.inactiveFXItemPool.shift()
  }


  /**
* Empties the whole of the active FXItem pool and moves to the recyclable pool
*/
  killAllFXItems() {
    while (!this.activeFXItemPool.isEmpty()) {
      const deadFXItem = super.activeFXItemPool.dequeue()
      deadFXItem.notifyDead() // dying FXItem might have to unwind its worldly affaires
      this.sharedActivePool.splice(this.sharedActivePool.indexOf(deadFXItem), 1)
      this.inactiveFXItemPool.push(deadFXItem)
    }
    for (fxItem in this.permanentlyActiveFXPool) {
      fxItem.notifyDead()                    // hide css requirement
    }
    this.permanentlyActiveFXPool.length = 0;
    for (fxItem in this.sharedActivePool) {
      fxItem.notifyDead()                    // hide css requirement
    }
    this.sharedActivePool.length = 0;
  }



  get permanentlyActiveFXPool() {
    return this._permanentlyActiveFXPool
  }
  set permanentlyActiveFXPool(value) {
    this._permanentlyActiveFXPool = value
  }
  get sharedActivePool() {
    return this._sharedActivePool
  }
  set sharedActivePool(value) {
    this._sharedActivePool = value
  }
  get inactiveFXItemPool() {
    return this._inactiveFXItemPool
  }
  set inactiveFXItemPool(value) {
    this._inactiveFXItemPool = value
  }
}