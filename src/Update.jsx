import {useState, useEffect} from "react";
import {getById, updateProducts } from "./api/request";
import {useParams} from "react-router-dom";
import './css/index.scss'

function Form() {

 /* Currency */

 const currency = (money) => {
  return money.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
 }
 const { id } = useParams()
 const [pressed, setPressed] = useState(false)
 const [success, setSuccess] = useState(false)
 const [fields, setFields] = useState({
   name: '',
   price: currency(0),
   type: ''
 }) 

 useEffect(() => {
  getById(id, setFields)
 }, [id])

 const handle = input => e => {

  if(input === 'price') {
    const numberValue = Number(e.target.value.replace(/[^0-9-]+/g,""))/100
    setFields({...fields, [input]: currency(Number(numberValue))})
  } else {
    setFields({...fields, [input]: e.target.value})
  }
 }

 const submit = async(e) => {
  let body = {
    ...fields,
    price: Number(fields.price.replace(/[^0-9-]+/g,""))/100
  }

  console.log(body)

  e.preventDefault()
  setPressed(true)
  setSuccess(false)
  updateProducts(setFields, setPressed, body, id, setSuccess)
 }

  return (
    <div className='page'>
      <div className="card page-card mt-4 banner">
        <div className="card-body">
        </div>
      </div>
      <div className="card page-card mb-4 mt-3">
        {
          success &&
          <div class="alert alert-success" style={{borderRadius: 0, textAlign: 'center', fontWeight: 600}} role="alert">
            Produto atualizado com sucesso!
          </div>
        }
        <div className="card-body">

          <div className="newText2">Atualizar um produto</div>
          <form onSubmit={submit}>

          <div className="mb-4">
            <label htmlFor={'name'} className="form-label label">Nome do produto:</label>
            <input onChange={handle('name')} value={fields.name} type='text' className="form-control" id={'name'} aria-describedby="emailHelp" required />
          </div>

          <div className="mb-4">
            <label htmlFor={'price'} className="form-label label">Preço do produto:</label>
            <input onChange={handle('price')} value={fields.price} type='text' className="form-control" id={'price'} aria-describedby="emailHelp" required />
          </div>

          <div className="mb-4">
            <label htmlFor={'type'} className="form-label label">Tipo de produto:</label>
            <select value={fields['type']?.length === 0 ? 'disabled' : fields['type']} onChange={handle('type')} className="form-select" id={'type'} aria-label="Default select example" required>
            <option value="disabled" disabled>- Selecione -</option>
              <option value={'Pneu'}>{'Pneu'}</option>
              <option value={'Serviço'}>{'Serviço'}</option>
              <option value={'Produto'}>{'Produto'}</option>
            </select>
          </div>

          <button type="submit" className="btn btn-danger mt-2" disabled={
            fields?.name.length === 0 ||
            fields?.type.length === 0
          }>
            {pressed === true ? (
            <div className="spinner-border" role="status">
              <span className="sr-only"></span>
            </div>
            ) :
              (<>
                Atualizar produto
              </>)
            }
          </button>
          
          </form>
        </div>  
      </div>
      <div onClick={() => {
        window.location.href = '/admin/_/management/products'
      }} style={{color: 'white', cursor: 'pointer'}}>Voltar ao gerenciador</div>
    </div>
  );
}

export default Form;
