import crypto from 'crypto';
import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  INITIAL_SITE_STATE,
  type BlogPost,
  type GalleryItem,
  type SiteContentState,
  type SpaOffer,
  type SpaService,
} from '../src/data/spaData.js';

type PortalRole = 'owner' | 'blogger';

interface StoredAdminAuth {
  salt: string;
  hash: string;
  bloggerSalt?: string;
  bloggerHash?: string;
  createdAt: string;
}

export interface SpaAppOptions {
  isVercel?: boolean;
  dataDir?: string;
}

export function createSpaApp(options: SpaAppOptions = {}): Express {
  const isVercel = Boolean(options.isVercel || process.env.VERCEL);
  const DATA_DIR = options.dataDir
    ? path.resolve(options.dataDir)
    : isVercel
    ? path.join(os.tmpdir(), 'spark-spa-data')
    : path.resolve(process.cwd(), 'data');
  const UPLOADS_DIR = path.resolve(DATA_DIR, 'uploads');
  const STORE_PATH = path.resolve(DATA_DIR, 'cms-store.json');
  const AUTH_PATH = path.resolve(DATA_DIR, 'admin-auth.json');

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
  const TOKEN_TTL_MS = 1000 * 60 * 60 * 12;

  function getEnvPasscode(): string {
    return (process.env.CLIENT_DASHBOARD_PASSCODE || '').trim();
  }

  function getEnvBloggerPasscode(): string {
    return (process.env.CLIENT_BLOGGER_PASSCODE || '').trim();
  }

  function readAdminAuth(): StoredAdminAuth | null {
    if (!fs.existsSync(AUTH_PATH)) return null;
    try {
      const parsed = JSON.parse(fs.readFileSync(AUTH_PATH, 'utf8')) as StoredAdminAuth;
      if (parsed && typeof parsed.salt === 'string' && typeof parsed.hash === 'string') {
        return parsed;
      }
    } catch {
      return null;
    }
    return null;
  }

  function writeAdminAuth(record: StoredAdminAuth): void {
    const tmpPath = `${AUTH_PATH}.${crypto.randomUUID()}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(record, null, 2), 'utf8');
    fs.renameSync(tmpPath, AUTH_PATH);
  }

  function ensureDefaultAdminAuth(): StoredAdminAuth {
    const existing = readAdminAuth();
    if (existing) return existing;
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync('spark123', salt, 64).toString('hex');
    const record: StoredAdminAuth = {
      salt,
      hash,
      createdAt: new Date().toISOString(),
    };
    writeAdminAuth(record);
    return record;
  }

  function readSiteStore(): SiteContentState {
    if (!fs.existsSync(STORE_PATH)) {
      fs.writeFileSync(STORE_PATH, JSON.stringify(INITIAL_SITE_STATE, null, 2), 'utf8');
      return structuredClone(INITIAL_SITE_STATE);
    }
    try {
      const raw = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8')) as Partial<SiteContentState>;
      return {
        config: { ...INITIAL_SITE_STATE.config, ...(raw.config || {}) },
        welcomeOffer: { ...INITIAL_SITE_STATE.welcomeOffer, ...(raw.welcomeOffer || {}) },
        services:
          Array.isArray(raw.services) && raw.services.length > 0
            ? raw.services
            : INITIAL_SITE_STATE.services,
        gallery:
          Array.isArray(raw.gallery) && raw.gallery.length > 0
            ? raw.gallery
            : INITIAL_SITE_STATE.gallery,
        offers:
          Array.isArray(raw.offers) && raw.offers.length > 0
            ? raw.offers
            : INITIAL_SITE_STATE.offers,
        blogs: Array.isArray(raw.blogs) ? raw.blogs : INITIAL_SITE_STATE.blogs,
      };
    } catch {
      return structuredClone(INITIAL_SITE_STATE);
    }
  }

  function writeSiteStore(nextState: SiteContentState): void {
    const tmpPath = `${STORE_PATH}.${crypto.randomUUID()}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(nextState, null, 2), 'utf8');
    fs.renameSync(tmpPath, STORE_PATH);
  }

  function signSessionToken(role: PortalRole): string {
    const payload = Buffer.from(
      JSON.stringify({
        role,
        exp: Date.now() + TOKEN_TTL_MS,
        jti: crypto.randomUUID(),
      })
    ).toString('base64url');
    const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
    return `${payload}.${sig}`;
  }

  function getSessionRole(authHeader?: string): PortalRole | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.slice(7).trim();
    const dotIdx = token.indexOf('.');
    if (dotIdx <= 0) return null;
    const payload = token.slice(0, dotIdx);
    const sig = token.slice(dotIdx + 1);
    const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }
    try {
      const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
        role?: string;
        exp?: number;
      };
      if (typeof decoded.exp !== 'number' || decoded.exp <= Date.now()) return null;
      if (decoded.role === 'owner' || decoded.role === 'blogger') {
        return decoded.role;
      }
      return null;
    } catch {
      return null;
    }
  }

  function requireBloggerOrOwner(req: Request, res: Response, next: NextFunction): void {
    const role = getSessionRole(req.headers.authorization);
    if (!role) {
      res.status(401).json({ error: 'Unauthorized. Please sign in to the Client Portal.' });
      return;
    }
    next();
  }

  function requireOwnerAuth(req: Request, res: Response, next: NextFunction): void {
    const role = getSessionRole(req.headers.authorization);
    if (!role) {
      res.status(401).json({ error: 'Unauthorized. Please sign in to the Client Portal.' });
      return;
    }
    if (role !== 'owner') {
      res.status(403).json({
        error: 'Forbidden. Blogs-Only accounts cannot modify business settings or services.',
      });
      return;
    }
    next();
  }

  function isSafeImageSrc(value: unknown): value is string {
    if (typeof value !== 'string') return false;
    const trimmed = value.trim();
    if (
      trimmed.startsWith('/uploads/') ||
      trimmed.startsWith('/src/assets/') ||
      trimmed.startsWith('https://')
    ) {
      return true;
    }
    if (
      trimmed.length <= 7_000_000 &&
      /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(trimmed)
    ) {
      return true;
    }
    return false;
  }

  function slugifyTitle(title: string): string {
    return (
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 72) || `post-${Date.now()}`
    );
  }

  function detectValidImageExt(buffer: Buffer, declaredMime: string): 'jpg' | 'png' | 'webp' | null {
    if (buffer.length < 12) return null;
    const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    const isPng =
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a;
    const isWebp =
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP';

    if (declaredMime === 'image/jpeg' && isJpeg) return 'jpg';
    if (declaredMime === 'image/png' && isPng) return 'png';
    if (declaredMime === 'image/webp' && isWebp) return 'webp';
    return null;
  }

  function verifyDigestMatch(provided: string, expected: string): boolean {
    const a = crypto.createHash('sha256').update(provided).digest();
    const b = crypto.createHash('sha256').update(expected).digest();
    return crypto.timingSafeEqual(a, b);
  }

  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '8mb' }));

  app.use(
    '/uploads',
    (_req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      next();
    },
    express.static(UPLOADS_DIR, { maxAge: '7d' })
  );

  ensureDefaultAdminAuth();

  // Public site content endpoint
  app.get('/api/site-data', (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const role = getSessionRole(req.headers.authorization);
    const store = readSiteStore();
    res.json({
      ...store,
      blogs: role ? store.blogs : store.blogs.filter((b) => b.status === 'published'),
    });
  });

  // Client portal auth status
  app.get('/api/client/status', (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const envConfigured = getEnvPasscode().length > 0;
    const savedAuth = ensureDefaultAdminAuth();
    const role = getSessionRole(req.headers.authorization);
    res.json({
      envConfigured,
      needsSetup: false,
      hasBloggerAccount: Boolean(getEnvBloggerPasscode() || savedAuth.bloggerHash),
      authenticated: Boolean(role),
      role,
    });
  });

  // Client portal login (automatically detects Owner vs Client Blogs-Only passcode)
  app.post('/api/client/login', (req, res) => {
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!password) {
      res.status(400).json({ error: 'Password is required.' });
      return;
    }

    const envOwner = getEnvPasscode();
    const envBlogger = getEnvBloggerPasscode();
    const saved = ensureDefaultAdminAuth();

    if (envOwner && verifyDigestMatch(password, envOwner)) {
      res.json({ token: signSessionToken('owner'), role: 'owner' });
      return;
    }
    if (envBlogger && verifyDigestMatch(password, envBlogger)) {
      res.json({ token: signSessionToken('blogger'), role: 'blogger' });
      return;
    }

    const ownerDerived = crypto.scryptSync(password, saved.salt, 64);
    const ownerStored = Buffer.from(saved.hash, 'hex');
    if (ownerDerived.length === ownerStored.length && crypto.timingSafeEqual(ownerDerived, ownerStored)) {
      res.json({ token: signSessionToken('owner'), role: 'owner' });
      return;
    }
    if (saved.bloggerSalt && saved.bloggerHash) {
      const bDerived = crypto.scryptSync(password, saved.bloggerSalt, 64);
      const bStored = Buffer.from(saved.bloggerHash, 'hex');
      if (bDerived.length === bStored.length && crypto.timingSafeEqual(bDerived, bStored)) {
        res.json({ token: signSessionToken('blogger'), role: 'blogger' });
        return;
      }
    }

    res.status(401).json({ error: 'Incorrect password. Please try again.' });
  });

  // Owner-only: Update Owner login password
  app.post('/api/client/owner-password', requireOwnerAuth, (req, res) => {
    const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';
    if (newPassword.length < 8 || newPassword.length > 128) {
      res.status(400).json({ error: 'Owner password must be between 8 and 128 characters.' });
      return;
    }
    const existing = ensureDefaultAdminAuth();
    if (existing.bloggerSalt && existing.bloggerHash) {
      const bCheck = crypto.scryptSync(newPassword, existing.bloggerSalt, 64);
      const bStored = Buffer.from(existing.bloggerHash, 'hex');
      if (bCheck.length === bStored.length && crypto.timingSafeEqual(bCheck, bStored)) {
        res.status(400).json({ error: 'Owner password must differ from the Client Blogs-Only password.' });
        return;
      }
    }
    const envBlogger = getEnvBloggerPasscode();
    if (envBlogger && verifyDigestMatch(newPassword, envBlogger)) {
      res.status(400).json({ error: 'Owner password must differ from the Client Blogs-Only password.' });
      return;
    }
    const nextSalt = crypto.randomBytes(16).toString('hex');
    const nextHash = crypto.scryptSync(newPassword, nextSalt, 64).toString('hex');
    writeAdminAuth({ ...existing, salt: nextSalt, hash: nextHash });
    res.json({ ok: true });
  });

  // Owner-only: Set or update Client Blogs-Only password
  app.post('/api/client/blogger-password', requireOwnerAuth, (req, res) => {
    const bloggerPassword =
      typeof req.body?.bloggerPassword === 'string' ? req.body.bloggerPassword.trim() : '';
    if (bloggerPassword.length < 8 || bloggerPassword.length > 128) {
      res.status(400).json({ error: 'Client Blogs-Only password must be between 8 and 128 characters.' });
      return;
    }
    const existing = ensureDefaultAdminAuth();
    const bSalt = crypto.randomBytes(16).toString('hex');
    const bHash = crypto.scryptSync(bloggerPassword, bSalt, 64).toString('hex');

    const ownerCheck = crypto.scryptSync(bloggerPassword, existing.salt, 64);
    const ownerStored = Buffer.from(existing.hash, 'hex');
    if (ownerCheck.length === ownerStored.length && crypto.timingSafeEqual(ownerCheck, ownerStored)) {
      res.status(400).json({ error: 'Client Blogs-Only password must differ from your Owner password.' });
      return;
    }
    const envOwner = getEnvPasscode();
    if (envOwner && verifyDigestMatch(bloggerPassword, envOwner)) {
      res.status(400).json({ error: 'Client Blogs-Only password must differ from your Owner passcode.' });
      return;
    }
    writeAdminAuth({ ...existing, bloggerSalt: bSalt, bloggerHash: bHash });
    res.json({ ok: true });
  });

  // Protected image upload (Accessible to Owner & Client Blogs-Only)
  app.post('/api/client/upload', requireBloggerOrOwner, (req, res) => {
    const mimeType = typeof req.body?.mimeType === 'string' ? req.body.mimeType.trim() : '';
    const dataBase64 = typeof req.body?.dataBase64 === 'string' ? req.body.dataBase64.trim() : '';
    if (!dataBase64) {
      res.status(400).json({ error: 'No image data received.' });
      return;
    }

    const cleanBase64 = dataBase64.includes(',') ? dataBase64.split(',').pop() || '' : dataBase64;
    const buffer = Buffer.from(cleanBase64, 'base64');
    if (buffer.length === 0 || buffer.length > 5 * 1024 * 1024) {
      res.status(400).json({ error: 'Image must be smaller than 5 MB.' });
      return;
    }

    const ext = detectValidImageExt(buffer, mimeType);
    if (!ext) {
      res.status(400).json({ error: 'Only valid JPG, PNG, or WEBP photos are supported.' });
      return;
    }

    if (isVercel) {
      const normalizedMime = ext === 'jpg' ? 'image/jpeg' : ext === 'png' ? 'image/png' : 'image/webp';
      res.json({ url: `data:${normalizedMime};base64,${buffer.toString('base64')}` });
      return;
    }

    const safeName = `${crypto.randomUUID()}.${ext}`;
    const resolvedTarget = path.resolve(UPLOADS_DIR, safeName);
    if (!resolvedTarget.startsWith(UPLOADS_DIR + path.sep)) {
      res.status(400).json({ error: 'Invalid upload destination.' });
      return;
    }

    fs.writeFileSync(resolvedTarget, buffer);
    res.json({ url: `/uploads/${safeName}` });
  });

  // Protected Blog CRUD (Accessible to Owner & Client Blogs-Only)
  app.post('/api/client/blogs', requireBloggerOrOwner, (req, res) => {
    const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
    const category = typeof req.body?.category === 'string' ? req.body.category.trim() : 'Wellness Guide';
    const excerpt = typeof req.body?.excerpt === 'string' ? req.body.excerpt.trim() : '';
    const content = typeof req.body?.content === 'string' ? req.body.content.trim() : '';
    const author =
      typeof req.body?.author === 'string' && req.body.author.trim()
        ? req.body.author.trim()
        : 'Spark Spa Desk';
    const status = req.body?.status === 'draft' ? 'draft' : 'published';
    const coverImage = isSafeImageSrc(req.body?.coverImage)
      ? req.body.coverImage
      : '/src/assets/images/hero_spa_sanctuary_1795110762237.jpg';

    if (title.length < 3 || content.length < 15) {
      res.status(400).json({ error: 'Please provide a blog title and article content.' });
      return;
    }

    const store = readSiteStore();
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const newPost: BlogPost = {
      id: `blog-${crypto.randomUUID().slice(0, 8)}`,
      slug: `${slugifyTitle(title)}-${Date.now().toString(36).slice(-4)}`,
      title: title.slice(0, 140),
      category: category.slice(0, 48) || 'Wellness Guide',
      excerpt: (excerpt || content.slice(0, 165) + '...').slice(0, 260),
      content: content.slice(0, 12000),
      coverImage,
      coverAlt: `${title.slice(0, 100)} — Spark Spa Electronic City Bangalore`,
      author: author.slice(0, 64),
      publishedAt: new Date().toISOString().slice(0, 10),
      readTime: `${Math.max(1, Math.ceil(wordCount / 180))} min read`,
      status,
    };
    store.blogs = [newPost, ...store.blogs];
    writeSiteStore(store);
    res.json({ post: newPost, blogs: store.blogs });
  });

  app.put('/api/client/blogs/:id', requireBloggerOrOwner, (req, res) => {
    const store = readSiteStore();
    const idx = store.blogs.findIndex((b) => b.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Blog post not found.' });
      return;
    }
    const existing = store.blogs[idx];
    const title =
      typeof req.body?.title === 'string' && req.body.title.trim()
        ? req.body.title.trim()
        : existing.title;
    const content =
      typeof req.body?.content === 'string' && req.body.content.trim()
        ? req.body.content.trim()
        : existing.content;
    const updated: BlogPost = {
      ...existing,
      title: title.slice(0, 140),
      category:
        typeof req.body?.category === 'string' && req.body.category.trim()
          ? req.body.category.trim().slice(0, 48)
          : existing.category,
      excerpt:
        typeof req.body?.excerpt === 'string' && req.body.excerpt.trim()
          ? req.body.excerpt.trim().slice(0, 260)
          : existing.excerpt,
      content: content.slice(0, 12000),
      author:
        typeof req.body?.author === 'string' && req.body.author.trim()
          ? req.body.author.trim().slice(0, 64)
          : existing.author,
      coverImage: isSafeImageSrc(req.body?.coverImage) ? req.body.coverImage : existing.coverImage,
      status: req.body?.status === 'draft' ? 'draft' : 'published',
    };
    store.blogs[idx] = updated;
    writeSiteStore(store);
    res.json({ post: updated, blogs: store.blogs });
  });

  app.delete('/api/client/blogs/:id', requireBloggerOrOwner, (req, res) => {
    const store = readSiteStore();
    store.blogs = store.blogs.filter((b) => b.id !== req.params.id);
    writeSiteStore(store);
    res.json({ blogs: store.blogs });
  });

  // Protected Gallery Photo Upload / Delete (Accessible to Owner & Client Blogs-Only)
  app.post('/api/client/gallery', requireBloggerOrOwner, (req, res) => {
    const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
    const caption = typeof req.body?.caption === 'string' ? req.body.caption.trim() : '';
    const rawCat = req.body?.spaceCategory;
    const spaceCategory: GalleryItem['spaceCategory'] =
      rawCat === 'suites' || rawCat === 'rituals' ? rawCat : 'interiors';
    const categoryLabel =
      spaceCategory === 'suites'
        ? 'Therapy Suites'
        : spaceCategory === 'rituals'
        ? 'Wellness Experience'
        : 'Luxury Spa Interiors';

    if (title.length < 2 || !isSafeImageSrc(req.body?.image)) {
      res.status(400).json({ error: 'Please upload a photo and enter a gallery title.' });
      return;
    }

    const store = readSiteStore();
    const newItem: GalleryItem = {
      id: `gal-${crypto.randomUUID().slice(0, 8)}`,
      title: title.slice(0, 90),
      spaceCategory,
      categoryLabel,
      caption: (caption || 'Captured inside Spark Spa, Electronic City, Bangalore.').slice(0, 220),
      image: req.body.image,
      imageAlt: `${title.slice(0, 90)} — Spark Spa Electronic City Bangalore`,
      spanClass: 'md:col-span-4',
    };
    store.gallery = [newItem, ...store.gallery];
    writeSiteStore(store);
    res.json({ item: newItem, gallery: store.gallery });
  });

  app.delete('/api/client/gallery/:id', requireBloggerOrOwner, (req, res) => {
    const store = readSiteStore();
    store.gallery = store.gallery.filter((g) => g.id !== req.params.id);
    writeSiteStore(store);
    res.json({ gallery: store.gallery });
  });

  // Owner-Only Services Update / Add / Delete
  app.post('/api/client/services', requireOwnerAuth, (req, res) => {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const shortDescription =
      typeof req.body?.shortDescription === 'string' ? req.body.shortDescription.trim() : '';
    if (name.length < 2 || shortDescription.length < 10) {
      res.status(400).json({ error: 'Service name and description are required.' });
      return;
    }
    const store = readSiteStore();
    const nextIdx = String(store.services.length + 1).padStart(2, '0');
    const rawSvcCat = req.body?.category;
    const category: SpaService['category'] =
      rawSvcCat === 'salon' ? 'salon' : rawSvcCat === 'holistic' ? 'holistic' : 'massage';
    const newService: SpaService = {
      id: `svc-${crypto.randomUUID().slice(0, 8)}`,
      index: nextIdx,
      name: name.slice(0, 80),
      category,
      categoryLabel:
        typeof req.body?.categoryLabel === 'string' && req.body.categoryLabel.trim()
          ? req.body.categoryLabel.trim().slice(0, 48)
          : category === 'salon'
          ? 'Hair & Beauty Salon'
          : 'Signature Therapy',
      shortDescription: shortDescription.slice(0, 320),
      duration:
        typeof req.body?.duration === 'string' && req.body.duration.trim()
          ? req.body.duration.trim().slice(0, 60)
          : 'Duration: Custom Session',
      pricePlaceholder:
        typeof req.body?.pricePlaceholder === 'string' && req.body.pricePlaceholder.trim()
          ? req.body.pricePlaceholder.trim().slice(0, 60)
          : 'Tariff: Price Upon Enquiry',
      image: isSafeImageSrc(req.body?.image)
        ? req.body.image
        : '/src/assets/images/therapy_swedish_action_1795111730062.jpg',
      imageAlt: `${name.slice(0, 80)} at Spark Spa Electronic City Bangalore`,
    };
    store.services = [newService, ...store.services];
    writeSiteStore(store);
    res.json({ service: newService, services: store.services });
  });

  app.put('/api/client/services/:id', requireOwnerAuth, (req, res) => {
    const store = readSiteStore();
    const idx = store.services.findIndex((s) => s.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Service not found.' });
      return;
    }
    const cur = store.services[idx];
    store.services[idx] = {
      ...cur,
      name:
        typeof req.body?.name === 'string' && req.body.name.trim()
          ? req.body.name.trim().slice(0, 80)
          : cur.name,
      categoryLabel:
        typeof req.body?.categoryLabel === 'string' && req.body.categoryLabel.trim()
          ? req.body.categoryLabel.trim().slice(0, 48)
          : cur.categoryLabel,
      shortDescription:
        typeof req.body?.shortDescription === 'string' && req.body.shortDescription.trim()
          ? req.body.shortDescription.trim().slice(0, 320)
          : cur.shortDescription,
      duration:
        typeof req.body?.duration === 'string' && req.body.duration.trim()
          ? req.body.duration.trim().slice(0, 60)
          : cur.duration,
      pricePlaceholder:
        typeof req.body?.pricePlaceholder === 'string' && req.body.pricePlaceholder.trim()
          ? req.body.pricePlaceholder.trim().slice(0, 60)
          : cur.pricePlaceholder,
      image: isSafeImageSrc(req.body?.image) ? req.body.image : cur.image,
    };
    writeSiteStore(store);
    res.json({ service: store.services[idx], services: store.services });
  });

  app.delete('/api/client/services/:id', requireOwnerAuth, (req, res) => {
    const store = readSiteStore();
    store.services = store.services.filter((s) => s.id !== req.params.id);
    writeSiteStore(store);
    res.json({ services: store.services });
  });

  // Owner-Only Offer Update
  app.put('/api/client/offers/:id', requireOwnerAuth, (req, res) => {
    const store = readSiteStore();
    const idx = store.offers.findIndex((o) => o.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Offer not found.' });
      return;
    }
    const cur: SpaOffer = store.offers[idx];
    const inclusions = Array.isArray(req.body?.inclusions)
      ? req.body.inclusions
          .filter((x: unknown) => typeof x === 'string' && x.trim())
          .map((x: string) => x.trim().slice(0, 120))
      : cur.inclusions;
    store.offers[idx] = {
      ...cur,
      title:
        typeof req.body?.title === 'string' && req.body.title.trim()
          ? req.body.title.trim().slice(0, 80)
          : cur.title,
      subtitle:
        typeof req.body?.subtitle === 'string' && req.body.subtitle.trim()
          ? req.body.subtitle.trim().slice(0, 220)
          : cur.subtitle,
      durationPlaceholder:
        typeof req.body?.durationPlaceholder === 'string' && req.body.durationPlaceholder.trim()
          ? req.body.durationPlaceholder.trim().slice(0, 70)
          : cur.durationPlaceholder,
      pricePlaceholder:
        typeof req.body?.pricePlaceholder === 'string' && req.body.pricePlaceholder.trim()
          ? req.body.pricePlaceholder.trim().slice(0, 70)
          : cur.pricePlaceholder,
      inclusions: inclusions.length > 0 ? inclusions : cur.inclusions,
    };
    writeSiteStore(store);
    res.json({ offer: store.offers[idx], offers: store.offers });
  });

  // Owner-Only Business & Welcome Offer Settings
  app.put('/api/client/settings', requireOwnerAuth, (req, res) => {
    const store = readSiteStore();
    const c = req.body?.config || {};
    const w = req.body?.welcomeOffer || {};
    const phoneDigits = typeof c.whatsappNumber === 'string' ? c.whatsappNumber.replace(/\D/g, '') : '';
    store.config = {
      ...store.config,
      brandName:
        typeof c.brandName === 'string' && c.brandName.trim()
          ? c.brandName.trim().slice(0, 60)
          : store.config.brandName,
      area: typeof c.area === 'string' && c.area.trim() ? c.area.trim().slice(0, 80) : store.config.area,
      displayAddressLine2:
        typeof c.displayAddressLine2 === 'string' && c.displayAddressLine2.trim()
          ? c.displayAddressLine2.trim().slice(0, 140)
          : store.config.displayAddressLine2,
      editableStreetNote:
        typeof c.editableStreetNote === 'string' && c.editableStreetNote.trim()
          ? c.editableStreetNote.trim().slice(0, 140)
          : store.config.editableStreetNote,
      hours: typeof c.hours === 'string' && c.hours.trim() ? c.hours.trim().slice(0, 80) : store.config.hours,
      whatsappNumber: phoneDigits.length >= 10 ? phoneDigits.slice(0, 15) : store.config.whatsappNumber,
      phoneDisplay:
        typeof c.phoneDisplay === 'string' && c.phoneDisplay.trim()
          ? c.phoneDisplay.trim().slice(0, 30)
          : store.config.phoneDisplay,
      phoneHref:
        typeof c.phoneDisplay === 'string' && c.phoneDisplay.replace(/\D/g, '').length >= 10
          ? `tel:+${c.phoneDisplay.replace(/\D/g, '')}`
          : store.config.phoneHref,
    };
    store.welcomeOffer = {
      ...store.welcomeOffer,
      title:
        typeof w.title === 'string' && w.title.trim()
          ? w.title.trim().slice(0, 100)
          : store.welcomeOffer.title,
      subtitle:
        typeof w.subtitle === 'string' && w.subtitle.trim()
          ? w.subtitle.trim().slice(0, 300)
          : store.welcomeOffer.subtitle,
      highlightNote:
        typeof w.highlightNote === 'string' && w.highlightNote.trim()
          ? w.highlightNote.trim().slice(0, 120)
          : store.welcomeOffer.highlightNote,
      offerCode:
        typeof w.offerCode === 'string' && w.offerCode.trim()
          ? w.offerCode.trim().slice(0, 32)
          : store.welcomeOffer.offerCode,
    };
    writeSiteStore(store);
    res.json({ config: store.config, welcomeOffer: store.welcomeOffer });
  });

  return app;
}
