import * as auth from '../_services/AuthService';
import { useState } from 'react';

// async function getAllUsers() {
//   let users = await server.getUsers();
//   console.log(users)
// }

function Login() {
  // getAllUsers();
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    auth.login({username, password})
  }

  return (
    <div>
      <h2> Login </h2>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={e => setUserName(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
