"use client";
import React, { useEffect, useState } from "react";
import { useStorage } from "../../hooks/useLocalStorage";
import OrderCard from "@/components/OrderCard";
import { getData } from "@/api/api";

export default function ListOrder() {
  const [data, setData] = useState([]);
  const [user] = useStorage("user", null);
  const [loading, setLoading] = useState(true);

  const reloadData = () => {
    getData(`/orders/manage-orders/?userId=${user.userid}`)
      .then((data) => {
        setData(data || []);
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    setLoading(true);
    reloadData();
  }, []);

  return (
    <div className="list-order-container p-10">
      {loading ? (
        <div className="flex justify-center">123123</div>
      ) : data.length === 0 ? (
        <div className="flex justify-center">Không có đơn hàng nào</div>
      ) : (
        data.map((order, index) => (
          <div key={order.id || index} className="mt-4">
            <OrderCard order={order} />
          </div>
        ))
      )}
    </div>
  );
}
