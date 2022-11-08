import React, { useContext } from 'react';
import Container from '@mui/material/Container';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from '@mui/material';
import EntryDialog from './EntryDialog';
import { BudgetContext } from './BudgetContext';

function App() {
  const { budgetEntries } = useContext(BudgetContext);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [updatingEntryID, setUpdatingEntryID] = React.useState<string>();

  const openDialog = (entryID?: string) => () => {
    setUpdatingEntryID(entryID);
    setIsDialogOpen(true);
  };
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <Container maxWidth="sm">
      <Button variant="contained" onClick={openDialog()}>
        Add a new entry
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Amount</TableCell>
              <TableCell>Description</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgetEntries.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.amount.toFormat()}
                </TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>
                  <Button onClick={openDialog(row.id)}>Update</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isDialogOpen && <EntryDialog open handleClose={closeDialog} entryID={updatingEntryID} />}
    </Container>
  );
}

export default App;
