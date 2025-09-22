
"use client";

import { useState, useEffect, useRef } from "react";
import FOG from "vanta/dist/vanta.fog.min";
import * as THREE from "three";
import { usePathname } from "next/navigation";

export const FogAnimation = () => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!vantaEffect && window.innerWidth > 1024) {
      setVantaEffect(
        FOG({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          highlightColor: 0xd4a7f0,
          midtoneColor: 0x63c5b7,
          lowlightColor: 0x568bfa,
          baseColor: 0xffffff,
          blurFactor: 0.73,
          speed: 2.10,
          zoom: 0.50,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  useEffect(() => {
    if (vantaEffect) {
      // Short delay to allow page content to render before resizing
      const timer = setTimeout(() => {
        vantaEffect.resize();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pathname, vantaEffect]);


  return (
    <div ref={vantaRef} className="absolute inset-0 -z-10" >
      <div className="absolute inset-x-0 bottom-0 h-64 wave-bg -z-10 opacity-70"></div>
      <div className="absolute inset-x-0 top-0 h-64 wave-bg-top -z-10 opacity-70"></div>
    </div>
  );
};
