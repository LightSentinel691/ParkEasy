import { useState, useEffect } from "react";

const useImageLoader = (imageUrl) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadImage = () =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
          resolve(imageUrl), 2000;
        }
        img.onerror = reject;
      });

    loadImage()
      .then((src) => {
        if (isMounted) {
          setImageSrc(src);
          setImageLoaded(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setImageLoaded(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [imageUrl]);

  return { imageLoaded, imageSrc };
};

export default useImageLoader;

