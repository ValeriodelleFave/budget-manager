async function send() {
    const object = {
        isExpense: document.getElementById("expense").checked ? true : false,
        money: Number(document.getElementById("money").value),
        motivation: document.getElementById("motivation").value,
        date: new Date().getTime()
    };
    debugger

    await fetch("http://localhost:3000/budget-management/", {
        body: JSON.stringify(object),
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    getAllData();
}

async function getAllData() {
    const data = await fetch("http://localhost:3000/budget-management/getAll", {
            method: "GET"
        })
        .then(async response => await response.json());
    console.log("All data: ", data);


    document.getElementById("results").innerHTML = getTableTemplate(data);
}
getAllData();

function formatDate(milliseconds) {
    const date = new Date(milliseconds);
    return `${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function getTableTemplate(data) {
    let template = "";
    const headers = ["Data", "Denaro", "Motivazione"];

    headers.forEach(header => { // TODO: creare il tr tra i th
        template += `
                <th>
                    ${header}
                </th>
        `;
    });

    data.forEach(element => {
        template += `
            <tr>
                <td>
                    <span>${formatDate(element.date)}</span>
                </td>
                <td>
                    <span>${(element.isExpense ? "-" : "") + element.money}</span>
                </td>
                <td>
                    <span>${element.motivation}</span>
                </td>
            </tr>
        `;
    });
    return template;
}