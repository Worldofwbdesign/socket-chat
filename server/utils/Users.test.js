const { Users } = require('./Users')

describe('Users class', () => {
  const users = new Users()
  users.users = [
    {
      id: '1',
      name: 'Andrew',
      room: 'React course'
    },
    {
      id: '2',
      name: 'Garry',
      room: 'React course'
    },
    {
      id: '3',
      name: 'Joan',
      room: 'Node course'
    }
  ]
  
  it('Should add user', () => {
    const user = {
      id: '12345',
      name: 'New user',
      room: 'New room'
    }

    const users = new Users()
    users.addUser(user)
    expect(users.users).toEqual([user])
  })

  it('Should get users list for React course', () => {
    const roomUsers = users.getUserList('React course')
    expect(roomUsers).toEqual(['Andrew', 'Garry'])
  })

  it('Should get users list for Node course', () => {
    const roomUsers = users.getUserList('Node course')
    expect(roomUsers).toEqual(['Joan'])
  })

  it('Should remove user', () => {
    const firstUser = users.users[0]
    const removedUser = users.removeUser('1')
    expect(firstUser).toEqual(removedUser)
    expect(users.users.findIndex(user => user.id === '1')).toBe(-1)
  })

  it('Should not remove user', () => {
    const removedUser = users.removeUser('4')
    expect(removedUser).toBeFalsy()
    expect(users.users.length).toBe(2)
  })

  it('Should get user', () => {
    const secondUser = users.users[0]
    const findedUser = users.getUser('2')
    expect(findedUser).toEqual(secondUser)
  })

  it('Should not get user', () => {
    const findedUser = users.getUser('4')
    expect(findedUser).toBeFalsy()
  })
})