export const columns = [
  {
    name: 'epgu.exported',
    label: 'ЕПГУ выгружен',
    field: 'epgu.exported',
    sortable: true,
  },
  {
    name: 'epgu.needExport',
    label: 'ЕПГУ план',
    field: 'epgu.needExport',
    sortable: true,
  },
]

export function addColumns(columns) {
  columns.push({
      name: 'epgu.exported',
      label: 'ЕПГУ выгружен',
      field: 'epgu.exported',
      sortable: true,
    },
    {
      name: 'epgu.needExport',
      label: 'ЕПГУ план',
      field: 'epgu.needExport',
      sortable: true,
    }
  )

  return columns
}
