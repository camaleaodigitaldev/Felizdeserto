interface DashboardStatsProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  description?: string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
}

export default function DashboardStats({
  title,
  value,
  icon,
  color,
  description,
  trend,
}: DashboardStatsProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-sm font-medium text-gray-500 truncate">{title}</span>
          <span className="text-3xl font-bold text-gray-900 tabular-nums">{value}</span>
          {description && (
            <span className="text-xs text-gray-400 mt-0.5">{description}</span>
          )}
        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
          aria-hidden="true"
        >
          {typeof icon === "string" ? (
            <span className="text-xl">{icon}</span>
          ) : (
            <span className="w-6 h-6 flex items-center justify-center">{icon}</span>
          )}
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1.5 pt-3 border-t border-gray-50">
          <span
            className={`text-xs font-semibold ${
              trend.positive ? "text-green-600" : "text-red-500"
            }`}
          >
            {trend.positive ? "+" : ""}
            {trend.value}%
          </span>
          <span className="text-xs text-gray-400">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
