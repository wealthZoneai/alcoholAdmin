function InputMini({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon,
}: any) {
  return (
    <div>
      <label className="text-xs text-zinc-500 block mb-1">{label}</label>

      <div className="relative border rounded-xl bg-white">
        <div className="absolute top-1/2 -translate-y-1/2 left-3 text-zinc-500">
          {icon}
        </div>

        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-8 pr-3 py-2 bg-transparent outline-none"
        />
      </div>
    </div>
  );
}

export default InputMini;