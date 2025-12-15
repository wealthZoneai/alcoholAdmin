import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, UploadCloud, Trash2, Star, DollarSign, Percent, Box, FileText, Package, Bookmark, Warehouse, Loader2, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import { getMainCategories, getCategorySubcategories, createItem, uploadBulkItems } from "../../../services/apiHelpers";
import InputGroup from "../../../components/InputGroup";
import InputMini from "../../../components/InputMini";

const defaultData = {
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
    unitType: "",
};

const AdminAddItem = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");

    // Category State
    const [mainCategories, setMainCategories] = useState<any[]>([]);
    const [subCategories, setSubCategories] = useState<any[]>([]);
    const [selectedMainCat, setSelectedMainCat] = useState("");
    const [selectedSubCat, setSelectedSubCat] = useState("");

    // Form State
    const [form, setForm] = useState(defaultData);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileRef = useRef<HTMLInputElement | null>(null);

    // Bulk Upload State
    const [excelPreview, setExcelPreview] = useState<any[]>([]);
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [zipFile, setZipFile] = useState<File | null>(null);

    useEffect(() => {
        fetchMainCategories();
    }, []);

    useEffect(() => {
        if (selectedMainCat) {
            fetchSubCategories(selectedMainCat);
        } else {
            setSubCategories([]);
            setSelectedSubCat("");
        }
    }, [selectedMainCat]);

    const fetchMainCategories = async () => {
        try {
            const response = await getMainCategories();
            setMainCategories(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Failed to load categories");
        }
    };

    const fetchSubCategories = async (catId: string) => {
        try {
            const response = await getCategorySubcategories(catId);
            setSubCategories(Array.isArray(response.data) ? response.data : (response?.data?.subCategories || []));
        } catch (error) {
            console.error("Failed to load subcategories");
        }
    };

    // --- Form Handlers ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            setForm((p) => ({ ...p, [name]: (e.target as HTMLInputElement).checked }));
            return;
        }
        setForm((p) => ({ ...p, [name]: value }));
    };

    const handleFile = (file?: File) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) return toast.error("Please upload an image!");

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

    const handleExcelUpload = (file?: File) => {
        if (!file) return;
        setExcelFile(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            const workbook = XLSX.read(e.target?.result, { type: "binary" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet);
            setExcelPreview(rows);
        };
        reader.readAsBinaryString(file);
    };

    // --- Submissions ---
    const handleSubmitSingle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSubCat) return toast.error("Please select a Sub-Category");
        if (!form.name.trim()) return toast.error("Name is required");
        if (!form.price || Number(form.price) <= 0) return toast.error("Price must be greater than 0");

        setIsSubmitting(true);
        try {
            // Convert to appropriate types
            const payload = {
                ...form,
                stock: form.stock ? parseInt(form.stock.toString()) : 0,
                price: parseFloat(form.price.toString()),
                discount: form.discount ? parseFloat(form.discount.toString()) : 0,
                minValue: form.minValue ? parseFloat(form.minValue.toString()) : 1,
                maxValue: form.maxValue ? parseFloat(form.maxValue.toString()) : 1,
            }

            await createItem(selectedSubCat, payload);
            toast.success("Item created successfully!");
            if (window.confirm("Item created! Go to inventory?")) {
                navigate(`/admin/inventory?subCatId=${selectedSubCat}`);
            } else {
                setForm(defaultData);
            }
        } catch (error: any) {
            console.error("Error creating item:", error);
            toast.error(error?.response?.data?.message || "Failed to create item");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBulkSubmit = async () => {
        if (!selectedSubCat) return toast.error("Please select a Sub-Category");
        if (!excelFile) return toast.error("Please upload an Excel file!");
        if (!zipFile) return toast.error("Please upload a ZIP file!");

        setIsSubmitting(true);
        try {
            await uploadBulkItems(selectedSubCat, excelFile, zipFile);
            toast.success("Items uploaded successfully!");
            navigate(`/admin/inventory?subCatId=${selectedSubCat}`);
        } catch (error: any) {
            console.error("Error uploading items:", error);
            toast.error(error?.response?.data?.message || "Failed to upload items");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fc] pt-24 px-4 sm:px-8 pb-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-2 text-sm font-medium">
                        <ArrowLeft size={18} />
                        Back
                    </button>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Add New Item</h1>
                    <p className="text-gray-500 mt-1">Create a new product or upload in bulk.</p>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

                    {/* Category Selectors Pinned to Top */}
                    <div className="p-6 bg-gray-50 border-b border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Main Category</label>
                            <select
                                value={selectedMainCat}
                                onChange={(e) => setSelectedMainCat(e.target.value)}
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-gray-700"
                            >
                                <option value="">Select Main Category</option>
                                {mainCategories.map((cat: any) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Sub Category</label>
                            <select
                                value={selectedSubCat}
                                onChange={(e) => setSelectedSubCat(e.target.value)}
                                disabled={!selectedMainCat}
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
                            >
                                <option value="">Select Sub Category</option>
                                {subCategories.map((sub: any) => (
                                    <option key={sub.id} value={sub.id}>{sub.displayName || sub.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="px-6 pt-6">
                        <div className="flex p-1 bg-gray-100 rounded-xl mb-6 max-w-md">
                            <button
                                onClick={() => setActiveTab("single")}
                                className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "single"
                                    ? "bg-white text-emerald-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <Bookmark size={16} className="inline mr-2 -mt-0.5" />
                                Single Item
                            </button>
                            <button
                                onClick={() => setActiveTab("bulk")}
                                className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "bulk"
                                    ? "bg-white text-emerald-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <FileText size={16} className="inline mr-2 -mt-0.5" />
                                Bulk Upload
                            </button>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="px-6 pb-8">
                        {activeTab === "single" ? (
                            <form onSubmit={handleSubmitSingle} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Left: Image */}
                                <div className="lg:col-span-4 flex flex-col gap-6">
                                    <div
                                        className={`relative w-full aspect-[4/5] border-2 ${isDragging
                                            ? "border-emerald-500 bg-emerald-50"
                                            : "border-dashed border-gray-300"
                                            } rounded-xl overflow-hidden transition-all bg-gray-50`}
                                    >
                                        <input
                                            ref={fileRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleFile(e.target.files?.[0])}
                                        />
                                        <div
                                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                            onDragLeave={() => setIsDragging(false)}
                                            onDrop={handleDrop}
                                            onClick={() => fileRef.current?.click()}
                                            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer p-4 group"
                                        >
                                            {form.preview || form.imageUrl ? (
                                                <>
                                                    <img src={form.preview || form.imageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={removeImage}
                                                        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-red-500 hover:text-red-700 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="text-center text-gray-400 group-hover:text-emerald-600 transition-colors">
                                                    <UploadCloud size={40} className="mx-auto mb-3" />
                                                    <p className="font-bold text-gray-600 group-hover:text-emerald-700">Click or Drop Image</p>
                                                    <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Favorite Toggle */}
                                    <div
                                        onClick={() => setForm(p => ({ ...p, isFavorite: !p.isFavorite }))}
                                        className={`flex justify-between items-center p-4 border rounded-xl cursor-pointer transition-all ${form.isFavorite ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Star size={20} className={form.isFavorite ? "text-amber-500 fill-amber-500" : "text-gray-400"} />
                                            <span className={`font-bold ${form.isFavorite ? 'text-amber-700' : 'text-gray-600'}`}>Highlight Item</span>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full relative transition-colors ${form.isFavorite ? 'bg-amber-500' : 'bg-gray-300'}`}>
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${form.isFavorite ? 'left-7' : 'left-1'}`} />
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Inputs */}
                                <div className="lg:col-span-8 space-y-6">
                                    <InputGroup label="Product Name" icon={<Package size={16} />}>
                                        <input
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="e.g. Double Cheese Burger"
                                            required
                                            className="bg-transparent outline-none w-full text-gray-900 font-bold placeholder:font-normal"
                                        />
                                    </InputGroup>

                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        <InputMini label="Price" name="price" type="number" icon={<DollarSign size={14} />} value={form.price} onChange={handleChange} placeholder="0.00" step="0.01" />
                                        <InputMini label="Discount (%)" name="discount" type="number" icon={<Percent size={14} />} value={form.discount} onChange={handleChange} placeholder="0" step="1" />
                                        <InputMini label="Stock" name="stock" type="number" icon={<Warehouse size={14} />} value={form.stock} onChange={handleChange} placeholder="0" step="1" />

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Unit Type</label>
                                            <select
                                                name="unitType"
                                                value={form.unitType}
                                                onChange={handleChange}
                                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-medium text-gray-700"
                                            >
                                                <option value="">Select Unit</option>
                                                <option value="PCS">Pieces</option>
                                                <option value="KG">Kilogram</option>
                                                <option value="GM">Gram</option>
                                                <option value="LTR">Liter</option>
                                                <option value="ML">Milliliter</option>
                                                <option value="PACK">Pack</option>
                                                <option value="BOX">Box</option>
                                            </select>
                                        </div>
                                    </div>



                                    <div className="grid grid-cols-2 gap-4">
                                        <InputMini label="Min Value" name="minValue" type="number" value={form.minValue} onChange={handleChange} placeholder="1" />
                                        <InputMini label="Max Value" name="maxValue" type="number" value={form.maxValue} onChange={handleChange} placeholder="10" />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                                        <textarea
                                            name="description"
                                            value={form.description}
                                            onChange={handleChange}
                                            rows={4}
                                            placeholder="Detailed description of the item..."
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none text-gray-700"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !selectedSubCat}
                                        className="w-full py-4 rounded-xl bg-gray-900 text-white font-bold text-lg shadow-lg hover:bg-black hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <Check />}
                                        {isSubmitting ? "Creating..." : "Create Item"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Excel Drop */}
                                    <div
                                        onClick={() => document.getElementById("excelInput")?.click()}
                                        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${excelFile ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'}`}
                                    >
                                        <input id="excelInput" type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => handleExcelUpload(e.target.files?.[0])} />
                                        <FileText size={48} className={`mx-auto mb-4 ${excelFile ? 'text-emerald-600' : 'text-gray-400'}`} />
                                        <p className="font-bold text-gray-800">{excelFile ? excelFile.name : "Upload Excel File"}</p>
                                        <p className="text-sm text-gray-400 mt-2">.xlsx or .xls</p>
                                    </div>

                                    {/* Zip Drop */}
                                    <div
                                        onClick={() => document.getElementById("zipInput")?.click()}
                                        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${zipFile ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'}`}
                                    >
                                        <input id="zipInput" type="file" accept=".zip" className="hidden" onChange={(e) => setZipFile(e.target.files?.[0] || null)} />
                                        <Box size={48} className={`mx-auto mb-4 ${zipFile ? 'text-purple-600' : 'text-gray-400'}`} />
                                        <p className="font-bold text-gray-800">{zipFile ? zipFile.name : "Upload Images ZIP"}</p>
                                        <p className="text-sm text-gray-400 mt-2">.zip containing images</p>
                                    </div>
                                </div>

                                {excelPreview.length > 0 && (
                                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                            <h3 className="font-bold text-gray-700">Preview ({excelPreview.length} items)</h3>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="text-gray-500 font-bold bg-white sticky top-0">
                                                    <tr>
                                                        <th className="p-3">Name</th>
                                                        <th className="p-3">Price</th>
                                                        <th className="p-3">Category</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {excelPreview.map((row, i) => (
                                                        <tr key={i} className="hover:bg-gray-50">
                                                            <td className="p-3 font-medium text-gray-900">{row.Name || row.name}</td>
                                                            <td className="p-3 text-gray-600">{row.Price || row.price}</td>
                                                            <td className="p-3 text-gray-600">{row.Category || row.category}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleBulkSubmit}
                                    disabled={isSubmitting || !excelFile || !zipFile || !selectedSubCat}
                                    className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-lg hover:bg-emerald-700 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : <UploadCloud />}
                                    {isSubmitting ? "Uploading..." : `Upload ${excelPreview.length} Items`}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAddItem;
