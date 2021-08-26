import React from "react";
import { format } from "timeago.js";
import Rating from "@material-ui/lab/Rating";

const CardInfo = ({marker}) => {
  return (
    <div className="flex flex-col px-5">
      <div className="flex flex-col mb-3">
        <label className="mb-1 text-sm" style={{ color: "tomato" }}>
          Title
        </label>
        <h2>{marker?.title}</h2>
      </div>
      <div className="flex flex-col mb-3" style={{ maxWidth: "300px" }}>
        <label className="mb-1 text-sm" style={{ color: "tomato" }}>
          Description
        </label>
        <h2>{marker?.desc}</h2>
      </div>
      <div className="flex flex-col mb-3">
        <label className="mb-1 text-sm" style={{ color: "tomato" }}>
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
        <Rating name="simple-controlled" value={marker?.rating} />
      </div>
    </div>
  );
};

export default CardInfo;
