/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Download, Layout, Moon, Sun, Copy, Check, LogOut, User, Menu, X, PlusSquare, Palette, Share2 } from 'lucide-react';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { ResetPassword } from './components/ResetPassword';
import { Session } from '@supabase/supabase-js';
import { PostNaMaoLogo } from './components/PostNaMaoLogo';
import { PropertyDetails, TemplateId, AspectRatioId, BrandKit, TemplateOptions, SavedProperty } from './types';
import { PropertyForm } from './components/PropertyForm';
import { BrandKitForm } from './components/BrandKitForm';
import { ImageUploader } from './components/ImageUploader';
import { TemplateSelector } from './components/TemplateSelector';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { TemplateRenderer } from './components/TemplateRenderer';
import { MyProperties } from './components/MyProperties';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MyAccount } from './components/MyAccount';
import { PaywallModal } from './components/PaywallModal';
import { LandingPage } from './components/LandingPage';
import { TermosDeUso } from './components/TermosDeUso';
import { PoliticaPrivacidade } from './components/PoliticaPrivacidade';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<'criacao' | 'meus_imoveis' | 'minha_marca' | 'minha_conta'>('criacao');
  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
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
  
  const [brandKit, setBrandKit] = useState<BrandKit | null>(() => {
    const saved = localStorage.getItem('globalBrandKit');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  
  useEffect(() => {
    if (brandKit) {
      localStorage.setItem('globalBrandKit', JSON.stringify(brandKit));
    } else {
      localStorage.removeItem('globalBrandKit');
    }
  }, [brandKit]);
  
  const [applyBrandKit, setApplyBrandKit] = useState(true);
  const [userPlan, setUserPlan] = useState<'free' | 'pro'>('free');
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioId>('feed');
  const [seloAtivo, setSeloAtivo] = useState("");
  const [templateOptions, setTemplateOptions] = useState<TemplateOptions>({
    gradientOpacity: 60,
    imagePositionX: 50,
  });

  const [generatedCaption, setGeneratedCaption] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const [targetAudience, setTargetAudience] = useState('Família/Conforto');
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [destinoCopy, setDestinoCopy] = useState('instagram');

  const handleGenerateCopy = async () => {
    if (userPlan !== 'pro') {
      alert('Recurso exclusivo do Plano Pro. Faça o upgrade para usar a IA!');
      setIsPaywallOpen(true);
      return;
    }
    if (userPlan === 'free' && targetAudience.includes('(Pro)')) {
      setIsPaywallOpen(true);
      return;
    }
    setIsGeneratingCopy(true);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const diffsStr = [...(details.differentials || []), ...(details.amenities || [])].join(", ");
      
      let regrasDeFormato = '';
      if (destinoCopy === 'instagram') {
        regrasDeFormato = "Formate como um post de Instagram. Use parágrafos curtos, emojis espaçados para leitura fluida, inclua hashtags relevantes no final e crie uma chamada para ação (CTA) convidando para comentar ou enviar direct.";
      } else if (destinoCopy === 'whatsapp') {
        regrasDeFormato = "Formate como uma mensagem privada de WhatsApp enviada de um corretor para um cliente vip. Seja extremamente direto, persuasivo e curto. NÃO use hashtags. Use formatação nativa do WhatsApp (ex: *negrito* para o preço e destaques). Termine com uma pergunta fechada de engajamento, como 'Podemos agendar uma visita amanhã?' ou 'Faz sentido para você?'";
      }

      const promptText = `Você é um copywriter de alto padrão no mercado imobiliário. Crie um texto para o imóvel com os dados: Tipo: ${details.propertyType || 'Imóvel'}, Bairro: ${details.neighborhood || 'Não informado'}, Quartos: ${details.bedrooms || 'Não informado'}, Vagas: ${details.parking || 'Não informado'}, Preço: ${details.price || 'Não informado'}, Diferenciais: [${diffsStr}]. ${regrasDeFormato} O Tom do texto deve ser: ${targetAudience}. Adicione CTA para este WhatsApp: ${details.whatsapp || (applyBrandKit ? brandKit?.whatsapp : '') || ''}. Não invente dados.`;


      const model = genAI.getGenerativeModel({ model: 'gemini-3.7-flash' });
      const result = await model.generateContent(promptText);
      const textoFinal = result.response.text();
      
      setGeneratedCaption(textoFinal);
    } catch (error: any) {
      console.error('ERRO DETALHADO DA API:', error);
      alert('Erro do Google: ' + (error.message || JSON.stringify(error)));
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(generatedCaption).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };
  const [isExporting, setIsExporting] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('postnamao_imoveis');
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
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const hiddenRenderersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScale = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.getBoundingClientRect().width;
        // The container has p-4 (16px padding on each side), so subtract 32px for the actual content area
        const contentWidth = containerWidth - 32;
        let scaleByWidth = contentWidth / 1080;
        
        // Mobile vertical height constraint (max 35% of vh to leave space for form)
        const isMobile = window.innerWidth < 1024; // lg breakpoint is 1024px
        let scale = scaleByWidth;
        
        if (isMobile) {
           const maxMobileHeight = window.innerHeight * 0.40;
           const targetHeight = aspectRatio === 'story' ? 1920 : 1080;
           const scaleByHeight = maxMobileHeight / targetHeight;
           scale = Math.min(scaleByWidth, scaleByHeight);
        }
        
        if (scale <= 0) scale = 0.1;
        setPreviewScale(scale);
      }
    };
    
    updateScale(); // Initial call
    
    const observer = new ResizeObserver(() => {
      updateScale();
    });
    
    if (previewContainerRef.current) {
      observer.observe(previewContainerRef.current);
    }
    
    window.addEventListener('resize', updateScale);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [images.length, aspectRatio]); // Re-run if images or aspectRatio change


  
  const executeSave = async (): Promise<boolean> => {
    if (userPlan !== 'pro' && !idEmEdicao && savedProperties.length >= 10) {
      alert('Limite do plano Grátis atingido (10 artes). Assine o PostNaMão Pro!');
      setIsPaywallOpen(true);
      return false;
    }

    return new Promise((resolve) => {
      const finalizeSave = () => {
        const now = new Date();
        const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
        
        let finalThumbnail = images[0] || undefined;
        if (finalThumbnail === undefined && idEmEdicao) {
          finalThumbnail = savedProperties.find(p => p.id === idEmEdicao)?.thumbnail;
        }
        
        const propertyData: SavedProperty = {
          id: idEmEdicao || Date.now().toString(),
          date: dateStr,
          details,
          selectedTemplate,
          aspectRatio,
          templateOptions,
          thumbnail: finalThumbnail
        };
        
        let updated;
        if (idEmEdicao) {
          updated = savedProperties.map(p => p.id === idEmEdicao ? propertyData : p);
        } else {
          updated = [propertyData, ...savedProperties];
        }
        
        setSavedProperties(updated);
        localStorage.setItem('postnamao_imoveis', JSON.stringify(updated));
        resolve(true);
      };

      if (images.length > 0) {
        finalizeSave();
      } else {
        finalizeSave();
      }
    });
  };

  const handleSaveOnly = async () => {
    const success = await executeSave();
    if (success) {
      alert('Alterações salvas com sucesso!');
    }
  };

    const handleShare = async () => {
    if (!hiddenRenderersRef.current) return;
    
    const postElements = hiddenRenderersRef.current.querySelectorAll('.post-template-export');
    if (!postElements || postElements.length === 0) {
      alert('Nenhuma imagem para exportar.');
      return;
    }

    try {
      setIsExporting(true);
      const success = await executeSave();
      if (!success) {
        setIsExporting(false);
        return;
      }
      
      const scale = 1; 
      const baseWidth = 1080;
      const baseHeight = aspectRatio === 'story' ? 1920 : 1080;
      
      const options = {
        width: baseWidth,
        height: baseHeight,
        pixelRatio: scale
      };

      const dataUrl = await htmlToImage.toPng(postElements[0], options);
      
      // Attempt to share
      if (navigator.share && navigator.canShare) {
        try {
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          const imageFile = new File([blob], 'post-imovel.png', { type: 'image/png' });
          
          if (navigator.canShare({ files: [imageFile] })) {
            if (generatedCaption) {
              await navigator.clipboard.writeText(generatedCaption);
              alert('Legenda copiada! Escolha onde compartilhar.');
            }
            await navigator.share({
              files: [imageFile],
              title: 'Post PostNaMão'
            });
            return;
          }
        } catch (shareError) {
          console.error("Share failed", shareError);
        }
      }
      
      // Fallback: download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `post-imovel-1.png`;
      link.click();
    } catch (error) {
      console.error('Erro na exportação:', error);
      alert('Ocorreu um erro ao gerar a imagem.');
    } finally {
      setIsExporting(false);
    }
  };

