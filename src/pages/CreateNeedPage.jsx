import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FileQuestion,
  Target,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MapPin,
  Sparkles,
  Package,
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
import { CATEGORIES, CONDITIONS } from '../utils/categories';
import { createNeed } from '../services/needsService';
import { LocationPicker } from '../components/LocationPicker';

export function CreateNeedPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, profile } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || CATEGORIES[0].name);
  const [quantityRequired, setQuantityRequired] = useState(1);
  const [unit, setUnit] = useState('units');
  const [acceptableCondition, setAcceptableCondition] = useState(['good', 'fair']);
  const [budget, setBudget] = useState(0);
  const [preferredLocation, setPreferredLocation] = useState(profile?.city || 'Seattle, WA');
  const [lat, setLat] = useState(profile?.lat || 47.6685);
  const [lng, setLng] = useState(profile?.lng || -122.3831);
  const [deadline, setDeadline] = useState('');
  const [canCollect, setCanCollect] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const toggleCondition = (condValue) => {
    setAcceptableCondition(prev =>
      prev.includes(condValue)
        ? prev.filter(c => c !== condValue)
        : [...prev, condValue]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !category || !quantityRequired) {
      setError('Please fill in all required fields.');
      return;
    }

    if (parseFloat(quantityRequired) <= 0) {
      setError('Required quantity must be greater than zero.');
      return;
    }

    setSubmitting(true);
    try {
      const needData = {
        user_id: user.id,
        title: title.trim(),
        description: description.trim(),
        category,
        quantity_required: parseFloat(quantityRequired),
        unit: unit.trim(),
        acceptable_condition: acceptableCondition,
        budget: parseFloat(budget || 0),
        preferred_location: preferredLocation.trim(),
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        deadline: deadline ? new Date(deadline).toISOString() : null,
        can_collect: canCollect,
        status: 'active'
      };

      const created = await createNeed(needData);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/matches?needId=${created.id}`);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to publish need.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Publish a Resource Need"
      subtitle="Looking for materials for a project, workshop, or community garden? Post a need to trigger rule-based recommendations."
    >
      <div className="max-w-3xl space-y-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-xs">
          {success ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-forest-600 mx-auto" />
              <h2 className="text-xl font-bold text-charcoal-900">Need Published Successfully!</h2>
              <p className="text-xs text-charcoal-500">
                Finding compatible resource matches in the database...
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
              <div>
                <label className="block text-charcoal-700 font-bold mb-1">
                  Resource Needed Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Reclaimed Timber Planks for Community Garden Raised Beds"
                  required
                  className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block text-charcoal-700 font-bold mb-2">
                  Choose Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
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
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm bg-white focus:ring-2 focus:ring-forest-500"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-charcoal-700 font-bold mb-1">
                  Description & Intended Project Use *
                </label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what project you are building, minimum dimensions required, whether nails or surface blemishes are acceptable, and special criteria..."
                  required
                  className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-forest-500"
                />
              </div>

              {/* Quantity, Unit & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-charcoal-50 border border-charcoal-200">
                <div>
                  <label className="block text-charcoal-700 font-bold mb-1">Quantity Needed *</label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={quantityRequired}
                    onChange={(e) => setQuantityRequired(e.target.value)}
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
                    placeholder="e.g. planks, kg, units, sheets"
                    required
                    className="w-full p-2 rounded-xl border border-charcoal-200 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-charcoal-700 font-bold mb-1">Max Budget ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="0 for free/donation"
                    className="w-full p-2 rounded-xl border border-charcoal-200 text-sm bg-white"
                  />
                </div>
              </div>

              {/* Acceptable Conditions Checkboxes */}
              <div>
                <label className="block text-charcoal-700 font-bold mb-2">
                  Acceptable Item Conditions
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CONDITIONS.map(c => {
                    const isChecked = acceptableCondition.includes(c.value);
                    return (
                      <button
                        type="button"
                        key={c.value}
                        onClick={() => toggleCondition(c.value)}
                        className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                          isChecked
                            ? 'bg-forest-50 border-forest-500 text-forest-900 font-semibold'
                            : 'bg-white border-charcoal-200 text-charcoal-600 hover:border-charcoal-300'
                        }`}
                      >
                        <span>{c.label}</span>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location & Collection ability */}
              <div className="space-y-4 pt-4 border-t border-charcoal-100">
                <LocationPicker
                  initialLocation={preferredLocation}
                  initialLat={lat}
                  initialLng={lng}
                  onLocationSelect={(loc) => {
                    setPreferredLocation(loc.address);
                    setLat(loc.lat);
                    setLng(loc.lng);
                  }}
                  label="Preferred Collection Area / Location (Google Maps Compatible)"
                />

                <div>
                  <label className="block text-charcoal-700 font-bold mb-1">
                    Need By Date / Deadline
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm bg-white"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-forest-50/60 border border-forest-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-forest-900 block">Can you handle transportation & collection?</span>
                  <p className="text-[11px] text-forest-700">ReLoop requires requesters to collect resources independently.</p>
                </div>
                <input
                  type="checkbox"
                  checked={canCollect}
                  onChange={(e) => setCanCollect(e.target.checked)}
                  className="rounded text-forest-600 focus:ring-forest-500 w-4 h-4"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/my-needs')}
                  className="px-5 py-2.5 rounded-xl border border-charcoal-200 text-charcoal-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-forest-700 text-white font-bold text-sm hover:bg-forest-800 transition shadow-md disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-fresh-300" />
                  <span>{submitting ? 'Publishing...' : 'Publish Need & Find Matches'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
