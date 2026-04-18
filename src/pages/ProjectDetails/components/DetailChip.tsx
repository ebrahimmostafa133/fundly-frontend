interface Props {
  icon: React.ReactNode;
  label: string;
}

export default function DetailChip({ icon, label }: Props) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
      <span className="text-primary-500">{icon}</span>
      {label}
    </span>
  );
}
