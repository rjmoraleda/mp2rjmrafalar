const qtyInput = document.getElementById('qty_input')
const total = document.getElementById('total')

const productId = document.getElementById('productId')
const productPrice = document.getElementById('productPrice')
const productQty = document.getElementById('productQty')
const productTotal = document.getElementById('productTotal')

qtyInput.addEventListener('change', (event)=>{
    
    
    if(event.target.value < 1) return;

    const qty = Number(event.target.value);
    
    const price = Number(productPrice.value);
    
    productQty.value = qty;

    const totalPrice = qty * price;
    
    const formatPrice = new Intl.NumberFormat().format(totalPrice)

    productTotal.value = formatPrice

    total.innerHTML = `<strong>Total:</strong> <i>&#8369;${formatPrice}</i>`


})

//TODO : create a add to cart function
