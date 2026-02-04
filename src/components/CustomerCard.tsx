interface CustomerCardProps {
  name: string;
  company: string;
  healthScore: number;
  domains?: string[];
}

function getHealthColor(score: number): { bg: string; text: string; label: string } {
  if (score <= 30) {
    return { bg: 'bg-red-100', text: 'text-red-700', label: 'Poor' };
  }
  if (score <= 70) {
    return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Moderate' };
  }
  return { bg: 'bg-green-100', text: 'text-green-700', label: 'Good' };
}

export default function CustomerCard({ name, company, healthScore, domains }: CustomerCardProps) {
  const healthColor = getHealthColor(healthScore);
  const domainCount = domains?.length ?? 0;

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {company}
          </p>
        </div>

        <div className={`inline-flex items-center px-3 py-1 rounded-full ${healthColor.bg} ${healthColor.text} text-sm font-medium self-start`}>
          <span className="sr-only">Health score:</span>
          {healthScore}
        </div>
      </div>

      {domains && domains.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Domains
            </span>
            {domainCount > 1 && (
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                {domainCount}
              </span>
            )}
          </div>
          <ul className="space-y-1">
            {domains.map((domain) => (
              <li key={domain} className="text-sm text-gray-600 truncate">
                {domain}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
