export const createUserErrorInfo = (first_name,last_name,email,age,password) => {
    return `Una o más propiedades fueron enviadas incompletas o no son válidas.
    Lista de propiedades requeridas:
        * first_name: type String, recibido: ${first_name}
        * last_name: type String, recibido: ${last_name}
        * email: type String, recibido: ${email}
        * age: type Number, recibido: ${age}
        * password: type String, recibido: ${password}
    `
}