import React, { useEffect, useRef, useMemo } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface AddressProps {
  address: string;
}

function Map({ address }: AddressProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const geocoder = useMemo(() => new google.maps.Geocoder(), []);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: 'weekly',
    });

    loader.load().then(() => {
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK' && results) {
          const map = new google.maps.Map(mapRef.current as HTMLElement, {
            center: results[0].geometry.location,
            zoom: 8,
          });

          const marker = new google.maps.Marker({
            map,
            position: results[0].geometry.location,
          });
        } else {
          console.error(
            `Geocode was not successful for the following reason: ${status}`
          );
        }
      });
    });
  }, [address, geocoder]);

  return <div className="w-full h-96" ref={mapRef} />;
}

export default Map;
