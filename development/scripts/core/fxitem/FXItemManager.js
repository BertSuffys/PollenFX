class FXItemManager {

  _fxItemCount

  _activeFXItemPool = new PriorityQueue((cur, next) => {
    return cur.spawnTime - cur.lifeTime - (next.spawnTime - next.lifeTime)
  })


  /* Constructor */
  constructor( count = -1) {
    this.fxItemCount = 0;
  }


  act(deltaTime) {
    for(let fxItem of this.getActiveFXItems()){
      fxItem.act(deltaTime);
    }
  }


  /**
* Attempts to collect and fxItem from the active pool by its provided ID
*/
  getFxItemById(fxItemId) {
    try {
      return this.activeFXItemPool.collect().filter(it => it.fxItemId === fxItemId)[0];
    } catch (exception) {
      return null;
    }
  }


  addFXItem(fxItem, fxItemId = null) {
    this.activeFXItemPool.enqueue(fxItem)
    this.fxItemCount += 1;
    fxItem.fxItemId = (fxItemId == null || fxItemId == '') ? fxItem.getClassName() + this.fxItemCount : fxItemId;
  }

  /**
   * Empties the whole of the active FXItem pool
   */
  killAllFXItems() {
    for (fxItem in this.activeFXItemPool) {
      fxItem.notifyDead()                    // hide css requirement
    }
    this.activeFXItemPool.empty()
  }


  getActiveFXItems() {
    return this.activeFXItemPool.collect()
  }


  canRecycle() {
    return false
  }




  get fxItemCount() {
    return this._fxItemCount
  }
  set fxItemCount(value) {
    this._fxItemCount = value
  }

  get activeFXItemPool() {
    return this._activeFXItemPool
  }
  set activeFXItemPool(value) {
    this._activeFXItemPool = value
  }

}