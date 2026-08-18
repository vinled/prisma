import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Text, Rect, Group } from 'react-konva';
import { TemplateProps } from '../types';

function useImage(url: string | null) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!url) {
      setImage(null);
      return;
    }
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = () => {
      setImage(img);
    };
  }, [url]);
  return image;
}

interface KonvaCardProps extends TemplateProps {
  scale?: number;
  stageRef?: React.RefObject<any>;
}

export function KonvaCard({ details, image, logo, aspectRatio, brandKit, scale = 1, stageRef }: KonvaCardProps) {
  const bgImg = useImage(image);
  const logoImg = useImage(logo);

  const baseWidth = 1080;
  const baseHeight = aspectRatio === 'story' ? 1920 : 1080;
  const primaryColor = brandKit?.primaryColor || '#2563eb';

  // Format tags
  const allTags = [...(details.amenities || []), ...(details.differentials || [])];
  const tagsString = allTags.slice(0, 5).join(' • ');
  
  const neighborhood = details.neighborhood || '';
  const city = details.city || '';
  const stateStr = details.state || '';
  const locArr = [neighborhood, city, stateStr].filter(Boolean);
  const locationString = locArr.join(', ');

  const titleText = details.title || '';
  const priceText = details.price || '';
  const codeText = details.propertyCode ? `Cód. ${details.propertyCode}` : '';

  const bedrooms = details.bedrooms;
  const suites = details.suites;
  const bathrooms = details.bathrooms;
  const parking = details.parking;
  const area = details.area;

  let feats = [];
  if (area?.trim()) feats.push(`${area} m²`);
  if (bedrooms?.trim()) feats.push(`${bedrooms} ${Number(bedrooms) !== 1 ? 'Dorms' : 'Dorm'}`);
  if (suites?.trim()) feats.push(`${suites} ${Number(suites) !== 1 ? 'Suítes' : 'Suíte'}`);
  else if (bathrooms?.trim()) feats.push(`${bathrooms} ${Number(bathrooms) !== 1 ? 'Banhs' : 'Banh'}`);
  if (parking?.trim()) feats.push(`${parking} ${Number(parking) !== 1 ? 'Vagas' : 'Vaga'}`);
  
  const featsStr = feats.join(' | ');
  const whatsapp = details.whatsapp || brandKit?.whatsapp;

  // Background image cropping logic to emulate object-cover
  let crop = { x: 0, y: 0, width: 1, height: 1 };
  if (bgImg) {
    const imgRatio = bgImg.width / bgImg.height;
    const stageRatio = baseWidth / baseHeight;
    if (imgRatio > stageRatio) {
      const newWidth = bgImg.height * stageRatio;
      crop = {
        x: (bgImg.width - newWidth) / 2,
        y: 0,
        width: newWidth,
        height: bgImg.height
      };
    } else {
      const newHeight = bgImg.width / stageRatio;
      crop = {
        x: 0,
        y: (bgImg.height - newHeight) / 2,
        width: bgImg.width,
        height: newHeight
      };
    }
  }

  return (
    <Stage width={baseWidth * scale} height={baseHeight * scale} scaleX={scale} scaleY={scale} ref={stageRef}>
      <Layer>
        {/* Background */}
        <Rect width={baseWidth} height={baseHeight} fill="#18181b" />
        
        {bgImg && (
          <KonvaImage 
            image={bgImg} 
            x={0} 
            y={0} 
            width={baseWidth} 
            height={baseHeight} 
            crop={crop}
          />
        )}

        {/* Top Gradient */}
        <Rect
          x={0}
          y={0}
          width={baseWidth}
          height={baseHeight * 0.3}
          fillLinearGradientStartPoint={{ x: 0, y: 0 }}
          fillLinearGradientEndPoint={{ x: 0, y: baseHeight * 0.3 }}
          fillLinearGradientColorStops={[0, 'rgba(0,0,0,0.8)', 1, 'rgba(0,0,0,0)']}
        />

        {/* Bottom Gradient */}
        <Rect
          x={0}
          y={baseHeight * 0.4}
          width={baseWidth}
          height={baseHeight * 0.6}
          fillLinearGradientStartPoint={{ x: 0, y: baseHeight * 0.4 }}
          fillLinearGradientEndPoint={{ x: 0, y: baseHeight }}
          fillLinearGradientColorStops={[0, 'rgba(0,0,0,0)', 0.5, 'rgba(0,0,0,0.7)', 1, 'rgba(0,0,0,0.95)']}
        />

        {/* Logo */}
        {logoImg && (
          <KonvaImage 
            image={logoImg} 
            x={80} 
            y={80} 
            width={logoImg.width > 200 ? 200 : logoImg.width} 
            height={logoImg.width > 200 ? logoImg.height * (200 / logoImg.width) : logoImg.height} 
          />
        )}

        {/* WhatsApp Top Right */}
        {whatsapp && (
          <Group x={baseWidth - 280} y={80}>
            <Rect width={220} height={50} fill="rgba(0,0,0,0.5)" cornerRadius={25} />
            <Text 
              text={whatsapp} 
              x={10} 
              y={14} 
              width={200}
              align="center"
              fontSize={22} 
              fill="#fff" 
              fontFamily="sans-serif"
              fontStyle="bold"
            />
          </Group>
        )}

        {/* Bottom content Group */}
        <Group x={80} y={baseHeight - 380}>
          {/* Title / Chamada */}
          {titleText && (
            <Group y={-60}>
              <Rect 
                width={titleText.length * 16 + 40} 
                height={45} 
                fill={primaryColor} 
                cornerRadius={22.5} 
              />
              <Text 
                text={titleText.toUpperCase()} 
                x={20} 
                y={13} 
                fontSize={20} 
                fill="#ffffff" 
                fontFamily="sans-serif"
                fontStyle="bold"
                letterSpacing={2}
              />
            </Group>
          )}

          {/* Location */}
          {locationString && (
            <Text 
              text={locationString} 
              y={0} 
              fontSize={32} 
              fill="#e4e4e7" 
              fontFamily="sans-serif"
            />
          )}

          {/* Price */}
          {priceText && (
            <Text 
              text={priceText} 
              y={40} 
              fontSize={100} 
              fill="#ffffff" 
              fontFamily="sans-serif"
              fontStyle="900"
            />
          )}

          {/* Features */}
          {featsStr && (
            <Text 
              text={featsStr} 
              y={170} 
              fontSize={32} 
              fill="#ffffff" 
              fontFamily="sans-serif"
              fontStyle="bold"
            />
          )}

          {/* Differentials */}
          {tagsString && (
            <Text 
              text={tagsString} 
              y={230} 
              fontSize={24} 
              fill="#d4d4d8" 
              fontFamily="sans-serif"
              width={baseWidth - 160}
            />
          )}

          {/* Code */}
          {codeText && (
            <Text 
              text={codeText} 
              x={baseWidth - 160 - 80}
              y={260} 
              fontSize={24} 
              fill="#ffffff" 
              fontFamily="Arial"
              fontStyle="bold"
              align="right"
              width={160}
            />
          )}
        </Group>

      </Layer>
    </Stage>
  );
}
