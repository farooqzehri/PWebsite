import React from 'react';
import { PropertyMap, PropertyMapProps } from './PropertyMap';

// Retained for backwards-compatibility; completely routes to open-source Leaflet + OpenStreetMap
export const GoogleMapsSection: React.FC<PropertyMapProps> = (props) => {
  return <PropertyMap {...props} />;
};

export default GoogleMapsSection;

