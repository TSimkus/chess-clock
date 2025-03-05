let wakeLock: WakeLockSentinel | null = null;

const wakeLockSupported = () => ("wakeLock" in navigator)

export const keepSceenAwake = async () => {
  if (!wakeLockSupported) {
    console.warn('Wake lock is not supported for this device');
    return;
  }

  try {
    wakeLock = await navigator.wakeLock.request('screen');
  } catch (error: any) {
    console.error(`Wake lock failed: ${error.name}, ${error.message}`);
  }

  return wakeLock;
}

