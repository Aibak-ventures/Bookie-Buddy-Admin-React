import React from "react";
import invoiceBg from "../../assets/invoice-bg.svg";

const InvoicePreview = ({ data, onClose, onDownload }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[900px] rounded-xl shadow-2xl flex flex-col max-h-[95vh]">

        {/* PREVIEW AREA */}
        <div className="overflow-y-auto flex-1 p-6">
          <div id="invoice-content">

            <div
              className="invoice-page"
              style={{
                width: "210mm",
                height: "297mm",
                position: "relative",
                backgroundColor: "white",
              }}
            >
              {/* SVG BACKGROUND */}
              <img
                src={invoiceBg}
                alt="Invoice Background"
                className="absolute top-0 left-0 w-full h-full object-cover z-0 pointer-events-none"
              />

              {/* CONTENT */}
              <div
                className="relative z-10 mx-auto text-sm text-gray-900"
                style={{
                  maxWidth: "190mm",
                  paddingTop: "120px", // ✅ FIX 1: push content below SVG logo
                }}
              >
                {/* HEADER */}
                <div className="flex justify-between mb-10">
                  <div />
                  <h1
                    style={{
                      fontSize: "34px",
                      fontWeight: 700, // ✅ FIX 2: reduced boldness
                      letterSpacing: "0.5px",
                    }}
                  >
                    INVOICE
                  </h1>
                </div>

                {/* FROM / TO */}
                <div className="grid grid-cols-2 gap-12 mb-8">
                  <div>
                    <p className="text-lg  mb-1" style={{ fontWeight: 600, }}>FROM</p>
                    <p
                      className="whitespace-pre-line"
                      style={{
                        fontSize: "13px",                 // ✅ smaller address text
                        fontFamily: "revert-layer",   // ✅ font family
                        lineHeight: "1.5",
                      }}
                    >
                      {data.from.address}
                    </p>
                    <p>{data.from.phone}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg mb-1" style={{ fontWeight: 600, }}>TO</p>
                    <p className="font-semibold">{data.to.name}</p>
                    <p className="font-semibold">{data.to.place}</p>
                    <p className="font-semibold">{data.to.phone}</p>
                  </div>
                </div>

                {/* META */}
                <div
                  className="grid grid-cols-2 mb-6"
                  style={{
                    border: "3px solid #2f2f2f",
                    fontWeight: 600,
                  }}
                >
                  <div className="px-4 py-2" style={{ fontWeight: 700, }}>
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

                {/* ITEMS TABLE */}
                <table className="w-full mb-6 border-collapse">
                  <thead>
                    <tr
                      style={{
                        backgroundColor: "#6B4C7A",
                        color: "white",
                      }}
                    >
                      <th className="py-2 px-3 text-left">NO</th>
                      <th className="py-2 px-3 text-left">DESCRIPTION</th>
                      <th className="py-2 px-3 text-right">PRICE</th>
                      <th className="py-2 px-3 text-right">OFFER</th>
                      <th className="py-2 px-3 text-right">TOTAL</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.items.map((item, idx) => (
                      <tr
                        key={idx}
                        style={{
                          backgroundColor: "#F2F6FF", 
                         fontFamily: "revert-layer",   // ✅ font family
                        // ✅ FIX 3: full blue rows
                        }}
                      >
                        <td className="py-2 px-3" style={{ fontFamily: "revert-layer",  }}>{idx + 1}</td>
                          <td className="py-2 px-3" style={{ fontFamily: "revert", fontWeight :500 }}>{item.description}</td>
                        <td className="py-2 px-3 text-right" style={{ fontFamily: "revert", fontWeight :500 }}>
                          {item.price > 0
                            ? `₹ ${item.price.toLocaleString()}`
                            : item.description.includes("LIFE")
                              ? "LIFE TIME FREE"
                              : item.description.includes("YEAR")
                                ? "1ST YEAR FREE"
                                : "₹ 0"}
                        </td>
                        <td className="py-2 px-3 text-right" style={{ fontFamily: "revert", fontWeight :500 }}>
                          {item.offer}%
                        </td>
                        <td className="py-2 px-3 text-right" style={{ fontFamily: "revert", fontWeight :500 }}>
                          ₹ {item.total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* SUMMARY SECTION */}
                <div className="grid grid-cols-2 gap-8 mt-6">
                  {/* LEFT */}
                  <div>
                    <div className="bg-yellow-50 px-3 py-3 text-sm  text-yellow-700">
                      👑 1 Year of Premium Features — Absolutely Free
                    </div>

                    {data.balance > 0 && data.invoice.dueDate && (
                      <p className="text-red-600 mt-4">
                        The balance amount is kindly requested to be paid
                        <br />
                        on or before{" "}
                        <strong>
                          {new Date(data.invoice.dueDate)
                            .toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                            })}
                          .
                        </strong>
                      </p>
                    )}
                  </div>

                  {/* RIGHT */}
                  <div>
                    <div className="flex justify-between py-2 border-b">
                      <span style={{ fontFamily: "revert", fontWeight :500 }}>SUB-TOTAL</span>
                      <span className="font-bold">
                        ₹ {data.subTotal.toLocaleString()}
                      </span>
                    </div>

                    <div
                      className="flex justify-between items-center mt-3 px-4 py-2 text-white font-bold"
                      style={{ backgroundColor: "#6B4C7A" }}
                    >
                      <span style={{ fontFamily: "revert", fontWeight :500 }}>PAID TOTAL</span>
                      <span style={{ fontFamily: "revert", fontWeight :500 }}>
                        ₹ {data.invoice.paidTotal.toLocaleString()}
                      </span>
                    </div>

                    {data.balance > 0 && (
                      <div className="flex justify-between mt-3">
                        <span style={{ fontFamily: "revert", fontWeight :500 }}>BALANCE AMOUNT</span>
                        <span style={{ fontFamily: "revert", fontWeight :500 }}>
                          ₹ {data.balance.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* TERMS */}
                <div className="mt-10">
                  <p className="font-bold mb-3">
                    TERMS AND CONDITIONS
                  </p>
                  <ul className="list-disc ml-5 space-y-1 font-semibold">
                    {data.terms.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>

                {/* THANK YOU — LEFT */}
                <div className="mt-12">
                  <p className="font-bold text-purple-700 text-lg">
                    THANK YOU FOR CHOOSING BOOKIE BUDDY!
                  </p>
                  <p className="text-gray-600">
                    We appreciate your trust and look forward to supporting your business.
                  </p>
                </div>
              </div>
            </div>
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
