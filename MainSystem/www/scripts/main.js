document.addEventListener('DOMContentLoaded', function () {
    var menuBtn = document.getElementById('menuBtn');
    var sideNav = document.getElementById('sideNav');

    menuBtn.addEventListener('click', function () {
        if (sideNav.classList.contains('sidebar-hidden')) {
            // Sidebar is currently hidden, make it visible
            sideNav.classList.remove('sidebar-hidden');
            sideNav.classList.add('sidebar-visible');
        } else {
            // Sidebar is currently visible, hide it
            sideNav.classList.remove('sidebar-visible');
            sideNav.classList.add('sidebar-hidden');
        }
    });
});

