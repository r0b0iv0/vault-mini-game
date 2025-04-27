export function waitXSeconds(seconds: number) {
    return new Promise<void>((resolve) => {
      const start = performance.now();
      
      function checkTime(currentTime: any) {
        if (currentTime - start >= seconds * 1000) {
          resolve();
        } else {
          requestAnimationFrame(checkTime);
        }
      }
      
      requestAnimationFrame(checkTime);
    });
  }