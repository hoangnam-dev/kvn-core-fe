/* eslint-disable */

import React, { useMemo, useRef, useState, useEffect } from "react";
import {AgGridReact} from "ag-grid-react";
import {filterActionTable, generateGridData} from "@/common/utils.ag-grid";
import type { GridOptions, RowSelectionOptions} from "ag-grid-community";
import {colorSchemeDarkBlue, colorSchemeLightCold, themeMaterial} from "ag-grid-community";
import {useTheme} from "@/context/ThemeContext";
import {ActionCellRenderer, PaginationCellRenderer} from "@/components/gen-data/gen-data-cell";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@/store/redux";
import {getMasterIdByName} from "@/store/feats/MasterData/masterData.action";
import {selectCurrentLanguage} from "@/store/feats/Language/language.selectors";
import FilterModal from "@/components/gen-data/gen-data-filter";
import {CellAction} from "@/common/lib.enum";
import {ResponseModel} from "@/model/response/base.model";
import {Modal} from "@/components/ui/modal/popup-modal";
import fetchRowDetail from "@/actions/GetData/getDataDetail";
import deleteData from "@/actions/DeleteData/DeleteData";
import addData from "@/actions/AddData/AddData";
import editData from "@/actions/EditData/EditData";
import {GenDataResBody} from "@/model/request/genData";
import GridCellAction from "@/common/messages/cellAction.json"
import DynamicForm from "../form/add-form";
import {AG_GRID_LOCALE_EN, AG_GRID_LOCALE_JP, AG_GRID_LOCALE_VN} from "@ag-grid-community/locale";
import useWindowSize from "@/hooks/useWindowsSize";
import {useBottomLeftNotification} from "@/hooks/useBottomLeftNotification";
import AlertContent from "@/common/messages/alert.json";
import {useTranslate} from "@/hooks/useTranslate";
import BadgeBoolean from "@/components/ui/badge/BadgeBoolean";
import GridChildren from "@/components/gen-data/gen-data-children";
import fetchGridData from "@/actions/GetData/getData";

