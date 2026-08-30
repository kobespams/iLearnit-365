/**
 * CHEAL Secure Hub — Application Registry
 * 
 * Central registry of all multi-tenant domain applications provisioned
 * onto the CHEAL security & infrastructure platform.
 */

export type ChealAppCapability = 
  | 'identity' 
  | 'audit' 
  | 'diagnostics' 
  | 'analytics' 
  | 'storage'
  | 'cbt_engine'
  | 'perfetto_tracing';

export interface ChealRegisteredApp {
  applicationId: string;
  name: string;
  type: 'education' | 'music_arts' | 'global_enterprise' | 'stem_lab' | 'research';
  status: 'active' | 'staged' | 'development' | 'suspended';
  version: string;
  description: string;
  ownerOrg: string;
  capabilities: ChealAppCapability[];
  apiRateLimitPerMin: number;
  allowedOrigins: string[];
  registeredAt: string;
  lastHealthCheck: string;
  activeSessionsCount: number;
}

export class ChealAppRegistryService {
  private static instance: ChealAppRegistryService;
  private apps: Map<string, ChealRegisteredApp> = new Map();

  private constructor() {
    this.seedInitialRegistry();
  }

  public static getInstance(): ChealAppRegistryService {
    if (!ChealAppRegistryService.instance) {
      ChealAppRegistryService.instance = new ChealAppRegistryService();
    }
    return ChealAppRegistryService.instance;
  }

  private seedInitialRegistry() {
    const initialApps: ChealRegisteredApp[] = [
      {
        applicationId: 'ilearnit365',
        name: 'iLearnit-365',
        type: 'education',
        status: 'active',
        version: '2.4.0',
        description: 'Comprehensive K-12 and Secondary STEM, CBT & Curriculum Platform',
        ownerOrg: 'iLearnit Global Education Consortium',
        capabilities: ['identity', 'audit', 'diagnostics', 'analytics', 'storage', 'cbt_engine', 'perfetto_tracing'],
        apiRateLimitPerMin: 1200,
        allowedOrigins: ['https://ilearnit365.edu', 'http://localhost:3000'],
        registeredAt: '2026-01-15T00:00:00.000Z',
        lastHealthCheck: new Date().toISOString(),
        activeSessionsCount: 428,
      },
      {
        applicationId: 'cheal-music',
        name: 'CHEAL Music & Sonic Arts',
        type: 'music_arts',
        status: 'active',
        version: '1.2.0',
        description: 'CCA Music, Ear Training, Western Staff Notation & African Solfa Lab',
        ownerOrg: 'CHEAL Arts & Culture Division',
        capabilities: ['identity', 'audit', 'diagnostics', 'storage'],
        apiRateLimitPerMin: 600,
        allowedOrigins: ['https://music.cheal.io'],
        registeredAt: '2026-03-20T00:00:00.000Z',
        lastHealthCheck: new Date().toISOString(),
        activeSessionsCount: 64,
      },
      {
        applicationId: 'aocol-x-worldwide',
        name: 'AOCOL X WORLDWIDE',
        type: 'global_enterprise',
        status: 'staged',
        version: '3.0.0-rc1',
        description: 'Global Unified Enterprise & Academic Credential Exchange',
        ownerOrg: 'AOCOL International',
        capabilities: ['identity', 'audit', 'diagnostics', 'analytics', 'storage'],
        apiRateLimitPerMin: 2400,
        allowedOrigins: ['https://aocol.worldwide'],
        registeredAt: '2026-06-01T00:00:00.000Z',
        lastHealthCheck: new Date().toISOString(),
        activeSessionsCount: 19,
      },
      {
        applicationId: 'cyber-academy',
        name: 'iLearnit CyberSecurity Academy',
        type: 'stem_lab',
        status: 'active',
        version: '2.1.0',
        description: 'Interactive Terminal Labs, Network Defense & Threat Simulations',
        ownerOrg: 'iLearnit Global Education Consortium',
        capabilities: ['identity', 'audit', 'diagnostics', 'storage', 'cbt_engine'],
        apiRateLimitPerMin: 800,
        allowedOrigins: ['https://cyber.ilearnit365.edu'],
        registeredAt: '2026-04-10T00:00:00.000Z',
        lastHealthCheck: new Date().toISOString(),
        activeSessionsCount: 112,
      }
    ];

    initialApps.forEach(app => this.apps.set(app.applicationId, app));
  }

  public getAllApps(): ChealRegisteredApp[] {
    return Array.from(this.apps.values());
  }

  public getAppById(appId: string): ChealRegisteredApp | undefined {
    return this.apps.get(appId);
  }

  public toggleCapability(appId: string, capability: ChealAppCapability): boolean {
    const app = this.apps.get(appId);
    if (!app) return false;

    if (app.capabilities.includes(capability)) {
      app.capabilities = app.capabilities.filter(c => c !== capability);
    } else {
      app.capabilities.push(capability);
    }
    return true;
  }

  public registerNewApp(app: Omit<ChealRegisteredApp, 'registeredAt' | 'lastHealthCheck' | 'activeSessionsCount'>): ChealRegisteredApp {
    const fullApp: ChealRegisteredApp = {
      ...app,
      registeredAt: new Date().toISOString(),
      lastHealthCheck: new Date().toISOString(),
      activeSessionsCount: 0,
    };
    this.apps.set(fullApp.applicationId, fullApp);
    return fullApp;
  }
}
