// wetlands: 1966c4092d4841489cafa5365d053544
// slopes (10-20%): d46627e5f4dd4ca298575156d18d483

let editor;

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
  "esri/layers/support/FeatureEffect",
  "esri/widgets/Expand",
  "esri/widgets/support/SnappingControls",
  "esri/widgets/LayerList",
  "esri/widgets/Track",
  "esri/widgets/BasemapGallery",
  "esri/widgets/Legend"
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
  FeatureEffect,
  Expand,
  SnappingControls,
  LayerList,
  Track,
  BasemapGallery,
  Legend
) => {
  //*********************************
  // API KEY NEEDED FOR LOCATE BUTTON FUNCTIONALITY
  //*********************************
  esriConfig.apiKey =
    "AAPK6027c4c6c95b4b519c299cb7241fd1cacQ9_liBgjmYxcyyIkrLe0WjpWf9oGPt-VuUX05UqCy82EKlLp5v1nOibD7YOE__U";

  //*********************************
  // LAYER VARIABLES & SYMBOLOGY RENDERERS
  //*********************************

  // renders the lines for the trail types
  let commonPoperties = {
    type: "simple-line",
    width: "4px",
    style: "solid"
  };

  let trailRenderer = {
    type: "unique-value",
    field: "CATEGORY",
    uniqueValueInfos: [
      {
        value: "Hiking Access Trail",
        label: "Hike Access Trail",
        symbol: {
          ...commonPoperties,
          color: "red"
        }
      },
      {
        value: "Access Trail",
        label: "Access Trail",
        symbol: {
          ...commonPoperties,
          color: "blue"
        }
      },
      {
        value: "Hiking Trail",
        label: "Hiking Trail",
        symbol: {
          ...commonPoperties,
          color: "purple"
        }
      },
      {
        value: "Mtn Bike Trail",
        label: "Mtn Bike Trail",
        symbol: {
          ...commonPoperties,
          color: "chocolate"
        }
      },
      {
        value: "Access Road",
        label: "Access Road",
        symbol: {
          ...commonPoperties,
          color: "gray"
        }
      },
      {
        value: "Shared-Use Equestrian",
        label: "Shared-Use Equestrian",
        symbol: {
          ...commonPoperties,
          color: "forestgreen"
        }
      }
    ]
  };

  // trails layer
  const trails = new FeatureLayer({
    portalItem: {
      id: "f40494fb4e5d4a89991020c08a2b86e3"
    },
    title: "Trails by trail type",
    renderer: trailRenderer,
    definitionExpression: "PARKNAME = 'Elinor Klapp-Phipps Park'"
  });

  // Oak Haamock Loop layer
  const oakHammock = new FeatureLayer({
    portalItem: {
      id: "f033ef0158ae4222b4d568143824fefe"
    },
    title: "Oak Hammock Loop"
    // renderer: trailRenderer,
  });

  // renderer for park polygon layer
  const boundRenderer = {
    type: "simple",
    symbol: {
      type: "simple-fill",
      // color: [144, 238, 144, 0.95],
      color: null,
      outline: { width: 1.5, color: "darkslategray" }
    }
  };

  // park polygon layer
  const boundary = new FeatureLayer({
    portalItem: {
      id: "3b9e47ebad5742e98ca96a0a37e757d5"
    },
    title: "Park Boundary",
    definitionExpression: "PARKNAME = 'Elinor Klapp-Phipps Park'",
    renderer: boundRenderer,
    popupEnabled: false,
    listMode: "hide",
    legendEnabled: false
  });

  const contours = new FeatureLayer({
    portalItem: {
      id: "07dfaf9dd2fd484ab4ed54bbbcf55a9f"
    },
    title: "Contours",
    popupEnabled: false,
    visible: false,
    opacity: 0.5
  });

  const notesPopupTemplate = {
    // autocasts as new PopupTemplate()
    title: "Trail Notes",
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "Note",
            label: "Note"
          }
        ]
      }
    ]
  };

  // butterfly layer renderer
  const butterflyRenderer = {
    type: "simple",
    symbol: {
      type: "picture-marker",
      url: "littleButterfly.png",
      width: 25,
      height: 25
    }
  };

  // butterfly sighting layer (user editable)
  const notes = new FeatureLayer({
    portalItem: {
      id: "e1a2bc5263e64bbba407e356f818e55a"
    },
    title: "Butterfly sightings",
    popupTemplate: notesPopupTemplate,
    popupEnabled: true,
    visible: false,
    renderer: butterflyRenderer
  });

  // slopes
  const slopes = new FeatureLayer({
    portalItem: {
      id: "d46627e5f4dd4ca298575156d18d4834"
    },
    title: "Significant & Severe Slopes",
    popupEnabled: false,
    visible: false,
    opacity: 0.4
  });

  // wetlands
  const wetlands = new FeatureLayer({
    portalItem: {
      id: "1966c4092d4841489cafa5365d053544"
    },
    title: "Wetlands",
    popupEnabled: false,
    visible: false
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
    // basemap: "gray-vector",
    basemap: "arcgis-midcentury",
    layers: [slopes, wetlands, boundary, contours, oakHammock, trails, notes]
  });

  // mapView
  const view = new MapView({
    map: map,
    container: "viewDiv",
    zoom: 14,
    // scale: 9000,
    // center: [-84.29, 30.5305],
    center: [-84.29, 30.531]
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
    if (notes.title === "Trail Notes") {
      notesEditConfig = {
        layer: notes,
        formTemplate: {
          elements: [
            // { type: "field", fieldName: "noteType", label: "Note Type" },
            { type: "field", fieldName: "Note", label: "Note" }
          ]
        }
      };
    }
  });

  //*********************************
  // CREATE WIDGETS
  //*********************************
  const home = new Home({ view: view });
  //const zoom = new Zoom({ view: view });
  // const basemapToggle = new BasemapToggle({
  //   view: view,
  //   nextBasemap: "streets-vector"
  // });
  const basemapGallery = new BasemapGallery({
    view: view
  });
  const layerList = new LayerList({
    view: view
  });
  editor = new Editor({
    id: "editor",
    view: view,
    layerInfos: [{ layer: notesEditConfig, updateEnabled: false }],
    // TO DO - this isn't eliminating the snapping options
    snappingOptions: { visible: false },
    allowedWorkflows: ["create"],
    visible: false
    // snappingControls: { visible: false }
  });
  const locate = new Locate({
    view: view,
    // set to false so it doesn't change rotation of the map
    useHeadingEnabled: false,
    // set custom zoom functionality
    goToOverride: function (view, options) {
      options.target.scale = 1500;
      return view.goTo(options.target);
    },
    id: "locate"
  });

  const track = new Track({
    view: view
  });

  const legend = new Legend({
    view: view
  });

  //*********************************
  // infoPanel
  //*********************************

  const parkURL =
    "<a href='https://www.talgov.com/parks/parks-phipps'>park webpage</a>";
  const infoText = `<p>Elinor Klapp-Phipps Park is owned by the Northwest Florida Water Management District and managed by the City of Tallahassee. This app is not affiliated with either entity, but does use official, publicly availble GIS information for the trails. It is intended for free, public use.</p> 
  <p>The park is known to host over a hundred different butterfly species. Users are welcome to add points where they have seen butterflies by clicking the layers button (3 lines in the upper left of the screen) and turn on the "Butterfly sighting" layer. Then click the butterfly in the bottom right of the screen & click the "New Feature" button.</p>
  <p>Check out the official City of Tallahassee ${parkURL} for more information and resources, including an infosheet for the 20 most commonly seen butterflies.</p>`;

  infoPanel = new Expand({
    expandIconClass: "esri-icon-description",
    expandTooltip: "Information",
    view: view,
    content: infoText,
    id: "infoPanel"
  });

  //*********************************
  // ADD FUNCTIONALITY TO EXPAND Editor WINDOW
  //*********************************
  editExpand = new Expand({
    expandTooltip: "Add a butterfly sighting!",
    view: view,
    content: editor,
    id: "butterfly"
  });

  editButton = document.getElementById("editButton");

  //*********************************
  // ADD FUNCTIONALITY TO EXPAND LayerList WIDGET
  //*********************************
  layersExpand = new Expand({
    expandIconClass: "esri-icon-layer-list",
    expandTooltip: "Layers",
    view: view,
    content: layerList,
    id: "layers"
  });

  //*********************************
  // ADD FUNCTIONALITY TO EXPAND BasemapGallery WIDGET
  //*********************************
  basemapsExpand = new Expand({
    expandIconClass: "esri-icon-basemap",
    expandTooltip: "Basemaps",
    view: view,
    content: basemapGallery
  });

  //*********************************
  // ADD FUNCTIONALITY TO EXPAND Legend WIDGET
  //*********************************
  legendExpand = new Expand({
    expandIconClass: "esri-icon-legend",
    expandTooltip: "Legend",
    view: view,
    content: legend
  });

  //*********************************
  // ADD ALL WIDGETS TO USER INTERFACE
  //*********************************
  view.ui.empty("top-left");
  //view.ui.add(zoom, "top-right");
  view.ui.add(infoPanel, "top-left");
  view.ui.add(layersExpand, "top-left");
  // view.ui.add(basemapToggle, "top-right");
  view.ui.add(home, "top-right");
  view.ui.add(basemapsExpand, "top-right");
  view.ui.add(legendExpand, "top-right");
  // view.ui.add(editExpand, "bottom-right");
  view.ui.add(editButton, "bottom-right");
  view.ui.add(editor, "bottom-right");
  view.ui.add(locate, "bottom-left");
  view.ui.add(track, "bottom-left");

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

  const noFilter = {
    where:
      // "CATEGORY='Shared-Use Equestrian' or CATEGORY='Hiking Trail' or CATEGORY='Hiking Access Trail' or CATEGORY='Mtn Bike Trail' or CATEGORY='Access Road' or CATEGORY='Access Trail'"
      "CATEGORY in ('Shared-Use Equestrian', 'Hiking Trail', 'Hiking Access Trail', 'Mtn Bike Trail', 'Access Road', 'Access Trail')"
  };
  const sharedFilter = {
    where: "CATEGORY='Shared-Use Equestrian'"
  };
  const hikeFilter = {
    where: "CATEGORY='Hiking Trail' or CATEGORY='Hiking Access Trail'"
  };
  const bikeFilter = {
    where: "CATEGORY='Mtn Bike Trail'"
  };
  const accessFilter = {
    where:
      "CATEGORY='Access Trail' or CATEGORY='Hiking Access Trail' or CATEGORY='Access Road'"
  };

  //*********************************
  // EVENT LISTENER FOR RADIO BUTTONS
  //*********************************
  //TO DO - set radio buttons initial state to unchecked
  // Chrome sets them that way, but some browsers (i.e., Firefox) appear to autocheck the first one
  document.getElementById("filterDiv").addEventListener("change", (event) => {
    let target = event.target;
    switch (target.id) {
      case "noFilter":
        filterTrails(noFilter);
        break;
      case "shared":
        filterTrails(sharedFilter);
        break;
      case "hike":
        filterTrails(hikeFilter);
        break;
      case "bike":
        filterTrails(bikeFilter);
        break;
      case "access":
        filterTrails(accessFilter);
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
    if (featureFilter != noFilter) {
      trailsLayerView.featureEffect = new FeatureEffect({
        filter: featureFilter,
        includedEffect: "drop-shadow(3px 3px 3px)",
        excludedEffect: "opacity(35%) grayscale(25%)"
      });
    } else {
      // this is the 'noFilter' reset so no effect is applied
      trailsLayerView.featureEffect = new FeatureEffect({
        filter: featureFilter,
        excludedEffect: ""
      });
    }
  }

  // tests to change text in the Edit Widget
  const snapElement = document.getElementsByClassName(
    "esri-editor__panel-toolbar"
  );
  snapElement.innerHTML = "new text";

  const editPanel = document.getElementsByClassName(
    "esri-editor__panel-content__section"
  );
  editPanel.innerHTML = "BIg ol test";
});

// hide/unhide editor (outside of view object scope so accessible to index.html)
function toggleEdit() {
  editBtnStyle = document.getElementById("editButton").style;
  if (editor.visible == false) {
    editor.visible = true;
    editBtnStyle.backgroundImage = "url(close-icon.png)";
    editBtnStyle.width = "26px";
    editBtnStyle.height = "26px";
  } else {
    editor.visible = false;
    editBtnStyle.backgroundImage = "url(purpleButterfly.png)";
    editBtnStyle.width = "50px";
    editBtnStyle.height = "50px";
  }
}

// const editFunction = function () {
//   return function toggleEdit() {
//     if (editor.visible == false) {
//       editor.visible = true;
//     } else {
//       editor.visible = false;
//     }
//   };
// };
