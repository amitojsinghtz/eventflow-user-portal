import {
  TableHead as MaterialTableHead,
  TableCell,
  TableRow,
  TableSortLabel,
  makeStyles,
  Checkbox,
} from '@material-ui/core'
import { useState } from 'react'

const useStyles = makeStyles((theme) => ({
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
}))

export const TableHead = (props) => {
  const { headCells, setOrder, OrderBy, SortOrder, selectedAll, selectableCount = undefined } = props
  const classes = useStyles()

  const sortHandler = (property) => (event) => {
    const chkOrder = OrderBy === property ? (SortOrder == 'asc' ? 'desc' : 'asc') : 'asc'
    setOrder(property, chkOrder)
  }

  const [Check, setCheck] = useState(true)

  const sortConstants = {
    asc: 'asc',
    desc: 'desc',
  }

  const cheking = () => {
    setCheck(!Check)
    selectedAll(Check)
  }

  return (
    <MaterialTableHead>
      <TableRow>
        {headCells.map((headCell) =>
          headCell.name === 'checkbox' && selectableCount ? (
            <TableCell key={`${headCell.id}-checkbox`}>
              <Checkbox onClick={cheking} />
            </TableCell>
          ) : headCell.isSortable ? (
            <TableCell
              style={{ justifyContent: 'space-evenly' }}
              key={headCell.id}
              align={headCell.align}
              sortDirection={OrderBy === headCell.name ? sortConstants[SortOrder] : false}
            >
              <TableSortLabel
                active={OrderBy === headCell.name}
                direction={OrderBy === headCell.name ? sortConstants[SortOrder] : 'asc'}
                onClick={sortHandler(headCell.name)}
              >
                {headCell.label}
                {OrderBy === headCell.name ? (
                  <span className={classes.visuallyHidden}>
                    {sortConstants[SortOrder] === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ) : (
            <TableCell key={headCell.id} align={headCell.align}>
              {headCell.label}
            </TableCell>
          )
        )}
      </TableRow>
    </MaterialTableHead>
  )
}
