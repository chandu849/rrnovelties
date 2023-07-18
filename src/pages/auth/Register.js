import { Link, useNavigate } from 'react-router-dom'
import Card from '../../components/card/Card'
import styles from './Auth.module.scss'
import registerImg from '../../assets/register.png'
import { useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {createUserWithEmailAndPassword} from 'firebase/auth'
import {auth} from '../../firebase/Config'
import Loader from '../../components/loader/Loader'

const Register = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [cPassword, setCPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const submitUser = (e) => {
    e.preventDefault();
    if(password !== cPassword) {
      return toast.error("Passwords do not match")
    }
    setIsLoading(true)
    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log(user);
    setIsLoading(false);
    toast.success("Rregistered successfully...")
    navigate("/login")
  })
  .catch((error) => {
    toast.error(error.message)
    setIsLoading(false)
  });

  }

  return (
    <>
    {isLoading && <Loader />}
    <section className={`container ${styles.auth}`}>
    <Card>
    <div className={styles.form}>
      <h2>Register</h2>
      <form onSubmit={submitUser}>
        <input type="text" placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)}/>
        <input type="password" placeholder='Password' required value={password} onChange={(e) => setPassword(e.target.value)}/>
        <input type="password" placeholder='Confirm password' required value={cPassword} onChange={(e) => setCPassword(e.target.value)}/>
        <button type="submit" className='--btn --btn-primary --btn-block'>Register</button>
      </form>
      <span className={styles.register}>
        <p>Already have an account?</p>
        <Link to="/login"> Login</Link>
      </span>
    </div>
    </Card>
    <div className={styles.img}>
      <img src={registerImg} alt="Register" width="400"/>
    </div>
  </section>
  </>
  )
}

export default Register