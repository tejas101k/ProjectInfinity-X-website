// src/app/downloads/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// --- Type Definitions ---
type DeviceInfo = {
  devicemodel: string;
  codename: string;
  maintainer: string;
  maintainerurl?: string;
  supportgroupurl?: string;
  donateurl1?: string;
  donateurl2?: string;
  brand?: string;
  has15: boolean;
  has16: boolean;
  primaryCodename: string;
  // imageUrl will be added dynamically
};

type BuildInfo = {
  version: string;
  size: number; // in bytes
  timestamp: number; // Unix timestamp
  md5: string;
  download: string; // URL
};

type DeviceDetails = {
  info: DeviceInfo;
  gapps: BuildInfo | null;
  vanilla: BuildInfo | null;
  changelog: string | null;
  flashguide: string | null;
};

// --- Constants ---
const GITHUB_API_URL_MASTER = 'https://api.github.com/repos/ProjectInfinity-X/official_devices/contents/devices?ref=master';
const GITHUB_API_URL_16 = 'https://api.github.com/repos/ProjectInfinity-X/official_devices/contents/devices?ref=16';
const GITHUB_BASE_URL_MASTER = 'https://raw.githubusercontent.com/ProjectInfinity-X/official_devices/master/';
const GITHUB_BASE_URL_16 = 'https://raw.githubusercontent.com/ProjectInfinity-X/official_devices/16/';

// --- Utility Functions ---
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const getPrimaryCodename = (codename: string): string => {
  return codename.split('/')[0].trim();
};

const getBrandFromModel = (modelName: string): string => {
    const lowerModel = modelName.toLowerCase();
    if (lowerModel.includes('pixel')) return 'Google';
    if (lowerModel.includes('motorola')) return 'Motorola';
    if (lowerModel.includes('xiaomi') || lowerModel.includes('redmi') || lowerModel.includes('poco')) return 'Xiaomi';
    if (lowerModel.includes('realme')) return 'Realme';
    if (lowerModel.includes('oneplus')) return 'OnePlus';
    if (lowerModel.includes('samsung')) return 'Samsung';
    if (lowerModel.includes('nothing')) return 'Nothing';
    return 'Other';
};

// --- Image Utility Function (Adapted from original JS) ---
const getDeviceImageUrl = (primaryCodename: string): string => {
  // Primary source: ProjectInfinity-X device images (webp)
  return `https://raw.githubusercontent.com/ProjectInfinity-X/official_devices/16/deviceimages/${primaryCodename}.webp`;
};

