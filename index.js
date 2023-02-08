let products
let selected_product = -1
const table_body = document.getElementsByClassName("table__body")[0]

const ratingColor = (rating) => {
  if (rating >= 4.5) return 'green'
  else if (rating >= 4.0 && rating < 4.5) return 'yellow'
  return 'red'
}

const deleteModals = () => document.querySelectorAll(".table__body__modal").forEach(modal => modal.remove())

const showPopOut = (table_el, data) => {
  if (data.id !== selected_product) {
    selected_product = data.id
    const popOut = `<div class="table__body__modal">
                        <div  class="table__body__modal__title">
                          <p>${data.title}</p>
                          <p style="color: ${ratingColor(data.rating)}">${data.rating}</p>
                        </div>
                        <p>${data.description}</p>
                        <p>Price: ${data.price}$</p>
                    </div>`
    table_el.insertAdjacentHTML('beforeend', popOut)
  }
}

const getProducts = async () => {
  const response = await fetch('https://dummyjson.com/products')
  return await response.json()
}

getProducts().then(data => {
  const fetchedProducts = data.products
  products = fetchedProducts
  fetchedProducts.map(product => {
    table_body.insertAdjacentHTML('beforeend', `<div class="table__body__element" data-id="${product.id}"><p>${product.title}</p></div>`)
  })
})

table_body.addEventListener('mousemove', e => {
  if (e.target.className === 'table__body__element' || e.target.parentElement.className === 'table__body__element') {
    let productId = e.target.getAttribute('data-id') || e.target.parentElement.getAttribute('data-id')
    productId = parseInt(productId)
    if (selected_product !== productId) {
      deleteModals()
      const product = products.find(p => p.id === productId)
      showPopOut(e.target, product)
    }
  }
})

table_body.addEventListener('mouseleave', (e) => {
  if (selected_product !== -1) {
    selected_product = -1
    deleteModals()
  }
})
