const table_body = document.getElementsByClassName("table__body")[0]


const getProducts = async () => {
  const response = await fetch('https://dummyjson.com/products')
  return await response.json()
}

getProducts().then(data => {
  let products = data.products
  products.map(product => {
    table_body.insertAdjacentHTML('beforeend', `<div class="table__body__element">${product.title}</div>`)
  })
})
