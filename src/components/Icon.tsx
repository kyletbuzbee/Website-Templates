/**
 * Unified Icon Web Component
 * Professional icon system supporting multiple icon libraries
 */

export type IconSource = 'hero-outline' | 'hero-solid' | 'lucide' | 'tabler' | 'phosphor' | 'svg';

// Icon registry mapping icon names to their sources and actual component names
const ICON_REGISTRY: Record<string, { source: IconSource; component: string; svgPath?: string }> = {
  // Navigation & UI
  'home': { source: 'hero-outline', component: 'HomeIcon', svgPath: 'M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z M12 5.432l5.897 5.897H6.103L12 5.432z M16.28 9.28l-4.28 4.28-4.28-4.28a.75.75 0 00-1.06 1.06l5 5a.75.75 0 001.06 0l5-5a.75.75 0 00-1.06-1.06z' },
  'user': { source: 'hero-outline', component: 'UserIcon', svgPath: 'M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z' },
  'settings': { source: 'lucide', component: 'Settings', svgPath: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z' },
  'menu': { source: 'hero-outline', component: 'Bars3Icon', svgPath: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' },
  'close': { source: 'hero-outline', component: 'XMarkIcon', svgPath: 'M6 18L18 6M6 6l12 12' },
  'search': { source: 'hero-outline', component: 'MagnifyingGlassIcon', svgPath: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' },

  // Business & Services
  'building': { source: 'hero-outline', component: 'BuildingOfficeIcon', svgPath: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M19.5 8.25h1.5m-1.5 3h1.5m-1.5 3h1.5' },
  'briefcase': { source: 'hero-outline', component: 'BriefcaseIcon', svgPath: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.156.288-4.358 1.215-6.378 2.727a2.25 2.25 0 01-2.25 0c-2.02-1.512-4.222-2.439-6.378-2.727A2.25 2.25 0 013.75 18.4V14.15a2.25 2.25 0 011.1-1.946l7.5-4.286a2.25 2.25 0 012.1 0l7.5 4.286c.783.448 1.3 1.287 1.3 2.18z M6.75 6.75h10.5M6.75 6.75V4.5a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 012.25 2.25v2.25' },
  'cog': { source: 'hero-outline', component: 'Cog6ToothIcon', svgPath: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a6.759 6.759 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  'wrench': { source: 'lucide', component: 'Wrench', svgPath: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' },
  'tools': { source: 'tabler', component: 'IconTools', svgPath: 'M3 21h4l13-13a2 2 0 0 0-2-2l-13 13v4z M14.66 5.66l3.68 3.68M7 17l-4 4l4-4z M17 7l4-4l-4 4z' },

  // Fitness & Health
  'dumbbell': { source: 'lucide', component: 'Dumbbell', svgPath: 'M14.4 14.4 9.6 9.6 M18.65 8.35l3.6 3.6a2.12 2.12 0 0 1 0 3l-3.6 3.6 M22.25 12l-3.6-3.6 M8.35 18.65l-3.6-3.6a2.12 2.12 0 0 1 0-3l3.6-3.6 M5.75 12l3.6 3.6 M14.4 9.6l4.95-4.95a2.12 2.12 0 0 1 3 0l.35.35a2.12 2.12 0 0 1 0 3l-4.95 4.95 M9.6 14.4l-4.95 4.95a2.12 2.12 0 0 1-3 0l-.35-.35a2.12 2.12 0 0 1 0-3l4.95-4.95' },
  'heart': { source: 'hero-outline', component: 'HeartIcon', svgPath: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' },
  'activity': { source: 'hero-outline', component: 'ChartBarIcon', svgPath: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C21.496 3 22 3.504 22 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
  'stethoscope': { source: 'tabler', component: 'IconStethoscope', svgPath: 'M11 17a3 3 0 0 0-3-3h-1a3 3 0 0 0-3 3M6 17v4M6 10v4M6 10a3 3 0 1 0 0-6M9 5a3 3 0 1 1 6 0v6a3 3 0 0 1-6 0V5z M15 8h1a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-1' },
  'medical': { source: 'hero-outline', component: 'HeartIcon', svgPath: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' },

  // Legal
  'scales': { source: 'phosphor', component: 'Scales', svgPath: 'M3 6h18M3 12h18M3 18h18M7 6v12M17 6v12M9 6v12M15 6v12' },
  'gavel': { source: 'phosphor', component: 'Hammer', svgPath: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' },
  'document': { source: 'hero-outline', component: 'DocumentTextIcon', svgPath: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12 3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
  'contract': { source: 'hero-outline', component: 'DocumentCheckIcon', svgPath: 'M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z M10.5 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5 M14.25 6.75h1.5m-1.5 3h1.5M21 12l-3.75 3.75-1.5-1.5L21 12z' },

  // Real Estate
  'house': { source: 'hero-outline', component: 'HomeIcon', svgPath: 'M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z M12 5.432l5.897 5.897H6.103L12 5.432z M16.28 9.28l-4.28 4.28-4.28-4.28a.75.75 0 00-1.06 1.06l5 5a.75.75 0 001.06 0l5-5a.75.75 0 00-1.06-1.06z' },
  'home-modern': { source: 'hero-outline', component: 'HomeModernIcon', svgPath: 'M19.006 3.705a.75.75 0 00-.512-1.41L6.69 6.89a.75.75 0 00-.2 1.3l5.826 2.21a.75.75 0 00.581 0l5.826-2.21a.75.75 0 001.11-.7l-4.874 2.191a.75.75 0 00-.387.387L8.99 13.12a.75.75 0 001.062.932l4.875-2.19a.75.75 0 00.387-.388l2.19-4.874a.75.75 0 00-.932-1.061l-2.19 4.874a.75.75 0 00.387.387l4.874-2.19z M7.025 11.133l-2.19 4.874a.75.75 0 101.36.643l2.19-4.874a.75.75 0 00-1.36-.643z M10.5 17.25a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75z' },
  'building-2': { source: 'hero-outline', component: 'BuildingOffice2Icon', svgPath: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M19.5 8.25h1.5m-1.5 3h1.5m-1.5 3h1.5' },

  // Photography
  'camera': { source: 'hero-outline', component: 'CameraIcon', svgPath: 'M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z' },
  'image': { source: 'hero-outline', component: 'PhotoIcon', svgPath: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0Z' },
  'film': { source: 'hero-outline', component: 'FilmIcon', svgPath: 'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z' },

  // Restaurants
  'utensils': { source: 'lucide', component: 'Utensils', svgPath: 'M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V2m5 0h7l1.5 5L21 2v7c0 1.1-.9 2-2 2h-4a2 2 0 0 0-2 2v7' },
  'coffee': { source: 'lucide', component: 'Coffee', svgPath: 'M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z M6 2v2m6-2v2' },
  'chef-hat': { source: 'lucide', component: 'ChefHat', svgPath: 'M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6v-7.13z M6 17h12' },

  // E-commerce
  'shopping-cart': { source: 'hero-outline', component: 'ShoppingCartIcon', svgPath: 'M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0z' },
  'shopping-bag': { source: 'hero-outline', component: 'ShoppingBagIcon', svgPath: 'M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM14.25 10.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm-4.5 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0z' },
  'credit-card': { source: 'hero-outline', component: 'CreditCardIcon', svgPath: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5z' },

  // Roofing & Construction
  'hard-hat': { source: 'tabler', component: 'IconHelmet', svgPath: 'M12 4a4 4 0 0 1 4 4v6a4 4 0 1 1-8 0V8a4 4 0 0 1 4-4z M12 16v4M8 12h8' },
  'hammer': { source: 'phosphor', component: 'Hammer', svgPath: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' },
  'construction': { source: 'tabler', component: 'IconCrane', svgPath: 'M7 21h10M12 21v-9m0 0l-4-4m4 4l4-4m-4-4V3m0 0l4 4M12 3l-4 4' },

  // Contact & Communication
  'phone': { source: 'hero-outline', component: 'PhoneIcon', svgPath: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z' },
  'envelope': { source: 'hero-outline', component: 'EnvelopeIcon', svgPath: 'M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z' },

  // Social Media
  'facebook': { source: 'lucide', component: 'Facebook', svgPath: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
  'twitter': { source: 'lucide', component: 'Twitter', svgPath: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z' },
  'instagram': { source: 'lucide', component: 'Instagram', svgPath: 'M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0z' },
  'linkedin': { source: 'lucide', component: 'Linkedin', svgPath: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z' },
  'youtube': { source: 'lucide', component: 'Youtube', svgPath: 'M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17 M10 15l5-3-5-3z' },

  // Status & Actions
  'check': { source: 'hero-outline', component: 'CheckIcon', svgPath: 'M4.5 12.75l6 6 9-13.5' },
  'check-circle': { source: 'hero-outline', component: 'CheckCircleIcon', svgPath: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  'exclamation': { source: 'hero-outline', component: 'ExclamationTriangleIcon', svgPath: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' },
  'info': { source: 'hero-outline', component: 'InformationCircleIcon', svgPath: 'M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9-3.75h.008v.008H12V8.25z' },
  'star': { source: 'hero-outline', component: 'StarIcon', svgPath: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z' },
  'star-solid': { source: 'hero-solid', component: 'StarIcon', svgPath: 'M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z' },

  // Arrows & Navigation
  'arrow-left': { source: 'hero-outline', component: 'ArrowLeftIcon', svgPath: 'M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18' },
  'arrow-right': { source: 'hero-outline', component: 'ArrowRightIcon', svgPath: 'M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75' },
  'arrow-up': { source: 'hero-outline', component: 'ArrowUpIcon', svgPath: 'M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18' },
  'arrow-down': { source: 'hero-outline', component: 'ArrowDownIcon', svgPath: 'M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3' },
  'chevron-left': { source: 'hero-outline', component: 'ChevronLeftIcon', svgPath: 'M15.75 19.5L8.25 12l7.5-7.5' },
  'chevron-right': { source: 'hero-outline', component: 'ChevronRightIcon', svgPath: 'M8.25 4.5l7.5 7.5-7.5 7.5' },
  'chevron-up': { source: 'hero-outline', component: 'ChevronUpIcon', svgPath: 'M4.5 15.75l7.5-7.5 7.5 7.5' },
  'chevron-down': { source: 'hero-outline', component: 'ChevronDownIcon', svgPath: 'M19.5 8.25l-7.5 7.5-7.5-7.5' },
};

class IconComponent extends HTMLElement {
  private svgElement: SVGSVGElement | null = null;

  constructor() {
    super();
  }

  connectedCallback(): void {
    this.render();
  }

  static get observedAttributes(): string[] {
    return ['name', 'size', 'color', 'source'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  private render(): void {
    const name = this.getAttribute('name') || 'cog';
    const size = parseInt(this.getAttribute('size') || '24');
    const color = this.getAttribute('color') || 'currentColor';
    const source = this.getAttribute('source') as IconSource || 'hero-outline';

    // Get icon data from registry
    const iconData = ICON_REGISTRY[name];
    if (!iconData) {
      this.renderFallbackIcon(name, size);
      return;
    }

    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size.toString());
    svg.setAttribute('height', size.toString());
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', color);
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');

    // Add accessibility attributes
    const ariaLabel = this.getAttribute('aria-label') || this.getAttribute('title') || name;
    if (ariaLabel) {
      svg.setAttribute('aria-label', ariaLabel);
      svg.setAttribute('role', 'img');
    } else {
      svg.setAttribute('aria-hidden', 'true');
    }

    // Add path element
    if (iconData.svgPath) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', iconData.svgPath);
      svg.appendChild(path);
    }

    // Clear existing content and add new SVG
    this.innerHTML = '';
    this.appendChild(svg);
    this.svgElement = svg;
  }

  private renderFallbackIcon(name: string, size: number): void {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size.toString());
    svg.setAttribute('height', size.toString());
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');

    // Create a simple fallback icon (question mark in circle)
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '12');
    circle.setAttribute('cy', '12');
    circle.setAttribute('r', '10');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3m.08 4h.01');

    svg.appendChild(circle);
    svg.appendChild(path);

    this.innerHTML = '';
    this.appendChild(svg);
    this.svgElement = svg;
  }

  // Public methods
  setIcon(name: string): void {
    this.setAttribute('name', name);
  }

  setSize(size: number): void {
    this.setAttribute('size', size.toString());
  }

  setColor(color: string): void {
    this.setAttribute('color', color);
  }

  setSource(source: IconSource): void {
    this.setAttribute('source', source);
  }
}

// Register the custom element
customElements.define('icon-element', IconComponent);

// Export types and utilities
export { ICON_REGISTRY };
export { IconComponent };

// Utility functions
export const getAvailableIcons = (): string[] => {
  return Object.keys(ICON_REGISTRY);
};

export const hasIcon = (name: string): boolean => {
  return name in ICON_REGISTRY;
};

export default IconComponent;
