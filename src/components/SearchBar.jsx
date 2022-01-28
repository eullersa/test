import { useRef, useState } from 'react'
import '../css/index.scss'
import '../css/searchbar.scss'

function Form({listItems = [], products, setProducts, setFields, fields, id, label, setValue, value}) {

  const currency = (money) => {
    return money.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
  }

  const ulList = useRef([])
  ulList.current = []

  let productName = listItems.map(item => item.name)
  let productPrice = listItems.map(item => item.price)

  const [show, setShow] = useState(false)
  const [select, setSelect] = useState(0)

  const addFunction = (text = value) => {

    let indexProduct = productName.indexOf(text)

    // Função de autopreenchimento
    setFields({...fields, searchbar: {...fields['searchbar'], answer: text}})

    let lineKey = Object.values(products).findIndex(service => service?.description === text)
    if(lineKey === -1 && products.line1?.description.length === 0) {
      delete products[`line1`]
      setProducts({...products, [`line${Object.values(products).length + 1}`]: {description: `${text}`, price: currency(productPrice[indexProduct]), quantity: '1'}})
    } else if(lineKey === -1) {
      setProducts(prev => ({...prev, [`line${Number(Object.keys(products).reverse()[0].slice(4, 10)) + 1}`]: {description: `${text}`, price: currency(productPrice[indexProduct]), quantity: '1'}}))
    } else {
      if(Object.values(products).length === 1 && products.line1.description.length === 0) {
        setProducts({...products, [`line${Object.values(products).length + 1}`]: {description: '', price: currency(productPrice[indexProduct]), quantity: '1'}})
      }
    }
  }

  const handleKey = (e) => {

    let list = productName?.filter(item => item?.toLowerCase().startsWith(value?.toLowerCase()))

    if(e.keyCode === 13) {
      if(select !== -1) {
        setValue(list[select].toUpperCase())
        addFunction(list[select].toUpperCase())
      }
      setShow(false)
      e.target.blur()
    }

    if(e.keyCode === 38) {
      if(select > 0) {
        setSelect(prev => prev - 1)
        ulList.current[select - 1]?.scrollIntoView({block: "nearest", inline: "start"})
      } else {
        setSelect(-1)
        setValue(value)
      }
    }
    
    if(e.keyCode === 40) {
      if(select <= list?.length - 2) {
        setSelect(prev => prev + 1)
        ulList.current[select + 1]?.scrollIntoView({block: "nearest", inline: "start"})
      }
    }
  }

  const showList = (e) => {
    setShow(true)
  }

  const hideList = (e) => {
    setShow(false)
    setSelect(-1)
    if(value.length === 9) {
      if(Object.values(products).map(product => product.description).indexOf(value.toUpperCase()) === -1) addFunction()
    }
  }

  const handleChange = (e) => {
    let list = productName.filter(item => item?.toLowerCase().startsWith(e.target.value?.toLowerCase()))

    if(list.length > 0) {
      setValue(e.target.value.toUpperCase())
    }
  }

  const MouseOver = i => event => {
    setSelect(i)
  }

  const MouseOut = i => event => {
    setSelect(-1)
  }

  const MouseDown = (item) => {
    setValue(item)
  }

  const addRefs = (el) => {
    if(el && !ulList.current.includes(el)) {
      ulList.current.push(el)
    }
  }

  return (
    <div>
        <div className='list'>
          <label htmlFor={id} className="form-label label">{label}:</label>
          <input type="text" value={value} style={show === false ? {} : {borderRadius: '5px 5px 0 0'}} className="form-control" minLength={9} onChange={handleChange} onBlur={hideList} onKeyDown={handleKey} onFocus={showList} />
          
          <ul style={show === false ? {visibility:'hidden'} : {}}>
            {
              productName.filter(item => item?.toLowerCase().startsWith(value?.toLowerCase()))?.map((item, i) => {
                return <li key={i} ref={addRefs} onMouseDown={() => MouseDown(item)} onMouseOver={MouseOver(i)} onMouseOut={MouseOut(i)} className={select === i ? 'item select' : 'item'} >{item}</li>
              })
            }
          </ul>
        </div>
    </div>
  );
}

export default Form;
