/**
 * http://stackoverflow.com/a/10997390/11236
 */
 export function updateURLParameter(url: string, param: string, paramVal: string) {
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (var i = 0; i < tempArray.length; i++) {
            if (tempArray[i].split('=')[0] != param) {
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }

    var rows_txt = paramVal ? temp + "" + param + "=" + paramVal : '';
    return baseURL + "?" + newAdditionalURL + rows_txt;
}