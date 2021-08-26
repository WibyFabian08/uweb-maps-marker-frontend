import React, { useState, useRef, useCallback } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'

import { Room } from "@material-ui/icons";

import "./assets/css/style.css";

function App() {
  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides,
      });
    },
    [handleViewportChange]
  );

  const [newMarker, setNewMarker] = useState(null);
  const [viewport, setViewport] = useState({
    width: 400,
    height: 400,
    latitude: -7.227906,
    longitude: 107.908699,
    zoom: 14,
  });

  const addMarker = (e) => {
    const [longitude, latitude] = e.lngLat;
    setNewMarker({
      latitude,
      longitude,
    });
  };

  return (
    <div className="w-screen h-screen">
      <ReactMapGL
        {...viewport}
        ref={mapRef}
        width="100%"
        height="100%"
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_KEY}
        mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
        transitionDuration={100}
        onDblClick={(e) => {
          console.log(e);
          addMarker(e);
        }}
      >
        <Geocoder
          mapRef={mapRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_KEY}
          position="top-left"
        />
        {newMarker && (
          <>
            <Marker
              latitude={newMarker && newMarker.latitude}
              longitude={newMarker && newMarker.longitude}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <Room style={{ color: "tomato" }}></Room>
            </Marker>
            <Popup
              latitude={newMarker && newMarker.latitude}
              longitude={newMarker && newMarker.longitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setNewMarker(null)}
              anchor="left"
            >
              <div>You are here</div>
            </Popup>
          </>
        )}
      </ReactMapGL>
    </div>
  );
}

export default App;
