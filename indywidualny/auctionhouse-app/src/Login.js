import './App.css';
import * as server from './ServerService';

async function getAllUsers(){
  let users = await server.getUsers();
  console.log(users)
}

function Login() {
  getAllUsers();
  
  return (
    <div>
      <h2> Login </h2>
      <form>

      </form>
    </div>
  );
}

export default Login;
