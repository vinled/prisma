/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import domtoimage from 'dom-to-image-more';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Download, Layout, Moon, Sun } from 'lucide-react';
import { PrismaLogo } from './components/PrismaLogo';
import { PropertyDetails, TemplateId, AspectRatioId, BrandKit, TemplateOptions, SavedProperty } from './types';
import { PropertyForm } from './components/PropertyForm';
import { BrandKitForm } from './components/BrandKitForm';
import { ImageUploader } from './components/ImageUploader';
import { TemplateSelector } from './components/TemplateSelector';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { TemplateRenderer } from './components/TemplateRenderer';
import { MyProperties } from './components/MyProperties';

export default function App() {
  const [activeTab, setActiveTab] = useState<'criacao' | 'meus_imoveis'>('criacao');
  const [details, setDetails] = useState<PropertyDetails>({
    title: '',
    price: '',
    neighborhood: '',
    city: '',
    state: '',
    area: '',
    bedrooms: '',
    suites: '',
    bathrooms: '',
    parking: '',
    propertyCode: '',
    propertyType: '',
    propertySubtype: '',
    amenities: [],
    differentials: [],
    leisureArea: null,
    whatsapp: '',
  });
  
  const [brandKit, setBrandKit] = useState<BrandKit | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioId>('feed');
  const [templateOptions, setTemplateOptions] = useState<TemplateOptions>({
    gradientOpacity: 60,
    imagePositionX: 50,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('prisma_imoveis');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved properties', e);
        }
      }
    }
    return [];
  });
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const previewRef = useRef<HTMLDivElement>(null);
  const hiddenRenderersRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!hiddenRenderersRef.current) return;
    
    const postElements = hiddenRenderersRef.current.querySelectorAll('.post-template-export');
    if (!postElements || postElements.length === 0) {
      alert('Nenhuma imagem para exportar.');
      return;
    }

    try {
      setIsExporting(true);
      

    const savePropertyData = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
      
      const newProperty: SavedProperty = {
        id: Date.now().toString(),
        date: dateStr,
        details,
        selectedTemplate,
        aspectRatio,
        templateOptions
      };
      
      const updated = [newProperty, ...savedProperties];
      setSavedProperties(updated);
      localStorage.setItem('prisma_imoveis', JSON.stringify(updated));
    };
    
    savePropertyData();
    
      const scale = 2; // Export at 2x resolution
      
      const baseWidth = 540;
      const baseHeight = aspectRatio === 'story' ? 960 : 540;
      
      const options = {
        width: baseWidth * scale,
        height: baseHeight * scale,
        style: { 
          transform: `scale(${scale})`, 
          transformOrigin: 'top left',
          width: `${baseWidth}px`,
          height: `${baseHeight}px`
        }
      };
      
      if (postElements.length === 1) {
        const dataUrl = await domtoimage.toPng(postElements[0] as HTMLElement, options);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `post-imovel-1.png`;
        link.click();
      } else {
        const zip = new JSZip();
        
        for (let i = 0; i < postElements.length; i++) {
          const el = postElements[i] as HTMLElement;
          const dataUrl = await domtoimage.toPng(el, options);
          const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
          zip.file(`post-imovel-${i + 1}.png`, base64Data, { base64: true });
        }
        
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `posts-imoveis.zip`);
      }
    } catch (error) {
      console.error('Failed to export image:', error);
      alert('Erro ao gerar a imagem. Verifique se há imagens e tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleEdit = (prop: SavedProperty) => {
    setDetails(prop.details);
    setSelectedTemplate(prop.selectedTemplate);
    setAspectRatio(prop.aspectRatio);
    setTemplateOptions(prop.templateOptions);
    setActiveTab('criacao');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este imóvel salvo?')) {
      const updated = savedProperties.filter(p => p.id !== id);
      setSavedProperties(updated);
      localStorage.setItem('prisma_imoveis', JSON.stringify(updated));
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-200 overflow-hidden text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col transition-colors duration-200 shrink-0">
        <div className="p-6">
          <PrismaLogo />
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button
            onClick={() => setActiveTab('meus_imoveis')}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
              activeTab === 'meus_imoveis' 
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-semibold' 
                : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Layout className="w-5 h-5 mr-3" />
            Meus Imóveis
          </button>
          <button
            onClick={() => setActiveTab('criacao')}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
              activeTab === 'criacao' 
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-semibold' 
                : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Criação Rápida
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5 mr-2" /> : <Moon className="w-5 h-5 mr-2" />}
            {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'meus_imoveis' ? (
          <MyProperties properties={savedProperties} onEdit={handleEdit} onDelete={handleDelete} />
        ) : (
          <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Criação Rápida</h1>
                <p className="text-gray-500 dark:text-zinc-400">Posts profissionais para imóveis em segundos</p>
              </div>
            </header>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12">
          
          {/* Controls Side */}
          <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
            <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Identidade da marca</h2>
              <BrandKitForm brandKit={brandKit} onChange={setBrandKit} />
            </section>

            <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">1. Imagens</h2>
              <ImageUploader images={images} onImagesChange={setImages} />
            </section>

            <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">2. Informações</h2>
              <PropertyForm details={details} brandKit={brandKit} onChange={setDetails} />
            </section>

            <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Estilo</h2>
              <TemplateSelector selected={selectedTemplate} onSelect={setSelectedTemplate} />
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-zinc-300 mb-3">Formato</h3>
                <AspectRatioSelector selected={aspectRatio} onSelect={setAspectRatio} />
              </div>
              
              {['modern', 'elegant', 'luxury', 'bold', 'minimalist'].includes(selectedTemplate) && (
                <div className="mt-6 space-y-4 pt-6 border-t border-gray-100 dark:border-zinc-800">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-zinc-300">Ajustes da Imagem</h3>
                  
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-zinc-400 mb-1">
                      <label>Posição da Foto (Esquerda - Direita)</label>
                      <span>{templateOptions.imagePositionX}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={templateOptions.imagePositionX} 
                      onChange={(e) => setTemplateOptions({...templateOptions, imagePositionX: Number(e.target.value)})}
                      className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-zinc-400 mb-1">
                      <label>Escurecimento (Degradê)</label>
                      <span>{templateOptions.gradientOpacity}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={templateOptions.gradientOpacity} 
                      onChange={(e) => setTemplateOptions({...templateOptions, gradientOpacity: Number(e.target.value)})}
                      className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Preview Side */}
          <div className="lg:col-span-7 order-1 lg:order-2 lg:sticky lg:top-6 lg:self-start w-full">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col transition-colors duration-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pré-visualização do Post</h2>
                <button
                  onClick={handleDownload}
                  disabled={isExporting || images.length === 0}
                  className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting ? 'Gerando...' : (images.length > 1 ? `Baixar Zip (${images.length})` : 'Baixar imagem')}
                </button>
              </div>

              {images.length > 1 && (
                <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPreviewIndex(idx)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${previewIndex === idx ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-300 dark:hover:bg-zinc-700'}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              )}

              {/* The Preview Area */}
              <div className="w-full flex-grow flex items-center justify-center bg-gray-100 dark:bg-zinc-950 rounded-xl overflow-hidden relative p-4 transition-colors duration-200">
                {images.length > 0 ? (
                  <div 
                    className={`w-full ${aspectRatio === 'story' ? 'max-w-[320px] aspect-[9/16]' : 'max-w-[500px] aspect-square'} flex items-center justify-center relative shadow-sm transition-all duration-300`}
                    ref={previewRef}
                  >
                    <TemplateRenderer 
                      templateId={selectedTemplate} 
                      details={details} 
                      image={images[previewIndex] || null} 
                      logo={brandKit?.logo || null}
                      aspectRatio={aspectRatio}
                      brandKit={brandKit}
                      options={templateOptions}
                    />
                  </div>
                ) : (
                  <div className="text-gray-400 text-center">
                    <p>Adicione fotos para visualizar</p>
                  </div>
                )}
              </div>
              <p className="text-center text-sm text-gray-400 mt-4">
                {images.length > 0 
                  ? `O post será gerado no formato ${aspectRatio === 'story' ? 'Story (9:16)' : 'Quadrado (1:1)'}.`
                  : 'Nenhuma foto selecionada.'}
              </p>
            </div>
          </div>
        </div>
        </div>
      )}</main>
            {/* Hidden containers for export */}
      <div 
        ref={hiddenRenderersRef} 
        className="fixed top-0 left-0 pointer-events-none opacity-0 -z-50 flex flex-col"
      >
        {images.map((img, idx) => (
          <div 
            key={idx} 
            className="post-template-export relative"
            style={{ 
              width: '540px', 
              height: aspectRatio === 'story' ? '960px' : '540px',
              fontSize: '16px' // Keep standard base font size
            }}
          >
            <TemplateRenderer 
              templateId={selectedTemplate} 
              details={details} 
              image={img} 
              logo={brandKit?.logo || null}
              aspectRatio={aspectRatio}
              brandKit={brandKit}
              options={templateOptions}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
