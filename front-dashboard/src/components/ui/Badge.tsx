interface BadgeProps {
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'FAILED';
  children: React.ReactNode;
}

export default function Badge({ status, children }: BadgeProps) {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
    COMPLETED: 'bg-green-100 text-green-800 border-green-200',
    FAILED: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[status]}`}>
      {children}
    </span>
  );
}