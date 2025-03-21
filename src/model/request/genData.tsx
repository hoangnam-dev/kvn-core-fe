/* eslint-disable */
export interface GenDataResBodyData {
    cols?: string | null;
    currentIndex?: string | null;
    extendMore?: string | null;
    isAction?: string | null;
    moreExp?: string | null;
    moreExpListForm?: string | null;
    nextIndex?: number | null;
    scopeMore?: string | null;
    sortExp?: string | null;
    tableName?: string | null;
    tableId?: number | null;
    colName?: string | null;
    rowId?: number |  null;
    ids?: any[] | null;
    colId?: string | null;
    id?: number | null;
    data?: object | null;
}

export interface GenDataResBody {
    appVersion?: string | null;
    data?: GenDataResBodyData | null;
    reqTime?: string | null;
    token?: string | null;
}
