const getJobPerson = (persons, id) => {
    const findPerson = persons.filter((person) => person.person_id === id);
    return findPerson.name;
};

export default getJobPerson;