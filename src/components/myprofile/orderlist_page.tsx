import React from 'react';

function OrderListPage() {
  return (
    <div className="p-2 flex flex-col gap-2">
      <span className="text-xl font-semibold">Order List</span>
      <div className="flex border-2 mt-2">
        <div className="flex flex-grow p-4 justify-center border-x-2">
          Order ID
        </div>
        <div className="flex flex-grow  p-4 justify-center border-x-2">
          Date Purchased
        </div>
        <div className="flex flex-grow  p-4 justify-center border-x-2">
          Status
        </div>
        <div className="flex flex-grow  p-4 justify-center border-x-2">
          Total
        </div>
      </div>
    </div>
  );
}

export default OrderListPage;
