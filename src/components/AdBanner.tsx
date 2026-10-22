import React from 'react';
import { AdSettings } from '../types/index.ts';

interface AdBannerProps {
  position?: 'header' | 'in_feed' | 'footer';
  adsSettings?: AdSettings;
  isVipUser?: boolean;
}

/**
 * AdBanner is streamlined to render clean without internal mockup ads.
 * Google AdSense can be injected directly into index.html or script tags.
 */
export const AdBanner: React.FC<AdBannerProps> = () => {
  return null;
};
