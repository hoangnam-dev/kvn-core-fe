export const translate = (
    data: { vn_name?: { v: string; r: string }; ja_name?: { v: string; r: string }; en_name?: { v: string; r: string } },
    language: string
) => {
    switch (language) {
        case "vn":
            return data.vn_name?.r || "";
        case "ja":
            return data.ja_name?.r || "";
        case "en":
            return data.en_name?.r || "";
        default:
            return data.vn_name?.r || "";
    }
};
