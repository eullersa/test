function AddProducts ({title, items, setItems, handleItems, setPopup}) {

    const currency = (money) => {
        return money.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
    }

    return(
        <>
            <label className="form-label label">{title}:</label>
            {items && Object.values(items).map((product, i) => {
                let line = Object.keys(items)[i]

                return(
                <div className="products" key={i} width={"100%"}>
                <div className="col-md-15">
                    {i === 0 ? (
                    <label htmlFor={`validation1${i}`} className="form-label">Descrição</label>) : null}
                    <input type="text" className="form-control" id={`validation1${i}`} onChange={handleItems(line, 'description')} value={product?.description} required />
                </div>
                <div className="col-md-30">
                    {i === 0 ? (<label htmlFor={`validation2${i}`} className="form-label">Quant.</label>) : null}
                    <input type="number" className="form-control" id={`validation2${i}`} min={1} onChange={handleItems(line, 'quantity')} value={product?.quantity} />
                </div>
                <div className="col-md-4">
                    {i === 0 ? (
                    <label htmlFor={`validation3${i}`} className="form-label">Preço</label>) : null}
                    <input type="text" className="form-control" id={`validation3${i}`} onChange={handleItems(line, 'price')} value={product?.price} />
                </div>
                <div>
                    {i === 0 ? (
                    <label className="form-label">&nbsp;</label>) : null}
                    <button type='button' style={{width: "30px", marginTop: '10px'}} onClick={() => {
                    if(Object.values(items).length === 1) {
                        if(
                           title.toLowerCase() === 'serviços' &&
                           items?.line1?.description === '' &&
                           items?.line1?.price === currency(0) &&
                           items?.line1?.quantity === '1') {
                            setPopup(title.toLowerCase())
                        }
                        delete items[`line${Object.keys(items)[i].slice(4, 10)}`]
                        setItems({line1: {description: '', price: currency(0), quantity: '1'}})
                    } else {
                        delete items[`line${Object.keys(items)[i].slice(4, 10)}`]
                        setItems(prev => ({...prev}))
                    }
                    }} className="btn btn-danger">-</button>
                </div>
                </div>
            )})}

            {items &&
                <div className="buttonPlus">
                <button type='button' onClick={() => {
                    setItems(prev => ({...prev, [`line${Number(Object.keys(items).reverse()[0].slice(4, 10)) + 1}`]: {description: '', price: currency(0), quantity: '1'}}))
                }} className="btn btn-danger mt-3">+</button>
                </div>
            }
        </>
    )
}

export default AddProducts;