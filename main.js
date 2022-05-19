const cep = document.getElementById("cep")
const rua = document.getElementById("rua")
const bairro = document.getElementById("bairro")
const cidade = document.getElementById("cidade")
const uf = document.getElementById("uf")
const ibge = document.getElementById("ibge")
const ddd = document.getElementById("ddd")
const error = document.getElementById("error")
const loading = document.getElementById("loading")

cep.addEventListener("input", e => {
    const {value} = e.target
    cep.value = formatarCEP(value)
    drawError("")
    clear()
})

cep.addEventListener("blur", e => {
    const {value} = e.target
    if(validarCEP(value)){
        drawError("")
        getInfos(value)
    } else if(value) {
        drawError("CEP inválido")
        clear()
    }
}) 

function formatarCEP(v){
    v = v.replace(/[^0-9]/g, ''); 
    v = v.replace(/^(\d{5})(\d{3})/, '$1-$2'); 
    if(v.length > 8)
        v = v.substr(0, 9)
    return v;
}

function validarCEP(value) {
    const pattern = /^[0-9]{5}-[0-9]{3}$/
    if(pattern.test(value))
        return true
    return false
}

function drawError(err){
    if(err){
        error.style.display = "block"
        error.innerHTML = err
        cep.style.border = "2px solid red"
    } else {
        error.style.display = "none"
        error.innerHTML = err
        cep.style.border = "2px solid #000000"
    }
}

async function getInfos(cep){
    loading.style.display = "flex"
    try {
        let res = await fetch(`https://viacep.com.br/ws/${cep.replace(/[^0-9]/g, '')}/json/`)
        res = await res.json()
        if(res.erro === "true"){
            drawError("CEP inválido")
            clear()
        } else {
            rua.value = res.logradouro ?? ""
            bairro.value = res.bairro ?? "" 
            cidade.value = res.localidade ?? ""
            uf.value = res.uf ?? ""
            ibge.value = res.ibge ?? ""
            ddd.value = res.ddd ?? ""
        }
    } catch (error) {
        drawError("CEP inválido")
        clear()
    }

    loading.style.display = "none"
}

function clear(){
    rua.value = ""
    bairro.value = "" 
    cidade.value = ""
    uf.value = ""
    ibge.value = ""
    ddd.value = ""
}