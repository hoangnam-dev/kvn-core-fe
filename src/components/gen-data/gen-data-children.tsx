'use client';

import React from 'react';
import NotificationCenter from "@/components/ui/alert/Notications";
import { useTranslate } from "@/hooks/useTranslate";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/tabs';
import {ResponseModel} from "@/model/response/base.model";
import GenGrid from "@/components/gen-data/gen-data"; // Ensure correct path

interface GridChildrenProps {
    selectedRows?: ResponseModel[];
    childData?: ResponseModel[];
    positionChild?: 'vertical' | 'horizontal' | undefined;
}

const DisplayTextWhenEmpty = {
    'Title': {
        "vn_name": "Thông tin chi tiết",
        "en_name": "Details",
        "ja_name": "詳細情報"
    },
    'Message': {
        "vn_name": "Vui lòng chọn một mục để xem thông tin chi tiết.",
        "en_name": "Please select an item to view details.",
        "ja_name": "詳細を表示するには、項目を選択してください。"
    }
};

const GridChildren: React.FC<GridChildrenProps> = ({selectedRows, childData, positionChild}) => {
    const translate = useTranslate();

    if ((selectedRows?.length ?? 0) !== 1 || childData === undefined) {
        return (
            <NotificationCenter
                title={translate(DisplayTextWhenEmpty.Title)}
                message={translate(DisplayTextWhenEmpty.Message)}
            />
        );
    }

    const normalizeTab = (tab: ResponseModel) => ({
        vn_name: (tab.vn_name?.v ?? "tab không đặt tên").toUpperCase(),
        ja_name: (tab.ja_name?.v ?? "tab not set name").toUpperCase(),
        en_name: (tab.en_name?.v ?? "タブ名が設定されていません").toUpperCase(),
    });

    return (
        <Tabs defaultTab={childData.length > 0 ? "0" : "customers"}>
            <div className="rounded-3xl">
                <TabsList>
                    {childData
                        .sort((a, b) => (a.display_order?.v || 0) - (b.display_order?.v || 0)) // Sắp xếp theo display_order
                        .map((tab, index) => (
                            <TabsTrigger key={String(tab.id)} id={index.toString()}>
                                {String(translate(normalizeTab(tab)))}
                            </TabsTrigger>
                        ))}
                </TabsList>
            </div>
            <div>
                {childData
                    .map((tab, index) => (
                        <TabsContent key={String(tab.id)} id={index.toString()}>
                            <GenGrid id={Number(tab.table_child?.v)} name={"vw_project_members_es"} haveChildren={false} isChildren={true} positionChild={positionChild}/>
                        </TabsContent>
                    ))}
            </div>
        </Tabs>
    );
};

export default GridChildren;