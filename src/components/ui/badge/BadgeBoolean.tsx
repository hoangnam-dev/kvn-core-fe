import React from "react";
import Badge from "./Badge";
import {useTranslate} from "@/hooks/useTranslate";

type BadgeBooleanProps = {
    value: boolean;
};

const CheckCircleSVG = (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img"
         className="MuiBox-root css-1t9pz9x iconify iconify--eva" width="1em" height="1em" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8"></path>
        <path fill="currentColor"
              d="m14.7 8.39l-3.78 5l-1.63-2.11a1 1 0 0 0-1.58 1.23l2.43 3.11a1 1 0 0 0 .79.38a1 1 0 0 0 .79-.39l4.57-6a1 1 0 1 0-1.6-1.22Z"></path>
    </svg>
);

const XCircleSVG = (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img"
         className="MuiBox-root css-1t9pz9x iconify iconify--eva" width="1em" height="1em" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8"></path>
        <path fill="currentColor"
              d="M14.71 9.29a1 1 0 0 0-1.42 0L12 10.59l-1.29-1.3a1 1 0 0 0-1.42 1.42l1.3 1.29l-1.3 1.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l1.29-1.3l1.29 1.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42L13.41 12l1.3-1.29a1 1 0 0 0 0-1.42"></path>
    </svg>
);

const DisplayText = {
    true: {
        "vn_name": "Đúng",
        "en_name": "True",
        "ja_name": "正しい"
    },
    false: {
        "vn_name": "Sai",
        "en_name": "False",
        "ja_name": "間違い"
    }
};


const BadgeBoolean: React.FC<BadgeBooleanProps> = ({value}) => {
    const translate = useTranslate();
    return (
        <Badge
            variant="light"
            color={value ? "success" : "warning"}
            startIcon={value ? CheckCircleSVG : XCircleSVG}
        >
            {value ?
                translate(DisplayText.true):
                translate(DisplayText.false)
            }
        </Badge>
    );
};

export default BadgeBoolean;