class FXItemManager {
  /* FIELDS */
  fxItemCount;
  activeFXItemPool;
  allAddedFXItems;


  /* CONSTRUCTOR */
  constructor() {
    this.fxItemCount = 0;
    this.allAddedFXItems = [];
    this.activeFXItemPool = new PriorityQueue((cur, next) => {
      return cur.lifeTime - cur.actTime - (next.lifeTime - next.actTime);
    });
  }



  /* FLUENT */
  build() {
    for (const fxItem of this.activeFXItemPool.collect()) {
      fxItem.build();
    }
    return this;
  }



  /* METHODS */
  act(deltaTime) {
    for (let fxItem of this.getActiveFXItems()) {
      fxItem.act(deltaTime);
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
    this.activeFXItemPool.empty();
  }

  getActiveFXItems() {
    return this.activeFXItemPool.collect();
  }

  canRecycle() {
    return false;
  }

  pause() {
    //todo
  }
}
