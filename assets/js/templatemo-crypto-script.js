/*
==========================================================================
CryptoVault - Crypto Dashboard Template
Template Name: CryptoVault
Template URL: https://templatemo.com
Description: JavaScript functionality for CryptoVault dashboard
Author: TemplateMo
Version: 1.0
==========================================================================

TemplateMo 609 Crypto Vault

https://templatemo.com/tm-609-crypto-vault

*/

(function() {
    'use strict';

    /* ========================================
       Theme Toggle
    ======================================== */
    function initThemeToggle() {
        const themeSwitch = document.getElementById('themeSwitch');
        const themeToggleBtn = document.getElementById('themeToggle');
        const html = document.documentElement;

        function setTheme(theme) {
            html.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            updateDarkModeToggle();
            updateThemeChoices(theme);
        }
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        html.setAttribute('data-theme', savedTheme);
        updateThemeChoices(savedTheme);
        
        // Dashboard theme switch (sidebar)
        if (themeSwitch) {
            themeSwitch.addEventListener('click', function() {
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                setTheme(newTheme);
            });
        }

        document.querySelectorAll('.theme-choice').forEach(function(choice) {
            choice.addEventListener('click', function() {
                const theme = choice.getAttribute('data-theme-choice');
                if (theme === 'dark' || theme === 'light') {
                    setTheme(theme);
                }
            });
        });
        
        // Login page theme toggle button
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', function() {
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                setTheme(newTheme);
            });
        }
    }

    function updateThemeChoices(theme) {
        document.querySelectorAll('.theme-choice').forEach(function(choice) {
            const isSelected = choice.getAttribute('data-theme-choice') === theme;
            choice.classList.toggle('active', isSelected);
            choice.setAttribute('aria-pressed', String(isSelected));
        });
    }

    /* ========================================
       Dark Mode Toggle (Settings Page)
    ======================================== */
    function updateDarkModeToggle() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        const html = document.documentElement;
        
        if (darkModeToggle) {
            if (html.getAttribute('data-theme') === 'dark') {
                darkModeToggle.classList.add('active');
            } else {
                darkModeToggle.classList.remove('active');
            }
        }
    }

    function initDarkModeToggle() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        const themeSwitch = document.getElementById('themeSwitch');
        
        updateDarkModeToggle();
        
        if (darkModeToggle && themeSwitch) {
            darkModeToggle.addEventListener('click', function() {
                themeSwitch.click();
            });
        }
    }

    /* ========================================
       Mobile Menu
    ======================================== */
    function initMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        function toggleMobileMenu() {
            if (mobileMenuToggle && sidebar && sidebarOverlay) {
                mobileMenuToggle.classList.toggle('active');
                sidebar.classList.toggle('active');
                sidebarOverlay.classList.toggle('active');
                document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
            }
        }

        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', toggleMobileMenu);
        }

        // Close menu when clicking nav items
        document.querySelectorAll('.nav-item:not(.member-dropdown-toggle), .nav-subitem').forEach(function(item) {
            item.addEventListener('click', function() {
                if (window.innerWidth <= 1024 && sidebar && sidebar.classList.contains('active')) {
                    toggleMobileMenu();
                }
            });
        });

        // Close menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 1024 && sidebar && sidebar.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    }

    function initMemberDropdown() {
        document.querySelectorAll('.member-dropdown-toggle').forEach(function(toggle) {
            const dropdown = toggle.closest('.nav-dropdown');
            if (!dropdown) return;

            toggle.addEventListener('click', function() {
                const isOpen = dropdown.classList.toggle('open');
                toggle.setAttribute('aria-expanded', String(isOpen));
            });
        });
    }

    function initMemberManagement() {
        const memberForm = document.getElementById('memberForm');
        const memberTableBody = document.getElementById('memberTableBody');
        const memberSearch = document.getElementById('memberSearch');
        const memberCount = document.getElementById('memberCount');
        const memberMessage = document.getElementById('memberMessage');
        const pendingView = memberTableBody && memberTableBody.dataset.memberView === 'pending';
        const storageKey = 'cryptovault-members';

        if (!memberForm && !memberTableBody) return;

        function readMembers() {
            const savedMembers = localStorage.getItem(storageKey);
            if (!savedMembers) return [];

            const members = JSON.parse(savedMembers);
            if (!Array.isArray(members) || members.some(function(member) {
                return !member ||
                    typeof member.id !== 'string' ||
                    typeof member.name !== 'string' ||
                    typeof member.email !== 'string' ||
                    typeof member.phone !== 'string' ||
                    typeof member.status !== 'string';
            })) {
                throw new Error('Data member tersimpan tidak valid.');
            }
            return members;
        }

        function showMessage(message, isError) {
            if (!memberMessage) return;
            memberMessage.textContent = message;
            memberMessage.classList.toggle('error', isError);
            memberMessage.hidden = !message;
        }

        function renderMembers() {
            if (!memberTableBody) return;

            let members;
            try {
                members = readMembers();
            } catch (error) {
                showMessage(error.message || 'Data member tidak dapat dibaca.', true);
                return;
            }

            const query = memberSearch ? memberSearch.value.trim().toLowerCase() : '';
            const filteredMembers = members.filter(function(member) {
                if (pendingView && member.status !== 'Menunggu Konfirmasi') return false;
                return [member.name, member.email, member.phone]
                    .some(function(value) {
                        return String(value || '').toLowerCase().includes(query);
                    });
            });

            memberCount.textContent = String(pendingView
                ? members.filter(function(member) { return member.status === 'Menunggu Konfirmasi'; }).length
                : members.length);
            memberTableBody.replaceChildren();

            if (filteredMembers.length === 0) {
                const row = document.createElement('tr');
                const cell = document.createElement('td');
                cell.colSpan = 5;
                cell.className = 'member-empty';
                cell.textContent = pendingView
                    ? (members.some(function(member) { return member.status === 'Menunggu Konfirmasi'; })
                        ? 'Member tidak ditemukan.'
                        : 'Tidak ada member yang menunggu konfirmasi.')
                    : (members.length ? 'Member tidak ditemukan.' : 'Belum ada member. Tambahkan member pertama Anda.');
                row.appendChild(cell);
                memberTableBody.appendChild(row);
                return;
            }

            filteredMembers.forEach(function(member) {
                const row = document.createElement('tr');
                [member.name, member.email, member.phone, member.status].forEach(function(value, index) {
                    const cell = document.createElement('td');
                    cell.textContent = value || '-';
                    if (index === 3) {
                        const status = document.createElement('span');
                        status.className = 'member-status' +
                            (value === 'Aktif' ? ' active' : '') +
                            (value === 'Menunggu Konfirmasi' ? ' pending' : '');
                        status.textContent = value || '-';
                        cell.replaceChildren(status);
                    }
                    row.appendChild(cell);
                });

                const actionCell = document.createElement('td');
                const actionButton = document.createElement('button');
                actionButton.className = pendingView ? 'member-approve' : 'member-delete';
                actionButton.type = 'button';
                actionButton.textContent = pendingView ? 'Setujui' : 'Hapus';
                actionButton.setAttribute('aria-label', (pendingView ? 'Setujui member ' : 'Hapus member ') + member.name);
                actionButton.addEventListener('click', function() {
                    if (pendingView && !window.confirm('Setujui member ' + member.name + '?')) return;
                    if (!pendingView && !window.confirm('Hapus member ' + member.name + '?')) return;
                    try {
                        const updatedMembers = readMembers().map(function(item) {
                            if (item.id === member.id && pendingView) {
                                return Object.assign({}, item, { status: 'Aktif' });
                            }
                            return item;
                        });
                        const persistedMembers = pendingView
                            ? updatedMembers
                            : updatedMembers.filter(function(item) { return item.id !== member.id; });
                        localStorage.setItem(storageKey, JSON.stringify(persistedMembers));
                        showMessage(pendingView ? 'Member berhasil dikonfirmasi dan diaktifkan.' : 'Member berhasil dihapus.', false);
                        renderMembers();
                    } catch (error) {
                        showMessage(error.message || (pendingView ? 'Member tidak dapat dikonfirmasi.' : 'Member tidak dapat dihapus.'), true);
                    }
                });
                actionCell.appendChild(actionButton);
                row.appendChild(actionCell);
                memberTableBody.appendChild(row);
            });
        }

        if (memberForm) {
            memberForm.addEventListener('submit', function(event) {
                event.preventDefault();
                if (!memberForm.reportValidity()) return;

                const formData = new FormData(memberForm);
                const member = {
                    id: window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : String(Date.now()),
                    name: String(formData.get('name')).trim(),
                    email: String(formData.get('email')).trim(),
                    phone: String(formData.get('phone')).trim(),
                    status: 'Menunggu Konfirmasi'
                };

                try {
                    const members = readMembers();
                    if (members.some(function(item) {
                        return item.email.toLowerCase() === member.email.toLowerCase();
                    })) {
                        showMessage('Email tersebut sudah terdaftar.', true);
                        return;
                    }
                    members.push(member);
                    localStorage.setItem(storageKey, JSON.stringify(members));
                    window.location.href = 'setujui_member.html?added=1';
                } catch (error) {
                    showMessage(error.message || 'Member tidak dapat disimpan di browser ini.', true);
                }
            });
        }

        if (memberSearch) {
            memberSearch.addEventListener('input', renderMembers);
        }

        if (memberTableBody) {
            renderMembers();
            const queryParams = new URLSearchParams(window.location.search);
            if (queryParams.get('added') === '1') {
                showMessage(pendingView
                    ? 'Pendaftaran member berhasil. Periksa data lalu setujui untuk mengaktifkannya.'
                    : 'Member berhasil ditambahkan dan menunggu konfirmasi.', false);
            } else if (queryParams.get('confirmed') === '1') {
                showMessage('Member berhasil dikonfirmasi dan diaktifkan.', false);
            }
        }
    }

    function initAdminContent() {
        const message = document.getElementById('adminContentMessage');
        const storagePrefix = 'cryptovault-admin-';
        const statusLabels = {
            pending: 'Menunggu Konfirmasi',
            approved: 'Disetujui',
            rejected: 'Ditolak',
            active: 'Aktif',
            inactive: 'Nonaktif'
        };

        function getRecords(collection) {
            const value = localStorage.getItem(storagePrefix + collection);
            if (!value) return [];
            const records = JSON.parse(value);
            if (!Array.isArray(records) || records.some(function(record) {
                return !record || typeof record.id !== 'string' || typeof record.status !== 'string';
            })) {
                throw new Error('Data ' + collection + ' tersimpan tidak valid.');
            }
            return records;
        }

        function saveRecords(collection, records) {
            localStorage.setItem(storagePrefix + collection, JSON.stringify(records));
        }

        function showMessage(text, isError) {
            if (!message) return;
            message.textContent = text;
            message.classList.toggle('error', Boolean(isError));
            message.hidden = !text;
        }

        document.querySelectorAll('[data-admin-form]').forEach(function(form) {
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                if (!form.reportValidity()) return;

                const collection = form.dataset.adminForm;
                const formData = new FormData(form);
                const record = {
                    id: window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : String(Date.now()),
                    status: form.dataset.initialStatus || 'pending',
                    createdAt: new Date().toISOString()
                };
                formData.forEach(function(value, key) {
                    record[key] = String(value).trim();
                });

                try {
                    const records = getRecords(collection);
                    if (collection === 'currencies' && records.some(function(item) {
                        return item.code.toLowerCase() === record.code.toLowerCase();
                    })) {
                        showMessage('Kode currency tersebut sudah terdaftar.', true);
                        return;
                    }
                    records.push(record);
                    saveRecords(collection, records);
                    form.reset();
                    showMessage(form.dataset.successMessage || 'Data berhasil disimpan.', false);
                    renderLists();
                } catch (error) {
                    showMessage(error.message || 'Data tidak dapat disimpan.', true);
                }
            });
        });

        function renderLists() {
            document.querySelectorAll('[data-admin-list]').forEach(function(body) {
                const collection = body.dataset.adminList;
                const view = body.dataset.adminView || 'all';
                const fields = (body.dataset.adminFields || '').split(',').filter(Boolean);
                const search = document.querySelector('[data-admin-search="' + collection + '"]');
                let records;
                try {
                    records = getRecords(collection);
                } catch (error) {
                    showMessage(error.message || 'Data tidak dapat dibaca.', true);
                    return;
                }

                const visibleRecords = records.filter(function(record) {
                    if (view === 'pending' && record.status !== 'pending') return false;
                    const query = search ? search.value.trim().toLowerCase() : '';
                    return !query || fields.some(function(field) {
                        return String(record[field] || '').toLowerCase().includes(query);
                    });
                });
                const recordsInView = view === 'pending'
                    ? records.filter(function(record) { return record.status === 'pending'; })
                    : records;

                const count = document.querySelector('[data-admin-count="' + collection + '"]');
                if (count) {
                    count.textContent = String(view === 'pending'
                        ? records.filter(function(record) { return record.status === 'pending'; }).length
                        : records.length);
                }
                body.replaceChildren();

                if (visibleRecords.length === 0) {
                    const row = document.createElement('tr');
                    const cell = document.createElement('td');
                    cell.colSpan = Math.max(fields.length + 1, 2);
                    cell.className = 'member-empty';
                    cell.textContent = recordsInView.length && search && search.value.trim()
                        ? 'Tidak ada data yang cocok.'
                        : (body.dataset.emptyMessage || 'Belum ada data.');
                    row.appendChild(cell);
                    body.appendChild(row);
                    return;
                }

                visibleRecords.forEach(function(record) {
                    const row = document.createElement('tr');
                    fields.forEach(function(field) {
                        const cell = document.createElement('td');
                        const value = record[field];
                        if (field === 'status') {
                            const badge = document.createElement('span');
                            badge.className = 'member-status' +
                                (record.status === 'approved' || record.status === 'active' ? ' active' : '') +
                                (record.status === 'pending' ? ' pending' : '');
                            badge.textContent = record.status === 'pending'
                                ? (collection === 'kyc' ? 'Menunggu Verifikasi' : 'Menunggu Persetujuan')
                                : collection === 'kyc' && record.status === 'approved'
                                    ? 'Terverifikasi'
                                    : statusLabels[record.status] || record.status || '-';
                            cell.appendChild(badge);
                        } else if (field === 'createdAt' && value) {
                            cell.textContent = new Intl.DateTimeFormat('id-ID', {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                            }).format(new Date(value));
                        } else {
                            cell.textContent = value || '-';
                        }
                        row.appendChild(cell);
                    });

                    const actionCell = document.createElement('td');
                    (body.dataset.adminActions || '').split(',').filter(Boolean).forEach(function(action) {
                        if (action === 'approve' || action === 'reject') {
                            if (record.status !== 'pending') return;
                        }
                        if (action === 'toggle' && !['active', 'inactive'].includes(record.status)) return;

                        const button = document.createElement('button');
                        button.type = 'button';
                        button.className = action === 'approve' || action === 'toggle'
                            ? 'member-approve'
                            : 'member-delete';
                        button.textContent = action === 'approve' ? 'Setujui'
                            : action === 'reject' ? 'Tolak'
                            : action === 'toggle' ? (record.status === 'active' ? 'Nonaktifkan' : 'Aktifkan')
                            : 'Hapus';
                        button.addEventListener('click', function() {
                            const title = record.member || record.name || record.code || record.email || 'data ini';
                            if (!window.confirm(button.textContent + ' ' + title + '?')) return;
                            try {
                                let updatedRecords = getRecords(collection);
                                if (action === 'delete') {
                                    updatedRecords = updatedRecords.filter(function(item) { return item.id !== record.id; });
                                } else {
                                    const nextStatus = action === 'approve' ? 'approved'
                                        : action === 'reject' ? 'rejected'
                                        : record.status === 'active' ? 'inactive' : 'active';
                                    updatedRecords = updatedRecords.map(function(item) {
                                        return item.id === record.id
                                            ? Object.assign({}, item, { status: nextStatus })
                                            : item;
                                    });
                                }
                                saveRecords(collection, updatedRecords);
                                showMessage(action === 'approve' ? 'Data berhasil disetujui.'
                                    : action === 'reject' ? 'Data berhasil ditolak.'
                                    : action === 'toggle' ? 'Status currency berhasil diperbarui.'
                                    : 'Data berhasil dihapus.', false);
                                renderLists();
                            } catch (error) {
                                showMessage(error.message || 'Perubahan data gagal disimpan.', true);
                            }
                        });
                        actionCell.appendChild(button);
                    });
                    row.appendChild(actionCell);
                    body.appendChild(row);
                });
            });
        }

        document.querySelectorAll('[data-admin-search]').forEach(function(search) {
            search.addEventListener('input', renderLists);
        });

        document.querySelectorAll('[data-dashboard-palette]').forEach(function(button) {
            button.addEventListener('click', function() {
                const palette = button.dataset.dashboardPalette;
                document.documentElement.dataset.accent = palette;
                localStorage.setItem('dashboard-accent', palette);
                document.querySelectorAll('[data-dashboard-palette]').forEach(function(item) {
                    item.classList.toggle('active', item === button);
                    item.setAttribute('aria-pressed', String(item === button));
                });
                showMessage('Warna dashboard berhasil diterapkan.', false);
            });
        });
        const availablePalettes = ['copper', 'blue', 'green', 'violet', 'red'];
        const storedPalette = localStorage.getItem('dashboard-accent');
        const savedPalette = availablePalettes.includes(storedPalette) ? storedPalette : 'copper';
        document.documentElement.dataset.accent = savedPalette;
        document.querySelectorAll('[data-dashboard-palette]').forEach(function(button) {
            const selected = button.dataset.dashboardPalette === savedPalette;
            button.classList.toggle('active', selected);
            button.setAttribute('aria-pressed', String(selected));
        });

        renderLists();
    }

    function initActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.sidebar .nav-item, .sidebar .nav-subitem').forEach(function(link) {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        });
        document.querySelectorAll('.sidebar .nav-dropdown').forEach(function(dropdown) {
            dropdown.classList.remove('open');
            const toggle = dropdown.querySelector('.member-dropdown-toggle');
            if (toggle) {
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });

        document.querySelectorAll('.sidebar a.nav-item, .sidebar a.nav-subitem').forEach(function(link) {
            const targetPage = link.getAttribute('href');
            if (!targetPage || targetPage.split('#')[0] !== currentPage) return;
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');

            const dropdown = link.closest('.nav-dropdown');
            if (dropdown) {
                dropdown.classList.add('open');
                const toggle = dropdown.querySelector('.member-dropdown-toggle');
                if (toggle) {
                    toggle.classList.add('active');
                    toggle.setAttribute('aria-expanded', 'true');
                }
            }
        });
    }

    /* ========================================
       Toggle Switches
    ======================================== */
    function initToggleSwitches() {
        document.querySelectorAll('.toggle-switch').forEach(function(toggle) {
            // Skip dark mode toggle as it's handled separately
            if (toggle.id !== 'darkModeToggle') {
                toggle.addEventListener('click', function() {
                    toggle.classList.toggle('active');
                });
            }
        });
    }

    /* ========================================
       Copy to Clipboard
    ======================================== */
    function initCopyButtons() {
        document.querySelectorAll('.copy-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const addressElement = btn.parentElement.querySelector('.wallet-address');
                if (addressElement) {
                    const address = addressElement.textContent;
                    navigator.clipboard.writeText(address).then(function() {
                        // Show success state
                        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b8e6b" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
                        
                        // Reset after 2 seconds
                        setTimeout(function() {
                            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>';
                        }, 2000);
                    });
                }
            });
        });
    }

    /* ========================================
       Settings Tabs
    ======================================== */
    function initSettingsTabs() {
        document.querySelectorAll('.settings-tab').forEach(function(tab) {
            tab.addEventListener('click', function() {
                // Remove active from all tabs
                document.querySelectorAll('.settings-tab').forEach(function(t) {
                    t.classList.remove('active');
                });
                
                // Remove active from all content
                document.querySelectorAll('.settings-content').forEach(function(c) {
                    c.classList.remove('active');
                });
                
                // Add active to clicked tab
                tab.classList.add('active');
                
                // Show corresponding content
                const targetId = tab.dataset.tab;
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    /* ========================================
       Filter Tabs (Markets Page)
    ======================================== */
    function initFilterTabs() {
        document.querySelectorAll('.filter-tab').forEach(function(tab) {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.filter-tab').forEach(function(t) {
                    t.classList.remove('active');
                });
                tab.classList.add('active');
            });
        });
    }

    /* ========================================
       Star/Favorite Toggle
    ======================================== */
    function initStarButtons() {
        document.querySelectorAll('.star-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                btn.classList.toggle('active');
                btn.textContent = btn.classList.contains('active') ? '★' : '☆';
            });
        });
    }

    /* ========================================
       Search Functionality
    ======================================== */
    function initSearch() {
        const searchInput = document.getElementById('searchInput');
        
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                const search = e.target.value.toLowerCase();
                
                document.querySelectorAll('.market-table tbody tr').forEach(function(row) {
                    const nameElement = row.querySelector('.coin-name');
                    const symbolElement = row.querySelector('.coin-symbol');
                    
                    if (nameElement && symbolElement) {
                        const name = nameElement.textContent.toLowerCase();
                        const symbol = symbolElement.textContent.toLowerCase();
                        row.style.display = (name.includes(search) || symbol.includes(search)) ? '' : 'none';
                    }
                });
            });
        }
    }

    /* ========================================
       Checkbox Toggle
    ======================================== */
    function initCheckboxes() {
        document.querySelectorAll('.checkbox-wrapper').forEach(function(wrapper) {
            wrapper.addEventListener('click', function() {
                const checkbox = wrapper.querySelector('.checkbox');
                if (checkbox) {
                    checkbox.classList.toggle('checked');
                }
            });
        });
    }

    /* ========================================
       Password Toggle
    ======================================== */
    function initPasswordToggle() {
        document.querySelectorAll('.password-toggle').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const targetId = btn.dataset.target;
                const input = document.getElementById(targetId);
                
                if (input) {
                    const type = input.type === 'password' ? 'text' : 'password';
                    input.type = type;
                }
            });
        });
    }

    /* ========================================
       Password Strength Meter
    ======================================== */
    function initPasswordStrength() {
        const passwordInput = document.getElementById('registerPassword');
        const strengthBars = document.querySelectorAll('.strength-bar');
        
        if (passwordInput && strengthBars.length > 0) {
            passwordInput.addEventListener('input', function() {
                const password = passwordInput.value;
                let strength = 0;

                if (password.length >= 8) strength++;
                if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
                if (/\d/.test(password)) strength++;
                if (/[^a-zA-Z0-9]/.test(password)) strength++;

                strengthBars.forEach(function(bar, index) {
                    bar.classList.remove('weak', 'medium', 'strong');
                    if (index < strength) {
                        if (strength <= 1) bar.classList.add('weak');
                        else if (strength <= 2) bar.classList.add('medium');
                        else bar.classList.add('strong');
                    }
                });
            });
        }
    }

    /* ========================================
       Auth Tabs (Login Page)
    ======================================== */
    function initAuthTabs() {
        const authTabs = document.querySelectorAll('.auth-tab');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const formHeader = document.querySelector('.form-header');

        authTabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                authTabs.forEach(function(t) {
                    t.classList.remove('active');
                });
                tab.classList.add('active');

                if (tab.dataset.form === 'login') {
                    if (loginForm) loginForm.classList.add('active');
                    if (registerForm) registerForm.classList.remove('active');
                    if (formHeader) {
                        formHeader.querySelector('h1').textContent = 'Welcome Back';
                        formHeader.querySelector('p').textContent = 'Enter your credentials to access your account';
                    }
                } else {
                    if (registerForm) registerForm.classList.add('active');
                    if (loginForm) loginForm.classList.remove('active');
                    if (formHeader) {
                        formHeader.querySelector('h1').textContent = 'Create Account';
                        formHeader.querySelector('p').textContent = 'Start your crypto journey today';
                    }
                }
            });
        });

        // Quick switch links
        const switchToRegister = document.getElementById('switchToRegister');
        const switchToLogin = document.getElementById('switchToLogin');

        if (switchToRegister && authTabs[1]) {
            switchToRegister.addEventListener('click', function(e) {
                e.preventDefault();
                authTabs[1].click();
            });
        }

        if (switchToLogin && authTabs[0]) {
            switchToLogin.addEventListener('click', function(e) {
                e.preventDefault();
                authTabs[0].click();
            });
        }
    }

    /* ========================================
       Form Submissions
    ======================================== */
    function initFormSubmissions() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                window.location.href = 'index.html';
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const successMessage = document.getElementById('successMessage');
                const formHeader = document.querySelector('.form-header');
                const authTabs = document.querySelector('.auth-tabs');
                
                if (successMessage) {
                    registerForm.style.display = 'none';
                    if (authTabs) authTabs.style.display = 'none';
                    successMessage.classList.add('active');
                    if (formHeader) {
                        formHeader.querySelector('h1').textContent = 'Success!';
                        formHeader.querySelector('p').textContent = '';
                    }
                }
            });
        }
    }

    /* ========================================
       Initialize All
    ======================================== */
    function init() {
        initThemeToggle();
        initDarkModeToggle();
        initMobileMenu();
        initMemberDropdown();
        initMemberManagement();
        initAdminContent();
        initActiveNavigation();
        initToggleSwitches();
        initCopyButtons();
        initSettingsTabs();
        initFilterTabs();
        initStarButtons();
        initSearch();
        initCheckboxes();
        initPasswordToggle();
        initPasswordStrength();
        initAuthTabs();
        initFormSubmissions();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
