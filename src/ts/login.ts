const formLogin: HTMLFormElement | null = document.querySelector('.form');

formLogin?.addEventListener("submit", async (event: any) => {
    event.preventDefault();

    const formData = new FormData(formLogin);

    const formDataObject: Record<string, string> = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value as string;
    });

    const response = await fetch('/login', {
        method: 'POST',
        body: JSON.stringify(formDataObject),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.status == 200){
        window.location.href = "/budget"
    }else if (response.status === 305) {
        alert("Email o contraeña incorrecta...");
    }else{
        console.log("Este error no se esta manejando bien");
    }

})