import React from 'react';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import useSWR from 'swr';

import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import MuiTableCell, { TableCellProps } from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import MuiTableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import Skeleton from '@material-ui/lab/Skeleton';

import { useDebounce } from '../../utils/useDebounce';
import { openState } from '../form-drawer/atoms';
import {
  countState,
  orderByState,
  orderState,
  pageState,
  searchTextState,
} from './atoms';
import { paramsStringState } from './selectors';

interface Column {
  id: keyof Data;
  label: string;
  width?: number;
}

export interface Data {
  account_id: number;
  account_name: string;
  activated_at: string;
  email: string;
  first_name: string;
  id: number;
  is_active: boolean;
  last_name: string;
}

const columns: Column[] = [
  {
    id: 'id',
    label: 'ID',
    width: 80,
  },
  {
    id: 'first_name',
    label: 'First name',
    width: 160,
  },
  {
    id: 'last_name',
    label: 'Last name',
    width: 160,
  },
  {
    id: 'email',
    label: 'Email address',
  },
  {
    id: 'account_name',
    label: 'Account',
    width: 256,
  },
  {
    id: 'is_active',
    label: 'Status',
    width: 160,
  },
];

const useTableHeadStyles = makeStyles({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
});

const TableHead = React.memo(() => {
  const [order, setOrder] = useRecoilState(orderState);
  const [orderBy, setOrderBy] = useRecoilState(orderByState);
  const classes = useTableHeadStyles();

  const handleClick = (property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <MuiTableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.id}
            sortDirection={orderBy === column.id ? order : false}
            style={{ width: column.width }}
          >
            <TableSortLabel
              active={orderBy === column.id}
              direction={orderBy === column.id ? order : 'asc'}
              onClick={() => handleClick(column.id)}
            >
              {column.label}
              {orderBy === column.id && (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              )}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </MuiTableHead>
  );
});

const useTableToolbarStyles = makeStyles({
  title: {
    flex: '1 1 100%',
  },
});

const TableToolbar = React.memo(() => {
  const [searchText, setSearchText] = useRecoilState(searchTextState);
  const setOpen = useSetRecoilState(openState);
  const classes = useTableToolbarStyles();

  return (
    <Toolbar>
      <Typography
        className={classes.title}
        component="div"
        id="tableTitle"
        variant="h6"
        noWrap
      >
        Users
      </Typography>
      <TextField
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear"
                disabled={searchText === ''}
                edge="end"
                onClick={() => setSearchText('')}
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="Search"
        value={searchText}
      />
      <Tooltip title="Add">
        <IconButton aria-label="add" onClick={() => setOpen(true)}>
          <AddBoxIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
});

export interface Response {
  meta: { total: number };
  users: Data[];
}

function renderEmail(email: string | undefined) {
  if (email === undefined) return;

  return <Link href={`emailto:${email}`}>{email}</Link>;
}

function renderStatus(user?: Data) {
  if (user === undefined) return;

  return (
    <React.Fragment>
      {user?.is_active ? 'Active' : 'Inactive'}
      {user.activated_at && (
        <React.Fragment>
          {' '}
          <Typography
            style={{ letterSpacing: 'inherit', lineHeight: 'inherit' }}
            variant="caption"
          >
            {user.activated_at}
          </Typography>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

function TableCell({ children, ...rest }: TableCellProps) {
  return (
    <MuiTableCell {...rest}>
      {children || <Skeleton width="50%" />}
    </MuiTableCell>
  );
}

export const Page = React.memo(() => {
  const resetOrder = useResetRecoilState(orderState);
  const resetOrderBy = useResetRecoilState(orderByState);
  const resetPage = useResetRecoilState(pageState);
  const setCount = useSetRecoilState(countState);
  const searchText = useRecoilValue(searchTextState);
  const debouncedSearchText = useDebounce(searchText, 500);
  const paramsString = useRecoilValue(paramsStringState(debouncedSearchText));
  const { data } = useSWR<Response>('/api/v1/users' + paramsString);

  React.useEffect(() => {
    if (data?.meta.total === undefined) return;
    setCount(data?.meta.total || 0);
  }, [data, setCount]);

  React.useEffect(() => {
    resetOrder();
    resetOrderBy();
    resetPage();
  }, [debouncedSearchText, resetOrder, resetOrderBy, resetPage]);

  return (
    <React.Fragment>
      {(data?.users || Array.from({ length: 10 })).map((user, index) => (
        <TableRow hover key={index}>
          <TableCell component="th" scope="row">
            {user?.id}
          </TableCell>
          <TableCell>{user?.first_name}</TableCell>
          <TableCell>{user?.last_name}</TableCell>
          <TableCell>{renderEmail(user?.email)}</TableCell>
          <TableCell>{user?.account_name}</TableCell>
          <TableCell>{renderStatus(user)}</TableCell>
        </TableRow>
      ))}
    </React.Fragment>
  );
});

export function Users() {
  const [page, setPage] = useRecoilState(pageState);
  const count = useRecoilValue(countState);

  return (
    <Paper>
      <TableToolbar />
      <TableContainer>
        <Table aria-labelledby="tableTitle">
          <TableHead />
          <TableBody>
            <Page />
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={count}
        labelRowsPerPage={null}
        onChangePage={(_, page) => setPage(page)}
        page={page}
        rowsPerPage={10}
        rowsPerPageOptions={[]}
      />
    </Paper>
  );
}
