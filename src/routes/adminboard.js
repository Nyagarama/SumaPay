// Code for the admin dashboard
        async function fetchGroups() {
            const response = await fetch('/api/groups');
            const groups = await response.json();
            const groupList = document.getElementById('group-list');
            groupList.innerHTML = '';
            groups.forEach(group => {
                const li = document.createElement('li');
                li.classList.add('list-group-item');
                li.textContent = `${group.name} - ${group.status}`;
                groupList.appendChild(li);
            });
        }

        async function fetchRequests() {
            const response = await fetch('/api/requests');
            const requests = await response.json();
            const requestList = document.getElementById('request-list');
            requestList.innerHTML = '';
            requests.forEach(request => {
                const li = document.createElement('li');
                li.classList.add('list-group-item', 'd-flex', 'justify-content-between');
                li.textContent = `${request.group} - ${request.type} - ${request.status}`;
                if (request.status === 'Pending') {
                    const button = document.createElement('button');
                    button.classList.add('btn', 'btn-success', 'btn-sm');
                    button.textContent = 'Approve';
                    button.onclick = async () => {
                        await fetch('/api/approve-request', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: request.id })
                        });
                        fetchRequests();
                    };
                    li.appendChild(button);
                }
                requestList.appendChild(li);
            });
        }

        document.getElementById('message-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const recipients = document.getElementById('recipients').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            await fetch('/api/send-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipients, subject, message })
            });
            alert('Message sent successfully!');
        });

        fetchGroups();
        fetchRequests();

