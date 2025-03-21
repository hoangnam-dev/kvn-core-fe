/* eslint-disable */
import React, { useState, useEffect, useMemo } from "react";
import Form from "../Form";
import Input from "../input/InputField";
import Checkbox from "../input/Checkbox";
import Radio from "../input/Radio";
import Button from "@/components/ui/button/Button";
import Label from "../Label";
import { HeaderItem } from "./HeaderInterface";
import { DataType } from "@/common/lib.enum";
import Select from "../Select";
import TextArea from "../input/TextArea";
import { translate } from "@/common/utils.translator";
import { selectCurrentLanguage } from "@/store/feats/Language/language.selectors";
import { useSelector } from "react-redux";
import FormTrans from "@/common/messages/form.json"
import CustomDatepicker, { LanguageType } from "@/components/ui/other/datapicker";
import ValidateForm from "../validate/ValidateForm";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface Props {
    headerData: HeaderItem[];
    rowData?: { [key: string]: { v: unknown } };
    onSubmit: (formValues: Record<string, unknown>) => void;
    isUpdate?: boolean;
}

type ValidDataType = keyof typeof ValidateForm;

const validateField = (item: HeaderItem, value: unknown, allValues?: Record<string, unknown>, lang: LanguageType = "vn"): string | null => {
    if (item.is_nullable?.v === 1 && (value === null || value === undefined || value === "")) {
        return null;
    }

    let error: string | null = null;

    if (value !== null && value !== undefined && value !== "") {
        const dataType = item.data_type?.v as ValidDataType;
        if (dataType && ValidateForm[dataType]) {
            error = ValidateForm[dataType](value);
        }

        if (!error && item.html_input?.v && typeof item.html_input.v === "string") {
            const htmlInput = item.html_input.v;

            // Validate numeric constraints (min, max)
            if ((dataType === DataType.Number || dataType === DataType.Float || dataType === DataType.Currency) &&
                (typeof value === "number" || (typeof value === "string" && !isNaN(Number(value))))) {
                const numValue = typeof value === "string" ? Number(value) : value as number;
                // Check min constraint
                if (htmlInput.includes("min=")) {
                    const staticMatch = htmlInput.match(/min=(\d+(?:\.\d+)?)/);
                    if (staticMatch && staticMatch[1]) {
                        const minValue = parseFloat(staticMatch[1]);
                        if (numValue < minValue) {
                            return `Giá trị phải lớn hơn hoặc bằng ${minValue}`;
                        }
                    } else if (allValues) {
                        const dynamicMatch = htmlInput.match(/min=\[([^\]]+)]/);
                        if (dynamicMatch && dynamicMatch[1]) {
                            const referencedField = dynamicMatch[1];
                            const refValue = allValues[referencedField];
                            if (refValue !== undefined &&
                                (typeof refValue === "number" || (typeof refValue === "string" && !isNaN(Number(refValue))))) {
                                const minValue = typeof refValue === "string" ? Number(refValue) : refValue as number;
                                if (numValue < minValue) {
                                    return `Giá trị phải lớn hơn hoặc bằng ${minValue}`;
                                }
                            }
                        }
                    }
                }

                // Check max constraint
                if (htmlInput.includes("max=")) {
                    const staticMatch = htmlInput.match(/max=(\d+(?:\.\d+)?)/);
                    if (staticMatch && staticMatch[1]) {
                        const maxValue = parseFloat(staticMatch[1]);
                        if (numValue > maxValue) {
                            return `Giá trị phải nhỏ hơn hoặc bằng ${maxValue}`;
                        }
                    } else if (allValues) {
                        const dynamicMatch = htmlInput.match(/max=\[([^\]]+)]/);
                        if (dynamicMatch && dynamicMatch[1]) {
                            const referencedField = dynamicMatch[1];
                            const refValue = allValues[referencedField];
                            if (refValue !== undefined &&
                                (typeof refValue === "number" || (typeof refValue === "string" && !isNaN(Number(refValue))))) {
                                const maxValue = typeof refValue === "string" ? Number(refValue) : refValue as number;
                                if (numValue > maxValue) {
                                    return `Giá trị phải nhỏ hơn hoặc bằng ${maxValue}`;
                                }
                            }
                        }
                    }
                }
            }

            // Validate string length constraints (minlength, maxlength)
            if (dataType === DataType.Text && typeof value === "string") {
                // Check minlength
                if (htmlInput.includes("minlength=")) {
                    const match = htmlInput.match(/minlength=(\d+)/);
                    if (match && match[1]) {
                        const minLength = parseInt(match[1], 10);
                        if (value.length < minLength) {
                            return `Độ dài tối thiểu là ${minLength} ký tự`;
                        }
                    }
                }

                // Check maxlength
                if (htmlInput.includes("maxlength=")) {
                    const match = htmlInput.match(/maxlength=(\d+)/);
                    if (match && match[1]) {
                        const maxLength = parseInt(match[1], 10);
                        if (value.length > maxLength) {
                            return `Độ dài tối đa là ${maxLength} ký tự`;
                        }
                    }
                }
            }

            // Validate date constraints (minDate, maxDate)
            if ((dataType === DataType.Date || dataType === DataType.DateTime) &&
                (value instanceof Date || (typeof value === "string" && !isNaN(Date.parse(value))))) {

                const dateValue = value instanceof Date ? value : new Date(value);

                // Check minDate
                if (htmlInput.includes("minDate=")) {
                    const staticMatch = htmlInput.match(/minDate=([^;\]]+)(?:;|$)/);
                    if (staticMatch && staticMatch[1]) {
                        const minDate = new Date(staticMatch[1]);
                        if (!isNaN(minDate.getTime()) && dateValue < minDate) {
                            let message;
                            switch (lang) {
                                case 'vn':
                                    message = `Ngày phải sau ${minDate.toLocaleDateString('vi-VN')}`;
                                    break;
                                case 'ja':
                                    message = `${minDate.toLocaleDateString('ja-JP')}以降の日付を入力してください`;
                                    break;
                                case 'en':
                                default:
                                    message = `Date must be after ${minDate.toLocaleDateString('en-US')}`;
                                    break;
                            }
                            return message;
                        }
                    } else if (allValues) {
                        const dynamicMatch = htmlInput.match(/minDate=\[([^\]]+)]/);
                        if (dynamicMatch && dynamicMatch[1]) {
                            const referencedField = dynamicMatch[1];
                            const refValue = allValues[referencedField];
                            if (refValue instanceof Date || (typeof refValue === "string" && !isNaN(Date.parse(refValue as string)))) {
                                const minDate = refValue instanceof Date ? refValue : new Date(refValue as string);
                                if (!isNaN(minDate.getTime()) && dateValue < minDate) {
                                    let message;
                                    switch (lang) {
                                        case 'vn':
                                            message = `Ngày phải sau ${minDate.toLocaleDateString('vi-VN')}`;
                                            break;
                                        case 'ja':
                                            message = `${minDate.toLocaleDateString('ja-JP')}以降の日付を入力してください`;
                                            break;
                                        case 'en':
                                        default:
                                            message = `Date must be after ${minDate.toLocaleDateString('en-US')}`;
                                            break;
                                    }
                                    return message;
                                }
                            }
                        }
                    }
                }

                // Check maxDate
                if (htmlInput.includes("maxDate=")) {
                    const staticMatch = htmlInput.match(/maxDate=([^;\]]+)(?:;|$)/);
                    if (staticMatch && staticMatch[1]) {
                        const maxDate = new Date(staticMatch[1]);
                        if (!isNaN(maxDate.getTime()) && dateValue > maxDate) {
                            return `Ngày phải trước ${maxDate.toLocaleDateString()}`;
                        }
                    } else if (allValues) {
                        const dynamicMatch = htmlInput.match(/maxDate=\[([^\]]+)]/);
                        if (dynamicMatch && dynamicMatch[1]) {
                            const referencedField = dynamicMatch[1];
                            const refValue = allValues[referencedField];
                            if (refValue instanceof Date || (typeof refValue === "string" && !isNaN(Date.parse(refValue as string)))) {
                                const maxDate = refValue instanceof Date ? refValue : new Date(refValue as string);
                                if (!isNaN(maxDate.getTime()) && dateValue > maxDate) {
                                    return `Ngày phải trước ${maxDate.toLocaleDateString()}`;
                                }
                            }
                        }
                    }
                }
            }
        }

        // Original regex validation
        if (!error && item.input_regex?.v && typeof value === "string") {
            try {
                const regex = new RegExp(item.input_regex.v);
                if (!regex.test(value)) {
                    error = item.input_regex_message?.r || "Giá trị không khớp định dạng yêu cầu";
                }
            } catch {
                console.error("Regex không hợp lệ:", item.input_regex.v);
                error = "Lỗi định dạng không hợp lệ từ hệ thống";
            }
        }
    }

    return error;
};

