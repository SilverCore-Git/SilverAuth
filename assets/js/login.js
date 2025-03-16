/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
*/

import salert from 'https://corsproxy.io/https://api.silverdium.fr/salert/salert.js';

const mail = document.getElementById('mail');
const passwd = document.getElementById('passwd');
const form = document.querySelector('.cardForm');
const loader = document.getElementById('loader');
const btn = document.getElementById('login');

loader.style.display = 'none';
form.style.display= 'flex';

function connect(mail, passwd) {

    setTimeout(() => {
        loader.style.display = 'flex';
        form.style.display= 'none';        
    }, 300);

    fetch('/')

}


function validerEmail(email) {

    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    
    return regexEmail.test(email);

}


btn.addEventListener('click', async (event) => {

    event.preventDefault();

    if (passwd.value == '' || mail.value == '') { salert('SilverAuth', `Il faut remplir tout les champs<br>non pas ceux du fermier.`); }
    else if (!validerEmail(mail.value)) { salert('SilverAuth', `L'email n'est pas valide`); }
    else { connect(mail.value, passwd.value) };

});