import { render, cleanup, fireEvent } from '@testing-library/react';
import DeleteEntryAlert from '../components/DeleteEntryAlert';
import { Euro } from '../utils';
import { BudgetContextProvider } from '../contexts/BudgetContext';

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

const dummyEntries = [
  {
    id: '1',
    amount: Euro(100),
    description: 'foobar',
  },
];

const mockHandleClose = jest.fn();

test('it should render the component with initial states', () => {
  const { getByTestId } = render(
    <DeleteEntryAlert open handleClose={mockHandleClose} entryID={'1'} />
  );
  const dialogTitle = getByTestId('dialog-title');
  const deleteButton = getByTestId('delete-button');

  expect(dialogTitle.textContent).toBe('Are you sure you want to delete this entry?');
  expect(deleteButton).toBeInTheDocument();
});

test('it should close dialog when clicking cancel', () => {
  const { getByTestId } = render(
    <DeleteEntryAlert open handleClose={mockHandleClose} entryID={'1'} />
  );
  const cancelButton = getByTestId('cancel-button');
  fireEvent.click(cancelButton);
  expect(mockHandleClose).toHaveBeenCalledTimes(1);
});

test('it should find and delete the entry without error', () => {
  const { getByTestId, container } = render(
    <BudgetContextProvider initialValue={dummyEntries}>
      <DeleteEntryAlert open handleClose={mockHandleClose} entryID={'1'} />
    </BudgetContextProvider>
  );
  const deleteButton = getByTestId('delete-button');
  fireEvent.click(deleteButton);
  expect(mockHandleClose).toHaveBeenCalledTimes(1);
  expect(container.querySelector("[data-testid='error-dialog-title']")).toBeNull();
  expect(container.querySelector("[data-testid='error-close-button']")).toBeNull();
});

test('it should show error if entry not found', () => {
  const { getByTestId } = render(
    <BudgetContextProvider initialValue={dummyEntries}>
      <DeleteEntryAlert open handleClose={mockHandleClose} entryID={'2'} />
    </BudgetContextProvider>
  );
  const deleteButton = getByTestId('delete-button');
  fireEvent.click(deleteButton);
  const dialogTitle = getByTestId('error-dialog-title');
  const errorCloseButton = getByTestId('error-close-button');

  expect(mockHandleClose).toHaveBeenCalledTimes(0);
  expect(dialogTitle.textContent).toBe('Error: Failed to delete entry. Please try again');
  expect(errorCloseButton).toBeInTheDocument();
});
