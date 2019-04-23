interface AllTablesType {
  [key: string]: any;
}

const TABLES: object = ["notifications"].reduce(
  (allTables: AllTablesType, tableName: string) => (
    (allTables[tableName] = `marketplace.${tableName}`), allTables
  ),
  {}
);

export default TABLES;
