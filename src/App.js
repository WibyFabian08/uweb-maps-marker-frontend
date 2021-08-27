import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import Swal from "sweetalert2";

import { createMarker, getMarkers } from "./api/markerApi";

import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

import { Room } from "@material-ui/icons";

import "./assets/css/style.css";
import CardInfo from "./components/CardInfo";
import InputText from "./elements/InputText";
import InputRating from "./elements/SelectInput";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import axios from "axios";
import { login, register } from "./api/authApi";

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

  const [activeUser, setActiveUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
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
  const [body, setBody] = useState({
    title: "",
    desc: "",
    rating: 0,
  });
  const [loginBody, setLoginBody] = useState({
    email: "",
    password: "",
  });
  const [registerBody, setRegisterBody] = useState({
    username: "",
    email: "",
    password: "",
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

  const handleLoginChange = (e) => {
    setLoginBody({
      ...loginBody,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterBody({
      ...registerBody,
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

  const handleRegister = () => {
    const data = {
      username: registerBody.username,
      email: registerBody.email,
      password: registerBody.password,
    };

    register(
      data,
      setShowRegister,
      setErrorMessage,
      setRegisterBody,
      registerBody
    );
  };

  const handleLogin = () => {
    const data = {
      email: loginBody.email,
      password: loginBody.password,
    };

    login(
      data,
      setErrorMessage,
      setActiveUser,
      setShowLogin,
      setLoginBody,
      loginBody
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setActiveUser(null);
  };

  const handleCreateMarker = (e) => {
    e.preventDefault();

    if (activeUser === null) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please Login to Create Marker",
      });
    }

    const data = {
      username: activeUser.username,
      title: body.title,
      long: newMarker.longitude,
      lat: newMarker.latitude,
      desc: body.desc,
      rating: body.rating,
    };

    createMarker(setNewMarker, setBody, data, body, setMarkers);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    setActiveUser(user);
  }, []);

  useEffect(() => {
    getMarkers(setMarkers);
  }, [activeUser]);

  return (
    <div className="relative w-screen h-screen">
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
        <div className="absolute top-0 right-0 p-5">
          <div className="flex items-center">
            {activeUser === null ? (
              <>
                <button
                  className="px-4 py-1 text-white bg-green-500 rounded-lg hover:bg-green-400"
                  onClick={() => setShowLogin(true)}
                >
                  Login
                </button>
                <button
                  className="px-4 py-1 ml-2 text-white bg-blue-400 rounded-lg hover:bg-blue-500"
                  onClick={() => setShowRegister(true)}
                >
                  Register
                </button>
              </>
            ) : (
              <button
                className="px-4 py-1 ml-2 text-white bg-red-400 rounded-lg hover:bg-red-500"
                onClick={() => handleLogout()}
              >
                Logout
              </button>
            )}
          </div>
        </div>
        <div
          className="absolute inset-0 z-20 transition-all duration-300 ease-in-out"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            transform: showLogin ? "scale(1)" : "scale(0)",
          }}
        >
          <div className="relative z-40 flex items-center justify-center w-full h-full">
            <LoginForm
              onClick={() => {
                setShowLogin(false);
                setLoginBody({
                  ...loginBody,
                  email: "",
                  password: "",
                });
              }}
              value={loginBody}
              onChange={(e) => handleLoginChange(e)}
              handleLogin={() => handleLogin()}
              errorMessage={errorMessage}
            ></LoginForm>
          </div>
        </div>
        <div
          className="absolute inset-0 z-20 transition-all duration-300 ease-in-out"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            transform: showRegister ? "scale(1)" : "scale(0)",
          }}
        >
          <div className="flex items-center justify-center w-full h-full">
            <RegisterForm
              onClick={() => {
                setShowRegister(false);
                setRegisterBody({
                  ...registerBody,
                  username: "",
                  email: "",
                  password: "",
                });
              }}
              value={registerBody}
              onChange={(e) => handleRegisterChange(e)}
              handleRegister={() => handleRegister()}
              errorMessage={errorMessage}
            ></RegisterForm>
          </div>
        </div>
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
                        marker.username === activeUser?.username
                          ? "tomato"
                          : "slateblue",
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
                    type="text"
                    placeholder="Title"
                    onChange={(e) => handleChange(e)}
                  ></InputText>
                  <InputText
                    value={body.desc}
                    name="desc"
                    type="text"
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
