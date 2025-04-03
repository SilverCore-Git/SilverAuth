import salert from 'https://corsproxy.io/https://api.silverdium.fr/salert/salert.js';

document.addEventListener("DOMContentLoaded", function () {
fetch('/panel/users/data/')
    .then(res => res.json())
    .then(users => {

        // Fonction pour mettre à jour la table des utilisateurs admin
        function updateAdminTable(users) {
            const tableBody = document.getElementById('adminTableBody');
            tableBody.innerHTML = '';

            users.forEach((user) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.pseudo}</td>
                    <td>${user.email}</td>
                    <td>${user.created_at}</td>
                    <td>${user.dataplus.ip}</td>
                    <td>${user.dataplus.banned}</td>
                    <td>${user.account_grade}</td>
                    <td>
                        <a href="/panel/admin/users?page=manage_user&id=${user.id}&mail=${user.email}">
                            <button class="btn btn-primary btn-sm">Gérer</button>
                        </a>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }

        updateAdminTable(users);
    })
    .catch(error => console.error("Erreur lors de la récupération des admins :", error));

const urlParams = new URLSearchParams(window.location.search);
const page = urlParams.get('page');
const userId = urlParams.get('id');
const email = urlParams.get('mail');

document.getElementById('delUser').addEventListener('click', async () =>{

    const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce compte ?");

    if (confirmation) {

        await fetch(`/user/delete/my/beautiful/silveraccount/del?email=${email}`)
        .then(respp => {

            if (respp.error) {
                return salert('SilverAuth', respp.message.silver, 'error');
            }

            else {
                salert('SilverAuth', respp.message.silver, 'success');
            };

            setTimeout(() => {
                
                history.pushState(null, '', `/panel/admin/users`);
                window.location.reload();

            }, 500);                

        })
        .catch(err => {
            salert('SilverAuth', 'Une erreur est survenue', 'error');
            console.error('Erreur lors du fetch : ', err || err.message);
        })

    }

})

if (page === 'manage_user' && userId) {
    // Charge les données de l'utilisateur
    loadUserData(userId);

    // Ouvre le modal si l'utilisateur existe
    $('#userModal').modal('show'); // Ouvre le modal
}

// Fonction pour charger les données de l'utilisateur dans le modal
function loadUserData(userId) {
    fetch(`/panel/users/data/${userId}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Erreur lors de la récupération des données utilisateur.');
            }
            return res.json();
        })
        .then(user => {

            const date = new Date(user?.[0].created_at);

            // Formatage de la date dans un format plus lisible
            const options = {
            weekday: 'long', // Jour de la semaine
            year: 'numeric', // Année
            month: 'long', // Mois
            day: 'numeric', // Jour du mois
            hour: '2-digit', // Heure
            minute: '2-digit', // Minute
            second: '2-digit', // Seconde
            timeZoneName: 'short' // Fuseau horaire
            };

            const readableDate = date.toLocaleString('fr-FR', options);

            document.getElementById('username').value = user?.[0].pseudo;
            document.getElementById('email').value = user?.[0].email;
            document.getElementById('created_at').value = readableDate;
            document.getElementById('userId').value = user?.[0].id;
            document.getElementById('ip').value = user?.[0].dataplus.ip;
            document.getElementById('role').value = user?.[0].account_grade;
            document.getElementById('note').value = user?.[0].note;

        })
        .catch(error => {
            salert('Erreur', error.message, 'error');
        });
}

// Action pour soumettre le formulaire de gestion d'utilisateur
document.getElementById('manageUserForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const userId = document.getElementById('userId').value;
    const role = document.getElementById('role').value;
    const password = document.getElementById('password').value;
    const note = document.getElementById('note').value;



    fetch(`/panel/user/admin/update/${email}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            role,
            password,
            note
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            salert('SilverAuth', data.message.silver, 'error');
        } else {
            salert('SilverAuth', 'Utilisateur mis à jour avec succès!', 'success');
            $('#userModal').modal('hide');
        }
    })
    .catch(error => {
        salert('SilverAuth', 'Une erreur est survenue lors de la mise à jour de l\'utilisateur.', 'error');
    });
});

// Action pour bannir l'utilisateur
document.getElementById('banUser').addEventListener('click', function () {
    return salert('SilverAuth', 'fonction non créer<br><i>(backend non réaliser)</i>', 'error')
    const userId = document.getElementById('userId').value;
    if (confirm("Êtes-vous sûr de vouloir bannir cet utilisateur ?")) {
        fetch(`/panel/users/ban/${userId}`, {
            method: 'POST',
        })
            .then(res => res.json())
            .then(data => {
                salert('Success', 'Utilisateur banni avec succès!', 'success');
                $('#userModal').modal('hide'); // Fermer le modal après bannissement
            })
            .catch(error => {
                salert('Erreur', 'Une erreur est survenue lors du bannissement de l\'utilisateur.', 'error');
            });
    }
});
});