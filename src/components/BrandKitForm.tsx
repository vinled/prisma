import React from 'react';
import { BrandKit } from '../types';
import { LogoUploader } from './LogoUploader';

interface BrandKitFormProps {
  brandKit: BrandKit | null;
  onChange: (brandKit: BrandKit | null) => void;
}

export function BrandKitForm({ brandKit, onChange }: BrandKitFormProps) {
  const handleChange = (field: keyof BrandKit, value: any) => {
    if (!brandKit) {
      onChange({
        logo: null,
        name: '',
        creci: '',
        whatsapp: '',
        primaryColor: '#2563eb',
        secondaryColor: '#1e40af',
        isSaved: false,
        [field]: value
      });
    } else {
      onChange({ ...brandKit, [field]: value });
    }
  };

  const handleLogoChange = (logo: string | null) => {
    handleChange('logo', logo);
  };

  return (
    <div className="space-y-4">
      <LogoUploader logo={brandKit?.logo || null} onLogoChange={handleLogoChange} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
            Nome do corretor / imobiliária
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={brandKit?.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
            CRECI
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={brandKit?.creci || ''}
            onChange={(e) => handleChange('creci', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
            WhatsApp
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={brandKit?.whatsapp || ''}
            onChange={(e) => handleChange('whatsapp', e.target.value)}
            placeholder="Ex.: (11) 99999-9999"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
            Cor principal
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              className="h-9 w-9 rounded border border-gray-300 cursor-pointer"
              value={brandKit?.primaryColor || '#2563eb'}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
            />
            <span className="text-xs text-gray-500 uppercase">{brandKit?.primaryColor || '#2563eb'}</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
            Cor secundária
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              className="h-9 w-9 rounded border border-gray-300 cursor-pointer"
              value={brandKit?.secondaryColor || '#1e40af'}
              onChange={(e) => handleChange('secondaryColor', e.target.value)}
            />
            <span className="text-xs text-gray-500 uppercase">{brandKit?.secondaryColor || '#1e40af'}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center pt-2 mt-4">
        <input
          type="checkbox"
          id="saveBrandKit"
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          checked={brandKit?.isSaved || false}
          onChange={(e) => handleChange('isSaved', e.target.checked)}
        />
        <label htmlFor="saveBrandKit" className="ml-2 block text-sm text-gray-900 dark:text-zinc-300">
          Salvar como minha identidade
        </label>
      </div>
    </div>
  );
}
