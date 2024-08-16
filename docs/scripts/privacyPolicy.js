document.addEventListener('DOMContentLoaded', function () {
    var link = document.getElementById('privacyPolicyLink');
    var content = document.getElementById('privacyPolicyContent');

    link.addEventListener('click', function (event) {
        event.preventDefault();
        if (content.style.display === 'none') {
            content.style.display = 'block';
            link.textContent = '↑ Hide Privacy Policy';
        } else {
            content.style.display = 'none';
            link.textContent = '↓ Show Privacy Policy';
        }
    });
});
