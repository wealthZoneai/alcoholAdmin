

// INPUT COMPONENTS
function InputGroup({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-zinc-500">{label}</label>
      <div className="flex items-center gap-3 px-4 py-3 bg-zinc-50 border rounded-xl">
        <div className="text-zinc-400">{icon}</div>
        {children}
      </div>
    </div>
  );
}

export default InputGroup;