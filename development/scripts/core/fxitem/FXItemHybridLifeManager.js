class FXItemHybridLifeManager extends FXItemManager {

  /* PARAMETERS */
  permanentlyActiveFXItemPool = new Array(); // FXItems (emitter or particle) that are always active or running
  inactiveFXItemPool = new Array();          // FXItems (emitter or particle) that are inactive or not running
  sharedActivePool = new Array();            // An FXItemManager manages both permanent or dying FXItems. The sharedpool contains FXItems that exist in both permanentlyActiveFXItemPool as activeFXItemPool.



  /* CONSTRUCTOR */
  constructor() {
    super();
  }



  /* FLUENT */
  build(){
    super.build();
    for (const fxItem of this.permanentlyActiveFXItemPool) {
      fxItem.build();
    }
    return this;
  }



  /* METHODS */
  act(deltaTime) {
    super.act(deltaTime);
    this.checkDeath();
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
    // Check the shared pool. Any active FXitem will be in there
    let foundFXItem = this.getActiveFXItems().find((it) => it.fxItemId == fxItemId);
    // If not found, check the inactive pool.
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
      const deadFXItemInded = this.sharedActivePool.indexOf(deadFXItem);
      if (deadFXItemInded !== -1) {
        this.sharedActivePool.splice(i, 1);
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

  killAllFXItems() {
    // kill active fxitem pool
    while (!this.activeFXItemPool.isEmpty()) {
      const deadFXItem = this.activeFXItemPool.dequeue();
      deadFXItem.die();
      const i = this.sharedActivePool.indexOf(deadFXItem);
      if (i !== -1) {
        this.sharedActivePool.splice(i, 1);
      }
      this.inactiveFXItemPool.push(deadFXItem);
    }
    // kill permanentactive fxitem pool
    for (const fxItem of this.permanentlyActiveFXItemPool) {
      fxItem.die();
    }
    this.permanentlyActiveFXItemPool.length = 0;
    // empty the shared fxitem pool to get rid of floating references
    this.sharedActivePool.length = 0;
  }
}
