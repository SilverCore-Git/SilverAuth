import salert from 'https://corsproxy.io/https://api.silverdium.fr/salert/salert.js';

    document.addEventListener("DOMContentLoaded", function () {
        fetch('/panel/apikey/data/admin')
            .then(res => res.json())
            .then(apiKeys => {

                updateApiKeyTable(apiKeys);

                const urlParams = new URLSearchParams(window.location.search);
                const page = urlParams.get('page');
                const index = urlParams.get('index');

                if (page === 'manage_key' && index !== null && apiKeys[index]) {
                    setTimeout(() => openManager(apiKeys, index), 100);
                }

                // Fonction pour ouvrir le modal de gestion d'une clé API
                function openManager(apiKeys, index) {
                    const key = apiKeys?.[index];

                    if (!key) {
                        console.error("Erreur : Clé API non trouvée.");
                        return;
                    }

                    const nameField = document.getElementById('manageApiKeyName');
                    const keyField = document.getElementById('manageApiKey');
                    const domainList = document.getElementById('domainList');
                    const redirectList = document.getElementById('redirectList');

                    if (!nameField || !keyField || !domainList || !redirectList) {
                        console.error("Erreur : Un ou plusieurs éléments du formulaire sont introuvables.");
                        return;
                    }

                    history.pushState(null, "", `/panel/admin/apikey?page=manage_key&index=${index}`);

                    nameField.value = key.organization_name || '';
                    keyField.value = key.api_key || '';

                    domainList.innerHTML = '';
                    const domains = key.allowed_domains || [];
                    domains.forEach(domain => addDomainField(domain));

                    redirectList.innerHTML = '';
                    const redirects = key.redirect_urls || [];
                    redirects.forEach(redirect => addRedirectField(redirect));

                    $('#manageApiKeyModal').modal('show');
                }

                // Fonction pour mettre à jour la table des clés API
                function updateApiKeyTable(apiKeys) {
                    const tableBody = document.getElementById('apiKeyTableBody');
                    tableBody.innerHTML = '';

                    apiKeys.forEach((key, index) => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${key.organization_name}</td>
                            <td><input type="url" value="${key.api_key}" readonly></td>
                            <td>${key.created_at}</td>
                            <td>${key.expires_at}</td>
                            <td>${key.daily_request_limit}</td>
                            <td>${key.id}</td>
                            <td>
                                <a href="/panel/admin/apikey?page=manage_key&index=${index}"> <button class="btn btn-primary btn-sm" ${index})">Gérer</button></a>
                            </td>
                        `;
                        tableBody.appendChild(row);
                    });
                }

                var key123 = apiKeys;

                // Ajouter un champ de domaine
                function addDomainField(domain = '') {
                    const domainList = document.getElementById('domainList');
                    const div = document.createElement('div');
                    div.classList.add('input-group', 'mb-2');
                    div.innerHTML = `
                        <input type="url" class="form-control domain-input" value="${domain}" placeholder="Ex: https://example.com">
                        <div class="input-group-append">
                            <button class="btn btn-danger remove-domain" type="button">❌</button>
                        </div>
                    `;
                    domainList.appendChild(div);
                    div.querySelector('.remove-domain').addEventListener('click', () => div.remove());
                }

                // Ajouter un champ de redirection
                function addRedirectField(redirect = '') {
                    const redirectList = document.getElementById('redirectList');
                    const div = document.createElement('div');
                    div.classList.add('input-group', 'mb-2');
                    div.innerHTML = `
                        <input type="url" class="form-control redirect-input" value="${redirect}" placeholder="Ex: https://redirect.com">
                        <div class="input-group-append">
                            <button class="btn btn-danger remove-redirect" type="button">❌</button>
                        </div>
                    `;
                    redirectList.appendChild(div);
                    div.querySelector('.remove-redirect').addEventListener('click', () => div.remove());
                }

                // Ajouter des champs domaine et redirection au formulaire
                document.getElementById('addDomain').addEventListener('click', () => addDomainField());
                document.getElementById('addRedirect').addEventListener('click', () => addRedirectField());

                document.getElementById('deleteBTN').addEventListener('click', async () => {
                    const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette clé API ?");

                    if (confirmation) {

                        await fetch(`/panel/apikey/key/remove/${key123?.[index]?.api_key}`, { method: 'POST' })
                        .then(res => res.json())
                        .then(res => {
                            if (res.error) {
                                salert('SilverAuth', res.message.silver, 'error');
                                $('#manageApiKeyModal').modal('hide');
                                history.pushState(null, "", `/panel/admin/apikey`);
                            }
                            else {

                                salert('SilverAuth', res.message.silver, 'success');

                                $('#manageApiKeyModal').modal('hide');
                                history.pushState(null, "", `/panel/admin/apikey`);
                                setTimeout(() => {
                                    window.location.reload();
                                }, 500);
                                
                            };
                        })
                        .catch(err => {
                            salert('SilverAuth', 'Une erreur est survenue', 'error');
                            console.error('Une erreur est survenue : ', err);
                            $('#manageApiKeyModal').modal('hide');
                            history.pushState(null, "", `/panel/admin/apikey`);

                        });

                    }

                })

                // Sauvegarder les modifications de la clé API
                document.getElementById('updateApiKey').addEventListener('click', async () => {

                    const updatedName = document.getElementById('manageApiKeyName').value;

                    const domainInputs = document.querySelectorAll('.domain-input');
                    const redirectInputs = document.querySelectorAll('.redirect-input');

                    const updatedDomains = Array.from(domainInputs).map(input => input.value.trim()).filter(value => value);
                    const updatedRedirects = Array.from(redirectInputs).map(input => input.value.trim()).filter(value => value);


                    history.pushState(null, "", `/panel/admin/apikey?page=manage_key&action=save&statu=processing&index=${index}`);


                    if (updatedName) {

                        const fetch_body = { Domaines: updatedDomains, Redirects: updatedRedirects, Name: updatedName };

                        if (key123?.[index]?.api_key) {

                            history.pushState(null, "", `/panel/admin/apikey?page=manage_key&action=save&statu=fetchingMAJ&index=${index}`);

                            try {

                                const response = await fetch(`/panel/apikey/key/maj/${key123[index].api_key}`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(fetch_body)
                                });

                                const data = await response.json();
                                if (data.error) {
                                    history.pushState(null, "", `/panel/admin/apikey?page=manage_key&action=save&statu=error&index=${index}`);
                                    return salert('SilverAuth', data.message.silver, 'error');
                                }
                                history.pushState(null, "", `/panel/admin/apikey?page=manage_key&action=save&statu=success&index=${index}`);
                                salert('SilverAuth', '', 'success');

                            } catch (error) {

                                console.error('Erreur lors de la requête :', error);
                                history.pushState(null, "", `/panel/admin/apikey?page=manage_key&action=save&statu=error&index=${index}`);
                                return salert('SilverAuth', 'Erreur lors de la requête', 'error');

                            }


                        } else {
                            console.error('Clé API introuvable pour l’index donné.');
                            history.pushState(null, "", `/panel/admin/apikey?page=manage_key&statu=error&index=${index}`);
                            return salert('SilverAuth', 'Une erreur est survenue', 'error');
                        };


                        updateApiKeyTable(apiKeys);

                        setTimeout(() => {
                            
                            $('#manageApiKeyModal').modal('hide');
                            history.pushState(null, "", `/panel/admin/apikey`);
                            window.location.reload();

                        }, 1000);

                    } else {

                        salert('SilverAuth', 'Veuillez remplir le champ Nom de l\'organisation.', 'warning');
                        return history.pushState(null, "", `/panel/admin/apikey?page=manage_key&statu=error&index=${index}`);

                    }
                });
            })
            .catch(error => console.error('Erreur lors de la récupération des données des clés API:', error));
    });