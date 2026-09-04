let resultadoApi = [];

async function traer() {
    const resultado = await fetch("https://co.dolarapi.com/v1/cotizaciones");
    if (!resultado.ok) {
        throw new Error(`HTTP error! status: ${resultado.status}`);
    }
    const data = await resultado.json();
    return data;
}

async function iniciador() {
    try {
        resultadoApi = await traer();
        poblarSelects(resultadoApi);
        configurarBoton();
    } catch (error) {
        console.error("Error al cargar divisas:", error);
    }
}

function poblarSelects(Resultado) {
    let selectDivisas = document.getElementById("moneda");
    let selectDivisas2 = document.getElementById("tipo");

    selectDivisas.innerHTML = '<option value="COP">COP (Peso Colombiano)</option>';
    selectDivisas2.innerHTML = '<option value="COP">COP (Peso Colombiano)</option>';

    let codigosUnicos = new Set(Resultado.map(item => item.moneda));

    for (const moneda of codigosUnicos) {
        let item = Resultado.find(i => i.moneda === moneda);
        let nombre = `${moneda} - ${item.nombre}`;
        selectDivisas.innerHTML += `<option value="${moneda}">${nombre}</option>`;
        selectDivisas2.innerHTML += `<option value="${moneda}">${nombre}</option>`;
    }
}

function configurarBoton() {
    let btn = document.getElementById("consultar");
    let resultado = document.getElementById("resultado");
    let inputMonto = document.getElementById("monto"); 

    btn.addEventListener("click", function () {
        let valorSelect1 = document.getElementById("moneda").value;
        let valorSelect2 = document.getElementById("tipo").value;
        let monto = inputMonto ? parseFloat(inputMonto.value) || 1 : 1;

        let tasa1 = valorSelect1 === "COP" 
            ? 1 
            : resultadoApi.find(item => item.moneda === valorSelect1)?.venta;

        let tasa2 = valorSelect2 === "COP" 
            ? 1 
            : resultadoApi.find(item => item.moneda === valorSelect2)?.venta;

        if (!tasa1 || !tasa2) {
            resultado.textContent = "Error al obtener las tasas de cambio.";
            return;
        }
        let total = (monto * tasa1) / tasa2;

        resultado.textContent = `${monto} ${valorSelect1} = ${total.toFixed(4)} ${valorSelect2}`;
    });
}

iniciador();