function Buttons ({fields, pressed, verifyZeroProducts, verifyZeroServices, setButton}) {
    return (<>

        <div className="buttons">
        
        <button type="submit" onMouseDown={() => setButton(false)} disabled={
          // fields?.action?.answer.length === 0 ||
          // fields?.carYear?.answer.length === 0 ||
          fields?.channel?.answer.length === 0 ||
          fields?.client?.answer.length === 0 ||
          fields?.employee?.answer.length === 0 ||
          // fields?.model?.answer.length === 0 ||
          fields?.phone?.answer.length === 0 ||
          verifyZeroProducts ||
          verifyZeroServices ||
          // fields?.search?.answer.length === 0 ||
          // fields?.services?.answer.length === 0 ||
          // fields?.status?.answer.length === 0 ||
          // fields?.tires?.answer.length === 0 ||
          pressed === true
        } className="btn btn-danger mt-4">
          {pressed === true ? (
          <div className="spinner-border" role="status">
            <span className="sr-only"></span>
          </div>
          ) :
            (<>
              Orçar Completo
            </>)
          }
        </button>
        
        {/*
        <button type="submit" onMouseDown={() => setButton(true)} disabled={
          // fields?.action?.answer.length === 0 ||
          // fields?.carYear?.answer.length === 0 ||
          fields?.channel?.answer.length === 0 ||
          fields?.client?.answer.length === 0 ||
          fields?.employee?.answer.length === 0 ||
          // fields?.model?.answer.length === 0 ||
          fields?.phone?.answer.length === 0 ||
          verifyZeroProducts ||
          verifyZeroServices ||
          // fields?.search?.answer.length === 0 ||
          // fields?.services?.answer.length === 0 ||
          // fields?.status?.answer.length === 0 ||
          // fields?.tires?.answer.length === 0 ||
          pressed === true
        } className="btn btn-danger mt-4">
          {pressed === true ? (
          <div className="spinner-border" role="status">
            <span className="sr-only"></span>
          </div>
          ) :
            (<>
              Orçar Simplificado
            </>)
          }
        </button>
        */}
        </div>
    
    </>)
}

export default Buttons;