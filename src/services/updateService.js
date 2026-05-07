const VERSION_URL = 'https://raw.githubusercontent.com/pokedesk/pokedesk/main/version.json';
const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 jam

export function getLastCheckTime() {
  const raw = localStorage.getItem('pokedesk-update-lastcheck');
  return raw ? parseInt(raw, 10) : 0;
}

export function setLastCheckTime() {
  localStorage.setItem('pokedesk-update-lastcheck', Date.now().toString());
}

export function shouldCheckForUpdate() {
  const last = getLastCheckTime();
  return Date.now() - last >= CHECK_INTERVAL;
}

export async function checkForUpdate(currentVersion) {
  try {
    const res = await fetch(VERSION_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    setLastCheckTime();

    const remoteVersion = data.latest?.version;
    if (!remoteVersion) return { hasUpdate: false };

    if (remoteVersion !== currentVersion && data.latest.isStable) {
      return {
        hasUpdate: true,
        version: remoteVersion,
        changelog: data.latest.changelog || [],
        downloadUrls: data.latest.downloadUrls || {},
      };
    }

    return { hasUpdate: false };
  } catch (err) {
    console.error('Update check failed:', err);
    return { hasUpdate: false, error: true };
  }
}

export async function downloadUpdate(urls, onProgress) {
  const sources = [urls.github, urls.googleDrive].filter(Boolean);

  for (const url of sources) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const contentLength = +res.headers.get('Content-Length') || 0;

      let received = 0;
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        received += value.length;

        if (onProgress && contentLength) {
          onProgress(Math.round((received / contentLength) * 100));
        }
      }

      return new Blob(chunks);
    } catch {
      continue;
    }
  }

  throw new Error('Semua sumber download gagal');
}
