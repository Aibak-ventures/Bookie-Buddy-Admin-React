import React from "react";

const InvoicePreview = ({ data, onClose, onDownload }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[900px] rounded-xl shadow-2xl flex flex-col max-h-[95vh]">

        {/* HEADER */}
        <div className="relative bg-purple-700 text-white px-8 py-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">bookie</span>
              <span className="text-2xl font-bold">buddy</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-wider">INVOICE</h1>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-8 overflow-y-auto flex-1">
          <div id="invoice-content">

            {/* FROM / TO */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <p className="text-xs font-bold text-gray-700 mb-1">FROM</p>
                <p className="text-sm font-semibold">{data.from.orgName}</p>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {data.from.address}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs font-bold text-gray-700 mb-1">TO</p>
                <p className="text-sm font-semibold">{data.to.name}</p>
                <p className="text-sm text-gray-700">{data.to.place}</p>
                <p className="text-sm text-gray-700">{data.to.phone}</p>
              </div>
            </div>

            {/* INVOICE META STRIP */}
            <div className="border-2 border-purple-700 grid grid-cols-2 text-sm font-semibold mb-6">
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

            {/* ITEMS TABLE */}
            <table className="w-full mb-6 border-collapse">
              <thead>
                <tr className="bg-purple-700 text-white text-sm">
                  <th className="py-3 px-3 text-left">NO</th>
                  <th className="py-3 px-3 text-left">DESCRIPTION</th>
                  <th className="py-3 px-3 text-right">PRICE</th>
                  <th className="py-3 px-3 text-right">OFFER</th>
                  <th className="py-3 px-3 text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {data.items
                  .filter((i) => i.description.trim())
                  .map((item, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="py-3 px-3 text-sm">{idx + 1}</td>
                      <td className="py-3 px-3 text-sm">
                        {item.description}
                      </td>
                      <td className="py-3 px-3 text-sm text-right">
                        {typeof item.price === "number"
                          ? `₹ ${item.price.toLocaleString()}`
                          : item.price}
                      </td>
                      <td className="py-3 px-3 text-sm text-right">
                        {item.offer}%
                      </td>
                      <td className="py-3 px-3 text-sm text-right font-medium">
                        ₹ {Number(item.total).toLocaleString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* FREE HIGHLIGHT */}
            <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded mb-6 text-sm font-semibold">
              👑 1 Year of Premium Features — Absolutely Free
            </div>

            {/* TOTALS */}
            <div className="flex justify-end mb-8">
              <div className="w-80 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">SUB-TOTAL</span>
                  <span className="font-bold">
                    ₹ {data.subTotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-3 bg-purple-700 text-white px-4 py-3 font-bold text-base">
                  <span>PAID TOTAL</span>
                  <span>
                    ₹ {Number(data.invoice.paidTotal).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* TERMS */}
            {data.terms.length > 0 && (
              <div className="border-t pt-4">
                <p className="text-sm font-bold mb-2">
                  TERMS AND CONDITIONS
                </p>
                <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                  {data.terms
                    .filter((t) => t.trim())
                    .map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                </ul>
              </div>
            )}

            {/* FOOTER */}
            <div className="mt-10 text-center">
              <p className="font-bold text-purple-700 text-lg">
                THANK YOU FOR CHOOSING BOOKIE BUDDY!
              </p>
              <p className="text-sm text-gray-600">
                We appreciate your trust and look forward to supporting your
                business.
              </p>
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
