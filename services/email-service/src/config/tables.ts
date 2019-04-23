// TODO: this is only for testing triggers
// DO NOT USE THIS FOR PROD FEATURES
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
