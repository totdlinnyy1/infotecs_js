let products
let selected_product = -1
const table_body = document.getElementsByClassName('table__body')[0]

const ratingColor = (rating) => {
  if (rating >= 4.5) return 'green'
  else if (rating >= 4.0 && rating < 4.5) return 'yellow'
  return 'red'
}

const getNextElement = (cursorPosition, currentElement) => {
  const currentElementCoord = currentElement.getBoundingClientRect()
  const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2

  return (cursorPosition < currentElementCenter) ?
    currentElement :
    currentElement.nextElementSibling
}

const deleteModals = () => document.querySelectorAll('.table__body__modal').forEach(modal => modal.remove())

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
    table_body.insertAdjacentHTML('beforeend',
      `<div class="table__body__element" 
                    data-id="${product.id}"
                    draggable="true"><p>${product.title}</p></div>`)
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

table_body.addEventListener('dragstart', e => {
  deleteModals()
  e.target.classList.add('selected')
})

table_body.addEventListener('dragend', e => {
  deleteModals()
  e.target.classList.remove('selected')
})

table_body.addEventListener('dragover', e => {
  e.preventDefault()

  const activeElement = table_body.querySelector('.selected')
  const currentElement = e.target
  const isMovable = activeElement !== currentElement &&
    currentElement.classList.contains('table__body__element')

  if (!isMovable) {
    return
  }

  const nextElement = getNextElement(e.clientY, currentElement)

  if (
    nextElement &&
    activeElement === nextElement.previousElementSibling ||
    activeElement === nextElement
  ) {
    return
  }

  table_body.insertBefore(activeElement, nextElement)
})
