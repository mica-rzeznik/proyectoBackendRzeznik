export default class UsersDto{
    constructor (user) {
        this.name = `${user.first_name} ${user.last_name}`
        this.age = user.age
        this.email = user.email
        this.rol = user.role
        this.id = user._id
    }
}