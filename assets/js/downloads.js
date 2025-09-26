/* ------ CONSTANTS -------- */
const BRAND_CATEGORIES = {
    'Google': ['pixel'],
    'Motorola': ['motorola'],
    'Xiaomi': ['xiaomi', 'redmi', 'poco'],
    'Realme': ['realme'],
    'OnePlus': ['oneplus'],
    'Samsung': ['samsung'],
    'Nothing': ['nothing']
};
const GITHUB_API_URL_MASTER = 'https://api.github.com/repos/ProjectInfinity-X/official_devices/contents/devices?ref=master';
const GITHUB_API_URL_16 = 'https://api.github.com/repos/ProjectInfinity-X/official_devices/contents/devices?ref=16';
const GITHUB_BASE_URL_MASTER = 'https://raw.githubusercontent.com/ProjectInfinity-X/official_devices/master/';
const GITHUB_BASE_URL_16 = 'https://raw.githubusercontent.com/ProjectInfinity-X/official_devices/16/';

// ... ALL DOM ELEMENTS ...

const devicesGrid = document.getElementById('devicesGrid');
const searchInput = document.getElementById('searchInput');
const loadingMessage = document.getElementById('loadingMessage');
const errorMessage = document.getElementById('errorMessage');
const errorDetails = document.getElementById('errorDetails');
const brandCategories = document.getElementById('brandCategories');
const devicesListing = document.getElementById('devicesListing');
const deviceDetails = document.getElementById('deviceDetails');
const deviceDetailsTitle = document.getElementById('deviceDetailsTitle');
const deviceDetailsImage = document.getElementById('deviceDetailsImage');
const deviceDetailsCodename = document.getElementById('deviceDetailsCodename');
const deviceDetailsModel = document.getElementById('deviceDetailsModel');
const deviceDetailsMaintainer = document.getElementById('deviceDetailsMaintainer');
const deviceDetailsLinks = document.getElementById('deviceDetailsLinks');
const deviceDownloadsContainer = document.getElementById('deviceDownloadsContainer');
const deviceChangelogContent = document.getElementById('deviceChangelogContent');
const deviceFlashguideContent = document.getElementById('deviceFlashguideContent');
const backToList = document.getElementById('backToList');
const androidVersionButtons = document.getElementById('androidVersionButtons');
const deviceDataCache = {};
const imageCache = {};
let currentAndroidVersion = '16';

/* ...UTILITIES... */

