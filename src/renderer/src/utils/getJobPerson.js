const getJobPerson = (persons, id) => {
    const findPerson = persons.filter((person) => person.person_id === id);
    if(findPerson.length === 0) {
        return null
    }
    return findPerson.name;
};

export default getJobPerson;