export default function DynamicGrid({ childData, headerData, bodyData, haveChild = false, isChildren = false, actionData, tableName, onAddSuccess, positionChild}:
    { childData?: any[], headerData: any[], bodyData: any[], haveChild?: boolean, isChildren: boolean, actionData: any[], tableName: string, onAddSuccess: any, positionChild?: 'vertical' | 'horizontal' | undefined }) {
    const currentLanguage = useSelector(selectCurrentLanguage);
    const dispatch = useDispatch<AppDispatch>();
    const config = generateGridData(headerData, bodyData, actionData, currentLanguage);
    const { theme } = useTheme();
    const translate = useTranslate();
    const notification = useBottomLeftNotification();

    const [pageSize, setPageSize] = useState<number>(50);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const gridRef = useRef<any>(null);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [configRows, setConfigRows] = useState<any[]>(config.rowData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState<string>("");
    const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
    const [currentAction, setCurrentAction] = useState<CellAction | null>(null);
    const [viewData, setViewData] = useState<ResponseModel | null>(null);
    const [detailData, setDetailData] = useState<any[]>([]);
    const [editFormData, setEditFormData] = useState<{}>({});
    const [isFullWidth, setIsFullWidth] = useState(true);
    const [size, setSize] = useState<number>(50);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        if (isFullWidth) {
            const newHeight = (e.clientY / window.innerHeight) * 100;
            setSize(Math.min(80, Math.max(20, newHeight)));
        } else {
            const newWidth = (e.clientX / window.innerWidth) * 100;
            setSize(Math.min(80, Math.max(20, newWidth)));
        }
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging]);

    const toggleLayout = () => {
        setIsFullWidth(!isFullWidth);
    };

    const rowSelection = useMemo<RowSelectionOptions>(() => {
        return {
            mode: 'multiRow',
        };
    }, []);
    const gridOptions: GridOptions = {
        autoSizePadding: 10,
        suppressAutoSize: false,
        selectionColumnDef: {
            pinned: "left",
            width: 60,
        }
    };
    const WindowsSize = useWindowSize();
    const gridHeight = useMemo(() => WindowsSize.height - 270, [WindowsSize.height])
    const paginatedRows = useMemo(() => {
        if (!config.rowData) return [];

        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return config.rowData.slice(startIndex, endIndex);

    }, [pageNumber, pageSize, config.rowData]);
    const localeText = useMemo(() => {
        switch (currentLanguage) {
            case "vn":
                return AG_GRID_LOCALE_VN;
            case "en":
                return AG_GRID_LOCALE_EN;
            case "ja":
                return AG_GRID_LOCALE_JP;
        }
    }, [currentLanguage]);
    const CustomTheme = theme === "dark"
        ? themeMaterial.withPart(colorSchemeDarkBlue).withParams(
            {
                headerTextColor: "rgb(204, 245, 172)",
                selectedRowBackgroundColor: 'rgba(0, 255, 0, 0.1)',
                rangeSelectionBorderColor: 'rgb(193, 0, 97)',
                rangeSelectionBorderStyle: 'dashed',
                rangeSelectionBackgroundColor: 'rgb(255, 0, 128, 0.1)',
                rangeSelectionHighlightColor: 'rgb(60, 188, 0, 0.3)',
            })
        : themeMaterial.withPart(colorSchemeLightCold).withParams(
            {
                selectedRowBackgroundColor: 'rgba(0, 255, 0, 0.1)',
                rangeSelectionBorderColor: 'rgb(193, 0, 97)',
                rangeSelectionBorderStyle: 'dashed',
                rangeSelectionBackgroundColor: 'rgb(255, 0, 128, 0.1)',
                rangeSelectionHighlightColor: 'rgb(60, 188, 0, 0.3)',
            }
        );


    useEffect(() => {
        setConfigRows(prevRows => {
            return JSON.stringify(prevRows) === JSON.stringify(paginatedRows) ? prevRows : paginatedRows;
        });
    }, [paginatedRows]);

    useEffect(() => {
        if (isModalOpen && (currentAction === CellAction.VIEW || currentAction === CellAction.EDIT)) {
            setModalContent(renderModalContent(currentAction, viewData ? [viewData] : null));
        }
    }, [detailData, isModalOpen, currentAction, viewData, editData]);

    const onSelectionChanged = () => {
        if (gridRef.current) {
            const selectedData = gridRef.current.api.getSelectedRows();
            setSelectedRows(selectedData);
        }
    };

    function fetchData(dataDetail: GenDataResBody, childData?: GenDataResBody): Promise<[any[], any[]?]> {
        return Promise.all([
            fetchRowDetail(dataDetail),
            fetchGridData(childData)
        ]);
    }

    const handleFetchData = () => {
        if (!selectedRows[0]) return;
        const primaryField = headerData.find(item => item.is_primary_key.v === 1);
        if (!primaryField) return;
        const colName = primaryField.name?.v;
        if (!colName) return;
        const detailRequest: GenDataResBody = {
            data: {
                cols: "*",
                colName: primaryField.name.v,
                tableName: primaryField.table_name.v,
                tableId: dispatch(getMasterIdByName(primaryField.table_name.v)),
                rowId: selectedRows[0][primaryField.name.v].v
            },
            appVersion: "",
            reqTime: "",
            token: "",
        };

        fetchData(detailRequest)
            .then(([detail]) => {
                setEditFormData(detail)
                const sortedHeaderData = [...headerData].sort((a, b) => {
                    const orderA = a.display_order?.v || 0;
                    const orderB = b.display_order?.v || 0;
                    return orderA - orderB;
                });

                const detailMapping = sortedHeaderData.reduce((acc, headerItem) => {
                    const key = translate(headerItem);
                    const detailKey = headerItem.name.v;
                    acc[key] = detail[detailKey]?.r;
                    return acc;
                }, {});

                setDetailData(detailMapping);
            })
            .catch(() => {
                setEditFormData({});
                setDetailData([]);
            });
    };

    const handleDeleteData = async () => {
        const primaryField = headerData.find(item => item.is_primary_key.v === 1);
        const resultArray = selectedRows.map(row => row[primaryField.name.v]?.v);
        const deleteRequest: GenDataResBody = {
            data: {
                colId: primaryField.true_column_name.v,
                tableName: tableName,
                ids: resultArray
            },
            appVersion: "",
            reqTime: "",
            token: "",
        };
        deleteData(deleteRequest)
            .then(() => {
                if (deleteRequest && deleteRequest.data) {
                    const idsToDelete = deleteRequest.data.ids || [];
                    const colId = deleteRequest.data.colId;
                    if (idsToDelete.length > 0 && colId) {
                        config.rowData = config.rowData.filter(row =>
                            !idsToDelete.includes(row[primaryField.name.v]?.v)
                        );
                        const newTotalRecords = config.rowData.length;
                        const maxPageNumber = Math.max(1, Math.ceil(newTotalRecords / pageSize));
                        const newPageNumber = Math.min(pageNumber, maxPageNumber);
                        const startIndex = (newPageNumber - 1) * pageSize;
                        const endIndex = startIndex + pageSize;
                        const updatedRows = config.rowData.slice(startIndex, endIndex);

                        setConfigRows(updatedRows);
                        setPageNumber(newPageNumber);

                        notification.success({
                            message: translate(AlertContent.Success.Message),
                            title: translate(AlertContent.Success.Title)
                        })
                    } else {
                        notification.error({
                            message: translate(AlertContent.Failed.Message),
                            title: translate(AlertContent.Failed.Title)
                        })
                    }
                }
            })
            .catch((e: Error) => {
                notification.error({
                    message: e.message,
                    title: translate(AlertContent.Failed.Title)
                })
            })
            .finally(() =>setIsModalOpen(false))
    };

    const renderDetailView = () => {
        if (!detailData) return null;

        return (
            <div className="p-4">
                <div className="space-y-2">
                    {Object.entries(detailData).map(([key, value]) => {
                        let booleanValue: boolean | null = null;

                        if (typeof value === "boolean") {
                            booleanValue = value;
                        } else if (typeof value === "string") {
                            const lowerValue = value.trim().toLowerCase();
                            if (lowerValue === "true" || lowerValue === "1") {
                                booleanValue = true;
                            } else if (lowerValue === "false" || lowerValue === "0") {
                                booleanValue = false;
                            }
                        }

                        return (
                            <div key={key} className="flex">
                                <span className="font-light w-40 min-w-[200px] flex-shrink-0 mt-4">{key}:</span>
                                <span className="flex-1 break-words mt-4">
                                {booleanValue !== null ? (
                                    <BadgeBoolean value={booleanValue} />
                                ) : (
                                    typeof value === "object" && value !== null
                                        ? value.r
                                            ? JSON.stringify(value.r)
                                            : ""
                                        : String(value)
                                )}
                            </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderEditForm = () => {
        if (!headerData || !editFormData) return null;
        return (
            <DynamicForm headerData={headerData} rowData={editFormData} onSubmit={confirmEdit} isUpdate={true}/>
        );
    }
    
    const confirmEdit = async (formValues: Record<string, unknown>) => {
        if (!selectedRows[0]) return;
        const primaryField = headerData.find(item => item.is_primary_key.v === 1);
        if (!primaryField) return;
        const editRequest: GenDataResBody = {
            data: {
                colId: primaryField.true_column_name.v,
                tableName: tableName,
                id: selectedRows[0][primaryField.name.v].v,
                data: formValues,
            },
            appVersion: "",
            reqTime: "",
            token: "",
        };
        editData(editRequest)
            .then(() => {
                if (editRequest && editRequest.data) {
                    setIsModalOpen(false);
                    notification.success({
                        title: 'Success!',
                        message: 'Your operation was completed successfully.',
                        duration: 5000,
                    });
                    onAddSuccess();
                }
            })
            .catch()
    };

    const renderAddForm = () => {
        if (!headerData) return null;
        return (
            <DynamicForm headerData={headerData} onSubmit={handleFormSubmit} />
        );
    };

    const handleFormSubmit = (formValues: Record<string, unknown>) => {
        const primaryField = headerData.find(item => item.is_primary_key.v === 1);
        const addRequest: GenDataResBody = {
            data: {
                tableName: tableName,
                colName: primaryField.name.v,
                data: formValues
            },
            appVersion: "",
            reqTime: "",
            token: "",
        };
        addData(addRequest)
            .then(() => {
                if (addRequest && addRequest.data) {
                    setIsModalOpen(false);
                    notification.success({
                        title: 'Success!',
                        message: 'Your operation was completed successfully.',
                        duration: 5000,
                    });
                    onAddSuccess();
                }
            })
            .catch()
    };

    const getModalTitle = (action: CellAction) => {
        switch (action) {
            case CellAction.CREATE:
                return translate(GridCellAction.action_create).toUpperCase();
            case CellAction.VIEW:
                return translate(GridCellAction.action_view).toUpperCase();
            case CellAction.DELETE:
                return translate(GridCellAction.action_delete).toUpperCase();
            case CellAction.EDIT:
                return translate(GridCellAction.action_edit).toUpperCase();
            case CellAction.DOWNLOAD:
                return translate(GridCellAction.action_download).toUpperCase();
            case CellAction.IMPORT:
                return translate(GridCellAction.action_import).toUpperCase();
            case CellAction.EXPORT:
                return translate(GridCellAction.action_export).toUpperCase();
            case CellAction.CONFIRM:
                return translate(GridCellAction.action_confirm).toUpperCase();
            default:
                return translate(GridCellAction.action_info).toUpperCase();
        }
    };

    const renderModalContent = (action: CellAction, data: ResponseModel[] | null) => {
        switch (action) {
            case CellAction.CREATE:
                return (
                    <div>
                        {renderAddForm()}
                    </div>
                );
            case CellAction.VIEW:
                if (data && data.length === 1) {
                    return (
                        <div>
                            {renderDetailView()}
                        </div>
                    );
                }
                break;
            case CellAction.EDIT:
                if (data && data.length === 1) {
                    return (
                        <div>
                            {renderEditForm()}
                        </div>
                    )
                }
                break;
            case CellAction.DELETE:
                if (data && data.length > 0) {
                    return (
                        <div className="p-4">
                            <p className="mb-4">
                                {translate(GridCellAction.ConfirmDelete).replace("{}", data.length.toString())}
                            </p>
                            <div className="flex justify-end space-x-2">
                                <button
                                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    {translate(GridCellAction.Cancel)}
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    onClick={handleDeleteData}
                                >
                                    {translate(GridCellAction.Delete)}
                                </button>
                            </div>
                        </div>
                    );
                }
                break;
            case CellAction.DOWNLOAD:
            case CellAction.IMPORT:
            case CellAction.EXPORT:
            case CellAction.CONFIRM:
            default:
                return <div>Chưa định nghĩa nội dung cho hành động này</div>;
        }
    };

    const handleActionClick = (actionType: CellAction, data: ResponseModel[]) => {
        setCurrentAction(actionType);
        if ((actionType === CellAction.VIEW || actionType === CellAction.EDIT) && data.length === 1) {
            setViewData(data[0]);
            handleFetchData();
        }
        setModalTitle(getModalTitle(actionType));
        setModalContent(renderModalContent(actionType, data));
        setIsModalOpen(true);
    };

    const customHeight = 'calc(100vh - 130px)';

    if(isChildren){
        console.log(positionChild)
        return renderGrid(true, positionChild)
    }

    if(haveChild){
        return (
            <div className={`w-full flex flex-col`} style={{height: customHeight}}>
                <div className="flex-1 overflow-hidden">
                    {isFullWidth ? (
                        <div className="flex flex-col h-full">
                            <div className="flex flex-col w-full" style={{height: `${size}%`}}>
                                {renderGrid(false, 'vertical')}
                            </div>
                            <div className="flex flex-col w-full" style={{height: `${100 - size}%`}}>
                                <GridChildren childData={childData} selectedRows={selectedRows} positionChild={'vertical'}/>
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-full">
                            <div className="flex flex-col" style={{width: `${size}%`, height: customHeight}}>
                                {renderGrid(false, 'horizontal')}
                            </div>

                            <div
                                className="relative mx-4 h-full bg-neutral-300 transition-transform duration-300 w-[2px] origin-center scale-x-100 hover:scale-x-[3] hover:bg-gray-300 cursor-ew-resize"
                                onMouseDown={handleMouseDown}
                            />

                            <div className="flex flex-col" style={{width: `${100 - size}%`, height: customHeight}}>
                                <GridChildren childData={childData} selectedRows={selectedRows} positionChild={'horizontal'}/>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    } else {
        return renderGrid(true);
    }

    function renderGrid(isFull: boolean, position?: 'vertical' | 'horizontal') {
        let height = isFull ? gridHeight : position === 'horizontal' ? gridHeight : gridHeight / 2 - 76;
        if(isChildren){
            if(position === 'horizontal'){
                height = height - 100 > 100 ? height - 100 : 100;
            } else {
                height = height - 500 > 100 ? height - 500 : 100;
            }
        }
        return (
            <div className="ag-theme-material">
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-2xl">
                    <div className="p-4">
                        <h2 style={{ borderBottom: "1px solid lightgrey", paddingTop: "1rem" }} className="text-lg font-bold px-4 pb-6">
                            {modalTitle}
                        </h2>
                        {modalContent}
                    </div>
                </Modal>

                <ActionCellRenderer
                    action={filterActionTable(config.actions)}
                    selectedRows={selectedRows}
                    openFilter={() => setIsOpenFilter(true)}
                    onActionClick={handleActionClick}
                    toggleLayout={toggleLayout}
                />

                <div className="ag-theme-material h-full" style={{ height: height + "px", width: "100%" }}>
                    <AgGridReact
                        ref={gridRef}
                        rowData={configRows}
                        columnDefs={config.columnDefs}
                        pagination={false}
                        paginationPageSize={10}
                        theme={CustomTheme}
                        rowSelection={rowSelection}
                        gridOptions={gridOptions}
                        onSelectionChanged={onSelectionChanged}
                        // getLocaleText={(params: GetLocaleTextParams) => {console.log("Key:", params.key, "Default Value:", params.defaultValue);
                        //     const customTranslations: Record<string, string> = {
                        //         'page': translate(GridPagination.page, currentLanguage),
                        //         'to': translate(GridPagination.to, currentLanguage),
                        //         'of': translate(GridPagination.of, currentLanguage),
                        //         'next': translate(GridPagination.next, currentLanguage),
                        //         'previous': translate(GridPagination.previous, currentLanguage),
                        //         'paginationPageSize': translate(GridPagination.paginationPageSize, currentLanguage),
                        //         'pageSizeSelectorLabel': translate(GridPagination.pageSizeSelectorLabel, currentLanguage),
                        //         'ariaPageSizeSelectorLabel': translate(GridPagination.ariaPageSizeSelectorLabel, currentLanguage),
                        //         'noRowsToShow': translate(GridPagination.noRowsToShow, currentLanguage),
                        //     };
                        //     return customTranslations[params.key] || params.defaultValue;
                        // }}
                        localeText={localeText}
                    />
                </div>

                <PaginationCellRenderer
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    totalRecords={config.rowData.length}
                />

                <FilterModal isOpenFilter={isOpenFilter} closeFilter={() => setIsOpenFilter(false)} />
            </div>
        );
    }
}