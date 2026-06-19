import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function BookReader() {
  const { id } = useParams();

  const [bookHtml, setBookHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchBook();

    if (user) {
      fetch(`http://localhost:5000/api/stories/view/${id}/${user.id}`, {
        method: "PUT",
      });
    }
  }, []);
  const fetchBook = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/stories/${id}`);

      const data = await res.json();

      const cleanedHtml = data.generatedBookHtml
        ?.replace(/<style[\s\S]*?<\/style>/gi, "")
        ?.replace(/text-shadow:[^;]+;/gi, "")
        ?.replace(/filter:[^;]+;/gi, "");

      setBookHtml(cleanedHtml || "");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <h3>Loading Book...</h3>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(90deg, #0b1020 0%, #161d35 50%, #0b1020 100%)",
        padding: "50px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#fdfcf8",
          padding: "60px",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
        }}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: bookHtml,
          }}
        />
      </div>
    </div>
  );
}
