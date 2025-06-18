document.addEventListener('DOMContentLoaded', () => {
    // --- Global Elements ---
    const authButton = document.getElementById('auth-button');
    const logoutButton = document.getElementById('logout-button');
    const authModal = document.getElementById('auth-modal');
    const closeButton = authModal.querySelector('.close-button');
    const tabButtons = authModal.querySelectorAll('.tab-button');
    const authForms = authModal.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const registerNameInput = document.getElementById('register-name');
    const registerEmailInput = document.getElementById('register-email');
    const registerPasswordInput = document.getElementById('register-password');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');
    const welcomeMessage = document.getElementById('welcome-message');
    const loggedInUserSpan = document.getElementById('logged-in-user');
    const navLinks = document.querySelectorAll('#main-nav ul li a');
    const contentSections = document.querySelectorAll('.content-section');
    const adminOnlyElements = document.querySelectorAll('.admin-only'); // Todos los elementos con esta clase

    // --- Product Management Elements ---
    const productsManagementSection = document.getElementById('products-management-section');
    const productsManagementTableBody = document.getElementById('products-management-table-body');
    const productSearchManagementInput = document.getElementById('product-search-management-input');
    const productsPerPageSelect = document.getElementById('products-per-page-select');
    const prevPageBtn = document.getElementById('prev-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');
    const currentPageSpan = document.getElementById('current-page-span');
    const addProductBtn = document.getElementById('add-product-btn');
    const addProductModal = document.getElementById('add-product-modal');
    const addProductCloseBtn = addProductModal.querySelector('.close-button');
    const newProductNameInput = document.getElementById('new-product-name');
    const newProductDescriptionInput = document.getElementById('new-product-description');
    const newProductPriceInput = document.getElementById('new-product-price');
    const newProductImageInput = document.getElementById('new-product-image');
    const createProductForm = document.getElementById('create-product-form');
    const addProductStatus = document.getElementById('add-product-status');

    // --- Edit Product Modal Elements (NUEVOS) ---
    const editProductModal = document.getElementById('edit-product-modal');
    const editProductCloseBtn = editProductModal.querySelector('.close-button');
    const editProductForm = document.getElementById('edit-product-form');
    const editProductIdInput = document.getElementById('edit-product-id');
    const editProductNameInput = document.getElementById('edit-product-name');
    const editProductDescriptionInput = document.getElementById('edit-product-description');
    const editProductPriceInput = document.getElementById('edit-product-price');
    const editProductImageInput = document.getElementById('edit-product-image');
    const currentProductImageNameSpan = document.getElementById('current-product-image-name');
    const editProductStatus = document.getElementById('edit-product-status');


    // --- Client Management Elements ---
    const clientsManagementSection = document.getElementById('clients-management-section');
    const clientsTableBody = document.getElementById('clients-table-body');
    const clientSearchManagementInput = document.getElementById('client-search-management-input');
    const clientsPerPageSelect = document.getElementById('clients-per-page-select');
    const prevClientPageBtn = document.getElementById('prev-client-page-btn');
    const nextClientPageBtn = document.getElementById('next-client-page-btn');
    const currentClientPageSpan = document.getElementById('current-client-page-span');
    const addNewClientBtn = document.getElementById('add-new-client-btn');
    const addClientModal = document.getElementById('add-client-modal');
    const addClientCloseBtn = addClientModal.querySelector('.close-button');
    const addClientForm = document.getElementById('add-client-form');
    const newClientNameInput = document.getElementById('new-client-name');
    const newClientEmailInput = document.getElementById('new-client-email');
    const newClientPhoneInput = document.getElementById('new-client-phone');
    const newClientAddressInput = document.getElementById('new-client-address');
    const addClientStatus = document.getElementById('add-client-status');

    // --- Invoice Section Elements ---
    const invoiceSection = document.getElementById('invoice-section');
    const clientIdInvoiceInput = document.getElementById('client-id-invoice-input');
    const searchClientByIdBtn = document.getElementById('search-client-by-id-btn');
    const selectedClientInfo = document.getElementById('selected-client-info');
    const clientIdHidden = document.getElementById('client-id-hidden');
    const clientNameInvoiceInput = document.getElementById('client-name-invoice-input');
    const clientEmailInvoiceInput = document.getElementById('client-email-invoice-input');
    const clientPhoneInvoiceInput = document.getElementById('client-phone-invoice-input');
    const clientAddressInvoiceInput = document.getElementById('client-address-invoice-input');
    const clientInvoiceStatus = document.getElementById('client-invoice-status');

    const productIdInvoiceInput = document.getElementById('product-id-invoice-input');
    const searchProductByIdBtn = document.getElementById('search-product-by-id-btn');
    const selectedProductForInvoiceInfo = document.getElementById('selected-product-for-invoice-info');
    const productNameForInvoice = document.getElementById('product-name-for-invoice');
    const productPriceForInvoice = document.getElementById('product-price-for-invoice');
    const productQtyForInvoice = document.getElementById('product-qty-for-invoice');
    const addSelectedProductToInvoiceBtn = document.getElementById('add-selected-product-to-invoice-btn');
    const productInvoiceStatus = document.getElementById('product-invoice-status');

    const invoiceProductsTableBody = document.getElementById('invoice-products-table-body');
    const invoiceTotalElement = document.getElementById('invoice-total');
    const generateInvoiceBtn = document.getElementById('generate-invoice-btn');
    const invoiceGenerationStatus = document.getElementById('invoice-generation-status');

    // --- Upload Payment Section Elements ---
    const uploadPaymentSection = document.getElementById('upload-payment-section');
    const paymentForm = document.getElementById('payment-form');
    const paymentFile = document.getElementById('payment-file');
    const paymentDescription = document.getElementById('payment-description');
    const paymentUploadStatus = document.getElementById('payment-upload-status');

    // --- User Management Elements ---
    const manageUsersSection = document.getElementById('manage-users-section');
    const usersManagementTableBody = document.getElementById('users-management-table-body');
    const viewAdminsBtn = document.getElementById('view-admins-btn');
    const viewAllUsersBtn = document.getElementById('view-all-users-btn');

    // --- Admin Options Section Buttons ---
    const optionsSection = document.getElementById('options-section');
    const manageProductsCardBtn = document.getElementById('manage-products-card-btn');
    const manageClientsCardBtn = document.getElementById('manage-clients-card-btn');
    const createInvoiceCardBtn = document.getElementById('create-invoice-card-btn');
    const manageUsersCardBtn = document.getElementById('manage-users-card-btn'); // ID actualizado
    const uploadPaymentCardBtn = document.getElementById('upload-payment-card-btn');


    // --- Global Variables ---
    let currentUser = null;
    let currentProductPage = 1;
    let productsPerPage = 10;
    let currentClientPage = 1;
    let clientsPerPage = 10;
    let currentUsersFilterAdminsOnly = false;
    let invoiceItems = [];


    // --- Utility Functions ---

    // Function to check and update session/UI
    const checkSession = () => {
        const storedUser = sessionStorage.getItem('gamarka_current_user');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
        } else {
            currentUser = null;
        }
        updateUIForUser();

        // Show a default section based on login/role
        if (currentUser && currentUser.role === 2) { // Admin
            showSection('products-management-section'); // Default admin view
        } else { // Normal user or not logged in
            showSection('upload-payment-section'); // Default non-admin view
            if (!currentUser) { // If not logged in, show auth modal
                authModal.style.display = 'flex';
            }
        }
    };

    // Function to update UI based on user login status and role
    const updateUIForUser = () => {
        if (currentUser) {
            welcomeMessage.style.display = 'block';
            loggedInUserSpan.textContent = currentUser.name;
            authButton.style.display = 'none';
            logoutButton.style.display = 'inline-block';

            // Show/hide admin-only elements
            if (currentUser.role === 2) { // 2 means Admin
                adminOnlyElements.forEach(el => el.style.display = 'block');
            } else { // Not Admin (user normal or role 1)
                adminOnlyElements.forEach(el => el.style.display = 'none');
            }
        } else { // Not logged in
            welcomeMessage.style.display = 'none';
            authButton.style.display = 'inline-block';
            logoutButton.style.display = 'none';
            adminOnlyElements.forEach(el => el.style.display = 'none'); // Hide for logged out
        }
    };

    // Function to show a specific content section and hide others
    const showSection = (sectionId) => {
        contentSections.forEach(section => {
            const isAdminSection = section.classList.contains('admin-only');

            if (section.id === sectionId) {
                // If it's an admin-only section, check if current user is admin
                if (isAdminSection && (!currentUser || currentUser.role !== 2)) {
                    // Prevent access if not admin
                    section.style.display = 'none';
                    alert('Acceso denegado. Esta sección es solo para administradores.');
                    // Redirect to a non-admin section or login
                    if (!currentUser) {
                        authModal.style.display = 'flex';
                    } else {
                        showSection('upload-payment-section'); // Redirect non-admin to payment
                    }
                    return;
                }
                section.style.display = 'block';
                // Specific actions for sections
                if (sectionId === 'products-management-section') {
                    loadProductsForAdminManagement();
                } else if (sectionId === 'clients-management-section') {
                    loadClientsForAdminManagement();
                } else if (sectionId === 'invoice-section') {
                    resetInvoiceForm();
                } else if (sectionId === 'manage-users-section') {
                    loadUsersForAdminManagement(currentUsersFilterAdminsOnly);
                }
            } else {
                section.style.display = 'none';
            }
        });
    };

    // --- Authentication Modals and Forms ---
    if (authButton) {
        authButton.addEventListener('click', () => {
            authModal.style.display = 'flex';
            showAuthForm('login');
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            authModal.style.display = 'none';
            loginError.textContent = '';
            registerError.textContent = '';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === authModal) {
            authModal.style.display = 'none';
            loginError.textContent = '';
            registerError.textContent = '';
        }
        if (event.target === addProductModal) {
            addProductModal.style.display = 'none';
            addProductStatus.textContent = '';
        }
        if (event.target === editProductModal) { // Close edit product modal
            editProductModal.style.display = 'none';
            editProductStatus.textContent = '';
        }
        if (event.target === addClientModal) {
            addClientModal.style.display = 'none';
            addClientStatus.textContent = '';
        }
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const formId = button.dataset.form;
            showAuthForm(formId);
        });
    });

    const showAuthForm = (formId) => {
        authForms.forEach(form => {
            if (form.id === `${formId}-form`) {
                form.style.display = 'block';
            } else {
                form.style.display = 'none';
            }
        });
        tabButtons.forEach(button => {
            if (button.dataset.form === formId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    };

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = loginEmailInput.value;
            const password = loginPasswordInput.value;

            try {
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                if (response.ok) {
                    currentUser = data.user;
                    sessionStorage.setItem('gamarka_current_user', JSON.stringify(currentUser));
                    authModal.style.display = 'none';
                    updateUIForUser();
                    loginError.textContent = '';
                    // Redirect based on role after login
                    if (currentUser.role === 2) {
                        showSection('products-management-section');
                    } else {
                        showSection('upload-payment-section');
                    }
                } else {
                    loginError.textContent = data.message || 'Error de inicio de sesión.';
                    loginError.style.color = 'var(--error-color)';
                }
            } catch (error) {
                console.error('Error de conexión:', error);
                loginError.textContent = 'Error de conexión. Intente de nuevo.';
                loginError.style.color = 'var(--error-color)';
            }
        });
    }

    // Handle Register
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const name = registerNameInput.value;
            const email = registerEmailInput.value;
            const password = registerPasswordInput.value;

            try {
                const response = await fetch('http://localhost:3000/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await response.json();
                if (response.ok) {
                    registerError.textContent = 'Registro exitoso. Ya puedes iniciar sesión.';
                    registerError.style.color = 'var(--success-color)';
                    registerForm.reset();
                    showAuthForm('login');
                } else {
                    registerError.textContent = data.message || 'Error de registro.';
                    registerError.style.color = 'var(--error-color)';
                }
            } catch (error) {
                console.error('Error de conexión:', error);
                registerError.textContent = 'Error de conexión. Intente de nuevo.';
                registerError.style.color = 'var(--error-color)';
            }
        });
    }

    // Handle Logout
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                const response = await fetch('http://localhost:3000/logout', { method: 'POST' });
                if (response.ok) {
                    currentUser = null;
                    sessionStorage.removeItem('gamarka_current_user');
                    updateUIForUser();
                    authModal.style.display = 'flex'; // Show login modal after logout
                    showSection('upload-payment-section'); // Redirect to a public section
                } else {
                    console.error('Error al cerrar sesión en el servidor.');
                    alert('Error al cerrar sesión. Por favor, intente de nuevo.');
                }
            } catch (error) {
                console.error('Error de conexión al cerrar sesión:', error);
                alert('Error de conexión al intentar cerrar sesión.');
            }
        });
    }

    // --- Navigation ---
    if (navLinks) {
        navLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const sectionId = link.dataset.section;
                showSection(sectionId + '-section');
            });
        });
    }

    // --- Admin Options Section Buttons ---
    if (manageProductsCardBtn) {
        manageProductsCardBtn.addEventListener('click', () => showSection('products-management-section'));
    }
    if (manageClientsCardBtn) {
        manageClientsCardBtn.addEventListener('click', () => showSection('clients-management-section'));
    }
    if (createInvoiceCardBtn) {
        createInvoiceCardBtn.addEventListener('click', () => showSection('invoice-section'));
    }
    if (manageUsersCardBtn) { // ID actualizado en HTML y JS
        manageUsersCardBtn.addEventListener('click', () => showSection('manage-users-section'));
    }
    if (uploadPaymentCardBtn) {
        uploadPaymentCardBtn.addEventListener('click', () => showSection('upload-payment-section'));
    }


    // --- Product Management (Admin Only) ---
    let currentProducts = [];

    const loadProductsForAdminManagement = async (page = 1, limit = productsPerPage, search = '') => {
        if (!productsManagementTableBody) return;
        currentProductPage = page;

        try {
            const response = await fetch(`http://localhost:3000/admin/products?page=${page}&limit=${limit}&search=${search}`, {
                headers: { 'Authorization': `Bearer ${currentUser ? currentUser.token : ''}` }
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    productsManagementTableBody.innerHTML = '<tr><td colspan="6" class="error-message">No autorizado. Inicie sesión como administrador.</td></tr>';
                    return;
                }
                throw new Error('Error al cargar productos.');
            }

            const data = await response.json();
            currentProducts = data.products;
            const totalPages = data.totalPages;

            productsManagementTableBody.innerHTML = '';

            if (currentProducts.length === 0) {
                productsManagementTableBody.innerHTML = '<tr><td colspan="6" class="info-message">No se encontraron productos.</td></tr>';
                return;
            }

            currentProducts.forEach(product => {
                const row = productsManagementTableBody.insertRow();
                row.dataset.productId = product.id;
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td><img src="http://localhost:3000/uploads/${product.image}" alt="${product.name}" class="product-thumb"></td>
                    <td>${product.name}</td>
                    <td>${product.description}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm btn-info edit-product-btn" data-id="${product.id}">Editar</button>
                        <button class="btn btn-sm btn-danger delete-product-btn" data-id="${product.id}">Eliminar</button>
                    </td>
                `;
            });

            if (currentPageSpan) currentPageSpan.textContent = `${currentProductPage} / ${totalPages}`;
            if (prevPageBtn) prevPageBtn.disabled = currentProductPage === 1;
            if (nextPageBtn) nextPageBtn.disabled = currentProductPage === totalPages;

            attachProductActionListeners();

        } catch (error) {
            console.error('Error al cargar productos para gestión:', error);
            if (productsManagementTableBody) productsManagementTableBody.innerHTML = '<tr><td colspan="6" class="error-message">Error al cargar productos.</td></tr>';
        }
    };

    const attachProductActionListeners = () => {
        document.querySelectorAll('.edit-product-btn').forEach(button => {
            button.removeEventListener('click', handleEditProduct); // Remove existing to prevent duplicates
            button.addEventListener('click', handleEditProduct);
        });

        document.querySelectorAll('.delete-product-btn').forEach(button => {
            button.removeEventListener('click', handleDeleteProduct); // Remove existing
            button.addEventListener('click', handleDeleteProduct);
        });
    };

    const handleEditProduct = async (event) => {
        const productId = event.target.dataset.id;
        try {
            const response = await fetch(`http://localhost:3000/admin/products/${productId}`, {
                headers: { 'Authorization': `Bearer ${currentUser ? currentUser.token : ''}` }
            });
            if (!response.ok) {
                throw new Error('Producto no encontrado para editar.');
            }
            const product = await response.json();

            editProductIdInput.value = product.id;
            editProductNameInput.value = product.name;
            editProductDescriptionInput.value = product.description;
            editProductPriceInput.value = product.price;
            currentProductImageNameSpan.textContent = product.image ? product.image.split('/').pop() : 'No hay imagen';
            editProductImageInput.value = ''; // Clear file input

            editProductStatus.style.display = 'none';
            editProductModal.style.display = 'flex'; // Show the edit modal

        } catch (error) {
            console.error('Error al cargar producto para edición:', error);
            alert(`Error al cargar el producto para editar: ${error.message}`);
        }
    };

    const handleDeleteProduct = async (event) => {
        const productId = event.target.dataset.id;
        if (confirm(`¿Estás seguro de que quieres eliminar el producto con ID ${productId}?`)) {
            try {
                const response = await fetch(`http://localhost:3000/admin/products/${productId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${currentUser ? currentUser.token : ''}` }
                });

                if (response.ok) {
                    alert('Producto eliminado con éxito.');
                    loadProductsForAdminManagement(currentProductPage, productsPerPage, productSearchManagementInput.value);
                } else {
                    const data = await response.json();
                    alert(data.message || 'Error al eliminar producto.');
                }
            } catch (error) {
                console.error('Error al eliminar producto:', error);
                alert('Error de conexión al eliminar producto.');
            }
        }
    };

    if (productSearchManagementInput) {
        productSearchManagementInput.addEventListener('input', () => {
            loadProductsForAdminManagement(1, productsPerPage, productSearchManagementInput.value);
        });
    }

    if (productsPerPageSelect) {
        productsPerPageSelect.addEventListener('change', () => {
            productsPerPage = parseInt(productsPerPageSelect.value);
            loadProductsForAdminManagement(1, productsPerPage, productSearchManagementInput.value);
        });
    }

    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (currentProductPage > 1) {
                loadProductsForAdminManagement(currentProductPage - 1, productsPerPage, productSearchManagementInput.value);
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            loadProductsForAdminManagement(currentProductPage + 1, productsPerPage, productSearchManagementInput.value);
        });
    }

    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            if (addProductModal) {
                addProductModal.style.display = 'flex';
                createProductForm.reset();
                addProductStatus.textContent = '';
            }
        });
    }

    if (addProductCloseBtn) {
        addProductCloseBtn.addEventListener('click', () => {
            if (addProductModal) addProductModal.style.display = 'none';
        });
    }

    if (createProductForm) {
        createProductForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData();
            formData.append('name', newProductNameInput.value);
            formData.append('description', newProductDescriptionInput.value);
            formData.append('price', newProductPriceInput.value);
            if (newProductImageInput.files[0]) {
                formData.append('image', newProductImageInput.files[0]);
            }

            try {
                const response = await fetch('http://localhost:3000/admin/products', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${currentUser ? currentUser.token : ''}` },
                    body: formData,
                });
                const data = await response.json();

                if (response.ok) {
                    addProductStatus.textContent = 'Producto añadido con éxito.';
                    addProductStatus.style.color = 'var(--success-color)';
                    createProductForm.reset();
                    loadProductsForAdminManagement();
                } else {
                    addProductStatus.textContent = data.message || 'Error al añadir producto.';
                    addProductStatus.style.color = 'var(--error-color)';
                }
            } catch (error) {
                console.error('Error al añadir producto:', error);
                addProductStatus.textContent = 'Error de conexión.';
                addProductStatus.style.color = 'var(--error-color)';
            }
            addProductStatus.style.display = 'block';
        });
    }

    // Handle Edit Product Form Submission (NUEVO)
    if (editProductCloseBtn) {
        editProductCloseBtn.addEventListener('click', () => {
            editProductModal.style.display = 'none';
        });
    }

    if (editProductForm) {
        editProductForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const productId = editProductIdInput.value;
            const formData = new FormData();
            formData.append('name', editProductNameInput.value);
            formData.append('description', editProductDescriptionInput.value);
            formData.append('price', editProductPriceInput.value);

            if (editProductImageInput.files[0]) {
                formData.append('image', editProductImageInput.files[0]);
            }

            try {
                const response = await fetch(`http://localhost:3000/admin/products/${productId}`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${currentUser ? currentUser.token : ''}` },
                    body: formData,
                });
                const data = await response.json();

                if (response.ok) {
                    editProductStatus.textContent = 'Producto actualizado con éxito.';
                    editProductStatus.style.color = 'var(--success-color)';
                    loadProductsForAdminManagement(currentProductPage, productsPerPage, productSearchManagementInput.value);
                } else {
                    editProductStatus.textContent = data.message || 'Error al actualizar producto.';
                    editProductStatus.style.color = 'var(--error-color)';
                }
            } catch (error) {
                console.error('Error al actualizar producto:', error);
                editProductStatus.textContent = 'Error de conexión.';
                editProductStatus.style.color = 'var(--error-color)';
            }
            editProductStatus.style.display = 'block';
        });
    }


    // --- Client Management (Admin Only) ---
    let currentClients = [];

    const loadClientsForAdminManagement = async (page = 1, limit = clientsPerPage, search = '') => {
        if (!clientsTableBody) return;
        currentClientPage = page;

        try {
            const response = await fetch(`http://localhost:3000/admin/clients?page=${page}&limit=${limit}&search=${search}`, {
                headers: { 'Authorization': `Bearer ${currentUser ? currentUser.token : ''}` }
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    clientsTableBody.innerHTML = '<tr><td colspan="6" class="error-message">No autorizado. Inicie sesión como administrador.</td></tr>';
                    return;
                }
                throw new Error('Error al cargar clientes.');
            }

            const data = await response.json();
            currentClients = data.clients;
            const totalPages = data.totalPages;

            clientsTableBody.innerHTML = '';

            if (currentClients.length === 0) {
                clientsTableBody.innerHTML = '<tr><td colspan="6" class="info-message">No se encontraron clientes.</td></tr>';
                return;
            }

            currentClients.forEach(client => {
                const row = clientsTableBody.insertRow();
                row.dataset.clientId = client.id;
                row.innerHTML = `
                    <td>${client.id}</td>
                    <td>${client.name}</td>
                    <td>${client.email}</td>
                    <td>${client.phone || ''}</td>
                    <td>${client.address || ''}</td>
                    <td>
                        <button class="btn btn-sm btn-info edit-client-btn" data-id="${client.id}">Editar</button>
                        <button class="btn btn-sm btn-danger delete-client-btn" data-id="${client.id}">Eliminar</button>
                    </td>
                `;
            });

            if (currentClientPageSpan) currentClientPageSpan.textContent = `${currentClientPage} / ${totalPages}`;
            if (prevClientPageBtn) prevClientPageBtn.disabled = currentClientPage === 1;
            if (nextClientPageBtn) nextClientPageBtn.disabled = currentClientPage === totalPages;

            attachClientActionListeners();

        } catch (error) {
            console.error('Error al cargar clientes para gestión:', error);
            if (clientsTableBody) clientsTableBody.innerHTML = '<tr><td colspan="6" class="error-message">Error al cargar clientes.</td></tr>';
        }
    };

    const attachClientActionListeners = () => {
        document.querySelectorAll('.edit-client-btn').forEach(button => {
            button.removeEventListener('click', handleEditClient);
            button.addEventListener('click', handleEditClient);
        });

        document.querySelectorAll('.delete-client-btn').forEach(button => {
            button.removeEventListener('click', handleDeleteClient);
            button.addEventListener('click', handleDeleteClient);
        });
    };

    const handleEditClient = async (event) => {
        const clientId = event.target.dataset.id;
        // In a real app, you'd fetch client data and populate a modal for editing
        alert(`Editar cliente con ID: ${clientId} (Funcionalidad pendiente)`);
    };

    const handleDeleteClient = async (event) => {
        const clientId = event.target.dataset.id;
        if (confirm(`¿Estás seguro de que quieres eliminar al cliente con ID ${clientId}?`)) {
            try {
                const response = await fetch(`http://localhost:3000/admin/clients/${clientId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${currentUser ? currentUser.token : ''}` }
                });

                if (response.ok) {
                    alert('Cliente eliminado con éxito.');
                    loadClientsForAdminManagement(currentClientPage, clientsPerPage, clientSearchManagementInput.value);
                } else {
                    const data = await response.json();
                    alert(data.message || 'Error al eliminar cliente.');
                }
            } catch (error) {
                console.error('Error al eliminar cliente:', error);
                alert('Error de conexión al eliminar cliente.');
            }
        }
    };

    if (clientSearchManagementInput) {
        clientSearchManagementInput.addEventListener('input', () => {
            loadClientsForAdminManagement(1, clientsPerPage, clientSearchManagementInput.value);
        });
    }

    if (clientsPerPageSelect) {
        clientsPerPageSelect.addEventListener('change', () => {
            clientsPerPage = parseInt(clientsPerPageSelect.value);
            loadClientsForAdminManagement(1, clientsPerPage, clientSearchManagementInput.value);
        });
    }

    if (prevClientPageBtn) {
        prevClientPageBtn.addEventListener('click', () => {
            if (currentClientPage > 1) {
                loadClientsForAdminManagement(currentClientPage - 1, clientsPerPage, clientSearchManagementInput.value);
            }
        });
    }

    if (nextClientPageBtn) {
        nextClientPageBtn.addEventListener('click', () => {
            loadClientsForAdminManagement(currentClientPage + 1, clientsPerPage, clientSearchManagementInput.value);
        });
    }

    if (addNewClientBtn) {
        addNewClientBtn.addEventListener('click', () => {
            if (addClientModal) {
                addClientModal.style.display = 'flex';
                addClientForm.reset();
                addClientStatus.textContent = '';
            }
        });
    }

    if (addClientCloseBtn) {
        addClientCloseBtn.addEventListener('click', () => {
            if (addClientModal) addClientModal.style.display = 'none';
        });
    }

    if (addClientForm) {
        addClientForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const newClient = {
                name: newClientNameInput.value,
                email: newClientEmailInput.value,
                phone: newClientPhoneInput.value,
                address: newClientAddressInput.value
            };

            try {
                const response = await fetch('http://localhost:3000/admin/clients', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${currentUser ? currentUser.token : ''}`
                    },
                    body: JSON.stringify(newClient)
                });
                const data = await response.json();

                if (response.ok) {
                    addClientStatus.textContent = 'Cliente añadido con éxito.';
                    addClientStatus.style.color = 'var(--success-color)';
                    addClientForm.reset();
                    loadClientsForAdminManagement();
                } else {
                    addClientStatus.textContent = data.message || 'Error al añadir cliente.';
                    addClientStatus.style.color = 'var(--error-color)';
                }
            } catch (error) {
                console.error('Error al añadir cliente:', error);
                addClientStatus.textContent = 'Error de conexión.';
                addClientStatus.style.color = 'var(--error-color)';
            }
            addClientStatus.style.display = 'block';
        });
    }

    // --- Invoice Section Logic ---
    const resetInvoiceForm = () => {
        selectedClientForInvoice = null;
        selectedProductForInvoice = null;
        invoiceItems = [];

        clientIdInvoiceInput.value = '';
        clientNameInvoiceInput.value = '';
        clientEmailInvoiceInput.value = '';
        clientPhoneInvoiceInput.value = '';
        clientAddressInvoiceInput.value = '';
        clientIdHidden.value = '';
        clientInvoiceStatus.style.display = 'none';

        productIdInvoiceInput.value = '';
        selectedProductForInvoiceInfo.style.display = 'none';
        productInvoiceStatus.style.display = 'none';
        productQtyForInvoice.value = 1;

        updateInvoiceItemsTable();
    };

    if (searchClientByIdBtn) {
        searchClientByIdBtn.addEventListener('click', async () => {
            const clientId = clientIdInvoiceInput.value.trim();
            if (!clientId) {
                clientInvoiceStatus.textContent = 'Por favor, ingrese un ID de cliente.';
                clientInvoiceStatus.style.color = 'var(--error-color)';
                clientInvoiceStatus.style.display = 'block';
                return;
            }
            clientInvoiceStatus.style.display = 'none';

            try {
                const response = await fetch(`http://localhost:3000/admin/clients/${clientId}`, {
                    headers: { 'Authorization': `Bearer ${currentUser ? currentUser.token : ''}` }
                });
                const data = await response.json();

                if (response.ok) {
                    selectedClientForInvoice = data;
                    clientIdHidden.value = data.id;
                    clientNameInvoiceInput.value = data.name;
                    clientEmailInvoiceInput.value = data.email;
                    clientPhoneInvoiceInput.value = data.phone || '';
                    clientAddressInvoiceInput.value = data.address || '';
                } else {
                    selectedClientForInvoice = null;
                    clientIdHidden.value = '';
                    clientNameInvoiceInput.value = '';
                    clientEmailInvoiceInput.value = '';
                    clientPhoneInvoiceInput.value = '';
                    clientAddressInvoiceInput.value = '';
                    clientInvoiceStatus.textContent = data.message || 'Cliente no encontrado.';
                    clientInvoiceStatus.style.color = 'var(--error-color)';
                    clientInvoiceStatus.style.display = 'block';
                }
            } catch (error) {
                console.error('Error al buscar cliente por ID:', error);
                clientInvoiceStatus.textContent = 'Error de conexión al buscar cliente.';
                clientInvoiceStatus.style.color = 'var(--error-color)';
                clientInvoiceStatus.style.display = 'block';
            }
        });
    }

    if (searchProductByIdBtn) {
        searchProductByIdBtn.addEventListener('click', async () => {
            const productId = productIdInvoiceInput.value.trim();
            if (!productId) {
                productInvoiceStatus.textContent = 'Por favor, ingrese un ID de producto.';
                productInvoiceStatus.style.color = 'var(--error-color)';
                productInvoiceStatus.style.display = 'block';
                return;
            }
            productInvoiceStatus.style.display = 'none';

            try {
                const response = await fetch(`http://localhost:3000/admin/products/${productId}`, {
                    headers: { 'Authorization': `Bearer ${currentUser ? currentUser.token : ''}` }
                });
                const data = await response.json();

                if (response.ok) {
                    selectedProductForInvoice = data;
                    productNameForInvoice.textContent = data.name;
                    productPriceForInvoice.textContent = data.price.toFixed(2);
                    selectedProductForInvoiceInfo.style.display = 'block';
                    productQtyForInvoice.value = 1;
                } else {
                    selectedProductForInvoice = null;
                    selectedProductForInvoiceInfo.style.display = 'none';
                    productInvoiceStatus.textContent = data.message || 'Producto no encontrado.';
                    productInvoiceStatus.style.color = 'var(--error-color)';
                    productInvoiceStatus.style.display = 'block';
                }
            } catch (error) {
                console.error('Error al buscar producto por ID:', error);
                productInvoiceStatus.textContent = 'Error de conexión al buscar producto.';
                productInvoiceStatus.style.color = 'var(--error-color)';
                productInvoiceStatus.style.display = 'block';
            }
        });
    }

    if (addSelectedProductToInvoiceBtn) {
        addSelectedProductToInvoiceBtn.addEventListener('click', () => {
            if (!selectedProductForInvoice) {
                productInvoiceStatus.textContent = 'Primero busque y seleccione un producto.';
                productInvoiceStatus.style.color = 'var(--error-color)';
                productInvoiceStatus.style.display = 'block';
                return;
            }
            const quantity = parseInt(productQtyForInvoice.value);
            if (isNaN(quantity) || quantity <= 0) {
                productInvoiceStatus.textContent = 'La cantidad debe ser un número positivo.';
                productInvoiceStatus.style.color = 'var(--error-color)';
                productInvoiceStatus.style.display = 'block';
                return;
            }

            const existingItem = invoiceItems.find(item => item.id === selectedProductForInvoice.id);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                invoiceItems.push({
                    id: selectedProductForInvoice.id,
                    name: selectedProductForInvoice.name,
                    price: selectedProductForInvoice.price,
                    quantity: quantity
                });
            }

            productIdInvoiceInput.value = '';
            selectedProductForInvoice = null;
            selectedProductForInvoiceInfo.style.display = 'none';
            productInvoiceStatus.style.display = 'none';

            updateInvoiceItemsTable();
        });
    }

    const updateInvoiceItemsTable = () => {
        invoiceProductsTableBody.innerHTML = '';
        let totalInvoice = 0;

        if (invoiceItems.length === 0) {
            invoiceProductsTableBody.innerHTML = '<tr><td colspan="6" class="info-message">No hay productos en la factura.</td></tr>';
            invoiceTotalElement.textContent = '$0.00';
            return;
        }

        invoiceItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalInvoice += itemTotal;
            const row = invoiceProductsTableBody.insertRow();
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td><input type="number" class="invoice-item-qty" data-id="${item.id}" value="${item.quantity}" min="1" style="width: 60px;"></td>
                <td>$${item.price.toFixed(2)}</td>
                <td class="item-total">$${itemTotal.toFixed(2)}</td>
                <td><button class="btn btn-sm btn-danger remove-invoice-item" data-id="${item.id}"><i class="fas fa-trash"></i></button></td>
            `;
        });

        invoiceTotalElement.textContent = `$${totalInvoice.toFixed(2)}`;

        document.querySelectorAll('.invoice-item-qty').forEach(input => {
            input.addEventListener('change', (event) => {
                const id = parseInt(event.target.dataset.id);
                const newQty = parseInt(event.target.value);
                const item = invoiceItems.find(i => i.id === id);
                if (item && !isNaN(newQty) && newQty > 0) {
                    item.quantity = newQty;
                    updateInvoiceItemsTable();
                } else {
                    event.target.value = item.quantity;
                }
            });
        });

        document.querySelectorAll('.remove-invoice-item').forEach(button => {
            button.addEventListener('click', (event) => {
                const id = parseInt(event.target.dataset.id);
                invoiceItems = invoiceItems.filter(item => item.id !== id);
                updateInvoiceItemsTable();
            });
        });
    };

    if (generateInvoiceBtn) {
        generateInvoiceBtn.addEventListener('click', async () => {
            if (!selectedClientForInvoice) {
                invoiceGenerationStatus.textContent = 'Debe seleccionar un cliente.';
                invoiceGenerationStatus.style.color = 'var(--error-color)';
                invoiceGenerationStatus.style.display = 'block';
                return;
            }
            if (invoiceItems.length === 0) {
                invoiceGenerationStatus.textContent = 'Debe añadir al menos un producto a la factura.';
                invoiceGenerationStatus.style.color = 'var(--error-color)';
                invoiceGenerationStatus.style.display = 'block';
                return;
            }
            invoiceGenerationStatus.style.display = 'none';

            const invoiceData = {
                clientId: selectedClientForInvoice.id,
                items: invoiceItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            try {
                const response = await fetch('http://localhost:3000/admin/invoice', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${currentUser ? currentUser.token : ''}`
                    },
                    body: JSON.stringify(invoiceData)
                });
                const data = await response.json();

                if (response.ok) {
                    invoiceGenerationStatus.textContent = data.message + (data.filePath ? ` Descargando factura...` : '');
                    invoiceGenerationStatus.style.color = 'var(--success-color)';
                    resetInvoiceForm();

                    if (data.filePath) {
                        const fileUrl = `http://localhost:3000/${data.filePath.replace(/\\/g, '/')}`;
                        window.open(fileUrl, '_blank');
                    }
                } else {
                    invoiceGenerationStatus.textContent = data.message || 'Error al generar factura.';
                    invoiceGenerationStatus.style.color = 'var(--error-color)';
                }
            } catch (error) {
                console.error('Error al generar factura:', error);
                invoiceGenerationStatus.textContent = 'Error de conexión al generar factura.';
                invoiceGenerationStatus.style.color = 'var(--error-color)';
            }
            invoiceGenerationStatus.style.display = 'block';
        });
    }

    // --- Upload Payment Section ---
    if (paymentForm) {
        paymentForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (!currentUser) {
                paymentUploadStatus.textContent = 'Debe iniciar sesión para subir un comprobante.';
                paymentUploadStatus.style.color = 'var(--error-color)';
                paymentUploadStatus.style.display = 'block';
                return;
            }

            const formData = new FormData();
            formData.append('paymentProof', paymentFile.files[0]);
            formData.append('description', paymentDescription.value);
            formData.append('userId', currentUser.id);

            try {
                const response = await fetch('http://localhost:3000/upload-payment', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Authorization': `Bearer ${currentUser ? currentUser.token : ''}` }
                });
                const data = await response.json();

                if (response.ok) {
                    paymentUploadStatus.textContent = data.message;
                    paymentUploadStatus.style.color = 'var(--success-color)';
                    paymentForm.reset();
                } else {
                    paymentUploadStatus.textContent = data.message || 'Error al subir el comprobante.';
                    paymentUploadStatus.style.color = 'var(--error-color)';
                }
            } catch (error) {
                console.error('Error al subir comprobante:', error);
                paymentUploadStatus.textContent = 'Error de conexión al subir el comprobante.';
                paymentUploadStatus.style.color = 'var(--error-color)';
            }
            paymentUploadStatus.style.display = 'block';
        });
    }

    // --- User Management (Admin Only) ---
    const loadUsersForAdminManagement = async (filterAdminsOnly = false) => {
        if (!usersManagementTableBody) return;

        currentUsersFilterAdminsOnly = filterAdminsOnly;

        let url = 'http://localhost:3000/admin/users';
        if (filterAdminsOnly) {
            url += '?role=2';
        }

        try {
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${currentUser ? currentUser.token : ''}` }
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    usersManagementTableBody.innerHTML = '<tr><td colspan="4" class="error-message">No autorizado. Inicie sesión como administrador.</td></tr>';
                    return;
                }
                throw new Error('Error al cargar usuarios.');
            }

            const users = await response.json();
            usersManagementTableBody.innerHTML = '';

            if (users.length === 0) {
                usersManagementTableBody.innerHTML = '<tr><td colspan="4" class="info-message">No se encontraron usuarios.</td></tr>';
                return;
            }

            users.forEach(user => {
                const row = usersManagementTableBody.insertRow();
                row.dataset.userId = user.id;
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>
                        <select class="user-role-select" data-id="${user.id}">
                            <option value="1" ${user.role === 1 ? 'selected' : ''}>Usuario</option>
                            <option value="2" ${user.role === 2 ? 'selected' : ''}>Administrador</option>
                        </select>
                        <button class="btn btn-sm btn-primary save-role-btn" data-id="${user.id}">Guardar</button>
                        <span class="status-message" style="margin-left: 10px;"></span>
                    </td>
                `;
            });

            document.querySelectorAll('.save-role-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const userId = event.target.dataset.id;
                    const selectElement = document.querySelector(`.user-role-select[data-id="${userId}"]`);
                    const newRole = parseInt(selectElement.value);
                    const statusSpan = event.target.nextElementSibling;

                    statusSpan.textContent = '';

                    // Prevent an admin from revoking their own admin role
                    if (currentUser && currentUser.id == userId && newRole === 1 && currentUser.role === 2) {
                        statusSpan.textContent = 'No puedes revocar tu propio rol de administrador.';
                        statusSpan.style.color = 'var(--error-color)';
                        return;
                    }

                    try {
                        const response = await fetch(`http://localhost:3000/admin/users/${userId}/role`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${currentUser ? currentUser.token : ''}`
                            },
                            body: JSON.stringify({ role: newRole })
                        });
                        const data = await response.json();

                        if (response.ok) {
                            statusSpan.textContent = data.message;
                            statusSpan.style.color = 'var(--success-color)';

                            // Update current user's role in session if it's their own role being changed
                            if (currentUser && currentUser.id == userId) {
                                currentUser.role = newRole;
                                sessionStorage.setItem('gamarka_current_user', JSON.stringify(currentUser));
                                updateUIForUser(); // Re-render UI based on new role
                            }
                            // Re-load the table to reflect changes (especially important for demotions)
                            loadUsersForAdminManagement(filterAdminsOnly);

                        } else {
                            statusSpan.textContent = data.message || 'Error al guardar.';
                            statusSpan.style.color = 'var(--error-color)';
                        }
                    } catch (error) {
                        console.error('Error al actualizar rol:', error);
                        statusSpan.textContent = 'Error de conexión.';
                        statusSpan.style.color = 'var(--error-color)';
                    }
                });
            });
        } catch (error) {
            console.error('Error cargando usuarios para gestión:', error);
            if (usersManagementTableBody) usersManagementTableBody.innerHTML = '<tr><td colspan="4" class=\"error-message\">Error al cargar usuarios.</td></tr>';
        }
    }

    if (viewAdminsBtn) {
        viewAdminsBtn.addEventListener('click', async () => {
            await loadUsersForAdminManagement(true);
        });
    }

    if (viewAllUsersBtn) {
        viewAllUsersBtn.addEventListener('click', async () => {
            await loadUsersForAdminManagement(false);
        });
    }

    // --- Initialize the page ---
    checkSession();
});