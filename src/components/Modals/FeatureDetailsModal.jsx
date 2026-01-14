import React from "react";
import { X, ShieldCheck, Activity, Info, Layers, CreditCard } from "lucide-react";

const FeatureDetailsModal = ({ isOpen, onClose, feature }) => {
  if (!isOpen || !feature) return null;
  console.log("my feagtguer",feature);
  

  // Helper for status badges
  const StatusBadge = ({ active }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }`}>
      {active ? "Active" : "Inactive"}
    </span>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Feature Details</h2>
            <p className="text-sm text-slate-500">ID: {feature.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white hover:shadow text-slate-400 hover:text-slate-600 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Column: Basic Info */}
            <div className="md:col-span-2 space-y-6">
              <section>
                <h3 className="flex items-center text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                  <Info size={16} className="mr-2" /> General Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase">Name</label>
                    <p className="text-slate-900 font-semibold">{feature.name}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase">Code</label>
                    <p className="text-slate-900 font-mono">{feature.code}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-500 uppercase">Description</label>
                    <p className="text-slate-600 text-sm leading-relaxed">{feature.description || "No description provided."}</p>
                  </div>
                </div>
              </section>

              {/* Usage Policies Section */}
              <section>
                <h3 className="flex items-center text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                  <CreditCard size={16} className="mr-2" /> Usage Policies
                </h3>
                {feature.usage_policies && feature.usage_policies.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {feature.usage_policies.map((policy) => (
                      <div key={policy.id} className="flex flex-wrap items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-200 transition-colors">
                        <div>
                          <p className="font-semibold text-slate-800">{policy.plan_name}</p>
                          <p className="text-xs text-slate-500">Plan ID: {policy.plan}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-blue-600">Limit: {policy.limit}</p>
                          <p className="text-xs text-slate-400 capitalize">Reset: {policy.reset_cycle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic bg-slate-50 p-4 rounded-lg text-center">No usage policies configured</p>
                )}
              </section>
            </div>

            {/* Right Column: Metadata & Constraints */}
            <div className="space-y-6">
              <section className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                <div className="space-y-4">
                   <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Status</label>
                    <StatusBadge active={feature.is_active} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Feature Type</label>
                    <span className="text-sm font-semibold text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">{feature.feature_type}</span>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Base Price</label>
                    <p className="text-lg font-bold text-slate-900">₹{feature.base_price}</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="flex items-center text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  <ShieldCheck size={16} className="mr-2" /> Permissions
                </h3>
                <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
                  {feature.permissions && Object.keys(feature.permissions).length > 0 ? (
                    Object.entries(feature.permissions).map(([key, value]) => (
                      <div key={key} className="flex justify-between p-2.5 px-4 text-sm">
                        <span className="text-slate-600 capitalize">{key.replace(/_/g, ' ')}</span>
                        <span>{value ? "✅" : "❌"}</span>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-sm text-slate-400 italic">None</p>
                  )}
                </div>
              </section>

              <section>
                <h3 className="flex items-center text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  <Layers size={16} className="mr-2" /> Dependencies
                </h3>
                {feature.requires_features && feature.requires_features.length > 0 ? (
                  <div className="space-y-2">
                    {feature.requires_features.map((req) => (
                      <div key={req.id} className="text-xs p-2 bg-blue-50 text-blue-700 rounded border border-blue-100">
                        <span className="font-bold">{req.name}</span> ({req.code})
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">No dependencies</p>
                )}
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs text-slate-400">
          <div className="flex space-x-4">
            <span>Requires: <strong>{feature.requires_features_count}</strong></span>
            <span>Dependents: <strong>{feature.dependent_features_count}</strong></span>
          </div>
          <span>Created: {feature.created_at}</span>
        </div>
      </div>
    </div>
  );
};

export default FeatureDetailsModal;