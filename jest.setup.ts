import { TextDecoder, TextEncoder } from 'util';

import '@testing-library/jest-dom';
Object.assign(global, { TextDecoder, TextEncoder });

if (typeof global.Request === 'undefined') {
  (global as unknown as Record<string, unknown>).Request = class Request { };
}
if (typeof global.Response === 'undefined') {
  (global as unknown as Record<string, unknown>).Response = class Response { };
}

type MockMessages = Record<string, unknown>;

let mockMessages: MockMessages = {};
let mockLocale = 'en';

function getNestedValue(obj: MockMessages, key: string): unknown {
  return key.split('.').reduce<unknown>((acc, part) => {
    return (acc as MockMessages)?.[part];
  }, obj) ?? key;
}

jest.mock('next-intl', () => {
  return {
    NextIntlClientProvider: ({ children, locale = 'en', messages = {} }: { children: React.ReactNode; locale?: string; messages?: MockMessages; }) => {
      mockLocale = locale;
      mockMessages = messages;
      return children;
    },
    useTranslations: (namespace?: string) => {
      const namespaceObj = namespace ? (mockMessages[namespace] as MockMessages) : mockMessages;
      return (key: string) => getNestedValue(namespaceObj, key) as string;
    },
    useLocale: () => mockLocale,
    useMessages: () => mockMessages,
  };
});

jest.mock('use-intl/react', () => ({
  IntlProvider: ({ children }: { children: React.ReactNode }) => children,
  useTranslations: (namespace?: string) => {
    const namespaceObj = namespace ? (mockMessages[namespace] as MockMessages) : mockMessages;
    return (key: string) => getNestedValue(namespaceObj, key) as string;
  },
  useLocale: () => mockLocale,
}));

beforeEach(() => {
  mockMessages = {};
  mockLocale = 'en';
});