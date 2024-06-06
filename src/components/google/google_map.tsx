import React, { useMemo } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  CircleF,
} from '@react-google-maps/api';

function GoogleMapComp() {
  const libraries = useMemo(() => ['places'], []);
  const mapCenter = useMemo(
    () => ({ lat: 27.672932021393862, lng: 85.31184012689732 }),
    []
  );

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCfA2rPPQFxQzT4f__r9DIU3_k9-Z8K-68',
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mt-4 w-full">
      <GoogleMap
        options={mapOptions}
        zoom={14}
        center={mapCenter}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: '100%', height: '500px' }}
        onLoad={() => console.log('Map Component Loaded...')}
      >
        <MarkerF
          position={mapCenter}
          onLoad={() => console.log('Marker Loaded')}
        />
      </GoogleMap>
    </div>
  );
}

export default GoogleMapComp;
