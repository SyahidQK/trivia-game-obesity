import { createRoot } from 'react-dom/client';
import { MotionGlobalConfig } from 'framer-motion';
import { Capacitor } from '@capacitor/core';
import { registerSW } from 'virtual:pwa-register';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import '@fontsource/poppins/900.css';
import './styles/theme.css';
import './styles/admin.css';
import { App } from './App';

// Cache the app for offline use on the kiosk. The Android app already bundles every file, so it skips this.
if (!Capacitor.isNativePlatform()) registerSW({ immediate: true });

// `?noanim` turns off motion — for low-power TV browsers and automated testing.
if (new URLSearchParams(window.location.search).has('noanim')) MotionGlobalConfig.skipAnimations = true;

createRoot(document.getElementById('root')!).render(<App />);
