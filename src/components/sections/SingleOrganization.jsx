import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, Store, Trash2, Edit, Plus, ArrowLeft, Phone, Mail, Globe, Landmark, MapPin } from 'lucide-react';
import { fetchSingleOrganization, deleteOrganization,updateOrganization } from '../../api/AdminApis';
import EditOrganizationModal from "../Modals/EditOrganizationModal";
import AssignShopsModal from "../Modals/AssignShopsModal";


const SingleOrganization = () => {
  const { orgId } = useParams();
  const navigate = useNavigate();
  
  const [orgData, setOrgData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);


const loadOrganization = async () => {
  setLoading(true);

  try {
    const response = await fetchSingleOrganization(orgId);
    setOrgData(response.data);
  } catch (err) {
    setError("Failed to load organization profile records.");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadOrganization();
}, [orgId]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this organization? This will sever all system records mapping.')) {
      try {
        await deleteOrganization(orgId);
        navigate('/organizations'); 
      } catch (err) {
        alert('Failed to drop organization records.');
      }
    }
  };

  const handleToggleStatus = async () => {
    await updateOrganization(orgId, {
        name: orgData.name,
        phone: orgData.phone,
        place: orgData.place,
        is_active: !orgData.is_active,
    });

    loadOrganization();
};

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb Line */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/organizations')}
            className="flex items-center text-sm font-medium text-gray-500 hover:text-purple-600 transition"
          >
            <ArrowLeft size={16} className="mr-1.5" /> Back to Organizations Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Block Column: Full Technical Meta Fields & System Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
              
              {/* Profile Overview Card Header */}
              <div className="flex items-start space-x-4 mb-6">
                {orgData?.image ? (
                  <img 
                    src={orgData.image} 
                    alt={orgData.name} 
                    className="w-16 h-16 rounded-xl object-cover border border-gray-100 shadow-sm"
                  />
                ) : (
                  <div className="p-4 bg-purple-100 text-purple-700 rounded-xl">
                    <Building2 size={32} />
                  </div>
                )}
                <div className="space-y-0.5">
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">{orgData?.name}</h2>
                  <p className="text-xs text-gray-400 font-mono">Slug: {orgData?.slug}</p>
                  <p className="text-xs text-gray-400 font-mono">ID: #{orgData?.id}</p>
                </div>
              </div>

              {/* Comprehensive Attribute Listing Grid */}
              <div className="border-t border-gray-100 pt-4 space-y-4 text-sm">
                
                {/* Core Status Block flags */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">System Access</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                     orgData && orgData?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {orgData && orgData?.is_active ? 'Active Status' : 'Suspended Access'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">Public Listing</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                      orgData?.public_listing_enabled ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {orgData?.public_listing_enabled ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>

                {/* Technical Profile Context fields */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">Profile Information</span>
                  
                  <div className="flex items-center text-gray-700">
                    <Phone size={14} className="text-gray-400 mr-2.5 shrink-0" />
                    <span>{orgData?.phone || <span className="text-gray-300 italic">No primary line</span>}</span>
                  </div>

                  {orgData?.phone2 && (
                    <div className="flex items-center text-gray-600 pl-6">
                      <span>Secondary: {orgData.phone2}</span>
                    </div>
                  )}

                  <div className="flex items-center text-gray-700">
                    <Mail size={14} className="text-gray-400 mr-2.5 shrink-0" />
                    <span className="truncate">{orgData?.email || <span className="text-gray-300 italic">No email saved</span>}</span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <Globe size={14} className="text-gray-400 mr-2.5 shrink-0" />
                    <span className="text-xs font-mono">{orgData?.public_token || '—'}</span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <Landmark size={14} className="text-gray-400 mr-2.5 shrink-0" />
                    <span className="uppercase">{orgData?.gst_number || <span className="text-gray-300 italic">No Tax ID linked</span>}</span>
                  </div>
                </div>

                {/* Mailing & Location address records */}
                <div className="space-y-1.5 pt-2 border-t border-gray-50">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">Corporate Address</span>
                  <div className="flex items-start text-gray-600 text-xs leading-relaxed">
                    <MapPin size={14} className="text-gray-400 mr-2 mt-0.5 shrink-0" />
                    <div>
                      {orgData?.street && <p>{orgData.street}</p>}
                      {orgData?.place && <p>{orgData.place}</p>}
                      {(orgData?.city || orgData?.state || orgData?.pincode) && (
                        <p>{[orgData.city, orgData.state, orgData.pincode].filter(Boolean).join(', ')}</p>
                      )}
                      {!orgData?.street && !orgData?.place && !orgData?.city && (
                        <span className="text-gray-300 italic">No business address details available.</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-gray-400 text-right">
                  System Created: {orgData?.created_at}
                </div>
              </div>

              {/* View Crud Trigger Buttons */}
              <div className="border-t border-gray-100 mt-6 pt-4 space-y-2">
                <button
                 onClick={() => setEditModalOpen(true)}
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-purple-600 text-purple-600 hover:bg-purple-50 font-medium rounded-lg transition"
                >
                  <Edit size={16} className="mr-2" /> Modify Profile Data
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center justify-center px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded-lg transition"
                >
                  <Trash2 size={16} className="mr-2" /> Terminate Organization
                </button>

                <button
                        onClick={handleToggleStatus}
                        className={`w-full flex items-center justify-center px-4 py-2.5 rounded-lg transition ${
                            orgData && orgData.is_active
                                ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                                : "bg-green-50 text-green-700 hover:bg-green-100"
                        }`}
                    >
                        {orgData && orgData.is_active ? "Deactivate Organization" : "Activate Organization"}
                    </button>
              </div>
            </div>
          </div>

          {/* Right Block Column: Linked Operational Branches List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Store className="text-purple-600" size={20} />
                  <h3 className="text-lg font-bold text-gray-800">
                    Connected Branches ({orgData?.shop_count || 0})
                  </h3>
                </div>
                <button
                        onClick={() => setAssignModalOpen(true)}
                        className="flex items-center bg-purple-600 text-white px-3 py-1.5 rounded-lg"
                    >
                        
                        Assign/Remove Shops
                    </button>
              </div>

              <div className="p-6">
                {orgData?.shops && orgData.shops.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {orgData.shops.map((shop) => (
                      <div key={shop.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-50 text-purple-600 rounded-lg flex items-center justify-center font-bold border border-gray-100">
                            {shop.img ? (
                                <img
                                    src={shop.img}
                                    alt={shop.name}
                                    className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                                />
                                ) : (
                                <div className="w-10 h-10 bg-gray-50 text-purple-600 rounded-lg flex items-center justify-center font-bold border border-gray-100">
                                    {shop.name.charAt(0).toUpperCase()}
                                </div>
                                )}
                          </div>
                          <div>
                            <h4 
                              className="font-semibold text-gray-800 hover:text-purple-600 cursor-pointer transition" 
                              onClick={() => navigate(`/shops/${shop.id}`)}
                            >
                              {shop.name}
                            </h4>
                           <p className="text-xs text-gray-400">
                                {[shop.address, shop.place, shop.city]
                                    .filter(Boolean)
                                    .join(", ")}
                                </p>
                            
                            <p className="text-xs text-gray-500">
                                {shop.phone}
                            </p>


                            <span
                            className={`px-2 py-1 rounded-full text-xs ${
                                shop.is_active
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {shop.is_active ? "Active" : "Inactive"}
                        </span>
                          </div>
                        </div>
                        
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Store size={36} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm font-medium">No active storefront branches linked yet.</p>
                    <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1">
                      Link existing components or initialize fresh shop allocations via the provisioning button.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <EditOrganizationModal
            isOpen={editModalOpen}
            organization={orgData}
            onClose={() => setEditModalOpen(false)}
            onUpdated={loadOrganization}
        />
        <AssignShopsModal
            isOpen={assignModalOpen}
            onClose={() => setAssignModalOpen(false)}
            orgId={orgId}
            organization={orgData}
            onUpdated={loadOrganization}
        />

        </div>
      </div>
    </div>
  );
};

export default SingleOrganization;