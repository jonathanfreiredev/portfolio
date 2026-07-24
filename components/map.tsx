"use client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 41],
});

L.Marker.mergeOptions({ icon: DefaultIcon });

export default function Map() {
  return (
    <MapContainer
      center={[52.52, 13.405]} // Berlin
      zoom={13}
      className="h-full w-full"
    >
      <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />

      <Marker position={[52.52, 13.405]}>
        <Popup>Berlin</Popup>
      </Marker>
    </MapContainer>
  );
}
