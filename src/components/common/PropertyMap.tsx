import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, ExternalLink, Compass, Layers, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Safe default coordinates for Quetta city center
export const DEFAULT_QUETTA_COORDS: [number, number] = [30.1798, 66.9750];

// Custom HTML Pin Icon with pulse ring - fully self-contained, no external asset 404s
export const createCustomPin = (label?: string, color: string = '#52796f') => {
  return L.divIcon({
    className: 'custom-leaflet-marker-container',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
        <div style="
          width: 38px;
          height: 38px;
          background: ${color};
          border: 2.5px solid #ffffff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.35);
          cursor: pointer;
        ">
          <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        </div>
        ${label ? `
          <span style="
            background: #2f3e46;
            color: #ffffff;
            font-family: ui-sans-serif, system-ui, sans-serif;
            font-size: 11px;
            font-weight: 600;
            padding: 2px 8px;
            border-radius: 6px;
            margin-top: 4px;
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
            border: 1px solid rgba(255,255,255,0.2);
          ">${label}</span>
        ` : ''}
      </div>
    `,
    iconSize: [38, 54],
    iconAnchor: [19, 38],
    popupAnchor: [0, -40]
  });
};

// Map Recenter Controller
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Click listener for interactive coordinate picking
function MapClickListener({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)));
      }
    }
  });
  return null;
}

// Available Free / Open Map Tile Providers (Extensible architecture)
export const MAP_PROVIDERS = [
  {
    id: 'osm-standard',
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
  },
  {
    id: 'carto-light',
    name: 'Clean Light (CARTO)',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  {
    id: 'osm-hot',
    name: 'OSM Humanitarian',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by Humanitarian OpenStreetMap Team'
  }
];

export interface PropertyMapProps {
  latitude?: number;
  longitude?: number;
  title?: string;
  address?: string;
  city?: string;
  areaBlock?: string;
  priceFormatted?: string;
  zoom?: number;
  height?: string;
  interactive?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
  showCardHeader?: boolean;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  latitude,
  longitude,
  title,
  address = 'Quetta, Balochistan',
  city = 'Quetta',
  areaBlock = '',
  priceFormatted,
  zoom = 15,
  height = '360px',
  interactive = true,
  onLocationSelect,
  showCardHeader = true
}) => {
  const { t } = useLanguage();
  const [activeProviderIndex, setActiveProviderIndex] = useState(0);

  // Validate coordinates
  const hasValidCoords =
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    !isNaN(latitude) &&
    !isNaN(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !(latitude === 0 && longitude === 0);

  const activeCoords: [number, number] = hasValidCoords
    ? [latitude, longitude]
    : DEFAULT_QUETTA_COORDS;

  const currentProvider = MAP_PROVIDERS[activeProviderIndex];

  // Standard external links (No Google Maps API or key needed)
  const externalGoogleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${activeCoords[0]},${activeCoords[1]}`;
  const externalOsmUrl = `https://www.openstreetmap.org/?mlat=${activeCoords[0]}&mlon=${activeCoords[1]}#map=16/${activeCoords[0]}/${activeCoords[1]}`;

  const markerIcon = createCustomPin(areaBlock || 'BSA');

  const cycleMapProvider = () => {
    setActiveProviderIndex((prev) => (prev + 1) % MAP_PROVIDERS.length);
  };

  return (
    <div className="bg-white dark:bg-[#2f3e46] border border-[#cad2c5]/80 dark:border-[#354f52] rounded-2xl overflow-hidden shadow-xs">
      {showCardHeader && (
        <div className="p-5 border-b border-[#cad2c5]/60 dark:border-[#354f52] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#2f3e46] dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#52796f] dark:text-[#84a98c]" />
                <span>{t('locationOnMap')}</span>
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#52796f]/15 text-[#52796f] dark:text-[#84a98c]">
                OpenStreetMap
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#cad2c5] mt-1">
              {address}{areaBlock ? `, ${areaBlock}` : ''}{city ? `, ${city}` : ''}, Balochistan
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Tile Layer Toggle */}
            <button
              type="button"
              onClick={cycleMapProvider}
              title={`Switch Map Style (Currently: ${currentProvider.name})`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-[#1f2b30] dark:hover:bg-[#354f52] text-[#2f3e46] dark:text-white border border-[#cad2c5]/60 dark:border-[#354f52] transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#52796f]" />
              <span className="hidden sm:inline">{currentProvider.name}</span>
            </button>

            {/* External Google Maps link (No API needed) */}
            <a
              href={externalGoogleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#52796f] hover:bg-[#3f5f57] text-white transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-[#cad2c5]" />
              <span>{t('openGoogleMaps')}</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>

            {/* External OpenStreetMap link */}
            <a
              href={externalOsmUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="View on OpenStreetMap"
              className="inline-flex items-center justify-center p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1f2b30] transition-colors"
            >
              <Compass className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* Fallback Warning if coordinates were not specified */}
      {!hasValidCoords && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 px-4 py-2 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            Exact coordinates not provided. Showing approximate area on Quetta central map.
          </span>
        </div>
      )}

      {/* Map Container */}
      <div className="relative w-full overflow-hidden" style={{ height }}>
        <MapContainer
          center={activeCoords}
          zoom={hasValidCoords ? zoom : 13}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', zIndex: 10 }}
        >
          <ChangeView center={activeCoords} zoom={hasValidCoords ? zoom : 13} />
          
          {onLocationSelect && <MapClickListener onLocationSelect={onLocationSelect} />}

          <TileLayer
            attribution={currentProvider.attribution}
            url={currentProvider.url}
            maxZoom={19}
          />

          <Marker position={activeCoords} icon={markerIcon}>
            <Popup>
              <div className="p-1 min-w-[200px] text-[#2f3e46]">
                {title && (
                  <h4 className="font-bold text-sm text-[#2f3e46] leading-tight mb-1">
                    {title}
                  </h4>
                )}
                {priceFormatted && (
                  <p className="font-extrabold text-[#52796f] text-sm mb-1">
                    {priceFormatted}
                  </p>
                )}
                <p className="text-xs text-slate-600 mb-2">
                  {address}{areaBlock ? `, ${areaBlock}` : ''}, Quetta
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                  <span>Lat: {activeCoords[0].toFixed(4)}</span>
                  <span>Lng: {activeCoords[1].toFixed(4)}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Location Badge Overlay */}
        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 dark:bg-[#1f2b30]/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#cad2c5] dark:border-[#354f52] text-xs font-semibold text-[#2f3e46] dark:text-white shadow-md flex items-center gap-2 pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-[#52796f] animate-ping"></div>
          <span>{areaBlock ? `${areaBlock}, Quetta` : (city || 'Quetta, Balochistan')}</span>
        </div>
      </div>
    </div>
  );
};
