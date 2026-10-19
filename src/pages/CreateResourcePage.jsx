import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Upload,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Cpu,
  Armchair,
  Shirt,
  Wrench,
  BookOpen,
  Apple,
  Scissors,
  Gift
} from 'lucide-react';

const ICON_MAP = {
  Cpu,
  Armchair,
  Shirt,
  Wrench,
  BookOpen,
  Apple,
  Scissors,
  Gift
};
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, CONDITIONS, LISTING_TYPES } from '../utils/categories';
import { createResource } from '../services/resourceService';
import { GoogleMapsButton } from '../components/GoogleMapsButton';
import { LocationPicker } from '../components/LocationPicker';

export function CreateResourcePage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('units');
  const [allowPartial, setAllowPartial] = useState(true);
  const [condition, setCondition] = useState('good');
  const [listingType, setListingType] = useState('giveaway');
  const [price, setPrice] = useState(0);
  const [locationName, setLocationName] = useState(profile?.city || 'Portland, OR');
  const [city, setCity] = useState(profile?.city || 'Portland');
  const [lat, setLat] = useState(profile?.lat || 45.5152);
  const [lng, setLng] = useState(profile?.lng || -122.6658);
  const [pickupInstructions, setPickupInstructions] = useState('');
  const [locationPrivacy, setLocationPrivacy] = useState('approximate');
  const [safetyNotes, setSafetyNotes] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  // Image uploads (supports multiple previews and base64/URLs)
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !category || !quantity || !locationName.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (parseFloat(quantity) <= 0) {
      setError('Quantity must be greater than zero.');
      return;
    }

    if (listingType === 'sale' && parseFloat(price) <= 0) {
      setError('Please provide a valid price for sale items.');
      return;
    }

    setSubmitting(true);
    try {
      const resourceData = {
        user_id: user.id,
        title: title.trim(),
        description: description.trim(),
        category,
        quantity: parseFloat(quantity),
        available_quantity: parseFloat(quantity),
        unit: unit.trim(),
        allow_partial_quantity: allowPartial,
        condition,
        listing_type: listingType,
        price: listingType === 'giveaway' || listingType === 'donation' ? 0 : parseFloat(price || 0),
        currency: 'USD',
        location_name: locationName.trim(),
        city: city.trim() || locationName.trim(),
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        pickup_instructions: pickupInstructions.trim(),
        location_privacy: locationPrivacy,
        status: 'active',
        safety_notes: safetyNotes.trim(),
        expiry_date: expiryDate ? new Date(expiryDate).toISOString() : null
      };

      const created = await createResource(resourceData, images);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/resources/${created.id}`);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to create resource listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Publish a Resource Listing"
      subtitle="Give your surplus timber, compostables, electronics, fabrics, or equipment a second life."
    >
      <div className="max-w-3xl space-y-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-xs">
          {success ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-forest-600 mx-auto" />
              <h2 className="text-xl font-bold text-charcoal-900">Resource Listed Successfully!</h2>
              <p className="text-xs text-charcoal-500">
                Your listing is now live in the ReLoop database and available for rule-based matching.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Title & Category */}
              <div className="space-y-4">
                <div>
                  <label className="block text-charcoal-700 font-bold mb-1">
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Reclaimed Douglas Fir Timber Planks (8ft)"
                    required
                    className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-forest-500"
                  />
                </div>

                <div>
                  <label className="block text-charcoal-700 font-bold mb-2">
                    Choose Category *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    {CATEGORIES.map(cat => {
                      const IconComp = ICON_MAP[cat.icon] || Package;
                      const isSelected = category === cat.name;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.name)}
                          className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                            isSelected
                              ? 'bg-forest-50 border-forest-600 text-forest-900 ring-2 ring-forest-500/20 shadow-xs'
                              : 'bg-white border-charcoal-200/90 text-charcoal-700 hover:border-forest-300 hover:bg-forest-50/30'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-forest-700 text-white' : 'bg-charcoal-100 text-charcoal-600'
                          }`}>
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <span className="block font-bold text-xs truncate leading-tight">
                              {cat.shortName || cat.name}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-charcoal-700 font-bold mb-1">
                      Selected Category Name
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm bg-white focus:ring-2 focus:ring-forest-500"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-charcoal-700 font-bold mb-1">
                      Physical Condition *
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm bg-white focus:ring-2 focus:ring-forest-500"
                    >
                      {CONDITIONS.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Photos */}
              <div className="space-y-2">
                <label className="block text-charcoal-700 font-bold">
                  Resource Photographs
                </label>
                <div className="flex flex-wrap gap-3 items-center">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-charcoal-200">
                      <img src={img} alt="Resource" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  <label className="w-24 h-24 rounded-xl border-2 border-dashed border-charcoal-300 hover:border-forest-500 flex flex-col items-center justify-center cursor-pointer transition text-charcoal-500 hover:text-forest-700">
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-semibold">Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageAdd}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[10px] text-charcoal-400">
                  Multiple photos supported. The first image will be used as the primary display.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-charcoal-700 font-bold mb-1">
                  Detailed Description *
                </label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail exact dimensions, materials, history, how it was stored, and whether loading assistance is provided..."
                  required
                  className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-forest-500"
                />
              </div>

              {/* Quantity, Unit & Partial */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-charcoal-50 border border-charcoal-200">
                <div>
                  <label className="block text-charcoal-700 font-bold mb-1">Quantity Available *</label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    className="w-full p-2 rounded-xl border border-charcoal-200 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-charcoal-700 font-bold mb-1">Unit of Measure *</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g. planks, kg, buckets, boxes"
                    required
                    className="w-full p-2 rounded-xl border border-charcoal-200 text-sm bg-white"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-charcoal-700">
                    <input
                      type="checkbox"
                      checked={allowPartial}
                      onChange={(e) => setAllowPartial(e.target.checked)}
                      className="rounded text-forest-600 focus:ring-forest-500"
                    />
                    <span>Allow partial requests</span>
                  </label>
                </div>
              </div>

              {/* Listing Type & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-charcoal-700 font-bold mb-1">
                    Listing Transaction Type *
                  </label>
                  <select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm bg-white focus:ring-2 focus:ring-forest-500"
                  >
                    {LISTING_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                {listingType === 'sale' && (
                  <div>
                    <label className="block text-charcoal-700 font-bold mb-1">
                      Price in USD ($) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      required
                      className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Location & Google Maps */}
              <div className="space-y-4 pt-4 border-t border-charcoal-100">
                <LocationPicker
                  initialLocation={locationName}
                  initialLat={lat}
                  initialLng={lng}
                  onLocationSelect={(loc) => {
                    setLocationName(loc.address);
                    setCity(loc.city || loc.address.split(',')[0]);
                    setLat(loc.lat);
                    setLng(loc.lng);
                  }}
                  label="Pinpoint Exact Collection Location (Google Maps Compatible)"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-charcoal-700 font-bold mb-1">
                      Confirmed City / Region
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Portland, OR"
                      required
                      className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-charcoal-700 font-bold mb-1">
                      Public Location Visibility Privacy
                    </label>
                    <select
                      value={locationPrivacy}
                      onChange={(e) => setLocationPrivacy(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm bg-white"
                    >
                      <option value="approximate">Approximate general area on Google Maps (recommended)</option>
                      <option value="city_only">City name only (no precise pin)</option>
                      <option value="private_on_request">Share exact pickup pin only after request is approved</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-charcoal-700 font-bold mb-1">
                    Private Pickup Instructions (Shared with confirmed requester)
                  </label>
                  <textarea
                    rows="2"
                    value={pickupInstructions}
                    onChange={(e) => setPickupInstructions(e.target.value)}
                    placeholder="e.g. Loading dock 3, ring buzzer B, accessible weekdays 9am to 4pm..."
                    className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm"
                  />
                </div>
              </div>

              {/* Safety & Expiry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-charcoal-100">
                <div>
                  <label className="block text-charcoal-700 font-bold mb-1">
                    Safety Notes / Precautions
                  </label>
                  <input
                    type="text"
                    value={safetyNotes}
                    onChange={(e) => setSafetyNotes(e.target.value)}
                    placeholder="e.g. Nails extracted; heavy timber requires 2 people to carry"
                    className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-charcoal-700 font-bold mb-1">
                    Optional Collection Deadline / Expiry
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-5 py-2.5 rounded-xl border border-charcoal-200 text-charcoal-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-forest-700 text-white font-bold text-sm hover:bg-forest-800 transition shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Publishing Resource...' : 'Publish Listing'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
