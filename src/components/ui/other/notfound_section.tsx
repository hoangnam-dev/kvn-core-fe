'use client'

import {useSelector} from "react-redux";
import {selectCurrentLanguage} from "@/store/feats/Language/language.selectors";

export const NotExistSection = () => {
    const currentLanguage = useSelector(selectCurrentLanguage);

    const translations = {
        vn: {
            title: 'Không tìm thấy dữ liệu',
            message: 'Rất tiếc, dữ liệu bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.',
            button: 'Quay lại'
        },
        en: {
            title: 'Data Not Found',
            message: 'Sorry, the data you are looking for does not exist or has been deleted.',
            button: 'Go Back'
        },
        ja: {
            title: 'データが見つかりません',
            message: '申し訳ありませんが、お探しのデータは存在しないか、削除されました。',
            button: '戻る'
        }
    };

    const text = translations[currentLanguage] || translations.vn;

    return (
        <div className="mt-[50px] flex flex-col min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md p-8 mx-auto bg-white rounded-lg shadow-md text-center">
                <div className="mb-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-32 h-32 mx-auto text-gray-700"
                        viewBox="-20 0 190 190"
                        fill="none"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M38.155 140.475L48.988 62.1108L92.869 67.0568L111.437 91.0118L103.396 148.121L38.155 140.475ZM84.013 94.0018L88.827 71.8068L54.046 68.3068L44.192 135.457L98.335 142.084L104.877 96.8088L84.013 94.0018ZM59.771 123.595C59.394 123.099 56.05 120.299 55.421 119.433C64.32 109.522 86.05 109.645 92.085 122.757C91.08 123.128 86.59 125.072 85.71 125.567C83.192 118.25 68.445 115.942 59.771 123.595ZM76.503 96.4988L72.837 99.2588L67.322 92.6168L59.815 96.6468L56.786 91.5778L63.615 88.1508L59.089 82.6988L64.589 79.0188L68.979 85.4578L76.798 81.5328L79.154 86.2638L72.107 90.0468L76.503 96.4988Z"
                            fill="currentColor"
                        />
                    </svg>
                </div>

                <h1 className="text-2xl font-medium text-gray-900 mb-2">{text.title}</h1>
                <p className="text-gray-600 mb-6">
                    {text.message}
                </p>

                <button
                    className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                    onClick={() => window.history.back()}
                >
                    {text.button}
                </button>
            </div>
        </div>
    );
};