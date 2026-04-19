import axios from 'axios';

const MAX_QUERY_RETRIES = 12;

/**
 * Повторяем запросы, пока бэкенд недоступен
 * Не трогаем осмысленные 4xx с сервера — чтобы не дублировать ошибки валидации.
 */
export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_QUERY_RETRIES) return false;
  if (!axios.isAxiosError(error)) return failureCount < MAX_QUERY_RETRIES;
  const status = error.response?.status;
  if (status == null) return true;
  if (status >= 500 && status < 600) return true;
  if (status === 408 || status === 429) return true;
  return false;
}

export function queryRetryDelay(attemptIndex: number): number {
  return Math.min(1000 * 2 ** attemptIndex, 15_000);
}
