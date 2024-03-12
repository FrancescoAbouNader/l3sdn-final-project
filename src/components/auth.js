
const users = [
    { username: 'user1', password: 'password1', role: 'admin' },
    { username: 'user2', password: 'password2', role: 'user' }
  ]
  
  export async function login(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(user => user.username === username && user.password === password)
        if (user) {
          resolve(user)
        } else {
          reject(new Error('Identifiants incorrects'))
        }
      }, 1000)
    })
  }
  
  export async function logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 500)
    })
  }
  