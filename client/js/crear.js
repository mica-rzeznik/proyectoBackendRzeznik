const form = document.getElementById('ProductForm')

form.addEventListener('submit',e=>{
    e.preventDefault()
    const data = new FormData(form)
    const obj = {}
    data.forEach((value,key)=>obj[key]=value)
    fetch('/api/products',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=> {
        if (result.status === 201) {
            result.json();
            alert("Producto creado con éxito!")
            window.location.replace('/api/products')
        } else {
            return result.json().then((error) => {
                console.log(error.cause)
                alert('No se pudo crear el producto: ' + error.message)
            })
        }
    }).then(
        json=>console.log(json))
})