import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function LiveLocationMap({ lat = 21.1458, lng = 79.0882, label = 'Emergency Location' }) {
  return (
    <div className="h-72 w-full rounded-xl overflow-hidden border border-border-subtle z-0">
      <MapContainer center={[lat, lng]} zoom={14} className="h-full w-full">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>
            <span className="font-semibold text-xs">{label}</span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}