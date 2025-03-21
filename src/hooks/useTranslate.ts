import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "@/store/feats/Language/language.selectors";

export const useTranslate = () => {
    const language = useSelector(selectCurrentLanguage);

    return (data: {
        vn_name: { v: string; r: string } | string;
        ja_name: { v: string; r: string } | string;
        en_name: { v: string; r: string } | string;
    }) => {
        const getValue = (field: { v: string; r: string } | string) =>
            typeof field === "string" ? field : field?.r || "";

        switch (language) {
            case "vn":
                return getValue(data.vn_name);
            case "ja":
                return getValue(data.ja_name);
            case "en":
                return getValue(data.en_name);
            default:
                return getValue(data.vn_name);
        }
    };
};
