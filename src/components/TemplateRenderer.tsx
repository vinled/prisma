import React from 'react';
import { TemplateId, TemplateProps } from '../types';
import { useSafeImage } from '../hooks/useSafeImage';
import { ModernTemplate } from '../templates/ModernTemplate';
import { LuxuryTemplate } from '../templates/LuxuryTemplate';
import { BoldTemplate } from '../templates/BoldTemplate';
import { ElegantTemplate } from '../templates/ElegantTemplate';
import { MinimalistTemplate } from '../templates/MinimalistTemplate';
import { MyWayTemplate } from '../templates/MyWayTemplate';

interface TemplateRendererProps extends TemplateProps {
  templateId: TemplateId;
}

export function TemplateRenderer({ templateId, details, image, logo, aspectRatio = 'feed', brandKit, options, userPlan = 'free' }: TemplateRendererProps) {
  const safeImage = useSafeImage(image);
  const safeLogo = useSafeImage(logo, true);

  let TemplateComponent = null;

  switch (templateId) {
    case 'modern':
      TemplateComponent = <ModernTemplate details={details} image={safeImage} logo={safeLogo} aspectRatio={aspectRatio} brandKit={brandKit} options={options} userPlan={userPlan} />;
      break;
    case 'luxury':
      TemplateComponent = <LuxuryTemplate details={details} image={safeImage} logo={safeLogo} aspectRatio={aspectRatio} brandKit={brandKit} options={options} userPlan={userPlan} />;
      break;
    case 'bold':
      TemplateComponent = <BoldTemplate details={details} image={safeImage} logo={safeLogo} aspectRatio={aspectRatio} brandKit={brandKit} options={options} userPlan={userPlan} />;
      break;
    case 'elegant':
      TemplateComponent = <ElegantTemplate details={details} image={safeImage} logo={safeLogo} aspectRatio={aspectRatio} brandKit={brandKit} options={options} userPlan={userPlan} />;
      break;
    case 'minimalist':
      TemplateComponent = <MinimalistTemplate details={details} image={safeImage} logo={safeLogo} aspectRatio={aspectRatio} brandKit={brandKit} options={options} userPlan={userPlan} />;
      break;
    case 'myway':
      TemplateComponent = <MyWayTemplate details={details} image={safeImage} logo={safeLogo} aspectRatio={aspectRatio} brandKit={brandKit} options={options} userPlan={userPlan} />;
      break;
  }

  if (!TemplateComponent) return null;

  return (
    <>
      {TemplateComponent}
      {userPlan !== 'pro' && (
        <div 
          style={{
            position: 'absolute',
            bottom: aspectRatio === 'story' ? '44px' : '36px',
            right: '48px',
            fontSize: aspectRatio === 'story' ? '24px' : '20px',
            color: 'rgba(255, 255, 255, 0.75)',
            textShadow: '0px 2px 6px rgba(0, 0, 0, 0.95), 0px 1px 2px rgba(0, 0, 0, 0.8)',
            zIndex: 9999,
            pointerEvents: 'none',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontWeight: 500,
            letterSpacing: '0.02em',
            userSelect: 'none'
          }}
        >
          Criado com PostNaMão
        </div>
      )}
    </>
  );
}
