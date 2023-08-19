const uploadDocumentsForm = document.getElementById('uploadDocumentsForm')
const uploadProfileForm = document.getElementById('uploadProfileForm')

function cambiarRol(userId) {
    fetch(`/api/users/premium/${userId}`, { method: 'PUT' })
    .then((response) => {
        if (response.ok) {
            alert('Rol de usuario cambiado. Por favor, inicie sesión nuevamente para efectuar los cambios.')
            window.location.replace('/users/login')
        } else {
            return response.json().then((error) => {
                console.error(error.cause)
                alert('No se pudo cambiar el rol del usuario: ' + error.message)
            })
        }})
    .catch(error => console.error(error))
}

uploadDocumentsForm.addEventListener('submit', e => {
    e.preventDefault()
    const userId = uploadDocumentsForm.name
    const data = new FormData(uploadDocumentsForm)
    fetch(`/api/users/${userId}/documents`, {
        method: 'POST',
        body: data
    }).then(result=> {
        if (result.status === 200) {
            alert("Archivos subidos con éxito!")
            fetch(`/api/users/premium/${userId}`, { method: 'PUT' })
            .then((response) => {
                if (response.ok) {
                    alert('Rol de usuario cambiado. Por favor, inicie sesión nuevamente para efectuar los cambios.')
                    window.location.replace('/users/login')
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

uploadProfileForm.addEventListener('submit', e => {
    e.preventDefault()
    const userId = uploadProfileForm.name
    const data = new FormData(uploadProfileForm)
    fetch(`/api/users/${userId}/documents`, {
        method: 'POST',
        body: data
    }).then(result=> {
        if (result.status === 200) {
            alert("Archivos subidos con éxito!")
            window.location.reload()
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
    fetch(`/api/users/delete/${userId}`, { method: 'DELETE' })
    .then((response) => {
        if (response.ok) {
            window.location.reload()
        } else {
            console.error('Error al eliminar el usuario')
        }})
    .catch(error => console.error(error))
}

function eliminarUsers() {
    fetch(`/api/users/delete`, { method: 'DELETE' })
    .then((response) => {
        if (response.ok) {
            window.location.reload()
        } else {
            console.error('Error al eliminar los usuarios')
        }})
    .catch(error => console.error(error))
}