export default function DynamicForm({ headerData, rowData, onSubmit, isUpdate = false }: Props) {
    const currentLanguage = useSelector(selectCurrentLanguage);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const formSchema = useMemo(() => {
        const schemaObj: Record<string, z.ZodType<any, any>> = {};
        headerData.forEach((item) => {
            const fieldName = item.true_column_name.v;
            const dataType = item.data_type?.v;
            const isNullable = item.is_nullable?.v === 1;
            let fieldSchema: z.ZodType<any, any>;
            switch (dataType) {
                case DataType.Boolean:
                    fieldSchema = z.boolean();
                    break;
                case DataType.Number:
                case DataType.Float:
                case DataType.Currency:
                    fieldSchema = z.union([
                        z.number(),
                        z.string().refine((val: string) => val === '' || !isNaN(Number(val)), {
                            message: "Phải là số"
                        }).transform((val: string) => val === '' ? null : Number(val))
                    ]);
                    break;
                case DataType.Date:
                case DataType.DateTime:
                    fieldSchema = z.union([
                        z.date(),
                        z.string().refine((val: string) => val === '' || !isNaN(Date.parse(val)), {
                            message: "Phải là ngày hợp lệ"
                        }).transform((val: string | number | Date) => val === '' ? null : new Date(val))
                    ]);
                    break;
                default:
                    fieldSchema = z.string().optional();
            }
            if (isNullable) {
                fieldSchema = fieldSchema.nullable();
            }
            schemaObj[fieldName] = fieldSchema;
        });
        return z.object(schemaObj);
    }, [headerData]);

    const initialValues = useMemo(() => {
        const values: Record<string, unknown> = {};
        headerData.forEach((item) => {
            const name = item.name.v;
            const fieldName = item.true_column_name.v;
            const dataType = item.data_type?.v;
            switch (dataType) {
                case DataType.Boolean:
                    values[fieldName] = false;
                    break;
                case DataType.Number:
                case DataType.Float:
                case DataType.Currency:
                    values[fieldName] = '';
                    break;
                case DataType.Date:
                case DataType.DateTime:
                    values[fieldName] = null;
                    break;
                default:
                    values[fieldName] = '';
            }
            
            if (rowData && rowData[name]?.v !== undefined) {
                const value = rowData[name].v;
                if ((dataType === DataType.Date || dataType === DataType.DateTime) && 
                    value !== null && value !== undefined && value !== '') {
                    try {
                        values[fieldName] = typeof value === 'string' ? new Date(value) : value;
                    } catch (e) {
                        console.error(`Failed to parse date for field ${fieldName}:`, e);
                        values[fieldName] = null;
                    }
                } 
                else if (dataType === DataType.Boolean) {
                    values[fieldName] = !!value;
                } 
                else {
                    values[fieldName] = value;
                }
            }
        });
        return values;
    }, [headerData, rowData]);

    const { 
        control, 
        handleSubmit: hookFormSubmit, 
        formState: { dirtyFields: formDirtyFields },
        reset
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues,
        mode: 'onChange'
    });

    useEffect(() => {
        reset(initialValues);
    }, [initialValues, reset]);
    
    const onSubmitForm = hookFormSubmit((data) => {
        const newErrors: Record<string, string> = {};
        headerData.forEach((item) => {
            const fieldName = item.true_column_name.v;
            if (item.is_visible.v !== 0) {
                const value = data[fieldName];
                const isEmpty = value === null || value === undefined || value === "";
                if (item.is_nullable?.v !== 1 && isEmpty) {
                    newErrors[fieldName] = translate(FormTrans.required, currentLanguage);
                }
                else if (!isEmpty) {
                    const error = validateField(item, value, data, currentLanguage);
                    if (error) {
                        newErrors[fieldName] = error;
                    }
                }
            }
        });
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        if (isUpdate) {
            const changedValues: Record<string, unknown> = {};
            const dirtyFieldsArray = Object.keys(formDirtyFields);
            dirtyFieldsArray.forEach((fieldName) => {
                changedValues[fieldName] = data[fieldName];
            });
            if (Object.keys(changedValues).length > 0) {
                onSubmit(changedValues);
            } else {
                console.log("No changes detected, skipping update");
            }
        } else {
            onSubmit(data);
        }
    });

    const getInputProps = (html_input: string, inputType: number) => {
        const props: { [key: string]: unknown } = {};
        if (html_input) {
            const htmlInput = html_input;
            
            // Min/max for numbers
            if (htmlInput.includes("min=") && !htmlInput.includes("min=[")) {
                const match = htmlInput.match(/min=(\d+)/);
                if (match && match[1]) {
                    props.min = parseInt(match[1], 10);
                }
            }
            if (htmlInput.includes("max=") && !htmlInput.includes("max=[")) {
                const match = htmlInput.match(/max=(\d+)/);
                if (match && match[1]) {
                    props.max = parseInt(match[1], 10);
                }
            }
            
            // Min/max length for text
            if (htmlInput.includes("minlength=")) {
                const match = htmlInput.match(/minlength=(\d+)/);
                if (match && match[1]) {
                    props.minLength = parseInt(match[1], 10);
                }
            }
            if (htmlInput.includes("maxlength=")) {
                const match = htmlInput.match(/maxlength=(\d+)/);
                if (match && match[1]) {
                    props.maxLength = parseInt(match[1], 10);
                }
            }
            
            // Min/max date for date inputs
            if (inputType === DataType.Date || inputType === DataType.DateTime) {
                if (htmlInput.includes("minDate=") && !htmlInput.includes("minDate=[")) {
                    const match = htmlInput.match(/minDate=(.+?)(?:;|$)/);
                    if (match && match[1]) {
                        props.minDate = new Date(match[1]);
                    }
                }
                if (htmlInput.includes("maxDate=") && !htmlInput.includes("maxDate=[")) {
                    const match = htmlInput.match(/maxDate=(.+?)(?:;|$)/);
                    if (match && match[1]) {
                        props.maxDate = new Date(match[1]);
                    }
                }
            }
        }
        
        return props;
    };

    const renderInputByType = (item: HeaderItem) => {
        const label = item.vn_name.r;
        const fieldName = item.true_column_name.v;
        const inputType = item.data_type?.v || null;
        const inputProps = inputType !== null ? getInputProps(item.html_input?.v as string, inputType) : {};

        switch (inputType) {
            case DataType.Boolean:
                return (
                    <Controller
                        name={fieldName}
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                label={translate(FormTrans.boolean, currentLanguage)}
                                id={fieldName}
                                checked={!!field.value}
                                onChange={(checked) => {
                                    field.onChange(checked);
                                }}
                            />
                        )}
                    />
                );
            case DataType.Currency:
                return (
                    <Controller
                        name={fieldName}
                        control={control}
                        render={({ field }) => (
                            <Input
                                id={fieldName}
                                name={fieldName}
                                value={field.value as string | number | undefined}
                                type="text"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    field.onChange(e.target.value);
                                }}
                                {...inputProps}
                            />
                        )}
                    />
                );
            case DataType.DateTime:
            case DataType.Date:
                return (
                    <Controller
                        name={fieldName}
                        control={control}
                        render={({ field }) => (
                            <CustomDatepicker
                                value={field.value instanceof Date ? field.value : (field.value ? new Date(field.value as string) : null)}
                                onChange={(date: Date | null) => {
                                    field.onChange(date);
                                }}
                                className="w-full"
                                {...inputProps}
                            />
                        )}
                    />
                );
            case DataType.Email:
                return (
                    <Controller
                        name={fieldName}
                        control={control}
                        render={({ field }) => (
                            <Input
                                id={fieldName}
                                name={fieldName}
                                value={field.value as string}
                                type="email"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    field.onChange(e.target.value);
                                }}
                                {...inputProps}
                            />
                        )}
                    />
                );
            case DataType.RichText:
                return (
                    <Controller
                        name={fieldName}
                        control={control}
                        render={({ field }) => (
                            <TextArea
                                placeholder={""}
                                rows={3}
                                value={field.value?.toString()}
                                onChange={(value: string) => {
                                    field.onChange(value);
                                }}
                            />
                        )}
                    />
                );
            case DataType.Reference1_1_ID:
                return (
                    <Controller
                        name={fieldName}
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={[]}
                                defaultValue={String(field.value || "")}
                                onChange={(val) => {
                                    field.onChange(val);
                                }}
                            />
                        )}
                    />
                );
            case DataType.Reference1_N_IDs:
                return (
                    <Controller
                        name={fieldName}
                        control={control}
                        render={({ field }) => (
                            <Radio
                                label={label}
                                value={String(field.value || "")}
                                onChange={(val) => {
                                    field.onChange(val);
                                }}
                                id={fieldName}
                                name={fieldName}
                                checked={String(field.value) === String(field.value)}
                            />
                        )}
                    />
                );
            case DataType.Text:
                return (
                    <Controller
                        name={fieldName}
                        control={control}
                        render={({ field }) => (
                            <Input
                                id={fieldName}
                                name={fieldName}
                                value={field.value as string}
                                type={typeof item.display_format?.v === "string" && item.display_format.v.toLowerCase() === "password" ? "password" : "text"}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    field.onChange(e.target.value);
                                }}
                                {...inputProps}
                            />
                        )}
                    />
                );
            case DataType.Float:
            case DataType.Number:
                return (
                    <Controller
                        name={fieldName}
                        control={control}
                        render={({ field }) => (
                            <Input
                                id={fieldName}
                                name={fieldName}
                                type="number"
                                value={field.value as number}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    field.onChange(e.target.value);
                                }}
                                {...inputProps}
                            />
                        )}
                    />
                );
            default:
                return (
                    <Controller
                        name={fieldName}
                        control={control}
                        render={({ field }) => (
                            <Input
                                id={fieldName}
                                name={fieldName}
                                type="text"
                                value={field.value as string}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    field.onChange(e.target.value);
                                }}
                                {...inputProps}
                            />
                        )}
                    />
                );
        }
    };

    return (
        <div className="flex-auto overflow-y-auto p-4 leading-[1.57143] text-sm font-['Public Sans',sans-serif] font-normal">
            <Form onSubmit={onSubmitForm} className="space-y-4">
                <div className="flex flex-col gap-4">
                    {headerData.filter(item => item.is_visible.v !== 0)
                        .sort((a, b) => (a.display_order?.v ?? 0) - (b.display_order?.v ?? 0))
                        .map((item, index) => {
                            const fieldName = item.true_column_name.v;
                            const error = errors[fieldName];
                            return (
                                <div key={index} className="flex flex-row items-baseline">
                                    <Label
                                        htmlFor={fieldName}
                                        className="mr-4 leading-normal text-base font-sans font-normal whitespace-nowrap text-[#637381] w-60 overflow-hidden line-clamp-1"
                                    >
                                        {translate(item, currentLanguage ?? "vi")}:
                                    </Label>
                                    <div className="w-full">
                                        {renderInputByType(item)}
                                        {error && <span className="text-red-500">{error}</span>}
                                    </div>
                                </div>
                            );
                        })}
                    <Button
                        size="sm"
                        className="w-1/3 ml-auto pt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        {translate(FormTrans.save, currentLanguage)}
                    </Button>
                </div>
            </Form>
        </div>
    );
}