import { MRT_Localization_PL } from 'material-react-table/locales/pl';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { MaterialReactTable } from 'material-react-table';

type PropsType = {
    data: any;
    columns: any[];
    isLoading?: boolean;
    pagination?: any;
    disableAction?: boolean;
    onEditingRowSave?: (row: any) => void;
    manualPagination?: boolean;
    rowCount?: number;
    onPaginationChange?: (data: any) => void;
    renderRowActions?: (cell: any) => JSX.Element;
    renderTopToolbarCustomActions?: () => JSX.Element;
}

const MaterialTable = (props: PropsType) => (
  <MaterialReactTable
    localization={
                localStorage.getItem('lng') === 'en'
                  ? MRT_Localization_EN
                  : MRT_Localization_PL
            }
    enableRowNumbers
    rowNumberDisplayMode="static"
    enableRowActions={!props.disableAction}
    positionActionsColumn="last"
    state={{ isLoading: props.isLoading, pagination: props.pagination }}
    {...props}
  />
);

export default MaterialTable;
