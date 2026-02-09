class ParticleBehavior {
  /* FIELDS */
  type;


  
  /* CONSTRUCTOR */
  constructor(type) {
    this.setType(type);
  }



  /* METHODS */
  build() {
    FXUtil.pollenFXError("A concrete instance of ParticleBehavior should never be created or built.");
  }



  /* GETTERS AND SETTERS */
  getType() {
    return this.type;
  }
  setType(value) {
    this.type = value;
  }
}
