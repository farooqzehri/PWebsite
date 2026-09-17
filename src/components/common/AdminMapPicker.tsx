import React from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Crosshair, Navigation, Info } from 'lucide-react';
import { createCustomPin, DEFAULT_QUETTA_COORDS } from './PropertyMap';

export interface AdminMapPickerProps {
  latitude: number | undefined;
  longitude: number | undefined;
  onChange: (lat: number, lng: number) => void;
  areaBlock?: string;
}

// Prominent Quetta area coordinate presets
export const QUETTA_PRESETS = [
  { name: 'Satellite Town', lat: 30.1685, lng: 66.9950 },
  { name: 'Jinnah Town', lat: 30.1895, lng: 66.9850 },
  { name: 'Samungli Road', lat: 30.1798, lng: 66.9750 },
  { name: 'Zarghoon Road', lat: 30.1980, lng: 67.0120 },
  { name: 'Airport Road', lat: 30.2200, lng: 67.0180 },
  { name: 'Brewery Road', lat: 30.1550, lng: 66.9650 },
  { name: 'Cantt Quetta', lat: 30.2050, lng: 67.0250 },
  { name: 'Chaman Housing', lat: 30.2100, lng: 67.0350 }
];

function RecenterMap({ coords }: { coords: [number, number] }) {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(coords, map.getZoom() || 14);
  }, [coords, map]);
  return null;
}

function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)));
    }
  });
  return null;
}

export const AdminMapPicker: React.FC<AdminMapPickerProps> = ({
  latitude,
  longitude,
  onChange,
  areaBlock
}) => {
  const isValid =
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    !isNaN(latitude) &&
    !isNaN(longitude);

  const currentCoords: [number, number] = isValid
    ? [latitude!, longitude!]
    : DEFAULT_QUETTA_COORDS;

  const pinIcon = createCustomPin('Location Pin', '#2f3e46');

  return (
    <div className="space-y-3 rounded-xl border border-[#cad2c5]/80 dark:border-[#354f52] p-4 bg-slate-50 dark:bg-[#1f2b30]/60">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs font-bold text-[#2f3e46] dark:text-white flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#52796f]" />
          <span>Geographic Coordinates (OpenStreetMap / GPS)</span>
        </label>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Crosshair className="w-3 h-3 text-[#52796f]" />
          Click anywhere on map to position pin
        </span>
      </div>

      {/* Preset Buttons for Quick Quetta Sector Selection */}
      <div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
          Quick Quetta Sector Presets:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {QUETTA_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => onChange(preset.lat, preset.lng)}
              className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                isValid &&
                Math.abs(latitude! - preset.lat) < 0.005 &&
                Math.abs(longitude! - preset.lng) < 0.005
                  ? 'bg-[#52796f] text-white border-[#52796f]'
                  : 'bg-white dark:bg-[#2f3e46] text-[#2f3e46] dark:text-slate-200 border-[#cad2c5] dark:border-[#354f52] hover:border-[#52796f]'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Manual Input Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
            Latitude (e.g. 30.1685)
          </label>
          <input
            type="number"
            step="0.0001"
            placeholder="30.1685"
            value={latitude !== undefined ? latitude : ''}
            onChange={(e) => {
              const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
              onChange(val || 0, longitude || DEFAULT_QUETTA_COORDS[1]);
            }}
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#cad2c5] dark:border-[#354f52] bg-white dark:bg-[#2f3e46] text-[#2f3e46] dark:text-white outline-none focus:border-[#52796f]"
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
            Longitude (e.g. 66.9950)
          </label>
          <input
            type="number"
            step="0.0001"
            placeholder="66.9950"
            value={longitude !== undefined ? longitude : ''}
            onChange={(e) => {
              const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
              onChange(latitude || DEFAULT_QUETTA_COORDS[0], val || 0);
            }}
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#cad2c5] dark:border-[#354f52] bg-white dark:bg-[#2f3e46] text-[#2f3e46] dark:text-white outline-none focus:border-[#52796f]"
          />
        </div>
      </div>

      {/* Interactive Map */}
      <div className="relative h-[220px] rounded-xl overflow-hidden border border-[#cad2c5] dark:border-[#354f52] shadow-inner">
        <MapContainer
          center={currentCoords}
          zoom={14}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', zIndex: 5 }}
        >
          <RecenterMap coords={currentCoords} />
          <ClickHandler onClick={onChange} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          <Marker position={currentCoords} icon={pinIcon} />
        </MapContainer>

        <div className="absolute top-2 right-2 z-[400] bg-white/90 dark:bg-[#2f3e46]/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-semibold text-[#2f3e46] dark:text-white border border-slate-200 dark:border-slate-700 pointer-events-none">
          Click map to pin
        </div>
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5 shrink-0 text-[#52796f]" />
        <span>
          Powered by OpenStreetMap. No Google Maps API key or paid license required.
        </span>
      </p>
    </div>
  );
};
