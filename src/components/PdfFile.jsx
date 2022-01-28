function PdfFile ({budget}) {
    return (<>
        <a href={budget.pdf} >
            <div className="budget" style={{backgroundImage: `url("https://www.freeiconspng.com/uploads/pdf-icon-png-pdf-zum-download-2.png")`, backgroundSize: "contain", width: '100%', height: '50px', backgroundPosition: 'center', marginTop: '20px', backgroundRepeat: 'no-repeat'}}>
            </div>
        </a>
    </>)
}

export default PdfFile;