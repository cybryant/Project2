require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/views/layers/LayerView",
  "esri/widgets/Home",
  "esri/widgets/Zoom",
  "esri/widgets/Editor",
  "esri/layers/support/FeatureEffect"
], (
  Map,
  MapView,
  FeatureLayer,
  LayerView,
  Home,
  Zoom,
  Editor,
  FeatureEffect
) => {
  //*********************************
  // LAYER VARIABLES & SYMBOLOGY RENDERERS
  //*********************************
  // trails layer
  const trails = new FeatureLayer({
    portalItem: {
      id: "f40494fb4e5d4a89991020c08a2b86e3"
    },
    title: "Trails",
    definitionExpression: "PARKNAME = 'Elinor Klapp-Phipps Park'"
  });

  // define renderer for boundary symbology
  const boundRenderer = {
    type: "simple",
    symbol: {
      type: "simple-fill",
      color: [144, 238, 144, 0.5],
      outline: { width: 2, color: "orange" }
    }
  };

  // park polygon layer
  const boundary = new FeatureLayer({
    portalItem: {
      id: "3b9e47ebad5742e98ca96a0a37e757d5"
    },
    title: "Park Boundary",
    definitionExpression: "PARKNAME = 'Elinor Klapp-Phipps Park'",
    renderer: boundRenderer
  });

  //*********************************
  // REQUIRED MAP OBJECTS
  //*********************************
  // map
  const map = new Map({
    // use this for a custom basemap
    // basemap: {
    //     portalItem: {
    //       id: "4f2e99ba65e34bb8af49733d9778fb8e",
    //     },
    basemap: "gray-vector",
    layers: [boundary, trails]
  });

  // mapView
  const view = new MapView({
    map: map,
    container: "viewDiv",
    zoom: 14,
    // scale: 9000,
    center: [-84.29, 30.5305]
    // CONSIDER SETTING EXTENT OR CONSTRAINTS
    // ensures when going fullscreen left corners of extent & view container align
    //resizeAlign: "top-left",
  });

  //*********************************
  // ????
  //*********************************

  //*********************************
  // CREATE WIDGET VARIABLES
  //*********************************
  // const titleDiv = document.getElementById("titleDiv");
  // const editor = new Editor({ view: view });
  const home = new Home({ view: view });
  const zoom = new Zoom({ view: view });

  //*********************************
  // DEFINE EDITOR FUNCTIONALITY
  //*********************************

  //*********************************
  // ADD WIDGETS TO USER INTERFACE
  //*********************************
  view.ui.empty("top-left");
  // view.ui.add(editor, "top-left");
  view.ui.add(home, "top-right");
  view.ui.add(zoom, "top-right");

  //*********************************
  // CREATE LAYERVIEW OBJECT TO FILTER
  //*********************************
  /* 'layerView' versus 'layer' allows filtering on the client side rather than the server side, so no callback is needed & performance is faster */

  // variable to hold the layerView
  let trailsLayerView;

  // once layerView loads, assign to the variable & return it
  view.whenLayerView(trails).then((layerView) => {
    trailsLayerView = layerView;
    return trailsLayerView;
  });

  //*********************************
  // FILTERS FOR TRAIL TYPES
  //*********************************
  // variables for each trail type filter
  const sharedFilter = {
    where: "CATEGORY='Shared-Use Equestrian'"
  };
  const hikeFilter = {
    where: "CATEGORY='Hiking Trail'"
  };
  const bikeFilter = {
    where: "CATEGORY='Mtn Bike Trail'"
  };

  //*********************************
  // EVENT LISTENER FOR RADIO BUTTONS
  //*********************************
  document.getElementById("filterDiv").addEventListener("change", (event) => {
    let target = event.target;
    switch (target.id) {
      case "shared":
        filterTrails(sharedFilter);
        break;
      case "hike":
        filterTrails(hikeFilter);
        break;
      case "bike":
        filterTrails(bikeFilter);
        break;
    }
  });

  //*********************************
  //DRAFT (REFERENCE) EVENT LISTENERS FOR RADIO BUTTONS
  //*********************************

  // create variables for radio buttons
  // const sharedBtn = document.getElementById("shared");
  // const hikeBtn = document.getElementById("hike");
  // const bikeBtn = document.getElementById("bike");

  // // event listeners
  // sharedBtn.addEventListener("click", filterTrails(sharedBtn, sharedFilter));
  // hikeBtn.addEventListener("click", filterTrails(hikeBtn, hikeFilter));
  // bikeBtn.addEventListener("click", filterTrails(bikeBtn, bikeFilter));

  //*********************************
  //           FUNCTIONS
  //*********************************

  // make selected trail type symbol wider
  // function filterTrails(radioButton, featureFilter) {
  function filterTrails(featureFilter) {
    trailsLayerView.featureEffect = new FeatureEffect({
      filter: featureFilter,
      includedEffect: "drop-shadow(3px, 3px, 3px, black)"
      // excludedEffect: "opacity(95%)"
    });
  }
});
