"use strict";
import * as TableBuilder from "./script2.js";

const conf = window.location.origin == "file:" || window.location.hostname == "127.0.0.1" ?
    "http://localhost:3000/budget-management/" :
    "https://my-endpoints.onrender.com/budget-management/";
const map = new Map([
    [1, "Gennaio"],
    [2, "Febraio"],
    [3, "Marzo"],
    [4, "Aprile"],
    [5, "Maggio"],
    [6, "Giugno"],
    [7, "Luglio"],
    [8, "Agosto"],
    [9, "Settembre"],
    [10, "Ottobre"],
    [11, "Novembre"],
    [12, "Dicembre"],
]);
let data;

async function send() {
    const object = {
        money: Number(document.getElementById("money").value),
        motivation: document.getElementById("motivation").value,
        date: new Date().getTime()
    };
    if (document.getElementById("expense").checked) {
        object.money = -object.money;
    }
    await fetch(conf, {
        body: JSON.stringify(object),
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    getLastTen();
}

async function getLastTen() {
    data = await fetch(conf + "getLastTen", { method: "GET" })
        .then(async response => await response.json());
    document.getElementById("results").innerHTML = TableBuilder.getTableTemplate(data);
}

async function getAllByMonth() {
    const data = await fetch(conf + "getAllByMonth", { method: "GET" })
        .then(response => response.json())
        .then(data => data);
    let html = "";

    for (const month of data) {
        html += `
        <p>${map.get(month._id)}: ${month.total.toFixed(2)}</p>
        `
    }
    document.getElementById("monthResults").innerHTML = html;
}

function edit(index) {
    console.log("edit", data[index]._id);
}

async function cancel(index) {
    console.log("cancel", data[index]._id);
    await fetch(conf + "delete/" + data[index]._id, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    getLastTen();
}

async function getAll() {
    const data = await fetch(conf + "getAll", { method: "GET" })
        .then(async response => await response.json());
    document.getElementById("results").innerHTML = TableBuilder.getTableTemplate(data);
}


getLastTen();