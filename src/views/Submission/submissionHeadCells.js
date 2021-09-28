export const headCells = [
  {
    id: 'checkbox',
    name: 'checkbox',
    label: '',
    align: 'right',
  },
  {
    id: 'entryId',
    name: 'entryId',
    label: 'Entry Id',
    align: 'left',
    isSortable: true,
  },
  {
    id: 'category',
    name: 'category',
    label: 'Category',
    align: 'left',
    isSortable: false,
  },
  {
    id: 'nameCode',
    name: 'nameCode',
    label: 'Name Code',
    align: 'left',
    isSortable: true,
  },  
  {
    id: 'createdAt',
    name: 'createdAt',
    label: 'Created At',
    align: 'left',
    isSortable: false,
  },
  {
    id: 'name',
    name: 'name',
    label: 'Name',
    align: 'left',
    isSortable: true,
  },
  {
    id: 'email',
    name: 'email',
    label: 'Email',
    align: 'left',
    isSortable: false,
  },
  {
    id: 'status',
    name: 'status',
    label: 'Status',
    align: 'left',
    isSortable: true,
  },
  {
    id: 'awardAction',
    name: 'actions',
    label: 'Action',
    align: 'left',
    isSortable: false,
  },
]

export const statusColors = {
  Submitted: 'success',
  Open: 'info',
  Locked: 'danger',
}

export const statusList = [
  "Submitted", "Open", "Draft", "Pending Payment"
]
