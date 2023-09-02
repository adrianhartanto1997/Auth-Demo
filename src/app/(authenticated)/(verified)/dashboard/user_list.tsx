'use client'

import moment from 'moment'
import DataTable, { TableColumn } from 'react-data-table-component'
import { UsersView } from '@/models/entities'

const columns: TableColumn<UsersView>[] = [
  {
    name: 'ID',
    selector: (row) => row.id,
    sortable: true,
    width: '80px'
  },
  {
    name: 'Email',
    selector: (row) => row.email,
    sortable: true
  },
  {
    name: 'Name',
    selector: (row) => row.name,
    sortable: true
  },
  {
    name: 'Sign Up Date',
    selector: (row) => row.signUpDate ? moment(row.signUpDate).format() : '',
    format: (row) => row.signUpDate ? moment(row.signUpDate).format('MMMM Do YYYY, h:mm:ss a'): null,
    sortable: true
  },
  {
    name: 'Num logins',
    selector: (row) => row.numLogin,
    sortable: true,
    width: '120px'
  },
  {
    name: 'Last session',
    selector: (row) => row.lastSession ? moment(row.lastSession).format() : '',
    format: (row) => row.lastSession ? moment(row.lastSession).format('MMMM Do YYYY, h:mm:ss a'): null,
    sortable: true
  },
]

const UserListTable = ({ data }: { data: string }) => {
  const parsedData = JSON.parse(data) as UsersView[]

  return <DataTable columns={columns} data={parsedData}/>
}

export default UserListTable
