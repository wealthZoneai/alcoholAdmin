import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  X,
  UploadCloud,
  Trash2,
  Star,
  DollarSign,
  Percent,
  Box,
  FileText,
  Package,
  Bookmark,
  Warehouse,
} from "lucide-react";
import * as XLSX from "xlsx";
import InputGroup from "./InputGroup";
import InputMini from "./InputMini";

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => void;
  onBulkSubmit: (payload: any) => void;
  initialData?: any;
}

const defaultData = {
  subCategoryId: "",
  name: "",
  price: "",
  discount: "",
  stock: "",
  rating: "",
  description: "",
  isFavorite: false,
  file: null as File | null,
  preview: "",
  imageUrl: "",
  quantity: "",
  minValue: "",
  maxValue: "",
  // stepValue: "",
  unitType: "",
};

export default function CreateItemModal({
  isOpen,
  onClose,
  onSubmit,
  onBulkSubmit,
  initialData,
}: CreateItemModalProps) {
  const [form, setForm] = useState<typeof defaultData>(defaultData);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Bulk Upload States
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [excelFileName, setExcelFileName] = useState("");
  const [excelPreview, setExcelPreview] = useState<any[]>([]);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);


  useEffect(() => {
    if (isOpen) {
      setForm(initialData ? { ...defaultData, ...initialData } : defaultData);
      // Reset bulk preview/name when opening or switching tabs
      setExcelPreview([]);
      setExcelFileName("");
    }
  }, [isOpen, initialData]);

  // Normal Inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setForm((p) => ({ ...p, [name]: (e.target as HTMLInputElement).checked }));
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  // Image Upload
  const handleFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Please upload an image!");

    const reader = new FileReader();
    reader.onload = () => {
      setForm((p) => ({ ...p, file, preview: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();

    setForm((p) => ({ ...p, file: null, preview: "", imageUrl: "" }));
    if (fileRef.current) fileRef.current.value = "";
  };

  // Excel Upload
  const handleExcelUpload = (file?: File) => {
    if (!file) return;
    setExcelFile(file);
    setExcelFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target?.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);
      setExcelPreview(rows);
    };
    reader.readAsBinaryString(file);
  };



  // Submit Bulk
  const handleBulkSubmit = () => {
    if (!excelFile) {
      alert("Please upload an Excel file!");
      return;
    }

    if (!zipFile) {
      alert("Please upload a ZIP file!");
      return;
    }

    onBulkSubmit({
      excelFile,
      zipFile,
    });

    onClose();
  };

  // Submit Single Item
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Name is required");
    if (!form.price || Number(form.price) <= 0)
      return alert("Price must be greater than 0");

    onSubmit(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80">
      {/* Backdrop */}
      <motion.div
        onClick={onClose}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-800">
          <h2 className="text-xl font-bold text-zinc-800 dark:text-white">
            {activeTab === "single"
              ? initialData
                ? "Update Product Details"
                : "Create New Product Item"
              : "Import Multiple Items"}
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body with Tabs INSIDE */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* Internal Tab Switcher */}
          <div className="flex justify-center mb-6 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg max-w-md mx-auto">
            <button
              onClick={() => setActiveTab("single")}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${activeTab === "single"
                ? "bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow"
                : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
            >
              <Bookmark size={16} className="inline mr-2 align-text-bottom" />
              Single Entry
            </button>

            <button
              onClick={() => setActiveTab("bulk")}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${activeTab === "bulk"
                ? "bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow"
                : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
            >
              <FileText size={16} className="inline mr-2 align-text-bottom" />
              Bulk Upload
            </button>
          </div>

          {/* CONTENT AREA */}

          {/* SINGLE ITEM MODE */}
          {activeTab === "single" && (
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* LEFT SIDE: IMAGE UPLOAD & FAVORITE */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {/* IMAGE UPLOAD BOX */}
                <div
                  className={`relative w-full aspect-[4/5] border-2 ${isDragging
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                    : "border-dashed border-zinc-300 dark:border-700"
                    } rounded-lg overflow-hidden transition-all duration-200 bg-zinc-50 dark:bg-zinc-900/50`}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />

                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                    className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer p-4"
                  >
                    {form.preview || form.imageUrl ? (
                      <>
                        <img
                          src={form.preview || form.imageUrl}
                          alt="Product Preview"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-lg z-10 text-red-600 hover:bg-white transition"
                          title="Remove Image"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    ) : (
                      <div className="text-center text-zinc-500 dark:text-zinc-400">
                        <UploadCloud
                          size={40}
                          className="mx-auto text-indigo-600"
                        />
                        <p className="font-medium mt-3 text-zinc-700 dark:text-zinc-200">
                          Click or Drop Image
                        </p>
                        <p className="text-xs mt-1">PNG, JPG, up to 5MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Favorite Toggle (Pill Switch) */}
                <div
                  onClick={() =>
                    setForm((p) => ({ ...p, isFavorite: !p.isFavorite }))
                  }
                  className={`flex justify-between items-center p-3 border rounded-lg shadow-sm cursor-pointer transition-all duration-200 ${form.isFavorite
                    ? "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-400"
                    : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Star
                      size={18}
                      fill={form.isFavorite ? "currentColor" : "none"}
                      className={
                        form.isFavorite
                          ? "text-yellow-500"
                          : "text-zinc-400 dark:text-zinc-500"
                      }
                    />
                    <span className="font-semibold text-sm text-zinc-800 dark:text-zinc-100">
                      Mark as Highlight
                    </span>
                  </div>

                  {/* Custom Toggle Switch */}
                  <div
                    className={`w-10 h-5 rounded-full relative p-0.5 transition-colors duration-300 ${form.isFavorite
                      ? "bg-yellow-500"
                      : "bg-zinc-300 dark:bg-zinc-600"
                      }`}
                  >
                    <motion.div
                      className="w-4 h-4 bg-white rounded-full shadow-sm"
                      layout
                      transition={{ type: "spring", stiffness: 700, damping: 30 }}
                      style={{
                        x: form.isFavorite ? "100%" : "0%",
                        marginLeft: form.isFavorite ? "-0.25rem" : "0.05rem",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: FORM INPUTS */}
              {/* RIGHT SIDE: FORM INPUTS */}
              <div className="lg:col-span-8 space-y-6">

                {/* NAME */}
                <InputGroup label="Product Name" icon={<Package size={16} />}>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Premium Cola 1L (Required)"
                    required
                    className="bg-transparent outline-none w-full text-zinc-900 dark:text-white font-medium"
                  />
                </InputGroup>

                {/* PRICE + DISCOUNT + RATING + QUANTITY */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <InputMini
                    label="Price"
                    name="price"
                    type="number"
                    icon={<DollarSign size={14} />}
                    value={form.price}
                    onChange={handleChange}
                    placeholder="100.00"
                    step="0.01"
                  />

                  <InputMini
                    label="Discount (%)"
                    name="discount"
                    type="number"
                    icon={<Percent size={14} />}
                    value={form.discount}
                    onChange={handleChange}
                    placeholder="10"
                    step="1"
                  />
                  <InputMini
                    label="Stock Quantity"
                    name="stock"
                    type="number"
                    icon={<Warehouse size={14} />}
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="10"
                    step="1"
                  />

                </div>
                {/* UNIT TYPE DROPDOWN */}
                <div>
                  <label className="text-sm font-semibold mb-2 block text-zinc-700 dark:text-zinc-300">
                    Unit Type
                  </label>

                  <select
                    name="unitType"
                    value={form.unitType}
                    onChange={handleChange}
                    className="w-full p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">Select Unit Type</option>
                    <option value="KILOGRAM">Kilogram</option>
                    <option value="GRAM">Gram</option>
                    <option value="LITRE">Liter</option>
                    <option value="MILLILITRE">Milliliter</option>
                    <option value="PIECE">Piece</option>
                    <option value="BOTTLE">Bottle</option>
                    <option value="PACK">Packet</option>
                    <option value="BOX">Box</option>
                  </select>
                </div>

                {/* MIN, MAX, STEP VALUES */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <InputMini
                    label="Min Value"
                    name="minValue"
                    type="number"
                    value={form.minValue}
                    onChange={handleChange}
                    placeholder="0.5"
                    step="0.1"
                  />

                  <InputMini
                    label="Max Value"
                    name="maxValue"
                    type="number"
                    value={form.maxValue}
                    onChange={handleChange}
                    placeholder="25"
                    step="0.1"
                  />

                  {/* <InputMini
                    label="Step Value"
                    name="stepValue"
                    type="number"
                    value={form.stepValue}
                    onChange={handleChange}
                    placeholder="0.5"
                    step="0.1"
                  /> */}
                </div>



                {/* DESCRIPTION */}
                <div>
                  <label className="text-sm font-semibold mb-2 block text-zinc-700 dark:text-zinc-300">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Write a comprehensive description for the item..."
                    className="w-full p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

            </form>
          )}

          {/* BULK UPLOAD MODE */}
          {activeTab === "bulk" && (
            <div className="space-y-6">
              {/* Upload Box */}
              <div
                className="border-2 border-dashed border-indigo-400 dark:border-indigo-600 rounded-xl p-8 text-center cursor-pointer bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors duration-200"
                onClick={() => document.getElementById("excelInput")?.click()}
              >
                <input
                  id="excelInput"
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={(e) => handleExcelUpload(e.target.files?.[0])}
                />

                <UploadCloud
                  size={50}
                  className="mx-auto text-indigo-600 dark:text-indigo-400"
                />
                <p className="font-bold text-lg mt-3 text-zinc-800 dark:text-white">
                  Drop your Excel file here
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Accepted: .xlsx, .xls • Required columns: **Name, Price, Quantity, Category**
                </p>

                {excelFileName && (
                  <div className="flex items-center justify-center mt-3 p-2 bg-white dark:bg-zinc-800 border border-green-300 rounded-lg max-w-sm mx-auto shadow-sm">
                    <FileText size={16} className="text-green-600 mr-2" />
                    <p className="text-green-600 dark:text-green-400 font-medium text-sm truncate">
                      {excelFileName}
                    </p>
                  </div>
                )}
              </div>
              {/* ZIP Upload Box */}
              <div
                className="border-2 border-dashed border-purple-400 rounded-xl p-6 text-center cursor-pointer bg-purple-50 hover:bg-purple-100"
                onClick={() => document.getElementById("zipInput")?.click()}
              >
                <input
                  id="zipInput"
                  type="file"
                  accept=".zip"
                  className="hidden"
                  onChange={(e) => setZipFile(e.target.files?.[0] || null)}
                />

                <UploadCloud size={40} className="mx-auto text-purple-600" />
                <p className="font-bold mt-2">Upload ZIP of Images</p>

                {zipFile && (
                  <p className="mt-2 text-purple-600 font-medium">{zipFile.name}</p>
                )}
              </div>
              {/* Preview */}
              {excelPreview.length > 0 && (
                <div className="mt-4 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-md">
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-t-lg">
                    <h3 className="font-bold text-base text-zinc-800 dark:text-white">
                      Preview Items ({excelPreview.length})
                    </h3>
                  </div>

                  <div className="overflow-auto max-h-60">
                    <table className="w-full text-sm">
                      <thead className="bg-zinc-100 dark:bg-zinc-800 sticky top-0 border-b dark:border-zinc-700">
                        <tr>
                          <th className="p-3 text-left font-semibold text-zinc-600 dark:text-zinc-300">
                            #
                          </th>
                          <th className="p-3 text-left font-semibold text-zinc-600 dark:text-zinc-300">
                            Name
                          </th>
                          <th className="p-3 text-left font-semibold text-zinc-600 dark:text-zinc-300">
                            Price
                          </th>
                          <th className="p-3 text-left font-semibold text-zinc-600 dark:text-zinc-300">
                            Quantity
                          </th>
                          <th className="p-3 text-left font-semibold text-zinc-600 dark:text-zinc-300">
                            Category
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {excelPreview.map((row, i) => (
                          <tr
                            key={i}
                            className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                          >
                            <td className="p-3 text-zinc-500 dark:text-zinc-400 w-10">
                              {i + 1}
                            </td>
                            <td className="p-3 font-medium text-zinc-900 dark:text-zinc-100">
                              {row.Name || "-"}
                            </td>
                            <td className="p-3 text-zinc-700 dark:text-zinc-300">
                              ${row.Price || 0}
                            </td>
                            <td className="p-3 text-zinc-700 dark:text-zinc-300">
                              {row.Quantity || "-"}
                            </td>
                            <td className="p-3 text-zinc-700 dark:text-zinc-300">
                              {row.Category || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER - Action Buttons */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-700 flex justify-end gap-3 bg-zinc-50 dark:bg-zinc-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition font-medium text-sm"
          >
            Cancel
          </button>

          {activeTab === "single" ? (
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-md shadow-indigo-500/30 text-sm"
            >
              {initialData ? "Save Changes" : "Create Item"}
              <Box size={16} className="inline ml-2 align-text-bottom" />
            </button>
          ) : (
            <button
              onClick={handleBulkSubmit}
              className="px-6 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow-md shadow-green-500/30 disabled:opacity-50 text-sm"
              disabled={excelPreview.length === 0}
            >
              Upload All Items ({excelPreview.length})
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}