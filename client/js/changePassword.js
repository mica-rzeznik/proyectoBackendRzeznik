const form = document.getElementById('changeForm')

form.addEventListener('submit',e=>{
    e.preventDefault()
    const data = new FormData(form)
    const obj = {}
    data.forEach((value,key)=>obj[key]=value)
    fetch('/api/jwt/changePassword',{
        method:'PUT',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=>{
        if(result.status===200){
            result.json()
            .then(json=>{
                alert("Contraseña cambiada con éxito")
                window.location.replace('/api/users/login')
            })
        } else if (result.status === 401){
            alert("Error al cambiar la contraseña")
        }else {
            alert("Error al cambiar la contraseña")
        }
    })
})