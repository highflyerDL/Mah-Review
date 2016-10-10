function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

function deleteAllCookies() {
    document.cookie = "";
}

function saveItemLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

function clearLocalStorage() {
    deleteAllCookies();
    localStorage.clear();
}

function getItemLocalStorage(key){
    return localStorage.getItem(key);
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}

function saveToken(token){
    saveItemLocalStorage("token", token);
    const tokenObject = parseJwt(token);
    saveItemLocalStorage("userId", tokenObject._id);
    saveItemLocalStorage("userEmail", tokenObject.email);
    saveItemLocalStorage("userName", tokenObject.name);
    saveItemLocalStorage("userProfile", tokenObject.profile);
}

function getTokenInfo(prop){
    const token = getItemLocalStorage("token");
    if(!token){
        return "";
    }
    const tokenObject = parseJwt(token);
    const expiryDate = new Date(tokenObject.exp*1000);
    const now = new Date();
    if(expiryDate>now){
        return tokenObject[prop];
    }
    return "";
}

export {getCookie, saveToken, getItemLocalStorage, getTokenInfo, clearLocalStorage};