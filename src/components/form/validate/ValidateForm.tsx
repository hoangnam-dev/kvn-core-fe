// validateFunctions.ts
import { DataType } from "@/common/lib.enum";

const ValidateForm: Record<DataType, (value: unknown) => string | null> = {
    [DataType.Boolean]: (value) => {
        if (value !== null && value !== undefined && typeof value !== "boolean") {
            return "Giá trị phải là boolean (true/false)";
        }
        return null;
    },
    [DataType.DateTime]: (value) => {
        if (value === null || value === undefined) return null;
        
        if (value instanceof Date && !isNaN(value.getTime())) return null;
        
        if (typeof value === "string") {
            const date = new Date(value);
            if (!isNaN(date.getTime())) return null;
        }
        
        return "Ngày giờ không hợp lệ";
    },
    [DataType.Currency]: (value) => {
        if (value === null || value === undefined) return null;
        if (typeof value === "number") {
            const formatted = value.toFixed(2);
            if (!isNaN(parseFloat(formatted))) return null;
        }
        if (typeof value !== "string" || !/^\d+(\.\d{1,2})?$/.test(value)) {
            return "Giá trị tiền tệ không hợp lệ (VD: 1234.56)";
        }
        return null;
    },
    [DataType.Date]: (value) => {
        if (value === null || value === undefined) return null;
        
        if (value instanceof Date && !isNaN(value.getTime())) return null;
        
        if (typeof value === "string") {
            const date = new Date(value);
            if (!isNaN(date.getTime())) return null;
        }
        
        return "Ngày không hợp lệ";
    },
    [DataType.Email]: (value) => {
        if (value === null || value === undefined) return null;
        if (typeof value !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return "Email không hợp lệ";
        }
        return null;
    },
    [DataType.ImageUrl]: (value) => {
        if (value === null || value === undefined) return null;
        if (typeof value !== "string") {
            return "Đường dẫn hình ảnh không hợp lệ";
        }
        return null;
    },
    [DataType.Number]: (value) => {
        if (value === null || value === undefined) return null;
        if (typeof value === "string") {
            const num = parseInt(value, 10);
            if (!isNaN(num) && num.toString() === value) return null;
        }
        if (typeof value !== "number" || isNaN(value) || !Number.isInteger(value)) {
            return "Giá trị phải là số nguyên";
        }
        return null;
    },
    [DataType.RichText]: (value) => {
        if (value === null || value === undefined) return null;
        if (typeof value !== "string") {
            return "Giá trị phải là chuỗi văn bản giàu định dạng";
        }
        return null;
    },
    [DataType.MultiLabel]: (value) => {
        if (value === null || value === undefined) return null;
        if (!Array.isArray(value) && typeof value !== "string") {
            return "Giá trị nhãn phải là mảng hoặc chuỗi phân cách";
        }
        return null;
    },
    [DataType.SingleLabel]: (value) => {
        if (value === null || value === undefined) return null;
        if (typeof value !== "string" && typeof value !== "number") {
            return "Giá trị nhãn không hợp lệ";
        }
        return null;
    },
    [DataType.Text]: (value) => {
        if (value === null || value === undefined) return null;
        if (typeof value !== "string") {
            return "Giá trị phải là chuỗi";
        }
        return null;
    },
    [DataType.Link]: (value) => {
        if (value === null || value === undefined) return null;
        if (typeof value !== "string") {
            return "Đường dẫn phải là chuỗi";
        }
        return null;
    },
    [DataType.Reference1_1_ID]: (value) => {
        if (value === null || value === "") {
            return "Giá trị tham chiếu không được để trống";
        }
        return null;
    },
    [DataType.Reference1_N_IDs]: (value) => {
        if (value === null || value === undefined) return null;
        
        if (Array.isArray(value)) return null;
        
        if (typeof value === "string") return null;
        
        return "Giá trị tham chiếu không hợp lệ";
    },
    [DataType.Float]: (value) => {
        if (value === null || value === undefined) return null;
        if (typeof value === "string") {
            const num = parseFloat(value);
            if (!isNaN(num)) return null;
        }
        if (typeof value !== "number" || isNaN(value)) {
            return "Giá trị phải là số thực";
        }
        return null;
    },
    [DataType.Time]: (value) => {
        if (value === null || value === undefined) return null;
        
        if (value instanceof Date && !isNaN(value.getTime())) return null;
        
        if (typeof value === "string") {
            // Kiểm tra chuỗi định dạng thời gian (HH:mm:ss hoặc HH:mm)
            if (/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(value)) return null;
            
            // Hoặc kiểm tra nếu có thể chuyển đổi thành Date
            const date = new Date(`1970-01-01T${value}`);
            if (!isNaN(date.getTime())) return null;
        }
        
        return "Thời gian không hợp lệ";
    },
    [DataType.FileUrl]: (value) => {
        if (value === null || value === undefined) return null;
        if (typeof value !== "string") {
            return "Đường dẫn tệp không hợp lệ";
        }
        return null;
    },
    [DataType.Tree]: (value) => {
        if (value === null || value === undefined) return null;
        if (typeof value !== "object" || value === null) {
            return "Dữ liệu cây không hợp lệ";
        }
        return null;
    },
    [DataType.Year]: (value) => {
        if (value === null || value === undefined) return null;
        
        if (typeof value === "number") {
            // Năm hợp lệ thường nằm trong khoảng từ 1900 đến năm hiện tại + 100
            const currentYear = new Date().getFullYear();
            if (value >= 1900 && value <= currentYear + 100) return null;
        }
        
        if (typeof value === "string") {
            const year = parseInt(value, 10);
            if (!isNaN(year) && year.toString() === value) {
                const currentYear = new Date().getFullYear();
                if (year >= 1900 && year <= currentYear + 100) return null;
            }
        }
        
        return "Năm không hợp lệ";
    },
    [DataType.Month]: (value) => {
        if (value === null || value === undefined) return null;
        
        if (typeof value === "number") {
            if (value >= 1 && value <= 12) return null;
        }
        
        if (typeof value === "string") {
            // Kiểm tra nếu giá trị là "YYYY-MM"
            if (/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return null;
            
            // Hoặc kiểm tra nếu giá trị là số từ 1-12
            const month = parseInt(value, 10);
            if (!isNaN(month) && month >= 1 && month <= 12) return null;
        }
        
        return "Tháng không hợp lệ";
    },
    [DataType.Reference1_N_Objects]: (value) => {
        if (value === null || value === undefined) return null;
        
        if (Array.isArray(value)) return null;
        
        return "Giá trị tham chiếu không hợp lệ";
    }
};

export default ValidateForm;