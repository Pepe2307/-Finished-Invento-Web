///////////////////////////////////   CARRITO DE COMPRAS   /////////////////////////////////////////

const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}



// Eventos
// El evento DOMContentLoaded aparece cuando se carga el HTML
document.addEventListener('DOMContentLoaded', (e) => {
  fetchData()

  //LOCAL STORAGE 1
  if (localStorage.getItem('carrito')){
    carrito = JSON.parse(localStorage.getItem('carrito'))
    pintarCarrito()
  } 
})

cards.addEventListener('click', (e) => {
  addCarrito(e)
  dynamicToastify(e)
})

items.addEventListener('click', (e) => {
  btnAumentarDisminuir(e)
})




// Traer productos
const fetchData = async () => {
  const res = await fetch('./db/api.json')
  const data = await res.json()
  // console.log(data)
  pintarCards(data)
}


// Pintar productos
const pintarCards = (data) => {
  data.forEach((item) => {
    templateCard.querySelector('h5').textContent = item.title
    templateCard.querySelector('p').textContent = item.precio
    templateCard.querySelector('img').setAttribute("src", item.picture)

    templateCard.querySelector('button').dataset.id = item.id
    templateCard.querySelector('button').setAttribute("id", item.id_2)

    const clone = templateCard.cloneNode(true)
    fragment.appendChild(clone)
  })
  cards.appendChild(fragment)
}



///////////////////////////////////   AGREGAR AL CARRITO   /////////////////////////////////////
const addCarrito = (e) => {
  if (e.target.classList.contains('btn-dark')) {
    setCarrito(e.target.parentElement)
  }
  e.stopPropagation()
}

const setCarrito = (item) => {
  const producto = {
    title: item.querySelector('h5').textContent,
    precio: item.querySelector('p').textContent,
    id: item.querySelector('button').dataset.id,
    cantidad: 1
  }
  if (carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1
  }

  carrito[producto.id] = { ...producto }

  pintarCarrito()
}

const pintarCarrito = () => {
  items.innerHTML = ''

  Object.values(carrito).forEach((producto) => {
    templateCarrito.querySelector('th').textContent = producto.id
    templateCarrito.querySelectorAll('td')[0].textContent = producto.title
    templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
    templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad

    //Botones
    templateCarrito.querySelector('.btn-info').dataset.id = producto.id
    templateCarrito.querySelector('.btn-danger').dataset.id = producto.id

    const clone = templateCarrito.cloneNode(true)
    fragment.appendChild(clone)
  })
  items.appendChild(fragment)

  pintarFooter()

  localStorage.setItem('carrito', JSON.stringify(carrito)) //LOCAL STORAGE 2
}

const pintarFooter = () => {
  footer.innerHTML = ''

  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = `
        <th scope="row" colspan="5" style="text-align: center;">Carrito vacío</th>
        `
    return
  }

                  //Sumar cantidad y sumar totales
  const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
  const nPrecio = Object.values(carrito).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  )

  templateFooter.querySelectorAll('td')[0].textContent = nCantidad
  templateFooter.querySelector('span').textContent = nPrecio

  const clone = templateFooter.cloneNode(true)
  fragment.appendChild(clone)

  footer.appendChild(fragment)

  const boton = document.querySelector('#vaciar-carrito')
  boton.addEventListener('click', () => {
    carrito = {}
    pintarCarrito()
  })
}

const btnAumentarDisminuir = (e) => {
  if (e.target.classList.contains('btn-info')) {
    const producto = carrito[e.target.dataset.id]
    producto.cantidad++
    carrito[e.target.dataset.id] = { ...producto }
    pintarCarrito()
  }

  if (e.target.classList.contains('btn-danger')) {
    const producto = carrito[e.target.dataset.id]
    producto.cantidad--
    if (producto.cantidad === 0) {
      delete carrito[e.target.dataset.id]
    } else {
      carrito[e.target.dataset.id] = { ...producto }
    }
    pintarCarrito()
  }
  e.stopPropagation()
}










///////////////////////////////////   CALCULADORA DE PRECIOS   /////////////////////////////////////
var tb = document.getElementById('info')

const objetos_de_compras = []

class objeto_compra {
  constructor(nombre, precio) {
    this.nombre = nombre.toUpperCase()
    this.precio = parseFloat(precio)
    this.vendido = false
  }
}

const formEl = document.querySelector('form')
const tbodyEl = document.querySelector('tbody')
const tableEl = document.querySelector('table')

//Agregar
function agregar() {
  //Asignar variables
  var prod = document.getElementById('Tipo_Producto').value
  var tipo = document.getElementById('tipo_objeto').value
  var precio = +document.getElementById('Precio').value
  var cantidad = +document.getElementById('Cantidad').value
  /* el "+" transforma los valores en INTs */

  var precio_ultimo_objeto = +document.getElementById('Total_Ultimo').value
  var ultimo_total = +document.getElementById('Total').value

  var subtotal_var = precio * cantidad
  var impuesto_var = (precio * cantidad) / 10
  var total_var = precio * cantidad + (precio * cantidad) / 10

  //Calculos de precios
  document.getElementById('SubTotal').value = subtotal_var
  document.getElementById('Impuesto').value = impuesto_var
  document.getElementById('Total').value = total_var + precio_ultimo_objeto + ultimo_total
  document.getElementById('Total_Ultimo').value = total_var

  //Agregar a la lista
  objetos_de_compras.push(tipo)

  //Alerta de button
  window.alert(
    'Bienvenido, El total a pagar es: ' +
      total_var +
      '$ pesos' +
      '\n' +
      '\n' +
      'Lista de objetos comprados: ' +
      '\n' +
      '\n' +
      objetos_de_compras.join('\n')
  )

}

//Cuotas con ENTER
window.addEventListener('keydown', checkKeyPress, false)

function checkKeyPress(key) {
  if (key.keyCode == '13') {
    var precio_objeto_cuotas = document.getElementById('precio_cuotas_simulador').value
    var cantidad_cuotas = document.getElementById('cantida_cuotas_simulador').value

    var precio_final_cuotas = precio_objeto_cuotas / cantidad_cuotas

    document.getElementById('precio_por_cuota').value = precio_final_cuotas
    alert('Mostrando valores:')
  }
}


const Toast = {
  init() {
    this.hideTimeout = null;

    this.el = document.createElement("div");
    this.el.className = "toast";
    document.body.appendChild(this.el);
  },
 
  show(message, state) {
    clearTimeout(this.hideTimeout);

    this.el.textContent = message;
    this.el.className = "toast toast--visible";

    if (state) {
      this.el.classList.add(`toast--${state}`);
    }

    this.hideTimeout = setTimeout(() => {
      this.el.classList.remove("toast--visible");
    }, 3000);
  }
};

document.addEventListener("DOMContentLoaded", () => Toast.init());