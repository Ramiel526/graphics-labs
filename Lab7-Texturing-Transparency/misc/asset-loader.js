// AssetLoader class handles loading and storing assets
class AssetLoader {
    constructor() {
        this.assets = {};
    }

    //---------------------------------------------------------------------------
    async loadAssets(assetList) {
        try {
            const assetPromises = assetList.map(asset => {
                const { name, url, type } = asset;
                let fetchPromise;

                switch (type) {
                    case 'text':
                        fetchPromise = loadTextAsset(url).then(data => {
                            this.assets[name] = data;
                        });
                        break;
                    case 'json':
                        fetchPromise = loadJSONAsset(url).then(data => {
                            this.assets[name] = data;
                        });
                        break;
                    case 'image':
                        fetchPromise = loadImageAsset(url).then(img => {
                            this.assets[name] = img;
                        });
                        break;
                    // Add cases for other asset types as needed
                    default:
                        throw new Error(`Unknown asset type: ${type}`);
                }

                return fetchPromise;
            });

            await Promise.all(assetPromises);
            console.log('All assets loaded successfully.');
            return true;
            
        } catch (error) {
            console.error('Error loading assets:', error);

            // Attempt to detect a CORS-related issue:
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                console.warn(
                    '%c[Possible CORS Issue]',
                    'color: red; font-weight: bold;',
                    'If you are testing this locally, please run your code using a local server, such as the Live Server extension in VSCode, or another local hosting solution.'
                );
            }
            return false;
        }
    }

    // -------------------------------------------------------------------------
    getAsset(name) {
        return this.assets[name];
    }
}

// -------------------------------------------------------------------------
function loadTextAsset(url) {
    return fetch(url).then(response => {
        if (!response.ok) {
            throw new Error(`Failed to load ${url}: ${response.status} ${response.statusText}`);
        }
        return response.text();
    });
}

// -------------------------------------------------------------------------
function loadJSONAsset(url) {
    return fetch(url).then(response => {
        if (!response.ok) {
            throw new Error(`Failed to load ${url}: ${response.status} ${response.statusText}`);
        }
        return response.json();
    });
}

// -------------------------------------------------------------------------
function loadImageAsset(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
    });
}
