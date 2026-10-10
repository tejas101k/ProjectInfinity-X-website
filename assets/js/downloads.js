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
const GITHUB_API_URL_17 = 'https://api.github.com/repos/ProjectInfinity-X/official_devices/contents/devices?ref=17';
const GITHUB_BASE_URL_MASTER = 'https://raw.githubusercontent.com/ProjectInfinity-X/official_devices/master/';
const GITHUB_BASE_URL_16 = 'https://raw.githubusercontent.com/ProjectInfinity-X/official_devices/16/';
const GITHUB_BASE_URL_17 = 'https://raw.githubusercontent.com/ProjectInfinity-X/official_devices/17/';

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
let currentAndroidVersion = '17';

/* ...UTILITIES... */

function formatFileSize(bytes) { if (bytes === 0) return '0 Bytes'; const k = 1024; const sizes = ['Bytes','KB','MB','GB']; const i = Math.floor(Math.log(bytes)/Math.log(k)); return parseFloat((bytes/Math.pow(k,i)).toFixed(2)) + ' ' + sizes[i]; }
function formatTimestamp(timestamp) { const date = new Date(timestamp * 1000); return date.toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'}); }
function getPrimaryCodename(codename) { return codename.split('/')[0].trim(); }
function getCodenameFromPath() {
    const path = window.location.pathname;
    const match = path.match(/\/downloads\/([a-zA-Z0-9_-]+)/);
    if (!match) return null;
    const codename = match[1].toLowerCase().trim();
    if (codename === 'index' || codename === 'index.html') return null;
    return match[1];
}
async function fetchContent(url, type = 'json') { if (deviceDataCache[url]) return deviceDataCache[url]; try { const response = await fetch(url); if (!response.ok) throw new Error("HTTP error! Status: "+response.status); let data; if (type === 'json') data = await response.json(); else data = await response.text(); deviceDataCache[url] = data; return data; } catch(e){return null;} }
async function fetchTextWithFallback(dir, primaryCodename) {
    const txtContent = await fetchContent(`${dir}${primaryCodename}.txt`, 'text');
    if (txtContent) return txtContent;
    return await fetchContent(`${dir}${primaryCodename}.md`, 'text');
}
function getDeviceImageUrl(primaryCodename, branch = '17') {
    if (imageCache[primaryCodename]) return imageCache[primaryCodename];
    const branchToUse = branch === 'master' ? 'master' : (branch === '16' ? '16' : '17');
    return `https://raw.githubusercontent.com/ProjectInfinity-X/official_devices/${branchToUse}/deviceimages/${primaryCodename}.webp`;
}
function getBrandFromModel(modelName) { const lowerModel = modelName.toLowerCase(); for (const [brand, keywords] of Object.entries(BRAND_CATEGORIES)) { for (const keyword of keywords) { if (lowerModel.includes(keyword)) return brand; } } return null; }
function createBrandButtons(brands) { const allBrandsBtn = document.querySelector('.brand-btn[data-brand="all"]'); brandCategories.innerHTML = ''; if(allBrandsBtn)brandCategories.appendChild(allBrandsBtn); brands.forEach(brand => { if (brand === 'All') return; const button = document.createElement('button'); button.className = 'brand-btn'; button.dataset.brand = brand; button.textContent = brand; brandCategories.appendChild(button); }); }

async function getDeviceBranchPresence(codename) {
    const url15 = `${GITHUB_BASE_URL_MASTER}devices/${codename}.json`;
    const url16 = `${GITHUB_BASE_URL_16}devices/${codename}.json`;
    const url17 = `${GITHUB_BASE_URL_17}devices/${codename}.json`;
    const [r15, r16, r17] = await Promise.all([
        fetch(url15, { method: "HEAD" }).then(r => r.ok).catch(() => false),
        fetch(url16, { method: "HEAD" }).then(r => r.ok).catch(() => false),
        fetch(url17, { method: "HEAD" }).then(r => r.ok).catch(() => false),
    ]);
    return { has15: r15, has16: r16, has17: r17 };
}

async function loadDevices() {
    loadingMessage.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    devicesGrid.innerHTML = '';

    try {
        const [masterRes, b16Res, b17Res] = await Promise.all([
            fetch(GITHUB_API_URL_MASTER),
            fetch(GITHUB_API_URL_16),
            fetch(GITHUB_API_URL_17)
        ]);
        if (!masterRes.ok || !b16Res.ok || !b17Res.ok) throw new Error("Could not fetch device lists");
        const masterFiles = await masterRes.json();
        const b16Files = await b16Res.json();
        const b17Files = await b17Res.json();

        const masterCodenames = new Set(masterFiles.filter(f => f.name.endsWith('.json')).map(f => f.name.replace('.json', '')));
        const b16Codenames = new Set(b16Files.filter(f => f.name.endsWith('.json')).map(f => f.name.replace('.json', '')));
        const b17Codenames = new Set(b17Files.filter(f => f.name.endsWith('.json')).map(f => f.name.replace('.json', '')));
        const allCodenames = Array.from(new Set([...masterCodenames, ...b16Codenames, ...b17Codenames]));
        allCodenames.sort((a, b) => a.localeCompare(b));

        const fetchPromises = allCodenames.map(async codename => {
            let info = null;
            let branch = null;
            let url = '';
            if (b17Codenames.has(codename)) {
                url = `${GITHUB_BASE_URL_17}devices/${codename}.json`;
                info = await fetchContent(url, 'json');
                branch = '17';
            } else if (b16Codenames.has(codename)) {
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
                has17: b17Codenames.has(codename),
                imageUrl: getDeviceImageUrl(getPrimaryCodename(codename), branch),
                primaryCodename: getPrimaryCodename(codename),
            };
        });

        const allDevices = (await Promise.all(fetchPromises)).filter(d => d !== null);

        const uniqueBrands = [...new Set(allDevices.map(d => d.brand).filter(Boolean))].sort();
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
                <img loading="lazy" src="${device.imageUrl}" alt="${device.devicemodel}" onerror="if(this.src.includes('/17/')){this.src='https://raw.githubusercontent.com/ProjectInfinity-X/official_devices/16/deviceimages/${device.primaryCodename}.webp';}else if(this.src.includes('/16/')){this.src='https://raw.githubusercontent.com/ProjectInfinity-X/official_devices/master/deviceimages/${device.primaryCodename}.webp';}else{this.onerror=null;}">
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
        currentAndroidVersion = '17';
        const codename = card.dataset.codename;
        const newUrl = `/downloads/${codename}`;
        window.history.pushState({ device: codename }, '', newUrl);
        loadDeviceDetails(codename);
    }
});

