import React from 'react';
import { TemplateId, TemplateProps } from '../types';
import { ModernTemplate } from '../templates/ModernTemplate';
import { LuxuryTemplate } from '../templates/LuxuryTemplate';
import { BoldTemplate } from '../templates/BoldTemplate';
import { ElegantTemplate } from '../templates/ElegantTemplate';
import { MinimalistTemplate } from '../templates/MinimalistTemplate';

interface TemplateRendererProps extends TemplateProps {
  templateId: TemplateId;
}

export function TemplateRenderer({ templateId, details, image, logo, aspectRatio = 'feed', brandKit, options }: TemplateRendererProps) {
  switch (templateId) {
    case 'modern':
      return <ModernTemplate details={details} image={image} logo={logo} aspectRatio={aspectRatio} brandKit={brandKit} options={options} />;
    case 'luxury':
      return <LuxuryTemplate details={details} image={image} logo={logo} aspectRatio={aspectRatio} brandKit={brandKit} options={options} />;
    case 'bold':
      return <BoldTemplate details={details} image={image} logo={logo} aspectRatio={aspectRatio} brandKit={brandKit} options={options} />;
    case 'elegant':
      return <ElegantTemplate details={details} image={image} logo={logo} aspectRatio={aspectRatio} brandKit={brandKit} options={options} />;
    case 'minimalist':
      return <MinimalistTemplate details={details} image={image} logo={logo} aspectRatio={aspectRatio} brandKit={brandKit} options={options} />;
    default:
      return null;
  }
}
