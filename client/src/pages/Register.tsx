import axios from 'axios';
import React, { SyntheticEvent, useState } from 'react';
import '../Login.css';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    axios
      .post('http://localhost:8000/api/register', {
        firstName,
        lastName,
        email,
        password,
        passwordConfirm,
      })
      .then((res) => {
        console.log(res.data);
      });
  };

  return (
    <main className="form-signin">
      <form onSubmit={handleSubmit}>
        <h1 className="h3 mb-3 fw-normal">Please Register</h1>

        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="firstName"
            value={firstName}
            onChange={({ target: { value } }) => setFirstName(value)}
          />
          <label htmlFor="firstName">First Name</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="lastName"
            value={lastName}
            onChange={({ target: { value } }) => setLastName(value)}
          />
          <label htmlFor="lastName">Last Name</label>
        </div>
        <div className="form-floating">
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={({ target: { value } }) => setEmail(value)}
          />
          <label htmlFor="email">Email address</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={({ target: { value } }) => setPassword(value)}
          />
          <label htmlFor="password">Password</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="passwordConfirm"
            value={passwordConfirm}
            onChange={({ target: { value } }) => setPasswordConfirm(value)}
          />
          <label htmlFor="passwordConfirm">Password Confirm</label>
        </div>

        <button className="w-100 btn btn-lg btn-primary" type="submit">
          Register
        </button>
      </form>
    </main>
  );
};

export default Register;
