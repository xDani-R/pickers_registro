// Precios
const prices = {
    Normal: { week: 75, sunday: 90, cargo: 1300 },
    Bipicking: { week: 60, sunday: 72, cargo: 1040 }
};

function isSunday(date) {
    const d = new Date(date + "T00:00:00");
    return d.getDay() === 0;
}

function calculateTotal(tipo, fecha, skuA, skuB) {
    const p = prices[tipo];
    const precioSKU = isSunday(fecha) ? p.sunday : p.week;
    const subtotal = (skuA + skuB) * precioSKU;
    const total = subtotal + p.cargo;
    return { precioSKU, subtotal, total };
}

document.getElementById("guardar").addEventListener("click", () => {
    const fecha = fechaInput.value;
    const patente = patenteInput.value;
    const tipo = tipoSelect.value;
    const skuA = Number(document.getElementById("skuA").value);
    const skuB = Number(document.getElementById("skuB").value);

    const calc = calculateTotal(tipo, fecha, skuA, skuB);

    const registro = {
        fecha,
        patente,
        tipo,
        skuA,
        skuB,
        precioSKU: calc.precioSKU,
        subtotal: calc.subtotal,
        total: calc.total
    };

    const mesKey = fecha.slice(0, 7); // ej: 2025-11
    const data = JSON.parse(localStorage.getItem(mesKey) || "[]");

    data.push(registro);
    localStorage.setItem(mesKey, JSON.stringify(data));

    resumen.textContent = `Total del pedido: $${calc.total}`;

    alert("Pedido guardado ✔");
});

document.getElementById("descargar").addEventListener("click", () => {
    const mesActual = new Date().toISOString().slice(0, 7);
    const registros = JSON.parse(localStorage.getItem(mesActual) || "[]");

    if (registros.length === 0) {
        alert("No hay registros este mes");
        return;
    }

    let csv = "Fecha,Patente,Tipo,SKU A,SKU B,Precio SKU,Subtotal,Total\n";

    registros.forEach(r => {
        csv += `${r.fecha},${r.patente},${r.tipo},${r.skuA},${r.skuB},${r.precioSKU},${r.subtotal},${r.total}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `pedidos_${mesActual}.csv`;
    a.click();
});