// --- Main Component ---
export default function DownloadsPage() {
  // --- State Management ---
  const [allDevices, setAllDevices] = useState<DeviceInfo[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<DeviceInfo[]>([]);
  const [uniqueBrands, setUniqueBrands] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDevice, setSelectedDevice] = useState<DeviceInfo | null>(null);
  const [deviceDetails, setDeviceDetails] = useState<DeviceDetails | null>(null);
  const [currentAndroidVersion, setCurrentAndroidVersion] = useState<'15' | '16'>('16');
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  // --- Data Fetching ---
  // --- Data Fetching (Corrected) ---
  const fetchDevices = useCallback(async () => {
    // A simple type for the GitHub API response
    type GithubFile = {
      name: string;
    };

    setLoading(true);
    setError(null);
    try {
      const [masterRes, b16Res] = await Promise.all([
        fetch(GITHUB_API_URL_MASTER),
        fetch(GITHUB_API_URL_16)
      ]);

      if (!masterRes.ok || !b16Res.ok) {
        throw new Error("Could not fetch device lists");
      }
      
      // 1. Apply the type right after fetching the JSON data.
      const masterFiles: GithubFile[] = await masterRes.json();
      const b16Files: GithubFile[] = await b16Res.json();

      // 2. TypeScript now knows 'f' is a GithubFile, so 'f.name' is a string.
      const masterCodenames = new Set(
        masterFiles
          .filter((f) => f.name.endsWith('.json'))
          .map((f) => f.name.replace('.json', ''))
      );
      const b16Codenames = new Set(
        b16Files
          .filter((f) => f.name.endsWith('.json'))
          .map((f) => f.name.replace('.json', ''))
      );

      // 'allCodenames' is now correctly inferred as string[]
      const allCodenames = Array.from(new Set([...masterCodenames, ...b16Codenames]));
      
      // 3. The sort function now works without any extra types needed.
      allCodenames.sort((a, b) => a.localeCompare(b));

      const fetchPromises = allCodenames.map(async (codename) => {
        let info: any = null;
        let url = '';

        if (b16Codenames.has(codename)) {
          url = `${GITHUB_BASE_URL_16}devices/${codename}.json`;
        } else if (masterCodenames.has(codename)) {
          url = `${GITHUB_BASE_URL_MASTER}devices/${codename}.json`;
        }

        if (url) {
          try {
            const response = await fetch(url);
            if (response.ok) {
              info = await response.json();
            }
          } catch (e) {
            console.error(`Error fetching device info for ${codename}:`, e);
          }
        }

        if (!info) return null;

        const brand = getBrandFromModel(info.devicemodel);
        const primaryCodename = getPrimaryCodename(codename); // No 'as string' needed
        return {
          ...info,
          brand,
          codename,
          has15: masterCodenames.has(codename),
          has16: b16Codenames.has(codename),
          primaryCodename,
        };
      });

      const deviceResults = await Promise.all(fetchPromises);
      const validDevices = deviceResults.filter((d): d is DeviceInfo => d !== null);

      setAllDevices(validDevices);
      setFilteredDevices(validDevices);

      const brands = [...new Set(validDevices.map(d => d.brand || 'Unknown'))].sort();
      setUniqueBrands(brands);

    } catch (err: any) {
      console.error("Error in fetchDevices:", err);
      setError(err.message || "Failed to load devices.");
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Filter Devices ---
  useEffect(() => {
    let result = [...allDevices];
    if (selectedBrand !== 'all') {
      result = result.filter(device => (device.brand || 'Unknown') === selectedBrand);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(device =>
        device.devicemodel.toLowerCase().includes(term) ||
        device.codename.toLowerCase().includes(term)
      );
    }
    setFilteredDevices(result);
  }, [allDevices, selectedBrand, searchTerm]);

  // --- Load Device Details ---
  const loadDeviceDetails = useCallback(async (deviceInfo: DeviceInfo) => {
    setSelectedDevice(deviceInfo);
    setDeviceDetails(null);
    setLoadingDetails(true);
    setDetailsError(null);
  
    try {
      const primaryCodename = deviceInfo.primaryCodename;
      let useVersion: '15' | '16' | null = null;
      if (deviceInfo.has16 && currentAndroidVersion === '16') {
         useVersion = '16';
      } else if (deviceInfo.has15 && currentAndroidVersion === '15') {
         useVersion = '15';
      } else if (deviceInfo.has16) {
         useVersion = '16';
         setCurrentAndroidVersion('16');
      } else if (deviceInfo.has15) {
         useVersion = '15';
         setCurrentAndroidVersion('15');
      }
  
      if (!useVersion) {
        throw new Error("Device info not found for any available version");
      }
  
      const baseUrl = useVersion === '16' ? GITHUB_BASE_URL_16.trim() : GITHUB_BASE_URL_MASTER.trim();
      const devicesDir = `${baseUrl}devices/`;
      const gappsDir = `${baseUrl}gapps/`;
      const vanillaDir = `${baseUrl}vanilla/`;
      const changelogDir = `${baseUrl}changelog/`;
      const flashguideDir = `${baseUrl}flashguide/`;
  
      const deviceInfoRes = await fetch(`${devicesDir}${deviceInfo.codename}.json`);
      if (!deviceInfoRes.ok) throw new Error("Device information not found");
      const deviceData: DeviceInfo = await deviceInfoRes.json();
  
      const [gappsRes, vanillaRes] = await Promise.allSettled([
        fetch(`${gappsDir}${primaryCodename}.json`),
        fetch(`${vanillaDir}${primaryCodename}.json`)
      ]);
  
      let gappsData: BuildInfo | null = null;
      let vanillaData: BuildInfo | null = null;
  
      if (gappsRes.status === 'fulfilled' && gappsRes.value.ok) {
        const gappsJson = await gappsRes.value.json();
        if (gappsJson?.response?.[0]) {
          gappsData = gappsJson.response[0] as BuildInfo;
        }
      }
  
      if (vanillaRes.status === 'fulfilled' && vanillaRes.value.ok) {
        const vanillaJson = await vanillaRes.value.json();
        if (vanillaJson?.response?.[0]) {
          vanillaData = vanillaJson.response[0] as BuildInfo;
        }
      }
  
      const [changelogRes, flashguideRes] = await Promise.allSettled([
        fetch(`${changelogDir}${primaryCodename}.txt`).catch(() => fetch(`${changelogDir}${primaryCodename}.md`)),
        fetch(`${flashguideDir}${primaryCodename}.txt`).catch(() => fetch(`${flashguideDir}${primaryCodename}.md`))
      ]);
  
      let changelogContent: string | null = null;
      let flashguideContent: string | null = null;
  
      if (changelogRes.status === 'fulfilled' && changelogRes.value.ok) {
        changelogContent = await changelogRes.value.text() as string;
      }
  
      if (flashguideRes.status === 'fulfilled' && flashguideRes.value.ok) {
        flashguideContent = await flashguideRes.value.text() as string;
      }
  
      setDeviceDetails({
        info: deviceData,
        gapps: gappsData,
        vanilla: vanillaData,
        changelog: changelogContent,
        flashguide: flashguideContent
      });
  
    } catch (err: any) {
      console.error("Error loading device details:", err);
      setDetailsError(err.message || "Failed to load device details.");
    } finally {
      setLoadingDetails(false);
    }
  }, [currentAndroidVersion]);

  // --- Switch Android Version ---
  const switchAndroidVersion = (version: '15' | '16') => {
    setCurrentAndroidVersion(version);
    if (selectedDevice) {
        loadDeviceDetails(selectedDevice);
    }
  };

  // --- Back to Device List ---
  const goBackToList = () => {
    setSelectedDevice(null);
    setDeviceDetails(null);
    setDetailsError(null);
  };

  // --- Fetch devices on component mount ---
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // --- Device Image Component with Fallback ---
  const DeviceImage = ({ device }: { device: DeviceInfo }) => {
    const primaryCodename = device.primaryCodename;
    const primarySrc = getDeviceImageUrl(primaryCodename);
    const fallbackSrc = `https://wiki.lineageos.org/images/devices/${primaryCodename}.png`;

    const [imgSrc, setImgSrc] = useState<string>(primarySrc);
    const [imgError, setImgError] = useState<boolean>(false);

    useEffect(() => {
        setImgSrc(primarySrc);
        setImgError(false);
    }, [device, primarySrc]);

    const handleError = () => {
        if (!imgError) {
            setImgSrc(fallbackSrc);
            setImgError(true);
        } else {
            setImgSrc('');
        }
    };

    if (!imgSrc) {
        return (
            <div className="bg-gray-800 rounded-lg p-4 w-full h-40 flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <i className="fas fa-mobile-alt text-4xl mb-2"></i>
                    <p className="text-sm">Image not available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-lg p-4 w-full h-40 flex items-center justify-center overflow-hidden">
             <img
                src={imgSrc}
                alt={`${device.devicemodel} image`}
                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                onError={handleError}
                loading="lazy"
            />
        </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-black">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Device Downloads
            </h1>
            <p className="text-xl text-gray-300">
              Get the latest builds for your device.
            </p>
          </div>
        </section>

        {/* Downloads Content */}
        <section className="py-12 ">
          <div className="container mx-auto px-4">
            {!selectedDevice ? (
              // --- Device Listing View ---
              <div id="devicesListing">
                <div className="mb-8">
                  <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
                    <div className="w-full md:w-1/3">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search by device codename or model..."
                          className="w-full p-3 pl-10 rounded-lg  border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-white"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                      </div>
                    </div>
                    <Link
                      href="/"
                      className="flex items-center px-4 py-2  text-white rounded-lg hover:bg-gray-800 transition-colors border border-gray-700"
                    >
                      <i className="fas fa-arrow-left mr-2"></i> Back to Home
                    </Link>
                  </div>

                  {/* Brand Filter Buttons */}
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                      <button
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedBrand === 'all'
                            ? 'bg-white text-black'
                            : ' text-white hover:bg-gray-800 border border-gray-700'
                        }`}
                        onClick={() => setSelectedBrand('all')}
                      >
                        All Brands
                      </button>
                      {uniqueBrands.map(brand => (
                        <button
                          key={brand}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            selectedBrand === brand
                              ? 'bg-white text-black'
                              : ' text-white hover:bg-gray-800 border border-gray-700'
                          }`}
                          onClick={() => setSelectedBrand(brand)}
                        >
                          {brand}
                        </button>
                      ))}
                  </div>

                  {loading && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
                      <p className="text-gray-400">Loading devices...</p>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-lg mb-6">
                      <p className="font-medium">Error loading devices:</p>
                      <p>{error}</p>
                      <button
                        className="mt-4 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600 transition-colors"
                        onClick={fetchDevices}
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredDevices.length > 0 ? (
                        filteredDevices.map(device => (
                          <div
                            key={device.codename}
                            className=" rounded-xl border border-gray-800 overflow-hidden hover:border-gray-600 transition-all hover:shadow-xl cursor-pointer group"
                            onClick={() => loadDeviceDetails(device)}
                          >
                            <div className="p-5">
                              {/* Device Image with Fallback */}
                              <div className="flex justify-center mb-4 text-gray-500 group-hover:text-white transition-colors">
                                <DeviceImage device={device} />
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-semibold text-white mb-1 truncate">{device.devicemodel}</div>
                                <div className="text-sm text-gray-400 mb-2">{device.codename}</div>
                                <div className="flex items-center justify-center text-sm text-gray-500">
                                  <i className="fas fa-user-cog mr-2"></i> {device.maintainer}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-12 text-gray-500">
                          <i className="fas fa-search text-4xl mb-4"></i>
                          <p className="text-xl mb-2">No devices found.</p>
                          <p>Please check back later or try a different search/filter.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // --- Device Details View ---
              <div id="deviceDetails" className="device-details-screen">
                 {/* Device Details Image with Fallback */}
                 
                <div className=" rounded-2xl border border-gray-800 p-6 md:p-8 shadow-lg">
                  <div className="device-details-header mb-8">
                    <button
                      className="flex items-center mb-6 text-white hover:text-gray-300 transition-colors"
                      onClick={goBackToList}
                    >
                      <i className="fas fa-arrow-left mr-2"></i> Back to Devices
                    </button>

                    {loadingDetails && (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
                        <p className="text-gray-400">Loading device details...</p>
                      </div>
                    )}

                    {detailsError && (
                      <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-lg mb-6">
                        <p className="font-medium">Error loading device details:</p>
                        <p>{detailsError}</p>
                        <button
                          className="mt-4 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600 transition-colors"
                          onClick={goBackToList}
                        >
                          Back to Devices
                        </button>
                      </div>
                    )}

                    {deviceDetails && !loadingDetails && !detailsError && (
                      <>
                        <h1 className="text-3xl font-bold mb-2 text-white">{deviceDetails.info.devicemodel}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6">
                          <span><i className="fas fa-code mr-2"></i> {deviceDetails.info.codename}</span>
                          <span><i className="fas fa-user mr-2"></i> {deviceDetails.info.maintainer}</span>
                        </div>

                        {/* Android Version Selector */}
                        {(deviceDetails.info.has16 || deviceDetails.info.has15) && (
                          <div className="flex flex-wrap gap-2 mb-8">
                            {deviceDetails.info.has16 && (
                              <button
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  currentAndroidVersion === '16'
                                    ? 'bg-white text-black'
                                    : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                                }`}
                                onClick={() => switchAndroidVersion('16')}
                              >
                                Android 16
                              </button>
                            )}
                            {deviceDetails.info.has15 && (
                              <button
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  currentAndroidVersion === '15'
                                    ? 'bg-white text-black'
                                    : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                                }`}
                                onClick={() => switchAndroidVersion('15')}
                              >
                                Android 15
                              </button>
                            )}
                          </div>
                        )}

                        {/* Device Links */}
                        <div className="flex flex-wrap gap-4 mb-8">
                          {deviceDetails.info.maintainerurl && (
                            <a
                              href={deviceDetails.info.maintainerurl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
                            >
                              <i className="fa fa-user mr-2"></i> Reach Maintainer
                            </a>
                          )}
                          {deviceDetails.info.supportgroupurl && (
                            <a
                              href={deviceDetails.info.supportgroupurl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                              <i className="fab fa-telegram mr-2"></i> Support Group
                            </a>
                          )}
                          {(deviceDetails.info.donateurl1 || deviceDetails.info.donateurl2) && (
                            <a
                              href={deviceDetails.info.donateurl1 || deviceDetails.info.donateurl2 || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
                            >
                              <i className="fas fa-donate mr-2"></i> Donate
                            </a>
                          )}
                        </div>

                        {/* Download Links */}
                        <div className="downloads-container mb-12">
                          <h2 className="text-2xl font-bold mb-6 text-white">Download Links</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {deviceDetails.gapps ? (
                              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                                <div className="text-xl font-semibold mb-4 text-white">
                                  <i className="fab fa-google mr-2"></i> GApps Variant
                                </div>
                                <div className="space-y-2 text-gray-300 mb-6">
                                  <div><strong>Version:</strong> {deviceDetails.gapps.version}</div>
                                  <div><strong>Size:</strong> {formatFileSize(deviceDetails.gapps.size)}</div>
                                  <div><strong>Release Date:</strong> {formatTimestamp(deviceDetails.gapps.timestamp)}</div>
                                  <div><strong>MD5:</strong> {deviceDetails.gapps.md5}</div>
                                </div>
                                <a
                                  href={deviceDetails.gapps.download}
                                  className="inline-block w-full text-center px-4 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-all shadow"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <i className="fas fa-download mr-2"></i> Download GApps
                                </a>
                              </div>
                            ) : null}

                            {deviceDetails.vanilla ? (
                              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                                <div className="text-xl font-semibold mb-4 text-white">
                                  <i className="fab fa-android mr-2"></i> Vanilla Variant
                                </div>
                                <div className="space-y-2 text-gray-300 mb-6">
                                  <div><strong>Version:</strong> {deviceDetails.vanilla.version}</div>
                                  <div><strong>Size:</strong> {formatFileSize(deviceDetails.vanilla.size)}</div>
                                  <div><strong>Release Date:</strong> {formatTimestamp(deviceDetails.vanilla.timestamp)}</div>
                                  <div><strong>MD5:</strong> {deviceDetails.vanilla.md5}</div>
                                </div>
                                <a
                                  href={deviceDetails.vanilla.download}
                                  className="inline-block w-full text-center px-4 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-all shadow"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <i className="fas fa-download mr-2"></i> Download Vanilla
                                </a>
                              </div>
                            ) : null}

                            {!deviceDetails.gapps && !deviceDetails.vanilla && (
                              <div className="col-span-full text-center py-8 text-gray-500">
                                <i className="fas fa-exclamation-circle text-2xl mb-2"></i>
                                <p>No builds available for this device at the moment.</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Changelog */}
                        <div className="downloads-container mb-12">
                          <h2 className="text-2xl font-bold mb-6 text-white">Changelog</h2>
                          <div className="bg-black p-6 rounded-xl border border-gray-800 max-h-96 overflow-y-auto">
                            {deviceDetails.changelog ? (
                              <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm">
                                {deviceDetails.changelog}
                              </pre>
                            ) : (
                              <p className="text-gray-500">No changelog available for this device.</p>
                            )}
                          </div>
                        </div>

                        {/* Flash Guide */}
                        <div className="downloads-container">
                          <h2 className="text-2xl font-bold mb-6 text-white">Installation Guide</h2>
                          <div className="bg-black p-6 rounded-xl border border-gray-800 max-h-96 overflow-y-auto">
                            {deviceDetails.flashguide ? (
                              <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm">
                                {deviceDetails.flashguide}
                              </pre>
                            ) : (
                              <p className="text-gray-500">No installation guide available for this device.</p>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}