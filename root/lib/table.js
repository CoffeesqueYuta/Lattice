function obsoleteHighlightCell(cell) {
    cell.style.backgroundColor = '#ffeb3b';
    cell.style.transition = 'none';
    let opacity = 1;
    const fadeInterval = setInterval(() => {
        opacity -= 0.05;
        cell.style.backgroundColor = `rgba(255, 235, 59, ${opacity})`;
        if (opacity <= 0) {
            clearInterval(fadeInterval);
            cell.style.backgroundColor = '';
        }
    }, 40);
}

function highlightCell(cell, originalColor) {
    function parseColor(str) {
        const m = str.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
    }
}

function insertBeforeMe(event) {
    const clickedRow = event.target.closest('tr');
    if (!clickedRow) return;
    const table = clickedRow.closest('table');
    if (!table) return;
    const rowIndex = clickedRow.rowIndex;
    const newRow = table.insertRow(rowIndex);

    const cell = newRow.insertCell(0);
    cell.textContent = 'New Row';
    newRow.innerHTML =
        "<td></td><td></td><td></td><td></td><td></td><td class='U-1' data-tooltip='行を削除します。'><div class='delete-row'>-</div></td>";
    addEventListeners();
}

function addEventListeners() {
    const elements = document.querySelectorAll(".delete-row");
    elements.forEach((element) => {
        // Avoid stacking duplicate listeners: replace node with clone (simple de-dupe)
        const clone = element.cloneNode(true);
        element.parentNode.replaceChild(clone, element);

        clone.addEventListener("click", function (e) {
        deleteMe(e);
        });
    });
}

function deleteMe(event) {
    const clickedRow = event.target.closest("tr");
    if (!clickedRow) return;
    clickedRow.remove();
}