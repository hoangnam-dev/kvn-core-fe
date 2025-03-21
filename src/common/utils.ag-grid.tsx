/* eslint-disable */

import { ColDef } from "ag-grid-community";
import { ViewMode } from "@/common/lib.enum";
import { translate } from "@/common/utils.translator";
import Badge from "@/components/ui/badge/BadgeBoolean";

interface GridRowData {
    [key: string]: { r?: unknown; v?: unknown } | undefined;
}

export interface ActionData {
    name: { v: string; r: string };
    vn_name: { v: string; r: string };
    en_name: { v: string; r: string };
    ja_name: { v: string; r: string };
    css_class?: { v: string; r: string };
    icon?: { v: string; r: string };
    is_active?: { v: number; r: number };
    action?: { v: number; r: number };
    display_order?: { v: number; r: number };
    url_link?: { v: string; r: string };
    is_new_tab?: { v: number; r: number };
    is_ajax_modal?: { v: number; r: number };
    form_type?: { v: any; r: any };
    [key: string]: { v?: unknown; r?: unknown } | undefined;
}

interface DynamicGridData {
    rowData: GridRowData[];
    columnDefs: ColDef[];
    tableName: string;
    actions?: ActionData[];
    language?: string;
}

export function generateGridData(
    headerData: any[],
    bodyData: any[],
    actionData?: any[],
    language?: string
): DynamicGridData {
    try {
        if (!headerData || !headerData.length) {
            return { rowData: [], columnDefs: [], tableName: "", actions: [] };
        }

        // Extract table name from the first header row
        const tableName = headerData[0]?.table_name?.r || "";

        // Create a mapping for all field names to display names
        const headerMapping: Record<string, string> = {};
        headerData.forEach(item => {
            headerMapping[item.name.r] = translate(item, language ?? "vi");
        });

        // Process visible columns
        const visibleColumns = headerData
            .filter(item => item.name?.r)
            .sort((a, b) => (a.display_order?.r || 0) - (b.display_order?.r || 0))
            .map(item => ({
                fieldName: item.name?.r as string,
                displayName: translate(item, language ?? "vi"),
                width: item.column_width?.r as string || "150px",
                isEditable: item.is_editable?.r === 1
            }));

        // Determine which fields to use for column definitions
        // If bodyData is empty, we'll use all fields from headerData
        const hasBodyData = bodyData && bodyData.length > 0;
        const sampleRow = hasBodyData ? bodyData[0] : null;
        const actualFields = sampleRow ? Object.keys(sampleRow) : [];

        // Detect boolean columns
        const booleanColumns = new Set<string>();
        if (hasBodyData && sampleRow) {
            for (const field of actualFields) {
                // Check if all values in this column are true/false
                const isBooleanColumn = bodyData.every(row => {
                    const value = row[field]?.r;
                    return value === true || value === false || value === 'true' || value === 'false';
                });

                if (isBooleanColumn) {
                    booleanColumns.add(field);
                }
            }
        }

        // Create column definitions
        let columnDefs: ColDef[];

        if (hasBodyData) {
            // If we have body data, filter columns based on actual data fields
            columnDefs = visibleColumns
                .filter(col => actualFields.includes(col.fieldName))
                .map(col => createColumnDef(col, booleanColumns.has(col.fieldName)));

            // If no columns were found, create columns based only on the body data
            if (columnDefs.length === 0 && sampleRow) {
                columnDefs = actualFields.map(field => ({
                    headerName: headerMapping[field] || field,
                    field: field,
                    filter: true,
                    sortable: true,
                    resizable: true,
                    editable: true,
                    width: 150,
                    ...(booleanColumns.has(field) && {
                        cellRenderer: Badge,
                        cellRendererParams: {
                            getBadgeValue: (params: any) => {
                                const value = params.value;
                                return {
                                    value: value === true || value === true ? 'true' : 'false',
                                    variant: value === true || value === true ? 'success' : 'danger'
                                };
                            }
                        }
                    }),
                    valueGetter: (params) => {
                        const cellValue = (params.data as GridRowData)[field];
                        return cellValue?.r;
                    },
                    valueSetter: (params) => {
                        const data = params.data as GridRowData;
                        if (!data[field]) data[field] = {};
                        const originalR = data[field]?.r;
                        data[field] = { v: params.newValue, r: originalR };
                        return true;
                    },
                }));
            }
        } else {
            // If no body data, create columns based on all header fields
            columnDefs = visibleColumns.map(col => createColumnDef(col, false));
        }

        // Process action data if provided
        const actions = actionData ? actionData
            .filter(action => action.is_active?.r === 1)
            .sort((a, b) => (a.display_order?.r || 0) - (b.display_order?.r || 0)) : [];

        // Add actions column if we have action data
        if (actions && actions.length > 0) {
            columnDefs.push({
                headerName: "",
                field: "actions",
                sortable: false,
                filter: false,
                resizable: true,
                width: 150,
                cellRenderer: Badge,
                cellRendererParams: {
                    actions: actions.map(action => ({
                        name: action.name?.r,
                        displayName: translate(action, language ?? "vi"),
                        cssClass: action.css_class?.r,
                        icon: action.icon?.r,
                        urlLink: action.url_link?.r,
                        isNewTab: action.is_new_tab?.r === 1,
                        isAjaxModal: action.is_ajax_modal?.r === 1
                    }))
                }
            });
        }

        // Make sure rowData is an array, even if empty
        const rowData = bodyData || [];

        return { rowData, columnDefs, tableName, actions };
    }
    catch (error) {
        console.error("Error generating grid data:", error);
        return { rowData: [], columnDefs: [], tableName: "", actions: [] };
    }
}

// Helper function to create a column definition
function createColumnDef(col: { fieldName: string; displayName: string; width: string; isEditable: boolean }, isBoolean: boolean): ColDef {
    return {
        headerName: col.displayName,
        field: col.fieldName,
        filter: true,
        sortable: true,
        resizable: true,
        editable: col.isEditable,
        width: parseInt(col.width) || 150,
        ...(isBoolean && {
            cellRenderer: Badge,
            cellRendererParams: {
                getBadgeValue: (params: any) => {
                    const value = params.value;
                    return {
                        value: value === true || value === true ? 'true' : 'false',
                        variant: value === true || value === true ? 'success' : 'danger'
                    };
                }
            }
        }),
        valueGetter: (params) => {
            const cellValue = (params.data as GridRowData)[col.fieldName];
            return cellValue?.r;
        },
        valueSetter: (params) => {
            const data = params.data as GridRowData;
            if (!data[col.fieldName]) data[col.fieldName] = {};
            const originalR = data[col.fieldName]?.r;
            data[col.fieldName] = { v: params.newValue, r: originalR };
            return true;
        },
    };
}

export function filterActionTable(actions: ActionData[] | undefined) {
    return actions === undefined ? [] : actions.filter(item => (item.form_type?.v as string)?.defaultViewMode === ViewMode.TABLE);
}