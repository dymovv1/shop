function changeLanguage(language) {
    var elements = document.querySelectorAll('[data-ua], [data-en]');

    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var text = element.getAttribute('data-' + language);
        element.textContent = text;
    }

    if (language === 'ua') {
        document.querySelector('.btn-lang__ua').style.display = 'none';
        document.querySelector('.btn-lang__en').style.display = 'inline-block';
    } else {
        document.querySelector('.btn-lang__ua').style.display = 'inline-block';
        document.querySelector('.btn-lang__en').style.display = 'none';
    }

    localStorage.setItem('language', language);

    if (selectedLanguage !== language) {
        location.reload();
    }
}

var selectedLanguage = localStorage.getItem('language');
if (selectedLanguage) {
    changeLanguage(selectedLanguage);
} else {
    changeLanguage('en');
}