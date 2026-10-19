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
      // In local mode, restore active demo user or default to Elena
      const savedUser = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
      const profiles = getStoreData(STORAGE_KEYS.PROFILES);
      const target = savedUser ? profiles.find(p => p.id === savedUser) : profiles[0];
      if (target) {
        setUser({ id: target.id, email: target.email });
        setProfile(target);
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

  // Login
  async function signIn({ email, password }) {
    if (isConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } else {
      const profiles = getStoreData(STORAGE_KEYS.PROFILES);
      const found = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
      if (!found) {
        throw new Error('Invalid email or password.');
      }
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, found.id);
      setUser({ id: found.id, email: found.email });
      setProfile(found);
      return { user: { id: found.id, email: found.email }, profile: found };
    }
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

  // Demo user switcher for quick reviewer testing
  function switchDemoUser(targetId) {
    const profiles = getStoreData(STORAGE_KEYS.PROFILES);
    const target = profiles.find(p => p.id === targetId);
    if (target) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, target.id);
      setUser({ id: target.id, email: target.email });
      setProfile(target);
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPasswordForEmail,
    updatePassword,
    updateProfile,
    switchDemoUser,
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
