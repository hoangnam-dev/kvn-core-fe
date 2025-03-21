/* eslint-disable */

export interface ValueRecord<T> {
    v: T | null;
    r: T | null;
}

export interface BaseModel {
    backend_menu_id: ValueRecord<number>;
    display_order: ValueRecord<number>;
    name: ValueRecord<string>;
    en_name: ValueRecord<string>;
    vn_name: ValueRecord<string>;
    ja_name: ValueRecord<string>;
    icon: ValueRecord<string>;
    icon_web_v2: ValueRecord<string>;
    query_string: ValueRecord<string>;
    html_after_form: ValueRecord<string>;
    html_before_form: ValueRecord<string>;
    table_id: ValueRecord<number>;
    filter_condition: ValueRecord<string>;
    view_name: ValueRecord<string>;
    group_admin: ValueRecord<number>;
    parent_menu: ValueRecord<string>;
    is_visible: ValueRecord<number>;
    sort_expression: ValueRecord<string>;
    style_css: ValueRecord<string>;
    description: ValueRecord<string>;
    background_header: ValueRecord<string>;
    gender_js_css_file: ValueRecord<string>;
    open_in_new_tab: ValueRecord<number>;
    url_link: ValueRecord<string>;
    url_link_web_v2: ValueRecord<string>;
    user_group_permission: ValueRecord<string>;
    module: ValueRecord<string>;
    sql_before_click: ValueRecord<string>;
    user_permission: ValueRecord<string>;
    is_on_mobile_app: ValueRecord<number>;
    icon_text_exp: ValueRecord<string>;
    is_on_portal: ValueRecord<number>;
    extended_visibility: ValueRecord<string>;
    mobile_app_name: ValueRecord<string>;
    mobile_app_icon: ValueRecord<string>;
    mobile_app_query_string: ValueRecord<string>;
    mobile_app_condition: ValueRecord<string>;
    position_id: ValueRecord<string>;
    is_center: ValueRecord<number>;
    start_color: ValueRecord<string>;
    end_color: ValueRecord<string>;
    duration: ValueRecord<string>;
    breadcrumb: ValueRecord<string>;
    modified_by: ValueRecord<string>;
    modified_at: ValueRecord<string>;
    created_by: ValueRecord<string>;
    created_at: ValueRecord<string>;
    record_status: ValueRecord<string>;
    record_log: ValueRecord<string>;
}

export interface ResponseModel extends BaseModel {
    [key: string]: ValueRecord<unknown>;
}
