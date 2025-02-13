import { useEffect, useState } from 'react'
import electronLogo from './assets/logo.ico'
import getJobPerson from './utils/getJobPerson.js';

function App() {
  // useEffect(() => {
  //   (async (data="test") => await window.api.foo(data))()
  // }, [])

  const [persons, setPersons] = useState([]);
  const [persons_job, setPersonsJob] = useState([]);

  // useEffect(() => {
  //   const fetchPersonsJob = async () => {
  //     const res = await window.api.getPersonsJob();
  //     setPersonsJob(res);
  //   };

  //   fetchPersonsJob();
  // }, [])

  useEffect(() => {
    const fetchPersons = async () => {
      const persons = await window.api.getPartners([]);
      const persons_job = await window.api.getPersonsJob([]);

      setPersonsJob(persons_job);
      setPersons(persons);
    };

    fetchPersons();
  },[])

  let currentDate = new Date()

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <h1>Семейный бюджет</h1>
      <ul>
        {persons.map((person) => {
          // const job = getJobPerson(persons_job, person.id);
          console.log(persons_job[person.id]);
          return (
            <li key={person.id} className='partner-card'>
              <div className="partner-data">
                <p className="card_heading">{person.name}</p>
                <div className="partner-data-info">
                  <p>{Math.floor((currentDate - person.birthday) / 31536000000) }</p>
                  <p>{getJobPerson(persons_job, person.id)} | {"Безработный"}</p>
                  <p></p>
                </div>
              </div>
              <div className="partner-sale partner-data card_heading">
                
              </div>
          </li>
          )
        })}
      </ul>
    </>
  )
}

export default App

