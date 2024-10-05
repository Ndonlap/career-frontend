export const getConnectedUserDetail = async () => {
    let response = await fetch(`http://localhost:5000/api/user/getUserDetail`, {
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
    return await response.json()
  }
  