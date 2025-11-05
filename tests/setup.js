/**
 * Jest setup file for testing
 */

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock window properties
global.window = {
  ...global.window,
  localStorage: localStorageMock,
  sessionStorage: sessionStorageMock,
  location: {
    pathname: '/',
    href: 'http://localhost/',
    origin: 'http://localhost',
    protocol: 'http:',
    host: 'localhost',
    hostname: 'localhost',
    port: '',
    search: '',
    hash: ''
  },
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
  requestAnimationFrame: jest.fn(cb => setTimeout(cb, 16)),
  cancelAnimationFrame: jest.fn(),
  matchMedia: jest.fn().mockReturnValue({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }),
  getComputedStyle: jest.fn().mockReturnValue({
    getPropertyValue: jest.fn().mockReturnValue('')
  }),
  performance: {
    now: jest.fn().mockReturnValue(Date.now()),
    timing: {
      navigationStart: Date.now() - 1000,
      loadEventEnd: Date.now(),
      domContentLoadedEventEnd: Date.now() - 500,
      requestStart: Date.now() - 800,
      responseStart: Date.now() - 600,
      responseEnd: Date.now() - 500,
      domLoading: Date.now() - 900,
      domInteractive: Date.now() - 700,
      loadEventStart: Date.now() - 100
    },
    navigation: {
      type: 0
    },
    getEntriesByType: jest.fn().mockReturnValue([]),
    mark: jest.fn(),
    measure: jest.fn()
  },
  navigator: {
    userAgent: 'Jest Test Browser',
    platform: 'Jest',
    onLine: true
  },
  screen: {
    width: 1920,
    height: 1080,
    availWidth: 1920,
    availHeight: 1040
  },
  document: {
    ...global.document,
    documentElement: {
      style: {
        setProperty: jest.fn(),
        getPropertyValue: jest.fn().mockReturnValue('')
      }
    },
    createElement: jest.fn().mockReturnValue({
      style: {},
      classList: {
        add: jest.fn(),
        remove: jest.fn(),
        contains: jest.fn(),
        toggle: jest.fn()
      },
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      setAttribute: jest.fn(),
      getAttribute: jest.fn(),
      appendChild: jest.fn(),
      insertBefore: jest.fn(),
      removeChild: jest.fn(),
      querySelector: jest.fn(),
      querySelectorAll: jest.fn().mockReturnValue([]),
      textContent: '',
      innerHTML: '',
      outerHTML: ''
    }),
    createElementNS: jest.fn(),
    createTextNode: jest.fn(),
    createDocumentFragment: jest.fn(),
    getElementById: jest.fn(),
    querySelector: jest.fn(),
    querySelectorAll: jest.fn().mockReturnValue([]),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    body: {
      appendChild: jest.fn(),
      removeChild: jest.fn(),
      classList: {
        add: jest.fn(),
        remove: jest.fn(),
        contains: jest.fn(),
        toggle: jest.fn()
      }
    },
    head: {
      appendChild: jest.fn()
    },
    title: '',
    cookie: ''
  },
  URL: {
    createObjectURL: jest.fn().mockReturnValue('blob:mock-url'),
    revokeObjectURL: jest.fn()
  },
  fetch: jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({}),
    text: jest.fn().mockResolvedValue(''),
    blob: jest.fn().mockResolvedValue(new Blob())
  }),
  setTimeout: global.setTimeout,
  clearTimeout: global.clearTimeout,
  setInterval: global.setInterval,
  clearInterval: global.clearInterval
};

// Mock document if not available
if (!global.document) {
  global.document = global.window.document;
}

// Mock CSSStyleDeclaration
global.CSSStyleDeclaration = class {
  setProperty() {}
  getPropertyValue() {
    return '';
  }
};

// Mock DOMParser
global.DOMParser = class {
  parseFromString() {
    return {
      documentElement: {
        textContent: ''
      }
    };
  }
};

// Mock MutationObserver
global.MutationObserver = class {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
};

// Mock ResizeObserver
global.ResizeObserver = class {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
global.IntersectionObserver = class {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock PerformanceObserver
global.PerformanceObserver = class {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
};

// Mock CSSRule
global.CSSRule = {
  STYLE_RULE: 1
};

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
});
