import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";

import { createMarker, getMarkers } from "./api/markerApi";

import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

import { Room } from "@material-ui/icons";

import "./assets/css/style.css";
import CardInfo from "./components/CardInfo";
import InputText from "./elements/InputText";
import InputRating from "./elements/SelectInput";

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

  const [activeUser, setActiveUser] = useState("Steven Gerrard");
  const [body, setBody] = useState({
    title: "",
    desc: "",
    rating: 0,
  });
  const [newMarker, setNewMarker] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [currentMarkerId, setCurrentMarkerId] = useState(null);
  const [viewport, setViewport] = useState({
    width: 400,
    height: 400,
    latitude: -7.227906,
    longitude: 107.908699,
    zoom: 14,
  });

  const hanldeMarkerClick = (id, lat, long) => {
    setCurrentMarkerId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handleChange = (e) => {
    setBody({
      ...body,
      [e.target.name]: e.target.value,
    });
  };

  const addMarker = (e) => {
    const [longitude, latitude] = e.lngLat;
    setNewMarker({
      latitude,
      longitude,
    });
  };

  const handleCreateMarker = (e) => {
    e.preventDefault();
    const data = {
      username: activeUser,
      title: body.title,
      long: newMarker.longitude,
      lat: newMarker.latitude,
      desc: body.desc,
      rating: body.rating,
    };

    createMarker(setNewMarker, setBody, data, body, setMarkers);
  };

  useEffect(() => {
    getMarkers(setMarkers);
  }, []);

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
        transitionDuration={200}
        onDblClick={(e) => {
          addMarker(e);
        }}
      >
        <Geocoder
          mapRef={mapRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_KEY}
          position="top-left"
        />
        {markers &&
          markers.map((marker, index) => {
            return (
              <div key={index}>
                <Marker
                  latitude={marker?.lat}
                  longitude={marker?.long}
                  offsetLeft={-2 * viewport.zoom}
                  offsetTop={-4 * viewport.zoom}
                >
                  <Room
                    style={{
                      color:
                        marker.username === activeUser ? "tomato" : "slateblue",
                      fontSize: 4 * viewport.zoom,
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      hanldeMarkerClick(marker._id, marker?.lat, marker?.long)
                    }
                  ></Room>
                </Marker>
                {currentMarkerId === marker._id && (
                  <Popup
                    latitude={marker?.lat}
                    longitude={marker?.long}
                    closeButton={true}
                    closeOnClick={false}
                    onClose={() => setCurrentMarkerId(null)}
                    anchor="left"
                  >
                    <CardInfo marker={marker}></CardInfo>
                  </Popup>
                )}
              </div>
            );
          })}
        {newMarker && (
          <>
            <Marker
              latitude={newMarker && newMarker.latitude}
              longitude={newMarker && newMarker.longitude}
              offsetLeft={-2 * viewport.zoom}
              offsetTop={-4 * viewport.zoom}
            >
              <Room
                style={{
                  color: "tomato",
                  fontSize: 4 * viewport.zoom,
                  cursor: "pointer",
                }}
              ></Room>
            </Marker>
            <Popup
              latitude={newMarker && newMarker.latitude}
              longitude={newMarker && newMarker.longitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setNewMarker(null)}
              anchor="left"
            >
              <form method="POST" onSubmit={(e) => handleCreateMarker(e)}>
                <div className="flex flex-col">
                  <InputText
                    value={body.title}
                    name="title"
                    placeholder="Title"
                    onChange={(e) => handleChange(e)}
                  ></InputText>
                  <InputText
                    value={body.desc}
                    name="desc"
                    placeholder="Desc"
                    onChange={(e) => handleChange(e)}
                  ></InputText>
                  <InputRating
                    name="rating"
                    value={body.rating}
                    onChange={(e) => handleChange(e)}
                  ></InputRating>
                  <button
                    type="submit"
                    className="py-2 text-white transition-all duration-300 bg-indigo-700 rounded-lg hover:bg-indigo-600"
                  >
                    Marked
                  </button>
                </div>
              </form>
            </Popup>
          </>
        )}
      </ReactMapGL>
    </div>
  );
}

export default App;
