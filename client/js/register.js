const form = document.getElementById('registerForm')

form.addEventListener('submit',e=>{
    e.preventDefault()
    const data = new FormData(form)
    const obj = {}
    data.forEach((value,key)=>obj[key]=value)
    fetch('/api/jwt/register',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=> {
        if (result.status === 201) {
            result.json();
            alert("Usuario creado con éxito!")
            window.location.replace('/users/login')
        }else {
            alert("No se pudo crear el usuario!")
        }
    }).then(
        json=>console.log(json))
})