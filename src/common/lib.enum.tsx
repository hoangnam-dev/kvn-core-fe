///View Mode

export enum ViewMode {
    TABLE = "table",
    LIST = "list",
}

declare global {
    interface String {
        defaultViewMode: ViewMode;
    }
}

if (!Object.prototype.hasOwnProperty.call(String.prototype, "defaultViewMode")) {
    Object.defineProperty(String.prototype, "defaultViewMode", {
        get: function () {
            return this.toLowerCase() === ViewMode.TABLE ? ViewMode.TABLE : ViewMode.LIST;
        },
        configurable: true,
        enumerable: false,
    });
}



// Action Cell

export enum CellAction {
    CREATE = 1,
    VIEW = 2,
    DELETE = 3,
    EDIT = 4,
    DOWNLOAD = 5,
    IMPORT = 6,
    EXPORT = 7,
    CONFIRM = 8
}

export enum DataType
    {
        Boolean = 1,
        Currency = 2,
        Date = 3,
        DateTime = 4,
        Email = 5,
        ImageUrl = 6,
        Number = 7,
        RichText = 8,
        MultiLabel = 9,
        SingleLabel = 10,
        Text = 11,
        Link = 12,
        Reference1_1_ID = 13,
        Reference1_N_IDs = 14,
        Float = 15,
        Time = 16,
        FileUrl = 17,
        Tree = 18,
        Year = 19,
        Month = 20,
        Reference1_N_Objects = 21
    }