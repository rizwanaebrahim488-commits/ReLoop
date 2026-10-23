import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  MessageSquare,
  ShieldCheck,
  MapPin,
  Calendar,
  AlertTriangle,
  Package,
  Layers,
  Flag,
  CheckCircle2,
  Share2,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Info
} from 'lucide-react';
import { getResourceById } from '../services/resourceService';
import { toggleFavorite, checkIsFavorite } from '../services/favoritesService';
import { createRequest } from '../services/requestsService';
import { getOrCreateConversation } from '../services/messagesService';
import { createReport } from '../services/adminService';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { formatPublicLocation } from '../utils/maps';
import { getNextBestUsePathways } from '../utils/nextBestUse';
import { useAuth } from '../context/AuthContext';

export function ResourceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Request modal state
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestedQuantity, setRequestedQuantity] = useState(1);
  const [requestMessage, setRequestMessage] = useState('');
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestError, setRequestError] = useState('');

  // Report modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Safety or condition concern');
  const [reportDescription, setReportDescription] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    async function fetchResource() {
      setLoading(true);
      try {
        const data = await getResourceById(id);
        setResource(data);
        if (user && data) {
          const favStatus = await checkIsFavorite(user.id, data.id);
          setIsFavorite(favStatus);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchResource();
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen py-24 text-center text-charcoal-400">
        Loading resource specifications...
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 text-center bg-white rounded-3xl border border-charcoal-200">
        <Package className="w-12 h-12 text-charcoal-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-charcoal-900 mb-2">Resource Not Found</h2>
        <p className="text-xs text-charcoal-500 mb-6">This listing may have been completed, removed, or expired.</p>
        <Link to="/resources" className="px-4 py-2 bg-forest-700 text-white rounded-xl text-xs font-semibold">
          Back to Browse
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === resource.user_id;
  const isAvailable = resource.status === 'active' && (resource.available_quantity ?? resource.quantity) > 0;
  const images = resource.images?.length > 0
    ? resource.images
    : ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80'];
  const seller = resource.profiles || {};
  const nextBestUses = getNextBestUsePathways(resource.category);

  const handleToggleFavorite = async () => {
    if (!user) {
      alert('Please log in or register to save items to your favorites.');
      return;
    }
    const res = await toggleFavorite(user.id, resource.id);
    setIsFavorite(res.isFavorite);
  };

  const handleContactSeller = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (isOwner) {
      alert('You are the owner of this listing.');
      return;
    }
    try {
      const conv = await getOrCreateConversation(resource.id, user.id, resource.user_id);
      navigate(`/messages/${conv.id}`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleOpenRequestModal = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setRequestedQuantity(1);
    setRequestMessage('');
    setRequestError('');
    setRequestSuccess(false);
    setRequestModalOpen(true);
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setRequestSubmitting(true);
    setRequestError('');
    try {
      await createRequest({
        resourceId: resource.id,
        requesterId: user.id,
        ownerId: resource.user_id,
        quantity: requestedQuantity,
        message: requestMessage
      });
      setRequestSuccess(true);
      setTimeout(() => {
        setRequestModalOpen(false);
        navigate('/requests');
      }, 1500);
    } catch (err) {
      setRequestError(err.message || 'Failed to submit request.');
    } finally {
      setRequestSubmitting(false);
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to report listings.');
      return;
    }
    setReportSubmitting(true);
    try {
      await createReport({
        reporterId: user.id,
        reportedResourceId: resource.id,
        reportedUserId: resource.user_id,
        reason: reportReason,
        description: reportDescription
      });
      setReportSuccess(true);
      setTimeout(() => setReportModalOpen(false), 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setReportSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-charcoal-500 mb-6">
          <Link to="/" className="hover:text-forest-700">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/resources" className="hover:text-forest-700">Resources</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-charcoal-800 font-semibold truncate max-w-[200px] sm:max-w-md">{resource.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Media, Description, Safety */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-3xl border border-charcoal-100 overflow-hidden shadow-xs">
              <div className="aspect-16/10 w-full bg-charcoal-100 relative">
                <img
                  src={images[activeImageIdx]}
                  alt={resource.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant="primary" className="bg-forest-900/80 backdrop-blur-md text-white border-none px-3 py-1 text-xs">
                    {resource.listing_type === 'giveaway' ? 'Free Giveaway' : (resource.listing_type || 'Available')}
                  </Badge>
                  <Badge variant="default" className="bg-white/90 backdrop-blur-md text-charcoal-900 px-3 py-1 text-xs font-semibold">
                    {resource.condition ? resource.condition.replace('_', ' ') : 'Good condition'}
                  </Badge>
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="p-4 flex gap-3 overflow-x-auto border-t border-charcoal-100">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                        activeImageIdx === idx ? 'border-forest-600 ring-2 ring-forest-200' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Specifications Details */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-100 shadow-xs space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-forest-600 block mb-1">
                  {resource.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 leading-tight">
                  {resource.title}
                </h1>
              </div>

              {/* Key Specs Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-charcoal-100 text-xs">
                <div>
                  <span className="text-charcoal-400 block mb-0.5">Total Quantity:</span>
                  <span className="font-bold text-charcoal-800 text-sm">
                    {resource.quantity} {resource.unit}
                  </span>
                </div>
                <div>
                  <span className="text-charcoal-400 block mb-0.5">Available Units:</span>
                  <span className="font-bold text-forest-700 text-sm">
                    {resource.available_quantity ?? resource.quantity} {resource.unit}
                  </span>
                </div>
                <div>
                  <span className="text-charcoal-400 block mb-0.5">Partial Request:</span>
                  <span className="font-bold text-charcoal-800 text-sm">
                    {resource.allow_partial_quantity ? 'Allowed' : 'Full lot only'}
                  </span>
                </div>
                <div>
                  <span className="text-charcoal-400 block mb-0.5">Status:</span>
                  <span className="font-bold text-charcoal-800 text-sm capitalize">
                    {resource.status}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-charcoal-900 mb-2">Resource Description</h3>
                <p className="text-sm text-charcoal-700 leading-relaxed whitespace-pre-line">
                  {resource.description}
                </p>
              </div>

              {/* Safety & Handling Notes */}
              {resource.safety_notes && (
                <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex gap-3 text-xs text-amber-900">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold mb-0.5">Safety & Handling Notes</h4>
                    <p className="leading-relaxed">{resource.safety_notes}</p>
                  </div>
                </div>
              )}

              {/* Next Best Use Pathways Recommendation */}
              <div className="pt-6 border-t border-charcoal-100">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-forest-600" />
                  <h3 className="text-sm font-bold text-charcoal-900">
                    Next Best Use Circular Recommendations
                  </h3>
                </div>
                <p className="text-xs text-charcoal-500 mb-4">
                  If this item isn't claimed for direct reuse, here are recommended eco-conscious pathways to prevent it reaching landfill:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {nextBestUses.map((path, idx) => (
                    <div key={idx} className="bg-offwhite p-3.5 rounded-xl border border-charcoal-100 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-charcoal-800">{path.title}</span>
                        <Badge variant="purple">{path.badge}</Badge>
                      </div>
                      <p className="text-charcoal-600 text-[11px] leading-relaxed mb-2">{path.description}</p>
                      {path.safetyNote && (
                        <p className="text-[10px] text-rose-700 font-semibold">{path.safetyNote}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing, Request Action, Seller Card, Location */}
          <div className="space-y-6">
            {/* Price & Primary Actions Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-charcoal-100 shadow-xs space-y-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-charcoal-400 block">Listing Value</span>
                  <div className="text-3xl font-extrabold text-charcoal-900">
                    {resource.listing_type === 'giveaway' || resource.listing_type === 'donation' || resource.price === 0
                      ? <span className="text-forest-700">FREE</span>
                      : `$${resource.price}`}
                  </div>
                </div>

                <Badge variant={isAvailable ? 'success' : 'default'} className="text-xs px-3 py-1">
                  {isAvailable ? 'Available for Collection' : 'Unavailable / Reserved'}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                {isOwner ? (
                  <div className="space-y-2">
                    <Link
                      to={`/resources/${resource.id}/edit`}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-forest-700 text-white font-bold text-xs sm:text-sm hover:bg-forest-800 transition"
                    >
                      Edit Your Listing
                    </Link>
                    <p className="text-xs text-center text-charcoal-400">
                      You are the owner of this listing.
                    </p>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleContactSeller}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs sm:text-sm transition shadow-md shadow-forest-900/15 active:scale-98"
                    >
                      <MessageSquare className="w-4 h-4 text-fresh-300" />
                      <span>Chat with Seller</span>
                    </button>

                    <button
                      type="button"
                      disabled={!isAvailable}
                      onClick={handleOpenRequestModal}
                      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm border transition ${
                        isAvailable
                          ? 'border-forest-600 text-forest-800 bg-forest-50 hover:bg-forest-100'
                          : 'bg-charcoal-100 text-charcoal-400 border-charcoal-200 cursor-not-allowed'
                      }`}
                    >
                      <Package className="w-4 h-4 text-forest-700" />
                      <span>{isAvailable ? 'Request / Reserve Quantity' : 'Resource Unavailable'}</span>
                    </button>
                  </>
                )}

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleToggleFavorite}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-charcoal-200 text-charcoal-700 hover:bg-charcoal-50 text-xs font-semibold transition"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-charcoal-400'}`} />
                    <span>{isFavorite ? 'Saved' : 'Save Item'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReportModalOpen(true)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-charcoal-200 text-charcoal-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-medium transition"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Report</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Location Info (Icon + Name Only, No Map) */}
            <div className="bg-white rounded-3xl p-5 border border-charcoal-100 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center shrink-0 border border-forest-100">
                <MapPin className="w-5 h-5 text-forest-600" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block mb-0.5">
                  Item Location
                </span>
                <p className="text-sm font-extrabold text-charcoal-900 truncate">
                  {formatPublicLocation(resource, false) || resource.location_name || resource.city || 'Location available on contact'}
                </p>
                {resource.city && resource.city !== resource.location_name && (
                  <span className="text-xs text-charcoal-500 block truncate">
                    {resource.city}
                  </span>
                )}
              </div>
            </div>

            {/* Seller Public Profile Card */}
            <div className="bg-white rounded-3xl p-6 border border-charcoal-100 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
                Resource Owner
              </h3>

              <div className="flex items-center space-x-3">
                <img
                  src={seller.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={seller.full_name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-forest-200"
                />
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-charcoal-900 truncate">
                      {seller.full_name || 'Community Member'}
                    </span>
                    {seller.is_verified && (
                      <ShieldCheck className="w-4 h-4 text-forest-600 shrink-0" title="Verified Account / Organization" />
                    )}
                  </div>
                  <span className="text-[11px] text-charcoal-500 capitalize block">
                    {seller.account_type || 'Individual Member'}
                  </span>
                </div>
              </div>

              {seller.description && (
                <p className="text-xs text-charcoal-600 line-clamp-3 leading-relaxed">
                  "{seller.description}"
                </p>
              )}

              {seller.city && (
                <div className="text-xs text-charcoal-500 pt-1">
                  📍 Based in {seller.city}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* REQUEST QUANTITY MODAL */}
      <Modal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        title="Request Resource Units"
      >
        {requestSuccess ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-forest-600 mx-auto" />
            <h4 className="text-lg font-bold text-charcoal-900">Request Sent Successfully!</h4>
            <p className="text-xs text-charcoal-500">
              The owner has been notified. You can coordinate collection via your Requests tab.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitRequest} className="space-y-4 text-xs">
            {requestError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200">
                {requestError}
              </div>
            )}

            <div>
              <label className="block text-charcoal-700 font-bold mb-1">
                Requested Quantity (Max available: {resource.available_quantity ?? resource.quantity} {resource.unit})
              </label>
              <input
                type="number"
                min="1"
                max={resource.available_quantity ?? resource.quantity}
                value={requestedQuantity}
                onChange={(e) => setRequestedQuantity(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-forest-500"
                required
              />
            </div>

            <div>
              <label className="block text-charcoal-700 font-bold mb-1">
                Message to Owner (Intended use, collection timing)
              </label>
              <textarea
                rows="4"
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Introduce yourself, your intended use, vehicle capacity, and proposed collection window..."
                className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-forest-500"
                required
              />
            </div>

            <div className="bg-offwhite p-3 rounded-xl text-charcoal-600 space-y-1">
              <p className="font-semibold text-charcoal-800">Collection Reminder:</p>
              <p>You agree to inspect the resource upon collection and handle transportation yourself.</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRequestModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-charcoal-200 text-charcoal-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={requestSubmitting}
                className="px-5 py-2 rounded-xl bg-forest-700 text-white font-bold hover:bg-forest-800 disabled:opacity-50"
              >
                {requestSubmitting ? 'Sending Request...' : 'Send Request'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* REPORT MODAL */}
      <Modal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Report Listing"
      >
        {reportSuccess ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-forest-600 mx-auto" />
            <h4 className="text-lg font-bold text-charcoal-900">Report Submitted</h4>
            <p className="text-xs text-charcoal-500">
              Thank you for keeping ReLoop safe. Our moderation team will inspect this listing.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
            <div>
              <label className="block text-charcoal-700 font-bold mb-1">Reason for Report</label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm"
              >
                <option value="Safety or condition concern">Safety or hazardous condition concern</option>
                <option value="Prohibited item (e.g. spoiled food, toxic e-waste)">Prohibited item (spoiled food, hazardous waste)</option>
                <option value="Inaccurate description or counterfeit">Inaccurate description</option>
                <option value="Delivery partner solicitation">Delivery partner or spam solicitation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-charcoal-700 font-bold mb-1">Details</label>
              <textarea
                rows="3"
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Describe why this listing violates ReLoop community guidelines..."
                className="w-full p-2.5 rounded-xl border border-charcoal-200 text-sm"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-charcoal-200 text-charcoal-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={reportSubmitting}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 disabled:opacity-50"
              >
                {reportSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
