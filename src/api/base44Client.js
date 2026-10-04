// Offline stand-in for the Base44 SDK client. The app runs without a backend,
// so auth resolves to a local guest and entity queries return no records.
const GUEST_USER = { email: 'guest@noggin.local', full_name: 'Guest Learner' };

function createEntity() {
  return {
    list: async () => [],
    filter: async () => [],
    get: async () => null,
    create: async (data) => ({ id: crypto.randomUUID(), created_date: new Date().toISOString(), ...data }),
    update: async (id, data) => ({ id, ...data }),
    delete: async () => {},
  };
}

export const base44 = {
  auth: {
    me: async () => GUEST_USER,
    logout: async () => {},
  },
  entities: new Proxy({}, { get: () => createEntity() }),
};
