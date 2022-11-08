import React, { useState, useContext, useMemo } from 'react';
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
  styled,
  Stack,
  Typography,
} from '@mui/material';
import EntryDialog from './EntryDialog';
import { BudgetContext } from './BudgetContext';
import DeleteEntryAlert from './DeleteEntryAlert';
import { Dinero } from 'dinero.js';
import { Euro } from './utils';

const DescriptionTableCell = styled(TableCell)({
  whiteSpace: 'pre-wrap',
});

const BudgetDashboard = () => {
  const { budgetEntries } = useContext(BudgetContext);
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [updatingEntryID, setUpdatingEntryID] = useState<string>();
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deletingEntryID, setDeletingEntryID] = useState<string>();

  const totalAmount = useMemo<Dinero>(
    () => budgetEntries.reduce((total, curr) => total.add(curr.amount), Euro(0)),
    [budgetEntries]
  );

  const openEntryDialog = (entryID?: string) => () => {
    setUpdatingEntryID(entryID);
    setIsEntryDialogOpen(true);
  };

  const closeEntryDialog = () => setIsEntryDialogOpen(false);

  const openDeleteAlert = (entryID: string) => () => {
    setDeletingEntryID(entryID);
    setIsDeleteAlertOpen(true);
  };

  const closeDeleteAlert = () => setIsDeleteAlertOpen(false);

  return (
    <Container maxWidth="sm" sx={{ marginTop: 6 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginBottom: 2 }}
      >
        <Button variant="contained" onClick={openEntryDialog()}>
          Add a new entry
        </Button>
        <div>
          <span>Total budget: </span>
          <b>{totalAmount.toFormat()}</b>
        </div>
      </Stack>
      {budgetEntries.length ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Amount</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {budgetEntries.map((row) => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.amount.toFormat()}
                  </TableCell>
                  <DescriptionTableCell>{row.description}</DescriptionTableCell>
                  <TableCell align="center">
                    <Button onClick={openEntryDialog(row.id)}>Edit</Button>
                    <Button onClick={openDeleteAlert(row.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="subtitle1">
          There's nothing here yet. Start adding entries to increase your budget!
        </Typography>
      )}
      {isEntryDialogOpen && (
        <EntryDialog open handleClose={closeEntryDialog} entryID={updatingEntryID} />
      )}
      {isDeleteAlertOpen && (
        <DeleteEntryAlert open handleClose={closeDeleteAlert} entryID={deletingEntryID} />
      )}
    </Container>
  );
};

export default BudgetDashboard;
