class FXItemManager {
  /* FIELDS */
  fxItemCount;               // amount of fxitems, either emitters or particles
  activeFXItemPool;          // active, currently being processed partices or emitters
  allAddedFXItems;           // all fxitems, either active, inactive, permanently active, or shared.


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

  pause() {
    //todo
  }
}
