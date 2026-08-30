/**
 * CHEAL Secure Hub — Platform Identity & Authentication Layer
 * 
 * Data Class: IDENTITY DATA (Owned exclusively by CHEAL Platform / Auth0)
 * - auth0Id, email, authentication state, MFA state, identity provider, role assignments.
 * - Does NOT contain educational records or student academic grades.
 */

export interface ChealIdentityUser {
  auth0Id: string;
  email: string;
  displayName: string;
  identityProvider: 'auth0' | 'google' | 'azure-ad' | 'local-pin';
  authState: 'authenticated' | 'anonymous' | 'mfa_required' | 'locked';
  mfaEnabled: boolean;
  mfaMethod?: 'totp' | 'sms' | 'fido2_webauthn';
  roles: ('super_admin' | 'security_officer' | 'developer' | 'school_admin' | 'teacher' | 'student' | 'parent')[];
  assignedSchools: string[];
  sessionStartedAt: string;
  lastLoginAt: string;
  tokenExpiresAt: string;
}

export interface Auth0TokenClaims {
  iss: string;
  sub: string;
  aud: string;
  iat: number;
  exp: number;
  email: string;
  roles: string[];
  org_id?: string;
}

export class ChealIdentityService {
  private static instance: ChealIdentityService;
  private activeUsers: Map<string, ChealIdentityUser> = new Map();

  private constructor() {
    // Seed initial platform & domain users
    this.seedDefaultUsers();
  }

  public static getInstance(): ChealIdentityService {
    if (!ChealIdentityService.instance) {
      ChealIdentityService.instance = new ChealIdentityService();
    }
    return ChealIdentityService.instance;
  }

  private seedDefaultUsers() {
    const defaultUsers: ChealIdentityUser[] = [
      {
        auth0Id: 'auth0|sec_officer_01',
        email: 'security.lead@cheal.io',
        displayName: 'Platform Security Officer',
        identityProvider: 'auth0',
        authState: 'authenticated',
        mfaEnabled: true,
        mfaMethod: 'fido2_webauthn',
        roles: ['super_admin', 'security_officer'],
        assignedSchools: ['*'],
        sessionStartedAt: new Date(Date.now() - 3600000).toISOString(),
        lastLoginAt: new Date(Date.now() - 3600000).toISOString(),
        tokenExpiresAt: new Date(Date.now() + 82800000).toISOString(),
      },
      {
        auth0Id: 'auth0|student_alex_chen',
        email: 'alex.chen@ilearnit365.edu',
        displayName: 'Alex Chen',
        identityProvider: 'local-pin',
        authState: 'authenticated',
        mfaEnabled: false,
        roles: ['student'],
        assignedSchools: ['school_001'],
        sessionStartedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        tokenExpiresAt: new Date(Date.now() + 86400000).toISOString(),
      },
      {
        auth0Id: 'auth0|teacher_dr_jenkins',
        email: 's.jenkins@ilearnit365.edu',
        displayName: 'Dr. Sarah Jenkins',
        identityProvider: 'auth0',
        authState: 'authenticated',
        mfaEnabled: true,
        mfaMethod: 'totp',
        roles: ['teacher'],
        assignedSchools: ['school_001'],
        sessionStartedAt: new Date(Date.now() - 7200000).toISOString(),
        lastLoginAt: new Date(Date.now() - 7200000).toISOString(),
        tokenExpiresAt: new Date(Date.now() + 79200000).toISOString(),
      }
    ];

    defaultUsers.forEach(u => this.activeUsers.set(u.auth0Id, u));
  }

  public getUserById(auth0Id: string): ChealIdentityUser | undefined {
    return this.activeUsers.get(auth0Id);
  }

  public getAllUsers(): ChealIdentityUser[] {
    return Array.from(this.activeUsers.values());
  }

  public verifyJwtToken(token: string): { valid: boolean; claims?: Auth0TokenClaims; error?: string } {
    if (!token || token.length < 10) {
      return { valid: false, error: 'Invalid or missing JWT token' };
    }
    // Standard mock validator for development / runtime
    return {
      valid: true,
      claims: {
        iss: 'https://cheal-secure-hub.eu.auth0.com/',
        sub: 'auth0|sec_officer_01',
        aud: 'https://api.cheal.io/secure-hub',
        iat: Math.floor(Date.now() / 1000) - 300,
        exp: Math.floor(Date.now() / 1000) + 86400,
        email: 'security.lead@cheal.io',
        roles: ['super_admin', 'security_officer'],
      }
    };
  }
}
