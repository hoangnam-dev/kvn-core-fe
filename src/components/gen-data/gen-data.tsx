/* eslint-disable */

"use client";

import { useEffect, useState } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import fetchGridData from "@/actions/GetData/getData";
import fetchGridBody from "@/actions/GetData/getDataPagination";
import { GenDataResBody } from "@/model/request/genData";
import DynamicGrid from "@/components/gen-data/gen-data-load";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@/store/redux";
import {getMasterIdByName} from "@/store/feats/MasterData/masterData.action";
import {updateCurrentListForm} from "@/store/feats/CurrentListForm/currentListForm.slice";
import {ListForm} from "@/store/feats/CurrentListForm/currentListForm.model";
import {selectTableId} from "@/store/feats/MasterData/masterData.selectors";
import Loader from "@/components/single/loader";
import {useBottomLeftNotification} from "@/hooks/useBottomLeftNotification";
import {NotExistSection} from "@/components/ui/other/notfound_section";
import AlertContent from "@/common/messages/alert.json"
import {useTranslate} from "@/hooks/useTranslate";
import LoaderRelative from "@/components/single/relativeLoader";

ModuleRegistry.registerModules([AllCommunityModule]);

interface GenGridProps {
    id: number;
    name: string;
    haveChildren: boolean;
    isChildren?: boolean;
    positionChild?: 'vertical' | 'horizontal' | undefined;
}

function fetchData(
    dataTable: GenDataResBody,
    dataHead: GenDataResBody,
    dataBody: GenDataResBody,
    dataActions: GenDataResBody,
    dataChildTab?: GenDataResBody
): Promise<[any[], any[], any[], any[], any[]?]> {

    const promises: Promise<any[]>[] = [
        fetchGridData(dataTable),
        fetchGridData(dataHead),
        fetchGridBody(dataBody),
        fetchGridData(dataActions)
    ];

    if (dataChildTab) {
        promises.push(fetchGridData(dataChildTab));
    }

    return Promise.all(promises) as Promise<[any[], any[], any[], any[], any[]?]>;
}

export default function GenGrid({ id, name, haveChildren, isChildren, positionChild }: GenGridProps) {
    const dispatch = useDispatch<AppDispatch>();

    const masterData = useSelector(selectTableId);

    const [tableData, setTableData] = useState<string>("");
    const [headerData, setHeaderData] = useState<any[]>([]);
    const [bodyData, setBodyData] = useState<any[]>([]);
    const [actionData, setActionData] = useState<any[]>([]);
    const [childData, setChildData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const notification = useBottomLeftNotification();
    const translate = useTranslate();

    useEffect(() => {
        if(masterData.length === 0) return;
        handleFetchData()
    }, [masterData]);

    const handleFetchData = () => {
        const tableIdFilter = dispatch(getMasterIdByName(name));
        if(!tableIdFilter) {
            notification.error({
                message: translate(AlertContent.AccessDenied.Message),
                title: translate(AlertContent.AccessDenied.Title)
            })
            return;
        }
        const dataTable: GenDataResBody = {
            data: {
                cols: "*",
                moreExp: `name = '${name}'`,
                tableName: "gen_table_defines",
                tableId: dispatch(getMasterIdByName(name))
            },
            appVersion: "",
            reqTime: "",
            token: "",
        };

        const dataChild: GenDataResBody = {
            data: {
                cols: "*",
                moreExp: `table_parent = ${dispatch(getMasterIdByName(name))}`,
                tableName: "tab_defines",
                tableId: dispatch(getMasterIdByName(name))
            },
            appVersion: "",
            reqTime: "",
            token: "",
        };

        const dataHead: GenDataResBody = {
            data: {
                cols: "*",
                moreExp: `table_id = '${dispatch(getMasterIdByName(name))}'`,
                tableName: "gen_row_defines",
                tableId: dispatch(getMasterIdByName(name))
            },
            appVersion: "",
            reqTime: "",
            token: "",
        };

        const dataBody: GenDataResBody = {
            data: {
                cols: "*",
                moreExp: "",
                tableName: name,
                tableId: dispatch(getMasterIdByName(name))
            },
            appVersion: "",
            reqTime: "",
            token: "",
        };

        const dataAction: GenDataResBody = {
            data: {
                cols: "*",
                moreExp: `table_id = ${dispatch(getMasterIdByName(name))}`,
                tableName: "gen_table_form_actions",
                tableId: 0
            },
            appVersion: "",
            reqTime: "",
            token: "",
        };
        setIsLoading(true);
        fetchData(dataTable, dataHead, dataBody, dataAction, haveChildren ? dataChild : undefined)
            .then(([table, header, body, action, child]) => {
                setTableData(table[0].table_link_info.v);
                setHeaderData(header);

                setBodyData(body);
                dispatch(updateCurrentListForm(body as unknown as ListForm));

                setActionData(action);

                setChildData(child ? child : []);

                notification.hide();

                try {
                    document.title = translate(table[0]);
                } catch {
                    document.title = "KVN Core"
                }
            })
            .catch(() => {
                setTableData("");
                setHeaderData([]);
                setBodyData([]);
                setActionData([]);
                setChildData([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return <>
        {
            isLoading ? (
                isChildren ? (
                    <div className="relative w-full h-[30vh]">
                        <LoaderRelative />
                    </div>
                ) : (
                    <Loader />
                )
            ) : ( headerData.length > 0 ? (
                    <DynamicGrid childData={childData} haveChild={haveChildren} positionChild={positionChild} isChildren={isChildren===undefined?false:isChildren} headerData={headerData} bodyData={bodyData} actionData={actionData} tableName={tableData} onAddSuccess={handleFetchData} />
                ) : (
                        <NotExistSection />
                    )
            )
        }
    </>
}
