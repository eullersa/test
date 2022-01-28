// Currency

const currency = (money) => {
  return money.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
}

// STARTING SERVER

const server = process.env.REACT_APP_SERVER

export const serverStart = async(body, setPressed, setBudget) => {
    return await fetch(`${server}/create/budget`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(response => {
      setPressed(false)
      setBudget(response)
      window.location.href = response.pdf
    })
    .catch(error => console.log(error))
}

// STARTING SERVER

export const Start = async() => {
    return await fetch(`${server}/start`)
    .then(response => response.json())
}

// ZAPIER INTEGRATION

export const zapierAPI = async(body, setFields, objFields, setServices, setProducts) => {

  const headers = body.map((value) => {
    return value.label
  })

  body = headers.map((value, key) => {
      let answer = body[Object.keys(value)[key]]?.answer
      answer = answer?.length === 0 ? '' : answer
      if(answer === '') {
        body[Object.keys(value)[key]].validation = false
      }
      return {[value]: answer}
  }).reduce((result, obj) => {
      return {...result, ...obj};
  }, {})

  return await fetch('https://hooks.zapier.com/hooks/catch/11097796/bda7i0u', {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(response => {
     setFields(prev => ({...prev, ...objFields}))
     setServices({
        line1: {
          description: '',
          price: currency(0),
          quantity: '1'
        }
     })
     setProducts({
      line1: {
        description: '',
        price: currency(0),
        quantity: '1'
      }
   })
  })
  .catch(error => console.log(error))
}


//////////////////////////////////////// Products ///////////////////////////////////////////

export const getProducts = async(setProduct, setLoading) => {
  return await fetch(`${server}/products`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    setProduct(data.product)
    setLoading(true)
  })
  .catch(error => console.log(error))
}

export const createProducts = async(setFields, setLoading, body, setSuccess) => {
  return await fetch(`${server}/product/create`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(response => response.json())
  .then(data => {
    setLoading(false)
    setFields({
      name: '',
      price: currency(0),
      type: ''
    })
    setSuccess(true)
  })
  .catch(error => console.log(error))
}

export const updateProducts = async(setFields, setLoading, body, id, setSuccess) => {
  return await fetch(`${server}/product/update/${id}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(response => response.json())
  .then(data => {
    setLoading(false)
    setSuccess(true)
  })
  .catch(error => console.log(error))
}

export const getById = async(id, setFields) => {
  return await fetch(`${server}/product/get/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    if(data.success === true) {
      setFields({
        name: data?.product?.name,
        price: currency(Number(data?.product?.price)),
        type: data?.product?.type
      })
    }
  })
  .catch(error => console.log(error))
 }