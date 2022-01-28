import {useState, useEffect} from "react";
import './css/index.scss'
import { getProducts } from "./api/request";
import Plus from './img/plus.png'

function Form() {

 /* Currency */

 const currency = (money) => {
  return money.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
 }

 const [products, setProduct] = useState()
 const [loading, setLoading] = useState(undefined)
 const [search, setSearch] = useState('')
 const [searchList, setSearchList] = useState('')

 const remove = async(id) => {
  setLoading(undefined)

  return await fetch(`http://localhost:8000/product/delete/${id}`, {
    method: 'DELETE',
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

 useEffect(() => {
  getProducts(setProduct, setLoading)
 }, [])

 const handleSearch = e => {
    setSearch(e.target.value)
 }

 const handleSearchList = e => {
  setSearchList(e.target.value)
 }

 const list = products?.map(product => product.type).filter((product, i, array) => array.indexOf(product) === i)

  return (
    <div className='page'>
      <div className="card page-card mt-4 banner">
        <div className="card-body">
        </div>
        
      </div>
      <div className="card page-card mb-5 mt-3" style={loading ? {} : {alignItems: 'center'}}>
        <div className="card-body" style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
          <div className="newText">Produtos disponíveis</div>
          <img style={{marginTop: '15px', cursor: 'pointer'}} onClick={() => {
            window.location.href = '/admin/_/management/products/create'
          }} width='35px' height='auto' src={Plus} alt="Botão de Adicionar Novo Produto" />
          {
            products?.length >= 1 && 
            <div style={{padding: '18px 3px 0px 3px', width: '100%', display: 'flex'}} > 
              <input className="form-control" onChange={handleSearch} style={{margin: 0}} aria-describedby="emailHelp" />
              <select style={{width: 150, marginLeft: 5}} value={searchList?.length === 0 ? 'disabled' : searchList} onChange={handleSearchList} className="form-select" id={'type'} aria-label="Default select example" required>
                <option value="">- Todos -</option>
                {list?.map((list, i) => {
                  return (<option key={i} value={list}>{list}</option>)
                })}
              </select>
            </div>
          }
        </div>

        {
          loading ? 
          <ul>
            <div>
              <div className="card-product-header">
                <div className="name">Nome</div>
                <div className="type">Tipo</div>
                <div className="price">Valor</div>
                <div className="edit">Edição</div>
              </div>
            </div>
            {products?.filter(product => product.type.includes(searchList)).filter(product => product.name.toLowerCase().startsWith(search))?.map((product, i) => {
              return (
                <div  key={i}>
                  <div className="card-product">
                    <div className="name">{product.name}</div>
                    <div className="type">{product.type}</div>
                    <div className="price">{currency(Number(product.price))}</div>
                    <div className="edit"><i style={{cursor: 'pointer'}} onClick={() => {
                      window.location.href = `/admin/_/management/products/update/${product._id}`
                    }} className="fas fa-edit"></i></div>
                    <div className="delete"><i style={{cursor: 'pointer'}} onClick={() => remove(product._id)} className="fas fa-trash-alt"></i></div>
                  </div>
                </div>
              )
            })}
          </ul> : 
          <div className="spinner-border" role="status">
            <span className="sr-only"></span>
          </div>
        }
        
      </div>
    </div>
  );
}

export default Form;
