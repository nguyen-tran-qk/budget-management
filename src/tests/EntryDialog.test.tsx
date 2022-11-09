import { render, cleanup, fireEvent } from '@testing-library/react';
import EntryDialog, { AMOUNT_ERROR_MSG } from '../components/EntryDialog';
import { BudgetContextProvider } from '../contexts/BudgetContext';
import { Euro } from '../utils';

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
const inputLabel = 'Amount of money in Euro (e.g 100,99)';

test('it renders the dialog to add new entry', () => {
  const { getByTestId, getByLabelText } = render(
    <EntryDialog open handleClose={mockHandleClose} />
  );
  const title = getByTestId('title');
  const amountInput = getByLabelText(inputLabel);
  const submitButton = getByTestId('submit-button');

  expect(title.textContent).toBe('Add a new entry');
  expect(amountInput.getAttribute('value')).toBe('');
  expect(submitButton.textContent).toBe('Add');
});

test('it renders the dialog to edit an entry', () => {
  const { getByTestId, getByLabelText } = render(
    <BudgetContextProvider initialValue={dummyEntries}>
      <EntryDialog open handleClose={mockHandleClose} entryID="1" />
    </BudgetContextProvider>
  );
  const title = getByTestId('title');
  const amountInput = getByLabelText(inputLabel);
  const submitButton = getByTestId('submit-button');

  expect(title.textContent).toBe('Edit entry');
  expect(amountInput).toHaveValue(1);
  expect(submitButton.textContent).toBe('Update');
});

test('it validates amount input field', () => {
  const { getByText, getByLabelText } = render(<EntryDialog open handleClose={mockHandleClose} />);
  const amountInput = getByLabelText(inputLabel);
  expect(() => getByText(AMOUNT_ERROR_MSG)).toThrow();

  fireEvent.change(amountInput, { target: { value: parseFloat('100.1234') } });
  expect(getByText(AMOUNT_ERROR_MSG)).toBeInTheDocument();

  fireEvent.change(amountInput, { target: { value: parseFloat('15.75') } });
  expect(() => getByText(AMOUNT_ERROR_MSG)).toThrow();

  fireEvent.change(amountInput, { target: { value: parseFloat('') } });
  expect(getByText(AMOUNT_ERROR_MSG)).toBeInTheDocument();
});

test('submit changes', () => {
  const mockGetRandomValues = jest.fn().mockReturnValueOnce(new Uint32Array(1));
  Object.defineProperty(window, 'crypto', {
    value: { getRandomValues: mockGetRandomValues },
  });
  const { getByTestId, getByLabelText } = render(
    <BudgetContextProvider initialValue={dummyEntries}>
      <EntryDialog open handleClose={mockHandleClose} entryID="1" />
    </BudgetContextProvider>
  );
  const amountInput = getByLabelText(inputLabel);
  const submitButton = getByTestId('submit-button');
  fireEvent.change(amountInput, { target: { value: parseFloat('100.1234') } });
  fireEvent.click(submitButton);
  expect(mockHandleClose).toHaveBeenCalledTimes(0);
  expect(mockGetRandomValues).toHaveBeenCalledTimes(0);

  fireEvent.change(amountInput, { target: { value: parseFloat('100.12') } });
  fireEvent.click(submitButton);
  expect(mockHandleClose).toHaveBeenCalledTimes(1);
  expect(mockGetRandomValues).toHaveBeenCalledTimes(1);
});
