class FXItemLifeManager extends FXItemManager {

  /* FIELDS */
  inactiveFXItemPool = new Array();



  /* CONSTRUCTOR */
  constructor(){
    super();
  }



  /* METHODS */
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