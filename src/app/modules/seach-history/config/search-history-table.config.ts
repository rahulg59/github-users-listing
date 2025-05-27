import { TableColumn } from "../../../shared/ui-elements/table/models/table.interface";

export const SearchHistoryTableListConfig: TableColumn[] = [
    {
        field: 'searchTerm',
        header: "Search Term",
        width: "280px"
    },
    {
        field: 'results',
        header: "Search Results",
    }
]