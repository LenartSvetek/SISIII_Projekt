export interface IDetailsListProps {
    Columns : IColumn[];
    Data :  any[];
}

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

export const config : IColumnDefConfig = {
    Width : 140,
    IsResizable: true,
    FinalMinWidth : 100
}