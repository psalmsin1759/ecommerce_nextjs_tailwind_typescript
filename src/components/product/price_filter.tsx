import React from 'react';

function PriceFilter() {
  return (
    <div className="flex flex-col w-full mt-4 border-gray-200 ">
      <div className=" text-black bg-gray-100 pl-6 pr-6 pt-2 pb-2 border-gray-200  border">
        <span>Price</span>
      </div>
      <div className="pl-6 pr-6 pt-4 pb-4 border-gray-200 border flex flex-col">
        <div>
          <div className="flex flex-row gap-4 items-center">
            <input type="radio" name="price" value="all" />
            <label>All</label>
          </div>
          <div className="flex flex-row gap-4 items-center mt-2">
            <input type="radio" name="price" value="all" />
            <label>$0 - 50</label>
          </div>
          <div className="flex flex-row gap-4 items-center mt-2">
            <input type="radio" name="price" value="all" />
            <label>$50 - 100</label>
          </div>
          <div className="flex flex-row gap-4 items-center mt-2">
            <input type="radio" name="price" value="all" />
            <label>$100 - 200</label>
          </div>
          <div className="flex flex-row gap-4 items-center mt-2">
            <input type="radio" name="price" value="all" />
            <label>$200 - 500</label>
          </div>
          <div className="flex flex-row gap-4 items-center mt-2">
            <input type="radio" name="price" value="all" />
            <label>$1000 - 5000</label>
          </div>
          <div className="flex flex-row gap-4 items-center mt-2">
            <input type="radio" name="price" value="all" />
            <label>$5000 - 10000</label>
          </div>

          <div className="flex flex-row gap-4 items-center mt-2">
            <input type="radio" name="price" value="all" />
            <label>Over $10000</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PriceFilter;
