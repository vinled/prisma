import { useLocation } from 'react-router-dom';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as htmlToImage from 'html-to-image';
import { 
  Download, Layout, Moon, Sun, Copy, Check, LogOut, User, Menu, X, PlusSquare, 
  Palette, Share2, LayoutTemplate, Crop, Tag, SlidersHorizontal, ArrowRight, ArrowLeft, 
  Eye, Sparkles, Star, ChevronDown, ChevronUp, CheckCircle2, Sliders, Wand2, RefreshCw 
} from 'lucide-react';
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

const LOCAL_STORAGE_PROPERTIES_KEY = 'postnamao_saved_properties';

const getLocalProperties = (): SavedProperty[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROPERTIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalProperties = (props: SavedProperty[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_PROPERTIES_KEY, JSON.stringify(props));
  } catch (e) {
    console.warn("Não foi possível salvar localmente no navegador:", e);
  }
};

const isValidUUID = (str?: string | null): boolean => {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
};

const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const formatDateDisplay = (dateVal?: string, createdAt?: string): string => {
  if (!dateVal && !createdAt) {
    return new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  try {
    const d = new Date(dateVal || createdAt!);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  } catch {}
  return dateVal || '';
};

export default function App() {
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [showAuth, setShowAuth] = useState(false);
    const [activeTab, setActiveTab] = useState<'criacao' | 'meus_imoveis' | 'minha_marca' | 'minha_conta'>('criacao');
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [openSecondaryTool, setOpenSecondaryTool] = useState<'none' | 'selo' | 'ajustes' | 'legenda'>('none');
  const [mobileViewTab, setMobileViewTab] = useState<'form' | 'preview'>('form');
  const [activeMobileTool, setActiveMobileTool] = useState<'template' | 'format' | 'badge' | 'adjust' | 'export' | null>('template');
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
  const [details, setDetails] = useState<PropertyDetails>({
    purpose: 'venda', rent_price: '', condo_price: '', iptu_price: '', is_package: false, title: '', previousPrice: '', porteiraFechada: false,
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

  const [isSavingBrand, setIsSavingBrand] = useState(false);
  
  const handleSaveBrandKit = async () => {
    if (!session?.user) return;
    setIsSavingBrand(true);
    try {
      const { data: profileData } = await supabase.from('profiles').select('id').eq('id', session.user.id).single();
      
      let error;
      if (profileData) {
        // Exists, update
        const { error: err } = await supabase.from('profiles').update({ brand_kit: brandKit }).eq('id', session.user.id);
        error = err;
      } else {
        // Doesn't exist, insert
        const { error: err } = await supabase.from('profiles').insert({ id: session.user.id, brand_kit: brandKit, plan: 'free' });
        error = err;
      }
      
      if (error) throw error;
      alert('Marca salva com sucesso!');
    } catch (e: any) {
      console.error(e);
      alert('Erro ao salvar a marca: ' + (e.message || 'Erro desconhecido'));
    } finally {
      setIsSavingBrand(false);
    }
  };

  
  useEffect(() => {
    // BrandKit will be saved to Supabase explicitly, not via effect
  }, []);
  
  const [applyBrandKit, setApplyBrandKit] = useState(true);
  const [userPlan, setUserPlan] = useState<'free' | 'pro'>('free');
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioId>('feed');
  const [seloAtivo, setSeloAtivo] = useState("");
  const [templateOptions, setTemplateOptions] = useState<TemplateOptions>({
    gradientOpacity: 25,
    imagePositionX: 50,
    logoSize: 100,
  });

  const [generatedCaption, setGeneratedCaption] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const [targetAudience, setTargetAudience] = useState('Família/Conforto');
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [destinoCopy, setDestinoCopy] = useState('instagram');

  const handleGenerateCopy = async () => {
    if (userPlan !== 'pro' && targetAudience.includes('(Pro)')) {
      alert('Este tom/estilo é exclusivo do Plano Pro. Faça o upgrade para usá-lo!');
      setIsPaywallOpen(true);
      return;
    }
    setIsGeneratingCopy(true);
    try {
      const diffsStr = [...(details.differentials || []), ...(details.amenities || [])].join(", ");
      
      let regrasDeFormato = '';
      if (destinoCopy === 'instagram') {
        regrasDeFormato = "Formate como um post de Instagram. Use parágrafos curtos e emojis espaçados para leitura fluida. REGRAS ESTRITAS: 1. ZERO formatação Markdown (NÃO use ** ou * para negrito/itálico, gere apenas texto plano). 2. PROIBIDO inserir links, URLs ou placeholders como '[Insira o link]' (links não são clicáveis no Instagram). 3. Para chamadas de ação (CTA), use APENAS instruções nativas como 'Link na bio', 'Envie uma mensagem no Direct' ou 'Comente EU QUERO'. 4. Inclua hashtags relevantes no final.";
      } else if (destinoCopy === 'whatsapp') {
        regrasDeFormato = "Formate como uma mensagem privada de WhatsApp enviada de um corretor para um cliente vip. Seja extremamente direto, persuasivo e curto. NÃO use hashtags. Use formatação nativa do WhatsApp (ex: *negrito* para o preço e destaques). Termine com uma pergunta fechada de engajamento, como 'Podemos agendar uma visita amanhã?' ou 'Faz sentido para você?'";
      }

      let instructionPurpose = '';
      let precoPrompt = `Preço: ${details.price || 'Não informado'}`;
      
      if (details.purpose === 'locacao') {
        instructionPurpose = 'Se a finalidade for LOCAÇÃO, crie chamadas para ação focadas em aluguel, mudança rápida e estilo de vida. NUNCA use palavras como comprar, investir ou aquisição.';
        precoPrompt = `Aluguel: ${details.rent_price || 'Não informado'}, Condomínio: ${details.condo_price || '0'}, IPTU: ${details.iptu_price || '0'} (Pacote: ${details.is_package ? 'Sim' : 'Não'})`;
      } else {
        instructionPurpose = 'Se for VENDA, foque em compra e investimento.';
      }

      const promptText = `Você é um copywriter de alto padrão no mercado imobiliário. Crie um texto para o imóvel com os dados: Finalidade: ${details.purpose || 'venda'}, Tipo: ${details.propertyType || 'Imóvel'}, Bairro: ${details.neighborhood || 'Não informado'}, Quartos: ${details.bedrooms || 'Não informado'}, Vagas: ${details.parking || 'Não informado'}, ${precoPrompt}, Diferenciais: [${diffsStr}]. ${regrasDeFormato} O Tom do texto deve ser: ${targetAudience}. ${instructionPurpose} Adicione CTA para este WhatsApp: ${details.whatsapp || (applyBrandKit ? brandKit?.whatsapp : '') || ''}. Não invente dados.`;

      const { data: { session: currentSession } } = await supabase.auth.getSession();
      const token = currentSession?.access_token;
      
      if (!token) {
        throw new Error('Usuário não autenticado.');
      }

      const response = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ promptText, targetAudience })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na API:", errorText);
        throw new Error("Erro na comunicação com o servidor. Tente novamente.");
      }

      const result = await response.json();
      setGeneratedCaption(result.caption);
      setDetails(prev => ({ ...prev, generated_copy: result.caption }));
    } catch (error: any) {
      console.error('ERRO DETALHADO DA API:', error);
      setGeneratedCaption('Falha na comunicação com o servidor. Por favor, tente gerar o texto novamente.');
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
  const [exportProgressText, setExportProgressText] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);

  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>(getLocalProperties);
  
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

  const updateScale = useCallback(() => {
    if (previewContainerRef.current) {
      let containerWidth = previewContainerRef.current.getBoundingClientRect().width;
      
      // If container width is 0 (e.g. display: none on mobile tab switch), fallback to window width
      if (containerWidth === 0) {
         containerWidth = window.innerWidth - 32;
      }

      const contentWidth = containerWidth - 32;
      let scaleByWidth = contentWidth / 1080;
      
      let scale = scaleByWidth;
      let containerHeight = previewContainerRef.current.getBoundingClientRect().height;
      if (containerHeight === 0) {
        containerHeight = window.innerHeight * 0.5; // fallback
      }
      
      const targetHeight = aspectRatio === 'story' ? 1920 : 1440;
      // padding top and bottom (32px)
      const scaleByHeight = (containerHeight - 32) / targetHeight;
      scale = Math.min(scaleByWidth, scaleByHeight);
      
      if (scale <= 0 || isNaN(scale)) scale = 0.3;
      
      setPreviewScale(scale);
    }
  }, [aspectRatio]);

  useEffect(() => {
    const timeoutId = setTimeout(() => updateScale(), 50);
    return () => clearTimeout(timeoutId);
  }, [mobileViewTab, activeTab, currentStep, updateScale]);

  useEffect(() => {
    updateScale();
    
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
  }, [images.length, updateScale]); // Re-run if images change


  
  const executeSave = async (): Promise<{ success: boolean; cloudSynced: boolean }> => {
    if (userPlan !== 'pro' && !idEmEdicao && session?.user) {
      try {
        const { count, error } = await supabase
          .from('properties')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', session.user.id);
          
        if (!error && count !== null && count >= 5) {
          alert('Você atingiu o limite de 5 imóveis do Plano Grátis. Assine o Pro para imóveis ilimitados.');
          setIsPaywallOpen(true);
          return { success: false, cloudSynced: false };
        }
      } catch (countErr) {
        console.warn("Não foi possível verificar contagem na nuvem:", countErr);
      }
    }

    setIsExporting(true);
    const finalImages: string[] = [];
    try {
      for (const imgUrl of images) {
        if (imgUrl.startsWith('blob:') || imgUrl.startsWith('data:')) {
          try {
            const response = await fetch(imgUrl);
            const blob = await response.blob();
            const fileExt = blob.type.split('/')[1] || 'jpg';
            const fileName = `imovel_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('fotos_imoveis').upload(fileName, blob, {
              contentType: blob.type,
              upsert: false
            });
            if (uploadError) throw uploadError;
            const { data } = supabase.storage.from('fotos_imoveis').getPublicUrl(fileName);
            finalImages.push(data.publicUrl);
          } catch (e) {
            console.warn('Upload da imagem para storage da nuvem indisponível:', e);
            finalImages.push(imgUrl); 
          }
        } else {
          finalImages.push(imgUrl);
        }
      }
      
      setImages(finalImages);

      const now = new Date();
      const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
      
      let finalThumbnail = finalImages[0] || undefined;
      // Garante que não salvamos blob efêmero ou base64 gigante como thumbnail no banco
      if (finalThumbnail && (finalThumbnail.startsWith('blob:') || finalThumbnail.length > 2000)) {
         finalThumbnail = undefined;
      }
      
      if (finalThumbnail === undefined && idEmEdicao) {
        finalThumbnail = savedProperties.find(p => p.id === idEmEdicao)?.thumbnail;
      }

      // Garante ID com formato UUID v4 válido compatível com banco PostgreSQL
      const safeId = isValidUUID(idEmEdicao) ? idEmEdicao! : generateUUID();
      if (!idEmEdicao) {
        setIdEmEdicao(safeId);
      }
      
      const propertyData: SavedProperty = {
        id: safeId,
        date: dateStr,
        details: { ...details, images: finalImages },
        selectedTemplate,
        aspectRatio,
        templateOptions,
        thumbnail: finalThumbnail
      };
      
      let updated: SavedProperty[];
      if (idEmEdicao) {
        updated = savedProperties.map(p => p.id === idEmEdicao ? propertyData : p);
      } else {
        updated = [propertyData, ...savedProperties];
      }
      
      setSavedProperties(updated);
      saveLocalProperties(updated);
      
      let cloudSynced = false;
      // Sincronização resiliente com o Supabase
      if (session?.user) {
        try {
          // Limpa URLs base64 gigantes de details.images para evitar erro 413 Payload Too Large
          const cleanImages = (propertyData.details.images || []).map(img => 
            (img && img.startsWith('data:') && img.length > 2000) ? '' : img
          ).filter(Boolean);

          const dbPayload: any = {
            id: propertyData.id,
            user_id: session.user.id,
            details: { ...propertyData.details, images: cleanImages },
            selected_template: propertyData.selectedTemplate,
            aspect_ratio: propertyData.aspectRatio,
            template_options: propertyData.templateOptions,
            thumbnail: propertyData.thumbnail || null
          };

          // Tenta enviar com data ISO (aceita por colunas DATE, TIMESTAMP e TEXT)
          dbPayload.date = now.toISOString().split('T')[0];

          let { error } = await supabase.from('properties').upsert(dbPayload);

          // Se falhou por causa da coluna 'date' não existir no schema
          if (error && (error.code === '42703' || error.message?.includes('column "date"'))) {
            delete dbPayload.date;
            const retry = await supabase.from('properties').upsert(dbPayload);
            error = retry.error;
          }

          if (error) {
            console.warn("Aviso: Sincronização em nuvem pendente:", error);
            cloudSynced = false;
          } else {
            cloudSynced = true;
          }
        } catch (cloudErr) {
          console.warn("Falha de conexão com banco de dados:", cloudErr);
          cloudSynced = false;
        }
      }
      return { success: true, cloudSynced };
    } catch (err) {
      console.error("Execute save erro geral:", err);
      return { success: false, cloudSynced: false };
    } finally {
      setIsExporting(false);
    }
  };
  const handleSaveOnly = async () => {
    const result = await executeSave();
    if (result.success) {
      if (result.cloudSynced) {
        alert('Alterações salvas com sucesso!');
      } else {
        alert('Alterações salvas no seu navegador!');
      }
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
      const result = await executeSave();
      if (!result.success) {
        setIsExporting(false);
        return;
      }
      
      const scale = 1; 
      const baseWidth = 1080;
      const baseHeight = aspectRatio === 'story' ? 1920 : 1440;
      
      const options = {
        width: baseWidth,
        height: baseHeight,
        pixelRatio: scale,
        backgroundColor: 'rgba(0,0,0,0)',
        useCORS: true,
        allowTaint: true
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
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Erro ao exportar a imagem. Tente novamente.');
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
      setExportProgressText('Salvando...');
      const result = await executeSave();
      if (!result.success) {
        setIsExporting(false);
        setExportProgressText(null);
        return;
      }
      
      const scale = 1; // Export at 1x resolution because base is 1080px
      const baseWidth = 1080;
      const baseHeight = aspectRatio === 'story' ? 1920 : 1440;
      
      const options = {
        width: baseWidth,
        height: baseHeight,
        pixelRatio: scale,
        backgroundColor: 'rgba(0,0,0,0)',
        useCORS: true,
        allowTaint: true
      };
      
      for (let i = 0; i < postElements.length; i++) {
        setExportProgressText(`Baixando (${i + 1}/${postElements.length})...`);
        const el = postElements[i] as HTMLElement;
        const dataUrl = await htmlToImage.toPng(el, options);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `post-imovel-${i + 1}.png`;
        link.click();
        
        // Intervalo de segurança (Bypass de Bloqueio de Navegador para downloads múltiplos)
        if (i < postElements.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 600));
        }
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Erro ao exportar a imagem. Tente novamente.');
    } finally {
      setIsExporting(false);
      setExportProgressText(null);
    }
  };

  const handleEdit = (prop: SavedProperty) => {
    setPreviewIndex(0);
    setImages(prop.details.images && prop.details.images.length > 0 ? prop.details.images : (prop.thumbnail ? [prop.thumbnail] : []));
    setIdEmEdicao(prop.id);
    setDetails(prop.details);
    setSelectedTemplate(prop.selectedTemplate);
    setAspectRatio(prop.aspectRatio);
    setTemplateOptions(prop.templateOptions);
    setGeneratedCaption(prop.details.generated_copy || '');
    setActiveTab('criacao');
    setCurrentStep(4);
    setMobileViewTab('preview');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta arte?')) {
      const updated = savedProperties.filter(p => p.id !== id);
      setSavedProperties(updated);
      saveLocalProperties(updated);
      
      if (session?.user) {
        const { error } = await supabase.from('properties').delete().eq('id', id).eq('user_id', session.user.id);
        if (error) console.warn("Aviso ao deletar do banco:", error);
      }
    }
  };

  
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      const path = location.pathname;
      if (!session && path !== '/' && path !== '/reset-password' && path !== '/termos' && path !== '/privacidade') {
        window.history.replaceState({}, '', '/');
        setShowAuth(true);
      }

      if (session?.user) {
        // Load user plan and brand kit
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan, brand_kit')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          setUserPlan(profile.plan || 'free');
          if (profile.brand_kit) {
            setBrandKit(profile.brand_kit);
          }
        }

        // Load properties
        const { data: propertiesData } = await supabase
          .from('properties')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
          
        if (propertiesData) {
          const loadedFromDb: SavedProperty[] = propertiesData.map(p => ({
            id: p.id,
            date: formatDateDisplay(p.date, p.created_at),
            details: p.details,
            selectedTemplate: p.selected_template,
            aspectRatio: p.aspect_ratio,
            templateOptions: p.template_options,
            thumbnail: p.thumbnail
          }));
          
          // Mescla com imóveis locais para nunca perder criações recentes
          const local = getLocalProperties();
          const dbIds = new Set(loadedFromDb.map(p => p.id));
          const localOnly = local.filter(p => !dbIds.has(p.id));
          const merged = [...localOnly, ...loadedFromDb];

          setSavedProperties(merged);
          saveLocalProperties(merged);
        }
      }

    };
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      
      const path = location.pathname;
      if (!session && path !== '/' && path !== '/reset-password' && path !== '/termos' && path !== '/privacidade') {
        window.history.replaceState({}, '', '/');
        setShowAuth(true);
      }

      if (session?.user) {
        // Load user plan and brand kit
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan, brand_kit')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          setUserPlan(profile.plan || 'free');
          if (profile.brand_kit) {
            setBrandKit(profile.brand_kit);
          }
        }

        // Load properties
        const { data: propertiesData } = await supabase
          .from('properties')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
          
        if (propertiesData) {
          const loadedFromDb: SavedProperty[] = propertiesData.map(p => ({
            id: p.id,
            date: formatDateDisplay(p.date, p.created_at),
            details: p.details,
            selectedTemplate: p.selected_template,
            aspectRatio: p.aspect_ratio,
            templateOptions: p.template_options,
            thumbnail: p.thumbnail
          }));
          
          const local = getLocalProperties();
          const dbIds = new Set(loadedFromDb.map(p => p.id));
          const localOnly = local.filter(p => !dbIds.has(p.id));
          const merged = [...localOnly, ...loadedFromDb];

          setSavedProperties(merged);
          saveLocalProperties(merged);
        }
      }

    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Separate useEffect for realtime profile updates
  useEffect(() => {
    if (!session?.user?.id) return;
    
    const channelName = `profile-updates-${session.user.id}-${Date.now()}`;
    const profileSubscription = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${session.user.id}` },
        (payload) => {
          if (payload.new && payload.new.plan) {
            setUserPlan(payload.new.plan);
            alert("Pagamento confirmado! Seu plano PRO foi ativado com sucesso. Aproveite!");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profileSubscription);
    };
  }, [session?.user?.id]);

  useEffect(() => {
    if (window.innerWidth < 1024 && mobileViewTab === 'preview') {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100dvh';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'unset';
    };
  }, [mobileViewTab]);

  if (location.pathname === '/reset-password') {
    return <ResetPassword />;
  }

  if (location.pathname === '/termos') {
    return <TermosDeUso />;
  }

  if (location.pathname === '/privacidade') {
    return <PoliticaPrivacidade />;
  }

  const isValidSession = session && session.user && session.user.email;

  if (!isValidSession) {
    if (showAuth) {
      return <Auth onBack={() => setShowAuth(false)} />;
    }
    return <LandingPage onLoginClick={() => setShowAuth(true)} />;
  }

  const renderSecondaryTools = (isCompact = false) => {
    return (
      <div className="space-y-4">
        {/* Accordion Tabs */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
          <div className="flex border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-850">
            <button
              type="button"
              onClick={() => setOpenSecondaryTool(openSecondaryTool === 'selo' ? 'none' : 'selo')}
              className={`flex-1 py-3 px-3 text-xs sm:text-sm font-semibold flex items-center justify-center space-x-1.5 transition-colors ${
                openSecondaryTool === 'selo'
                  ? 'bg-white dark:bg-zinc-900 text-orange-600 dark:text-orange-400 border-b-2 border-orange-500 shadow-sm'
                  : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Tag size={15} />
              <span>Selo {seloAtivo ? `(${seloAtivo})` : ''}</span>
            </button>
            <button
              type="button"
              onClick={() => setOpenSecondaryTool(openSecondaryTool === 'ajustes' ? 'none' : 'ajustes')}
              className={`flex-1 py-3 px-3 text-xs sm:text-sm font-semibold flex items-center justify-center space-x-1.5 transition-colors ${
                openSecondaryTool === 'ajustes'
                  ? 'bg-white dark:bg-zinc-900 text-orange-600 dark:text-orange-400 border-b-2 border-orange-500 shadow-sm'
                  : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <SlidersHorizontal size={15} />
              <span>Ajustes da Foto</span>
            </button>
            <button
              type="button"
              onClick={() => setOpenSecondaryTool(openSecondaryTool === 'legenda' ? 'none' : 'legenda')}
              className={`flex-1 py-3 px-3 text-xs sm:text-sm font-semibold flex items-center justify-center space-x-1.5 transition-colors ${
                openSecondaryTool === 'legenda'
                  ? 'bg-white dark:bg-zinc-900 text-orange-600 dark:text-orange-400 border-b-2 border-orange-500 shadow-sm'
                  : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Sparkles size={15} />
              <span>Legenda com IA</span>
            </button>
          </div>

          <div className="p-4 sm:p-5">
            {openSecondaryTool === 'none' && (
              <p className="text-xs text-center text-gray-500 dark:text-zinc-400 py-1">
                Toque em uma aba acima se desejar adicionar selo de destaque, ajustar a posição da foto ou gerar uma legenda com IA.
              </p>
            )}

            {/* Selo Tab */}
            {openSecondaryTool === 'selo' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-zinc-200">
                    Selo de Destaque na Arte
                  </h4>
                  {seloAtivo && (
                    <button
                      type="button"
                      onClick={() => setSeloAtivo('')}
                      className="text-xs text-orange-600 hover:underline"
                    >
                      Remover selo
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Nenhum', 'VENDIDO', 'EXCLUSIVIDADE', 'BAIXOU O VALOR', 'OPORTUNIDADE', 'PORTEIRA FECHADA'].map(selo => {
                    const isNenhum = selo === 'Nenhum';
                    const isActive = isNenhum ? seloAtivo === '' : seloAtivo === selo;
                    return (
                      <button
                        key={selo}
                        type="button"
                        onClick={() => setSeloAtivo(isNenhum ? '' : selo)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                          isActive 
                            ? 'bg-orange-600 text-white border-orange-600 shadow-sm' 
                            : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700'
                        }`}
                      >
                        {selo}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Ajustes Tab */}
            {openSecondaryTool === 'ajustes' && (
              <div className="space-y-4">
                {['modern', 'elegant', 'luxury', 'bold', 'minimalist', 'myway'].includes(selectedTemplate) ? (
                  <>
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 dark:text-zinc-400 mb-1.5 font-medium">
                        <label>Posição da Foto (Esquerda - Direita)</label>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {templateOptions.imagePositions?.[previewIndex] ?? templateOptions.imagePositionX ?? 50}%
                        </span>
                      </div>
                      <input 
                        type="range" min="0" max="100" 
                        value={templateOptions.imagePositions?.[previewIndex] ?? templateOptions.imagePositionX ?? 50} 
                        onChange={(e) => setTemplateOptions({...templateOptions, imagePositions: {...templateOptions.imagePositions, [previewIndex]: Number(e.target.value)}})}
                        className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-orange-600"
                        onTouchStart={() => setIsDraggingSlider(true)} onTouchEnd={() => setIsDraggingSlider(false)} onMouseDown={() => setIsDraggingSlider(true)} onMouseUp={() => setIsDraggingSlider(false)}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 dark:text-zinc-400 mb-1.5 font-medium">
                        <label>Contraste de Fundo (Degradê)</label>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {templateOptions.gradientOpacity ?? 25}%
                        </span>
                      </div>
                      <input 
                        type="range" min="0" max="100" 
                        value={templateOptions.gradientOpacity ?? 25} 
                        onChange={(e) => setTemplateOptions({...templateOptions, gradientOpacity: Number(e.target.value)})}
                        className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-orange-600"
                        onTouchStart={() => setIsDraggingSlider(true)} onTouchEnd={() => setIsDraggingSlider(false)} onMouseDown={() => setIsDraggingSlider(true)} onMouseUp={() => setIsDraggingSlider(false)}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 dark:text-zinc-400 mb-1.5 font-medium">
                        <label>Tamanho do Logo</label>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {templateOptions.logoSize ?? 100}%
                        </span>
                      </div>
                      <input 
                        type="range" min="50" max="150" 
                        value={templateOptions.logoSize ?? 100} 
                        onChange={(e) => setTemplateOptions({...templateOptions, logoSize: Number(e.target.value)})}
                        className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-orange-600"
                        onTouchStart={() => setIsDraggingSlider(true)} onTouchEnd={() => setIsDraggingSlider(false)} onMouseDown={() => setIsDraggingSlider(true)} onMouseUp={() => setIsDraggingSlider(false)}
                      />
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-zinc-400 text-center py-2">
                    Este estilo ajusta automaticamente as proporções da imagem.
                  </p>
                )}
              </div>
            )}

            {/* Legenda IA Tab */}
            {openSecondaryTool === 'legenda' && (
              <div className="space-y-3.5">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                  <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setDestinoCopy('instagram')}
                      className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors ${
                        destinoCopy === 'instagram' 
                          ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm' 
                          : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700'
                      }`}
                    >
                      Instagram
                    </button>
                    <button
                      type="button"
                      onClick={() => setDestinoCopy('whatsapp')}
                      className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors ${
                        destinoCopy === 'whatsapp' 
                          ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm' 
                          : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700'
                      }`}
                    >
                      WhatsApp
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={targetAudience || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (userPlan === 'free' && val.includes('(Pro)')) {
                          setTargetAudience('Família/Conforto');
                          setIsPaywallOpen(true);
                          return;
                        }
                        setTargetAudience(val);
                      }}
                      className="px-3 py-1.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs text-gray-700 dark:text-zinc-300 outline-none"
                    >
                      <option value="Família/Conforto">Família/Conforto</option>
                      <option value="Jovem/Dinâmico">Jovem/Dinâmico</option>
                      <option value="Luxo/Exclusividade (Pro)">Luxo/Exclusividade (Pro)</option>
                      <option value="Investidor/ROI (Pro)">Investidor/ROI (Pro)</option>
                    </select>

                    <button
                      type="button"
                      onClick={handleGenerateCopy}
                      disabled={isGeneratingCopy}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm whitespace-nowrap"
                    >
                      <Sparkles size={13} />
                      <span>{isGeneratingCopy ? 'Gerando...' : 'Gerar Texto'}</span>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <textarea 
                    readOnly 
                    rows={4} 
                    className="w-full p-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-gray-700 dark:text-zinc-300 resize-none outline-none leading-relaxed"
                    value={generatedCaption || ''}
                    placeholder="Clique em 'Gerar Texto' para criar uma descrição profissional para este imóvel."
                  />
                  {generatedCaption && (
                    <button 
                      type="button"
                      onClick={handleCopyCaption}
                      className="absolute bottom-2.5 right-2.5 px-3 py-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors shadow-sm flex items-center"
                    >
                      {isCopied ? (
                        <><Check className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Copiado!</>
                      ) : (
                        <><Copy className="w-3.5 h-3.5 mr-1" /> Copiar</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

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
                  setCurrentStep(1);
                  setMobileViewTab('form');
                  setDetails({
                purpose: 'venda', rent_price: '', condo_price: '', iptu_price: '', is_package: false, title: '', previousPrice: '', porteiraFechada: false, price: '', neighborhood: '', city: '', state: '',
                area: '', bedrooms: '', suites: '', bathrooms: '', parking: '',
                propertyCode: '', propertyType: '', propertySubtype: '',
                amenities: [], differentials: [], leisureArea: null, whatsapp: ''
              });
                  setImages([]);
              setGeneratedCaption('');
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
              setCurrentStep(1);
              setMobileViewTab('form');
              setDetails({
                purpose: 'venda', rent_price: '', condo_price: '', iptu_price: '', is_package: false, title: '', previousPrice: '', porteiraFechada: false, price: '', neighborhood: '', city: '', state: '',
                area: '', bedrooms: '', suites: '', bathrooms: '', parking: '',
                propertyCode: '', propertyType: '', propertySubtype: '',
                amenities: [], differentials: [], leisureArea: null, whatsapp: ''
              });
              setImages([]);
              setGeneratedCaption('');
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
            <Palette className="w-5 h-5 md:mr-3" />
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
          <MyAccount session={session} brandKit={brandKit} userPlan={userPlan} creditsUsed={savedProperties.length} />
        ) : activeTab === 'minha_marca' ? (
          <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Minha Marca</h1>
              <p className="text-gray-500 dark:text-zinc-400">Configure sua identidade visual para todos os posts.</p>
            </header>
            <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-200">
              <BrandKitForm brandKit={brandKit} onChange={setBrandKit} />
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSaveBrandKit}
                  disabled={isSavingBrand}
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium shadow-sm transition-all disabled:opacity-50"
                >
                  {isSavingBrand ? 'Salvando...' : 'Salvar Marca'}
                </button>
              </div>
            </section>
          </div>
        ) : activeTab === 'meus_imoveis' ? (
          <MyProperties properties={savedProperties} onEdit={handleEdit} onDelete={handleDelete} />
        ) : (
          <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
            <header className="hidden md:flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-2">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Criação Rápida</h1>
                <p className="text-gray-500 dark:text-zinc-400 text-sm">
                  Foto → Informações Básicas → Estilo → Post Pronto
                </p>
              </div>
            </header>

            {/* Stepper Navigation */}
            <div className="mb-6 bg-white dark:bg-zinc-900 p-1.5 sm:p-2.5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {[
                  { id: 1 as const, title: 'Fotos', sub: images.length > 0 ? `${images.length} foto(s)` : 'Adicionar', isDone: images.length > 0 },
                  { id: 2 as const, title: 'Informações', sub: (details.neighborhood || details.price || details.rent_price) ? 'Preenchido' : 'Essencial', isDone: Boolean(details.neighborhood || details.price || details.rent_price || details.propertyType) },
                  { id: 3 as const, title: 'Estilo', sub: selectedTemplate === 'modern' ? 'Modern' : selectedTemplate, isDone: true },
                  { id: 4 as const, title: 'Ver Arte', sub: 'Baixar', isDone: false }
                ].map(step => {
                  const isActive = currentStep === step.id;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => {
                        setCurrentStep(step.id);
                        setMobileViewTab(step.id === 4 ? 'preview' : 'form');
                      }}
                      className={`flex flex-col sm:flex-row items-center justify-center p-2 sm:py-2.5 sm:px-3 rounded-xl transition-all text-center sm:text-left ${
                        isActive
                          ? 'bg-orange-600 text-white shadow-sm font-bold scale-[1.01]'
                          : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-0 sm:mr-2 mb-1 sm:mb-0 shrink-0 ${
                        isActive 
                          ? 'bg-white text-orange-600' 
                          : (step.isDone ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' : 'bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300')
                      }`}>
                        {step.isDone && !isActive ? <Check size={13} strokeWidth={3} /> : step.id}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-semibold truncate leading-tight">
                          {step.title}
                        </div>
                        <div className={`hidden sm:block text-[11px] truncate leading-tight ${isActive ? 'text-orange-100' : 'text-gray-400'}`}>
                          {step.sub}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-[1.1fr_1.3fr] gap-8 lg:gap-10 w-full max-w-full items-start">
              
              {/* Form / Step side */}
              <div className={`w-full space-y-6 ${currentStep === 4 ? 'hidden lg:block' : 'block'}`}>
                
                {/* STEP 1: FOTOS */}
                {currentStep === 1 && (
                  <div className="bg-white dark:bg-zinc-900 p-5 sm:p-7 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-5 animate-in fade-in duration-200">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span>1. Adicionar Fotos</span>
                        {images.length > 0 && (
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 font-semibold border border-orange-200 dark:border-orange-800">
                            {images.length} {images.length === 1 ? 'foto' : 'fotos'}
                          </span>
                        )}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
                        Selecione as fotos do imóvel. A foto com o selo <strong>"Capa"</strong> será o destaque principal da arte.
                      </p>
                    </div>

                    <ImageUploader 
                      images={images} 
                      onImagesChange={(newImages) => {
                        setImages(newImages);
                        if (newImages.length > images.length) {
                          setPreviewIndex(newImages.length - 1);
                        }
                      }}
                      previewIndex={previewIndex}
                      onSelectPreviewIndex={setPreviewIndex}
                    />

                    <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
                      <p className="text-xs text-gray-500 dark:text-zinc-400 text-center sm:text-left">
                        {images.length > 0 
                          ? 'Pronto! Agora informe os dados essenciais do imóvel.' 
                          : 'Dica: Você pode avançar e adicionar a foto depois.'}
                      </p>
                      
                      <div className="flex gap-2 w-full sm:w-auto">
                        {images.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentStep(4);
                              setMobileViewTab('preview');
                            }}
                            className="flex-1 sm:flex-initial px-4 py-2.5 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 font-semibold rounded-xl text-sm transition-colors"
                          >
                            Ver Arte ✨
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="flex-1 sm:flex-initial px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 text-sm active:scale-95"
                        >
                          <span>Avançar</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: INFORMAÇÕES ESSENCIAIS */}
                {currentStep === 2 && (
                  <div className="bg-white dark:bg-zinc-900 p-5 sm:p-7 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-6 animate-in fade-in duration-200">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        2. Informações do Imóvel
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
                        Preencha apenas o que desejar. Você não precisa preencher tudo para gerar sua arte!
                      </p>
                    </div>

                    <PropertyForm details={details} brandKit={applyBrandKit ? brandKit : null} onChange={setDetails} />

                    <div className="pt-5 border-t border-gray-100 dark:border-zinc-800 flex flex-col-reverse sm:flex-row gap-3 items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="w-full sm:w-auto px-4 py-2.5 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 font-semibold rounded-xl transition-colors text-sm flex items-center justify-center space-x-1.5"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Voltar para Fotos</span>
                      </button>

                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentStep(4);
                            setMobileViewTab('preview');
                          }}
                          className="flex-1 sm:flex-initial px-4 py-2.5 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 font-semibold rounded-xl text-sm transition-colors"
                        >
                          Ver Arte ✨
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="flex-1 sm:flex-initial px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 text-sm active:scale-95"
                        >
                          <span>Escolher Estilo</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: ESTILO & ASSINATURA VISUAL */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    {/* Minha Marca Card */}
                    <div className="bg-orange-50/70 dark:bg-zinc-900/90 p-5 rounded-2xl border border-orange-200 dark:border-zinc-800 shadow-sm transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-3.5">
                          {brandKit?.logo ? (
                            <img 
                              src={brandKit.logo} 
                              alt="Logo" 
                              className="w-12 h-12 rounded-xl object-contain bg-white dark:bg-zinc-800 p-1 border border-orange-200 dark:border-zinc-700" 
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-lg">
                              {brandKit?.name ? brandKit.name[0].toUpperCase() : 'M'}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                                Sua marca será aplicada automaticamente
                              </h4>
                              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                                applyBrandKit 
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400' 
                                  : 'bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-zinc-400'
                              }`}>
                                {applyBrandKit ? 'Ativada' : 'Pausada'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-zinc-400 mt-0.5">
                              {brandKit?.name 
                                ? `${brandKit.name} ${brandKit.creci ? `• CRECI ${brandKit.creci}` : ''} ${brandKit.whatsapp ? `• ${brandKit.whatsapp}` : ''}`
                                : 'Configure seu logo, CRECI e WhatsApp uma vez e eles aparecerão em todas as suas artes.'
                              }
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-orange-200/60 dark:border-zinc-800">
                          <button
                            type="button"
                            onClick={() => setActiveTab('minha_marca')}
                            className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline"
                          >
                            {brandKit?.name ? 'Editar Marca' : 'Configurar Marca'}
                          </button>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <span className="text-xs font-medium text-gray-600 dark:text-zinc-400">Aplicar:</span>
                            <button 
                              type="button"
                              onClick={() => setApplyBrandKit(!applyBrandKit)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                applyBrandKit ? 'bg-orange-600' : 'bg-gray-300 dark:bg-zinc-700'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                applyBrandKit ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-5 sm:p-7 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-6">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                          3. Escolha o Estilo Visual
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mb-4">
                          O estilo "Modern" é pré-selecionado por ser o mais equilibrado para fotos de imóveis.
                        </p>
                        <TemplateSelector selected={selectedTemplate} onSelect={setSelectedTemplate} />
                      </div>

                      <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
                        <h3 className="text-sm font-bold text-gray-800 dark:text-zinc-200 mb-2">
                          Formato da Arte
                        </h3>
                        <AspectRatioSelector selected={aspectRatio} onSelect={setAspectRatio} />
                      </div>

                      <div className="pt-5 border-t border-gray-100 dark:border-zinc-800 flex flex-col-reverse sm:flex-row gap-3 items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="w-full sm:w-auto px-4 py-2.5 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 font-semibold rounded-xl transition-colors text-sm flex items-center justify-center space-x-1.5"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Voltar para Informações</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setCurrentStep(4);
                            setMobileViewTab('preview');
                          }}
                          className="w-full sm:w-auto px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm active:scale-95"
                        >
                          <span>Ver Post Pronto ✨</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4 CONTROLS (DESKTOP) */}
                {currentStep === 4 && (
                  <div className="bg-white dark:bg-zinc-900 p-5 sm:p-7 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-6 animate-in fade-in duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-zinc-800">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <span>Arte Pronta para Publicar!</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold">
                            Pronto
                          </span>
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
                          Baixe o arquivo em alta resolução ou compartilhe direto.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-xs text-orange-600 dark:text-orange-400 hover:underline font-semibold text-left sm:text-right"
                      >
                        ← Fazer alterações nos dados
                      </button>
                    </div>

                    {/* Primary Export Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleDownload}
                        disabled={isExporting || images.length === 0}
                        className="flex-1 py-3.5 px-6 rounded-xl shadow-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all flex items-center justify-center text-sm active:scale-95 disabled:opacity-50"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        <span>{isExporting ? (exportProgressText || 'Gerando imagem...') : (images.length > 1 ? `Baixar Todas (${images.length})` : 'Baixar Imagem')}</span>
                      </button>

                      <button
                        onClick={handleShare}
                        disabled={isExporting || images.length === 0}
                        className="py-3.5 px-5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 font-semibold transition-all flex items-center justify-center text-sm active:scale-95 disabled:opacity-50"
                      >
                        <Share2 className="w-4 h-4 mr-2 text-emerald-600" />
                        <span>Compartilhar</span>
                      </button>
                    </div>

                    {/* Optional Secondary Tools Accordion */}
                    <div className="pt-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                        Ajustes Opcionais
                      </h3>
                      {renderSecondaryTools()}
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Side (Desktop Live Preview & Mobile Step 4 Preview) */}
              <div className={`w-full lg:sticky lg:top-6 lg:self-start ${currentStep === 4 ? 'block' : 'hidden lg:block'}`}>
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden flex flex-col">
                  {/* Preview Topbar */}
                  <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                        Pré-visualização
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 font-medium">
                        {aspectRatio === 'feed' ? 'Feed 3:4' : 'Story 9:16'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {idEmEdicao && (
                        <button
                          onClick={handleSaveOnly}
                          disabled={isExporting}
                          className="px-3 py-1 bg-transparent border border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                        >
                          Salvar Imóvel
                        </button>
                      )}

                      {/* Photo Carousel Pills if > 1 */}
                      {images.length > 1 && (
                        <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
                          {images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setPreviewIndex(idx)}
                              className={`w-6 h-6 shrink-0 rounded-full text-xs font-bold transition-colors ${
                                previewIndex === idx 
                                  ? 'bg-orange-600 text-white shadow-sm' 
                                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-200'
                              }`}
                              title={`Ver Foto ${idx + 1}`}
                            >
                              {idx + 1}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preview Canvas Area */}
                  <div className="p-3 sm:p-6 bg-gray-100/70 dark:bg-zinc-950 flex items-center justify-center min-h-[380px] sm:min-h-[500px] overflow-hidden relative">
                    <div ref={previewContainerRef} className="w-full h-full flex items-center justify-center relative min-h-[360px] sm:min-h-[480px]">
                      {images.length > 0 ? (
                        <div 
                          ref={previewRef}
                          className={`relative shadow-2xl transition-all duration-300 bg-white ${aspectRatio === 'feed' ? 'aspect-[3/4]' : 'aspect-[9/16]'}`}
                          style={{ 
                            width: '1080px', 
                            height: aspectRatio === 'story' ? '1920px' : '1440px',
                            transform: `scale(${previewScale})`,
                            transformOrigin: 'center center',
                            fontSize: '16px',
                            position: 'absolute',
                            margin: 'auto'
                          }}
                        >
                          <TemplateRenderer 
                            templateId={selectedTemplate} 
                            details={details} 
                            image={images[previewIndex] || null} 
                            logo={applyBrandKit ? (brandKit?.logo || null) : null}
                            aspectRatio={aspectRatio}
                            brandKit={applyBrandKit ? brandKit : undefined}
                            options={{...templateOptions, badge: seloAtivo, imagePositionX: templateOptions.imagePositions?.[previewIndex] ?? templateOptions.imagePositionX ?? 50}}
                            userPlan={userPlan}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-8 text-gray-400 dark:text-zinc-500 space-y-3">
                          <div className="w-16 h-16 rounded-2xl bg-gray-200/60 dark:bg-zinc-800 flex items-center justify-center text-gray-400">
                            <Eye size={28} />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-700 dark:text-zinc-300">Nenhuma foto selecionada ainda</p>
                            <p className="text-xs text-gray-500 mt-1 max-w-xs">
                              Adicione fotos no Passo 1 para visualizar sua arte renderizada em tempo real.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCurrentStep(1)}
                            className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-sm hover:bg-orange-700 transition-colors"
                          >
                            + Adicionar Fotos
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar under preview on mobile in Step 4 */}
                  {currentStep === 4 && (
                    <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-zinc-800 space-y-3 block lg:hidden">
                      <div className="flex gap-2">
                        <button
                          onClick={handleDownload}
                          disabled={isExporting || images.length === 0}
                          className="flex-1 py-3 px-4 rounded-xl shadow-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all flex items-center justify-center text-sm active:scale-95 disabled:opacity-50"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          <span>{isExporting ? (exportProgressText || 'Gerando...') : (images.length > 1 ? `Baixar Todas (${images.length})` : 'Baixar Imagem')}</span>
                        </button>
                        <button
                          onClick={handleShare}
                          disabled={isExporting || images.length === 0}
                          className="py-3 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 font-semibold transition-all flex items-center justify-center text-sm active:scale-95 disabled:opacity-50"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="w-full py-2.5 text-xs text-orange-600 dark:text-orange-400 font-bold hover:underline text-center"
                      >
                        ← Fazer alterações nos dados do imóvel
                      </button>

                      <div className="pt-2">
                        {renderSecondaryTools(true)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Mobile Floating "Ver Arte" Pill when in steps 1, 2, or 3 */}
            {currentStep < 4 && images.length > 0 && (
              <div className="fixed bottom-5 right-5 z-40 lg:hidden">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(4);
                    setMobileViewTab('preview');
                  }}
                  className="px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl flex items-center space-x-2 active:scale-95 transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver Arte ({images.length})</span>
                </button>
              </div>
            )}
          </div>
        )}

<footer className={`text-center py-6 text-sm text-gray-500 dark:text-zinc-400 mt-auto border-t border-gray-100 dark:border-zinc-800 ${mobileViewTab === "preview" ? "hidden lg:block" : ""}`}>
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
              height: aspectRatio === 'story' ? '1920px' : '1440px',
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
              options={{...templateOptions, badge: seloAtivo, imagePositionX: templateOptions.imagePositions?.[idx] ?? templateOptions.imagePositionX ?? 50}}
              userPlan={userPlan}
            />
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
