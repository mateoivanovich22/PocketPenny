
const formRegister: HTMLFormElement | null = document.querySelector(".formRegister");

formRegister?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(formRegister);

    const formDataObject: Record<string, string> = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value as string;
    });

    try {
        const response = await fetch('/register', {
            method: 'POST',
            body: JSON.stringify(formDataObject),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            console.log("Usuario creado correctamente");
            window.location.href = "/budget"
        } else if (response.status === 305) {
            alert("Las contraseñas deben ser iguales");
        }else if(response.status === 306){
            alert("Ese email ya se encuentra registrado...");
        } else {
            console.log("Este error no se está manejando bien");
        }
    } catch (error) {
        console.error("Error al enviar la solicitud:", error);
    }
});
