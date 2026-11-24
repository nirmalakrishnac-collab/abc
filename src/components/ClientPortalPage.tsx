import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  FileText,
  ImagePlus,
  KeyRound,
  Lock,
  LogOut,
  Plus,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  BlogPost,
  GalleryItem,
  SiteContentState,
  SpaOffer,
  SpaService,
} from '../data/spaData';
import { SpaImage } from './SpaImage';

interface ClientPortalPageProps {
  siteData: SiteContentState;
  sessionToken: string | null;
  onTokenChange: (token: string | null) => void;
  onRefreshSiteData: (token?: string | null) => Promise<void>;
  onBackToWebsite: () => void;
}

type PortalTab = 'blogs' | 'gallery' | 'services' | 'settings';
type PortalRole = 'owner' | 'blogger';

export function ClientPortalPage({
  siteData,
  sessionToken,
  onTokenChange,
  onRefreshSiteData,
  onBackToWebsite,
}: ClientPortalPageProps) {
  const [authStatusLoading, setAuthStatusLoading] = useState(true);
  const [backendUnavailable, setBackendUnavailable] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [hasBloggerAccount, setHasBloggerAccount] = useState(false);
  const [role, setRole] = useState<PortalRole | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [setupBloggerPassword, setSetupBloggerPassword] = useState('');
  const [newBloggerPassword, setNewBloggerPassword] = useState('');
  const [savingBloggerPass, setSavingBloggerPass] = useState(false);
  const [newOwnerPassword, setNewOwnerPassword] = useState('');
  const [confirmNewOwnerPassword, setConfirmNewOwnerPassword] = useState('');
  const [savingOwnerPass, setSavingOwnerPass] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState<PortalTab>('blogs');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Blog Editor State
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('Massage Therapy');
  const [blogAuthor, setBlogAuthor] = useState('Spark Spa Desk');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCover, setBlogCover] = useState('/src/assets/images/hero_spa_sanctuary_1795110762237.jpg');
  const [blogStatus, setBlogStatus] = useState<'published' | 'draft'>('published');
  const [uploadingCover, setUploadingCover] = useState(false);

  // Gallery Upload State
  const [galTitle, setGalTitle] = useState('');
  const [galCategory, setGalCategory] = useState<'interiors' | 'suites' | 'rituals'>('interiors');
  const [galCaption, setGalCaption] = useState('');
  const [galImage, setGalImage] = useState('');
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Service Editor State
  const [editingService, setEditingService] = useState<SpaService | null>(null);
  const [newSvcName, setNewSvcName] = useState('');
  const [newSvcCategory, setNewSvcCategory] = useState<'massage' | 'salon' | 'holistic'>('massage');
  const [newSvcDuration, setNewSvcDuration] = useState('Duration: Custom Session');
  const [newSvcPrice, setNewSvcPrice] = useState('Tariff: Price Upon Enquiry');
  const [newSvcDesc, setNewSvcDesc] = useState('');
  const [newSvcImage, setNewSvcImage] = useState('/src/assets/images/therapy_swedish_action_1795111730062.jpg');

  // Offer Editor State
  const [editingOffer, setEditingOffer] = useState<SpaOffer | null>(null);

  // Business Settings State
  const [cfgBrand, setCfgBrand] = useState(siteData.config.brandName);
  const [cfgArea, setCfgArea] = useState(siteData.config.area);
  const [cfgAddress2, setCfgAddress2] = useState(siteData.config.displayAddressLine2);
  const [cfgStreetNote, setCfgStreetNote] = useState(siteData.config.editableStreetNote);
  const [cfgHours, setCfgHours] = useState(siteData.config.hours);
  const [cfgWhatsapp, setCfgWhatsapp] = useState(siteData.config.whatsappNumber);
  const [cfgPhone, setCfgPhone] = useState(siteData.config.phoneDisplay);
  const [offerTitle, setOfferTitle] = useState(siteData.welcomeOffer.title);
  const [offerCode, setOfferCode] = useState(siteData.welcomeOffer.offerCode);
  const [offerSubtitle, setOfferSubtitle] = useState(siteData.welcomeOffer.subtitle);

  useEffect(() => {
    setCfgBrand(siteData.config.brandName);
    setCfgArea(siteData.config.area);
    setCfgAddress2(siteData.config.displayAddressLine2);
    setCfgStreetNote(siteData.config.editableStreetNote);
    setCfgHours(siteData.config.hours);
    setCfgWhatsapp(siteData.config.whatsappNumber);
    setCfgPhone(siteData.config.phoneDisplay);
    setOfferTitle(siteData.welcomeOffer.title);
    setOfferCode(siteData.welcomeOffer.offerCode);
    setOfferSubtitle(siteData.welcomeOffer.subtitle);
  }, [siteData]);

  useEffect(() => {
    let active = true;
    async function checkStatus() {
      try {
        const res = await fetch('/api/client/status', {
          cache: 'no-store',
          headers: sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {},
        });
        const contentType = res.headers.get('content-type') || '';
        if (!res.ok || !contentType.includes('application/json')) {
          throw new Error('Status check failed');
        }
        const data = (await res.json()) as {
          needsSetup: boolean;
          hasBloggerAccount?: boolean;
          authenticated: boolean;
          role?: PortalRole | null;
        };
        if (active) {
          setBackendUnavailable(false);
          setNeedsSetup(data.needsSetup);
          setHasBloggerAccount(Boolean(data.hasBloggerAccount));
          const resolvedRole = data.authenticated && data.role ? data.role : null;
          setRole(resolvedRole);
          if (resolvedRole === 'blogger') {
            setActiveTab((prev) => (prev === 'services' || prev === 'settings' ? 'blogs' : prev));
          }
          if (sessionToken && !data.authenticated) {
            onTokenChange(null);
          }
        }
      } catch {
        if (active) setBackendUnavailable(true);
      } finally {
        if (active) setAuthStatusLoading(false);
      }
    }
    void checkStatus();
    return () => {
      active = false;
    };
  }, [sessionToken, onTokenChange]);

  const showToast = (msg: string) => {
    setErrorMsg(null);
    setToastMsg(msg);
    window.setTimeout(() => setToastMsg(null), 4000);
  };

  const showError = (msg: string) => {
    setToastMsg(null);
    setErrorMsg(msg);
  };

  const uploadImageFile = async (file: File): Promise<string | null> => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showError('Please upload a JPG, PNG, or WEBP photo.');
      return null;
    }
    if (file.size > 5 * 1024 * 1024) {
      showError('Please choose an image under 5 MB.');
      return null;
    }
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Failed to read image'));
      reader.readAsDataURL(file);
    });

    const res = await fetch('/api/client/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({ mimeType: file.type, dataBase64: base64 }),
    });
    const data = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !data.url) {
      showError(data.error || 'Image upload failed.');
      return null;
    }
    return data.url;
  };

  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const trimmedBlogger = setupBloggerPassword.trim();
    if (needsSetup) {
      if (passwordInput.length < 8) {
        setAuthError('Please create an Owner password of at least 8 characters.');
        return;
      }
      if (passwordInput !== confirmPassword) {
        setAuthError('Owner passwords do not match.');
        return;
      }
      if (trimmedBlogger && trimmedBlogger.length < 8) {
        setAuthError('Client Blogs-Only password must be at least 8 characters (or leave blank for now).');
        return;
      }
      if (trimmedBlogger && trimmedBlogger === passwordInput) {
        setAuthError('Client Blogs-Only password must differ from the Owner password.');
        return;
      }
    }
    setAuthSubmitting(true);
    try {
      const endpoint = needsSetup ? '/api/client/setup' : '/api/client/login';
      const payload = needsSetup
        ? { password: passwordInput, ...(trimmedBlogger ? { bloggerPassword: trimmedBlogger } : {}) }
        : { password: passwordInput };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { token?: string; role?: PortalRole; error?: string };
      if (!res.ok || !data.token) {
        setAuthError(data.error || 'Authentication failed.');
        return;
      }
      const nextRole: PortalRole = data.role === 'blogger' ? 'blogger' : 'owner';
      setNeedsSetup(false);
      setRole(nextRole);
      if (trimmedBlogger) setHasBloggerAccount(true);
      setPasswordInput('');
      setConfirmPassword('');
      setSetupBloggerPassword('');
      setActiveTab('blogs');
      onTokenChange(data.token);
      await onRefreshSiteData(data.token);
    } catch {
      setAuthError('Unable to reach server. Please try again.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleSaveBloggerPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (newBloggerPassword.trim().length < 8) {
      showError('Client Blogs-Only password must be at least 8 characters.');
      return;
    }
    setSavingBloggerPass(true);
    try {
      const res = await fetch('/api/client/blogger-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ bloggerPassword: newBloggerPassword.trim() }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        showError(data.error || 'Could not update Client Blogs-Only password.');
        return;
      }
      setHasBloggerAccount(true);
      setNewBloggerPassword('');
      showToast('Client Blogs & Photos Only password saved! Share it with your client along with the /client-portal link.');
    } catch {
      showError('Unable to reach server. Please try again.');
    } finally {
      setSavingBloggerPass(false);
    }
  };

  const handleSaveOwnerPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (newOwnerPassword.length < 8) {
      showError('New Owner password must be at least 8 characters.');
      return;
    }
    if (newOwnerPassword !== confirmNewOwnerPassword) {
      showError('New Owner passwords do not match.');
      return;
    }
    setSavingOwnerPass(true);
    try {
      const res = await fetch('/api/client/owner-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ newPassword: newOwnerPassword }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        showError(data.error || 'Could not update Owner password.');
        return;
      }
      setNewOwnerPassword('');
      setConfirmNewOwnerPassword('');
      showToast('Owner password updated successfully!');
    } catch {
      showError('Unable to reach server. Please try again.');
    } finally {
      setSavingOwnerPass(false);
    }
  };

  const handleCopyPortalUrl = async () => {
    const portalUrl = `${window.location.origin}/client-portal`;
    try {
      await navigator.clipboard.writeText(portalUrl);
      showToast('Client Portal login link copied to clipboard.');
    } catch {
      showError(`Copy this link manually: ${portalUrl}`);
    }
  };

  // Blog Handlers
  const handleBlogFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    const url = await uploadImageFile(file);
    if (url) {
      setBlogCover(url);
      showToast('Blog cover photo uploaded.');
    }
    setUploadingCover(false);
    e.target.value = '';
  };

  const resetBlogForm = () => {
    setEditingBlogId(null);
    setBlogTitle('');
    setBlogCategory('Massage Therapy');
    setBlogAuthor('Spark Spa Desk');
    setBlogExcerpt('');
    setBlogContent('');
    setBlogCover('/src/assets/images/hero_spa_sanctuary_1795110762237.jpg');
    setBlogStatus('published');
  };

  const handleSaveBlog = async (e: FormEvent) => {
    e.preventDefault();
    const isEdit = Boolean(editingBlogId);
    const endpoint = isEdit ? `/api/client/blogs/${editingBlogId}` : '/api/client/blogs';
    const res = await fetch(endpoint, {
      method: isEdit ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        title: blogTitle,
        category: blogCategory,
        author: blogAuthor,
        excerpt: blogExcerpt,
        content: blogContent,
        coverImage: blogCover,
        status: blogStatus,
      }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      showError(data.error || 'Could not save blog article.');
      return;
    }
    resetBlogForm();
    await onRefreshSiteData(sessionToken);
    showToast(isEdit ? 'Blog article updated!' : 'Blog article published to live website!');
  };

  const handleDeleteBlog = async (id: string) => {
    const res = await fetch(`/api/client/blogs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
    if (res.ok) {
      await onRefreshSiteData(sessionToken);
      showToast('Blog article removed.');
    }
  };

  const startEditBlog = (post: BlogPost) => {
    setEditingBlogId(post.id);
    setBlogTitle(post.title);
    setBlogCategory(post.category);
    setBlogAuthor(post.author);
    setBlogExcerpt(post.excerpt);
    setBlogContent(post.content);
    setBlogCover(post.coverImage);
    setBlogStatus(post.status);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Gallery Handlers
  const handleGalleryFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingGallery(true);
    const url = await uploadImageFile(file);
    if (url) {
      setGalImage(url);
      showToast('Photo uploaded—add a title and click Save to Gallery.');
    }
    setUploadingGallery(false);
    e.target.value = '';
  };

  const handleAddGalleryItem = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/client/gallery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        title: galTitle,
        spaceCategory: galCategory,
        caption: galCaption,
        image: galImage,
      }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      showError(data.error || 'Could not add gallery photo.');
      return;
    }
    setGalTitle('');
    setGalCaption('');
    setGalImage('');
    await onRefreshSiteData(sessionToken);
    showToast('Photo added to live Sanctuary Gallery!');
  };

  const handleDeleteGalleryItem = async (id: string) => {
    const res = await fetch(`/api/client/gallery/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
    if (res.ok) {
      await onRefreshSiteData(sessionToken);
      showToast('Gallery photo deleted.');
    }
  };

  // Service Handlers
  const handleSaveServiceEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    const res = await fetch(`/api/client/services/${editingService.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(editingService),
    });
    if (res.ok) {
      setEditingService(null);
      await onRefreshSiteData(sessionToken);
      showToast('Service updated!');
    } else {
      showError('Failed to update service.');
    }
  };

  const handleAddService = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/client/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        name: newSvcName,
        category: newSvcCategory,
        duration: newSvcDuration,
        pricePlaceholder: newSvcPrice,
        shortDescription: newSvcDesc,
        image: newSvcImage,
      }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      showError(data.error || 'Could not add service.');
      return;
    }
    setNewSvcName('');
    setNewSvcDesc('');
    await onRefreshSiteData(sessionToken);
    showToast('New service published live to website!');
  };

  const handleDeleteService = async (id: string) => {
    const res = await fetch(`/api/client/services/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
    if (res.ok) {
      await onRefreshSiteData(sessionToken);
      showToast('Service removed from website.');
    } else {
      showError('Could not remove service.');
    }
  };

  const handleSaveOfferEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;
    const res = await fetch(`/api/client/offers/${editingOffer.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(editingOffer),
    });
    if (res.ok) {
      setEditingOffer(null);
      await onRefreshSiteData(sessionToken);
      showToast('Offer package updated!');
    }
  };

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/client/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        config: {
          brandName: cfgBrand,
          area: cfgArea,
          displayAddressLine2: cfgAddress2,
          editableStreetNote: cfgStreetNote,
          hours: cfgHours,
          whatsappNumber: cfgWhatsapp,
          phoneDisplay: cfgPhone,
        },
        welcomeOffer: {
          title: offerTitle,
          offerCode,
          subtitle: offerSubtitle,
        },
      }),
    });
    if (res.ok) {
      await onRefreshSiteData(sessionToken);
      showToast('Business settings & WhatsApp number updated!');
    } else {
      showError('Failed to save settings.');
    }
  };

  // Dedicated Separate Client Portal Header
  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#1C1512]">
      <header className="bg-[#1C1512] text-[#FAF6EE] border-b border-[#D9B263]/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-md bg-[#5C1728] border border-[#D9B263]/40 flex items-center justify-center text-[#E8C57B]">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
            </span>
            <div>
              <p className="font-serif text-lg sm:text-xl font-medium leading-none">
                {siteData.config.brandName} · Client Studio
              </p>
              <p className="text-[11px] text-[#DFD3C0] mt-0.5">
                {role === 'blogger'
                  ? 'Signed in: Blogs & Photos Only'
                  : role === 'owner'
                  ? 'Signed in: Owner (Full Access)'
                  : 'Private Blog, Photo & Content Dashboard'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToWebsite}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-md border border-[#D9B263]/40 text-xs sm:text-sm font-medium text-[#E8C57B] hover:bg-[#D9B263] hover:text-[#1C1512] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>View Live Website</span>
            </button>
            {sessionToken && (
              <button
                type="button"
                onClick={() => {
                  setRole(null);
                  onTokenChange(null);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-md bg-[#5C1728] hover:bg-[#4A1120] text-xs sm:text-sm font-medium text-[#FAF6EE] transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!sessionToken ? (
          <div className="max-w-md mx-auto mt-8 bg-white border border-[#C69749]/35 rounded-xl p-7 sm:p-9 shadow-md">
            <div className="w-12 h-12 rounded-full bg-[#F3EBD9] border border-[#C69749]/40 flex items-center justify-center mb-5 text-[#5C1728]">
              <Lock className="w-5 h-5" aria-hidden="true" />
            </div>

            {authStatusLoading ? (
              <p className="text-sm text-[#524740]">Checking Client Portal status...</p>
            ) : backendUnavailable ? (
              <div>
                <h1 className="font-serif text-3xl font-medium text-[#1C1512]">
                  Server Required for Client Portal
                </h1>
                <p className="mt-2.5 text-sm text-[#524740] leading-relaxed">
                  This static deployment (such as Vercel static hosting) is serving only the public frontend pages, so live password login and blog/photo uploads are offline here.
                </p>
                <div className="mt-4 p-4 rounded-lg bg-[#F3EBD9] border border-[#C69749]/40 text-xs sm:text-sm text-[#1C1512] space-y-2">
                  <p className="font-semibold text-[#5C1728]">Where the Client Portal works live:</p>
                  <p>1. Use the <strong>Publish</strong> deployment from your app studio (runs the full Node backend).</p>
                  <p>2. Or upload the <strong>Hostinger PHP bundle</strong> (<code className="text-[#5C1728]">client-dashboard.php</code>) to your Hostinger hosting.</p>
                </div>
              </div>
            ) : (
              <>
                <h1 className="font-serif text-3xl font-medium text-[#1C1512]">
                  {needsSetup ? 'Set Up Dashboard Passwords' : 'Client Portal Sign In'}
                </h1>
                <p className="mt-2 text-sm text-[#524740] leading-relaxed">
                  {needsSetup
                    ? 'Set your Owner Password (full dashboard access) and optionally create a separate Client Blogs-Only Password so your client can only upload blogs and photos.'
                    : 'Enter your Owner Password (full access) OR your Client Blogs-Only Password (upload blogs & photos only).'}
                </p>

                {!needsSetup && hasBloggerAccount && (
                  <div className="mt-4 px-3.5 py-2.5 rounded-md bg-[#F3EBD9] border border-[#C69749]/35 text-xs text-[#1C1512]">
                    <span className="font-semibold text-[#5C1728]">Blogs &amp; Photos Only Login Active:</span>{' '}
                    Clients signing in with the Blogs-Only password can only publish blogs and upload gallery photos.
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="client-pass" className="block text-xs font-medium text-[#1C1512] mb-1.5">
                      {needsSetup ? 'Owner Password — Full Access (min 8 chars)' : 'Owner or Client Blogs-Only Password'}
                    </label>
                    <input
                      id="client-pass"
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter password"
                      className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm focus:outline-none focus:border-[#C69749]"
                    />
                  </div>

                  {needsSetup && (
                    <>
                      <div>
                        <label htmlFor="client-pass-confirm" className="block text-xs font-medium text-[#1C1512] mb-1.5">
                          Confirm Owner Password
                        </label>
                        <input
                          id="client-pass-confirm"
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter owner password"
                          className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm focus:outline-none focus:border-[#C69749]"
                        />
                      </div>

                      <div className="pt-3 border-t border-[#C69749]/25">
                        <label htmlFor="blogger-pass-setup" className="block text-xs font-medium text-[#1C1512] mb-1">
                          Client Blogs &amp; Photos Only Password (Optional, min 8 chars)
                        </label>
                        <p className="text-[11px] text-[#524740] mb-1.5">
                          Give this separate password to your client if you want them to upload blogs &amp; photos without touching prices or WhatsApp settings.
                        </p>
                        <input
                          id="blogger-pass-setup"
                          type="password"
                          value={setupBloggerPassword}
                          onChange={(e) => setSetupBloggerPassword(e.target.value)}
                          placeholder="Optional separate password for client"
                          className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm focus:outline-none focus:border-[#C69749]"
                        />
                      </div>
                    </>
                  )}

                  {authError && (
                    <p role="alert" className="text-xs font-medium text-[#5C1728]">
                      {authError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={authSubmitting}
                    className="w-full py-3 px-5 min-h-[46px] bg-[#5C1728] hover:bg-[#4A1120] text-[#FAF6EE] text-sm font-semibold rounded-md transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {authSubmitting
                      ? 'Verifying...'
                      : needsSetup
                      ? 'Save Passwords & Enter Dashboard'
                      : 'Unlock Client Dashboard'}
                  </button>
                </form>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {toastMsg && (
              <div role="status" className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-[#1B4D3E] text-[#FAF6EE] text-sm font-medium shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-[#E8C57B] shrink-0" aria-hidden="true" />
                <span>{toastMsg}</span>
              </div>
            )}
            {errorMsg && (
              <div role="alert" className="px-4 py-3 rounded-lg bg-[#5C1728]/10 border border-[#5C1728]/35 text-[#5C1728] text-sm font-medium">
                {errorMsg}
              </div>
            )}

            {role === 'blogger' && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#F3EBD9] border border-[#C69749]/40 text-xs sm:text-sm text-[#1C1512]">
                <ShieldCheck className="w-4 h-4 text-[#1B4D3E] shrink-0" aria-hidden="true" />
                <span>
                  <strong>Blogs &amp; Photos Access Mode:</strong> You can publish/edit blog articles with cover images and upload photos to the Sanctuary Gallery. Services, prices, and WhatsApp settings remain locked to the Owner.
                </span>
              </div>
            )}

            {/* Portal Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-[#C69749]/30 pb-4">
              {(
                role === 'blogger'
                  ? ([
                      { id: 'blogs', label: 'Blogs & Articles', icon: FileText },
                      { id: 'gallery', label: 'Photo Gallery Upload', icon: ImagePlus },
                    ] as const)
                  : ([
                      { id: 'blogs', label: 'Blogs & Articles', icon: FileText },
                      { id: 'gallery', label: 'Photo Gallery Upload', icon: ImagePlus },
                      { id: 'services', label: 'Services & Offers', icon: Sparkles },
                      { id: 'settings', label: 'Business & WhatsApp', icon: Settings },
                    ] as const)
              ).map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-md text-sm font-medium transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#5C1728] text-[#FAF6EE] shadow-sm'
                        : 'bg-white border border-[#C69749]/30 text-[#524740] hover:text-[#1C1512]'
                    }`}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: BLOGS & ARTICLES */}
            {activeTab === 'blogs' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <form
                  onSubmit={handleSaveBlog}
                  className="lg:col-span-6 bg-white border border-[#C69749]/30 rounded-xl p-6 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-2xl font-medium text-[#1C1512]">
                      {editingBlogId ? 'Edit Blog Article' : 'Publish New Blog Article'}
                    </h2>
                    {editingBlogId && (
                      <button
                        type="button"
                        onClick={resetBlogForm}
                        className="text-xs font-medium text-[#5C1728] underline cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1C1512] mb-1">Article Title *</label>
                    <input
                      type="text"
                      required
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                      placeholder="e.g. Benefits of Aromatherapy Massage in Monsoon"
                      className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#1C1512] mb-1">Category</label>
                      <input
                        type="text"
                        value={blogCategory}
                        onChange={(e) => setBlogCategory(e.target.value)}
                        className="w-full px-3 py-2 min-h-[42px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#1C1512] mb-1">Author</label>
                      <input
                        type="text"
                        value={blogAuthor}
                        onChange={(e) => setBlogAuthor(e.target.value)}
                        className="w-full px-3 py-2 min-h-[42px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#1C1512] mb-1">Status</label>
                      <select
                        value={blogStatus}
                        onChange={(e) => setBlogStatus(e.target.value === 'draft' ? 'draft' : 'published')}
                        className="w-full px-3 py-2 min-h-[42px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                      >
                        <option value="published">Published (Live)</option>
                        <option value="draft">Draft (Hidden)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1C1512] mb-1.5">
                      Upload Cover Photo (JPG, PNG, WEBP)
                    </label>
                    <div className="flex flex-wrap items-center gap-4">
                      <label className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] rounded-md bg-[#F3EBD9] border border-[#C69749]/40 text-xs font-semibold text-[#1C1512] hover:bg-[#EAE0CA] cursor-pointer">
                        <Upload className="w-4 h-4 text-[#5C1728]" aria-hidden="true" />
                        <span>{uploadingCover ? 'Uploading...' : 'Choose Photo'}</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleBlogFileChange}
                          className="hidden"
                        />
                      </label>
                      {blogCover && (
                        <div className="w-24 h-14 rounded overflow-hidden border border-[#C69749]/35 bg-[#EFE7D8]">
                          <SpaImage src={blogCover} alt="Blog preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1C1512] mb-1">Short Summary</label>
                    <input
                      type="text"
                      value={blogExcerpt}
                      onChange={(e) => setBlogExcerpt(e.target.value)}
                      placeholder="1–2 sentence preview shown on the blog page..."
                      className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1C1512] mb-1">Full Article Content *</label>
                    <textarea
                      rows={6}
                      required
                      value={blogContent}
                      onChange={(e) => setBlogContent(e.target.value)}
                      placeholder="Write your full wellness article here. Leave a blank line between paragraphs..."
                      className="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 min-h-[46px] bg-[#1B4D3E] hover:bg-[#22604D] text-[#FAF6EE] text-sm font-semibold rounded-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span>{editingBlogId ? 'Save Article Changes' : 'Publish Blog Article'}</span>
                  </button>
                </form>

                <div className="lg:col-span-6 space-y-4">
                  <h3 className="font-serif text-2xl font-medium text-[#1C1512]">
                    Published &amp; Draft Blogs ({siteData.blogs.length})
                  </h3>
                  {siteData.blogs.map((post) => (
                    <div
                      key={post.id}
                      className="flex flex-col sm:flex-row gap-4 bg-white border border-[#C69749]/25 rounded-xl p-4"
                    >
                      <div className="w-full sm:w-28 h-24 rounded-lg overflow-hidden bg-[#EFE7D8] shrink-0">
                        <SpaImage src={post.coverImage} alt={post.coverAlt} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-[#8F6422]">{post.category}</span>
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                              post.status === 'published'
                                ? 'bg-[#1B4D3E]/12 text-[#1B4D3E]'
                                : 'bg-[#524740]/12 text-[#524740]'
                            }`}
                          >
                            {post.status === 'published' ? 'Live' : 'Draft'}
                          </span>
                        </div>
                        <h4 className="font-serif text-lg font-semibold text-[#1C1512] truncate mt-1">
                          {post.title}
                        </h4>
                        <p className="text-xs text-[#524740] mt-1 line-clamp-2">{post.excerpt}</p>
                        <div className="mt-3 flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => startEditBlog(post)}
                            className="text-xs font-semibold text-[#5C1728] hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBlog(post.id)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-red-700 hover:underline cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: GALLERY UPLOAD */}
            {activeTab === 'gallery' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <form
                  onSubmit={handleAddGalleryItem}
                  className="lg:col-span-5 bg-white border border-[#C69749]/30 rounded-xl p-6 space-y-4 shadow-sm"
                >
                  <h2 className="font-serif text-2xl font-medium text-[#1C1512]">
                    Upload Spa Photo to Gallery
                  </h2>
                  <p className="text-xs text-[#524740]">
                    Upload real photos of your reception, massage suites, steam rooms, or candlelit ambience directly from your phone or computer.
                  </p>

                  <div>
                    <label className="inline-flex items-center justify-center w-full gap-2 px-4 py-6 rounded-lg border-2 border-dashed border-[#C69749]/50 bg-[#FAF6EE] hover:bg-[#F3EBD9] text-sm font-medium text-[#1C1512] cursor-pointer">
                      <Upload className="w-5 h-5 text-[#5C1728]" aria-hidden="true" />
                      <span>{uploadingGallery ? 'Uploading photo...' : 'Tap to Upload Spa Photo (JPG/PNG/WEBP)'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleGalleryFileChange}
                        className="hidden"
                      />
                    </label>
                    {galImage && (
                      <div className="mt-3 aspect-[16/10] rounded-lg overflow-hidden border border-[#C69749]/30">
                        <SpaImage src={galImage} alt="Uploaded preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1C1512] mb-1">Photo Title *</label>
                    <input
                      type="text"
                      required
                      value={galTitle}
                      onChange={(e) => setGalTitle(e.target.value)}
                      placeholder="e.g. Private Ayurveda Couple Suite"
                      className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1C1512] mb-1">Gallery Category</label>
                    <select
                      value={galCategory}
                      onChange={(e) =>
                        setGalCategory(
                          e.target.value === 'suites' || e.target.value === 'rituals'
                            ? e.target.value
                            : 'interiors'
                        )
                      }
                      className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                    >
                      <option value="interiors">Luxury Interiors</option>
                      <option value="suites">Massage Suites</option>
                      <option value="rituals">Thermal &amp; Rituals</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1C1512] mb-1">Caption</label>
                    <textarea
                      rows={2}
                      value={galCaption}
                      onChange={(e) => setGalCaption(e.target.value)}
                      placeholder="Short description shown when guests open the photo..."
                      className="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!galImage}
                    className="w-full py-3 px-5 min-h-[46px] bg-[#5C1728] hover:bg-[#4A1120] disabled:opacity-50 text-[#FAF6EE] text-sm font-semibold rounded-md cursor-pointer"
                  >
                    Add Photo to Live Gallery
                  </button>
                </form>

                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {siteData.gallery.map((item: GalleryItem) => (
                    <div
                      key={item.id}
                      className="bg-white border border-[#C69749]/25 rounded-xl overflow-hidden flex flex-col"
                    >
                      <div className="aspect-[16/10] bg-[#EFE7D8]">
                        <SpaImage src={item.image} alt={item.imageAlt} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-[#8F6422]">{item.categoryLabel}</p>
                          <p className="font-serif text-lg font-medium text-[#1C1512] truncate">{item.title}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteGalleryItem(item.id)}
                          aria-label={`Remove ${item.title}`}
                          className="p-2 text-red-700 hover:bg-red-50 rounded-md cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: SERVICES & OFFERS (OWNER ONLY) */}
            {activeTab === 'services' && role === 'owner' && (
              <div className="space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 space-y-4">
                    <h2 className="font-serif text-2xl font-medium text-[#1C1512]">
                      Spa Services ({siteData.services.length})
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {siteData.services.map((svc) => (
                        <div key={svc.id} className="bg-white border border-[#C69749]/25 rounded-xl p-4 space-y-2">
                          <p className="text-xs font-medium text-[#8F6422]">{svc.categoryLabel}</p>
                          <h3 className="font-serif text-xl font-medium text-[#1C1512]">{svc.name}</h3>
                          <p className="text-xs text-[#524740]">{svc.duration} · {svc.pricePlaceholder}</p>
                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              onClick={() => setEditingService(svc)}
                              className="text-xs font-semibold text-[#5C1728] hover:underline cursor-pointer"
                            >
                              Edit Price / Duration / Photo →
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteService(svc.id)}
                              className="inline-flex items-center gap-1 text-xs font-medium text-red-700 hover:underline cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-white border border-[#C69749]/30 rounded-xl p-6">
                    {editingService ? (
                      <form onSubmit={handleSaveServiceEdit} className="space-y-3.5">
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif text-2xl font-medium">Edit Service</h3>
                          <button type="button" onClick={() => setEditingService(null)} className="text-xs text-[#5C1728] underline cursor-pointer">
                            Cancel
                          </button>
                        </div>
                        <input
                          type="text"
                          value={editingService.name}
                          onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                          className="w-full px-3 py-2 min-h-[42px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                        />
                        <input
                          type="text"
                          value={editingService.duration}
                          onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                          placeholder="e.g. 60 Mins / 90 Mins"
                          className="w-full px-3 py-2 min-h-[42px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                        />
                        <input
                          type="text"
                          value={editingService.pricePlaceholder}
                          onChange={(e) => setEditingService({ ...editingService, pricePlaceholder: e.target.value })}
                          placeholder="e.g. ₹2,499 onwards"
                          className="w-full px-3 py-2 min-h-[42px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                        />
                        <textarea
                          rows={3}
                          value={editingService.shortDescription}
                          onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                        />
                        <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[#F3EBD9] border border-[#C69749]/40 text-xs font-semibold cursor-pointer">
                          <Upload className="w-3.5 h-3.5 text-[#5C1728]" aria-hidden="true" />
                          <span>Change Service Photo</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={async (ev) => {
                              const f = ev.target.files?.[0];
                              if (!f) return;
                              const url = await uploadImageFile(f);
                              if (url) setEditingService({ ...editingService, image: url });
                            }}
                            className="hidden"
                          />
                        </label>
                        <button type="submit" className="w-full py-2.5 bg-[#1B4D3E] text-[#FAF6EE] text-sm font-semibold rounded-md cursor-pointer">
                          Save Service Update
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleAddService} className="space-y-3.5">
                        <h3 className="font-serif text-2xl font-medium text-[#1C1512]">Add New Service</h3>
                        <input
                          type="text"
                          required
                          placeholder="Service Name (e.g. Thai Herbal Compress)"
                          value={newSvcName}
                          onChange={(e) => setNewSvcName(e.target.value)}
                          className="w-full px-3 py-2 min-h-[42px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                        />
                        <select
                          value={newSvcCategory}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewSvcCategory(val === 'holistic' ? 'holistic' : val === 'salon' ? 'salon' : 'massage');
                          }}
                          className="w-full px-3 py-2 min-h-[42px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                        >
                          <option value="massage">Massage Category</option>
                          <option value="salon">Hair &amp; Beauty Salon Category</option>
                          <option value="holistic">Holistic &amp; Couples Category</option>
                        </select>
                        <div className="grid grid-cols-2 gap-2.5">
                          <input
                            type="text"
                            value={newSvcDuration}
                            onChange={(e) => setNewSvcDuration(e.target.value)}
                            className="w-full px-3 py-2 min-h-[42px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                          />
                          <input
                            type="text"
                            value={newSvcPrice}
                            onChange={(e) => setNewSvcPrice(e.target.value)}
                            className="w-full px-3 py-2 min-h-[42px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                          />
                        </div>
                        <textarea
                          rows={2}
                          required
                          placeholder="Short therapy description..."
                          value={newSvcDesc}
                          onChange={(e) => setNewSvcDesc(e.target.value)}
                          className="w-full px-3 py-2 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                        />
                        <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[#F3EBD9] border border-[#C69749]/40 text-xs font-semibold cursor-pointer">
                          <Upload className="w-3.5 h-3.5 text-[#5C1728]" aria-hidden="true" />
                          <span>Upload Service Photo (Optional)</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={async (ev) => {
                              const f = ev.target.files?.[0];
                              if (!f) return;
                              const url = await uploadImageFile(f);
                              if (url) setNewSvcImage(url);
                            }}
                            className="hidden"
                          />
                        </label>
                        <button type="submit" className="w-full py-2.5 bg-[#5C1728] text-[#FAF6EE] text-sm font-semibold rounded-md cursor-pointer">
                          Add Service to Website
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {/* Offers Editor */}
                <div className="bg-white border border-[#C69749]/30 rounded-xl p-6 space-y-5">
                  <h2 className="font-serif text-2xl font-medium text-[#1C1512]">Offers &amp; Packages</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {siteData.offers.map((o) => (
                      <div key={o.id} className="p-4 rounded-lg bg-[#FAF6EE] border border-[#C69749]/25 space-y-2">
                        <p className="text-xs font-medium text-[#8F6422]">{o.code}</p>
                        <h3 className="font-serif text-xl font-medium">{o.title}</h3>
                        <p className="text-xs text-[#524740]">{o.durationPlaceholder} · {o.pricePlaceholder}</p>
                        <button
                          type="button"
                          onClick={() => setEditingOffer(o)}
                          className="text-xs font-semibold text-[#5C1728] hover:underline cursor-pointer"
                        >
                          Edit Package →
                        </button>
                      </div>
                    ))}
                  </div>
                  {editingOffer && (
                    <form onSubmit={handleSaveOfferEdit} className="pt-4 border-t border-[#C69749]/25 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={editingOffer.title}
                        onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                        className="px-3 py-2 min-h-[42px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                      />
                      <input
                        type="text"
                        value={editingOffer.pricePlaceholder}
                        onChange={(e) => setEditingOffer({ ...editingOffer, pricePlaceholder: e.target.value })}
                        className="px-3 py-2 min-h-[42px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                      />
                      <input
                        type="text"
                        value={editingOffer.durationPlaceholder}
                        onChange={(e) => setEditingOffer({ ...editingOffer, durationPlaceholder: e.target.value })}
                        className="px-3 py-2 min-h-[42px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                      />
                      <button type="submit" className="py-2.5 bg-[#1B4D3E] text-[#FAF6EE] text-sm font-semibold rounded-md cursor-pointer">
                        Save Offer Changes
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: BUSINESS & WHATSAPP SETTINGS (OWNER ONLY) */}
            {activeTab === 'settings' && role === 'owner' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <form
                  onSubmit={handleSaveSettings}
                  className="lg:col-span-7 bg-white border border-[#C69749]/30 rounded-xl p-6 sm:p-8 space-y-5 shadow-sm"
                >
                  <h2 className="font-serif text-2xl font-medium text-[#1C1512]">
                    Business Details, WhatsApp &amp; Welcome Offer
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1">WhatsApp Number (digits only, e.g. 9198...)</label>
                      <input
                        type="text"
                        value={cfgWhatsapp}
                        onChange={(e) => setCfgWhatsapp(e.target.value)}
                        className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Display Phone Number</label>
                      <input
                        type="text"
                        value={cfgPhone}
                        onChange={(e) => setCfgPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm tabular-nums"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1">Spa Name</label>
                      <input
                        type="text"
                        value={cfgBrand}
                        onChange={(e) => setCfgBrand(e.target.value)}
                        className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Opening Hours</label>
                      <input
                        type="text"
                        value={cfgHours}
                        onChange={(e) => setCfgHours(e.target.value)}
                        className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">Exact Street Address</label>
                    <input
                      type="text"
                      value={cfgAddress2}
                      onChange={(e) => setCfgAddress2(e.target.value)}
                      className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">Landmark Note</label>
                    <input
                      type="text"
                      value={cfgStreetNote}
                      onChange={(e) => setCfgStreetNote(e.target.value)}
                      className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                    />
                  </div>

                  <div className="pt-4 border-t border-[#C69749]/25 space-y-3">
                    <h3 className="font-serif text-xl font-medium">Website Welcome Offer Popup</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={offerTitle}
                        onChange={(e) => setOfferTitle(e.target.value)}
                        className="sm:col-span-2 px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                      />
                      <input
                        type="text"
                        value={offerCode}
                        onChange={(e) => setOfferCode(e.target.value)}
                        className="px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={offerSubtitle}
                      onChange={(e) => setOfferSubtitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3.5 min-h-[46px] bg-[#1B4D3E] hover:bg-[#22604D] text-[#FAF6EE] text-sm font-semibold rounded-md cursor-pointer"
                  >
                    Save Business Settings
                  </button>
                </form>

                <div className="lg:col-span-5 space-y-6">
                  <form
                    onSubmit={handleSaveOwnerPassword}
                    className="bg-white border border-[#C69749]/35 rounded-xl p-6 sm:p-7 space-y-4 shadow-sm"
                  >
                    <div className="flex items-center gap-2.5 text-[#1C1512]">
                      <Lock className="w-5 h-5 text-[#5C1728]" aria-hidden="true" />
                      <h2 className="font-serif text-2xl font-medium text-[#1C1512]">
                        Update Owner Password
                      </h2>
                    </div>
                    <p className="text-xs text-[#524740]">
                      Change your Owner (Full Access) login password anytime.
                    </p>
                    <div>
                      <label htmlFor="owner-pass-new" className="block text-xs font-medium text-[#1C1512] mb-1">
                        New Owner Password (min 8 chars)
                      </label>
                      <input
                        id="owner-pass-new"
                        type="password"
                        required
                        value={newOwnerPassword}
                        onChange={(e) => setNewOwnerPassword(e.target.value)}
                        placeholder="Enter new owner password"
                        className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="owner-pass-confirm" className="block text-xs font-medium text-[#1C1512] mb-1">
                        Confirm New Owner Password
                      </label>
                      <input
                        id="owner-pass-confirm"
                        type="password"
                        required
                        value={confirmNewOwnerPassword}
                        onChange={(e) => setConfirmNewOwnerPassword(e.target.value)}
                        placeholder="Re-enter new owner password"
                        className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={savingOwnerPass}
                      className="w-full py-3 px-5 min-h-[46px] bg-[#1C1512] hover:bg-[#332722] text-[#FAF6EE] text-sm font-semibold rounded-md transition-colors cursor-pointer disabled:opacity-60"
                    >
                      {savingOwnerPass ? 'Updating...' : 'Update Owner Password'}
                    </button>
                  </form>

                  {/* Client Access: Blogs & Photos Only Login Manager */}
                  <form
                    onSubmit={handleSaveBloggerPassword}
                    className="bg-white border border-[#C69749]/35 rounded-xl p-6 sm:p-7 space-y-4 shadow-sm"
                  >
                    <div className="flex items-center gap-2.5 text-[#5C1728]">
                      <KeyRound className="w-5 h-5" aria-hidden="true" />
                      <h2 className="font-serif text-2xl font-medium text-[#1C1512]">
                        Client Access: Blogs &amp; Photos Only
                      </h2>
                    </div>

                    <p className="text-xs sm:text-sm text-[#524740] leading-relaxed">
                      Want to give your client access ONLY to upload blogs and photos without touching your prices, offers, or WhatsApp number? Set a dedicated <strong>Client Blogs-Only Password</strong> below and share the portal link.
                    </p>

                    <div className="p-3.5 rounded-lg bg-[#FAF6EE] border border-[#C69749]/30 space-y-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8F6422]">
                        Client Login URL
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <code className="text-xs text-[#1C1512] truncate">
                          {typeof window !== 'undefined' ? `${window.location.origin}/client-portal` : '/client-portal'}
                        </code>
                        <button
                          type="button"
                          onClick={handleCopyPortalUrl}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#F3EBD9] hover:bg-[#E7DABF] text-xs font-semibold text-[#1C1512] shrink-0 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Copy Link</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-[#524740]">
                      Status:{' '}
                      <span className={`font-semibold ${hasBloggerAccount ? 'text-[#1B4D3E]' : 'text-[#5C1728]'}`}>
                        {hasBloggerAccount ? 'Active (Blogs-Only Password Set)' : 'Not Yet Set'}
                      </span>
                    </div>

                    <div>
                      <label htmlFor="blogger-pass-manage" className="block text-xs font-medium text-[#1C1512] mb-1.5">
                        {hasBloggerAccount ? 'New Client Blogs-Only Password (min 8 chars)' : 'Create Client Blogs-Only Password (min 8 chars)'}
                      </label>
                      <input
                        id="blogger-pass-manage"
                        type="password"
                        required
                        value={newBloggerPassword}
                        onChange={(e) => setNewBloggerPassword(e.target.value)}
                        placeholder="Enter separate password for client"
                        className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={savingBloggerPass}
                      className="w-full py-3 px-5 min-h-[46px] bg-[#5C1728] hover:bg-[#4A1120] text-[#FAF6EE] text-sm font-semibold rounded-md transition-colors cursor-pointer disabled:opacity-60"
                    >
                      {savingBloggerPass
                        ? 'Saving...'
                        : hasBloggerAccount
                        ? 'Update Client Blogs-Only Password'
                        : 'Enable Client Blogs-Only Login'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
