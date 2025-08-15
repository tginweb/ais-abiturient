export default function excelToTable(table_body, data) {

    // split data into JS-table
    let rows = data.split("\n");

    // Empty destination html-table body
    table_body.html('');

    // Append every row/column from textarea to destination html-table body
    for (let y in rows) {                                   // Check if row is not empty
        if (rows[y].length > 0) {                           // Check if row is not empty
            let cells = rows[y].split("\t");                // split the row into JS-table as cells using tabs as separator
            let row = $('<tr />');                          // create an empty "tr"
            for (let x in cells) {                          // iterate the splitted row
                row.append('<td>' + cells[x] + '</td>');    // add cell value to a new "td" then add it to the new "tr"
            }
            table_body.append(row);                         // append the new "tr" to table body
        }
    }
}
