import salert from 'https://corsproxy.io/https://api.silverdium.fr/salert/salert.js';

const redirect = '/';
const mail = document.getElementById('mail');
const passwd = document.getElementById('passwd');
const confpasswd = document.getElementById('confpasswd');
const form = document.querySelector('.cardForm');
const loader = document.getElementById('loader');
const name = document.getElementById('name');
const btn = document.getElementById('login');

loader.style.display = 'none';
form.style.display= 'flex';

function connect(mail, passwd, name) {

    setTimeout(() => {
        loader.style.display = 'flex';
        form.style.display= 'none';        
    }, 300);

    setTimeout( () => {

        fetch('/auth/get/key/for/register?d=olala&ml=456').then(resp => resp.json()).then(resp => { 

            const key = resp.key

            fetch(`/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ mail, passwd, name, key }),
            })
            .then(res => res.json())
            .then(resp => {

                if (resp.error) {

                    try {
                        salert('SilverAuth', resp.resp.message, 'error');
                    }
                    catch (err) {
                        salert('SilverAuth', 'Une erreur est survenue', 'error');
                    }
                    console.error(resp)
                    loader.style.display = 'none';
                    form.style.display= 'flex';
                    return

                }

                else if (resp.statu === 'success') {

                    setTimeout(() => {

                        salert('SilverAuth', resp.message, 'success');
                        
                        setTimeout(() => {
                            
                            window.location.href = `/auth/view/login`;

                        }, 300);

                    }, 500);

                }

            });

        });

    }, 500);

};




btn.addEventListener('click', async (event) => {

    event.preventDefault();

    if (passwd.value == '' || mail.value == '') { salert('SilverAuth', `Il faut remplir tout les champs<br>non pas ceux du fermier.`); }
    else if (passwd.value !== confpasswd.value) { salert('SilverAuth', `Le mot de passe dois être le même dans les deux champs.`); }
    else { 
        if (passwd.value === confpasswd.value) { connect(mail.value, passwd.value, name.value) }
        else { salert('SilverAuth', `Le mot de passe dois être le même dans les deux champs.`); }
    };

});