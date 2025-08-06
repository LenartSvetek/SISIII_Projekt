export interface ITableInfoColumn {
    TableInfoId: string;
    CheckConstraint: any;
    ColumnName: string;
    DataType: "STRING" | "LOOKUP" | "DATE" | "ENUM" | (string & {});
    Choices: string[];
    DefaultValue: string;
    Id: string;
    IsForeignKey: boolean;
    IsNullable: boolean;
    IsPrimaryKey: boolean;
    MaxLength: number;
    ReferencesColumn: string;
    ReferencesTable: string;
    ReferencesTableValue: string;
}