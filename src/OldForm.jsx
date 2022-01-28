import {useState, useEffect} from "react";
import './css/index.scss'
import { serverStart, zapierAPI, Start } from "./api/request";

function Form() {

  /* Currency */

 const currency = (money) => {
  return money.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
 }

 useEffect(() => {
  Start()
 }, [])

  /* Resetar formulário */

  const questions = [
    {
      id: 'employee',
      label: 'Consultor(a)',
      type: 'list',
      choices: ['Ana Lúcia', 'Danielle', 'Edson Leandro', 'Nathália Hérissa', 'Renan Junior'],
      handle: 'list',
      required: false,
      conditional: false
    },
    {
      id: 'client',
      label: 'Nome do cliente',
      type: 'text',
      handle: 'shortAnswer',
      required: false
    },
    {
      id: 'phone',
      label: 'Número do celular',
      type: 'text',
      handle: 'phonehandle',
      required: false
    },
    {
      id: 'action',
      label: 'Plano de ação',
      type: 'radio',
      choices: ['Agendar', 'Enviar portifólio e orçamento', 'Follow up'],
      handle: 'radio',
      required: false
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
      choices: ['Google', 'WhatsApp', 'Estabelecimento', 'Indicação', 'Ligação', 'Outro'],
      handle: 'radio',
      required: false,
      conditional: false
    },
    {
      id: 'status',
      label: 'Status de acompanhamento',
      type: 'radio',
      choices: ['Ganho', 'No aguardo', 'Perdido'],
      handle: 'radio',
      required: false
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
      min: new Date().getUTCFullYear() - 21,
      max: new Date().getUTCFullYear() + 1,
      placeholder: `Ex: ${new Date().getUTCFullYear()}`,
      required: false
    },
    {
      id: 'tires',
      label: 'Escolha o pneu',
      type: 'list',
      choices: ['165/70R13', '165/70R14', '175/65R14', '175/65R15',
      '175/70R13', '175/70R14', '185/35R17', '185/55R16',
      '185/60R15', '185/65R14', '185/65R15', '185/65R15',
      '185/70R13', '185/70R14', '185/70R15', '186/65R15',
      '195/50R16', '195/55R15', '195/55R16', '195/60R15',
      '195/60R16', '195/65R15', '195/70R15', '195/75R16',
      '205/50R17', '205/55R16', '205/55R17', '205/60R15',
      '205/60R16', '205/65R15', '205/65R16', '205/70R15',
      '205/70R17', '215/45R17', '215/50R17', '215/60R17',
      '215/65R16', '215/75R17', '225/40R18', '225/40R19',
      '225/45R17', '225/45R18', '225/50R17', '225/50R18',
      '225/55R17', '225/55R18', '225/55R19', '225/60R18',
      '225/65R17', '225/75R16', '235/45R19', '235/50R18',
      '235/50R19', '235/55R17', '235/55R18', '235/55R20',
      '235/60R16', '235/60R18', '235/70R16', '235/70R17',
      '235/75R15', '245/40R17', '245/40R19', '245/45R17',
      '245/45R18', '245/45R20', '245/70R16', '255/70R16',
      '262/60R18', '265/60R18', '265/65R17', '265/70R16',
      '265/75R16', '275/40R19'],
      handle: 'list',
      required: false,
      conditional: false
    },
    {
      id: 'services',
      label: 'Tipos de serviços',
      type: 'checkbox',
      choices: ['Troca de pneu', 'Balanceamento', 'Alinhamento', 'Troca de óleo', 'Troca de válvulas', 'Reparo do freio', 'Reparo da suspensão'],
      handle: 'checkbox',
      validation: false,
      conditional: false,
      required: false
    }
  ]

  /* Transformando as id's das questões em um único objeto */

  let objFields = questions.reduce((prev, current) => {
    return {...prev, [current.id]: {label: current.label, choices: current.choices, answer: '', conditional: current.conditional, validation: current.validation}}
  }, {})

  /* Guardando as informações dos campos id no "useState Hook" */

  const [fields, setFields] = useState(objFields)
  const [pressed, setPressed] = useState(false)
  const [budget, setBudget] = useState(false)
  const [products, setProducts] = useState({
    line1: {
      description: '',
      price: currency(0),
      quantity: '1'
    }
  })

  const [services, setServices] = useState({
    line1: {
      description: '',
      price: currency(0),
      quantity: '1'
    }
  })

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
    } else if (handle === 'checkbox') {
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

      const value = labelCheck
      let lineKey = Object.values(services).findIndex(service => service?.description === value)
      let keys = Object.keys(services)[lineKey]
      let lines = keys
      if(lineKey === -1 && services.line1?.description.length === 0 && event.target.checked === true) {
        delete services[`line1`]
        setServices({...services, [`line1`]: {description: `${value}`, price: currency(0), quantity: '1'}})
      } else if(lineKey === -1 && event.target.checked === true) {
        setServices({...services, [`line${Number(Object.keys(services).reverse()[0].slice(4, 10)) + 1}`]: {description: `${value}`, price: currency(0), quantity: '1'}})
      } else {
        if(Object.values(services).length === 1 && event.target.checked === true) {
          delete services[lines]
          setServices({...services, [`line${Number(Object.keys(services).reverse()[0].slice(4, 10)) + 1}`]: {description: '', price: currency(0), quantity: '1'}})
        }
        else if(Object.values(services).length > 1) {
          delete services[lines]
        } else {
          if(event.target.checked === false && Object.values(services).length === 1) {
            if(Object.keys(services).reverse()[0] === lines) {
              delete services[lines]
              setServices({...services, [`line1`]: {description: '', price: currency(0), quantity: '1'}})
            } else {
              delete services[`line1`]
              setServices({...services, [`line1`]: {description: '', price: currency(0), quantity: '1'}})
            }
          } else {
            delete services[lines]
            setServices({...services, [`line${Number(Object.keys(services).reverse()[0].slice(4, 10)) + 1}`]: {description: '', price: currency(0), quantity: '1'}})
          }
        }
      }
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
        setProducts(prev => ({...prev, [`line${Number(Object.keys(products).reverse()[0].slice(4, 10)) + 1}`]: {description: `${value}`, price: currency(0), quantity: '1'}}))
      } else {
        if(Object.values(products).length === 1 && products.line1.description.length === 0) {
          setProducts({...products, [`line${Object.values(products).length + 1}`]: {description: '', price: currency(0), quantity: '1'}})
        }
      }
    } else {
      setFields({...fields, [field]: {...fields[field], answer: event.target.value}})
    }
  }

  const handleSubmit = async(event) => {
      event.preventDefault()
      const answers = Object.keys(fields).map(value => {
        return {...fields[value]}
      })

      let productBody;
      let serviceBody

      if(products.length === 1 && products.line1.description.length === 0 && products.line1.price === "R$ 0,00") {
        productBody = undefined
      } else {
        productBody = Object.values(products).map((product, i) => {
          return {...product, price: Number(product.price.replace(/[^0-9-]+/g,""))/100}
        })
      }

      if(services.length === 1 && services.line1.description.length === 0 && services.line1.price === "R$ 0,00") {
        serviceBody = undefined
      } else {
        serviceBody = Object.values(services).map((service, i) => {
          return {...service, price: Number(service.price.replace(/[^0-9-]+/g,""))/100}
        })
      }

      let body = {
        products: productBody,
        services: serviceBody,
        answers
      }

      serverStart(body, setPressed, setBudget)
      zapierAPI(answers, setFields, objFields, setServices, setProducts)
      setPressed(true)
      setBudget(false)
  }

  const shortAnswer = (handle, questions) => (
    questions.map((question, id) => {

      if(question.handle === 'shortAnswer') {
        return (
          <div className="mb-4" key={id}>
            <label htmlFor={question.id} className="form-label label">{question.label}:</label>
            <input onChange={handle(question.id)} type={question.type} value={fields[question.id].answer} className="form-control" id={question.id} aria-describedby="emailHelp" required={question.required} />
          </div>
        )
      }

      if(question.handle === 'phonehandle') {
        return (
          <div className="mb-4" key={id}>
            <label htmlFor={question.id} className="form-label label">{question.label}:</label>
            <input value={fields[question.id].answer} pattern="[(][0-9]{2}[)][ ][0-9]{5}[-][0-9]{4}" onChange={handle(question.id, question.handle)} type={question.type} className="form-control" id={question.id} aria-describedby="emailHelp" required={question.required} />
          </div>
        )
      }

      
      if(question.handle === 'list') {
        return (
          <div className="mb-4" key={id}>
            <label htmlFor={question.id} className="form-label label">{question.label}:</label>
            <select value={fields[question?.id]?.answer.length === 0 ? 'disabled' : fields[question?.id]?.answer} onChange={handle(question.id)} className="form-select" id={question.id} aria-label="Default select example" required={question.required}>
            <option value="disabled" disabled>- Selecione -</option>
            {question.choices.map((value, id) => {
              return (
                <option key={id} value={value}>{value}</option>
              )
            })}
            </select>
          </div>
        )
      }

      if(question.handle === 'numeric') {
        return (
          <div className="mb-4" key={id}>
            <label htmlFor={question.id} className="form-label label">{question.label}:</label>
            <input onChange={handle(question.id)} type={question.type} placeholder={question.placeholder} min={question.min} max={question.max} value={fields[question.id].answer} className="form-control" id={question.id} />
          </div>
        )
      }

      if(question.handle === 'checkbox') {
        return (
          <div className="mb-4" key={id}>
          <label htmlFor={question.id} className="form-label label">{question.label}:</label>
            {question.choices.map((value, id) => {
              return (
                <div className="form-check" key={id}>
                  <input onClick={() => {
                  }
                    
                  } checked={fields[question?.id]?.answer?.split(', ').indexOf(value) === -1 ? false : true} onChange={handle(question.id, question.handle)} className="form-check-input" type={question.type} name={question.id} id={`${question.id}-${id}`}/>
                  <label className="form-check-label" htmlFor={`${question.id}-${id}`}>{value}</label>
                </div>
              )
            })}
          </div>
        )
      }

      if(question.handle === 'radio') {
        return (
          <div className="mb-4" key={id}>
          <label htmlFor={question.id} className="form-label label">{question.label}:</label>
            {question.choices.map((value, id) => {
              return (
                <div className="form-check" key={id}>
                  <input onChange={handle(question.id, question.handle)} className="form-check-input" type={question.type} name={question.id} id={`${question.id}-${id}`} checked={fields[question.id].answer === value ? true : false} />
                  <label className="form-check-label" htmlFor={`${question.id}-${id}`}>{value}</label>
                </div>
              )
            })}
          </div>
        )
      }
    

      return undefined

    })
  )

  return (
    <div className='page'>
      <div className="card page-card mt-4 banner">
        <div className="card-body">
        </div>
      </div> 
      <div className="card page-card mb-5 mt-4">
        <div className="card-body">
          {/* Formulário */}

          <form onSubmit={handleSubmit}>
            {/* Nome do Cliente */}
            {shortAnswer(handleChange, questions)}

            <label className="form-label label">Produtos:</label>
            {products && Object.values(products).map((product, i) => {
              let line = Object.keys(products)[i]

              return(
              <div className="products" key={i} width={"100%"}>
                <div className="col-md-15">
                  {i === 0 ? (
                  <label htmlFor={`validation1${i}`} className="form-label">Descrição</label>) : null}
                  <input type="text" className="form-control" id={`validation1${i}`} onChange={handleProducts(line, 'description')} value={product?.description} required />
                </div>
                <div className="col-md-30">
                  {i === 0 ? (<label htmlFor={`validation2${i}`} className="form-label">Quant.</label>) : null}
                  <input type="number" className="form-control" id={`validation2${i}`} min={1} onChange={handleProducts(line, 'quantity')} value={product?.quantity} required />
                </div>
                <div className="col-md-4">
                  {i === 0 ? (
                  <label htmlFor={`validation3${i}`} className="form-label">Preço</label>) : null}
                  <input type="text" className="form-control" id={`validation3${i}`} onChange={handleProducts(line, 'price')} value={product?.price} required />
                </div>
                <div>
                  {i === 0 ? (
                  <label className="form-label">&nbsp;</label>) : null}
                  <button type='button' style={{width: "30px", marginTop: '10px'}} onClick={() => {
                    if(Object.values(products).length === 1) {
                      delete products[`line${Object.keys(products)[i].slice(4, 10)}`]
                      setProducts({line1: {description: '', price: currency(0), quantity: '1'}})
                    } else {
                      delete products[`line${Object.keys(products)[i].slice(4, 10)}`]
                      setProducts(prev => ({...prev}))
                    }
                  }} className="btn btn-danger">-</button>
                </div>
              </div>
            )})}

            {products &&
              <div className="buttonPlus">
                <button type='button' onClick={() => {
                  setProducts(prev => ({...prev, [`line${Number(Object.keys(products).reverse()[0].slice(4, 10)) + 1}`]: {description: '', price: currency(0), quantity: '1'}}))
                }} className="btn btn-danger mt-3">+</button>
                
                <button type='button' onClick={() => {
                  if(Object.values(products).length === 1) {
                    delete products[`line${Object.keys(products).reverse()[0].slice(4, 10)}`]
                    setProducts({line1: {description: '', price: currency(0), quantity: '1'}})
                  } else {
                    delete products[`line${Object.keys(products).reverse()[0].slice(4, 10)}`]
                    setProducts(prev => ({...prev}))
                  }
                }} className="btn btn-danger mt-3">-</button>
              </div>
            }

            <label className="form-label label">Serviços:</label>
            {services && Object.values(services).map((service, i) => {
              let line = Object.keys(services)[i]

              return(
              <div className="services" key={i} width={"100%"}>
                <div className="col-md-15">
                  {i === 0 ? (
                  <label htmlFor={`services1${i}`} className="form-label">Descrição</label>) : null}
                  <input type="text" className="form-control" id={`services1${i}`} onChange={handleServices(line, 'description')} value={service?.description} required />
                </div>
                <div className="col-md-30">
                  {i === 0 ? (<label htmlFor={`services2${i}`} className="form-label">Quant.</label>) : null}
                  <input type="number" className="form-control" id={`services2${i}`} min={1} onChange={handleServices(line, 'quantity')} value={service?.quantity} required />
                </div>
                <div className="col-md-4">
                  {i === 0 ? (
                  <label htmlFor={`services3${i}`} className="form-label">Preço</label>) : null}
                  <input type="text" className="form-control" id={`services3${i}`} onChange={handleServices(line, 'price')} value={service?.price} required />
                </div>
                <div>
                  {i === 0 ? (
                  <label className="form-label">&nbsp;</label>) : null}
                  <button type='button' style={{width: "30px", marginTop: '10px'}} onClick={() => {
                    if(Object.values(services).length === 1) {
                      delete services[`line${Object.keys(services)[i].slice(4, 10)}`]
                      setServices({line1: {description: '', price: currency(0), quantity: '1'}})
                    } else {
                      delete services[`line${Object.keys(services)[i].slice(4, 10)}`]
                      setServices(prev => ({...prev}))
                    }
                  }} className="btn btn-danger">-</button>
                </div>
              </div>
            )})}

            {services &&
              <div className="buttonPlus">
                <button type='button' onClick={() => {
                  setServices(prev => ({...prev, [`line${Number(Object.keys(services).reverse()[0].slice(4, 10)) + 1}`]: {description: '', price: currency(0), quantity: '1'}}))
                }} className="btn btn-danger mt-3">+</button>
                
                <button type='button' onClick={() => {
                  if(Object.values(services).length === 1) {
                    delete services[`line${Object.keys(services).reverse()[0].slice(4, 10)}`]
                    setServices({line1: {description: '', price: currency(0), quantity: '1'}})
                  } else {
                    delete services[`line${Object.keys(services).reverse()[0].slice(4, 10)}`]
                    setServices(prev => ({...prev}))
                  }
                }} className="btn btn-danger mt-3">-</button>
              </div>
            }

            {budget && 
              <a href={budget}>
                <div className="budget" style={{backgroundImage: `url("https://www.freeiconspng.com/uploads/pdf-icon-png-pdf-zum-download-2.png")`, backgroundSize: "contain", width: '100%', height: '50px', backgroundPosition: 'center', marginTop: '20px', backgroundRepeat: 'no-repeat'}}>
                </div>
              </a>  
            }
            
            <button type="submit" disabled={
              fields?.action?.answer.length === 0 ||
              fields?.carYear?.answer.length === 0 ||
              fields?.channel?.answer.length === 0 ||
              fields?.client?.answer.length === 0 ||
              fields?.employee?.answer.length === 0 ||
              fields?.model?.answer.length === 0 ||
              fields?.phone?.answer.length === 0 ||
              fields?.search?.answer.length === 0 ||
              fields?.services?.answer.length === 0 ||
              fields?.status?.answer.length === 0 ||
              // fields?.tires?.answer.length === 0 ||
              pressed === true
            } className="btn btn-danger mt-4">
              {pressed === true ? (
              <div className="spinner-border" role="status">
                <span className="sr-only"></span>
              </div>
              ) :
                (<>
                  Confirmar dados
                </>)
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Form;
