import { MRT_Localization_PL } from "material-react-table/locales/pl";
import { MRT_Localization_EN } from "material-react-table/locales/en";
import {MaterialReactTable} from "material-react-table";

const MaterialTable = (props) => {
  const { data, columns } = props;
  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      localization={
        localStorage.getItem("lng") === "en"
          ? MRT_Localization_EN
          : MRT_Localization_PL
      }
      options
      muiTablePaginationProps={{
        rowsPerPageOptions: [5, 10, 15, 20, 25],
      }}
      enableRowNumbers
      rowNumberMode="static"
      enableRowActions={!props.disableAction}
      positionActionsColumn="last"
      state={{ isLoading: props.isLoading, pagination: props.pagination }}
      {...props}
    />
  );
};

export default MaterialTable;
