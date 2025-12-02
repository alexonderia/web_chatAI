import { useQuery } from '@tanstack/react-query';
import { fetchHealth } from '../api/chatApi';
import { getBaseUrl } from '../../../lib/apiClient';

const statusColor: Record<string, string> = {
  ok: '#22c55e',
  degraded: '#f59e0b',
  down: '#ef4444',
};

const StatusBar = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    refetchInterval: 15_000,
  });

  const status = isLoading ? 'Проверяем...' : isError ? 'Нет связи' : data?.status ?? 'unknown';
  const color = statusColor[data?.status ?? 'down'] ?? '#94a3b8';

  return (
    <footer className="status-bar">
      <div className="status-dot" style={{ backgroundColor: color }} aria-hidden />
      <p className="status-text">
        Статус: {status} · API: {getBaseUrl()} {data?.version ? `· v${data.version}` : ''}
      </p>
    </footer>
  );
};

export default StatusBar;