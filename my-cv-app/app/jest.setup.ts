import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  usePathname: () => '',
  useSearchParams: () => new URLSearchParams(),
}))

jest.mock('@radix-ui/react-dialog', () => {
  const MockDialog = ({ children, open }: any) => (open ? children : null)
  MockDialog.Content = ({ children }: any) => children
  MockDialog.Header = ({ children }: any) => children
  MockDialog.Title = ({ children }: any) => children
  MockDialog.Trigger = ({ children }: any) => children
  
  return { __esModule: true, default: MockDialog }
})