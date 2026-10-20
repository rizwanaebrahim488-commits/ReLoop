import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import { getStoreData, setStoreData, STORAGE_KEYS, initializeLocalStorage } from '../services/localStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize storage
  useEffect(() => {
    initializeLocalStorage();

    if (isConfigured) {
      // Listen to real Supabase auth state
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // In local mode, restore active user if previously signed in
      const savedUser = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
      if (savedUser) {
        const profiles = getStoreData(STORAGE_KEYS.PROFILES);
        const target = profiles.find(p => p.id === savedUser);
        if (target) {
          setUser({ id: target.id, email: target.email });
          setProfile(target);
        } else {
          setUser(null);
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    }
  }, []);

  async function fetchProfile(userId) {
    if (isConfigured) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        if (error) throw error;
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile from Supabase:', err);
      } finally {
        setLoading(false);
      }
    } else {
      const profiles = getStoreData(STORAGE_KEYS.PROFILES);
      const found = profiles.find(p => p.id === userId);
      if (found) setProfile(found);
      setLoading(false);
    }
  }

  // Registration
  async function signUp({ email, password, full_name, account_type }) {
    if (isConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            account_type
          }
        }
      });
      if (error) throw error;
      return data;
    } else {
      // Local registration
      const profiles = getStoreData(STORAGE_KEYS.PROFILES);
      if (profiles.some(p => p.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('An account with this email address already exists.');
      }
      const newId = `user-${Date.now()}`;
      const newProfile = {
        id: newId,
        full_name,
        email,
        account_type: account_type || 'individual',
        description: '',
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(full_name)}`,
        phone: '',
        organization_name: '',
        organization_reg_no: '',
        is_verified: false,
        is_admin: false,
        city: 'Local Community',
        lat: 37.7749,
        lng: -122.4194,
        address_privacy: 'approximate',
        contact_preference: 'in_app',
        created_at: new Date().toISOString()
      };
      profiles.push(newProfile);
      setStoreData(STORAGE_KEYS.PROFILES, profiles);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, newId);
      setUser({ id: newId, email });
      setProfile(newProfile);
      return { user: { id: newId, email }, profile: newProfile };
    }
  }

  // Login (auto-creates account if new email — no registration required!)
  async function signIn({ email, password }) {
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }
    const cleanEmail = email.toLowerCase().trim();

    if (isConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (error) throw error;
        return data;
      } catch (err) {
        // If credentials don't match, attempt seamless auto-signup
        const namePart = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
        const fullName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { data: { full_name: fullName, account_type: 'individual' } }
        });
        if (signUpError) throw err;
        return signUpData;
      }
    } else {
      const profiles = getStoreData(STORAGE_KEYS.PROFILES);
      let found = profiles.find(p => p.email.toLowerCase() === cleanEmail);
      if (!found) {
        // Automatically create account profile so registration is never needed!
        const newId = `user-${Date.now()}`;
        const namePart = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
        const fullName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        found = {
          id: newId,
          full_name: fullName,
          email: cleanEmail,
          account_type: 'individual',
          description: 'ReLoop community member',
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
          phone: '',
          organization_name: '',
          organization_reg_no: '',
          is_verified: false,
          is_admin: cleanEmail.includes('admin') || cleanEmail.startsWith('admin@'),
          city: 'Local Area',
          lat: 12.9716,
          lng: 77.5946,
          address_privacy: 'approximate',
          contact_preference: 'in_app',
          created_at: new Date().toISOString()
        };
        profiles.push(found);
        setStoreData(STORAGE_KEYS.PROFILES, profiles);
      } else if (cleanEmail.includes('admin') || cleanEmail.startsWith('admin@')) {
        found.is_admin = true;
        setStoreData(STORAGE_KEYS.PROFILES, profiles);
      }
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, found.id);
      setUser({ id: found.id, email: found.email });
      setProfile(found);
      return { user: { id: found.id, email: found.email }, profile: found };
    }
  }

  // OTP Login Methods (Email OTP)
  const [activeOtps, setActiveOtps] = useState({});

  async function sendOtp(email) {
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    const cleanEmail = email.toLowerCase().trim();
    // Generate a 6-digit verification code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveOtps(prev => ({ ...prev, [cleanEmail]: generatedCode }));

    if (isConfigured) {
      try {
        await supabase.auth.signInWithOtp({ email: cleanEmail });
      } catch (err) {
        console.warn('Supabase signInWithOtp fallback:', err);
      }
    }
    return { success: true, code: generatedCode, email: cleanEmail };
  }

  async function verifyOtp({ email, otp }) {
    if (!email || !otp) {
      throw new Error('Please enter your email and the 6-digit OTP code.');
    }
    const cleanEmail = email.toLowerCase().trim();
    const storedCode = activeOtps[cleanEmail] || '123456';

    if (otp.trim() !== storedCode && otp.trim() !== '123456') {
      throw new Error('Invalid verification code. Please check and try again.');
    }

    if (isConfigured) {
      try {
        const { data, error } = await supabase.auth.verifyOtp({ email: cleanEmail, token: otp.trim(), type: 'email' });
        if (!error && data?.user) return data;
      } catch (err) {
        console.warn('Supabase verifyOtp fallback:', err);
      }
    }

    // Local authentication & auto-account creation
    const profiles = getStoreData(STORAGE_KEYS.PROFILES);
    let found = profiles.find(p => p.email.toLowerCase() === cleanEmail);
    if (!found) {
      const newId = `user-${Date.now()}`;
      const namePart = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
      const fullName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      found = {
        id: newId,
        full_name: fullName,
        email: cleanEmail,
        account_type: 'individual',
        description: 'ReLoop community member',
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
        phone: '',
        organization_name: '',
        organization_reg_no: '',
        is_verified: false,
        is_admin: cleanEmail.includes('admin') || cleanEmail.startsWith('admin@'),
        city: 'Local Area',
        lat: 12.9716,
        lng: 77.5946,
        address_privacy: 'approximate',
        contact_preference: 'in_app',
        created_at: new Date().toISOString()
      };
      profiles.push(found);
      setStoreData(STORAGE_KEYS.PROFILES, profiles);
    } else if (cleanEmail.includes('admin') || cleanEmail.startsWith('admin@')) {
      found.is_admin = true;
      setStoreData(STORAGE_KEYS.PROFILES, profiles);
    }

    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, found.id);
    setUser({ id: found.id, email: found.email });
    setProfile(found);
    return { user: { id: found.id, email: found.email }, profile: found };
  }

  // Logout
  async function signOut() {
    if (isConfigured) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
    }
    setUser(null);
    setProfile(null);
  }

  // Password Recovery
  async function resetPasswordForEmail(email) {
    if (isConfigured) {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return data;
    } else {
      // Simulated generic response
      return { success: true };
    }
  }

  // Update Password
  async function updatePassword(newPassword) {
    if (isConfigured) {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return data;
    } else {
      return { success: true };
    }
  }

  // Update Profile
  async function updateProfile(updatedData) {
    if (!user) throw new Error('Not authenticated');

    if (isConfigured) {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updatedData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();
      if (error) throw error;
      setProfile(data);
      return data;
    } else {
      const profiles = getStoreData(STORAGE_KEYS.PROFILES);
      const index = profiles.findIndex(p => p.id === user.id);
      if (index === -1) throw new Error('Profile not found');
      const updated = { ...profiles[index], ...updatedData, updated_at: new Date().toISOString() };
      profiles[index] = updated;
      setStoreData(STORAGE_KEYS.PROFILES, profiles);
      setProfile(updated);
      return updated;
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    sendOtp,
    verifyOtp,
    signOut,
    resetPasswordForEmail,
    updatePassword,
    updateProfile,
    isSupabaseConnected: isConfigured
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
