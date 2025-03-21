import React, {useMemo} from 'react';
import {ActionData} from "@/common/utils.ag-grid";
import ActionCellButton, {ActionButtonType} from "@/components/cell/ActionCell";
import {ChevronLeftIcon, Filter} from "@/icons";
import {ResponseModel} from "@/model/response/base.model";
import {CellAction} from "@/common/lib.enum";
import {useTranslate} from "@/hooks/useTranslate";
import cellAction from "@/common/messages/cellAction.json"
import cellPagination from "@/common/messages/cellPagination.json"
import TableSettingsAction from "@/components/gen-data/gen-data-setting";
import {GridCreateIcon, GridDeleteIcon, GridEditIcon, GridExportIcon, GridViewIcon} from "@/icons/grid-icons";
import Tooltip from "@/components/ui/other/tooltip";
import Select from "@/components/ui/other/select";

interface ActionCellRendererProps {
    action?: ActionData[];
    selectedRows?: ResponseModel[];
    openFilter: () => void;
    onActionClick?: (actionType: CellAction, data: ResponseModel[]) => void;
    toggleLayout?: () => void;
}

class ActionTypeStrategy {
    static determineButtonType(actionType: CellAction, selectedRowsLength: number): ActionButtonType {
        switch (actionType) {
            case CellAction.CREATE:
                return "default";

            case CellAction.VIEW:
            case CellAction.DOWNLOAD:
            case CellAction.CONFIRM:
            case CellAction.EDIT:
                return selectedRowsLength === 1 ? "default" : "disable";

            case CellAction.DELETE:
                return selectedRowsLength >= 1 ? "highlight" : "disable";

            case CellAction.EXPORT:
                return selectedRowsLength >= 1 ? "default" : "disable";

            case CellAction.IMPORT:
                return "default";

            default:
                return "default";
        }
    }

    static getCellIcon = (action: CellAction) => {
        switch (action) {
            case CellAction.CREATE:
                return <GridCreateIcon />;
            case CellAction.VIEW:
                return <GridViewIcon />;
            case CellAction.DELETE:
                return <GridDeleteIcon />;
            case CellAction.EDIT:
                return <GridEditIcon />;
            case CellAction.DOWNLOAD:
            case CellAction.IMPORT:
            case CellAction.EXPORT:
            case CellAction.CONFIRM:
                return <GridExportIcon />;
            default:
                return null;
        }
    };
}

export const ActionCellRenderer = ({ action, selectedRows, openFilter, onActionClick, toggleLayout }: ActionCellRendererProps) => {
    const translate = useTranslate();

    const getButtonType = (actionType?: { v: CellAction }): ActionButtonType => {
        if (!actionType?.v) return "disable";
        if(selectedRows === undefined) return "disable";
        return ActionTypeStrategy.determineButtonType(actionType.v, selectedRows.length);
    };

    const getButtonIcon = (actionType?: { v: CellAction }) => {
        if (!actionType?.v) return null;
        return ActionTypeStrategy.getCellIcon(actionType.v);
    };

    const handleActionClick = (actionType: CellAction) => {        
        if (selectedRows && onActionClick) {
            onActionClick(actionType, selectedRows);
        }
    };
    return (
        <div
            className="isolate box-border flex flex-wrap md:flex-nowrap gap-2 p-2 justify-center items-center h-auto dark:bg-[#1F2836] bg-white rounded-t-3xl p-4">

            {/* Hàng 1 */}
            <div className="isolate box-border flex flex-row gap-2 items-center justify-between">
                {action?.map((item, index) => (
                    <Tooltip key={index} text={translate(item)} position="bottom">
                        <ActionCellButton
                            type={getButtonType(item.action)}
                            onClick={() => item.action?.v && handleActionClick(item.action.v)}
                        >
                            {getButtonIcon(item.action)}
                        </ActionCellButton>
                    </Tooltip>
                ))}
            </div>

            <div className="block isolate box-border flex-grow"></div>

            {/* Hàng 2 */}
            <div className="isolate box-border flex md:flex-row w-full md:justify-end justify-between items-center">
                {/* Translate bên trái */}
                <div className="text-slate-400 dark:text-white-200 ml-2 mr-4">
                    {translate(cellAction.placeholder)}
                </div>

                {/* Các button bên phải */}
                <div className="flex flex-row gap-2">
                    <ActionCellButton type={"default"}>
                        <TableSettingsAction toggleLayout={toggleLayout}/>
                    </ActionCellButton>

                    <ActionCellButton type={"default"} onClick={openFilter}>
                        <Filter/>
                    </ActionCellButton>
                </div>
            </div>
        </div>

    );
};

export const PaginationCellRenderer = ({
                                           pageSize,
                                           setPageSize,
                                           pageNumber,
                                           setPageNumber,
                                           totalRecords,
                                       }: {
    pageSize: number;
    setPageSize: (size: number) => void;
    pageNumber: number;
    setPageNumber: (num: number) => void;
    totalRecords: number;
}) => {
    const translate = useTranslate();

    const totalPages = useMemo(() => {
        return pageSize > 0 ? Math.ceil(totalRecords / pageSize) : 1;
    }, [totalRecords, pageSize]);

    const canGoPrev = pageNumber > 1;
    const canGoNext = pageNumber < totalPages;

    return (
        <div
            className="isolate text-sm box-border flex flex-row gap-2 justify-between md:justify-end items-center h-16 dark:bg-[#1F2836] bg-white rounded-b-3xl p-0 md:p-4">
            <div className="min-w-24 max-w-58 h-10 flex items-center justify-center">
                <span className=" hidden md:inline-block">{translate(cellPagination.paginationPageSize)}</span>
                <Select
                    options={[
                        {value: 10},
                        {value: 25},
                        {value: 50},
                        {value: 100}
                    ]}
                    value={pageSize}
                    onChange={(value) => setPageSize(parseInt(value as string, 10))}
                />
            </div>
            <div className="min-w-24 max-w-32 h-10 flex items-center justify-center pl-6">
                {pageNumber} {translate(cellPagination.of)} {totalPages}
            </div>
            <div className="min-w-24 max-w-32 h-10 flex items-center justify-center gap-2">
                <span
                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 ${
                        canGoPrev ? "hover:bg-gray-200 active:bg-gray-300 cursor-pointer" : "cursor-not-allowed opacity-50"
                    }`}
                    onClick={() => canGoPrev && setPageNumber(pageNumber - 1)}
                >
                    <ChevronLeftIcon/>
                </span>
                <span
                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 rotate-180 ${
                        canGoNext ? "hover:bg-gray-200 active:bg-gray-300 cursor-pointer" : "cursor-not-allowed opacity-50"
                    }`}
                    onClick={() => canGoNext && setPageNumber(pageNumber + 1)}
                >
                    <ChevronLeftIcon/>
                </span>
            </div>
        </div>
    );
};
