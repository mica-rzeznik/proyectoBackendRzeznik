const loginForm = document.getElementById('loginForm')
const changePasswordForm = document.getElementById('changePasswordForm')

loginForm.addEventListener('submit',e=>{
    e.preventDefault()
    const data = new FormData(loginForm)
    const obj = {}
    data.forEach((value,key)=>obj[key]=value)
    fetch('/api/jwt/login',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=>{
        if(result.status===200){
            result.json()
            .then(json=>{
                alert("Login realizado con éxito")
                window.location.replace('/api/products')
            })
        } else if (result.status === 401){
            alert("Login invalido revisa tus credenciales")
        }else {
            alert("Login invalido, revisa los datos de entrada!")
        }
    })
})

changePasswordForm.addEventListener('submit',e=>{
    e.preventDefault()
    const email = changePasswordForm.changePasswordEmail.value
    fetch(`/api/jwt/changePassword/${email}`, { method: 'POST' })
    .then((response) => {
        if (response.status===200) {
            window.location.reload()
        } else {
            response.text().then((errorMessage) => {
                console.error('Error al restablecer la contraseña:', response.status, response.statusText);
                console.error('Mensaje de error:', errorMessage);
            })
        }
    })
    .catch(error => console.error(error))
})