const handleDownload = async () => {
    if (!hiddenRenderersRef.current) return;
    
    const postElements = hiddenRenderersRef.current.querySelectorAll('.post-template-export');
    if (!postElements || postElements.length === 0) {
      alert('Nenhuma imagem para exportar.');
      return;
    }

    try {
      setIsExporting(true);
      const success = await executeSave();
      if (!success) {
        setIsExporting(false);
        return;
      }
      
      const scale = 1; // Export at 1x resolution because base is 1080px
      const baseWidth = 1080;
      const baseHeight = aspectRatio === 'story' ? 1920 : 1080;
      
      const options = {
        width: baseWidth,
        height: baseHeight,
        pixelRatio: scale
      };
      
      if (postElements.length === 1) {
        const dataUrl = await htmlToImage.toPng(postElements[0] as HTMLElement, options);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `post-imovel-1.png`;
        link.click();
      } else {
        const zip = new JSZip();
        
        for (let i = 0; i < postElements.length; i++) {
          const el = postElements[i] as HTMLElement;
          const dataUrl = await htmlToImage.toPng(el, options);
          const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
          zip.file(`post-imovel-${i + 1}.png`, base64Data, { base64: true });
        }
        
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `posts-imoveis.zip`);
      }
      
      // If we were creating a new one, we could set idEmEdicao to the new ID, 
      // but it's fine to leave it to clear on next '+ Criação'.
    } catch (error) {
      console.error('Failed to export image:', error);
      alert('Erro ao gerar a imagem. Verifique se há imagens e tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleEdit = (prop: SavedProperty) => {
    setPreviewIndex(0);
    setImages(prop.thumbnail ? [prop.thumbnail] : []);
    setIdEmEdicao(prop.id);
    setDetails(prop.details);
    setSelectedTemplate(prop.selectedTemplate);
    setAspectRatio(prop.aspectRatio);
    setTemplateOptions(prop.templateOptions);
    setActiveTab('criacao');
  };

  const handleDelete = (id: string) => {
    const updated = savedProperties.filter(p => p.id !== id);
    setSavedProperties(updated);
    localStorage.setItem('postnamao_imoveis', JSON.stringify(updated));
  };

  
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      const path = window.location.pathname;
      if (!session && path !== '/' && path !== '/reset-password' && path !== '/termos' && path !== '/privacidade') {
        window.history.replaceState({}, '', '/');
        setShowAuth(true);
      }
    };
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      
      const path = window.location.pathname;
      if (!session && path !== '/' && path !== '/reset-password' && path !== '/termos' && path !== '/privacidade') {
        window.history.replaceState({}, '', '/');
        setShowAuth(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (window.location.pathname === '/reset-password') {
    return <ResetPassword />;
  }

  if (window.location.pathname === '/termos') {
    return <TermosDeUso />;
  }

  if (window.location.pathname === '/privacidade') {
    return <PoliticaPrivacidade />;
  }

  const isValidSession = session && session.user && session.user.email;

  if (!isValidSession) {
    if (showAuth) {
      return <Auth onBack={() => setShowAuth(false)} />;
    }
    return <LandingPage onLoginClick={() => setShowAuth(true)} />;
  }

  return (
    <>
      <PaywallModal 
        isOpen={isPaywallOpen} 
        onClose={() => setIsPaywallOpen(false)}
        onUpgrade={() => {
          setIsPaywallOpen(false);
          setActiveTab('minha_conta');
        }}
      />
      <div className="w-full max-w-[100vw] box-border flex flex-col md:flex-row h-[100dvh] md:h-screen overflow-hidden bg-gray-50 dark:bg-zinc-950 transition-colors duration-200 text-gray-900 dark:text-gray-100">

      {/* Mobile Topbar */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#0f111a] z-30 shrink-0">
        <PostNaMaoLogo className="h-8 w-auto" />
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Overlay & Drawer */}
      {isMobileMenuOpen && (
        <>
          <div className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="md:hidden fixed inset-y-0 right-0 w-64 bg-white dark:bg-[#0f111a] shadow-xl z-[100] transform transition-transform flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-zinc-800">
              <span className="font-bold text-gray-900 dark:text-white">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="flex flex-col flex-1 px-4 py-6 space-y-4">
              <button
                onClick={() => { setActiveTab('meus_imoveis'); setIsMobileMenuOpen(false); }}
                className={`flex items-center text-sm p-3 rounded-xl transition-colors ${
                  activeTab === 'meus_imoveis' 
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-semibold' 
                    : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Layout className="w-5 h-5 mr-3" />
                Meus Imóveis
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('criacao');
                  setIdEmEdicao(null);
                  setDetails({
                    title: '', price: '', neighborhood: '', city: '', state: '',
                    area: '', bedrooms: '', suites: '', bathrooms: '', parking: '',
                    propertyCode: '', propertyType: '', propertySubtype: '',
                    description: '', features: [], amenities: [], differentials: [], whatsapp: ''
                  });
                  setImages([]);
                  setPreviewScale(1);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center text-sm p-3 rounded-xl transition-colors ${
                  activeTab === 'criacao' 
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-semibold' 
                    : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}
              >
                <PlusSquare className="w-5 h-5 mr-3" />
                Criação Rápida
              </button>

              <button
                onClick={() => { setActiveTab('minha_marca'); setIsMobileMenuOpen(false); }}
                className={`flex items-center text-sm p-3 rounded-xl transition-colors ${
                  activeTab === 'minha_marca' 
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-semibold' 
                    : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Palette className="w-5 h-5 mr-3" />
                Minha Marca
              </button>

              <button
                onClick={() => { setActiveTab('minha_conta'); setIsMobileMenuOpen(false); }}
                className={`flex items-center text-sm p-3 rounded-xl transition-colors ${
                  activeTab === 'minha_conta' 
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-semibold' 
                    : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}
              >
                <User className="w-5 h-5 mr-3" />
                Minha Conta
              </button>
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-zinc-800 space-y-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-full flex items-center p-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5 mr-3" /> : <Moon className="w-5 h-5 mr-3" />}
                Alternar Tema
              </button>
              
              <button
                onClick={() => supabase.auth.signOut()}
                className="w-full flex items-center p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sair
              </button>
            </div>
          </div>
        </>
      )}
      {/* Sidebar */}
      <aside className="hidden md:flex w-full h-auto md:w-64 md:h-screen bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex-col transition-colors duration-200 shrink-0 z-20">
        <div className={`p-4 md:p-6 flex justify-between items-center ${activeTab === 'criacao' ? 'hidden md:flex' : ''}`}>
          <PostNaMaoLogo className="h-8 w-auto" />
          <div className="md:hidden flex items-center gap-2">

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          
            <button
              onClick={() => supabase.auth.signOut()}
              className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
        <nav className="w-full grid grid-cols-3 gap-2 px-2 box-border md:flex md:flex-col md:flex-1 md:space-y-2 md:px-4 md:py-4 md:mt-4">
          <button
            onClick={() => setActiveTab('meus_imoveis')}
            className={`w-full flex justify-center md:justify-start items-center text-center md:text-left text-sm p-2 md:px-4 md:py-3 overflow-hidden truncate rounded-xl transition-colors ${
              activeTab === 'meus_imoveis' 
                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-semibold' 
                : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Layout className="w-5 h-5 mr-3" />
            Meus Imóveis
          </button>
          <button
            onClick={() => {
              setActiveTab('criacao');
              setIdEmEdicao(null);
              setDetails({
                title: '', price: '', neighborhood: '', city: '', state: '',
                area: '', bedrooms: '', suites: '', bathrooms: '', parking: '',
                propertyCode: '', propertyType: '', propertySubtype: '',
                amenities: [], differentials: [], leisureArea: null, whatsapp: ''
              });
              setImages([]);
            }}
            className={`w-full flex justify-center md:justify-start items-center text-center md:text-left text-sm p-2 md:px-4 md:py-3 overflow-hidden truncate rounded-xl transition-colors ${
              activeTab === 'criacao' 
                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-semibold' 
                : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Criação Rápida
          </button>
          <button
            onClick={() => setActiveTab('minha_marca')}
            className={`w-full flex justify-center md:justify-start items-center text-center md:text-left text-sm p-2 md:px-4 md:py-3 overflow-hidden truncate rounded-xl transition-colors ${
              activeTab === 'minha_marca' 
                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-semibold' 
                : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
          >
            <svg className="w-5 h-5 md:mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden md:inline">Minha Marca</span>
          </button>
          
          <button
            onClick={() => setActiveTab('minha_conta')}
            className={`w-full flex justify-center md:justify-start items-center text-center md:text-left text-sm p-2 md:px-4 md:py-3 overflow-hidden truncate rounded-xl transition-colors ${
              activeTab === 'minha_conta' 
                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-semibold' 
                : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
          >
            <User className="w-5 h-5 md:mr-3" />
            <span className="hidden md:inline">Minha Conta</span>
          </button>
        </nav>
        <div className="hidden md:flex flex-col gap-2 p-4 border-t border-gray-200 dark:border-zinc-800">

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5 mr-2" /> : <Moon className="w-5 h-5 mr-2" />}
            {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
          </button>
        
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center justify-center p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        {activeTab === 'minha_conta' && session ? (
          <MyAccount session={session} brandKit={brandKit} userPlan={userPlan} />
        ) : activeTab === 'minha_marca' ? (
          <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Minha Marca</h1>
              <p className="text-gray-500 dark:text-zinc-400">Configure sua identidade visual para todos os posts.</p>
            </header>
            <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">
              <BrandKitForm brandKit={brandKit} onChange={setBrandKit} />
            </section>
          </div>
        ) : activeTab === 'meus_imoveis' ? (
          <MyProperties properties={savedProperties} onEdit={handleEdit} onDelete={handleDelete} />
        ) : (
          <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Criação Rápida</h1>
                <p className="text-gray-500 dark:text-zinc-400">Posts profissionais para imóveis em segundos</p>
              </div>
            </header>

        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-12 w-full max-w-full">
          
          {/* Controls Side */}
          <div className="space-y-8 order-2 lg:order-1 min-w-0 w-full max-w-full">
            <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Aplicar Assinatura Visual</h2>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Usar dados globais de 'Minha Marca'</p>
              </div>
              <button 
                onClick={() => setApplyBrandKit(!applyBrandKit)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${applyBrandKit ? 'bg-orange-600' : 'bg-gray-200 dark:bg-zinc-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${applyBrandKit ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </section>

            <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">1. Imagens</h2>
              <ImageUploader 
                images={images} 
                onImagesChange={(newImages) => {
                  setImages(newImages);
                  if (newImages.length > images.length) {
                    setPreviewIndex(newImages.length - 1);
                  }
                }} 
              />
            </section>

            <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200 mt-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Selo (Opcional)</h2>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['Nenhum', 'VENDIDO', 'EXCLUSIVIDADE', 'BAIXOU O VALOR', 'OPORTUNIDADE'].map(selo => {
                  const isNenhum = selo === 'Nenhum';
                  const isActive = isNenhum ? seloAtivo === '' : seloAtivo === selo;
                  return (
                    <button
                      key={selo}
                      onClick={() => setSeloAtivo(isNenhum ? '' : selo)}
                      className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                        isActive 
                          ? 'bg-slate-900 dark:bg-slate-700 text-white border-slate-900 dark:border-slate-700 shadow-md' 
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {selo}
                    </button>
                  );
                })}
              </div>
            </section>


            <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">2. Informações</h2>
              <PropertyForm details={details} brandKit={applyBrandKit ? brandKit : null} onChange={setDetails} />
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
          <div className="contents lg:block lg:order-2 lg:sticky lg:top-6 lg:self-start w-full max-w-full lg:space-y-6 min-w-0">
            <div className="order-1 lg:order-none sticky top-0 z-40 bg-white dark:bg-[#0f111a] -mx-4 px-4 sm:-mx-6 sm:px-6 -mt-4 pt-4 sm:-mt-6 sm:pt-6 pb-4 shadow-md md:m-0 md:p-0 md:static md:shadow-none lg:bg-white lg:dark:bg-zinc-900 lg:p-6 lg:rounded-2xl lg:shadow-sm lg:border border-gray-100 dark:border-zinc-800 flex flex-col transition-colors duration-200 relative">
              <div className="flex flex-wrap w-full gap-2 items-start md:items-center justify-between mb-6">
                <h2 className="hidden md:block text-lg font-semibold text-gray-900 dark:text-white truncate max-w-full">Pré-visualização do Post</h2>
                <div className="flex flex-wrap items-center gap-2 space-x-0">
                  <button
                    onClick={() => {
                      setActiveTab('meus_imoveis');
                      setIdEmEdicao(null);
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 hover:bg-gray-100 dark:text-gray-300 dark:border-zinc-700 dark:hover:bg-zinc-800 font-medium rounded-lg transition-colors"
                  >
                    Voltar
                  </button>
                  {idEmEdicao && (
                    <button
                      onClick={handleSaveOnly}
                      disabled={isExporting}
                      className="px-4 py-2 bg-transparent border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 font-medium rounded-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      Salvar
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        handleShare();
                      } else {
                        handleDownload();
                      }
                    }}
                    disabled={isExporting || images.length === 0}
                    className="absolute bottom-4 right-4 z-10 p-3 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium md:static md:p-2 md:px-4 md:rounded-lg md:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-xl"
                  >
                    <Share2 className="w-5 h-5 md:hidden" />
                    <Download className="hidden md:block w-4 h-4 mr-2" />
                    <span className="hidden md:inline">
                      {isExporting ? 'Gerando...' : (images.length > 1 ? `Baixar Zip (${images.length})` : 'Baixar imagem')}
                    </span>
                  </button>
                </div>
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
              <div ref={previewContainerRef} className="flex items-center justify-center w-full max-w-md mx-auto flex-shrink-0 bg-gray-100 dark:bg-zinc-950 rounded-xl relative p-4 transition-colors duration-200 max-h-[50vh] md:max-h-none overflow-hidden">
                {images.length > 0 ? (
                  <div className="relative mx-auto" style={{ width: 1080 * previewScale, height: (aspectRatio === 'story' ? 1920 : 1080) * previewScale }}>
                  <div 
                    ref={previewRef}
                    className={`absolute top-0 left-0 shadow-xl transition-all duration-300 bg-white ${aspectRatio === 'feed' ? 'aspect-square' : 'aspect-[9/16]'}`}
                    style={{ 
                      width: '1080px', 
                      height: aspectRatio === 'story' ? '1920px' : '1080px',
                      transform: `scale(${previewScale})`,
                      transformOrigin: 'top left',
                      fontSize: '16px' // force base size
                    }}
                  >
                    <TemplateRenderer 
                      templateId={selectedTemplate} 
                      details={details} 
                      image={images[previewIndex] || null} 
                      logo={applyBrandKit ? (brandKit?.logo || null) : null}
                      aspectRatio={aspectRatio}
                      brandKit={applyBrandKit ? brandKit : undefined}
                      options={{...templateOptions, badge: seloAtivo}}
                      userPlan={userPlan}
                    />
                  </div></div>
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
            {/* Smart Caption Module */}
            <div className="order-3 lg:order-none mt-6 lg:mt-0 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">
                <div className="flex flex-col mb-4 gap-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Gerador de Textos com IA</h3>
                  
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg">
                      <button
                        onClick={() => setDestinoCopy('instagram')}
                        className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors ${destinoCopy === 'instagram' ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300'}`}
                      >
                        Post para Feed/Instagram
                      </button>
                      <button
                        onClick={() => setDestinoCopy('whatsapp')}
                        className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors ${destinoCopy === 'whatsapp' ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300'}`}
                      >
                        Mensagem para WhatsApp
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-3 w-full justify-end">
                    <select
                      value={targetAudience}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (userPlan === 'free' && val.includes('(Pro)')) {
                          setTargetAudience('Família/Conforto');
                          setIsPaywallOpen(true);
                          return;
                        }
                        setTargetAudience(val);
                      }}
                      className="w-full md:w-auto px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Família/Conforto">Família/Conforto</option>
                      <option value="Jovem/Dinâmico">Jovem/Dinâmico</option>
                      <option value="Luxo/Exclusividade (Pro)">Luxo/Exclusividade (Pro)</option>
                      <option value="Investidor/ROI (Pro)">Investidor/ROI (Pro)</option>
                    </select>
                    <button
                      onClick={handleGenerateCopy}
                      disabled={isGeneratingCopy}
                      className="w-full md:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 whitespace-nowrap shadow-sm hover:shadow-lg"
                    >
                      {isGeneratingCopy ? 'Escrevendo...' : '✨ Gerar Copy com IA'}
                    </button>
                  </div>
                </div>
                <div className="relative">
                   <textarea 
                     readOnly 
                     rows={10} 
                     className="w-full max-w-full p-4 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-700 dark:text-zinc-300 resize-none focus:outline-none"
                     value={generatedCaption}
                     placeholder="Clique em 'Gerar Copy com IA' para criar uma legenda profissional."
                   />
                   <button 
                     onClick={handleCopyCaption}
                     className="absolute bottom-3 right-3 px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors shadow-sm flex items-center"
                   >
                     {isCopied ? (
                       <><Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Copiado!</>
                     ) : (
                       <><Copy className="w-3.5 h-3.5 mr-1.5" /> Copiar Legenda</>
                     )}
                   </button>
                </div>
            </div>
          </div>

        </div>
        </div>
      )}  <footer className="text-center py-6 text-sm text-gray-500 dark:text-zinc-400 mt-auto border-t border-gray-100 dark:border-zinc-800">
        © 2026 PostNaMão. Todos os direitos reservados.
      </footer>
</main>
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
              width: '1080px', 
              height: aspectRatio === 'story' ? '1920px' : '1080px',
              fontSize: '16px' // Keep standard base font size
            }}
          >
            <TemplateRenderer 
              templateId={selectedTemplate} 
              details={details} 
              image={img} 
              logo={applyBrandKit ? (brandKit?.logo || null) : null}
              aspectRatio={aspectRatio}
              brandKit={applyBrandKit ? brandKit : undefined}
              options={{...templateOptions, badge: seloAtivo}}
              userPlan={userPlan}
            />
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
