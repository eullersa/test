export const shortAnswer = (handle, questions, SearchBar, fields, setFields, products, setProducts, value, setValue) => (
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
            <input pattern="[(][0-9]{2}[)][ ][0-9]{5}[-][0-9]{4}" value={fields[question.id].answer}  onChange={handle(question.id, question.handle)} type={question.type} className="form-control" id={question.id} aria-describedby="emailHelp" required />
          </div>
        )
      }

      if(question.handle === 'searchbar') {
        return (
          <SearchBar value={value} setValue={setValue} key={id} id={question.id} label={question.label} listItems={question.choices} setProducts={setProducts} products={products} setFields={setFields} fields={fields}/>
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

        if(typeof question.choices[0] === "object") {
          question.choices = question.choices.map(item => item.name)
        }

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