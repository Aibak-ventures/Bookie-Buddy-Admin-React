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
                      fontSize: "40px",
                      fontWeight: 700, // ✅ FIX 2: reduced boldness
                      letterSpacing: "0.5px",
                    }}
                  >
                    INVOICE
                  </h1>
                </div>

                {/* FROM / TO */}
                <div className="grid grid-cols-2 gap-12 mb-4">
                  <div>
                    <p className="text-lg  mb-1" style={{ fontWeight: 700, }}>FROM</p>
                    <p
                      className="whitespace-pre-line"
                      style={{
                        fontSize: "13px",                 // ✅ smaller address text
                        fontFamily: "revert-layer",   // ✅ font family
                        lineHeight: "1.5",
                        color: "#6B4C7A",
                        fontWeight: 500,
                      }}
                    >
                      {data.from.address}
                    </p>
                    <p>{data.from.phone}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg mb-1" style={{ fontWeight: 700, }}>TO</p>
                    <p className="font-bold text-large text-"  style={{ fontFamily: "sans-serif",fontWeight: 700,fontSize: "13px",}}>{data.to.name}</p>
                    <p className="font-semibold"  style={{ fontFamily: "sans-serif",fontWeight: 700,fontSize: "13px",}}>{data.to.place}</p>
                    <p className="font-semibold"  style={{ fontFamily: "sans-serif",fontWeight: 700,fontSize: "13px",}}>{data.to.phone}</p>
                  </div>
                </div>

                {/* META */}
                <div
                  className="grid grid-cols-2 mb-3"
                  style={{
                    border: "3px solid #2f2f2f",
                    fontWeight: 600,
                  }}
                >
                  <div className="px-4 py-2 font-bold" style={{ letterSpacing: "0.01em",fontSize: "16px",}}>
                    INVOICE DATE :{" "}
                    {new Date(data.invoice.invoiceDate)
                      .toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })
                      .toUpperCase()}
                  </div>
                  <div className="px-7 py-2 text-right font-bold" style={{ letterSpacing: "0.01em",fontSize: "16px",}} >
                    INVOICE ID : {data.invoice.invoiceNo}
                  </div>
                </div>

                {/* ITEMS TABLE */}
                <table className="w-full  border-collapse" style={{
                    borderCollapse: "separate",
                    borderSpacing: "0 6px", // 👈 vertical row gap
                  }}>
                  <thead>
                    <tr
                      style={{
                        backgroundColor: "#6B4C7A",
                        color: "white",
                      }}
                    >
                      <th className="py-2 px-3 text-left">NO</th>
                      <th className="py-2 px-3 text-left">DESCRIPTION</th>
                      <th className="py-2 px-3 text-center">PRICE</th>
                      <th className="py-2 px-3 text-center">OFFER</th>
                      <th className="py-2 px-3 text-center">TOTAL</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.items.map((item, idx) => (
                      <tr
                        key={idx}
                        style={{
                          backgroundColor: "#F2F6FF", 
                         fontFamily: "revert-layer",   // ✅ font family
                         fontSize: "13px",
                        // ✅ FIX 3: full blue rows
                        }}
                      >
                        <td className="py-2 px-3 font-bold" style={{ fontFamily: "revert-layer",  }}>{idx + 1}</td>
                          <td className="py-2 px-3 font-bold" style={{ fontFamily: "revert", }}>{item.description}</td>
                          <td
                              className="py-2 px-3 text-center font-bold"
                              style={{
                                fontFamily: "revert",
                                whiteSpace: "nowrap", // 👈 prevents wrapping
                              }}
                            >
                              {item.priceLabel
                                ? item.priceLabel
                                : item.price > 0
                                  ? `₹ ${item.price.toLocaleString()}`
                                  : "₹ 0"}
                            </td>
                        <td className="py-2 px-3 text-center font-bold" style={{ fontFamily: "revert",  }}>
                          {item.offer}%
                        </td>
                        <td className="py-2 px-3 text-center font-bold" style={{ fontFamily: "revert", }}>
                          {item.total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* SUMMARY SECTION */}
                <div
                    className="grid gap-6 mt-4"
                    style={{ gridTemplateColumns: "2fr 1fr" }}
                  >
                  {/* LEFT */}
                  <div>
                    <div className="bg-yellow-100  px-3 py-3 text-bold text-center text-yellow-500">
                    <span style={{ fontWeight: 700 }}>
                        👑 1 Year of Premium Features — Absolutely Free
                      </span>
                    </div>

                    {data.balance > 0 && data.invoice.dueDate && (
                      <p className="text-red-600 mt-4 font-semibold" >
                        The balance amount is kindly requested to be paid
                        <br />
                        on or before{" "}
                          {new Date(data.invoice.dueDate)
                            .toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                            })}
                          .
                      </p>
                    )}
                  </div>

                  {/* RIGHT */}
                  <div>
                    <div className="flex justify-between p-3 border-b " 
                           style={{
                          backgroundColor: "#F2F6FF", 
                         fontFamily: "revert-layer",   // ✅ font family
                         fontSize: "13px",
                        // ✅ FIX 3: full blue rows
                        }}>
                      <span className="font-bold">SUB-TOTAL</span>
                      <span className="font-bold" >
                        ₹ {data.subTotal.toLocaleString()}
                      </span>
                    </div>

                    <div
                      className="flex justify-between items-center mt-3 px-4 py-2 text-white font-bold"
                      style={{ backgroundColor: "#6B4C7A" }}
                    >
                      <span style={{ fontFamily: "revert", fontWeight :500 ,fontSize :"16px"}}>PAID TOTAL</span>
                      <span style={{ fontFamily: "revert", fontWeight :500 }}>
                        ₹ {data.invoice.paidTotal.toLocaleString()}
                      </span>
                    </div>

                    {data.balance > 0 && (
                      <div className="flex justify-between mt-3 p-3">
                        <span  style={{
                         fontFamily: "revert-layer",   // ✅ font family
                         fontSize: "13px",
                         fontWeight: 700,
                        // ✅ FIX 3: full blue rows
                        }}>BALANCE AMOUNT</span>
                        <span  style={{
                         fontFamily: "revert-layer",   // ✅ font family
                         fontSize: "13px",
                         fontWeight: 700,

                        // ✅ FIX 3: full blue rows
                        }}>
                          ₹ {data.balance.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* TERMS */}
                <div className="mt-7">
                  <p className=" mb-2" style={{
                         fontFamily: "revert-layer",   // ✅ font family
                         fontSize: "16px",
                         fontWeight: 700,
                        // ✅ FIX 3: full blue rows
                        }}>
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
                  <p className="font-bold text-purple-700 text-xl">
                    THANK YOU FOR CHOOSING BOOKIE BUDDY!
                  </p>
                  <p className="text-black" style={{fontSize:"13px",fontWeight: 500,}}>
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
