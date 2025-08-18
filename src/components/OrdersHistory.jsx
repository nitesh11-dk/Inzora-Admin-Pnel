"use client";

import { useState } from "react";
import { FiRefreshCw, FiCheck } from "react-icons/fi";
import LoadingState from "@/components/LodingState";

export default function OrdersHistory({
  orders = [],
  loading = false,
  title = "Orders History",
  onRefresh,
}) {
  const [copiedItem, setCopiedItem] = useState(null);
  const [refreshingOrderId, setRefreshingOrderId] = useState(null);

  const handleCopyToClipboard = async (text, itemType, itemId) => {
    try {
      await navigator.clipboard.writeText(text ?? "");
      setCopiedItem(`${itemType}-${itemId}`);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (error) {
      // no-op
    }
  };

  const handleRefreshClick = async (order) => {
    if (!onRefresh) return;
    setRefreshingOrderId(order._id);
    try {
      await onRefresh(order.actualOrderIdFromApi, order._id);
    } finally {
      setRefreshingOrderId(null);
    }
  };

  if (loading) {
    return <LoadingState text="Loading Orders ..." />;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-700 text-lg">No orders found.</p>
        <p className="text-gray-500 text-sm mt-2">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-lg shadow ring-1 ring-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Order ID (API)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Platform Service</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Link</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Start Count</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Remains</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Created At</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Refresh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {orders.map((order) => {
                  const isCompleted = order.status?.toLowerCase() === "completed";
                  return (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <span
                            className="cursor-pointer hover:text-blue-600"
                            onClick={() => handleCopyToClipboard(order.actualOrderIdFromApi, "orderId", order._id)}
                          >
                            {order.actualOrderIdFromApi || "-"}
                          </span>
                          {copiedItem === `orderId-${order._id}` && (
                            <FiCheck className="text-green-500 text-sm" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{order.platformService || "-"}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {order.link ? (
                          <div className="flex items-center gap-2 max-w-xs">
                            <a
                              href={order.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline truncate"
                              onClick={() => handleCopyToClipboard(order.link, "link", order._id)}
                            >
                              {order.link}
                            </a>
                            {copiedItem === `link-${order._id}` && (
                              <FiCheck className="text-green-500 text-sm" />
                            )}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">₹{order.price}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{order.quantity}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{order.startCount || "-"}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm capitalize">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === "success"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {order.status || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{order.remains || "-"}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleRefreshClick(order)}
                          className={`text-indigo-600 hover:text-indigo-800 ${isCompleted ? "opacity-50 cursor-not-allowed" : ""}`}
                          title={isCompleted ? "Completed" : "Refresh Order Status"}
                          disabled={isCompleted}
                        >
                          <FiRefreshCw size={18} className={refreshingOrderId === order._id ? "animate-spin" : ""} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => {
          const isCompleted = order.status?.toLowerCase() === "completed";
          return (
            <div key={order._id} className="bg-white rounded-lg shadow-sm p-4 text-gray-800 ring-1 ring-gray-200 text-sm">
              <p className="mb-1">
                <span className="font-semibold">Order ID (API):</span>
                <div className="flex items-center gap-2">
                  <span
                    className="cursor-pointer hover:text-blue-600"
                    onClick={() => handleCopyToClipboard(order.actualOrderIdFromApi, "orderId", order._id)}
                  >
                    {order.actualOrderIdFromApi || "-"}
                  </span>
                  {copiedItem === `orderId-${order._id}` && <FiCheck className="text-green-500 text-sm" />}
                </div>
              </p>
              <p className="mb-1"><span className="font-semibold">Category:</span> {order.category || "-"}</p>
              <p className="mb-1"><span className="font-semibold">Platform:</span> {order.platform || "-"}</p>
              <p className="mb-1"><span className="font-semibold">Platform Service:</span> {order.platformService || "-"}</p>
              <p className="mb-1"><span className="font-semibold">Service:</span> {order.service || "-"}</p>
              <p className="mb-1">
                <span className="font-semibold">Link:</span>
                <div className="flex items-center gap-2">
                  {order.link ? (
                    <a
                      href={order.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline break-all"
                      onClick={() => handleCopyToClipboard(order.link, "link", order._id)}
                    >
                      {order.link}
                    </a>
                  ) : (
                    "-"
                  )}
                  {copiedItem === `link-${order._id}` && <FiCheck className="text-green-500 text-sm" />}
                </div>
              </p>
              <p className="mb-1"><span className="font-semibold">Price:</span> ₹{order.price}</p>
              <p className="mb-1"><span className="font-semibold">Quantity:</span> {order.quantity}</p>
              <p className="mb-1"><span className="font-semibold">Start Count:</span> {order.startCount || "-"}</p>
              <p className="mb-1"><span className="font-semibold">Status:</span> <span className="capitalize">{order.status}</span></p>
              <p className="mb-1"><span className="font-semibold">Remains:</span> {order.remains || "-"}</p>
              <p className="mb-2"><span className="font-semibold">Created At:</span> {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}</p>
              <button
                onClick={() => handleRefreshClick(order)}
                className={`text-indigo-600 hover:text-indigo-800 ${isCompleted ? "opacity-50 cursor-not-allowed" : ""}`}
                title={isCompleted ? "Completed" : "Refresh Order Status"}
                disabled={isCompleted}
              >
                <FiRefreshCw size={18} className={refreshingOrderId === order._id ? "animate-spin" : ""} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}


