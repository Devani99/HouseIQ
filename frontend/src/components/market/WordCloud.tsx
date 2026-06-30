console.log("WordCloud Rendered");

import { useEffect, useState } from "react";
import api from "@/lib/api";

type Props = {
    city: string;
    locality: string;
};

export default function WordCloud({ city, locality }: Props) {
  const [image, setImage] = useState("");

  useEffect(() => {

    console.log("Calling WordCloud API");

    api.get("/wordcloud", {
        params: {
            city,
            locality
        }
    })
    .then(res => {
        console.log(res.data);
        setImage(res.data.image);
    })
    .catch(err => console.log(err));

}, [city, locality]);

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <h2 className="mb-4 text-xl font-bold">Top Amenities</h2>

      {image ? (
        <img
          src={`data:image/png;base64,${image}`}
          alt="Word Cloud"
          className="mx-auto w-full max-w-4xl rounded-xl"
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}