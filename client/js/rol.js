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