function getDownloadUrl(primaryCodename, variant, androidVersion, jsonData) {
    const filename = jsonData.filename;
    return `https://mirror.tejas101k.workers.dev/0:/${filename}`;
}

// --------- LOAD DEVICE DETAILS (with download link switching) ----------
async function loadDeviceDetails(codename) {
    try {
        devicesListing.style.display = 'none';
        deviceDetails.style.display = 'block';
        deviceDetailsTitle.textContent = 'Loading...';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const primaryCodename = getPrimaryCodename(codename);
        const { has15, has16, has17 } = await getDeviceBranchPresence(codename);

        if (!has15 && !has16 && !has17) throw new Error("Device not found in Android 17, 16, or 15 branch");

        let useVersion = null;
        if (currentAndroidVersion === '17' && has17) {
            useVersion = '17';
        } else if (currentAndroidVersion === '16' && has16) {
            useVersion = '16';
        } else if (currentAndroidVersion === '15' && has15) {
            useVersion = '15';
        } else if (has17) {
            useVersion = '17';
        } else if (has16) {
            useVersion = '16';
        } else if (has15) {
            useVersion = '15';
        }

        if (!useVersion) throw new Error("Device info not found for this version");
        currentAndroidVersion = useVersion;

        androidVersionButtons.innerHTML = '';

        const availableVersions = [];
        if (has17) availableVersions.push('17');
        if (has16) availableVersions.push('16');
        if (has15) availableVersions.push('15');

        if (availableVersions.length === 1) {
            const singleVer = availableVersions[0];
            const singleBtn = document.createElement('button');
            singleBtn.className = 'android-version-btn active';
            singleBtn.dataset.version = singleVer;
            singleBtn.textContent = `Android ${singleVer}`;
            androidVersionButtons.appendChild(singleBtn);
        } else {
            const dropdownContainer = document.createElement('div');
            dropdownContainer.className = 'version-dropdown-container';

            const triggerBtn = document.createElement('button');
            triggerBtn.className = 'android-version-btn active version-dropdown-trigger';
            triggerBtn.type = 'button';
            triggerBtn.setAttribute('aria-expanded', 'false');
            triggerBtn.setAttribute('aria-haspopup', 'true');

            const triggerSpan = document.createElement('span');
            triggerSpan.textContent = `Android ${useVersion}`;
            triggerBtn.appendChild(triggerSpan);
            triggerBtn.appendChild(createDropdownArrowSvg());

            const menu = document.createElement('div');
            menu.className = 'version-dropdown-menu';

            availableVersions.forEach(ver => {
                const itemBtn = document.createElement('button');
                itemBtn.className = 'version-dropdown-item' + (useVersion === ver ? ' active' : '');
                itemBtn.dataset.version = ver;
                itemBtn.type = 'button';

                const itemSpan = document.createElement('span');
                itemSpan.textContent = `Android ${ver}`;
                itemBtn.appendChild(itemSpan);

                if (useVersion === ver) {
                    itemBtn.appendChild(createCheckSvg());
                }

                itemBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    closeAllVersionDropdowns();
                    if (ver !== currentAndroidVersion) {
                        switchAndroidVersion(ver, codename);
                    }
                });

                menu.appendChild(itemBtn);
            });

            triggerBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = menu.classList.contains('show');
                closeAllVersionDropdowns();
                if (!isOpen) {
                    menu.classList.add('show');
                    triggerBtn.classList.add('open');
                    triggerBtn.setAttribute('aria-expanded', 'true');
                }
            });

            dropdownContainer.appendChild(triggerBtn);
            dropdownContainer.appendChild(menu);
            androidVersionButtons.appendChild(dropdownContainer);
        }

        const baseUrl = useVersion === '17'
            ? GITHUB_BASE_URL_17
            : (useVersion === '16' ? GITHUB_BASE_URL_16 : GITHUB_BASE_URL_MASTER);

        const devicesDir = baseUrl + 'devices/';
        const gappsDir = baseUrl + 'gapps/';
        const vanillaDir = baseUrl + 'vanilla/';
        const changelogDir = baseUrl + 'changelog/';
        const flashguideDir = baseUrl + 'flashguide/';

        deviceDetailsImage.src = getDeviceImageUrl(primaryCodename, useVersion);
        deviceDetailsImage.onerror = function() {
            if (this.src.includes('/17/')) {
                this.src = `https://raw.githubusercontent.com/ProjectInfinity-X/official_devices/16/deviceimages/${primaryCodename}.webp`;
            } else if (this.src.includes('/16/')) {
                this.src = `https://raw.githubusercontent.com/ProjectInfinity-X/official_devices/master/deviceimages/${primaryCodename}.webp`;
            } else {
                this.onerror = null;
            }
        };

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
            fetchTextWithFallback(changelogDir, primaryCodename),
            fetchTextWithFallback(flashguideDir, primaryCodename)
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
function createDropdownArrowSvg() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'dropdown-arrow');
    svg.setAttribute('width', '12');
    svg.setAttribute('height', '12');
    svg.setAttribute('viewBox', '0 0 12 12');
    svg.setAttribute('fill', 'none');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M2.5 4.5L6 8L9.5 4.5');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');

    svg.appendChild(path);
    return svg;
}

