  ----- development folder ----- 
-> contains the current up to date project in development state and all its sources.


  ----- production folder ----- 
-> contains for each release a folder with nothing but the finished product and documentation.


  ----- export documentation to pdf ----- 
-> In the browser open the html in a tab. press ctrl+p, alter destination to 'Save as pdf', optionally alter the properties, save.


  ----- script bundling----- 
-> For the future, i will maybe develop a js bundling tool that inspects the dependencies and merges them into one file.
-> For now, i bundle manually and the order should not matter due to the hoisting principle within single .js files


  ----- Developer notes----- 
1. An FXItem, when it dies, also kills all FXItem children. For example a dying emitter, first kills it particle children. 
2. Dead particles, or FXItems in general will not be removed (nor re-attached) upon death/recycling. merely hidden/shown for performance reasons.<br>
3. By setting the DevConfig.DEBUG enum in the PollenFX config file, one allows helperobjects to be rendered<br>
4. Creating  emitters involves the creation of a few helper HTMLElements. This happens within the Emitter.
   -> EmitterContainer: when creating an emitter, it will always become attached to a HTMLElement. This can be provided explicitly, but if not it will attach
      to the body element. We call this the anchor element. Within this anchor element the EmitterContainer is added, which is an imploded, relatively positioned, width
      and heightless element with top:0 and left:0 initialized. This functions as the first layer of emitter setup. Its styling is important. its class="pollenfx_emitter_container".
      Beware that at some point i changed the position from absolute to relative without being fully aware of the consequences. 
   -> EmitterBox: When an emitter is being created, it will firstly scan its anchorelement for an existing EmitterContainer. If it does not exist, it quickly creates one. Next up,
      within the EmitterContainer, an EmitterBox is being created. this element mimics the anchor element within which the particles will reside. Its in some sense a sort of clone
      of the anchorelement because we do not have control over its styling. We do have control over the EmitterBox. Each emitter has one emitterbox, it is position:relative, its 
      styling is important, has class="pollenfx_emitter_box", and can only be seen when DevConfig.DEBUG=true.
   -> ParticleBox: The particleBox is the true HTMLElement representing the particle. It is being created from an emitter-implementation upon a particle spawn. The particle 
      is position:absolute which is defined as a default style in the ParticleDataManager. This element carries the final particle styling.



  ----- Todo v1.0 ----- 
-> Origin size position unit option
-> Git & git kraken


   ------ Final flow ----------
-> 2. Documentation finished first draft + have someone read + reread fully, spelling and structural corrections
-> 3. Thorough self-testing + changes documentation, future changes & own changes
-> 4. Write down intresting developer notes. that which i have to remember for myself.
-> 5. Have someone production test? (Hubert?)
-> 6. UML creation
-> 7. PDF creation of the html documentation
-> 8. Write introductory text with highlights of the app

  ----- Future updates ----- 
-> Emitterbehavior change to 1 behavior for all particles, with an assistent data-object for all behavior-specific data items which the behaviors currently have
-> JS File bundler, minimizer, comment-remover & whiteline-remover
-> Origin object weg proberen te halen uit default data object
-> When a first emitter is being created, OR perhaps an FXManager is being made, give it startdata and or behavior so that it immediately gives feedback that it works. 
   A suggestion to implement this would be on emitter level in the constructor, to add say default CSSData, DefaultData and or directionalBehavior. This will immediately make it visible.
   The emitter receives the origin so it knows where to anchor. The only problem is that an emitter must be attached to an fxManager, and the fxManager must be run. So im not yet
   sure how an emitter will be visible immediately upon creating it. But this is food for thought.
-> Perhaps it could be an idea to move the config parameters & enums (found in config.js) to a better location
-> Include deltatime speed calculation in all behavior objects

  ----- Terminology ----- 
-> actTime = time (in ms) something is alive for
-> spawnTime = moment/date (in ms) when spawning
-> lifeTime = time (in ms) something should in total be alive for
-> liveTime = spawnTime + actTime, in essence.

colorfilter -> timeAlive (calculated) aka livetime
colorshift -> timeAlive (calculated) aka livetime
direction -> /
flipbook -> /
gravity -> /
opacity -> /
rotation -> /
rotationbydirection -> /
sizebylife -> /
wind -> timeAlive (calculated) aka livetime                               lastUpdateTime + deltaTime - particle.spawnTime

