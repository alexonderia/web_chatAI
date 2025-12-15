import { ChatMessageDto } from '@/app/api/chat';
import { ChatMessage, MessageRole } from '@/features/chat/components/ChatMessageCard';

const messageRoles = ['assistant', 'ai', 'bot', 'system'];

const safeLower = (value: unknown): string => (typeof value === 'string' ? value.toLowerCase() : '');

function normalizeMessageRole(item: ChatMessageDto): MessageRole {
  if (typeof item.role === 'number') {
    return item.role === 0 ? 'assistant' : 'user';
  }

  if (typeof item.role === 'string') {
    const normalizedRole = item.role.toLowerCase();
    if (normalizedRole === '0' || normalizedRole === 'assistant' || normalizedRole === 'ai' || normalizedRole === 'bot') {
      return 'assistant';
    }
    if (normalizedRole === '1' || normalizedRole === 'user') {
      return 'user';
    }
  }

  const normalizedRole = safeLower(item.role);
  if (normalizedRole) {
    if (normalizedRole === 'assistant' || normalizedRole === 'ai' || normalizedRole === 'bot') {
      return 'assistant';
    }
    if (normalizedRole === 'user') {
      return 'user';
    }
  }

  if (typeof item.isAi === 'boolean') {
    return item.isAi ? 'assistant' : 'user';
  }

  if (typeof item.isAI === 'boolean') {
    return item.isAI ? 'assistant' : 'user';
  }

  const normalizedType = safeLower(item.type);
  if (messageRoles.includes(normalizedType)) {
    return 'assistant';
  }

  const normalizedAuthor = safeLower(item.author ?? item.userLogin);
  if (messageRoles.some((role) => normalizedAuthor.includes(role))) {
    return 'assistant';
  }

  return 'user';
}

const toDataUri = (src: string) => (src.startsWith('data:') || src.startsWith('http') ? src : `data:image/png;base64,${src}`);

const flattenImageValues = (values: unknown): string[] => {
  if (!values) return [];
  if (typeof values === 'string') return [values];
  if (Array.isArray(values)) return values.flatMap(flattenImageValues);
  if (typeof values === 'object') {
    const candidate = values as { imageBlob?: string; base64Image?: string; imageUrl?: string; url?: string };
    return [candidate.imageBlob, candidate.base64Image, candidate.imageUrl, candidate.url].filter(Boolean) as string[];
  }
  return [];
};

function normalizeImages(item: ChatMessageDto): string[] {
  const candidates = [
    ...(item.base64Images ?? []),
    ...(item.imageUrls ?? []),
    ...(item.imageBlobs ?? []),
    ...flattenImageValues(item.images),
    item.base64Image,
    item.imageBlob,
    item.imageUrl,
  ].filter(Boolean) as string[];

  return Array.from(new Set(candidates)).map(toDataUri);
}

export function mapMessages(items: ChatMessageDto[]): ChatMessage[] {
  return items.map((item, index) => {
    const role = normalizeMessageRole(item);
    const author = item.author ?? item.userLogin ?? (role === 'assistant' ? 'ИИ ассистент' : 'Вы');
    const messageType = safeLower(item.messageType ?? item.type) || 'text';
    const images = normalizeImages(item);
    const content = item.content ?? item.text ?? (images.length > 0 ? '' : '');

    return {
      id: String(item.id ?? index),
      role,
      author,
      content,
      messageType,
      images,
      timestamp: item.createdAt,
    };
  });
}