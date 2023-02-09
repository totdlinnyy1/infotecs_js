const table_body = document.getElementsByClassName('table__body')[0]
const sort_select = document.getElementsByClassName('select')[0]
const loading_screen = document.getElementsByClassName('loading')[0]


let products
let selected_product = -1

const showPopOut = (table_el, data) => {
  if (data.id !== selected_product) {
    selected_product = data.id
    const popOut = `<div class="table__body__popout">
                        <div  class="table__body__popout__title">
                          <p>${data.title}</p>
                          <p style="color: ${ratingColor(data.rating)}">${data.rating}</p>
                        </div>
                        <p>${data.description}</p>
                        <p>Price: ${data.price}$</p>
                    </div>`
    table_el.insertAdjacentHTML('beforeend', popOut)
  }
}

const ratingColor = (rating) => {
  if (rating >= 4.5) return 'green'
  else if (rating >= 4.0 && rating < 4.5) return 'yellow'
  return 'red'
}

const deletePopOuts = () => document.querySelectorAll('.table__body__popout').forEach(modal => modal.remove())

const getNextElement = (cursorPosition, currentElement) => {
  const currentElementCoord = currentElement.getBoundingClientRect()
  const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2

  return (cursorPosition < currentElementCenter) ?
    currentElement :
    currentElement.nextElementSibling
}

const getProducts = async () => {
  const response = await fetch('https://dummyjson.com/products')
  return await response.json()
}

const preventDefault = (e) => e.preventDefault()

let supportsPassive = false
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; }
  }))
} catch(e) {}

const wheelOpt = supportsPassive ? { passive: false } : false

const preventDefaultForScrollKeys = (e) => {
  const keys = {37: 1, 38: 1, 39: 1, 40: 1}
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel'

const disableScroll = () => {
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}

const onLoad = () => {
  disableScroll()
  getProducts().then(data => {
    const fetchedProducts = data.products
    products = fetchedProducts
    fetchedProducts.map(product => {
      table_body.insertAdjacentHTML('beforeend',
        `<div class="table__body__element" 
                    data-id="${product.id}"
                    draggable="true"><p>${product.title}</p></div>`)
    })
    loading_screen.classList.add('loaded')
    enableScroll()
  })

  table_body.addEventListener('mousemove', e => {
    if (e.target.className === 'table__body__element' || e.target.parentElement.className === 'table__body__element') {
      let productId = e.target.getAttribute('data-id') || e.target.parentElement.getAttribute('data-id')
      productId = parseInt(productId)
      if (selected_product !== productId) {
        deletePopOuts()
        const product = products.find(p => p.id === productId)
        showPopOut(e.target, product)
      }
    }
  })

  table_body.addEventListener('mouseleave', (e) => {
    if (selected_product !== -1) {
      selected_product = -1
      deletePopOuts()
    }
  })

  table_body.addEventListener('dragstart', e => {
    deletePopOuts()
    e.target.classList.add('selected')
  })

  table_body.addEventListener('dragend', e => {
    deletePopOuts()
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

  sort_select.addEventListener('change', e => {
    const selectedOption = sort_select.options[sort_select.selectedIndex]
    console.log(sort_select.selectedIndex)
    // TODO make sort by chosen option
  })
}

onLoad()
