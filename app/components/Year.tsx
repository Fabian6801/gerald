"use client";
import { useEffect, useState } from "react";

export default function Year() {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);

  return <span>{year}</span>;
}