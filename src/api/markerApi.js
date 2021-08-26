import axios from "axios";

export const getMarkers = (setMarkers) => {
  axios
    .get("http://localhost:3000/api/markers")
    .then((res) => {
      setMarkers(res.data.markers);
    })
    .catch((err) => {
      console.log(err?.response?.data?.message);
    });
};

export const createMarker = (setNewMarker, setBody, data, body, setMarkers) => {
  axios
    .post("http://localhost:3000/api/markers/create", data)
    .then((res) => {
      setNewMarker(null);
      setBody({
        ...body,
        title: "",
        desc: "",
        rating: "",
      });
      axios
        .get("http://localhost:3000/api/markers")
        .then((res) => {
          setMarkers(res.data.markers);
        })
        .catch((err) => {
          console.log(err?.response?.data?.message);
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
