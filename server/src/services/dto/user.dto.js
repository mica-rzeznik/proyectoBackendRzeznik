export default class UsersDto{
    constructor (user) {
        this.name = user.name
        this.age = user.age
        this.email = user.email
        this.id = user.id
    }
}