function formatFileSize(bytes) { if (bytes === 0) return '0 Bytes'; const k = 1024; const sizes = ['Bytes','KB','MB','GB']; const i = Math.floor(Math.log(bytes)/Math.log(k)); return parseFloat((bytes/Math.pow(k,i)).toFixed(2)) + ' ' + sizes[i]; }
function formatTimestamp(timestamp) { const date = new Date(timestamp * 1000); return date.toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'}); }
function getPrimaryCodename(codename) { return codename.split('/')[0].trim(); }
function getParameterByName(name) { const urlParams = new URLSearchParams(window.location.search); return urlParams.get(name); }
function checkUrlForDevice() { const codename = getParameterByName('device'); if (codename) { loadDeviceDetails(codename); return true; } return false; }
async function fetchContent(url, type = 'json') { if (deviceDataCache[url]) return deviceDataCache[url]; try { const response = await fetch(url); if (!response.ok) throw new Error("HTTP error! Status: "+response.status); let data; if (type === 'json') data = await response.json(); else data = await response.text(); deviceDataCache[url] = data; return data; } catch(e){return null;} }
function getDeviceImageUrl(primaryCodename) { if (imageCache[primaryCodename]) return imageCache[primaryCodename]; return `https://raw.githubusercontent.com/ProjectInfinity-X/official_devices/16/deviceimages/${primaryCodename}.webp`; }
function getBrandFromModel(modelName) { const lowerModel = modelName.toLowerCase(); for (const [brand, keywords] of Object.entries(BRAND_CATEGORIES)) { for (const keyword of keywords) { if (lowerModel.includes(keyword)) return brand; } } return 'Other'; }
function createBrandButtons(brands) { const allBrandsBtn = document.querySelector('.brand-btn[data-brand="all"]'); brandCategories.innerHTML = ''; if(allBrandsBtn)brandCategories.appendChild(allBrandsBtn); brands.forEach(brand => { if (brand === 'All') return; const button = document.createElement('button'); button.className = 'brand-btn'; button.dataset.brand = brand; button.textContent = brand; brandCategories.appendChild(button); }); }

async function getDeviceBranchPresence(codename) {
    const url15 = `${GITHUB_BASE_URL_MASTER}devices/${codename}.json`;
    const url16 = `${GITHUB_BASE_URL_16}devices/${codename}.json`;
    const [r15, r16] = await Promise.all([
        fetch(url15, { method: "HEAD" }).then(r => r.ok).catch(() => false),
        fetch(url16, { method: "HEAD" }).then(r => r.ok).catch(() => false),
    ]);
    return { has15: r15, has16: r16 };
}

async function loadDevices() {
    loadingMessage.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    devicesGrid.innerHTML = '';

    try {
        const [masterRes, b16Res] = await Promise.all([
            fetch(GITHUB_API_URL_MASTER),
            fetch(GITHUB_API_URL_16)
        ]);
        if (!masterRes.ok || !b16Res.ok) throw new Error("Could not fetch device lists");
        const masterFiles = await masterRes.json();
        const b16Files = await b16Res.json();

        const masterCodenames = new Set(masterFiles.filter(f => f.name.endsWith('.json')).map(f => f.name.replace('.json', '')));
        const b16Codenames  = new Set(b16Files.filter(f => f.name.endsWith('.json')).map(f => f.name.replace('.json', '')));
        const allCodenames = Array.from(new Set([...masterCodenames, ...b16Codenames]));
        allCodenames.sort((a, b) => a.localeCompare(b)); // sort ascending by codename (akita, ... Pong...)

        const fetchPromises = allCodenames.map(async codename => {
            let info = null;
            let branch = null;
            let url = '';
            if (b16Codenames.has(codename)) {
                url = `${GITHUB_BASE_URL_16}devices/${codename}.json`;
                info = await fetchContent(url, 'json');
                branch = '16';
            } else if (masterCodenames.has(codename)) {
                url = `${GITHUB_BASE_URL_MASTER}devices/${codename}.json`;
                info = await fetchContent(url, 'json');
                branch = 'master';
            }
            if (!info) return null;
            const brand = getBrandFromModel(info.devicemodel);
            return {
                ...info,
                brand: brand,
                codename: codename,
                branch: branch,
                has15: masterCodenames.has(codename),
                has16: b16Codenames.has(codename),
                imageUrl: getDeviceImageUrl(getPrimaryCodename(codename)),
                primaryCodename: getPrimaryCodename(codename),
            };
        });

        const allDevices = (await Promise.all(fetchPromises)).filter(d => d !== null);

        const uniqueBrands = [...new Set(allDevices.map(d => d.brand))].sort();
        createBrandButtons(uniqueBrands);

        window.allDevices = allDevices;
        displayDevices(allDevices);

    } catch (error) {
        errorDetails.textContent = error.message;
        errorMessage.classList.remove('hidden');
    } finally {
        loadingMessage.classList.add('hidden');
    }
}

function displayDevices(devices) {
    devicesGrid.innerHTML = '';
    if (!devices.length) {
        devicesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No devices found.</p>
                <p>Please check back later.</p>
            </div>
        `;
        return;
    }
    devices.forEach(device => {
        const deviceCard = document.createElement('div');
        deviceCard.className = 'device-card';
        deviceCard.dataset.codename = device.codename;
        deviceCard.innerHTML = `
            <div class="device-image">
                <img loading="lazy" src="${device.imageUrl}" alt="${device.devicemodel}">
            </div>
            <div class="device-info">
                <div class="device-model">${device.devicemodel}</div>
                <div class="device-codename">${device.codename}</div>
                <div class="device-maintainer"><i class="fas fa-user-cog"></i> ${device.maintainer}</div>
            </div>
        `;
        devicesGrid.appendChild(deviceCard);
    });
}

devicesGrid.addEventListener('click', function(e) {
    const card = e.target.closest('.device-card');
    if (card) {
        const codename = card.dataset.codename;
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('device', codename);
        window.history.pushState({ device: codename }, '', newUrl);
        loadDeviceDetails(codename);
    }
});

function getDownloadUrl(primaryCodename, variant, androidVersion, jsonData) {
    return jsonData.download;
}

// --------- LOAD DEVICE DETAILS (with download link switching) ----------
async function loadDeviceDetails(codename) {
    try {
        devicesListing.style.display = 'none';
        deviceDetails.style.display = 'block';
        deviceDetailsTitle.textContent = 'Loading...';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const primaryCodename = getPrimaryCodename(codename);
        const { has15, has16 } = await getDeviceBranchPresence(codename);

        if (!has15 && !has16) throw new Error("Device not found in either Android 15 or 16 branch");

        androidVersionButtons.innerHTML = '';
        if (has16) {
            const btn16 = document.createElement('button');
            btn16.className = 'android-version-btn' + (currentAndroidVersion === '16' ? ' active':'');
            btn16.dataset.version = '16';
            btn16.textContent = 'Android 16';
            btn16.addEventListener('click', () => switchAndroidVersion('16', codename));
            androidVersionButtons.appendChild(btn16);
        }
        if (has15) {
            const btn15 = document.createElement('button');
            btn15.className = 'android-version-btn' + (currentAndroidVersion === '15' ? ' active':'');
            btn15.dataset.version = '15';
            btn15.textContent = 'Android 15';
            btn15.addEventListener('click', () => switchAndroidVersion('15', codename));
            androidVersionButtons.appendChild(btn15);
        }
        let useVersion = currentAndroidVersion;
        if (useVersion === '16' && !has16) useVersion = has15 ? '15' : null;
        if (useVersion === '15' && !has15) useVersion = has16 ? '16' : null;
        if (!useVersion) throw new Error("Device info not found for this version");
        currentAndroidVersion = useVersion;

        const baseUrl = useVersion === '16'
            ? GITHUB_BASE_URL_16
            : GITHUB_BASE_URL_MASTER;

        const devicesDir = baseUrl + 'devices/';
        const gappsDir = baseUrl + 'gapps/';
        const vanillaDir = baseUrl + 'vanilla/';
        const changelogDir = baseUrl + 'changelog/';
        const flashguideDir = baseUrl + 'flashguide/';

        deviceDetailsImage.src = getDeviceImageUrl(primaryCodename);

        const deviceInfo = await fetchContent(`${devicesDir}${codename}.json`, 'json');
        if (!deviceInfo) throw new Error("Device information not found");
        deviceDetailsTitle.textContent = deviceInfo.devicemodel;
        deviceDetailsCodename.textContent = deviceInfo.codename;
        deviceDetailsModel.textContent = deviceInfo.devicemodel;
        deviceDetailsMaintainer.textContent = deviceInfo.maintainer;
        deviceDetailsLinks.innerHTML = '';
        if (deviceInfo.maintainerurl) {
            const link = document.createElement('a');
            link.href = deviceInfo.maintainerurl;
            link.target = '_blank';
            link.className = 'device-link';
            link.innerHTML = '<i class="fas fa-user"></i> Reach';
            deviceDetailsLinks.appendChild(link);
        }
        if (deviceInfo.supportgroupurl) {
            const link = document.createElement('a');
            link.href = deviceInfo.supportgroupurl;
            link.target = '_blank';
            link.className = 'device-link';
            link.innerHTML = '<i class="fab fa-telegram"></i> Support';
            deviceDetailsLinks.appendChild(link);
        }
        if (deviceInfo.donateurl1 || deviceInfo.donateurl2) {
            const link = document.createElement('a');
            link.href = deviceInfo.donateurl1 || deviceInfo.donateurl2;
            link.target = '_blank';
            link.className = 'device-link';
            link.innerHTML = '<i class="fas fa-donate"></i> Donate';
            deviceDetailsLinks.appendChild(link);
        }

        // Fetch builds (in parallel)
        const [gappsInfo, vanillaInfo] = await Promise.allSettled([
            fetchContent(`${gappsDir}${primaryCodename}.json`, 'json'),
            fetchContent(`${vanillaDir}${primaryCodename}.json`, 'json')
        ]);
        const gapps = gappsInfo.status === 'fulfilled' && gappsInfo.value?.response?.[0] ? gappsInfo.value.response[0] : null;
        const vanilla = vanillaInfo.status === 'fulfilled' && vanillaInfo.value?.response?.[0] ? vanillaInfo.value.response[0] : null;

        deviceDownloadsContainer.innerHTML = '';
        if (gapps) {
            const downloadUrl = getDownloadUrl(primaryCodename, 'gapps', currentAndroidVersion, gapps);
            deviceDownloadsContainer.innerHTML += `
                <div class="download-card">
                    <div class="download-title">
                        <i class="fab fa-google"></i> GApps Variant
                    </div>
                    <div class="download-meta">
                        <div><strong>Version:</strong> ${gapps.version}</div>
                        <div><strong>Size:</strong> ${formatFileSize(gapps.size)}</div>
                        <div><strong>Release Date:</strong> ${formatTimestamp(gapps.timestamp)}</div>
                        <div><strong>MD5:</strong> ${gapps.md5}</div>
                    </div>
                    <a href="${downloadUrl}" class="download-btn btn-gapps" target="_blank" rel="noopener">
                        <i class="fas fa-download"></i> Download
                    </a>
                </div>`;
        }
        if (vanilla) {
            const downloadUrl = getDownloadUrl(primaryCodename, 'vanilla', currentAndroidVersion, vanilla);
            deviceDownloadsContainer.innerHTML += `
                <div class="download-card">
                    <div class="download-title">
                        <i class="fab fa-android"></i> Vanilla Variant
                    </div>
                    <div class="download-meta">
                        <div><strong>Version:</strong> ${vanilla.version}</div>
                        <div><strong>Size:</strong> ${formatFileSize(vanilla.size)}</div>
                        <div><strong>Release Date:</strong> ${formatTimestamp(vanilla.timestamp)}</div>
                        <div><strong>MD5:</strong> ${vanilla.md5}</div>
                    </div>
                    <a href="${downloadUrl}" class="download-btn btn-vanilla" target="_blank" rel="noopener">
                        <i class="fas fa-download"></i> Download
                    </a>
                </div>`;
        }
        if (!gapps && !vanilla) {
            deviceDownloadsContainer.innerHTML = `
                <div style="padding:20px; text-align:center;">
                    <i class="fas fa-exclamation-circle" style="font-size:2rem; color:#888; margin-bottom:10px;"></i>
                    <p>No builds available for this device at the moment.</p>
                </div>
            `;
        }
        const [changelog, flashguide] = await Promise.allSettled([
            fetchContent(`${changelogDir}${primaryCodename}.txt`, 'text').catch(() => fetchContent(`${changelogDir}${primaryCodename}.md`, 'text')),
            fetchContent(`${flashguideDir}${primaryCodename}.txt`, 'text').catch(() => fetchContent(`${flashguideDir}${primaryCodename}.md`, 'text'))
        ]);
        deviceChangelogContent.innerHTML = changelog.status === 'fulfilled' && changelog.value 
            ? `<pre>${changelog.value}</pre>` 
            : '<p>No changelog available for this device.</p>';
        deviceFlashguideContent.innerHTML = flashguide.status === 'fulfilled' && flashguide.value 
            ? `<pre>${flashguide.value}</pre>` 
            : '<p>No flash guide available for this device.</p>';
    } catch (error) {
        deviceDetailsTitle.textContent = 'Error Loading Device';
        deviceDetails.innerHTML = `
            <div style="padding: 40px; text-align: center;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--danger); margin-bottom: 20px;"></i>
                <p>Failed to load device details. Please try again.</p>
                <p>${error.message}</p>
                <a href="#" class="back-to-list" id="backToListError" style="margin-top: 20px;">
                    <i class="fas fa-arrow-left"></i> Back to Devices
                </a>
            </div>
        `;
        document.getElementById('backToListError').addEventListener('click', (e) => {
            e.preventDefault();
            showDeviceList();
        });
    }
}
function switchAndroidVersion(version, codename) {
    currentAndroidVersion = version;
    if (codename) loadDeviceDetails(codename);
}
function showDeviceList() {
    devicesListing.style.display = 'block';
    deviceDetails.style.display = 'none';
    const newUrl = new URL(window.location);
    newUrl.searchParams.delete('device');
    window.history.replaceState({}, '', newUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // If devices haven't been loaded yet, ensure they get loaded
    if (!window.allDevices) {
        loadDevices();
    }
}
function setupTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`device${tabName.charAt(0).toUpperCase() + tabName.slice(1)}Content`).classList.add('active');
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    backToList.addEventListener('click', (e) => {e.preventDefault();showDeviceList();});
    window.addEventListener('popstate', (event) => {
        if (getParameterByName('device')) loadDeviceDetails(getParameterByName('device'));
        else showDeviceList();
    });
    brandCategories.addEventListener('click', (e) => {
        const brandBtn = e.target.closest('.brand-btn');
        if (!brandBtn) return;
        document.querySelectorAll('.brand-btn').forEach(btn => btn.classList.remove('active'));
        brandBtn.classList.add('active');
        const brand = brandBtn.dataset.brand;
        if (!window.allDevices) return;
        let filteredDevices = [];
        if (brand === 'all') filteredDevices = window.allDevices;
        else filteredDevices = window.allDevices.filter(device => device.brand === brand);
        displayDevices(filteredDevices);
    });
    let searchDebounce;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            if (!window.allDevices) return;
            let filteredDevices;
            if (searchTerm === '') filteredDevices = window.allDevices;
            else filteredDevices = window.allDevices.filter(device =>
                device.devicemodel.toLowerCase().includes(searchTerm) ||
                device.codename.toLowerCase().includes(searchTerm)
            );
            const activeBrandBtn = document.querySelector('.brand-btn.active');
            if (activeBrandBtn && activeBrandBtn.dataset.brand !== 'all') {
                const brand = activeBrandBtn.dataset.brand;
                filteredDevices = filteredDevices.filter(device => device.brand === brand);
            }
            displayDevices(filteredDevices);
        }, 300);
    });
    loadDevices().then(() => {
        checkUrlForDevice();
    });
});
