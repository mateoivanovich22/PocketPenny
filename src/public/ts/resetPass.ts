function focusNextInput(currentInput: HTMLInputElement, nextInputId: string) {
    const inputLength: number = currentInput.value.length;
    const maxLength: number = parseInt(currentInput.getAttribute('maxlength') || '0');

    if (inputLength >= maxLength) {
        const nextInput: HTMLInputElement | null = document.getElementById(nextInputId) as HTMLInputElement;
        if (nextInput) {
            nextInput.focus();
        }
    }
}

const formResetEmail: HTMLFormElement | null = document.querySelector(".formResetEmail")
const auth: HTMLFormElement | null = document.querySelector(".formReset")
const inputResetDiv: HTMLDivElement | null = document.querySelector(".inputResetDiv")
const titleReset: HTMLDivElement | null = document.querySelector(".titleReset")

formResetEmail?.addEventListener("submit", async(e) => {
    e.preventDefault();
    const emailInput: HTMLInputElement | null = document.querySelector(".inputReset")
    let valueEmail: string= ""

    if(emailInput) valueEmail = emailInput.value;

    const response = await fetch("/reset-password", {
        method: "POST",
        body: JSON.stringify({email: valueEmail}),
        headers: {
            'Content-Type': 'application/json'
        },
        
    })

    if(response.status === 200) {
        if(inputResetDiv) inputResetDiv.style.display = "none"
        if(auth) auth.style.display = "flex"
        if(titleReset) titleReset.style.display = "none"
    }else if(response.status === 404){
        alert("Incorrect email")
    }else{
        alert("Error inform ")
    }
})

const formResetAuth: HTMLFormElement| null = document.querySelector(".formReset")

const divNewPass: HTMLDivElement | null = document.querySelector(".divNewPass")

formResetAuth?.addEventListener("submit", async(e) => {
    e.preventDefault()
    const input1: HTMLInputElement | null = document.querySelector("#input1")
    const input2: HTMLInputElement | null = document.querySelector("#input2")
    const input3: HTMLInputElement | null = document.querySelector("#input3")
    const input4: HTMLInputElement | null = document.querySelector("#input4")

    let authCodeUser: string = ""

    if(input1 && input2 && input3 && input4){
        authCodeUser = input1.value + input2.value + input3.value + input4.value
    }

    const response = await fetch("/reset-authorization", {
        method: "POST",
        body: JSON.stringify({authCodeUser}),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if(response.status == 200){
        formResetAuth.style.display = "none"
        if(divNewPass) divNewPass.style.display = "flex"

    }else{
        alert("Error cara d alpargata")
    }
})

const formConfirmNewPass: HTMLFormElement | null = document.querySelector(".formConfirmNewPass") 

formConfirmNewPass?.addEventListener("submit", async(e) => {
    e.preventDefault()
    
    const newPassInput: HTMLInputElement | null = document.querySelector(".inputNewPass")

    let newPassword: string = "";

    if(newPassInput) newPassword = newPassInput.value

    const response = await fetch("/new-password", {
        method: "post",
        body: JSON.stringify({newPassword}),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const loader: HTMLDivElement | null = document.querySelector(".loader")

    if( response.status === 200){

        if(loader) loader.style.display = "flex"
        setTimeout(() => {
            window.location.href= "/"
        }, 3000);
    }else{
        alert("Error cambiando la contra pa")
    }
    
})