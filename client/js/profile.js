const uploadForm = document.getElementById('uploadForm')

function cambiarRol(userId) {
    fetch(`/api/jwt/premium/${userId}`, { method: 'PUT' })
    .then((response) => {
        if (response.ok) {
            alert('Rol de usuario cambiado. Por favor, inicie sesión nuevamente para efectuar los cambios.')
            window.location.replace('/api/users/login')
        } else {
            return response.json().then((error) => {
                console.error(error.cause)
                alert('No se pudo cambiar el rol del usuario: ' + error.message)
            })
        }})
    .catch(error => console.error(error))
}

uploadForm.addEventListener('submit', e => {
    e.preventDefault()
    const userId = uploadForm.name
    const data = new FormData(uploadForm)
    fetch(`/api/jwt/${userId}/documents`, {
        method: 'POST',
        body: data
    }).then(result=> {
        if (result.status === 200) {
            alert("Archivos subidos con éxito!")
            fetch(`/api/jwt/premium/${userId}`, { method: 'PUT' })
            .then((response) => {
                if (response.ok) {
                    alert('Rol de usuario cambiado. Por favor, inicie sesión nuevamente para efectuar los cambios.')
                    window.location.replace('/api/users/login')
                } else {
                    return response.json().then((error) => {
                        console.error(error.cause)
                        alert('No se pudo cambiar el rol del usuario: ' + error.message)
                    })
                }
            })
            .catch(error => console.error(error))
        } else {
            return result.json().then((error) => {
                console.error(error.cause)
                alert('Error al subir el archivo: ' + error.message)
            })
        }
    })
    .catch(error => console.error(error))
})

function eliminarUser(userId) {
    fetch(`/api/jwt/delete/${userId}`, { method: 'DELETE' })
    .then((response) => {
        if (response.ok) {
            window.location.reload()
        } else {
            console.error('Error al eliminar el usuario')
        }})
    .catch(error => console.error(error))
}

function eliminarUsers() {
    fetch(`/api/jwt/delete`, { method: 'DELETE' })
    .then((response) => {
        if (response.ok) {
            window.location.reload()
        } else {
            console.error('Error al eliminar los usuarios')
        }})
    .catch(error => console.error(error))
}