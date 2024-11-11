const excelUrl = 'https://matax123.github.io/knowyourdrug/list.xlsx';
var tableObject = null;

async function readExcel() {
    let response = await fetch(excelUrl);
    let data = await response.arrayBuffer();
    let arr = new Uint8Array(data);
    let workbook = XLSX.read(arr, { type: 'array' });
    return workbook;
}

function loadTable(data) {
    let table = document.getElementById('table');
    let tbody = table.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    data.forEach((row) => {
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');
        let td5 = document.createElement('td');
        let td6 = document.createElement('td');
        let td7 = document.createElement('td');
        td1.classList = "border px-4 py-2";
        td2.classList = "border px-4 py-2";
        td3.classList = "border px-4 py-2";
        td4.classList = "border px-4 py-2";
        td5.classList = "border px-4 py-2";
        td6.classList = "border px-4 py-2";
        td7.classList = "border px-4 py-2";
        td1.textContent = row.Name;
        td2.textContent = row.Origin;
        td3.textContent = row.Action;
        td4.textContent = row.Administration;
        td5.textContent = row.Legal;
        td6.textContent = row.SecondaryEffectProbability;
        td7.textContent = row.SecondaryEffectSeverity;

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(td7);
        tbody.appendChild(tr);
    });
}

// global variables
let table;
let orderSelectValue = 'Name';
let orderSelectDirection = 'asc';

let orderButton = document.getElementById('orderButton');
let orderDialog = document.getElementById('orderDialog');
let orderSelect = document.getElementById('orderSelect');
let refreshButton = document.getElementById('refreshButton');
let refreshDialog = document.getElementById('refreshDialog');
let expandButton = document.getElementById('expandButton');
let expandDialog = document.getElementById('expandDialog');
let downloadButton = document.getElementById('downloadButton');
let commentButton = document.getElementById('commentButton');
let commentDialog = document.getElementById('commentDialog');


// closeDialogWhenClickedOutside(orderDialog);

function orderSelectChange(element) {
    orderSelectValue = element.value;
    orderTable(orderSelectValue, orderSelectDirection);
}

function orderDirectionChange(element) {
    if (orderSelectDirection == 'desc') {
        orderSelectDirection = 'asc';
        element.style.transform = 'rotate(0deg)';
    }
    else {
        orderSelectDirection = 'desc';
        element.style.transform = 'rotate(180deg)';
    }
    orderTable(orderSelectValue, orderSelectDirection);
}

function orderTable(orderSelectValue, orderSelectDirection) {
    let table = document.getElementById('table');
    let tbody = table.getElementsByTagName('tbody')[0];
    let rows = Object.values(tableObject);
    rows.sort((a, b) => customCompare(a, b));
    tbody.innerHTML = '';
    rows.forEach((row) => {
        let tr = document.createElement('tr');

        let html = `
            <td class="border px-4 py-2">${row.Name}</td>
            <td class="border px-4 py-2">${row.Origin}</td>
            <td class="border px-4 py-2">${row.Action}</td>
            <td class="border px-4 py-2">${row.Administration}</td>
            <td class="border px-4 py-2">${row.Legal}</td>
            <td class="border px-4 py-2">${row.SecondaryEffectProbability}</td>
            <td class="border px-4 py-2">${row.SecondaryEffectSeverity}</td>
        `
        tr.innerHTML = html;
        tbody.appendChild(tr);
    });
}

function downloadFile() {
    console.log(1)
    let a = document.createElement('a');
    a.href = excelUrl;
    a.download = 'list.xlsx';
    a.click();

    // // Convert the JavaScript object to a worksheet
    // const ws = XLSX.utils.json_to_sheet(tableObject);

    // // Create a new workbook and append the worksheet
    // const wb = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // // Generate Excel file and trigger download
    // XLSX.writeFile(wb, 'data.xlsx');
}

// closeDialogWhenClickedOutside(commentDialog);

function changeDayTime() {
    const dayIcon = document.getElementById('dayIcon');
    const nightIcon = document.getElementById('nightIcon');
    if (dayTime == 'day') {
        dayTime = 'night';
        dayIcon.classList.add('hidden');
        nightIcon.classList.remove('hidden');
        document.documentElement.setAttribute('theme', 'dark');
        localStorage.setItem('dayTime', 'night');
    }
    else {
        dayTime = 'day';
        dayIcon.classList.remove('hidden');
        nightIcon.classList.add('hidden');
        document.documentElement.setAttribute('theme', 'light');
        localStorage.setItem('dayTime', 'day');
    }
}

window.onload = async function () {
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if(dayTime == 'day') dayIcon.classList.remove('hidden');
    else nightIcon.classList.remove('hidden');

    document.getElementById("loading").close();
    document.querySelector('.preload').classList.remove('preload');
}

// secondary functions

function startsWithNumber(str) {
    return /^\d/.test(str);
}

function customCompare(a, b) {
    const aText = a[orderSelectValue];
    const bText = b[orderSelectValue];
    const aStartsWithNumber = /^\d/.test(aText);
    const bStartsWithNumber = /^\d/.test(bText);

    if (aStartsWithNumber && !bStartsWithNumber && orderSelectDirection == 'asc') {
        return 1; // aText starts with a number, should come after bText
    }
    if (aStartsWithNumber && !bStartsWithNumber && orderSelectDirection == 'desc') {
        return -1; // aText starts with a number, should come after bText
    }
    if (!aStartsWithNumber && bStartsWithNumber && orderSelectDirection == 'asc') {
        return -1; // bText starts with a number, should come after aText
    }
    if (!aStartsWithNumber && bStartsWithNumber && orderSelectDirection == 'desc') {
        return 1; // bText starts with a number, should come after aText
    }
    else {
        // If both or neither start with a number, compare normally
        if (aText == null) console.log('aText is null');
        if (bText == null) console.log('bText is null');
        return orderSelectDirection === 'asc'
            ? aText.localeCompare(bText, undefined, { numeric: true })
            : bText.localeCompare(aText, undefined, { numeric: true });
    }
}

function closeDialogWhenClickedOutside(dialog) {
    dialog.addEventListener('mousedown', (event) => {
        const rect = dialog.getBoundingClientRect();
        const isInDialog = event.clientX >= rect.left && event.clientX <= rect.right &&
            event.clientY >= rect.top && event.clientY <= rect.bottom;

        if (!isInDialog) {
            dialog.close();
        }
    });
}

function openDialog(id) {
    let dialog = document.getElementById(id);
    dialog.showModal();
}

function closeDialog(id) {
    let dialog = document.getElementById(id);
    dialog.close();
}