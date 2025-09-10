// Manual Jest mock for Supabase client used in unit tests
// Provides a minimal surface to satisfy service calls without network

const insertMock = jest.fn().mockResolvedValue({ error: null });
const updateMock = jest.fn().mockResolvedValue({ error: null });
const singleMock = jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
const eqMock = jest.fn().mockReturnThis();
const selectMock = jest.fn().mockReturnValue({ eq: eqMock, single: singleMock });

export const supabase = {
  from: jest.fn().mockReturnValue({
    insert: insertMock,
    update: updateMock,
    select: selectMock,
    eq: eqMock,
    single: singleMock,
  }),
  __mocks: { insertMock, updateMock, selectMock, singleMock },
};

export default supabase;

