export function EmptySlot({ label }: { label: string }) {
  return (
    <div style={{
      padding: '32px 24px', borderRadius: 18,
      border: '1.5px dashed #d1d5db', background: '#fff',
      textAlign: 'center', color: '#9ca3af', fontSize: 13,
    }}>
      {label}
    </div>
  );
}