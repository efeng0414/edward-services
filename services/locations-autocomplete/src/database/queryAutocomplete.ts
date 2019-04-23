import query from "./query";

export default (term: string) =>
  query(
    `SELECT * FROM marketplace.get_locations_autocomplete(
        _query => $1
    );`,
    [term]
  ).then(dbResult => dbResult.rows);
