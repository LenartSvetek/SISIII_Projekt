export interface IDetailsListProps extends IDetailListConfig{
    Columns : IColumn[];
    Data :  any[];
}

export interface IDetailListConfig {
    MultiSelect ?: boolean;
}

export const DefaultDetailListConfig : IDetailListConfig = {
    MultiSelect: false
};

export interface IColumn extends IColumnConfig {
    FieldName : string;
    DisplayName : string;
    ValueType : "string" | "date" | "lookup" | (string & {});
    
}

export interface IColumnConfig {
    Width ?: number;
    MinWidth ?: number;
    MaxWidth ?: number;
    IsResizable ?: boolean;
}

export interface IColumnDefConfig extends IColumnConfig {
    FinalMinWidth : number;
}

export const DefaultColumnConfig : IColumnDefConfig = {
    Width : 140,
    IsResizable: true,
    FinalMinWidth : 100
}