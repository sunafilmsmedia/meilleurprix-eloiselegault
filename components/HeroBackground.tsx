"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { BRAND } from "@/lib/brand";

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });

// Centre de la carte décorative du hero (configuré par déploiement).
const MAP_CENTER: [number, number] = BRAND.map.center;

// La carte est montée dans un conteneur en fondu (absolute) : Leaflet calcule
// sa taille avant que le conteneur ait ses dimensions finales et affiche des
// tuiles pour un viewport de taille 0. On force le recalcul après le montage.
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timers = [80, 300, 700].map((d) => setTimeout(() => map.invalidateSize(), d));
    return () => timers.forEach(clearTimeout);
  }, [map]);
  return null;
}

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="map-mono map-no-interaction absolute inset-0">
        <MapContainer
          center={MAP_CENTER}
          zoom={BRAND.map.zoom}
          zoomControl={false}
          attributionControl={true}
          dragging={false}
          touchZoom={false}
          doubleClickZoom={false}
          scrollWheelZoom={false}
          boxZoom={false}
          keyboard={false}
          style={{ width: "100%", height: "100%" }}
        >
          {/* Esri « World Street Map » : sans clé d'API et sans filigrane.
              Le rendu est coloré : c'est le filtre .map-mono qui le désature. */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; Esri, HERE, Garmin, &copy; OpenStreetMap"
          />
          <MapResizer />
        </MapContainer>
      </div>

      {/* Voile blanc : la carte reste perceptible, le titre parfaitement lisible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.68) 45%, rgba(255,255,255,0) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.12) 28%, rgba(255,255,255,0.12) 68%, rgba(234,247,254,1) 100%)",
        }}
      />
    </div>
  );
}
