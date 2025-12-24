import React from "react";
import invoiceBg from "../../assets/invoice-bg.svg";

const ITEMS_PER_PAGE = 5;
const TERMS_PER_PAGE = 5;

const InvoicePreview = ({ data, onClose, onDownload }) => {
  /* ---------------- PAGINATION ---------------- */
  const itemPages = [];
  for (let i = 0; i < data.items.length; i += ITEMS_PER_PAGE) {
    itemPages.push(data.items.slice(i, i + ITEMS_PER_PAGE));
  }

  const termPages = [];
  for (let i = 0; i < (data.terms || []).length; i += TERMS_PER_PAGE) {
    termPages.push(data.terms.slice(i, i + TERMS_PER_PAGE));
  }

  const totalPages = Math.max(itemPages.length, termPages.length, 1);

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[900px] rounded-xl shadow-2xl flex flex-col max-h-[95vh]">

        {/* PREVIEW AREA */}
        <div className="overflow-y-auto flex-1 p-6">
          {/* WRAPPER with NO margin/padding between pages */}
          <div id="invoice-content" style={{ lineHeight: 0 }}>

            {Array.from({ length: totalPages }).map((_, pageIndex) => {
              const pageItems = itemPages[pageIndex] || [];
              const pageTerms = termPages[pageIndex] || [];

              return (
                <div
                  key={pageIndex}
                  className="invoice-page"
                  style={{
                    width: "210mm",
                    height: "297mm",
                    margin: 0,
                    padding: 0,
                    position: "relative",
                    backgroundColor: "white",
                    overflow: "hidden",
                    display: "block",
                    lineHeight: "normal",
                  }}
                >
                  {/* BACKGROUND */}
                  <img
                    src={invoiceBg}
                    alt="Invoice Background"
                    className="absolute top-0 left-0 w-full h-full object-cover z-0 pointer-events-none"
                  />

                  {/* CONTENT */}
                  <div
                    className="relative z-10 px-6 text-sm text-gray-900 mx-auto"
                    style={{ maxWidth: "190mm" }}
                  >
                    {/* HEADER SAFE SPACE */}
                    <div style={{ height: "185px" }} />

                    {/* FROM / TO */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                      <div>
                        <p className="text-xs font-bold mb-1">FROM</p>
                        <p className="font-semibold">{data.from.orgName}</p>
                        <p className="whitespace-pre-line">
                          {data.from.address}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-bold mb-1">TO</p>
                        <p className="font-semibold">{data.to.name}</p>
                        <p>{data.to.place}</p>
                        <p>{data.to.phone}</p>
                      </div>
                    </div>

                    {/* META */}
                    <div className="grid grid-cols-2 border mb-6">
                      <div className="px-4 py-2">
                        INVOICE DATE :{" "}
                        {new Date(data.invoice.invoiceDate)
                          .toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })
                          .toUpperCase()}
                      </div>
                      <div className="px-4 py-2 text-right">
                        INVOICE ID : {data.invoice.invoiceNo}
                      </div>
                    </div>

                    {/* ITEMS */}
                    {pageItems.length > 0 && (
                      <table className="w-full mb-5 border-collapse ">
                        <thead>
                          <tr className=" text-white text-sm"   style={{ backgroundColor: "#47035E" }} >
                            <th className="py-2 px-3 text-left">NO</th>
                            <th className="py-2 px-3 text-left">DESCRIPTION</th>
                            <th className="py-2 px-3 text-right">PRICE</th>
                            <th className="py-2 px-3 text-right">OFFER</th>
                            <th className="py-2 px-3 text-right">TOTAL</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pageItems.map((item, idx) => (
                            <tr key={idx}>
                              <td className="py-2 px-3">
                                {pageIndex * ITEMS_PER_PAGE + idx + 1}
                              </td>
                              <td className="py-2 px-3">
                                {item.description}
                              </td>
                              <td className="py-2 px-3 text-right">
                                ₹ {Number(item.price).toLocaleString()}
                              </td>
                              <td className="py-2 px-3 text-right">
                                {item.offer}%
                              </td>
                              <td className="py-2 px-3 text-right">
                                ₹ {Number(item.total).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {/* TERMS */}
                    {pageTerms.length > 0 && (
                      <div className="border-t pt-3">
                        <p className="font-bold mb-1">TERMS AND CONDITIONS</p>
                        <ul className="list-disc ml-5 space-y-1">
                          {pageTerms.map((t, i) => (
                            <li key={i}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* TOTALS (LAST PAGE ONLY) */}
                    {pageIndex === totalPages - 1 && (
                      <>
                        <div className="flex justify-end mt-6">
                          <div className="w-72">
                            <div className="flex justify-between py-2 border-b">
                              <span>SUB-TOTAL</span>
                              <span className="font-bold">
                                ₹ {data.subTotal.toLocaleString()}
                              </span>
                            </div>

                            <div className="flex justify-between items-center mt-2  text-white px-4 py-2 font-bold"style={{ backgroundColor: "#47035E" }} >
                              <span>PAID TOTAL</span>
                              <span>
                                ₹ {Number(data.invoice.paidTotal).toLocaleString()}
                              </span>
                            </div>

                            {/* Balance Due - Only show if balance exists */}
                            {data.balance > 0 && (
                              <div className="flex justify-between items-center mt-2 bg-red-600 text-white px-4 py-2 font-bold">
                                <span>BALANCE DUE</span>
                                <span>
                                  ₹ {Number(data.balance).toLocaleString()}
                                </span>
                              </div>
                            )}

                            {/* Due Date - Only show if balance exists and due date is set */}
                            {data.balance > 0 && data.invoice.dueDate && (
                              <div className="flex justify-between items-center mt-2 px-4 py-2 border border-red-600 text-red-600 font-semibold">
                                <span>DUE DATE</span>
                                <span>
                                  {new Date(data.invoice.dueDate)
                                    .toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "2-digit",
                                      year: "numeric",
                                    })
                                    .toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-8 text-center">
                          <p className="font-bold text-purple-700 text-lg">
                            THANK YOU FOR CHOOSING BOOKIE BUDDY!
                          </p>
                          <p className="text-gray-600">
                            We appreciate your trust and support.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="px-8 py-6 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border rounded hover:bg-gray-100"
          >
            Back to Edit
          </button>
          <button
            onClick={onDownload}
            className="px-8 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;