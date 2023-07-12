const form = document.getElementById('changeForm')
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const token = urlParams.get('token')

form.addEventListener('submit',e=>{
    e.preventDefault()
    const data = new FormData(form)
    const obj = {}
    data.forEach((value,key)=>obj[key]=value)
    fetch(`/api/jwt/changePassword?token=${token}`,{
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
            result.json().then(json => {
                alert(json.error)
                window.location.replace('/api/users/login')
            })
        }else {
            alert("Error al cambiar la contraseña")
        }
    })
})