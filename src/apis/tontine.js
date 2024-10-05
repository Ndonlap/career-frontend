export const getTontineById = async (id) => {
    let response = await fetch(`http://localhost:5000/api/tontine/getTontineByID/${id}`, {
      method: 'get',
      headers: {
        'content-type': 'application/json',
        'accept': 'applicaion/json',
        'access-control-origin': '*',
        'Authorization': `Bearer ${localStorage.getItem('tonti_token')}`
      },
    })
    if (!response.ok) {
      throw ("An error occur in get data")
    }
    return response.json()
}

// get all members of a particular tontine
export const getTontineByMember = async () => {
    let response = await fetch(`http://localhost:5000/api/tontine/getTontineByMember`, {
      method: 'get',
      headers: {
        'content-type': 'application/json',
        'accept': 'applicaion/json',
        'access-control-origin': '*',
        'Authorization': `Bearer ${localStorage.getItem('tonti_token')}`
      },
    })
    if (!response.ok) {
      throw ("An error occur in get data")
    }
    const data = await response.json();
    return data;
  }