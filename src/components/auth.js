export const users = [
  {
    username: 'user',
    password: 'password1',
    role: 'admin',
    firstName: 'Alexis',
    lastName: 'Dumont',
    gender: 'male'
  },
  {
    username: 'admin',
    password: 'password2',
    role: 'user',
    firstName: 'Jane',
    lastName: 'Ariette',
    gender: 'female'
  }
]

export async function login(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find((user) => user.username === username && user.password === password)
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
