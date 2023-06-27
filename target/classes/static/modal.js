const allUsersTable = $('#allUsersTable')
let editModalForm = document.forms['editModalForm']
let deleteModalForm = document.forms['deleteModalForm']
let newUserForm = document.forms['newUserForm']

$(async function () {
    await getAuthenticatedUser()
    await fillUsersTable()
    addUser()
    editUser()
    deleteUser()
})

async function getUser(id) {
    let response = await fetch('/api/user/' + id)
    return await response.json()
}

async function fillModalForm(form, modal, id) {
    modal.show()
    let user = await getUser(id)
    form.id.value = user.id
    form.name.value = user.name
    form.lastName.value = user.lastName
    form.age.value = user.age
    form.email.value = user.email
    form.roles.value = user.roles[0].id
}


// Filling Users Table
function fillUsersTable() {
    allUsersTable.empty()
    fetch('/api/allUsers')
        .then(res => res.json())
        .then(data =>
            data.forEach(user => {
                    let tableRow = `$(
                    <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.lastName}</td>
                            <td>${user.age}</td>
                            <td>${user.email}</td>
                            <td>${user.roles.map(role => ' ' + role.authority.substring(5))}</td>
                            <td>
                                <button type="button" class="btn btn-info"
                                data-bs-toogle="modal"
                                data-bs-target="#editModal"
                                onclick="openEditModal(${user.id})">Edit</button>
                            </td>
                            <td>
                                <button type="button" class="btn btn-danger" 
                                data-toggle="modal"
                                data-bs-target="#deleteModal"
                                onclick="openDeleteModal(${user.id})">Delete</button>
                            </td>
                        </tr>)`
                    allUsersTable.append(tableRow)
                }
            ))
}

// Editing User
async function openEditModal(id) {
    const modal = new bootstrap.Modal(document.querySelector('#editModal'))
    await fillModalForm(editModalForm, modal, id)
}

function editUser() {
    editModalForm.addEventListener('submit', event => {
        event.preventDefault()
        let editedUserRoles = []
        for (let i = 0; i < editModalForm.roles.options.length; i++) {
            if (editModalForm.roles.options[i].selected) {
                editedUserRoles.push({
                    id: editModalForm.roles.options[i].value,
                    authority: 'ROLE_' + editModalForm.roles.options[i].text
                })
            }
        }

        fetch('/api/user', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: editModalForm.id.value,
                name: editModalForm.name.value,
                lastName: editModalForm.lastName.value,
                age: editModalForm.age.value,
                email: editModalForm.email.value,
                password: editModalForm.password.value,
                roles: editedUserRoles
            })
        }).then(() => {
            $('#callBack').click()
            fillUsersTable()
        }).then(() => location.reload())
    })
}

// User Deletion
async function openDeleteModal(id) {
    const modal = new bootstrap.Modal(document.querySelector('#deleteModal'))
    await fillModalForm(deleteModalForm, modal, id)
    switch (deleteModalForm.roles.value) {
        case '1':
            deleteModalForm.roles.value = 'ADMIN'
            break
        case '2':
            deleteModalForm.roles.value = 'USER'
            break

    }
}

function deleteUser() {
    deleteModalForm.addEventListener("submit", event => {
        event.preventDefault()
        fetch("/api/user/" + deleteModalForm.id.value, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            $('#deleteModalCloseButton').click()
            fillUsersTable()
        }).then(() => location.reload())
    })
}


// Add New User
function addUser() {
    newUserForm.addEventListener('submit', event => {
        event.preventDefault()
        let newUserRoles = []
        for (let i = 0; i < newUserForm.roles.options.length; i++) {
            if (newUserForm.roles.options[i].selected) {
                newUserRoles.push({
                    id: newUserForm.roles.options[i].value,
                    authority: "ROLE_" + newUserForm.roles.options[i].text
                })
            }
        }
        console.log(newUserRoles);
        fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: newUserForm.id.value,
                name: newUserForm.name.value,
                lastName: newUserForm.lastName.value,
                age: newUserForm.age.value,
                email: newUserForm.email.value,
                password: newUserForm.password.value,
                roles: newUserRoles
            })
        }).then(() => {
            newUserForm.reset()
            fillUsersTable()
            $('#users-tab').click()
        }).then(() => location.reload())
    })
}

// Get Authenticated User
function getAuthenticatedUser() {
    fetch('/api/user')
        .then(res => res.json())
        .then(data => {
            $('#authenticatedUsername').append(data.email);
            let roles = data.roles.map(role => ' ' + role.authority.substring(5))
            $('#authenticatedUserRoles').append(roles)
            let user = `$(
                <tr>
                    <td>${data.id}</td>
                    <td>${data.name}</td> 
                    <td>${data.lastName}</td>   
                    <td>${data.age}</td>     
                    <td>${data.email}</td>               
                    <td>${roles}</td>
                </tr>)`
            $('#authenticatedUserTable').append(user)
        })
}