function createCheckSvg() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'item-check');
    svg.setAttribute('width', '14');
    svg.setAttribute('height', '14');
    svg.setAttribute('viewBox', '0 0 14 14');
    svg.setAttribute('fill', 'none');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M2.5 7.5L5.5 10.5L11.5 3.5');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');

    svg.appendChild(path);
    return svg;
}

function closeAllVersionDropdowns() {
    document.querySelectorAll('.version-dropdown-menu.show').forEach(m => m.classList.remove('show'));
    document.querySelectorAll('.version-dropdown-trigger.open').forEach(t => {
        t.classList.remove('open');
        t.setAttribute('aria-expanded', 'false');
    });
}
function switchAndroidVersion(version, codename) {
    currentAndroidVersion = version;
    if (codename) loadDeviceDetails(codename);
}
function showDeviceList() {
    closeAllVersionDropdowns();
    devicesListing.style.display = 'block';
    deviceDetails.style.display = 'none';
    currentAndroidVersion = '17';
    window.history.replaceState({}, '', '/downloads/');
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
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.version-dropdown-container')) {
            closeAllVersionDropdowns();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllVersionDropdowns();
        }
    });
    window.addEventListener('resize', closeAllVersionDropdowns);

    backToList.addEventListener('click', (e) => {e.preventDefault();showDeviceList();});
    window.addEventListener('popstate', (event) => {
        const codename = getCodenameFromPath();
        if (codename) {
            currentAndroidVersion = '17';
            loadDeviceDetails(codename);
        } else {
            showDeviceList();
        }
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
    const codename = getCodenameFromPath();
    if (codename) loadDeviceDetails(codename);
    loadDevices();
});