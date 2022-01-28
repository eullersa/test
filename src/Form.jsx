import {useState, useEffect, useMemo} from "react";
import Buttons from './components/Buttons'
import PdfFile from './components/PdfFile'
import AddItems from './components/AddItems'
import './css/index.scss'
import './css/popupProducts.scss'
import { serverStart, zapierAPI, Start } from "./api/request";
import { shortAnswer } from "./components/Inputs.jsx";
import SearchBar from './components/SearchBar.jsx'

function Form() {

  /* Currency */

 const currency = (money) => {
  return money.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
 }

 /*
 const currencyReverse = (money) => {
   return Number(money.replace('.', '').replace(',', '.').replace(/[^0-9.-]+/g,""))
 }
 */

 const [device, setDevice] = useState([])
 const [product, setProduct] = useState([])
 const [loadingPage, setLoadingPage] = useState(true)
 const [service, setService] = useState([])
 const [questions, setQuestions] = useState([])
 const [popup, setPopup] = useState(undefined)

 const getProducts = async() => {
  return await fetch(`${process.env.REACT_APP_SERVER}/products`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    })
    .then(response => response.json())
    .then(data => {
      setProduct(data.product.filter(product => product.type === 'Pneu').map(product => {
        return(
          {
            name: product.name,
            price: product.price          
          }
        )
      }))

      setService(data.product.filter(product => product.type === 'Serviço').map(product => {
        return(
          {
            name: product.name,
            price: product.price          
          }
        )
      }))

      setDevice(data.product.filter(product => product.type === 'Produto').map(product => {
        return(
          {
            name: product.name,
            price: product.price          
          }
        )
      }))

      setLoadingPage(false)
    })
    .catch(error => console.error(error))
  }

 useEffect(() => {
  Start()
  getProducts()
 }, [])

  /* Resetar formulário */


  /* Transformando as id's das questões em um único objeto */
  const [fields, setFields] = useState([])

  useMemo(() => {
    const allQuestions = [
      {
        id: 'employee',
        label: 'Consultor(a)',
        type: 'list',
        choices: ['Ana Lúcia', 'Edson Leandro', 'Julio Cesar', 'Nathália Hérissa'],
        handle: 'list',
        required: true,
        conditional: false
      },
      {
        id: 'client',
        label: 'Nome do cliente',
        type: 'text',
        handle: 'shortAnswer',
        required: true
      },
      {
        id: 'phone',
        label: 'Número do celular',
        type: 'tel',
        handle: 'phonehandle',
        required: true
      },
      {
        id: 'search',
        label: 'Pesquisa',
        type: 'text',
        handle: 'shortAnswer',
        required: false
      },
      {
        id: 'channel',
        label: 'Canal de primeiro contato',
        type: 'radio',
        choices: ['Presencial', 'Indicação', 'Ligação', 'WhatsApp', 'WhatsApp (Landing Page Geral de Pneus)', 'WhatsApp (Landing Page 205/55R16)', 'WhatsApp (Landing Page Troca de Óleo)', 'Outro'],
        handle: 'radio',
        required: true,
        conditional: false
      },
      {
        id: 'model',
        label: 'Modelo do carro',
        type: 'text',
        handle: 'shortAnswer',
        required: false
      },
      {
        id: 'carYear',
        label: 'Ano do carro',
        type: 'number',
        handle: 'numeric',
        min: 1990,
        max: new Date().getUTCFullYear() + 1,
        placeholder: `Ex: ${new Date().getUTCFullYear()}`,
        required: false
      },
      {
        id: 'searchbar',
        label: 'Escolha o pneu',
        type: 'list',
        choices: product,
        handle: 'searchbar',
        required: false,
        conditional: false
      },
      {
        id: 'products',
        label: 'Produtos',
        type: 'checkbox',
        choices: device,
        handle: 'checkbox',
        validation: false,
        conditional: false,
        required: false
      },
      {
        id: 'services',
        label: 'Demanda',
        type: 'checkbox',
        choices: service,
        handle: 'checkbox',
        validation: false,
        conditional: false,
        required: false
      },
      {
        id: 'motor',
        label: 'Motor do veículo',
        type: 'text',
        handle: 'shortAnswer',
        required: false
      }
    ]

    setQuestions(allQuestions)

    setFields(allQuestions.reduce((prev, current) => {
      return {...prev, [current.id]: {label: current.label, choices: current.choices, answer: '', conditional: current.conditional, validation: current.validation}}
    }, {}))
  }, [device, product, service])

  /* Guardando as informações dos campos id no "useState Hook" */

  const [button, setButton] = useState(true)
  const [pressed, setPressed] = useState(false)
  const [value, setValue] = useState('')
  const [budget, setBudget] = useState(false)
  const [products, setProducts] = useState({
    line1: {
      description: '',
      price: currency(0),
      quantity: '1'
    }
  })

  let verifyZeroProducts = Object?.values(products)?.find(product => product?.price === currency(0))

  const [services, setServices] = useState({
    line1: {
      description: '',
      price: currency(0),
      quantity: '1'
    }
  })

  let verifyZeroServices = Object?.keys(services).length > 0 ? Object?.values(services)?.find(service => service?.price === currency(0)) : undefined


  /* Handle Products */

  const handleProducts = (line, name) => e => {
    const numberValue = Number(e.target.value.replace(/[^0-9-]+/g,""))/100

    if(name === 'price') {
      setProducts({...products, [line]: {...products[line], [name]: currency(Number(numberValue))}})
    } else {
      setProducts({...products, [line]: {...products[line], [name]: e.target.value}})
    }
  }

  const handleServices = (line, name) => e => {
    
    const numberValue = Number(e.target.value.replace(/[^0-9-]+/g,""))/100
    
    if(name === 'price') {
      setServices({...services, [line]: {...services[line], [name]: currency(Number(numberValue))}})
    } else {
      setServices({...services, [line]: {...services[line], [name]: e.target.value}})
    }
    
  }

  /* Máscaras para validação correta */

  const maskPhone = (value) => {
    return value
      ?.replace(/\D/g, "")
      ?.replace(/(\d{2})(\d)/, "($1) $2")
      ?.replace(/(\d{5})(\d)/, "$1-$2")
      ?.replace(/(-\d{4})(\d+?)$/, "$1");
  }

  /* Envio de mudanças para o useState Hook */

  const handleChange = (field, handle) => event => {

    if(handle === 'phonehandle') {
      setFields({...fields, [field]: {...fields[field], answer: maskPhone(event.target.value)}})
    } else if (handle === 'checkbox' && field === 'services') {
      const labelCheck = event.target.labels[0].innerText
      
      let items = fields[field].answer.length === 0 ? [] : fields[field].answer.split(', ')
      const itemFind = items.indexOf(labelCheck);

      if(itemFind === -1) {
        items.push(labelCheck)
        items = items.join(', ')
      } else {
        items.splice(itemFind, 1)
        items = items.join(', ')
      }
      setFields(prev => ({...prev, [field]: {...fields[field], answer: items}}))

      // Função de autopreenchimento

      const value = labelCheck
      let servicesNames = service.map(item => item.name)
      let servicesPrices = service.map(item => item.price)
      let servicesIndex = servicesNames.indexOf(labelCheck)

      // servicesPrices[servicesIndex]
      
      let lineKey = Object.values(services).findIndex(service => service?.description === value)
      let keys = Object.keys(services)[lineKey]
      let lines = keys
      if(lineKey === -1 && services.line1?.description.length === 0 && event.target.checked === true) {
        delete services[`line1`]
        setServices({...services, [`line1`]: {description: `${value}`, price: currency(servicesPrices[servicesIndex]), quantity: '1'}})
      } else if(lineKey === -1 && event.target.checked === true) {
        setServices({...services, [`line${Object.values(services).length + 1}`]: {description: `${value}`, price: currency(servicesPrices[servicesIndex]), quantity: '1'}})
      } else {
        if(Object.values(services).length === 1 && event.target.checked === true) {
          delete services[lines]
          setServices({...services, [`line${Number(Object.keys(services).reverse()[0]?.slice(4, 10)) + 1}`]: {description: '', price: currency(servicesPrices[servicesIndex]), quantity: '1'}})
        }
        else if(Object.values(services).length > 1) {
          delete services[lines]
        } else {
          if(event.target.checked === false && Object.values(services).length === 1) {
            if(Object.keys(services).reverse()[0] === lines) {
              delete services[lines]
              setServices({...services, [`line1`]: {description: '', price: currency(servicesPrices[servicesIndex]), quantity: '1'}})
            } else {
              delete services[`line1`]
              setServices({...services, [`line1`]: {description: '', price: currency(servicesPrices[servicesIndex]), quantity: '1'}})
            }
          } else {
            delete services[lines]
            setServices({...services, [`line${Number(Object.keys(services).reverse()[0]?.slice(4, 10)) + 1}`]: {description: '', price: currency(servicesPrices[servicesIndex]), quantity: '1'}})
          }
        }
      }

      // Função de autopreenchimento
      
    }  else if (handle === 'checkbox' && field === 'products') {
      const labelCheck = event.target.labels[0].innerText
      
      let items = fields[field].answer.length === 0 ? [] : fields[field].answer.split(', ')
      const itemFind = items.indexOf(labelCheck);

      if(itemFind === -1) {
        items.push(labelCheck)
        items = items.join(', ')
      } else {
        items.splice(itemFind, 1)
        items = items.join(', ')
      }
      setFields(prev => ({...prev, [field]: {...fields[field], answer: items}}))

      // Função de autopreenchimento

      const value = labelCheck

      let devicesNames = device.map(item => item.name)
      let devicesPrices = device.map(item => item.price)
      let devicesIndex = devicesNames.indexOf(labelCheck)

      // devicesPrices[devicesIndex]

      let lineKey = Object.values(products).findIndex(service => service?.description === value)
      let keys = Object.keys(products)[lineKey]
      let lines = keys
      if(lineKey === -1 && products.line1?.description.length === 0 && event.target.checked === true) {
        delete products[`line1`]
        setProducts({...products, [`line1`]: {description: `${value}`, price: currency(devicesPrices[devicesIndex]), quantity: '1'}})
      } else if(lineKey === -1 && event.target.checked === true) {
        setProducts({...products, [`line${Number(Object.keys(products).reverse()[0]?.slice(4, 10)) + 1}`]: {description: `${value}`, price: currency(devicesPrices[devicesIndex]), quantity: '1'}})
      } else {
        if(Object.values(products).length === 1 && event.target.checked === true) {
          delete products[lines]
          setProducts({...products, [`line${Number(Object.keys(products).reverse()[0]?.slice(4, 10)) + 1}`]: {description: '', price: currency(devicesPrices[devicesIndex]), quantity: '1'}})
        }
        else if(Object.values(products).length > 1) {
          delete products[lines]
        } else {
          if(event.target.checked === false && Object.values(products).length === 1) {
            if(Object.keys(products).reverse()[0] === lines) {
              delete products[lines]
              setProducts({...products, [`line1`]: {description: '', price: currency(devicesPrices[devicesIndex]), quantity: '1'}})
            } else {
              delete products[`line1`]
              setProducts({...products, [`line1`]: {description: '', price: currency(devicesPrices[devicesIndex]), quantity: '1'}})
            }
          } else {
            delete products[lines]
            setProducts({...products, [`line${Number(Object.keys(products).reverse()[0]?.slice(4, 10)) + 1}`]: {description: '', price: currency(devicesPrices[devicesIndex]), quantity: '1'}})
          }
        }
      }

      // Função de autopreenchimento
      
    } else if (field === 'client') {
      setFields({...fields, [field]: {...fields[field], answer: event.target.value.split(' ').map(name => name.charAt(0).toUpperCase() + name?.slice(1).toLowerCase()).join(' ')}})
    } else if (field === 'model') {
      setFields({...fields, [field]: {...fields[field], answer: event.target.value.toUpperCase()}})
    } else if (handle === 'radio') {
      const value = event.target.labels[0].innerText
      setFields({...fields, [field]: {...fields[field], answer: value}})
    } else if(field === 'tires') {
      
      setFields({...fields, [field]: {...fields[field], answer: event.target.value}})
      const value = event.target.value

      let lineKey = Object.values(products).findIndex(service => service?.description === value)
      if(lineKey === -1 && products.line1?.description.length === 0) {
        delete products[`line1`]
        setProducts({...products, [`line${Object.values(products).length + 1}`]: {description: `${value}`, price: currency(0), quantity: '1'}})
      } else if(lineKey === -1) {
        setProducts(prev => ({...prev, [`line${Number(Object.keys(products).reverse()[0]?.slice(4, 10)) + 1}`]: {description: `${value}`, price: currency(0), quantity: '1'}}))
      } else {
        if(Object.values(products).length === 1 && products.line1?.description.length === 0) {
          setProducts({...products, [`line${Object.values(products).length + 1}`]: {description: '', price: currency(0), quantity: '1'}})
        }
      }
    } else {
      setFields({...fields, [field]: {...fields[field], answer: event.target.value}})
    }
  }

  let objFields = questions.reduce((prev, current) => {
    return {...prev, [current.id]: {label: current.label, choices: current.choices, answer: '', conditional: current.conditional, validation: current.validation}}
  }, {})

  const handleSubmit = (e) => {

      e.preventDefault()

      let fieldsStatus = {...fields, 
        status: {
          answer: "Novo lead",
          choices: ['Ganho', 'Novo lead', 'Orçamento Enviado', 'Follow Up', 'Perdido'],
          conditional: true,
          label: "Status",
          validation: undefined
        },
        justify: {
          label: "Justificativa",
          answer: "Nenhum",
          choices: ['Nenhum', 'Preço', 'Falta de produto', 'Prazo', 'Condição de pagamento'],
          conditional: true,
          validation: undefined
        }
      }

      const answers = Object.keys(fieldsStatus).map(value => {
        return {...fieldsStatus[value]}
      }).map(obj => {
        if (typeof obj?.choices === 'object') {
          let choices = obj?.choices.map(choice => {
            if (choice?.name !== undefined) {
              return choice?.name
            } else {
              return choice
            }
          })

          obj.choices = choices
          return obj
        } else {
          return obj
        }
      })

      let productBody;
      let serviceBody;

      if(products.length === 1 && products.line1?.description.length === 0 && products.line1.price === "R$ 0,00") {
        productBody = undefined
      } else if (Object.keys(products).length === 0) {
        productBody = undefined
      } else {
        productBody = Object.values(products).map((product, i) => {
          return {...product, price: Number(product.price.replace(/[^0-9-]+/g,""))/100}
        })
      }

      if(services.length === 1 && services.line1?.description.length === 0 && services.line1.price === "R$ 0,00") {
        serviceBody = undefined
      } else if (Object.keys(services).length === 0) {
        serviceBody = undefined
      } else {
        serviceBody = Object.values(services).map((service, i) => {
          return {...service, price: Number(service.price.replace(/[^0-9-]+/g,""))/100}
        })
      }

      let body = {
        ...(productBody !== undefined ? {products: productBody} : {}),
        ...(serviceBody !== undefined ? {services: serviceBody} : {}),
        answers,
        simple: button
      }

      if(serviceBody?.length === 1 && serviceBody[0]?.description?.length === 0) {
        delete body?.services
      }

      if(productBody?.length === 1 && productBody[0]?.description?.length === 0) {
        delete body?.products
      }

      serverStart(body, setPressed, setBudget)
      zapierAPI(answers, setFields, objFields, setServices, setProducts)
      setPressed(true)
      setBudget(false)
      setProducts({
        line1: {
          description: '',
          price: currency(0),
          quantity: '1'
        }
      })

      setServices({
        line1: {
          description: '',
          price: currency(0),
          quantity: '1'
        }
      })
      setValue('')
  }

  return (
    <div className='page'>
      {
        popup && 
        <div className='popupProducts'>
          <div className='popup'>Você tem certeza que deseja excluir {popup}?
          <div style={{display: 'flex', width: '100%', gap: 10}}>
          <button onClick={() => {
            if(popup === 'produtos') {
              setProducts({})
              setPopup(undefined)
            } else {
              setServices({})
              setPopup(undefined)
            }            
          }} type="submit" className="btn btn-danger mt-4">
            Sim
          </button>
          <button onClick={() => setPopup(undefined)} type="submit" className="btn btn-danger mt-4">
            Não
          </button>
          </div>
          </div>
        </div>
      }
      <div className="card page-card mt-4 banner">
        <div className="card-body">
        </div>
      </div> 
      <div className="card page-card mb-5 mt-4" style={loadingPage ? {display:'flex', justifyContent: 'center', alignItems: 'center'} : {}}>
        {loadingPage ? 
        <>
        <div style={loadingPage ? {margin: '15px', fontWeight: 600} : {}}>Aguarde, já estamos carregando.</div>
        <div className="spinner-border" style={loadingPage ? {marginBottom: 18} : {}} role="status">
          <span className="sr-only"></span>
        </div>
        </> : 
        <div className="card-body">
          {/* Formulário */}
            <form onSubmit={handleSubmit}>
            {/* Nome do Cliente */}
            {shortAnswer(handleChange, questions, SearchBar, fields, setFields, products, setProducts, value, setValue)}

            {
              Object.keys(products).length > 0 &&
              <AddItems title={'Produtos'} setPopup={setPopup} items={products} setItems={setProducts} handleItems={handleProducts} />
            }

            {
              Object.keys(services).length > 0 &&
              <AddItems title={'Serviços'} setPopup={setPopup} items={services} setItems={setServices} handleItems={handleServices} />
            }            

            {
              budget && 
              <PdfFile budget={budget} />
            }

            <Buttons setButton={setButton} fields={fields} pressed={pressed} verifyZeroProducts={verifyZeroProducts} verifyZeroServices={verifyZeroServices} />
          </form>
        </div>}
      </div>
        
    </div>
  );
}

export default Form;
