require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/views/layers/LayerView",
  "esri/widgets/Home",
  "esri/widgets/Zoom",
  "esri/widgets/BasemapToggle",
  "esri/widgets/Editor",
  "esri/widgets/Locate",
  "esri/layers/support/FeatureEffect"
], (
  esriConfig,
  Map,
  MapView,
  FeatureLayer,
  LayerView,
  Home,
  Zoom,
  BasemapToggle,
  Editor,
  Locate,
  FeatureEffect
) => {
  //*********************************
  // API KEY NEEDED FOR LOCATE BUTTON FUNCTIONALITY
  //*********************************
  esriConfig.apiKey =
    "AAPK6027c4c6c95b4b519c299cb7241fd1cacQ9_liBgjmYxcyyIkrLe0WjpWf9oGPt-VuUX05UqCy82EKlLp5v1nOibD7YOE__U";

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

  // renderer for park polygon layer
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

  // notes layer (user editable)
  const notes = new FeatureLayer({
    portalItem: {
      id: "e1a2bc5263e64bbba407e356f818e55a"
    },
    title: "Notes"
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
    layers: [trails, boundary, notes]
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
  // CONFIGURE EDITOR WIDGET
  //*********************************
  // variable to hold configuration parameters
  let notesEditConfig;
  /* access layer using forEach(); Editor layerInfo docs just show all this under the new Editor properties with out the forEach(), but that resulted in an empty editor element; this method is from one of the samples for multiple configurations within one widget)*/
  view.map.layers.forEach((notes) => {
    if (notes.title === "Notes") {
      notesEditConfig = {
        layer: notes,
        formTemplate: {
          elements: [{ type: "field", fieldName: "Notes", label: "Notes" }]
        }
      };
    }
  });

  //*********************************
  // CREATE WIDGETS
  //*********************************
  const home = new Home({ view: view });
  //const zoom = new Zoom({ view: view });
  const basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: "streets-vector"
  });
  const editor = new Editor({
    view: view,
    layerInfos: [{ layer: notesEditConfig }],
    // TO DO - this isn't eliminating the snapping options
    snappingOptions: { enabled: false }
    // widgetVisible: false
  });
  const locate = new Locate({
    view: view,
    // set to false so it doesn't change rotation of the map
    useHeadingEnabled: false,
    // set custom zoom functionality
    goToOverride: function (view, options) {
      options.target.scale = 1500;
      return view.goTo(options.target);
    }
  });

  //*********************************
  // ADD ALL WIDGETS TO USER INTERFACE
  //*********************************
  view.ui.empty("top-left");
  view.ui.add(home, "top-right");
  //view.ui.add(zoom, "top-right");
  view.ui.add(basemapToggle, "top-right");
  view.ui.add(editor, "top-left");
  view.ui.add(locate, "bottom-left");

  //*********************************
  // CREATE 'trails' LAYERVIEW OBJECT TO FILTER BY TRAIL TYPE
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
  // VARIABLES FOR EACH TRAIL TYPE FILTER
  //*********************************
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
  //TO DO - set radio buttons initial state to unchecked
  // Chrome sets them that way, but some browsers (i.e., Firefox) appear to autocheck the first one
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
