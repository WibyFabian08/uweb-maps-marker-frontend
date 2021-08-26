import React, { useState, useRef, useCallback } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

import { format } from "timeago.js";

import { Room } from "@material-ui/icons";
import Rating from "@material-ui/lab/Rating";

import "./assets/css/style.css";
import { useEffect } from "react";
import axios from "axios";

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

  const createMarker = (e) => {
    e.preventDefault();
    const data = {
      username: activeUser,
      title: body.title,
      long: newMarker.longitude,
      lat: newMarker.latitude,
      desc: body.desc,
      rating: body.rating,
    };

    axios
      .post("http://localhost:3000/api/markers/create", data)
      .then((res) => {
        console.log(res.data);
        setNewMarker(null);
        setBody({
          ...body,
          title: "",
          desc: "",
          rating: "",
        });
      })
      .catch((err) => {
        console.log(err);
        setNewMarker(null);
        setBody({
          ...body,
          title: "",
          desc: "",
          rating: "",
        });
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/markers")
      .then((res) => {
        console.log(res.data);
        setMarkers(res.data.markers);
      })
      .catch((err) => {
        console.log(err?.response?.data?.message);
      });
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
              <>
                <Marker
                  key={index}
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
                    <div className="flex flex-col px-5">
                      <div className="flex flex-col mb-3">
                        <label
                          className="mb-1 text-sm"
                          style={{ color: "tomato" }}
                        >
                          Title
                        </label>
                        <h2>{marker?.title}</h2>
                      </div>
                      <div className="flex flex-col mb-3">
                        <label
                          className="mb-1 text-sm"
                          style={{ color: "tomato" }}
                        >
                          Description
                        </label>
                        <h2>{marker?.desc}</h2>
                      </div>
                      <div className="flex flex-col mb-3">
                        <label
                          className="mb-1 text-sm"
                          style={{ color: "tomato" }}
                        >
                          Created By:
                        </label>
                        <h2>{marker?.username}</h2>
                        <p className="text-xs" style={{ color: "tomato" }}>
                          {format(marker.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-col mb-3">
                        <label className="text-sm" style={{ color: "tomato" }}>
                          Rating
                        </label>
                        <Rating
                          name="simple-controlled"
                          value={marker?.rating}
                        />
                      </div>
                    </div>
                  </Popup>
                )}
              </>
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
              <form onSubmit={(e) => createMarker(e)}>
                <div className="flex flex-col">
                  <input
                    type="text"
                    name="title"
                    value={body.title}
                    onChange={(e) => handleChange(e)}
                    placeholder="title"
                    className="px-4 py-2 mb-3 border border-gray-300 rounded-lg borer-solid focus:outline-none"
                  />
                  <input
                    type="text"
                    name="desc"
                    value={body.desc}
                    onChange={(e) => handleChange(e)}
                    placeholder="desc"
                    className="px-4 py-2 mb-3 border border-gray-300 rounded-lg borer-solid focus:outline-none"
                  />
                  <select
                    name="rating"
                    value={body.rating}
                    onChange={(e) => handleChange(e)}
                    name="rating"
                    className="px-4 py-2 mb-3 border border-gray-300 rounded-lg borer-solid focus:outline-none"
                  >
                    <option value="">Rating</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
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
