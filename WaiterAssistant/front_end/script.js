function registraUtente() {
    const regUsername = document.getElementById("regUsername").value;
    const regPassword = document.getElementById("regPassword").value;
    const regRuolo = document.getElementById("regRuolo").value;

    const utente = {
        username: regUsername,
        password: regPassword,
        ruolo: regRuolo
    }

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(utente)
    })
        .then(response => { //ERRORE FETCH
            if (!response.ok) {
                console.log('ERRORE');
            } else {
                document.getElementById("successMessage").innerText = "Registrazione effettuata!";
                document.getElementById("successMessage").style.backgroundColor = "green";
                console.log('Registrazione effettuata!');
            }
        })
        .catch(error => { //ERRORE SERVER
            console.error('ERRORE', error);
        });
}

function loginUtente() {
    const loginUsername = document.getElementById("loginUsername").value;
    const loginPassword = document.getElementById("loginPassword").value;

    const credentials = {
        username: loginUsername,
        password: loginPassword
    }

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(response => {
            if (!response.ok) {
                // Se la risposta non è ok, mostra il messaggio di errore
                document.getElementById("errorMessage").innerText = "Nome utente o password errati";
                document.getElementById("errorMessage").style.backgroundColor = "red";
                throw new Error('Nome utente o password errati'); // Lanciare un'eccezione per interrompere la catena di promesse
            } else {
                return response.json(); // Parse della risposta JSON
            }
        })
        .then(data => { 
            // Controllo sul ruolo restituito dopo il login
            switch (data.ruolo) {
                case 1:
                    window.location.href = "cameriere.html"; 
                    break;
                case 2:
                    window.location.href = "cucina.html"; 
                    break;
                case 3:
                    window.location.href = "pizzeria.html"; 
                    break;
                case 4:
                    window.location.href = "cassiere.html";
                    break;
                default:
                    console.log('Ruolo non valido');
            }
        })
        .catch(error => {
            console.error('ERRORE', error);
        });
}


function mostraRegistra() {
    document.getElementById("registerForm").style.display = "block";
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerBtn").classList.add("active");
    document.getElementById("loginBtn").classList.remove("active");
}

function mostraLogin() {
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("registerBtn").classList.remove("active");
    document.getElementById("loginBtn").classList.add("active");
}
