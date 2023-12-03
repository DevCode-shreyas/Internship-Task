// here i have define api endpoint and items per page
const endpoint =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

const itemsPerPage = 10;

let data = [];
let currentPage = 1;
let totalPages = 1;

// here i have define function for fetching data from api
async function fetchData() {
  try {
    const response = await fetch(endpoint);
    const result = await response.json();

    console.log("Received data:", result); // Log the received data

    if (result && Array.isArray(result)) {
      data = result.sort((a, b) => a.id - b.id);
      totalPages = Math.ceil(data.length / itemsPerPage);
      renderTable();
    } else {
      console.error("Error: Invalid data format");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchData();

// here i have define function for rendering table
function renderTable() {
  const tableBody = document.querySelector("#dataTable tbody");
  tableBody.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  for (let i = startIndex; i < endIndex && i < data.length; i++) {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td><input type="checkbox" id="select" onchange="toggleSelectRow(${i})"></td>
    <td contenteditable="true">${data[i].name}</td>
    <td>${data[i].email}</td>
    <td>${data[i].role}</td>
    <td>
      <button class="edit far fa-edit" onclick="editRow(${i})"></button>
      <button class="delete fas fa-trash-alt" onclick="deleteRow(${i})"></button>
      <button class="save far fa-save" onclick="saveRow(${i})" style="display: none;"></button>
    </td>
  `;
    if (selectedRows.includes(i)) {
      row.classList.add("selected");
    }
    tableBody.appendChild(row);
  }

  updatePaginationButtons();
}

// here i have define function for pagination
function updatePaginationButtons() {
  const prevButton = document.querySelector(".previous-page");
  const nextButton = document.querySelector(".next-page");

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;

  document.getElementById("currentPage").textContent = `Page ${currentPage}`;
}

function gotoPage(page) {
  currentPage = Math.max(1, Math.min(page, totalPages));
  renderTable();
}

function searchTable() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  data = originalData.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm)
    )
  );

  totalPages = Math.ceil(data.length / itemsPerPage);
  currentPage = 1;
  renderTable();
}

let originalData = [...data];
let selectedRows = [];

function toggleSelectAll() {
  const selectAllCheckbox = document.getElementById("selectAll");
  selectedRows = selectAllCheckbox.checked
    ? [...Array(data.length).keys()]
    : [];
  renderTable();
}

function toggleSelectRow(index) {
  if (selectedRows.includes(index)) {
    selectedRows = selectedRows.filter((i) => i !== index);
  } else {
    selectedRows.push(index);
  }

  renderTable();
}

function deleteSelected() {
  data = data.filter((_, index) => !selectedRows.includes(index));
  selectedRows = [];
  totalPages = Math.ceil(data.length / itemsPerPage);
  currentPage = Math.min(currentPage, totalPages);
  renderTable();
}

function editRow(index) {
  const row = document.querySelector(
    `#dataTable tbody tr:nth-child(${index + 1})`
  );
  row.querySelector(".edit").style.display = "none";
  row.querySelector(".delete").style.display = "none";
  row.querySelector(".save").style.display = "inline-block";
}

function saveRow(index) {
  const row = document.querySelector(
    `#dataTable tbody tr:nth-child(${index + 1})`
  );
  const name = row.querySelector("td:nth-child(3)").textContent;
  data[index].name = name;
  renderTable();
}

function deleteRow(index) {
  data.splice(index, 1);
  totalPages = Math.ceil(data.length / itemsPerPage);
  currentPage = Math.min(currentPage, totalPages);
  renderTable();
}

renderTable();
