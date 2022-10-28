require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/widgets/Home",
  "esri/widgets/Zoom",
  "esri/widgets/Editor",
], (Map, MapView, FeatureLayer, Home, Zoom, Editor) => {
  //*********************************
  // CREATE LAYER VARIABLES
  //*********************************
  // trails layer
  const trails = new FeatureLayer({
    portalItem: {
      id: "f40494fb4e5d4a89991020c08a2b86e3",
    },
    title: "Trails",
    definitionExpression: "PARKNAME = 'Elinor Klapp-Phipps Park'",
  });

  // define renderer for boundary symbology
  const boundRenderer = {
    type: "simple",
    symbol: {
      type: "simple-fill",
      color: [144, 238, 144, 0.5],
      outline: { width: 2, color: "orange" },
    },
  };

  // park polygon layer
  const boundary = new FeatureLayer({
    portalItem: {
      id: "3b9e47ebad5742e98ca96a0a37e757d5",
    },
    title: "Park Boundary",
    definitionExpression: "PARKNAME = 'Elinor Klapp-Phipps Park'",
    renderer: boundRenderer,
  });

  //*********************************
  // CREATE MAP OBJECTS
  //*********************************
  // map
  const map = new Map({
    // use this for a custom basemap
    // basemap: {
    //     portalItem: {
    //       id: "4f2e99ba65e34bb8af49733d9778fb8e",
    //     },
    basemap: "gray-vector",
    layers: [boundary, trails],
  });

  // mapView
  const view = new MapView({
    map: map,
    container: "viewDiv",
    zoom: 14,
    // scale: 9000,
    center: [-84.29, 30.5305],
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
  const editor = new Editor({ view: view });
  const home = new Home({ view: view });
  const zoom = new Zoom({ view: view });

  //*********************************
  // DEFINE EDITOR FUNCTIONALITY
  //*********************************

  //*********************************
  // ADD WIDGETS TO USER INTERFACE
  //*********************************
  view.ui.empty("top-left");
  // view.ui.add(titleDiv, "top-left");
  view.ui.add(editor, "top-left");
  view.ui.add(home, "top-right");
  view.ui.add(zoom, "top-right");
});
