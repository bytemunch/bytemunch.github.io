export function updateURLParameter(url, param, paramVal) {
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var hash;
    if (additionalURL[0] == '#') {
        hash = additionalURL.split('&')[0];
        additionalURL = undefined;
    }
    var temp = "";
    if (additionalURL) {
        hash = '#' + additionalURL.split('#')[additionalURL.split('#').length - 1];
        tempArray = additionalURL.split("&");
        for (var i = 0; i < tempArray.length; i++) {
            if (tempArray[i].split('=')[0] != param) {
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }
    var rows_txt = paramVal ? temp + "" + param + "=" + paramVal + hash : '';
    return baseURL + "?" + newAdditionalURL + rows_txt;
}
//# sourceMappingURL=updateURLParameter.js.map