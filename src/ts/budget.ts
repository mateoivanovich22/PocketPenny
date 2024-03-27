const formStart: HTMLFormElement | null = document.querySelector(".formStart")


formStart?.addEventListener("submit", async (e: any) => {
    e.preventDefault()

    const inputStart: HTMLInputElement | null = document.querySelector(".inputStart")
    const inputValue: string | undefined = inputStart?.value

    const response = await fetch("/start", {
        method: 'POST',
        body: JSON.stringify({inputValue}),
        headers: {
            'Content-Type': 'application/json'
        },
    })

    if(response.status === 200){
        window.location.reload();
    }else{
        console.log("Error en algo");
    }
})

function getFormattedDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}

console.log(typeof(getFormattedDate))
  

const containerButton: HTMLButtonElement | null = document.querySelector(".container")

containerButton?.addEventListener("click", async() => {
    const inputInsertAmount: HTMLInputElement | null = document.querySelector(".inputInsertAmount")
    const inputValueAmount: string | undefined = inputInsertAmount?.value

    if(inputValueAmount?.length == 0){
        alert("Please, enter your expense amount")
    }else{
        const radioInputs = document.getElementsByName('radio') as NodeListOf<HTMLInputElement>;
        let checkedValue: string | undefined = undefined;;

        radioInputs.forEach(input => {
            if (input.checked) {
                checkedValue = input.value;
            }
        });


        const response = await fetch("/newExpense", {
            method: 'POST',
            body: JSON.stringify({inputValueAmount, checkedValue}),
            headers: {
                'Content-Type': 'application/json'
            },
        })

        if(response.status == 200){
            window.location.reload();
        }else{
            alert("We had an error, please contact sopport for help!")
        }
    }

    
})

const divYesOrNo: HTMLElement | null = document.querySelector(".divEditOrNot")
const editButton: HTMLElement | null = document.querySelector(".edit-button")
const buttonX: HTMLElement | null = document.querySelector(".buttonX");
const confirmDiv: HTMLElement | null = document.querySelector(".checkbox-wrapper");
const spanElement = document.querySelector('.ui-btn span') as HTMLElement;

editButton?.addEventListener('click', () => {
    
    
    if(divYesOrNo){
        divYesOrNo.style.display = 'flex';
    }
    editButton.style.display = 'none';
    

    if (spanElement) {
        const originalValue = parseFloat(spanElement.textContent?.replace('$', '') || '0');
        spanElement.contentEditable = 'true';

        spanElement.focus();
        window.getSelection()?.selectAllChildren(spanElement);

        spanElement.addEventListener('keypress', (event) => {
            const keyCode = event.keyCode || event.which;
            const keyValue = String.fromCharCode(keyCode);

            const allowedCharacters = /[0-9.]/;
            if (!allowedCharacters.test(keyValue)) {
                event.preventDefault();
            }
        });

        spanElement.addEventListener('blur', () => {
            if (spanElement.textContent?.trim() === '') {
                spanElement.textContent = `$ ${originalValue}`;
            } else {
                const newValue = parseFloat(spanElement.textContent?.replace('$', '') || '');
                if (!isNaN(newValue) && newValue >= 0) {
                    spanElement.textContent = `$ ${newValue}`;
                } else {
                    spanElement.textContent = `$ ${originalValue}`;
                }
            }

            spanElement.contentEditable = 'false';
        });
    }
});


buttonX?.addEventListener('click', () => {
    if(divYesOrNo) divYesOrNo.style.display = "none"
    if(editButton) editButton.style.display = "flex"
})

const loader: HTMLElement | null = document.querySelector(".loader");
confirmDiv?.addEventListener('click', async () => {

    await setTimeout(() => {
        if(divYesOrNo) divYesOrNo.style.display = "none"
        if(loader) loader.style.display = "flex";
    }, 500)

    let newValue: string | null = ""

    if(spanElement){
        newValue = spanElement.textContent 
    }

    if(newValue === null || newValue.trim() === "") {
        newValue = "0";
    }

    const response = await fetch("/remaining-money-new", {
        method: "POST",
        body: JSON.stringify({newValue}),
        headers: {
            'Content-Type': 'application/json'
        },
    })

    if(response.status == 200){
        window.location.reload();
    }else{
        alert("Your new remaining amount is the same than before..")
        setTimeout(() => { 
            window.location.reload();
        }, 1000)
    }

})

const BtnEditTransaction: HTMLElement | null = document.querySelector(".BtnEditTransaction")
const cardEdit: HTMLElement | null  = document.querySelector(".card-edit")

const buttonExitDivEdit: HTMLElement | null = document.querySelector(".exit-button")

const editTransaction: HTMLElement | null = document.querySelector(".card-button")

const main: HTMLElement | null = document.querySelector(".main")

const cssbuttonsIo: HTMLElement | null = document.querySelector(".cssbuttons-io")

const btnMessage: HTMLElement | null = document.querySelector("#btn-message")

BtnEditTransaction?.addEventListener("click",  () => {
    if(cardEdit) cardEdit.style.display = "flex"
    BtnEditTransaction.style.display = "none"
    if(main) main.style.display  = "none"
    if(cssbuttonsIo) cssbuttonsIo.style.display = "none"
    if(btnMessage) btnMessage.style.display = "none"

})

buttonExitDivEdit?.addEventListener("click",  () => {
    if(BtnEditTransaction) BtnEditTransaction.style.display = "flex"
    if(cardEdit) cardEdit.style.display = "none"
    if(main) main.style.display  = "flex"
    if(cssbuttonsIo) cssbuttonsIo.style.display = "flex"
    if(btnMessage) btnMessage.style.display = "flex"
})

