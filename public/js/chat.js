const socket = io()

const messagesContainer = document.getElementById('messages')

const scrollBottom = () => {
  const newMessage = messagesContainer.querySelector('li:last-child')
  const { scrollHeight, clientHeight, scrollTop } = messagesContainer
  const newMessageHeight = newMessage.offsetHeight
  const lastMessageHeight = newMessage.previousElementSibling && newMessage.previousElementSibling.offsetHeight
  
  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messagesContainer.scrollTo(0, scrollHeight)
  }
}

socket.on('connect', () => {
  socket.emit('join', deparam(), (err) => {
    if (err) {
      alert(err)
      window.location.href = '/'
    }
  })
})

socket.on('newMessage', ({ from, text, createdAt }) => {
  const time = moment(createdAt).format('h:mm a')
  const template = document.getElementById('message-template').innerHTML
  const html = Mustache.render(template, {
    from,
    text,
    createdAt: time
  })
  messagesContainer.insertAdjacentHTML('beforeend', html)
  scrollBottom()
})

socket.on('newLocationMessage', ({ from, url, createdAt }) => {
  const time = moment(createdAt).format('h:mm a')
  const template = document.getElementById('location-message-template').innerHTML
  const html = Mustache.render(template, {
    from,
    url,
    createdAt: time
  })
  messagesContainer.insertAdjacentHTML('beforeend', html)
})

socket.on('updateUserList', users => {
  const usersContainer = document.getElementById('users')
  usersContainer.innerHTML = ''
  const list = document.createElement('ol')

  users.forEach(user => {
    const li = document.createElement('li')
    li.textContent = user
    list.appendChild(li)
  })

  usersContainer.appendChild(list)
})

const form = document.getElementById('form')
form.addEventListener('submit', (e) => {
  e.preventDefault()
  const messageInput = e.target.elements.message

  if (messageInput.value) {
    socket.emit('createMessage', messageInput.value, msg => {
      messageInput.value = ''
      messageInput.focus()
    })
  }
})

const positionBtn = document.getElementById('position')

positionBtn.onclick = () => {
  if (!navigator.geolocation) {
    return alert("Yout browser doesn't support geolocation!")
  }

  positionBtn.setAttribute('disabled', 'disabled')
  positionBtn.textContent = 'Sending location...'

  navigator.geolocation.getCurrentPosition(location => {
    positionBtn.removeAttribute('disabled')
    positionBtn.textContent = 'Send location'

    const { latitude, longitude } = location.coords
    socket.emit('createLocationMessage', { latitude, longitude })
  }, () => {
    positionBtn.removeAttribute('disabled')
    positionBtn.textContent = 'Send location'
    alert('Unable to fetch location!')
  })
} 