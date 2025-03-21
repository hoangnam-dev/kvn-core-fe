import React, { useEffect } from "react";
import Button from "@/components/ui/button/Button";
import TextFormJson from "@/common/messages/filter.json"
import {translate} from "@/common/utils.translator";
import {useSelector} from "react-redux";
import {selectCurrentLanguage} from "@/store/feats/Language/language.selectors";

interface FilterModalProps {
    isOpenFilter: boolean;
    closeFilter: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpenFilter, closeFilter }) => {
    const currentLanguage = useSelector(selectCurrentLanguage);

    useEffect(() => {
        if (isOpenFilter) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpenFilter]);

    if (!isOpenFilter) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-xs bg-black/10 flex justify-end z-50 overflow-hidden">
            <div className="w-full md:w-1/3 bg-white h-full p-6 shadow-lg flex flex-col">
                <h2 className="text-lg font-semibold mb-4">
                    {translate(TextFormJson.header, currentLanguage)}
                </h2>

                {/* Nội dung modal có thể cuộn nếu dài */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {Array.from({length: 30}, (_, i) => (
                        <div key={i}>
                            <label className="block text-sm font-medium text-gray-700">Demo {i + 1}</label>
                            <input type="text" className="w-full border rounded-md p-2"/>
                        </div>
                    ))}
                </div>

                <hr
                    style={{borderBottom: "1px solid lightgrey", paddingTop: "1rem"}}
                ></hr>
                {/* Các nút hành động */}
                <div className="flex justify-end gap-2 mt-4">
                    <Button className="h-10" variant="success">
                        {translate(TextFormJson.action_filter, currentLanguage)}
                    </Button>
                    <Button className="h-10" variant="self_danger">
                        {translate(TextFormJson.action_reset, currentLanguage)}
                    </Button>
                    <Button className="h-10" variant="outline" onClick={closeFilter}>
                        {translate(TextFormJson.action_close, currentLanguage)}
                    </Button>

                </div>
            </div>
        </div>
    );
};

export default FilterModal;