const cardDate: HTMLElement | null = document.querySelector(".card-date")


const editButtons = document.querySelectorAll(".card-button.secondary");
editButtons.forEach((editButton, index) => {
    editButton.addEventListener("click", () => {

        const cardHeading = document.querySelectorAll(".card-heading")[index] as HTMLElement;
        const cardDescription = document.querySelectorAll(".card-description")[index] as HTMLElement;
        const deleteButton = editButton.nextElementSibling as HTMLElement;
        const closeEditDiv = deleteButton.nextElementSibling as HTMLElement ;
        const confirmEditDiv = closeEditDiv.nextElementSibling as HTMLElement;

        const checkboxWrapperConfirm = confirmEditDiv.nextElementSibling as HTMLElement
        checkboxWrapperConfirm.style.display = "flex"
        if (closeEditDiv && checkboxWrapperConfirm) {
            closeEditDiv.style.display = "flex";
            // checkboxWrapperConfirm.style.display = "flex"
        }

        if (deleteButton) {
            (editButton as HTMLElement).style.display = "none";
            deleteButton.style.display = "none";
        }

        if (cardHeading && cardDescription) {
            cardHeading.contentEditable = "true";
            cardHeading.focus();
            const originalValue = parseFloat(cardHeading.textContent?.replace('$', '') || '0');

            cardHeading.addEventListener('keypress', (event) => {
                const keyCode = event.keyCode || event.which;
                const keyValue = String.fromCharCode(keyCode);
    
                const allowedCharacters = /[0-9.]/;
                if (!allowedCharacters.test(keyValue)) {
                    event.preventDefault();
                }
            });
    
            cardHeading.addEventListener('blur', () => {

                if (cardHeading.textContent?.trim() === '') {
                    cardHeading.textContent = `$ ${originalValue}`;
                } else {
                    const newValue = parseFloat(cardHeading.textContent?.replace('$', '') || '');
                    if (!isNaN(newValue) && newValue >= 0) {
                        cardHeading.textContent = `$ ${newValue}`;
                    } else {
                        cardHeading.textContent = `$ ${originalValue}`;
                    }
                }
    
                cardHeading.contentEditable = 'false';
            });
        }

        closeEditDiv?.addEventListener('click', (e) => {
            e.preventDefault();
            closeEditDiv.style.display = "none";
            
            if (cardHeading && deleteButton && checkboxWrapperConfirm) {
                confirmEditDiv.style.display = "none";
                checkboxWrapperConfirm.style.display = "none";
                (editButton as HTMLElement).style.display = "block";
                deleteButton.style.display = "block";
            }
        })

        checkboxWrapperConfirm.addEventListener('click', async(event) => {
            const newValue = cardHeading.textContent;

            if (event.target) {
                const targetElement = event.target as HTMLElement;
                const closestContainer = targetElement.closest(".divEditTransactions");

                if (closestContainer) {
                    const gastoIdElement = closestContainer.querySelector("#gastoId") as HTMLElement | null;
                    if (gastoIdElement) {
                        const gastoId = gastoIdElement.innerText.trim();
                        
                        
                        const response = await fetch("/editSpent", {
                            method: "POST",
                            body: JSON.stringify({gastoId, newValue}),
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        })

                        if(response.status == 200){
                            const success = document.querySelector(".success") as HTMLElement;
                            setTimeout(() => {
                                success.style.display = "flex";
                            }, 500)
                            
                            setTimeout(() => {
                                window.location.reload()
                            }, 3000)
                        }else{
                            alert("Error: " + response.status)
                        }

                    }
                }
            }

        });
    });
});

const deleteButtons = document.querySelectorAll(".card-button.primary");
deleteButtons.forEach((deleteButton, _index) => {
    deleteButton.addEventListener("click", () => {
        const editButton = deleteButton.previousElementSibling as HTMLElement;
        const closeEditDiv = deleteButton.nextElementSibling as HTMLElement ;
        const confirmEditDiv = closeEditDiv.nextElementSibling as HTMLElement;

        (closeEditDiv as HTMLElement).style.display = "flex";
        (confirmEditDiv as HTMLElement).style.display = "flex";
        (deleteButton as HTMLElement).style.display = "none";
        (editButton as HTMLElement).style.display = "none";

        closeEditDiv?.addEventListener('click', () => {
            closeEditDiv.style.display = "none";
            
            if (deleteButton) {
                confirmEditDiv.style.display = "none";
                (editButton as HTMLElement).style.display = "block";
                (deleteButton as HTMLElement).style.display = "block";
            }
        })

        confirmEditDiv?.addEventListener("click", async (event) => {
            console.log("Holaaa")
            if (event.target) {
                const targetElement = event.target as HTMLElement;
                const closestContainer = targetElement.closest(".divEditTransactions");
                if (closestContainer) {
                    const gastoIdElement = closestContainer.querySelector("#gastoId") as HTMLElement | null;
                    if (gastoIdElement) {
                        const gastoId = gastoIdElement.innerText.trim();
                        
                        
                        const response = await fetch("/deleteSpent", {
                            method: "POST",
                            body: JSON.stringify({gastoId}),
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        })

                        if(response.status == 200){
                            const success = document.querySelector(".success") as HTMLElement;
                            setTimeout(() => {
                                success.style.display = "flex";
                            }, 500)
                            
                            setTimeout(() => {
                                window.location.reload()
                            }, 3000)
                        }else{
                            alert("Error: " + response.status)
                        }

                    }
                }
            }
        })
    });
});
