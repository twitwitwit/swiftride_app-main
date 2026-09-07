import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationPoint, VehicleCategory } from '../../types';
import { Layers, Compass, Plus, Minus, Sparkles, Navigation, MapPin } from 'lucide-react';

interface InteractiveMapProps {
  pickup?: LocationPoint;
  dropoff?: LocationPoint;
  routeProgress?: number; // 0 to 100
  showNearbyDrivers?: boolean;
  vehicleType?: VehicleCategory;
  driverName?: string;
  driverPlate?: string;
  height?: string;
  className?: string;
  interactive?: boolean;
  onSelectLocation?: (location: LocationPoint) => void;
}

// Free Tile Layer Options (100% Free, zero API key required)
const TILE_LAYERS = {
  dark: {
    name: 'CartoDB Dark Matter',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  },
  light: {
    name: 'CartoDB Positron',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  },
  voyager: {
    name: 'CartoDB Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  },
  osm: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abc',
    maxZoom: 19
  }
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  pickup,
  dropoff,
  routeProgress = 0,
  showNearbyDrivers = true,
  vehicleType = 'sedan',
  driverName = 'Juan Dela Cruz',
  driverPlate = 'NDA 1234',
  height = 'h-64',
  className = '',
  interactive = true,
  onSelectLocation
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const pickupMarkerRef = useRef<L.Marker | null>(null);
  const dropoffMarkerRef = useRef<L.Marker | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);
  const nearbyDriversGroupRef = useRef<L.LayerGroup | null>(null);
  const routePolylineGlowRef = useRef<L.Polyline | null>(null);
  const routePolylineCoreRef = useRef<L.Polyline | null>(null);

  const [currentTileStyle, setCurrentTileStyle] = useState<keyof typeof TILE_LAYERS>('dark');
  const [mapReady, setMapReady] = useState<boolean>(false);

  // Default coordinate center (Metro Manila hub / Quezon City)
  const defaultCenter = useMemo<[number, number]>(() => {
    if (pickup) return [pickup.lat, pickup.lng];
    if (dropoff) return [dropoff.lat, dropoff.lng];
    return [14.6507, 121.0028];
  }, [pickup, dropoff]);

  // Route path coordinates calculation
  const routePoints = useMemo<[number, number][]>(() => {
    if (!pickup || !dropoff) return [];

    const points: [number, number][] = [];
    const midLat = (pickup.lat + dropoff.lat) / 2 + 0.0035;
    const midLng = (pickup.lng + dropoff.lng) / 2 - 0.0035;

    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      const lat = Math.pow(1 - t, 2) * pickup.lat + 2 * (1 - t) * t * midLat + Math.pow(t, 2) * dropoff.lat;
      const lng = Math.pow(1 - t, 2) * pickup.lng + 2 * (1 - t) * t * midLng + Math.pow(t, 2) * dropoff.lng;
      points.push([lat, lng]);
    }
    return points;
  }, [pickup, dropoff]);

  // Moving driver interpolated location
  const driverCoords = useMemo<[number, number] | null>(() => {
    if (!pickup || !dropoff) return null;
    const t = Math.min(Math.max(routeProgress / 100, 0), 1);
    const midLat = (pickup.lat + dropoff.lat) / 2 + 0.0035;
    const midLng = (pickup.lng + dropoff.lng) / 2 - 0.0035;

    const lat = Math.pow(1 - t, 2) * pickup.lat + 2 * (1 - t) * t * midLat + Math.pow(t, 2) * dropoff.lat;
    const lng = Math.pow(1 - t, 2) * pickup.lng + 2 * (1 - t) * t * midLng + Math.pow(t, 2) * dropoff.lng;

    return [lat, lng];
  }, [pickup, dropoff, routeProgress]);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create map instance
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    const activeTile = TILE_LAYERS[currentTileStyle];
    const tileLayer = L.tileLayer(activeTile.url, {
      attribution: activeTile.attribution,
      subdomains: activeTile.subdomains,
      maxZoom: activeTile.maxZoom
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Create LayerGroup for nearby driver markers
    const nearbyGroup = L.layerGroup().addTo(map);
    nearbyDriversGroupRef.current = nearbyGroup;

    // Click handler for pin placement
    if (interactive && onSelectLocation) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        onSelectLocation({
          name: 'Selected Pin on Map',
          address: `Lat: ${e.latlng.lat.toFixed(4)}, Lng: ${e.latlng.lng.toFixed(4)}`,
          lat: e.latlng.lat,
          lng: e.latlng.lng
        });
      });
    }

    mapInstanceRef.current = map;
    setMapReady(true);

    // Invalidate size once container mounts for crisp tiles
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      setMapReady(false);
    };
  }, []);

  // 2. Switch Tile Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const activeTile = TILE_LAYERS[currentTileStyle];
    const newTileLayer = L.tileLayer(activeTile.url, {
      attribution: activeTile.attribution,
      subdomains: activeTile.subdomains,
      maxZoom: activeTile.maxZoom
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [currentTileStyle]);

  // 3. Render Route Polylines
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    // Clean up existing polylines
    if (routePolylineGlowRef.current) {
      map.removeLayer(routePolylineGlowRef.current);
      routePolylineGlowRef.current = null;
    }
    if (routePolylineCoreRef.current) {
      map.removeLayer(routePolylineCoreRef.current);
      routePolylineCoreRef.current = null;
    }

    if (routePoints.length > 0) {
      // Glow underlay polyline
      const glow = L.polyline(routePoints, {
        color: '#f59e0b',
        weight: 8,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
      routePolylineGlowRef.current = glow;

      // Core crisp polyline
      const core = L.polyline(routePoints, {
        color: '#fbbf24',
        weight: 4,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
      routePolylineCoreRef.current = core;

      // Auto fit bounds
      if (pickup && dropoff) {
        const bounds = L.latLngBounds([
          [pickup.lat, pickup.lng],
          [dropoff.lat, dropoff.lng]
        ]);
        map.fitBounds(bounds, {
          padding: [45, 45],
          maxZoom: 15,
          animate: true
        });
      }
    }
  }, [mapReady, routePoints, pickup, dropoff]);

  // 4. Render Pickup Pin (Custom DivIcon)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    if (pickup) {
      const pickupHtml = `
        <div class="flex flex-col items-center select-none" style="transform: translate(-50%, -100%);">
          <div style="background:#0f172a; color:#34d399; padding:2px 6px; border-radius:6px; font-size:9px; font-weight:800; border:1px solid rgba(52,211,153,0.5); box-shadow:0 4px 6px -1px rgba(0,0,0,0.5); white-space:nowrap; margin-bottom:2px; display:flex; align-items:center; gap:3px;">
            <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#34d399;"></span>
            PICKUP
          </div>
          <div style="width:28px; height:28px; border-radius:50%; background:#10b981; border:2px solid #ffffff; box-shadow:0 10px 15px -3px rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; color:#ffffff;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: pickupHtml,
        iconSize: [0, 0]
      });

      if (!pickupMarkerRef.current) {
        pickupMarkerRef.current = L.marker([pickup.lat, pickup.lng], { icon: customIcon }).addTo(map);
      } else {
        pickupMarkerRef.current.setLatLng([pickup.lat, pickup.lng]);
        pickupMarkerRef.current.setIcon(customIcon);
      }
    } else if (pickupMarkerRef.current) {
      map.removeLayer(pickupMarkerRef.current);
      pickupMarkerRef.current = null;
    }
  }, [pickup, mapReady]);

  // 5. Render Dropoff Pin (Custom DivIcon)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    if (dropoff) {
      const dropoffHtml = `
        <div class="flex flex-col items-center select-none" style="transform: translate(-50%, -100%);">
          <div style="background:#450a0a; color:#fca5a5; padding:2px 6px; border-radius:6px; font-size:9px; font-weight:800; border:1px solid rgba(239,68,68,0.5); box-shadow:0 4px 6px -1px rgba(0,0,0,0.5); white-space:nowrap; margin-bottom:2px; display:flex; align-items:center; gap:3px;">
            <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#ef4444;"></span>
            DESTINATION
          </div>
          <div style="width:28px; height:28px; border-radius:50%; background:#ef4444; border:2px solid #ffffff; box-shadow:0 10px 15px -3px rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; color:#ffffff;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: dropoffHtml,
        iconSize: [0, 0]
      });

      if (!dropoffMarkerRef.current) {
        dropoffMarkerRef.current = L.marker([dropoff.lat, dropoff.lng], { icon: customIcon }).addTo(map);
      } else {
        dropoffMarkerRef.current.setLatLng([dropoff.lat, dropoff.lng]);
        dropoffMarkerRef.current.setIcon(customIcon);
      }
    } else if (dropoffMarkerRef.current) {
      map.removeLayer(dropoffMarkerRef.current);
      dropoffMarkerRef.current = null;
    }
  }, [dropoff, mapReady]);

  // 6. Moving Driver Marker (Custom DivIcon with active vehicle details)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    if (driverCoords && pickup && dropoff && routeProgress > 0) {
      const driverHtml = `
        <div class="flex flex-col items-center select-none" style="transform: translate(-50%, -50%);">
          <div style="background:#0f172a; color:#fbbf24; padding:2px 6px; border-radius:6px; font-size:9px; font-weight:800; border:1px solid rgba(251,191,36,0.6); box-shadow:0 4px 6px -1px rgba(0,0,0,0.5); white-space:nowrap; margin-bottom:2px;">
            🚗 ${driverPlate}
          </div>
          <div style="width:34px; height:34px; border-radius:12px; background:#fbbf24; border:2px solid #0f172a; box-shadow:0 10px 20px -3px rgba(245,158,11,0.6); display:flex; align-items:center; justify-content:center; color:#0f172a;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
          </div>
        </div>
      `;

      const customDriverIcon = L.divIcon({
        className: 'custom-driver-pin',
        html: driverHtml,
        iconSize: [0, 0]
      });

      if (!driverMarkerRef.current) {
        driverMarkerRef.current = L.marker(driverCoords, { icon: customDriverIcon, zIndexOffset: 1000 }).addTo(map);
      } else {
        driverMarkerRef.current.setLatLng(driverCoords);
        driverMarkerRef.current.setIcon(customDriverIcon);
      }
    } else if (driverMarkerRef.current) {
      map.removeLayer(driverMarkerRef.current);
      driverMarkerRef.current = null;
    }
  }, [driverCoords, routeProgress, driverPlate, pickup, dropoff, mapReady]);

  // 7. Nearby Available Drivers
  useEffect(() => {
    const group = nearbyDriversGroupRef.current;
    if (!group || !mapReady) return;

    group.clearLayers();

    if (showNearbyDrivers && (!pickup || !dropoff || routeProgress === 0)) {
      const baseLat = pickup?.lat || 14.6507;
      const baseLng = pickup?.lng || 121.0028;

      const nearbyPositions = [
        { lat: baseLat + 0.0035, lng: baseLng + 0.003 },
        { lat: baseLat - 0.003, lng: baseLng + 0.0045 },
        { lat: baseLat + 0.0055, lng: baseLng - 0.0035 },
        { lat: baseLat - 0.0045, lng: baseLng - 0.0025 }
      ];

      nearbyPositions.forEach((pos) => {
        const iconHtml = `
          <div style="transform: translate(-50%, -50%); width:28px; height:28px; border-radius:10px; background:#0f172a; border:1px solid #fbbf24; box-shadow:0 4px 10px rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; color:#fbbf24;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
          </div>
        `;
        const icon = L.divIcon({
          className: 'nearby-driver-pin',
          html: iconHtml,
          iconSize: [0, 0]
        });
        L.marker([pos.lat, pos.lng], { icon }).addTo(group);
      });
    }
  }, [showNearbyDrivers, pickup, dropoff, routeProgress, mapReady]);

  // Zoom and navigation handlers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleRecenter = () => {
    if (pickup && dropoff) {
      const bounds = L.latLngBounds([
        [pickup.lat, pickup.lng],
        [dropoff.lat, dropoff.lng]
      ]);
      mapInstanceRef.current?.fitBounds(bounds, { padding: [45, 45] });
    } else {
      mapInstanceRef.current?.setView(defaultCenter, 13);
    }
  };

  const handleNextTileStyle = () => {
    const keys: (keyof typeof TILE_LAYERS)[] = ['dark', 'voyager', 'light', 'osm'];
    const nextIdx = (keys.indexOf(currentTileStyle) + 1) % keys.length;
    setCurrentTileStyle(keys[nextIdx]);
  };

  return (
    <div className={`relative w-full ${height} overflow-hidden rounded-2xl bg-slate-950 border border-slate-700/60 shadow-inner select-none ${className}`}>
      {/* Leaflet Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Controls */}
      {interactive && (
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-20">
          <button
            id="btn-leaflet-zoom-in"
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-md flex items-center justify-center transition-colors cursor-pointer"
            title="Zoom in"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            id="btn-leaflet-zoom-out"
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-md flex items-center justify-center transition-colors cursor-pointer"
            title="Zoom out"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            id="btn-leaflet-layer"
            onClick={handleNextTileStyle}
            className="w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-amber-400 border border-slate-700/80 shadow-md flex items-center justify-center transition-colors cursor-pointer"
            title={`Tile Style: ${TILE_LAYERS[currentTileStyle].name} (Click to switch)`}
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            id="btn-leaflet-recenter"
            onClick={handleRecenter}
            className="w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-md flex items-center justify-center transition-colors cursor-pointer"
            title="Recenter Map"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Live Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60 shadow-lg text-xs z-20">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span className="text-white font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Leaflet • {TILE_LAYERS[currentTileStyle].name}
        </span>
        <span className="text-[10px] text-emerald-300 font-bold px-1.5 py-0.5 bg-emerald-500/20 rounded-md border border-emerald-500/30">
          100% Free
        </span>
      </div>

      {/* Driver telemetry on active trip */}
      {pickup && dropoff && routeProgress > 0 && routeProgress < 100 && (
        <div className="absolute bottom-3 left-3 right-3 bg-slate-950/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-amber-500/40 shadow-xl flex items-center justify-between z-20 text-xs text-white">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-100">{driverName} • {driverPlate}</p>
              <p className="text-[10px] text-amber-400 font-medium">
                {routeProgress < 30 ? 'Driver en route to pickup point' : routeProgress < 90 ? 'Trip active on Metro Manila route' : 'Arriving at destination'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-amber-400">{Math.round(routeProgress)}%</span>
            <p className="text-[9px] text-slate-400">Live GPS</p>
          </div>
        </div>
      )}
    </div>
  );
};
