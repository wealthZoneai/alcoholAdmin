// src/components/ItemInventory.tsx
import React, { useState } from "react";

interface ItemType {
  id: string;
  name: string;
  image: string;
  active: boolean;
}

const dummyItems: ItemType[] = [
  {
    id: "1",
    name: "Item One",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXtsfdC3NSh5rttSkyZ_wbceC64jIONT6now&s",
    active: true,
  },
  {
    id: "2",
    name: "Item Two",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXtsfdC3NSh5rttSkyZ_wbceC64jIONT6now&s",
    active: false,
  },
  {
    id: "3",
    name: "Item Three",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXtsfdC3NSh5rttSkyZ_wbceC64jIONT6now&s",
    active: true,
  },
  {
    id: "4",
    name: "Item Four",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXtsfdC3NSh5rttSkyZ_wbceC64jIONT6now&s",
    active: true,
  },
];

const ItemInventory: React.FC = () => {
  const [items, setItems] = useState<ItemType[]>(dummyItems);
  const [search, setSearch] = useState("");

  const activateItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, active: true } : item
      )
    );
  };

  const deactivateItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, active: false } : item
      )
    );
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fc] pt-20 px-4">
<div className="mb-8 bg-white shadow rounded-lg p-4  mx-auto">
  <h1 className="text-2xl font-bold text-gray-800">
    📦 Item Inventory
  </h1>
  <p className="text-sm text-gray-500">
    Search, activate or deactivate items
  </p>
</div>

      {/* Search */}
      <div className="mb-6 max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Items */}
      <div className="space-y-4">
        {filteredItems.length === 0 && (
          <p className="text-gray-500 text-center">No items found</p>
        )}

        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="
              bg-white rounded-lg shadow
              max-w-5xl mx-auto
              p-4
              flex flex-col sm:flex-row
              sm:items-center
              gap-4
            "
          >
            {/* Image */}
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-16 rounded-lg object-cover"
            />

            {/* Name + Status */}
<div className="flex-1 flex justify-around items-center">
  <h2 className="text-lg font-semibold">{item.name}</h2>
  <span
    className={`text-sm font-medium ${
      item.active ? "text-green-600" : "text-red-600"
    }`}
  >
    {item.active ? "Active" : "Inactive"}
  </span>
</div>


            {/* Actions */}
            <div className="flex gap-2">
              <button
                disabled={item.active}
                onClick={() => activateItem(item.id)}
                className={`px-4 py-2 rounded text-sm text-white
                  ${
                    item.active
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
              >
                Activate
              </button>

              <button
                disabled={!item.active}
                onClick={() => deactivateItem(item.id)}
                className={`px-4 py-2 rounded text-sm text-white
                  ${
                    !item.active
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
              >
                Deactivate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemInventory;
