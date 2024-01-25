"use strict";
export function getTableTemplate(data) {
    const headers = ["Data", "Denaro", "Motivazione", "Azioni"];
    let template = "";

    template += "<thead><tr>";
    headers.forEach(header => {
        template += `
                <th>
                    ${header}
                </th>
        `;
    });
    template += "</tr></thead>";

    template += "<tbody>";
    let index = 0;
    data.forEach(element => {
        template += `
            <tr>
                <td>
                    <span>${formatDate(element.date)}</span>
                </td>
                <td>
                    <span>${element.money}</span>
                </td>
                <td>
                    <span>${element.motivation}</span>
                </td>
                <td>
                    <img src="./icons/edit.svg" alt="edit icon" onClick="edit(${index})">
                    <img src="./icons/delete.svg" alt="delete icon" onClick="cancel(${index})">
                </td>
            </tr>
        `;
        index++;
    });
    template += "</tbody>";

    return template;
}