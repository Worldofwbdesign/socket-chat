class Users {
  constructor() {
    this.users = []
  }
  
  addUser (newUser) {
    this.users.push(newUser)
    return newUser
  }

  removeUser (id) {
    const index = this.users.findIndex(user => user.id === id)
    if (index > -1) {
      return this.users.splice(index, 1)[0]
    }
  }

  getUser (id) {
    return this.users.find(user => user.id === id)
  }

  getUserList (room) {
    return this.users.filter(user => user.room === room)
      .map(user => user.name)
  }
}

module.exports = {Users}