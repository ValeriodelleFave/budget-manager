const conf = window.location.origin == "file:" || window.location.hostname == "127.0.0.1" ?
    "http://localhost:3000/budget-management/" :
    "https://my-endpoints.onrender.com/budget-management/";

async function send() {
    const object = {
        isExpense: document.getElementById("expense").checked ? true : false,
        money: Number(document.getElementById("money").value),
        motivation: document.getElementById("motivation").value,
        date: new Date().getTime()
    };
    debugger

    await fetch(conf, {
        body: JSON.stringify(object),
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    getAllData();
}

async function getAllData() {
    const data = await fetch(conf + "getAll", {
            method: "GET"
        })
        .then(async response => await response.json());
    console.log("All data: ", data);


    document.getElementById("results").innerHTML = getTableTemplate(data);
}
getAllData();

function formatDate(milliseconds) {
    const date = new Date(milliseconds);
    return `${date.toLocaleDateString()}`;
}

function getTableTemplate(data) {
    let template = "";
    const headers = ["Data", "Denaro", "Motivazione", "Azioni"];

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
                <td>
                    <span style="border-bottom: 1px solid black; cursor: pointer;" onclick="test()">Modifica</span>
                    <span style="border-bottom: 1px solid black; cursor: pointer;" onclick="test()">Elimina</span>
                </td>
            </tr>
        `;
    });
    template += "</tbody>";

    return template;
}

function test() {
    console.log("test");
}