import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import InvoicePreview from "../cards/InvoicePreview";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';



const DEFAULT_FROM_ADDRESS = `2nd Floor, Venture Arcade,
Mavoor Road, Thondayad,
Kozhikode, Kerala, 673016, India
+91 97448 98185`;



const GenerateInvoiceModal = ({ isOpen, onClose, shopData }) => {
  if (!isOpen) return null;
  console.log("data in geneara invoice",shopData);
  

  const [from, setFrom] = useState({
    orgName: "Bookie Buddy",
    address: DEFAULT_FROM_ADDRESS,
  });

  const [to, setTo] = useState({
    name: "",
    place: "",
    phone: "",
  });

  const [invoice, setInvoice] = useState({
    invoiceNo: "",
    invoiceDate: "",
    paidTotal: 0,
    dueDate: "",
  });

  const [items, setItems] = useState([
    { description: "", price: 0, offer: 0, total: 0 },
  ]);

  const [terms, setTerms] = useState([]);
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  /* ---------------- INIT DATA ---------------- */
  useEffect(() => {
    if (shopData) {
      setTo({
        name: shopData.name || "",
        place: shopData.place || "",
        phone: shopData.phone || "",
      });

      setInvoice({
        invoiceNo: `BB${Date.now()}`,
        invoiceDate: new Date().toISOString().slice(0, 10),
        paidTotal: 0,
        dueDate: "",
      });
    }

    setTerms(
      Array.isArray(shopData.terms_and_conditions)
        ? shopData.terms_and_conditions
        : []
    );
  }, [shopData]);

  /* ---------------- CALCULATIONS ---------------- */
  const calculateRowTotal = (price, offer) => {
    return Number(price) - (Number(price) * Number(offer)) / 100;
  };

  const subTotal = items.reduce((sum, i) => sum + Number(i.total || 0), 0);
  const balance = subTotal - Number(invoice.paidTotal || 0);

  /* ---------------- VALIDATION ---------------- */
  const validateForm = () => {
    const newErrors = {};

    if (!from.orgName.trim()) newErrors.fromOrgName = "Organization name is required";
    if (!from.address.trim()) newErrors.fromAddress = "Address is required";
    if (!to.name.trim()) newErrors.toName = "Customer name is required";
    if (!to.place.trim()) newErrors.toPlace = "Place is required";
    if (!to.phone.trim()) newErrors.toPhone = "Phone number is required";
    if (!invoice.invoiceNo.trim()) newErrors.invoiceNo = "Invoice number is required";
    if (!invoice.invoiceDate) newErrors.invoiceDate = "Invoice date is required";
    
    const hasValidItem = items.some(item => item.description.trim() !== "");
    if (!hasValidItem) {
      alert("At least one item is mandatory to generate the invoice");
      return false;
    }
    
    // if (balance > 0 && !invoice.dueDate) newErrors.dueDate = "Due date is required when balance is due";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- HANDLERS ---------------- */
  const updateItem = (index, field, value) => {
    const updated = [...items];
    
    if (field === "price" || field === "offer") {
      const numValue = Math.max(0, Number(value) || 0);
      updated[index][field] = numValue;
      updated[index].total = calculateRowTotal(
        updated[index].price,
        updated[index].offer
      );
    } else {
      updated[index][field] = value;
    }

    setItems(updated);
  };

  const addItem = () =>
    setItems([...items, { description: "", price: 0, offer: 0, total: 0 }]);

  const removeItem = (index) =>
    setItems(items.filter((_, i) => i !== index));

  const addTerm = () => setTerms([...terms, ""]);

  const updateTerm = (i, value) => {
    const t = [...terms];
    t[i] = value;
    setTerms(t);
  };

  const removeTerm = (i) => setTerms(terms.filter((_, idx) => idx !== i));

  const handlePaidTotalChange = (value) => {
    const numValue = Math.max(0, Number(value) || 0);
    setInvoice({ ...invoice, paidTotal: numValue });
  };

  /* ---------------- PREVIEW ---------------- */
  const handlePreview = () => {
    if (!validateForm()) return;
    setShowPreview(true);
  };

  const generatePDF = async () => {
    try {
      const pages = document.querySelectorAll('.invoice-page');
      if (!pages.length) {
        alert('No invoice pages found');
        return;
      }
  
      // Import jsPDF
      // const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
  
      // Process each page
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        
        console.log(`Processing page ${i + 1} of ${pages.length}...`);
        
        // Capture page as canvas with high quality
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
          width: page.offsetWidth,
          height: page.offsetHeight,
        });
  
        // Convert to image
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        
        // Add new page if not the first one
        if (i > 0) {
          pdf.addPage();
        }
        
        // Add image to PDF - fill entire A4 page
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, '', 'FAST');
      }
  
      // Save the PDF
      pdf.save(`${invoice.invoiceNo}.pdf`);
      
      console.log('PDF generated successfully!');
  
      setShowPreview(false);
      onClose();
    } catch (error) {
      console.error("PDF generation error:", error);
      alert(`Error generating PDF: ${error.message}`);
    }
  };
  
  
  
  /* ---------------- UI ---------------- */
  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

          {/* HEADER */}
          <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-2xl font-bold text-gray-800">Generate Invoice</h2>
            <p className="text-sm text-gray-600 mt-1">Fill in the details to create your invoice</p>
          </div>

          {/* CONTENT */}
          <div className="p-8 overflow-y-auto flex-1 space-y-8">

            {/* FROM SECTION */}
            <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-1 h-6 bg-blue-600 rounded mr-3"></div>
                <h3 className="text-lg font-semibold text-gray-800">Sender Information</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name
                  </label>
                  <input
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                      errors.fromOrgName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={from.orgName}
                    onChange={(e) => {
                      setFrom({ ...from, orgName: e.target.value });
                      if (errors.fromOrgName) setErrors({ ...errors, fromOrgName: null });
                    }}
                    placeholder="Enter organization name"
                  />
                  {errors.fromOrgName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fromOrgName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none ${
                      errors.fromAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                    rows="4"
                    value={from.address}
                    onChange={(e) => {
                      setFrom({ ...from, address: e.target.value });
                      if (errors.fromAddress) setErrors({ ...errors, fromAddress: null });
                    }}
                    placeholder="Enter complete address"
                  />
                  {errors.fromAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.fromAddress}</p>
                  )}
                </div>
              </div>
            </section>

            {/* TO SECTION */}
            <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-1 h-6 bg-green-600 rounded mr-3"></div>
                <h3 className="text-lg font-semibold text-gray-800">Customer Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name
                  </label>
                  <input
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition ${
                      errors.toName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={to.name}
                    onChange={(e) => {
                      setTo({ ...to, name: e.target.value });
                      if (errors.toName) setErrors({ ...errors, toName: null });
                    }}
                    placeholder="Name"
                  />
                  {errors.toName && (
                    <p className="text-red-500 text-sm mt-1">{errors.toName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Place
                  </label>
                  <input
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition ${
                      errors.toPlace ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={to.place}
                    onChange={(e) => {
                      setTo({ ...to, place: e.target.value });
                      if (errors.toPlace) setErrors({ ...errors, toPlace: null });
                    }}
                    placeholder="City/Location"
                  />
                  {errors.toPlace && (
                    <p className="text-red-500 text-sm mt-1">{errors.toPlace}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition ${
                      errors.toPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={to.phone}
                    onChange={(e) => {
                      setTo({ ...to, phone: e.target.value });
                      if (errors.toPhone) setErrors({ ...errors, toPhone: null });
                    }}
                    placeholder="Phone"
                  />
                  {errors.toPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.toPhone}</p>
                  )}
                </div>
              </div>
            </section>

            {/* INVOICE DETAILS */}
            <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-1 h-6 bg-purple-600 rounded mr-3"></div>
                <h3 className="text-lg font-semibold text-gray-800">Invoice Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Number
                  </label>
                  <input
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
                      errors.invoiceNo ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={invoice.invoiceNo}
                    onChange={(e) => {
                      setInvoice({ ...invoice, invoiceNo: e.target.value });
                      if (errors.invoiceNo) setErrors({ ...errors, invoiceNo: null });
                    }}
                    placeholder="INV-001"
                  />
                  {errors.invoiceNo && (
                    <p className="text-red-500 text-sm mt-1">{errors.invoiceNo}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
                      errors.invoiceDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={invoice.invoiceDate}
                    onChange={(e) => {
                      setInvoice({ ...invoice, invoiceDate: e.target.value });
                      if (errors.invoiceDate) setErrors({ ...errors, invoiceDate: null });
                    }}
                  />
                  {errors.invoiceDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.invoiceDate}</p>
                  )}
                </div>
              </div>
            </section>

            {/* ITEMS */}
            <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-1 h-6 bg-orange-600 rounded mr-3"></div>
                  <h3 className="text-lg font-semibold text-gray-800">Invoice Items</h3>
                </div>
                <button
                  onClick={addItem}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm font-medium"
                >
                  + Add Item
                </button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-600 px-2">
                  <div className="col-span-1">#</div>
                  <div className="col-span-4">Description</div>
                  <div className="col-span-2">Price (₹)</div>
                  <div className="col-span-2">Offer (%)</div>
                  <div className="col-span-2">Total (₹)</div>
                  <div className="col-span-1"></div>
                </div>
                {items.map((item, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded-lg">
                    <div className="col-span-1 flex items-center justify-center text-gray-600 font-medium">
                      {i + 1}
                    </div>
                    <input
                      className="col-span-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                      value={item.description}
                      onChange={(e) => updateItem(i, "description", e.target.value)}
                      placeholder="Item description"
                    />
                    <input
                      type="number"
                      min="0"
                      className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                      value={item.price}
                      onChange={(e) => updateItem(i, "price", e.target.value)}
                      placeholder="0"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                      value={item.offer}
                      onChange={(e) => updateItem(i, "offer", e.target.value)}
                      placeholder="0"
                    />
                    <input
                      className="col-span-2 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg font-medium"
                      value={item.total.toFixed(2)}
                      readOnly
                    />
                    <div className="col-span-1 flex items-center justify-center">
                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(i)}
                          className="text-red-500 hover:text-red-700 transition p-1"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Payment Summary */}
              <div className="mt-6 bg-white rounded-lg p-4 border border-gray-300">
                <div className="flex flex-col gap-3 max-w-md ml-auto">
                  <div className="flex justify-between items-center text-base">
                    <span className="font-medium text-gray-700">Subtotal:</span>
                    <span className="font-bold text-gray-900">₹{subTotal.toFixed(2)}</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount Paid
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                      placeholder="Enter paid amount"
                      value={invoice.paidTotal}
                      onChange={(e) => handlePaidTotalChange(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between items-center text-lg pt-2 border-t-2 border-gray-200">
                    <span className="font-bold text-gray-800">Balance Due:</span>
                    <span className={`font-bold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ₹{balance.toFixed(2)}
                    </span>
                  </div>
                  {balance > 0 && (
                    <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date <span className="text-gray-400">(optional)</span>
                    </label>
                      <input
                        type="date"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition ${
                          errors.dueDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={invoice.dueDate}
                        onChange={(e) => {
                          setInvoice({ ...invoice, dueDate: e.target.value });
                          if (errors.dueDate) setErrors({ ...errors, dueDate: null });
                        }}
                      />
                      {errors.dueDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* TERMS & CONDITIONS */}
            <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-1 h-6 bg-gray-600 rounded mr-3"></div>
                  <h3 className="text-lg font-semibold text-gray-800">Terms & Conditions</h3>
                </div>
                <button
                  onClick={addTerm}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium"
                >
                  + Add Term
                </button>
              </div>
              <div className="space-y-3">
                {terms.map((t, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-gray-500 font-medium pt-2">{i + 1}.</span>
                    <input
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition bg-white"
                      value={t}
                      onChange={(e) => updateTerm(i, e.target.value)}
                      placeholder="Enter term or condition"
                    />
                    <button
                      onClick={() => removeTerm(i)}
                      className="text-red-500 hover:text-red-700 transition px-2"
                      title="Remove term"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {terms.length === 0 && (
                  <p className="text-gray-500 text-sm italic">No terms added yet</p>
                )}
              </div>
            </section>

          </div>

          {/* FOOTER */}
          <div className="px-8 py-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handlePreview}
              className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-medium shadow-lg shadow-blue-500/30"
            >
              Preview Invoice
            </button>
          </div>

        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <InvoicePreview
          data={{
            from,
            to,
            invoice,
            items,
            subTotal,
            balance,
            terms
          }}
          onClose={() => setShowPreview(false)}
          onDownload={generatePDF}
        />
      )}
    </>
  );
};

export default GenerateInvoiceModal;