import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface GoogleMapProps {
  apiKey: string;
}

export const GoogleMap: React.FC<GoogleMapProps> = ({ apiKey }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;

      window.initMap = initializeMap;

      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    };

    const initializeMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const mapOptions = {
        zoom: 14,
        center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
        styles: [
          {
            "featureType": "all",
            "elementType": "geometry",
            "stylers": [{"color": "#242f3e"}]
          },
          {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [{"lightness": -80}]
          },
          {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#746855"}]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{"color": "#17263c"}]
          }
        ],
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true
      };

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);

      // Get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            mapInstanceRef.current.setCenter(userLocation);

            // Add marker for user location
            new window.google.maps.Marker({
              position: userLocation,
              map: mapInstanceRef.current,
              title: 'Your Location',
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: '#14B8A6',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
                scale: 8
              }
            });
          },
          (error) => {
            console.log('Geolocation error:', error);
          }
        );
      }
    };

    loadGoogleMaps();
  }, [apiKey]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg"
      style={{ minHeight: '300px' }}
    />
  );
};