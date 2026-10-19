import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Package,
  Save,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getResourceById, updateResource, deleteResource } from '../services/resourceService';
import { CATEGORIES, CONDITIONS, LISTING_TYPES } from '../utils/categories';
import { LocationPicker } from '../components/LocationPicker';

export function EditResourcePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [resource, setResource] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [availableQuantity, setAvailableQuantity] = useState(1);
  const [unit, setUnit] = useState('');
  const [condition, setCondition] = useState('good');
  const [listingType, setListingType] = useState('giveaway');
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState('active');
  const [locationName, setLocationName] = useState('');
  const [city, setCity] = useState('');
  const [lat, setLat] = useState(45.5152);
  const [lng, setLng] = useState(-122.6658);
  const [pickupInstructions, setPickupInstructions] = useState('');
  const [locationPrivacy, setLocationPrivacy] = useState('approximate');
  const [safetyNotes, setSafetyNotes] = useState('');

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadResource() {
      setLoading(true);
      try {
        const data = await getResourceById(id);
        if (!data) {
          setError('Resource not found');
          return;
        }

        // Authorization check: owner or admin only
        if (data.user_id !== user?.id && !profile?.is_admin) {
          setError('You do not have permission to edit this listing.');
          return;
        }

        setResource(data);
        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
        setQuantity(data.quantity);
        setAvailableQuantity(data.available_quantity ?? data.quantity);
        setUnit(data.unit);
        setCondition(data.condition);
        setListingType(data.listing_type);
        setPrice(data.price || 0);
        setStatus(data.status);
        setLocationName(data.location_name);
        setCity(data.city || '');
        setLat(data.lat || 45.5152);
        setLng(data.lng || -122.6658);
        setPickupInstructions(data.pickup_instructions || '');
        setLocationPrivacy(data.location_privacy || 'approximate');
        setSafetyNotes(data.safety_notes || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadResource();
  }, [id, user, profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    setSuccess(false);

    try {
      await updateResource(id, {
        title: title.trim(),
        description: description.trim(),
        category,
        quantity: parseFloat(quantity),
        available_quantity: parseFloat(availableQuantity),
        unit: unit.trim(),
        condition,
        listing_type: listingType,
        price: listingType === 'giveaway' || listingType === 'donation' ? 0 : parseFloat(price || 0),
        status,
        location_name: locationName.trim(),
        city: city.trim(),
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        pickup_instructions: pickupInstructions.trim(),
        location_privacy: locationPrivacy,
        safety_notes: safetyNotes.trim()
      });
      setSuccess(true);
      setTimeout(() => navigate(`/resources/${id}`), 1500);
    } catch (err) {
      setError(err.message || 'Failed to update resource listing.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this resource listing permanently?')) {
      return;
    }
    setDeleting(true);
    try {
      await deleteResource(id);
      navigate('/my-listings');
    } catch (err) {
      alert(err.message);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Edit Listing">
        <div className="py-20 text-center text-charcoal-400 text-xs">
          Loading listing details...
        </div>
      </DashboardLayout>
    );
  }

  if (error && !resource) {
    return (
      <DashboardLayout title="Edit Listing">
        <div className="p-8 text-center bg-white rounded-3xl border border-charcoal-100 max-w-md mx-auto">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h3 className="font-bold text-charcoal-900 mb-2">{error}</h3>
          <button
            onClick={() => navigate('/my-listings')}
            className="px-4 py-2 bg-forest-700 text-white rounded-xl text-xs font-semibold"
          >
            Back to My Listings
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Edit Resource Listing"
      subtitle="Update specifications, mark as reserved, or adjust remaining inventory."
      action={
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{deleting ? 'Deleting...' : 'Delete Listing'}</span>
        </button>
      }
    >
      <div className="max-w-3xl space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-xs">
          {success && (
            <div className="mb-6 p-3.5 rounded-xl bg-forest-50 text-forest-800 border border-forest-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-forest-600" />
              <span>Listing updated successfully! Redirecting...</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5 text-xs">
            {/* Status Selector */}
            <div className="p-4 rounded-2xl bg-charcoal-50 border border-charcoal-200">
              <label className="block text-charcoal-800 font-bold mb-1">
                Listing Availability Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm bg-white font-semibold"
              >
                <option value="active">Active (Available for requests & matching)</option>
                <option value="reserved">Reserved (Currently committed to a requester)</option>
                <option value="unavailable">Unavailable (Temporarily hidden from search)</option>
                <option value="completed">Completed (Successfully exchanged and handed off)</option>
              </select>
            </div>

            <div>
              <label className="block text-charcoal-700 font-bold mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-charcoal-700 font-bold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm bg-white"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-charcoal-700 font-bold mb-1">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm bg-white"
                >
                  {CONDITIONS.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-charcoal-700 font-bold mb-1">Description</label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm"
              />
            </div>

            {/* Quantities */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-charcoal-50 border border-charcoal-200">
              <div>
                <label className="block text-charcoal-700 font-bold mb-1">Total Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full p-2 rounded-xl border border-charcoal-200 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-charcoal-700 font-bold mb-1">Available Units</label>
                <input
                  type="number"
                  min="0"
                  max={quantity}
                  value={availableQuantity}
                  onChange={(e) => setAvailableQuantity(e.target.value)}
                  className="w-full p-2 rounded-xl border border-charcoal-200 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-charcoal-700 font-bold mb-1">Unit</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full p-2 rounded-xl border border-charcoal-200 text-sm bg-white"
                />
              </div>
            </div>

            {/* Location & Google Maps */}
            <div className="space-y-4 pt-2">
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
                  <label className="block text-charcoal-700 font-bold mb-1">City / Region</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-charcoal-700 font-bold mb-1">Location Privacy</label>
                  <select
                    value={locationPrivacy}
                    onChange={(e) => setLocationPrivacy(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm bg-white"
                  >
                    <option value="approximate">Approximate</option>
                    <option value="city_only">City Only</option>
                    <option value="private_on_request">Private on confirmed request</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-charcoal-700 font-bold mb-1">Safety Notes</label>
              <input
                type="text"
                value={safetyNotes}
                onChange={(e) => setSafetyNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/my-listings')}
                className="px-5 py-2.5 rounded-xl border border-charcoal-200 text-charcoal-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-forest-700 text-white font-bold text-sm hover:bg-forest-800 transition shadow-md disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
